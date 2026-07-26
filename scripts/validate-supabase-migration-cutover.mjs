import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const errors = [];
const baseline = "20260716090000_baseline_aruka_v1.sql";
const expectedSha = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B";

function fail(message) {
  errors.push(message);
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();
}

function sha256CanonicalText(path) {
  let bytes = readFileSync(path);
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    bytes = bytes.subarray(3);
  }
  const text = bytes.toString("utf8").replace(/\r\n?/g, "\n");
  return createHash("sha256").update(Buffer.from(text, "utf8")).digest("hex").toUpperCase();
}

function sqlFiles(dir) {
  return existsSync(dir) ? readdirSync(dir).filter((file) => file.endsWith(".sql")).sort() : [];
}

function read(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const migrationsDir = "supabase/migrations";
const archiveDir = "supabase/migrations-archive";
const operationsDir = "supabase/operations";
const manifestPath = join(migrationsDir, "cutover-manifest.json");
const baselinePath = join(migrationsDir, baseline);
const candidatePath = join("supabase/baseline-candidate", baseline);

if (!existsSync(baselinePath)) fail(`Missing active baseline: ${baselinePath}`);
if (!existsSync(candidatePath)) fail(`Missing candidate baseline: ${candidatePath}`);
if (!existsSync(join(archiveDir, "README.md"))) fail("Missing migrations-archive README");
if (!existsSync(join(operationsDir, "README.md"))) fail("Missing operations README");
if (!existsSync(manifestPath)) fail("Missing cutover manifest");

if (existsSync(baselinePath) && sha256CanonicalText(baselinePath) !== expectedSha) fail("Active baseline SHA does not match expected SHA");
if (existsSync(candidatePath) && existsSync(baselinePath) && sha256CanonicalText(candidatePath) !== sha256CanonicalText(baselinePath)) {
  fail("Active baseline is not canonically equivalent to candidate baseline");
}

let manifest = null;
try {
  manifest = JSON.parse(read(manifestPath));
} catch (error) {
  fail(`Invalid cutover manifest JSON: ${error.message}`);
}

const activeSql = sqlFiles(migrationsDir);
const archivedSql = sqlFiles(archiveDir);
const operationalSql = sqlFiles(operationsDir);

if (!activeSql.includes(baseline)) fail("Active migrations folder does not contain the baseline");
for (const file of activeSql) {
  const timestamp = file.slice(0, 14);
  if (!/^\d{14}$/.test(timestamp)) fail(`Active migration timestamp is invalid: ${file}`);
  if (timestamp < "20260716090000") fail(`Pre-cutover migration remains active: ${file}`);
}

const timestamps = new Map();
for (const file of activeSql) {
  const ts = file.slice(0, 14);
  timestamps.set(ts, (timestamps.get(ts) || 0) + 1);
}
for (const [ts, count] of timestamps) {
  if (count > 1) fail(`Duplicate active timestamp: ${ts}`);
}

if (activeSql.length > 0 && activeSql[0] !== baseline) fail("Baseline is not the first active migration");

if (manifest) {
  if (manifest.baseline_file !== baseline) fail("Manifest baseline_file mismatch");
  if (manifest.baseline_sha256 !== expectedSha) fail("Manifest baseline_sha256 mismatch");
  for (const file of manifest.archived_migrations || []) {
    if (!archivedSql.includes(file)) fail(`Manifest archived migration missing from archive: ${file}`);
    if (activeSql.includes(file)) fail(`Archived migration remains active: ${file}`);
  }
  for (const file of manifest.active_migrations || []) {
    if (!activeSql.includes(file)) fail(`Manifest active migration missing from active folder: ${file}`);
  }
  for (const file of manifest.operational_files || []) {
    if (!operationalSql.includes(file)) fail(`Manifest operational file missing: ${file}`);
  }
}

const forbidden = [
  ["Project Ref", /xrmqdkpxnfvusmenadnf/i],
  ["supabase hosted URL", /\.supabase\.co/i],
  ["secret", /sb_secret_|SERVICE_ROLE_KEY\s*=|ANON_KEY\s*=|SECRET_KEY\s*=|eyJ[A-Za-z0-9_-]{20,}\./i],
  ["COPY", /\bCOPY\b/i],
  ["schema_migrations", /schema_migrations/i],
];

for (const file of activeSql) {
  const text = read(join(migrationsDir, file));
  for (const [label, pattern] of forbidden) {
    if (pattern.test(text)) fail(`Forbidden ${label} in active migration ${file}`);
  }
}

const baselineText = read(baselinePath);
const baselineTables = new Set([...baselineText.matchAll(/create\s+table\s+if\s+not\s+exists\s+public\.([a-z0-9_]+)/gi)].map((m) => m[1]));
const baselinePolicies = new Set([...baselineText.matchAll(/create\s+policy\s+"?([^"\n]+)"?\s+on\s+public\.([a-z0-9_]+)/gi)].map((m) => `${m[2]}.${m[1]}`));
const baselineFunctions = new Set([...baselineText.matchAll(/create\s+or\s+replace\s+function\s+public\.([a-z0-9_]+)\s*\(/gi)].map((m) => m[1]));

for (const file of activeSql.filter((item) => item !== baseline)) {
  const text = read(join(migrationsDir, file));
  for (const match of text.matchAll(/create\s+table\s+if\s+not\s+exists\s+public\.([a-z0-9_]+)/gi)) {
    if (baselineTables.has(match[1])) fail(`Post-cutover migration duplicates baseline table ${match[1]} in ${file}`);
  }
  for (const match of text.matchAll(/create\s+policy\s+"?([^"\n]+)"?\s+on\s+public\.([a-z0-9_]+)/gi)) {
    if (baselinePolicies.has(`${match[2]}.${match[1]}`)) fail(`Post-cutover migration duplicates baseline policy ${match[2]}.${match[1]} in ${file}`);
  }
  for (const match of text.matchAll(/create\s+or\s+replace\s+function\s+public\.([a-z0-9_]+)\s*\(/gi)) {
    if (baselineFunctions.has(match[1])) fail(`Post-cutover migration duplicates baseline function ${match[1]} in ${file}`);
  }
}

for (const file of archivedSql) {
  if (statSync(join(archiveDir, file)).size === 0) fail(`Archived migration is empty: ${file}`);
}

if (errors.length > 0) {
  console.error("Supabase migration cutover validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Supabase migration cutover validation passed.");
