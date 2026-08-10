import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const EXPECTED_HASH = "CEE9E1BFDE421B2C85480C1EB2C0DAFA4FDA994F94832DA777B85508657B8CF4";
const TARGET_FUNCTION = "public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text)";

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/step05-aoe-security-apply-result.json`,
    `${BASE}/step05-aoe-security-apply-summary.md`,
    "docs/supabase-production-sync/37-step05-aoe-security-production-apply.md"
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

export function validateStep05AoeSecurityApply(root = ROOT) {
  const result = readJson(root, `${BASE}/step05-aoe-security-apply-result.json`);

  must(result.decision === "STEP05_AOE_SECURITY_APPLIED_AND_VALIDATED", "DECISION_INVALID");
  must(result.project === "aruka", "PROJECT_INVALID");
  must(result.project_ref_masked === "vriz...vdik", "PROJECT_REF_NOT_MASKED");
  must(result.fresh_precheck_result === "PASS", "FRESH_PRECHECK_NOT_PASS");
  must(result.target_function === TARGET_FUNCTION, "TARGET_FUNCTION_CHANGED");
  must(result.target_role === "anon", "TARGET_ROLE_CHANGED");
  must(result.apply_sql_hash === EXPECTED_HASH, "APPLY_HASH_INVALID");
  must(result.apply_exit_code === 0, "APPLY_EXIT_NOT_ZERO");
  must(result.apply_result === "PASS", "APPLY_NOT_PASS");
  must(result.postcheck_exit_code === 0, "POSTCHECK_EXIT_NOT_ZERO");
  must(result.postcheck_result === "PASS", "POSTCHECK_NOT_PASS");
  must(result.anon_execute_final === false, "ANON_EXECUTE_FINAL_TRUE");
  must(result.aoe_security_production_reconciled === true, "AOE_SECURITY_NOT_RECONCILED");
  must(result.recovery_executed === false, "RECOVERY_EXECUTED");
  must(result.step06_authorized === false, "STEP06_AUTHORIZED");
  must(result.step06_executed === false, "STEP06_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.history_alignment_allowed === false, "HISTORY_ALIGNMENT_ALLOWED");
  must(result.next_action === "STEP06_GROUP_A_SECURITY_PRECHECK_PREPARATION", "NEXT_ACTION_INVALID");

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep05AoeSecurityApply();
  console.log(JSON.stringify({
    decision: result.decision,
    apply_result: result.apply_result,
    postcheck_result: result.postcheck_result,
    anon_execute_final: result.anon_execute_final,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
