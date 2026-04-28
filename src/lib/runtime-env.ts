import fs from "node:fs";
import path from "node:path";

function parseDatabaseUrlFromEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const raw = fs.readFileSync(filePath, "utf8");

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const match = trimmed.match(/^DATABASE_URL\s*=\s*(.*)\s*$/);

    if (!match) {
      continue;
    }

    let value = match[1] ?? "";

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    return value || null;
  }

  return null;
}

function ensureTempDirectory() {
  const preferredTempDir = "/tmp";
  const tempCandidates = [process.env.TMPDIR, process.env.TEMP, process.env.TMP].filter(Boolean);

  if (tempCandidates.every((candidate) => candidate?.startsWith("/mnt/"))) {
    process.env.TMPDIR = preferredTempDir;
    process.env.TEMP = preferredTempDir;
    process.env.TMP = preferredTempDir;
  }

  fs.mkdirSync(process.env.TMPDIR ?? preferredTempDir, { recursive: true });
}

function ensureDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    return;
  }

  const root = process.cwd();
  const fromEnvLocal = parseDatabaseUrlFromEnvFile(path.join(root, ".env.local"));

  if (fromEnvLocal) {
    process.env.DATABASE_URL = fromEnvLocal;
    return;
  }

  const fromEnv = parseDatabaseUrlFromEnvFile(path.join(root, ".env"));

  if (fromEnv) {
    process.env.DATABASE_URL = fromEnv;
    return;
  }

  const dbPath = path.resolve(root, "prisma/dev.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.closeSync(fs.openSync(dbPath, "a"));
  process.env.DATABASE_URL = `file:${dbPath}`;
}

ensureTempDirectory();
ensureDatabaseUrl();
