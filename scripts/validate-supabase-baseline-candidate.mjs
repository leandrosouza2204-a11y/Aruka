import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dir = process.env.BASELINE_CANDIDATE_DIR || "supabase/baseline-candidate";
const errors = [];
const warn = [];

function fail(message) {
  errors.push(message);
}

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex").toUpperCase();
}

function count(pattern, text) {
  return [...text.matchAll(pattern)].length;
}

if (!existsSync(dir)) {
  fail(`Missing ${dir}`);
}

const files = existsSync(dir) ? readdirSync(dir) : [];
const sqlFiles = files.filter((file) => file.endsWith(".sql"));
if (sqlFiles.length !== 1) {
  fail(`Expected exactly one candidate SQL file, found ${sqlFiles.length}`);
}

const sqlFile = sqlFiles[0] || "";
if (sqlFile && !/^\d{14}_baseline_aruka_v1\.sql$/.test(sqlFile)) {
  fail(`Candidate SQL name must match YYYYMMDDHHMMSS_baseline_aruka_v1.sql: ${sqlFile}`);
}

const sqlPath = join(dir, sqlFile);
const manifestPath = join(dir, "manifest.json");
const readmePath = join(dir, "README.md");

if (!existsSync(manifestPath)) fail("Missing manifest.json");
if (!existsSync(readmePath)) fail("Missing README.md");
if (existsSync(sqlPath) && statSync(sqlPath).size === 0) fail("Candidate SQL is empty");

let manifest = null;
if (existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch (error) {
    fail(`Invalid manifest JSON: ${error.message}`);
  }
}

const sql = existsSync(sqlPath) ? readFileSync(sqlPath, "utf8") : "";

const forbidden = [
  { label: "COPY", pattern: /\bCOPY\b/i },
  { label: "known project ref", pattern: /xrmqdkpxnfvusmenadnf/i },
  { label: "supabase hosted URL", pattern: /\.supabase\.co/i },
  { label: "JWT-like token", pattern: /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/ },
  { label: "service role key assignment", pattern: /SUPABASE_SERVICE_ROLE_KEY\s*=/i },
  { label: "schema_migrations", pattern: /schema_migrations/i },
  { label: "remote db push", pattern: /supabase\s+db\s+push/i },
  { label: "migration repair", pattern: /migration\s+repair/i },
  { label: "edge function deploy", pattern: /functions\s+deploy/i },
];

for (const item of forbidden) {
  if (item.pattern.test(sql)) fail(`Forbidden content found: ${item.label}`);
}

const suspiciousPersonalData = [
  /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  /\+55\s?\(?\d{2}\)?\s?\d{4,5}-?\d{4}/,
];
for (const pattern of suspiciousPersonalData) {
  if (pattern.test(sql)) fail("Potential personal data found in candidate SQL");
}

const outsideBodies = sql.replace(/\$\$[\s\S]*?\$\$/g, "");
for (const match of outsideBodies.matchAll(/\binsert\s+into\s+([a-z0-9_."']+)/gi)) {
  const target = match[1].replaceAll('"', "").toLowerCase();
  if (target !== "storage.buckets") fail(`Unexpected top-level INSERT target: ${match[1]}`);
}

const duplicateChecks = [
  { label: "CREATE TABLE", pattern: /create\s+table\s+if\s+not\s+exists\s+public\.([a-z0-9_]+)/gi },
  { label: "CREATE TRIGGER", pattern: /create\s+or\s+replace\s+trigger\s+([a-z0-9_]+)/gi },
  { label: "CREATE POLICY", pattern: /create\s+policy\s+"?([^"\n]+)"?\s+on\s+public\.([a-z0-9_]+)/gi },
];
for (const check of duplicateChecks) {
  const seen = new Set();
  for (const match of sql.matchAll(check.pattern)) {
    const key = match.slice(1).join("::").toLowerCase();
    if (seen.has(key)) fail(`Duplicate ${check.label}: ${key}`);
    seen.add(key);
  }
}

const tables = [
  "perfis",
  "alunos",
  "planos",
  "assinaturas",
  "pagamentos",
  "admin_logs",
  "aceites_legais",
  "avaliacoes",
  "anamneses",
  "treinos",
  "treino_dias",
  "treino_exercicios",
  "acompanhamento_eventos",
  "workout_templates",
  "aoe_decisions",
  "aoe_decision_traces",
  "aoe_human_reviews",
  "aoe_idempotency_keys",
  "aoe_audit_events",
];
for (const table of tables) {
  if (!new RegExp(`alter\\s+table\\s+public\\.${table}\\s+enable\\s+row\\s+level\\s+security`, "i").test(sql)) {
    fail(`Missing RLS enable for public.${table}`);
  }
}

const functionBlocks = [...sql.matchAll(/create\s+or\s+replace\s+function\s+([\s\S]*?)(?=\ncreate\s+or\s+replace\s+function|\n-- Source: supabase\/baseline-src\/06-triggers\.sql|$)/gi)];
for (const blockMatch of functionBlocks) {
  const block = blockMatch[0];
  if (/security\s+definer/i.test(block) && !/set\s+search_path\s*=/i.test(block)) {
    fail(`SECURITY DEFINER without search_path: ${block.split("\n")[0].trim()}`);
  }
}

if (/grant\s+execute\s+on\s+function[\s\S]*?\s+to\s+public\b/i.test(sql)) {
  fail("GRANT EXECUTE TO public is not allowed");
}

const sections = [
  "01-extensions.sql",
  "02-tables.sql",
  "03-constraints.sql",
  "04-indexes.sql",
  "05-functions.sql",
  "06-triggers.sql",
  "07-rls.sql",
  "08-policies.sql",
  "09-grants.sql",
  "10-storage.sql",
];
let lastIndex = -1;
for (const section of sections) {
  const index = sql.indexOf(`Source: supabase/baseline-src/${section}`);
  if (index < 0) fail(`Missing section marker for ${section}`);
  if (index < lastIndex) fail(`Section order is invalid near ${section}`);
  lastIndex = index;
}

if (manifest) {
  if (manifest.main_file !== sqlFile) fail("manifest.main_file does not match candidate SQL file");
  if (manifest.sha256 !== sha256(sqlPath)) fail("manifest.sha256 does not match candidate SQL");
  if (manifest.reference_dump_sha256 !== sha256("reports/hml-baseline/production-public-schema.sql")) {
    fail("manifest.reference_dump_sha256 does not match dump");
  }
  const actual = {
    expected_tables: count(/create\s+table\s+if\s+not\s+exists\s+public\./gi, sql),
    expected_functions: count(/create\s+or\s+replace\s+function\s+public\./gi, sql),
    expected_triggers: count(/create\s+or\s+replace\s+trigger\s+/gi, sql),
    expected_policies: count(/create\s+policy\s+/gi, sql),
    expected_indexes: count(/create\s+(?:unique\s+)?index\s+if\s+not\s+exists\s+/gi, sql),
  };
  for (const [field, actualCount] of Object.entries(actual)) {
    if (manifest[field] !== actualCount) {
      fail(`manifest.${field}=${manifest[field]} but actual is ${actualCount}`);
    }
  }
}

if (!/insert\s+into\s+storage\.buckets/i.test(sql)) warn.push("storage bucket insert not found");

if (errors.length > 0) {
  console.error("Supabase baseline candidate validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

for (const message of warn) console.warn(`Warning: ${message}`);
console.log("Supabase baseline candidate validation passed.");
