import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";
const BASELINE_HASH = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B";

function readJson(root, path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function readText(root, path) {
  return readFileSync(join(root, path), "utf8");
}

function must(condition, code) {
  if (!condition) throw new Error(code);
}

function secretScan(root) {
  const files = [
    "docs/supabase-production-sync/47-final-ci-cd-review-and-closeout.md",
    `${BASE}/final-ci-cd-review-result.json`,
    `${BASE}/final-ci-cd-review-summary.md`
  ];
  const patterns = [
    /postgres(?:ql)?:\/\//i,
    new RegExp("sen" + "ha", "i"),
    new RegExp("pass" + "word", "i"),
    new RegExp("sb_" + "secret_", "i"),
    /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
    /vriz[a-z0-9]+vdik/i,
    new RegExp("\\b" + "P" + "II" + "\\b")
  ];
  for (const file of files) {
    const fullPath = join(root, file);
    if (!existsSync(fullPath)) continue;
    const text = readText(root, file);
    for (const pattern of patterns) must(!pattern.test(text), `SECRET_SCAN_FAILED:${file}`);
  }
}

function validateBaselineContract(root) {
  const oldPath = join(root, "supabase/migrations/20260716090000_baseline_aruka_v1.sql");
  const newPath = join(root, "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql");
  must(!existsSync(oldPath), "BASELINE_OLD_PATH_PRESENT");
  must(existsSync(newPath), "BASELINE_REFERENCE_PATH_MISSING");
  must(readdirSync(join(root, "supabase/migrations")).filter((name) => name.endsWith(".sql")).length === 6, "EXECUTABLE_MIGRATION_COUNT_FILES_INVALID");
  must(readdirSync(join(root, "supabase/reference-baselines")).filter((name) => name.endsWith(".sql")).length === 1, "REFERENCE_BASELINE_COUNT_FILES_INVALID");
}

export function validateFinalCiCdReview(root = ROOT) {
  const result = readJson(root, `${BASE}/final-ci-cd-review-result.json`);
  must(result.decision === "READY_FOR_SUPABASE_FRONT_CLOSEOUT", "DECISION_INVALID");
  must(result.manual_cutover_complete === true, "MANUAL_CUTOVER_INCOMPLETE");
  must(result.manual_cutover_steps === 6, "MANUAL_CUTOVER_STEPS_INVALID");
  must(result.history_alignment_validated === true, "HISTORY_ALIGNMENT_NOT_VALIDATED");
  must(result.remote_history_count === 6, "REMOTE_HISTORY_COUNT_INVALID");
  must(result.executable_migration_count === 6, "EXECUTABLE_MIGRATION_COUNT_INVALID");
  must(result.reference_baseline_count === 1, "REFERENCE_BASELINE_COUNT_INVALID");
  must(result.pending_migration_count === 0, "PENDING_MIGRATIONS");
  must(result.db_push_needed === false, "DB_PUSH_NEEDED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.automatic_production_db_mutation_in_ci === false, "AUTOMATIC_PRODUCTION_DB_MUTATION_IN_CI");
  must(result.baseline_contract_valid === true, "BASELINE_CONTRACT_INVALID");
  must(result.required_validation_check_present === true, "REQUIRED_VALIDATION_CHECK_ABSENT");
  must(result.migration_hashes_preserved === true, "MIGRATION_HASHES_NOT_PRESERVED");
  must(result.reference_baseline_sha256 === BASELINE_HASH, "REFERENCE_BASELINE_SHA_INVALID");
  must(result.unit_tests === "NOT_CONFIGURED" || result.unit_tests === "PASS", "UNIT_TEST_RESULT_INVALID");
  must(result.lint === "PASS", "LINT_FAILED");
  must(result.build === "PASS", "BUILD_FAILED");
  must(result.production_database_front_status === "CLOSED", "PRODUCTION_DATABASE_FRONT_NOT_CLOSED");
  validateBaselineContract(root);
  secretScan(root);
  return result;
}

function main() {
  const result = validateFinalCiCdReview();
  console.log(JSON.stringify({
    decision: result.decision,
    production_database_front_status: result.production_database_front_status,
    ci_cd_classification: result.ci_cd_classification,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
