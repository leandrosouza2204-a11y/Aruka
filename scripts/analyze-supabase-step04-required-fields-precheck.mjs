import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const EXPECTED_HASH = "20A545B036CAD34D74548AE1BF15FA1EE96FBD5C40205F98C8275EB71EEA42D7";
const REQUIRED_COLUMNS = [
  "public.alunos.created_at",
  "public.alunos.user_id",
  "public.alunos.whatsapp"
];

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/step04-required-fields-precheck-result.json`,
    `${BASE}/step04-required-fields-precheck-summary.md`,
    "docs/supabase-production-sync/34-step04-required-fields-precheck.md"
  ];
  const patterns = [
    /postgres(?:ql)?:\/\//i,
    new RegExp("sb_" + "secret_", "i"),
    /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
    /\bpassword\b/i,
    /vriz[a-z0-9]+vdik/i
  ];
  for (const file of files) {
    const fullPath = join(root, file);
    if (!existsSync(fullPath)) continue;
    const text = readFileSync(fullPath, "utf8");
    for (const pattern of patterns) must(!pattern.test(text), `SECRET_SCAN_FAILED:${file}`);
  }
}

function validateCommon(result) {
  must(result.project === "aruka", "PROJECT_INVALID");
  must(result.project_ref_masked === "vriz...vdik", "PROJECT_REF_NOT_MASKED");
  must(Array.isArray(result.required_columns), "REQUIRED_COLUMNS_INVALID");
  must(JSON.stringify(result.required_columns) === JSON.stringify(REQUIRED_COLUMNS), "REQUIRED_COLUMNS_CHANGED");
  must(result.apply_sql_hash === EXPECTED_HASH, "APPLY_HASH_INVALID");
  must(result.apply_sql_traceable === true, "APPLY_NOT_TRACEABLE");
  must(result.untraceable_statement_count === 0, "UNTRACEABLE_SQL");
  must(result.apply_sql_unchanged === true, "APPLY_SQL_CHANGED");
  must(result.precheck_read_only === true, "PRECHECK_NOT_READ_ONLY");
  must(result.recovery_available === true, "RECOVERY_NOT_AVAILABLE");
  must(result.postcheck_available === true, "POSTCHECK_NOT_AVAILABLE");
  must(result.runtime_requirement === "REQUIRED_FIELDS_POSTCHECK_SUFFICIENT", "RUNTIME_REQUIREMENT_INVALID");
  must(result.step04_apply_authorized === false, "APPLY_AUTHORIZED");
  must(result.step04_apply_executed === false, "APPLY_EXECUTED");
}

export function validateStep04RequiredFieldsPrecheck(root = ROOT) {
  const result = readJson(root, `${BASE}/step04-required-fields-precheck-result.json`);

  must(["GO_FOR_STEP04_APPLY_AUTHORIZATION", "NO_GO_STEP04", "AWAITING_SECURE_STEP04_PRECHECK_EXECUTION"].includes(result.decision), "DECISION_INVALID");
  validateCommon(result);

  if (result.decision === "GO_FOR_STEP04_APPLY_AUTHORIZATION") {
    must(result.project_verified === true, "GO_PROJECT_NOT_VERIFIED");
    must(result.precheck_exit_code === 0, "GO_PRECHECK_EXIT_INVALID");
    must(result.required_fields_data_gate === "PASS", "GO_DATA_GATE_NOT_PASS");
    must(result.total_null_count === 0, "GO_NULL_COUNT_NOT_ZERO");
    must(result.blocking_drift_count === 0, "GO_BLOCKING_DRIFT");
    must(result.next_action === "USER_EXPLICIT_STEP04_APPLY_AUTHORIZATION", "GO_NEXT_ACTION_INVALID");
  } else if (result.decision === "NO_GO_STEP04") {
    must(Array.isArray(result.blockers) && result.blockers.length > 0, "NO_GO_BLOCKERS_MISSING");
    must(result.next_action === "FIX_ONLY_STEP04_DATA_OR_SCHEMA_BLOCKER", "NO_GO_NEXT_ACTION_INVALID");
  } else {
    must(result.precheck_exit_code === null, "AWAITING_EXIT_CODE_SHOULD_BE_NULL");
    must(result.production_executed === false, "AWAITING_PRODUCTION_EXECUTED");
    must(result.next_action === "USER_EXECUTE_STEP04_PRECHECK_RUNNER", "AWAITING_NEXT_ACTION_INVALID");
  }

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep04RequiredFieldsPrecheck();
  console.log(JSON.stringify({
    decision: result.decision,
    apply_sql_hash: result.apply_sql_hash,
    required_columns: result.required_columns,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
