import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const EXPECTED_HASH = "343CF76EC22DA674EC035C74D80FDEF8F2B34F83F223C73A30B549B83C95643C";

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/step06-group-a-security-apply-result.json`,
    `${BASE}/step06-group-a-security-apply-summary.md`,
    "docs/supabase-production-sync/39-step06-group-a-security-production-apply.md"
  ];
  const patterns = [
    /postgres(?:ql)?:\/\//i,
    new RegExp("sb_" + "secret_", "i"),
    /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
    new RegExp("\\b" + "sen" + "ha" + "\\b", "i"),
    /\bpassword\b/i,
    new RegExp("\\b" + "uri" + " resolvida" + "\\b", "i"),
    /vriz[a-z0-9]+vdik/i
  ];
  for (const file of files) {
    const fullPath = join(root, file);
    if (!existsSync(fullPath)) continue;
    const text = readFileSync(fullPath, "utf8");
    for (const pattern of patterns) must(!pattern.test(text), `SECRET_SCAN_FAILED:${file}`);
  }
}

export function validateStep06GroupASecurityApply(root = ROOT) {
  const result = readJson(root, `${BASE}/step06-group-a-security-apply-result.json`);

  must(result.decision === "STEP06_GROUP_A_SECURITY_APPLIED_AND_VALIDATED", "DECISION_INVALID");
  must(result.project === "aruka", "PROJECT_INVALID");
  must(result.project_ref_masked === "vriz...vdik", "PROJECT_REF_NOT_MASKED");
  must(result.fresh_precheck_result === "PASS", "FRESH_PRECHECK_NOT_PASS");
  must(result.apply_sql_hash === EXPECTED_HASH, "APPLY_HASH_INVALID");
  must(result.apply_exit_code === 0, "APPLY_EXIT_NOT_ZERO");
  must(result.apply_result === "PASS", "APPLY_NOT_PASS");
  must(result.postcheck_exit_code === 0, "POSTCHECK_EXIT_NOT_ZERO");
  must(result.postcheck_result === "PASS", "POSTCHECK_NOT_PASS");
  must(result.function_body_preserved === true, "FUNCTION_BODY_NOT_PRESERVED");
  must(result.search_path_reconciled === true, "SEARCH_PATH_NOT_RECONCILED");
  must(result.public_execute_final === false, "PUBLIC_EXECUTE_FINAL_TRUE");
  must(result.anon_execute_final === false, "ANON_EXECUTE_FINAL_TRUE");
  must(result.authenticated_execute_final === false, "AUTHENTICATED_EXECUTE_FINAL_TRUE");
  must(result.trigger_state === "PASS", "TRIGGER_NOT_PASS");
  must(result.group_a_security_production_reconciled === true, "GROUP_A_SECURITY_NOT_RECONCILED");
  must(result.recovery_executed === false, "RECOVERY_EXECUTED");
  must(result.history_alignment_authorized === false, "HISTORY_ALIGNMENT_AUTHORIZED");
  must(result.history_alignment_executed === false, "HISTORY_ALIGNMENT_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.next_action === "PRODUCTION_MIGRATION_HISTORY_ALIGNMENT_DISCOVERY", "NEXT_ACTION_INVALID");

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep06GroupASecurityApply();
  console.log(JSON.stringify({
    decision: result.decision,
    apply_result: result.apply_result,
    postcheck_result: result.postcheck_result,
    group_a_security_production_reconciled: result.group_a_security_production_reconciled,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
