import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const EXPECTED_HASH = "DC512FB0400792A3741993B09A7A16DE23B797D3B6031C07B936E63E7295A803";

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/step01-workout-delivery-apply-result.json`,
    `${BASE}/step01-workout-delivery-apply-summary.md`,
    "docs/supabase-production-sync/29-step01-workout-delivery-production-apply.md"
  ];
  const patterns = [
    /postgres(?:ql)?:\/\//i,
    new RegExp("sb_" + "secret_", "i"),
    /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
    /\bpassword\b/i,
    /\buri\b/i,
    /vriz[a-z0-9]+vdik/i
  ];
  for (const file of files) {
    const fullPath = join(root, file);
    if (!existsSync(fullPath)) continue;
    const text = readFileSync(fullPath, "utf8");
    for (const pattern of patterns) must(!pattern.test(text), `SECRET_SCAN_FAILED:${file}`);
  }
}

export function validateStep01WorkoutDeliveryApply(root = ROOT) {
  const result = readJson(root, `${BASE}/step01-workout-delivery-apply-result.json`);

  must(result.decision === "STEP01_WORKOUT_DELIVERY_APPLIED_AND_VALIDATED", "DECISION_INVALID");
  must(result.project === "aruka", "PROJECT_INVALID");
  must(result.project_ref_masked === "vriz...vdik", "PROJECT_REF_NOT_MASKED");
  must(result.backup_verified === true, "BACKUP_NOT_VERIFIED");
  must(result.maintenance_window_confirmed === true, "MAINTENANCE_WINDOW_NOT_CONFIRMED");
  must(result.fresh_precheck_result === "PASS", "FRESH_PRECHECK_NOT_PASS");
  must(result.apply_sql_hash === EXPECTED_HASH, "APPLY_HASH_INVALID");
  must(result.apply_exit_code === 0, "APPLY_EXIT_NOT_ZERO");
  must(result.apply_result === "PASS", "APPLY_NOT_PASS");
  must(result.postcheck_exit_code === 0, "POSTCHECK_EXIT_NOT_ZERO");
  must(result.postcheck_result === "PASS", "POSTCHECK_NOT_PASS");
  must(result.smoke_exit_code === 0, "SMOKE_EXIT_NOT_ZERO");
  must(result.smoke_result === "PASS", "SMOKE_NOT_PASS");
  must(result.smoke_residual_rows === 0, "SMOKE_RESIDUAL_ROWS_NOT_ZERO");
  must(result.recovery_executed === false, "RECOVERY_EXECUTED");
  must(result.production_reconciled === true, "PRODUCTION_NOT_RECONCILED");
  must(result.step02_authorized === false, "STEP02_AUTHORIZED");
  must(result.step02_executed === false, "STEP02_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.history_alignment_allowed === false, "HISTORY_ALIGNMENT_ALLOWED");
  must(result.next_action === "STEP02_STUDENT_IDENTITY_PRECHECK_AND_EXECUTION_PREPARATION", "NEXT_ACTION_INVALID");

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep01WorkoutDeliveryApply();
  console.log(JSON.stringify({
    decision: result.decision,
    apply_result: result.apply_result,
    postcheck_result: result.postcheck_result,
    smoke_result: result.smoke_result,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
