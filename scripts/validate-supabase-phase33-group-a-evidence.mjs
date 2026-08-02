import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

export const TARGET_FUNCTION = "set_workout_templates_updated_at";
export const TARGET_SIGNATURE = "public.set_workout_templates_updated_at()";
export const EXPECTED_CSV_DIRECTORY = "reports/supabase-production-sync/remote-phase33-input/";

const forbiddenSql = /\b(insert|update|delete|merge|create|alter|drop|truncate|grant|revoke|do|call|vacuum|analyze|refresh)\b|\bcopy\s+from\b|\bcomment\s+on\b|\bsecurity\s+label\b|\bset\s+role\b|\breset\s+role\b/i;
const forbiddenNames = [
  "aoe_idempotency_get_or_create",
  "admin_eh_admin",
  "admin_validar_acesso",
  "admin_registrar_log",
  "salvar_treino_composto",
  "vincular_aluno_usuario",
  "desvincular_aluno_usuario",
  "get_my_student_workouts"
];

export function stripCommentsAndStrings(sql) {
  return sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/'([^']|'')*'/g, "''")
    .replace(/"([^"]|"")*"/g, "\"\"");
}

export function validateTargetFunction(text) {
  const executable = stripCommentsAndStrings(text);
  if (!text.includes(TARGET_FUNCTION)) throw new Error("PHASE33_TARGET_FUNCTION_MISSING");
  for (const name of forbiddenNames) {
    if (executable.includes(name)) throw new Error(`PHASE33_OUT_OF_SCOPE_FUNCTION:${name}`);
  }
}

export function validateReadonlySql(sql) {
  const executable = stripCommentsAndStrings(sql);
  if (forbiddenSql.test(executable)) throw new Error("PHASE33_READONLY_SQL_FORBIDDEN_STATEMENT");
  const executableWords = executable.replace(/[^\w\s]/g, " ").trim();
  if (!/\bselect\b/i.test(executableWords)) throw new Error("PHASE33_READONLY_SQL_SELECT_MISSING");
}

export function validateSqlCoverage(sql) {
  const lower = sql.toLowerCase();
  const required = [
    ["pg_get_functiondef", "PHASE33_FUNCTION_DEFINITION_QUERY_MISSING"],
    ["pg_get_function_identity_arguments", "PHASE33_SIGNATURE_FILTER_MISSING"],
    ["pg_trigger", "PHASE33_TRIGGER_QUERY_MISSING"],
    ["pg_get_triggerdef", "PHASE33_TRIGGER_DEFINITION_MISSING"],
    ["aclexplode", "PHASE33_GRANTS_QUERY_MISSING"],
    ["proacl", "PHASE33_FUNCTION_ACL_MISSING"]
  ];
  for (const [needle, error] of required) {
    if (!lower.includes(needle)) throw new Error(error);
  }
}

export function validateExpectedCsvDirectory(text) {
  if (!text.includes(EXPECTED_CSV_DIRECTORY)) throw new Error("PHASE33_EXPECTED_CSV_DIRECTORY_MISSING");
}

export function validateRequest(request) {
  if (request?.target?.function_name !== TARGET_FUNCTION) throw new Error("PHASE33_REQUEST_TARGET_MISMATCH");
  if (request?.target?.identity_arguments !== "") throw new Error("PHASE33_REQUEST_SIGNATURE_MISMATCH");
  if (request?.decision !== "READY_FOR_PHASE33_EVIDENCE_COLLECTION") throw new Error("PHASE33_REQUEST_DECISION_MISMATCH");
  if (request?.supabase_change !== "NO") throw new Error("PHASE33_REQUEST_SUPABASE_CHANGE_MISMATCH");
  if (request?.migration_created !== "NO") throw new Error("PHASE33_REQUEST_MIGRATION_STATE_MISMATCH");
  validateExpectedCsvDirectory(JSON.stringify(request));
}

export function validateNoMigrationDiff(gitOutput) {
  const changed = gitOutput.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (changed.length) throw new Error(`PHASE33_MIGRATION_DIFF_NOT_ALLOWED:${changed.join(",")}`);
}

export function validateNoSecretLiterals(text) {
  const secretPattern = /(eyJ[a-zA-Z0-9_-]{20,}|service[_-]?role[_-]?key|supabase[_-]?service[_-]?key|sb_secret_|postgres:\/\/[^\\s]+)/i;
  if (secretPattern.test(text)) throw new Error("PHASE33_SECRET_LITERAL_DETECTED");
}

function readProjectFile(path) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

export function runValidation() {
  const files = [
    "reports/supabase-production-sync/phase33-group-a-readonly-inspection.sql",
    "reports/supabase-production-sync/phase33-group-a-evidence-request.json",
    "reports/supabase-production-sync/phase33-group-a-evidence-request.md",
    "reports/supabase-production-sync/phase33-group-a-local-analysis.json",
    "reports/supabase-production-sync/phase33-group-a-local-analysis.md",
    "reports/supabase-production-sync/phase33-group-a-local-trigger-map.json",
    "reports/supabase-production-sync/phase33-group-a-local-trigger-map.md",
    "docs/supabase-production-sync/15-group-a-function-evidence-collection.md"
  ];

  for (const file of files) {
    if (!existsSync(join(process.cwd(), file))) throw new Error(`PHASE33_REQUIRED_ARTIFACT_MISSING:${file}`);
  }

  const sql = readProjectFile(files[0]);
  validateTargetFunction(sql);
  validateReadonlySql(sql);
  validateSqlCoverage(sql);

  const allText = files.map((file) => readProjectFile(file)).join("\n");
  validateTargetFunction(allText);
  validateExpectedCsvDirectory(allText);
  validateNoSecretLiterals(allText);

  const request = JSON.parse(readProjectFile(files[1]));
  validateRequest(request);

  const localAnalysis = JSON.parse(readProjectFile(files[3]));
  if (localAnalysis.target.signature !== TARGET_SIGNATURE) throw new Error("PHASE33_LOCAL_ANALYSIS_SIGNATURE_MISMATCH");
  if (localAnalysis.local_trigger_count !== 1) throw new Error("PHASE33_LOCAL_TRIGGER_COUNT_MISMATCH");
  if (localAnalysis.local_definition.security_definer !== false) throw new Error("PHASE33_LOCAL_SECURITY_DEFINER_MISMATCH");
  if (localAnalysis.local_definition.search_path !== "public") throw new Error("PHASE33_LOCAL_SEARCH_PATH_MISSING");

  const triggerMap = JSON.parse(readProjectFile(files[5]));
  if (triggerMap.trigger_count !== 1) throw new Error("PHASE33_TRIGGER_MAP_COUNT_MISMATCH");
  if (triggerMap.triggers[0]?.table !== "workout_templates") throw new Error("PHASE33_TRIGGER_MAP_TABLE_MISMATCH");

  const migrationDiff = execFileSync("git", ["diff", "--name-only", "--", "supabase/migrations/**"], { encoding: "utf8" });
  validateNoMigrationDiff(migrationDiff);

  console.log("PHASE33_EVIDENCE_QUERY_COVERAGE=PASS");
  console.log("SUPABASE_PHASE33_GROUP_A_EVIDENCE_READY");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    runValidation();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
