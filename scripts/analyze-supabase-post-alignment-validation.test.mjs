import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validatePostAlignmentValidation } from "./analyze-supabase-post-alignment-validation.mjs";

function validResult() {
  return {
    decision: "READY_FOR_POST_ALIGNMENT_AND_DRY_RUN_COMMIT",
    executable_migration_count: 6,
    reference_only_baseline_count: 1,
    total_database_change_artifact_count: 7,
    remote_history_count: 6,
    authorized_present_count: 6,
    baseline_history_present: false,
    unexpected_history_count: 0,
    cli_migration_list_exit_code: 0,
    cli_migration_list_execution: "PASS",
    cli_remote_history_count: 6,
    psql_remote_history_count: 6,
    cli_psql_history_match: "YES",
    cli_baseline_visible: true,
    cli_baseline_visibility_classification: "LOCAL_MIGRATION_VISIBLE_NOT_REMOTE_HISTORY",
    post_alignment_remote_read_only_validation_complete: true,
    rollback_confirmed: true,
    local_migration_hashes_preserved: true,
    production_reconciliation_complete: true,
    pending_executable_migration_count: 0,
    db_push_dry_run_executed: true,
    final_db_push_dry_run_decision: "DB_PUSH_DRY_RUN_CLEAN",
    final_db_push_dry_run_exit_code: 0,
    final_db_push_dry_run_pending_migration_count: 0,
    final_db_push_dry_run_baseline_pending: false,
    db_push_needed: false,
    db_push_allowed: false,
    production_mutation_executed: false,
    history_mutation_executed: false,
    production_database_reconciliation_complete: true,
    next_action: "PREPARE_NON_MUTATING_DB_PUSH_DRY_RUN"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "post-alignment-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = validResult();
  mutator(result);
  writeFileSync(join(reportDir, "post-alignment-validation-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "post-alignment-validation-summary.md"), "Post alignment PASS\n");
  writeFileSync(join(docsDir, "44-post-alignment-validation.md"), "Post alignment PASS\n");
  return root;
}

test("remote history !=6 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.remote_history_count = 5; })), /REMOTE_HISTORY_COUNT_INVALID/));
test("executable migration count !=6 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.executable_migration_count = 7; })), /EXECUTABLE_MIGRATION_COUNT_INVALID/));
test("reference baseline count !=1 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.reference_only_baseline_count = 0; })), /REFERENCE_ONLY_BASELINE_COUNT_INVALID/));
test("total artifact count !=7 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.total_database_change_artifact_count = 6; })), /TOTAL_DATABASE_CHANGE_ARTIFACT_COUNT_INVALID/));
test("authorized count !=6 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.authorized_present_count = 5; })), /AUTHORIZED_PRESENT_COUNT_INVALID/));
test("baseline present -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.baseline_history_present = true; })), /BASELINE_HISTORY_PRESENT/));
test("unexpected history >0 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.unexpected_history_count = 1; })), /UNEXPECTED_HISTORY_COUNT/));
test("cli exit !=0 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.cli_migration_list_exit_code = 1; })), /CLI_MIGRATION_LIST_EXIT_CODE_INVALID/));
test("cli execution !=PASS -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.cli_migration_list_execution = "PREPARED_FOR_MANUAL_READ_ONLY_RUN"; })), /CLI_MIGRATION_LIST_EXECUTION_INVALID/));
test("cli remote count !=6 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.cli_remote_history_count = 5; })), /CLI_REMOTE_HISTORY_COUNT_INVALID/));
test("psql remote count !=6 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.psql_remote_history_count = 5; })), /PSQL_REMOTE_HISTORY_COUNT_INVALID/));
test("cli/psql mismatch -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.cli_psql_history_match = "NO"; })), /CLI_PSQL_HISTORY_MATCH_INVALID/));
test("remote validation incomplete -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.post_alignment_remote_read_only_validation_complete = false; })), /REMOTE_READ_ONLY_VALIDATION_INCOMPLETE/));
test("rollback false -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.rollback_confirmed = false; })), /ROLLBACK_NOT_CONFIRMED/));
test("migration hash changed -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.local_migration_hashes_preserved = false; })), /LOCAL_MIGRATION_HASHES_CHANGED/));
test("production reconciliation false -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.production_reconciliation_complete = false; })), /PRODUCTION_RECONCILIATION_INCOMPLETE/));
test("pending executable >0 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.pending_executable_migration_count = 1; })), /PENDING_EXECUTABLE_MIGRATIONS/));
test("dry-run not executed -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.db_push_dry_run_executed = false; })), /DB_PUSH_DRY_RUN_NOT_EXECUTED/));
test("final dry-run not clean -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.final_db_push_dry_run_decision = "BLOCKED_DB_PUSH_BASELINE_WOULD_BE_APPLIED"; })), /FINAL_DB_PUSH_DRY_RUN_NOT_CLEAN/));
test("final dry-run exit !=0 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.final_db_push_dry_run_exit_code = 1; })), /FINAL_DB_PUSH_DRY_RUN_EXIT_CODE_INVALID/));
test("final dry-run pending >0 -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.final_db_push_dry_run_pending_migration_count = 1; })), /FINAL_DB_PUSH_DRY_RUN_PENDING_MIGRATIONS/));
test("final dry-run baseline pending -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.final_db_push_dry_run_baseline_pending = true; })), /FINAL_DB_PUSH_DRY_RUN_BASELINE_PENDING/));
test("db push needed=true -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.db_push_needed = true; })), /DB_PUSH_NEEDED/));
test("db push allowed=true -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("production mutation=true -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.production_mutation_executed = true; })), /PRODUCTION_MUTATION_EXECUTED/));
test("history mutation=true -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.history_mutation_executed = true; })), /HISTORY_MUTATION_EXECUTED/));
test("production database reconciliation incomplete -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.production_database_reconciliation_complete = false; })), /PRODUCTION_DATABASE_RECONCILIATION_INCOMPLETE/));
test("cli baseline visible with remote baseline absent -> PASS", () => assert.equal(validatePostAlignmentValidation(fixture((r) => { r.cli_baseline_visible = true; r.baseline_history_present = false; })).cli_baseline_visible, true));
test("decision not ready -> FAIL", () => assert.throws(() => validatePostAlignmentValidation(fixture((r) => { r.decision = "READY_FOR_DB_PUSH_DRY_RUN_REVIEW"; })), /DECISION_NOT_READY_FOR_COMMIT/));
test("valid state -> PASS", () => assert.equal(validatePostAlignmentValidation(fixture()).decision, "READY_FOR_POST_ALIGNMENT_AND_DRY_RUN_COMMIT"));
