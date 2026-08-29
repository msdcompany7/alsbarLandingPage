import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(SCRIPT_DIR, "..");

function stripQuotes(value: string) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function parseEnvContent(content: string) {
  const entries: Array<[string, string]> = [];
  const lines = content.replace(/^\uFEFF/, "").split(/\r?\n/);

  let currentKey: string | null = null;
  let currentValue = "";
  let inQuotes = false;
  let quoteChar = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!currentKey) {
      if (!line || line.startsWith("#")) {
        continue;
      }

      const separatorIndex = line.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      currentKey = line.slice(0, separatorIndex).trim();
      const remainder = line.slice(separatorIndex + 1);

      if (
        (remainder.startsWith('"') && !remainder.endsWith('"')) ||
        (remainder.startsWith("'") && !remainder.endsWith("'"))
      ) {
        quoteChar = remainder[0]!;
        inQuotes = true;
        currentValue = remainder.slice(1);
        continue;
      }

      entries.push([currentKey, stripQuotes(remainder.trim())]);
      currentKey = null;
      continue;
    }

    if (inQuotes) {
      if (rawLine.endsWith(quoteChar)) {
        currentValue += `\n${rawLine.slice(0, -1)}`;
        entries.push([currentKey, currentValue]);
        currentKey = null;
        currentValue = "";
        inQuotes = false;
        quoteChar = "";
      } else {
        currentValue += `${currentValue ? "\n" : ""}${rawLine}`;
      }
    }
  }

  if (currentKey) {
    entries.push([currentKey, currentValue]);
  }

  return entries;
}

/**
 * Loads `.env` from the project root for standalone tsx scripts.
 * Does not override variables already present in process.env.
 */
export function loadProjectEnv() {
  const envPath = resolve(PROJECT_ROOT, ".env");

  if (!existsSync(envPath)) {
    console.warn(`[env] .env not found at ${envPath}`);
    return;
  }

  const content = readFileSync(envPath, "utf8");
  const entries = parseEnvContent(content);

  for (const [key, value] of entries) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadProjectEnv();
