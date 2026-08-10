import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = process.cwd();
const BASE = "reports/supabase-production-sync";

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
    `${BASE}/post-alignment-validation-result.json`,
    `${BASE}/post-alignment-validation-summary.md`,
    "docs/supabase-production-sync/44-post-alignment-validation.md"
  ];
  const patterns = [
    /postgres(?:ql)?:\/\//i,
    new RegExp("sb_" + "secret_", "i"),
    /eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}/,
    new RegExp("sen" + "ha real", "i"),
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

export function validatePostAlignmentValidation(root = ROOT) {
  const result = readJson(root, `${BASE}/post-alignment-validation-result.json`);
  must(result.decision === "READY_FOR_POST_ALIGNMENT_AND_DRY_RUN_COMMIT", "DECISION_NOT_READY_FOR_COMMIT");
  must(result.executable_migration_count === 6, "EXECUTABLE_MIGRATION_COUNT_INVALID");
  must(result.reference_only_baseline_count === 1, "REFERENCE_ONLY_BASELINE_COUNT_INVALID");
  must(result.total_database_change_artifact_count === 7, "TOTAL_DATABASE_CHANGE_ARTIFACT_COUNT_INVALID");
  must(result.remote_history_count === 6, "REMOTE_HISTORY_COUNT_INVALID");
  must(result.authorized_present_count === 6, "AUTHORIZED_PRESENT_COUNT_INVALID");
  must(result.baseline_history_present === false, "BASELINE_HISTORY_PRESENT");
  must(result.unexpected_history_count === 0, "UNEXPECTED_HISTORY_COUNT");
  must(result.cli_migration_list_exit_code === 0, "CLI_MIGRATION_LIST_EXIT_CODE_INVALID");
  must(result.cli_migration_list_execution === "PASS", "CLI_MIGRATION_LIST_EXECUTION_INVALID");
  must(result.cli_remote_history_count === 6, "CLI_REMOTE_HISTORY_COUNT_INVALID");
  must(result.psql_remote_history_count === 6, "PSQL_REMOTE_HISTORY_COUNT_INVALID");
  must(result.cli_psql_history_match === "YES", "CLI_PSQL_HISTORY_MATCH_INVALID");
  must(result.post_alignment_remote_read_only_validation_complete === true, "REMOTE_READ_ONLY_VALIDATION_INCOMPLETE");
  must(result.rollback_confirmed === true, "ROLLBACK_NOT_CONFIRMED");
  must(result.local_migration_hashes_preserved === true, "LOCAL_MIGRATION_HASHES_CHANGED");
  must(result.production_reconciliation_complete === true, "PRODUCTION_RECONCILIATION_INCOMPLETE");
  must(result.pending_executable_migration_count === 0, "PENDING_EXECUTABLE_MIGRATIONS");
  must(result.db_push_dry_run_executed === true, "DB_PUSH_DRY_RUN_NOT_EXECUTED");
  must(result.final_db_push_dry_run_decision === "DB_PUSH_DRY_RUN_CLEAN", "FINAL_DB_PUSH_DRY_RUN_NOT_CLEAN");
  must(result.final_db_push_dry_run_exit_code === 0, "FINAL_DB_PUSH_DRY_RUN_EXIT_CODE_INVALID");
  must(result.final_db_push_dry_run_pending_migration_count === 0, "FINAL_DB_PUSH_DRY_RUN_PENDING_MIGRATIONS");
  must(result.final_db_push_dry_run_baseline_pending === false, "FINAL_DB_PUSH_DRY_RUN_BASELINE_PENDING");
  must(result.db_push_needed === false, "DB_PUSH_NEEDED");
  must(result.db_push_allowed === false, "DB_PUSH_ALLOWED");
  must(result.production_mutation_executed === false, "PRODUCTION_MUTATION_EXECUTED");
  must(result.history_mutation_executed === false, "HISTORY_MUTATION_EXECUTED");
  must(result.production_database_reconciliation_complete === true, "PRODUCTION_DATABASE_RECONCILIATION_INCOMPLETE");
  secretScan(root);
  return result;
}

function main() {
  const result = validatePostAlignmentValidation();
  console.log(JSON.stringify({
    decision: result.decision,
    remote_history_count: result.remote_history_count,
    pending_executable_migration_count: result.pending_executable_migration_count,
    next_action: result.next_action
  }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
