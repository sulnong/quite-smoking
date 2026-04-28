#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function parseDatabaseUrlFromEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = trimmed.match(/^DATABASE_URL\s*=\s*(.*)\s*$/);

    if (!match) continue;

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

function computeTempDir() {
  const candidates = [process.env.TMPDIR, process.env.TEMP, process.env.TMP].filter(Boolean);

  if (candidates.length > 0 && candidates.every((candidate) => candidate.startsWith("/mnt/"))) {
    return "/tmp";
  }

  return process.env.TMPDIR || process.env.TEMP || process.env.TMP || "/tmp";
}

function computeDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const root = process.cwd();
  const fromEnvLocal = parseDatabaseUrlFromEnvFile(path.join(root, ".env.local"));
  if (fromEnvLocal) return fromEnvLocal;

  const fromEnv = parseDatabaseUrlFromEnvFile(path.join(root, ".env"));
  if (fromEnv) return fromEnv;

  const dbPath = path.resolve(root, "prisma/dev.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.closeSync(fs.openSync(dbPath, "a"));
  return `file:${dbPath}`;
}

const [, , ...argv] = process.argv;

if (argv.length === 0) {
  console.error("Usage: runtime-env-runner.mjs <command...>");
  process.exit(2);
}

const tempDir = computeTempDir();
fs.mkdirSync(tempDir, { recursive: true });

const env = {
  ...process.env,
  DATABASE_URL: computeDatabaseUrl(),
  TMPDIR: tempDir,
  TEMP: tempDir,
  TMP: tempDir
};

const [command, ...commandArgs] = argv;
const result = spawnSync(command, commandArgs, { stdio: "inherit", env });

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
