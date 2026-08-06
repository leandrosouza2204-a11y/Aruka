import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const EXPECTED_HASH = "93C0AD41BD51551BF0F0A6516AC1FD5B3915C724DD1109E2E1CEBBD1AB04D170";

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/step02-student-identity-apply-result.json`,
    `${BASE}/step02-student-identity-apply-summary.md`,
    "docs/supabase-production-sync/31-step02-student-identity-production-apply.md"
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

export function validateStep02StudentIdentityApply(root = ROOT) {
  const result = readJson(root, `${BASE}/step02-student-identity-apply-result.json`);

  must(result.decision === "STEP02_STUDENT_IDENTITY_APPLIED_AND_VALIDATED", "DECISION_INVALID");
  must(result.project === "aruka", "PROJECT_INVALID");
  must(result.project_ref_masked === "vriz...vdik", "PROJECT_REF_NOT_MASKED");
  must(result.fresh_precheck_result === "PASS", "FRESH_PRECHECK_NOT_PASS");
  must(result.apply_sql_hash === EXPECTED_HASH, "APPLY_HASH_INVALID");
  must(result.apply_result === "PASS", "APPLY_NOT_PASS");
  must(result.postcheck_result === "PASS", "POSTCHECK_NOT_PASS");
  must(result.runtime_exit_code === 0, "RUNTIME_EXIT_NOT_ZERO");
  must(result.runtime_result === "PASS", "RUNTIME_NOT_PASS");
  must(result.smoke_result === "PASS", "SMOKE_NOT_PASS");
  must(result.smoke_residual_rows === 0, "SMOKE_RESIDUAL_ROWS_NOT_ZERO");
  must(result.recovery_executed === false, "RECOVERY_EXECUTED");
  must(result.production_reconciled === true, "PRODUCTION_NOT_RECONCILED");
  must(result.step03_authorized === false, "STEP03_AUTHORIZED");
  must(result.step03_executed === false, "STEP03_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.history_alignment_allowed === false, "HISTORY_ALIGNMENT_ALLOWED");
  must(result.next_action === "STEP03_SECURITY_PRECHECK_PREPARATION", "NEXT_ACTION_INVALID");

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep02StudentIdentityApply();
  console.log(JSON.stringify({
    decision: result.decision,
    apply_result: result.apply_result,
    postcheck_result: result.postcheck_result,
    runtime_result: result.runtime_result,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
