import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const baselineDir = "supabase/baseline-src";
const expectedFiles = [
  "README.md",
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

const businessTables = [
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

const errors = [];

function fail(message) {
  errors.push(message);
}

function read(path) {
  return readFileSync(path, "utf8");
}

if (!existsSync(baselineDir)) {
  fail(`Missing ${baselineDir}`);
} else {
  const actual = readdirSync(baselineDir).sort();
  for (const file of expectedFiles) {
    const path = join(baselineDir, file);
    if (!existsSync(path)) {
      fail(`Missing baseline-src file: ${file}`);
      continue;
    }
    if (statSync(path).size === 0) {
      fail(`Empty baseline-src file: ${file}`);
    }
  }

  const expectedSqlOrder = expectedFiles.filter((file) => file.endsWith(".sql"));
  const actualSqlOrder = actual.filter((file) => file.endsWith(".sql"));
  if (actualSqlOrder.join("|") !== expectedSqlOrder.join("|")) {
    fail(`Unexpected SQL order. Expected ${expectedSqlOrder.join(", ")}, got ${actualSqlOrder.join(", ")}`);
  }
}

const baselineSql = expectedFiles
  .filter((file) => file.endsWith(".sql") && existsSync(join(baselineDir, file)))
  .map((file) => read(join(baselineDir, file)))
  .join("\n");

if (/\bCOPY\b/i.test(baselineSql)) {
  fail("COPY is not allowed in baseline-src");
}

const sqlOutsideDollarBodies = baselineSql.replace(/\$\$[\s\S]*?\$\$/g, "");
const insertMatches = [...sqlOutsideDollarBodies.matchAll(/\binsert\s+into\s+([a-z0-9_."']+)/gi)];
for (const match of insertMatches) {
  const target = match[1].replaceAll('"', "").toLowerCase();
  if (target !== "storage.buckets") {
    fail(`Unexpected INSERT target in baseline-src: ${match[1]}`);
  }
}

const forbiddenPatterns = [
  { name: "HML project ref", pattern: /xrmqdkpxnfvusmenadnf/i },
  { name: "Supabase hosted URL", pattern: /supabase\.co/i },
  { name: "JWT-like token", pattern: /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/ },
  { name: "service role key literal", pattern: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*['"][^'"]+['"]/i },
  { name: "password assignment", pattern: /\b(password|passwd|secret|token)\s*=\s*['"][^'"]{8,}['"]/i },
];

for (const { name, pattern } of forbiddenPatterns) {
  if (pattern.test(baselineSql)) {
    fail(`Forbidden sensitive pattern found: ${name}`);
  }
}

for (const table of businessTables) {
  const rlsPattern = new RegExp(`alter\\s+table\\s+public\\.${table}\\s+enable\\s+row\\s+level\\s+security`, "i");
  if (!rlsPattern.test(baselineSql)) {
    fail(`Missing RLS enable statement for public.${table}`);
  }
}

const functionBlocks = [...baselineSql.matchAll(/create\s+or\s+replace\s+function\s+([\s\S]*?)(?=\ncreate\s+or\s+replace\s+function|\ncreate\s+or\s+replace\s+trigger|\ncreate\s+policy|\nrevoke\s+|\ngrant\s+|$)/gi)];
for (const blockMatch of functionBlocks) {
  const block = blockMatch[0];
  if (/security\s+definer/i.test(block) && !/set\s+search_path\s*=/i.test(block)) {
    const signature = block.split("\n")[0].trim();
    fail(`SECURITY DEFINER without explicit search_path: ${signature}`);
  }
}

if (/grant\s+execute\s+on\s+function[\s\S]*?\s+to\s+public\b/i.test(baselineSql)) {
  fail("GRANT EXECUTE TO public is not allowed in baseline-src");
}

const createPatterns = [
  /create\s+table\s+if\s+not\s+exists\s+public\.([a-z0-9_]+)/gi,
  /create\s+or\s+replace\s+function\s+public\.([a-z0-9_]+\s*\([^)]*\))/gi,
  /create\s+policy\s+"?([^"\n]+)"?\s+on\s+public\.([a-z0-9_]+)/gi,
];

for (const pattern of createPatterns) {
  const seen = new Set();
  for (const match of baselineSql.matchAll(pattern)) {
    const key = match.slice(1).join("::").replace(/\s+/g, " ").toLowerCase();
    if (seen.has(key)) {
      fail(`Duplicate obvious definition in baseline-src: ${key}`);
    }
    seen.add(key);
  }
}

const migrationsDir = "supabase/migrations";
if (existsSync(migrationsDir)) {
  const prefixes = new Map();
  for (const file of readdirSync(migrationsDir).filter((file) => file.endsWith(".sql"))) {
    const match = file.match(/^(\d{14})_[a-z0-9_]+\.sql$/);
    if (!match) {
      fail(`Migration does not follow YYYYMMDDHHMMSS_descricao.sql: ${file}`);
      continue;
    }
    const prefix = match[1];
    if (prefixes.has(prefix)) {
      fail(`Duplicate migration timestamp ${prefix}: ${prefixes.get(prefix)} and ${file}`);
    }
    prefixes.set(prefix, file);
  }
}

if (errors.length > 0) {
  console.error("Supabase baseline-src validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("Supabase baseline-src validation passed.");
