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
    `${BASE}/step04-required-fields-apply-result.json`,
    `${BASE}/step04-required-fields-apply-summary.md`,
    "docs/supabase-production-sync/35-step04-required-fields-production-apply.md"
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

export function validateStep04RequiredFieldsApply(root = ROOT) {
  const result = readJson(root, `${BASE}/step04-required-fields-apply-result.json`);

  must(result.decision === "STEP04_REQUIRED_FIELDS_APPLIED_AND_VALIDATED", "DECISION_INVALID");
  must(result.project === "aruka", "PROJECT_INVALID");
  must(result.project_ref_masked === "vriz...vdik", "PROJECT_REF_NOT_MASKED");
  must(result.fresh_precheck_result === "PASS", "FRESH_PRECHECK_NOT_PASS");
  must(result.required_fields_data_gate === "PASS", "DATA_GATE_NOT_PASS");
  must(Array.isArray(result.required_columns), "REQUIRED_COLUMNS_INVALID");
  must(JSON.stringify(result.required_columns) === JSON.stringify(REQUIRED_COLUMNS), "REQUIRED_COLUMNS_CHANGED");
  must(result.null_counts && typeof result.null_counts === "object", "NULL_COUNTS_INVALID");
  must(REQUIRED_COLUMNS.every((column) => result.null_counts[column] === 0), "NULL_COUNT_NOT_ZERO");
  must(result.total_null_count === 0, "TOTAL_NULL_COUNT_NOT_ZERO");
  must(result.apply_sql_hash === EXPECTED_HASH, "APPLY_HASH_INVALID");
  must(result.apply_exit_code === 0, "APPLY_EXIT_NOT_ZERO");
  must(result.apply_result === "PASS", "APPLY_NOT_PASS");
  must(result.postcheck_exit_code === 0, "POSTCHECK_EXIT_NOT_ZERO");
  must(result.postcheck_result === "PASS", "POSTCHECK_NOT_PASS");
  must(result.required_fields_production_reconciled === true, "REQUIRED_FIELDS_NOT_RECONCILED");
  must(result.recovery_executed === false, "RECOVERY_EXECUTED");
  must(result.step05_authorized === false, "STEP05_AUTHORIZED");
  must(result.step05_executed === false, "STEP05_EXECUTED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.history_alignment_allowed === false, "HISTORY_ALIGNMENT_ALLOWED");
  must(result.next_action === "STEP05_AOE_SECURITY_PRECHECK_PREPARATION", "NEXT_ACTION_INVALID");

  secretScan(root);
  return result;
}

function main() {
  const result = validateStep04RequiredFieldsApply();
  console.log(JSON.stringify({
    decision: result.decision,
    required_fields_data_gate: result.required_fields_data_gate,
    apply_result: result.apply_result,
    postcheck_result: result.postcheck_result,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
