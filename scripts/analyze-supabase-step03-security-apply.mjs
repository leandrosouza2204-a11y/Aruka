import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const EXPECTED_HASH = "BD2753069A1F2F6565AFD1E846872D1E48EA5A4FE24F413415C8E66BC3392D54";

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    `${BASE}/step03-security-apply-result.json`,
    `${BASE}/step03-security-apply-summary.md`,
    "docs/supabase-production-sync/33-step03-security-production-apply.md"
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

export function validateStep03SecurityApply(root = ROOT) {
  const result = readJson(root, `${BASE}/step03-security-apply-result.json`);

  must(result.decision === "STEP03_SECURITY_RECONCILIATION_APPLIED_AND_VALIDATED", "DECISION_INVALID");
  must(result.project === "aruka", "PROJECT_INVALID");
  must(result.project_ref_masked === "vriz...vdik", "PROJECT_REF_NOT_MASKED");
  must(result.fresh_precheck_result === "PASS", "FRESH_PRECHECK_NOT_PASS");
  must(result.apply_sql_hash === EXPECTED_HASH, "APPLY_HASH_INVALID");
  must(result.apply_exit_code === 0, "APPLY_EXIT_NOT_ZERO");
  must(result.apply_result === "PASS", "APPLY_NOT_PASS");
  must(result.postcheck_exit_code === 0, "POSTCHECK_EXIT_NOT_ZERO");
  must(result.postcheck_result === "PASS", "POSTCHECK_NOT_PASS");
  must(result.security_production_reconciled === true, "SECURITY_NOT_RECONCILED");
  must(result.recovery_executed === false, "RECOVERY_EXECUTED");
  must(result.step04_authorized === false, "STEP04_AUTHORIZED");
  must(result.step04_executed === false, "STEP04_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.history_alignment_allowed === false, "HISTORY_ALIGNMENT_ALLOWED");
  must(result.next_action === "STEP04_REQUIRED_FIELDS_PRECHECK_PREPARATION", "NEXT_ACTION_INVALID");

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep03SecurityApply();
  console.log(JSON.stringify({
    decision: result.decision,
    apply_result: result.apply_result,
    postcheck_result: result.postcheck_result,
    security_production_reconciled: result.security_production_reconciled,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
