import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { tmpdir } from "node:os";

const reportDir = "reports/supabase-baseline-validation";
const backupDir = join(tmpdir(), "aruka-supabase-validation-evidence-backup");
const allowedExtensions = new Set([".json", ".log", ".md", ".sql", ".txt"]);
const localOnly = new Set(["credential-scan.txt"]);
const skipDirs = new Set(["negative-tests", "tmp-local-project"]);

const counters = new Map();

function increment(label, count) {
  if (count > 0) counters.set(label, (counters.get(label) || 0) + count);
}

function listFiles(dir) {
  const rows = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) rows.push(...listFiles(path));
    else rows.push(path);
  }
  return rows;
}

function extension(path) {
  const index = path.lastIndexOf(".");
  return index >= 0 ? path.slice(index).toLowerCase() : "";
}

function replaceAll(text, label, pattern, replacement) {
  const matches = text.match(pattern);
  increment(label, matches ? matches.length : 0);
  return text.replace(pattern, replacement);
}

function sanitize(text) {
  let out = text;
  out = replaceAll(out, "postgres_url", /postgres(?:ql)?:\/\/[^:\s/"']+:([^@\s/"']+)@(?:localhost|127\.0\.0\.1|host\.docker\.internal|\[[^\]]+\]|[A-Za-z0-9_.-]+):(\d+)\/([A-Za-z0-9_.-]+)/gi, "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]");
  out = replaceAll(out, "anon_key", /("ANON_KEY"\s*:\s*")[^"]+(")/gi, '$1[REDACTED_LOCAL_ANON_KEY]$2');
  out = replaceAll(out, "service_role_key", /("SERVICE_ROLE_KEY"\s*:\s*")[^"]+(")/gi, '$1[REDACTED_LOCAL_SERVICE_ROLE_KEY]$2');
  out = replaceAll(out, "secret_key", /("SECRET_KEY"\s*:\s*")[^"]+(")/gi, '$1[REDACTED_LOCAL_SECRET_KEY]$2');
  out = replaceAll(out, "db_url", /("DB_URL"\s*:\s*")[^"]+(")/gi, '$1postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]$2');
  out = replaceAll(out, "sb_secret", /sb_secret_[A-Za-z0-9_-]+/g, "[REDACTED_LOCAL_SECRET_KEY]");
  out = replaceAll(out, "jwt", /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/g, "[REDACTED_LOCAL_JWT]");
  out = replaceAll(out, "password", /\b(password|passwd|pwd)=([^;\s]+)/gi, "$1=[REDACTED_LOCAL_PASSWORD]");
  out = replaceAll(out, "access_token", /\b(access_token|refresh_token)\b\s*[:=]\s*["']?[^"',\s]+["']?/gi, "$1=[REDACTED_LOCAL_TOKEN]");
  out = replaceAll(out, "bearer", /\bbearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED_LOCAL_TOKEN]");
  out = replaceAll(out, "api_key", /\b(api[_-]?key)\b\s*[:=]\s*["']?[A-Za-z0-9._~+/=-]{20,}["']?/gi, "$1=[REDACTED_LOCAL_TOKEN]");
  out = replaceAll(out, "project_ref", /xrmqdkpxnfvusmenadnf/g, "[REDACTED_HML_PROJECT_REF]");
  out = replaceAll(out, "supabase_host", /https?:\/\/[A-Za-z0-9.-]+\.supabase\.co(?::\d+)?[^\s"')>]*/gi, "[REDACTED_SUPABASE_HOST]");
  return out;
}

if (!existsSync(reportDir)) {
  console.error(`Missing ${reportDir}`);
  process.exit(1);
}

mkdirSync(backupDir, { recursive: true });

const processed = [];
const skipped = [];
for (const file of listFiles(reportDir)) {
  const name = relative(reportDir, file).replaceAll("\\", "/");
  if (localOnly.has(name)) {
    skipped.push({ file: name, reason: "LOCAL_ONLY" });
    continue;
  }
  if (!allowedExtensions.has(extension(file))) {
    skipped.push({ file: name, reason: "NON_TEXT_EXTENSION" });
    continue;
  }
  const before = readFileSync(file, "utf8");
  const after = sanitize(before);
  copyFileSync(file, join(backupDir, name.replaceAll("/", "__")));
  if (before !== after) writeFileSync(file, after);
  processed.push({ file: name, changed: before !== after, bytes: statSync(file).size });
}

const report = {
  backup_dir: "[OS_TEMP]/aruka-supabase-validation-evidence-backup",
  processed,
  skipped,
  replacements: Object.fromEntries([...counters.entries()].sort(([a], [b]) => a.localeCompare(b))),
};

writeFileSync(join(reportDir, "sanitization-summary.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Sanitized ${processed.length} evidence files. Summary: ${join(reportDir, "sanitization-summary.json")}`);
