#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function parseDatabaseUrlFromEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = trimmed.match(/^DATABASE_URL\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[1] ?? "";
    // Strip optional quotes.
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    return val || null;
  }
  return null;
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
  console.error("Usage: prisma-env-runner.mjs <prisma command...>");
  process.exit(2);
}

const env = { ...process.env, DATABASE_URL: computeDatabaseUrl() };
execSync(argv.join(" "), { stdio: "inherit", env });

