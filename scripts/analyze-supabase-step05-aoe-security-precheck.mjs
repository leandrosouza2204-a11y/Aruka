import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const EXPECTED_HASH = "CEE9E1BFDE421B2C85480C1EB2C0DAFA4FDA994F94832DA777B85508657B8CF4";
const TARGET_FUNCTIONS = [
  "public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text)"
];
const TARGET_ROLES = ["anon"];

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/step05-aoe-security-precheck-result.json`,
    `${BASE}/step05-aoe-security-precheck-summary.md`,
    "docs/supabase-production-sync/36-step05-aoe-security-precheck.md"
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
  must(JSON.stringify(result.target_functions) === JSON.stringify(TARGET_FUNCTIONS), "TARGET_FUNCTIONS_CHANGED");
  must(JSON.stringify(result.target_roles) === JSON.stringify(TARGET_ROLES), "TARGET_ROLES_CHANGED");
  must(Array.isArray(result.security_operations) && result.security_operations.length === 1, "SECURITY_OPERATIONS_INVALID");
  must(result.target_function_count === 1, "TARGET_FUNCTION_COUNT_INVALID");
  must(result.body_mutation_expected === false, "BODY_MUTATION_EXPECTED");
  must(result.apply_sql_hash === EXPECTED_HASH, "APPLY_HASH_INVALID");
  must(result.apply_sql_traceable === true, "APPLY_NOT_TRACEABLE");
  must(result.untraceable_statement_count === 0, "UNTRACEABLE_SQL");
  must(result.apply_sql_unchanged === true, "APPLY_SQL_CHANGED");
  must(result.precheck_read_only === true, "PRECHECK_NOT_READ_ONLY");
  must(result.recovery_available === true, "RECOVERY_UNAVAILABLE");
  must(result.postcheck_available === true, "POSTCHECK_UNAVAILABLE");
  must(result.runtime_requirement === "AOE_SECURITY_POSTCHECK_SUFFICIENT", "RUNTIME_REQUIREMENT_INVALID");
  must(result.step05_apply_authorized === false, "APPLY_AUTHORIZED");
  must(result.step05_apply_executed === false, "APPLY_EXECUTED");
  must(result.step06_authorized === false, "STEP06_AUTHORIZED");
}

export function validateStep05AoeSecurityPrecheck(root = ROOT) {
  const result = readJson(root, `${BASE}/step05-aoe-security-precheck-result.json`);

  must(["GO_FOR_STEP05_APPLY_AUTHORIZATION", "NO_GO_STEP05", "AWAITING_SECURE_STEP05_PRECHECK_EXECUTION", "AWAITING_SECURE_STEP05_PRECHECK_RETRY"].includes(result.decision), "DECISION_INVALID");
  validateCommon(result);
  must(result.runtime_sql_invalid !== true, "RUNTIME_SQL_INVALID");

  if (result.decision === "GO_FOR_STEP05_APPLY_AUTHORIZATION") {
    must(result.project_verified === true, "GO_PROJECT_NOT_VERIFIED");
    must(result.precheck_exit_code === 0, "GO_PRECHECK_EXIT_INVALID");
    must(result.target_functions_present === true, "GO_TARGET_FUNCTION_MISSING");
    must(result.blocking_drift_count === 0, "GO_BLOCKING_DRIFT");
    must(result.rollback_confirmed === true, "GO_ROLLBACK_NOT_CONFIRMED");
    must(result.next_action === "USER_EXPLICIT_STEP05_APPLY_AUTHORIZATION", "GO_NEXT_ACTION_INVALID");
  } else if (result.decision === "NO_GO_STEP05") {
    must(Array.isArray(result.blockers) && result.blockers.length > 0, "NO_GO_BLOCKERS_MISSING");
    must(result.next_action === "FIX_ONLY_STEP05_AOE_SECURITY_BLOCKER", "NO_GO_NEXT_ACTION_INVALID");
  } else {
    must(result.precheck_exit_code === null, "AWAITING_EXIT_CODE_SHOULD_BE_NULL");
    must(result.production_executed === false, "AWAITING_PRODUCTION_EXECUTED");
    must(result.next_action === "USER_EXECUTE_STEP05_PRECHECK_RUNNER", "AWAITING_NEXT_ACTION_INVALID");
  }

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep05AoeSecurityPrecheck();
  console.log(JSON.stringify({
    decision: result.decision,
    apply_sql_hash: result.apply_sql_hash,
    target_functions: result.target_functions,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
