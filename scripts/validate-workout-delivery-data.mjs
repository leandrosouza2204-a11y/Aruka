import { readFileSync } from "node:fs";

const files = {
  migration: "supabase/migrations/20260728030000_workout_delivery_integration_v1.sql",
  tables: "supabase/baseline-src/02-tables.sql",
  constraints: "supabase/baseline-src/03-constraints.sql",
  indexes: "supabase/baseline-src/04-indexes.sql",
  functions: "supabase/baseline-src/05-functions.sql",
  policies: "supabase/baseline-src/08-policies.sql",
};

const sql = Object.fromEntries(Object.entries(files).map(([key, path]) => [key, readFileSync(path, "utf8")]));
const allSql = Object.values(sql).join("\n");
const migrationStatements = sqlStatements(sql.migration);
const policyStatements = sqlStatements(sql.policies);
const eventGrantStatements = [...migrationStatements, ...policyStatements]
  .filter((statement) => /\b(?:grant|revoke)\b[\s\S]*\bpublic\.treino_eventos\b/i.test(statement))
  .join("\n");
const checks = [];

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

for (const column of [
  "lifecycle_status",
  "template_origin_id",
  "template_origin_type",
  "template_origin_name",
  "template_origin_snapshot",
  "applied_by",
  "applied_at",
  "delivered_by",
  "delivered_at",
  "completed_at",
  "archived_at",
  "data_fim",
  "application_idempotency_key",
]) {
  add(`treinos column ${column}`, sql.migration.includes(column) && sql.tables.includes(column));
}

add("backfill before lifecycle check", sql.migration.indexOf("update public.treinos") < sql.migration.indexOf("treinos_lifecycle_status_check"));
add("lifecycle check values", /treinos_lifecycle_status_check[\s\S]*draft[\s\S]*active[\s\S]*completed[\s\S]*archived/.test(allSql));
add("template origin check values", /treinos_template_origin_type_check[\s\S]*official[\s\S]*personal/.test(allSql));
add("idempotency unique partial index", /unique index[\s\S]*treinos_user_application_idempotency_uidx[\s\S]*where application_idempotency_key is not null/i.test(allSql));
add("no one-active-workout unique index", !allSql
  .split(/\r?\n/)
  .some((line) => /unique index/i.test(line) && /lifecycle_status/i.test(line) && /active/i.test(line)));
add("treino_eventos table", /create table if not exists public\.treino_eventos/.test(sql.migration) && /create table if not exists public\.treino_eventos/.test(sql.tables));
add("treino_eventos event types", /applied[\s\S]*delivered[\s\S]*status_changed[\s\S]*completed[\s\S]*archived/.test(allSql));
add("treino_eventos RLS enabled", /alter table public\.treino_eventos enable row level security/.test(allSql));
add("treino_eventos select grant consistent", hasStatement(migrationStatements, /^grant\s+select\s+on\s+table\s+public\.treino_eventos\s+to\s+authenticated$/i) && hasStatement(policyStatements, /^grant\s+select\s+on\s+table\s+public\.treino_eventos\s+to\s+authenticated$/i));
add("treino_eventos revokes authenticated non-select access", hasStatement(migrationStatements, /^revoke\s+all\s+on\s+table\s+public\.treino_eventos\s+from\s+authenticated$/i) && hasStatement(policyStatements, /^revoke\s+all\s+on\s+table\s+public\.treino_eventos\s+from\s+authenticated$/i));
add("treino_eventos no direct write grants", !/\bgrant\s+(?:all|insert|update|delete|truncate|references|trigger)\b[\s\S]*\bpublic\.treino_eventos\b[\s\S]*\bto\s+authenticated\b/i.test(eventGrantStatements));
add("salvar_treino_composto evolved", sql.functions.includes("application_idempotency_key") && sql.functions.includes("template_origin_type"));
add("entregar_treino created", /create or replace function public\.entregar_treino/.test(allSql));
add("alterar_estado_treino created", /create or replace function public\.alterar_estado_treino/.test(allSql));
add("applied_by uses auth uid", /applied_by[\s\S]*v_user_id/.test(sql.functions));
add("delivered_by uses auth uid", /delivered_by[\s\S]*v_user_id/.test(sql.functions));
add("idempotency checked in database", /application_idempotency_key = v_application_idempotency_key/.test(sql.functions));
add("applied event inserted once after create", /event_type[\s\S]*'applied'/.test(sql.functions) && /idempotent/.test(sql.functions));

for (const forbidden of [
  "alter table public.alunos",
  "alter table public.pagamentos",
  "alter table public.planos",
  "alter table public.acompanhamento_eventos",
]) {
  add(`no financial alteration ${forbidden}`, !sql.migration.toLowerCase().includes(forbidden));
}

const failed = checks.filter((check) => !check.passed);
for (const check of checks) console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
if (failed.length) process.exitCode = 1;

function sqlStatements(source) {
  return source
    .replace(/--.*$/gm, "")
    .split(";")
    .map((statement) => statement.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function hasStatement(statements, pattern) {
  return statements.some((statement) => pattern.test(statement));
}
