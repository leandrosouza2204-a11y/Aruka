import { readFileSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const migrationPattern = /^\d{14}_reconcile_alunos_required_fields\.sql$/;
const requiredColumns = ["created_at", "user_id", "whatsapp"];
const forbiddenColumns = [
  "inicio",
  "pagamento_recebido",
  "plano",
  "status",
  "valor",
  "acompanhamento_motivo",
  "observacoes",
  "student_user_id",
];
const forbiddenTerms = [
  /\b(update|insert|delete|merge|truncate)\b/i,
  /\bcreate\s+table\b/i,
  /\bdrop\s+table\b/i,
  /\badd\s+column\b/i,
  /\bdrop\s+column\b/i,
  /\bcreate\s+policy\b/i,
  /\bdrop\s+policy\b/i,
  /\bgrant\b/i,
  /\brevoke\b/i,
  /\bcreate\s+(or\s+replace\s+)?function\b/i,
  /\bdrop\s+function\b/i,
  /\bcreate\s+index\b/i,
  /\b(add|drop)\s+constraint\b/i,
  /\bset\s+default\b/i,
  /\bdrop\s+default\b/i,
  /\btreino_eventos\b/i,
  /\btemplate_origin\b/i,
  /\bidempotency\b/i,
  /\blifecycle\b/i,
];

export function validateConstraintNullabilityReconciliation(sql, options = {}) {
  const findings = [];
  const stripped = stripComments(sql);
  const raw = String(sql);
  const statements = splitStatements(stripped);

  if (!statements.length) findings.push("migration is empty");
  for (const statement of statements) {
    if (/^(begin|commit)$/i.test(statement)) continue;
    if (!/^alter\s+table\s+public\.alunos\b/i.test(statement)) {
      findings.push(`statement outside public.alunos alter scope: ${statement.slice(0, 100)}`);
    }
  }

  for (const [pattern, label] of forbiddenTerms.map((pattern) => [pattern, pattern.source])) {
    if (pattern.test(raw)) findings.push(`forbidden SQL found: ${label}`);
  }

  const operations = parseAlterColumnOperations(stripped);
  const setNotNull = operations.filter((operation) => operation.action === "set not null");
  const extraOps = operations.filter(
    (operation) => !(requiredColumns.includes(operation.column) && operation.action === "set not null")
  );
  if (extraOps.length) findings.push(`unexpected alter column operations: ${extraOps.map((op) => `${op.column} ${op.action}`).join(", ")}`);

  const actualColumns = setNotNull.map((operation) => operation.column).sort();
  const expectedColumns = [...requiredColumns].sort();
  if (actualColumns.join("|") !== expectedColumns.join("|")) {
    findings.push(`expected exactly SET NOT NULL for ${expectedColumns.join(", ")}; got ${actualColumns.join(", ") || "none"}`);
  }

  for (const column of forbiddenColumns) {
    if (new RegExp(`\\b${column}\\b`, "i").test(raw)) findings.push(`forbidden column referenced in migration SQL: ${column}`);
  }

  if (options.migrationName) findings.push(...validateTimestamp(options.migrationName));
  return findings;
}

export function findPhase2Migration(migrations) {
  return migrations.filter((name) => migrationPattern.test(basename(name))).sort();
}

export function parseAlterColumnOperations(sql) {
  const operations = [];
  const withoutTransaction = stripComments(sql).replace(/\b(begin|commit)\s*;?/gi, "");
  const statements = splitStatements(withoutTransaction);
  for (const statement of statements) {
    const alterMatch = statement.match(/^alter\s+table\s+public\.alunos\s+([\s\S]+)$/i);
    if (!alterMatch) continue;
    const clauses = splitClauses(alterMatch[1]);
    for (const clause of clauses) {
      const match = clause.match(/^alter\s+column\s+([a-z_][a-z0-9_]*)\s+(set\s+not\s+null|drop\s+not\s+null|set\s+default|drop\s+default)\b/i);
      if (!match) {
        operations.push({ column: "<unparsed>", action: clause.trim().toLowerCase() });
        continue;
      }
      operations.push({ column: match[1].toLowerCase(), action: match[2].toLowerCase().replace(/\s+/g, " ") });
    }
  }
  return operations;
}

function validateTimestamp(name) {
  const timestamp = name.match(/^(\d{14})_/)?.[1] || "";
  if (!timestamp) return ["migration timestamp missing"];
  if (timestamp <= "20260731190000") return ["migration timestamp must be after 20260731190000"];
  return [];
}

function splitClauses(text) {
  const clauses = [];
  let depth = 0;
  let current = "";
  for (const ch of text) {
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (ch === "," && depth === 0) {
      clauses.push(current.trim());
      current = "";
    } else current += ch;
  }
  if (current.trim()) clauses.push(current.trim());
  return clauses;
}

function stripComments(sql) {
  return sql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

function splitStatements(sql) {
  return sql.split(";").map((statement) => statement.trim()).filter(Boolean);
}

export async function main() {
  const migrations = readdirSync(join(root, "supabase/migrations"));
  const matches = findPhase2Migration(migrations);
  const findings = [];
  if (matches.length !== 1) findings.push(`expected exactly one phase 2 alunos required fields migration, found ${matches.length}`);
  if (matches.length) {
    const migrationName = matches[0];
    const sql = readFileSync(join(root, "supabase/migrations", migrationName), "utf8");
    findings.push(...validateConstraintNullabilityReconciliation(sql, { migrationName }));
  }
  if (findings.length) {
    console.error(`SUPABASE_CONSTRAINT_NULLABILITY_RECONCILIATION_INVALID ${JSON.stringify(findings, null, 2)}`);
    process.exit(1);
  }
  console.log("SUPABASE_CONSTRAINT_NULLABILITY_RECONCILIATION_VALIDATED PHASE2_ALUNOS_REQUIRED_FIELDS_ONLY");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
