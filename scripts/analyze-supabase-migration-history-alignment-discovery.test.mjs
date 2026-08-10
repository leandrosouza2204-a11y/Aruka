import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateMigrationHistoryAlignmentDiscovery } from "./analyze-supabase-migration-history-alignment-discovery.mjs";

function validResult() {
  return {
    decision: "READY_FOR_MIGRATION_HISTORY_ALIGNMENT_REVIEW",
    local_migration_count: 7,
    canonical_remote_registry_state: "ABSENT",
    remote_history_count: 0,
    potential_registry_count: 7,
    history_match_count: 0,
    local_effect_applied_history_missing_count: 6,
    reference_only_count: 1,
    partially_reconciled_count: 0,
    not_yet_applied_count: 0,
    blocking_conflict_count: 0,
    repair_candidate_count: 6,
    not_safe_for_repair_count: 1,
    migration_repair_authorized: false,
    migration_repair_executed: false,
    db_push_allowed: false,
    history_alignment_executed: false,
    next_action: "REVIEW_EXACT_MIGRATION_REPAIR_PLAN"
  };
}

function validMatrix(rows = []) {
  const header = "version,filename,local_sha256,canonical_remote_registry_present,remote_history_present,remote_name,production_effect_status,cutover_step,fully_reconciled,contains_deferred_scope,local_classification,repair_candidate,recommended_future_action,blocking_reason";
  const defaults = [
    "20260716090000,baseline.sql,hash,false,false,,REFERENCE_ONLY,BASELINE,false,false,REFERENCE_ONLY_BASELINE,false,DO_NOT_REPAIR_AUTOMATICALLY,baseline",
    ...Array.from({ length: 6 }, (_, index) => `2026072${index},m${index}.sql,hash,false,false,,FULLY_APPLIED,Step0${index + 1},true,false,LOCAL_EFFECT_APPLIED_REMOTE_HISTORY_MISSING,true,CANDIDATE_FOR_FUTURE_REPAIR_APPLIED,`)
  ];
  return `${header}\n${(rows.length ? rows : defaults).join("\n")}\n`;
}

function fixture(mutator = () => {}, matrixRows) {
  const root = mkdtempSync(join(tmpdir(), "history-discovery-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = validResult();
  mutator(result);
  writeFileSync(join(reportDir, "migration-history-alignment-discovery-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "migration-history-alignment-matrix.csv"), validMatrix(matrixRows));
  writeFileSync(join(reportDir, "migration-history-alignment-discovery-summary.md"), "Discovery PASS\n");
  writeFileSync(join(docsDir, "40-production-migration-history-alignment-discovery.md"), "Discovery PASS\n");
  return root;
}

test("registry absent -> valid", () => assert.equal(validateMigrationHistoryAlignmentDiscovery(fixture()).result.canonical_remote_registry_state, "ABSENT"));
test("baseline -> not candidate", () => assert.equal(validateMigrationHistoryAlignmentDiscovery(fixture()).matrix[0].repair_candidate, "false"));
test("fully applied/history missing -> candidate", () => assert.equal(validateMigrationHistoryAlignmentDiscovery(fixture()).result.repair_candidate_count, 6));
test("partial -> not candidate", () => assert.throws(() => validateMigrationHistoryAlignmentDiscovery(fixture((r) => { r.partially_reconciled_count = 1; })), /PARTIAL_COUNT_INVALID/));
test("deferred -> not candidate", () => assert.throws(() => validateMigrationHistoryAlignmentDiscovery(fixture(() => {}, ["20260716090000,baseline.sql,hash,false,false,,REFERENCE_ONLY,BASELINE,false,false,REFERENCE_ONLY_BASELINE,false,DO_NOT_REPAIR_AUTOMATICALLY,baseline", "20260728030000,m.sql,hash,false,false,,PARTIALLY_APPLIED,Step01,false,true,PARTIALLY_RECONCILED_MIGRATION,false,NOT_SAFE_FOR_REPAIR,deferred"])), /MATRIX_ROW_COUNT_INVALID/));
test("not applied -> not candidate", () => assert.throws(() => validateMigrationHistoryAlignmentDiscovery(fixture((r) => { r.not_yet_applied_count = 1; })), /NOT_YET_APPLIED_COUNT_INVALID/));
test("history conflict -> blocking", () => assert.throws(() => validateMigrationHistoryAlignmentDiscovery(fixture((r) => { r.blocking_conflict_count = 1; })), /BLOCKING_CONFLICT_COUNT_INVALID/));
test("repair authorized=true -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentDiscovery(fixture((r) => { r.migration_repair_authorized = true; })), /MIGRATION_REPAIR_AUTHORIZED/));
test("repair executed=true -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentDiscovery(fixture((r) => { r.migration_repair_executed = true; })), /MIGRATION_REPAIR_EXECUTED/));
test("db push allowed=true -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentDiscovery(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("history alignment executed=true -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentDiscovery(fixture((r) => { r.history_alignment_executed = true; })), /HISTORY_ALIGNMENT_EXECUTED/));
test("valid discovery -> PASS", () => assert.equal(validateMigrationHistoryAlignmentDiscovery(fixture()).result.decision, "READY_FOR_MIGRATION_HISTORY_ALIGNMENT_REVIEW"));
