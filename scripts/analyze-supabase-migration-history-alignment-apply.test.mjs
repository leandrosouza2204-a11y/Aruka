import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateMigrationHistoryAlignmentApply } from "./analyze-supabase-migration-history-alignment-apply.mjs";

function validResult() {
  return {
    decision: "PRODUCTION_MIGRATION_HISTORY_ALIGNMENT_APPLIED_AND_VALIDATED",
    migration_repair_executed: true,
    history_alignment_executed: true,
    history_alignment_validated: true,
    history_count_after: 6,
    authorized_present_count: 6,
    unexpected_history_entries: 0,
    baseline_history_present: false,
    persistent_link_created: false,
    recovery_executed: false,
    db_push_allowed: false,
    local_migration_hashes_preserved: true,
    public_schema_mutation_detected: false,
    repair_results: [1, 2, 3, 4, 5, 6].map((order) => ({
      order,
      repair_executed: true,
      history_present_after: true
    })),
    next_action: "COMMIT_HISTORY_ALIGNMENT_AND_PREPARE_POST_ALIGNMENT_VALIDATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "history-apply-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = validResult();
  mutator(result);
  writeFileSync(join(reportDir, "migration-history-alignment-apply-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "migration-history-alignment-apply-summary.md"), "Apply PASS\n");
  writeFileSync(join(reportDir, "migration-history-alignment-final-matrix.csv"), "order,version,result\n1,20260728030000,PASS\n");
  writeFileSync(join(docsDir, "43-production-migration-history-alignment-apply.md"), "Apply PASS\n");
  return root;
}

test("history count !=6 -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentApply(fixture((r) => { r.history_count_after = 5; })), /HISTORY_COUNT_INVALID/));
test("authorized count !=6 -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentApply(fixture((r) => { r.authorized_present_count = 5; })), /AUTHORIZED_PRESENT_COUNT_INVALID/));
test("baseline true -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentApply(fixture((r) => { r.baseline_history_present = true; })), /BASELINE_HISTORY_PRESENT/));
test("unexpected >0 -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentApply(fixture((r) => { r.unexpected_history_entries = 1; })), /UNEXPECTED_HISTORY_ENTRIES/));
test("repair missing -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentApply(fixture((r) => { r.repair_results[0].repair_executed = false; })), /REPAIR_MISSING/));
test("schema mutation true -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentApply(fixture((r) => { r.public_schema_mutation_detected = true; })), /PUBLIC_SCHEMA_MUTATION/));
test("migration hash changed -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentApply(fixture((r) => { r.local_migration_hashes_preserved = false; })), /LOCAL_MIGRATION_HASHES_CHANGED/));
test("persistent link true -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentApply(fixture((r) => { r.persistent_link_created = true; })), /PERSISTENT_LINK_CREATED/));
test("recovery true -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentApply(fixture((r) => { r.recovery_executed = true; })), /RECOVERY_EXECUTED/));
test("db push true -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentApply(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("valid success -> PASS", () => assert.equal(validateMigrationHistoryAlignmentApply(fixture()).decision, "PRODUCTION_MIGRATION_HISTORY_ALIGNMENT_APPLIED_AND_VALIDATED"));
