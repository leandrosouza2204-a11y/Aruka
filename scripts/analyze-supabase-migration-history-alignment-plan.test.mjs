import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateMigrationHistoryAlignmentPlan } from "./analyze-supabase-migration-history-alignment-plan.mjs";

function validResult() {
  return {
    decision: "READY_WITH_REPAIR_BOOTSTRAP_LIMITATION",
    local_migration_count: 7,
    baseline_count: 1,
    candidate_count: 6,
    rejected_candidate_count: 1,
    canonical_registry_state: "ABSENT",
    potential_service_registry_count: 7,
    cli_version: "UNAVAILABLE_LOCAL_NPX_TIMEOUT",
    repair_supported: "UNKNOWN_REQUIRES_LOCAL_CLI_VALIDATION",
    repair_connection_mode: "UNKNOWN_REQUIRES_LOCAL_CLI_VALIDATION",
    repair_bootstrap_behavior: "REPAIR_BOOTSTRAP_BEHAVIOR_REQUIRES_VALIDATION",
    ordered_repair_versions: ["20260728030000", "20260730090000", "20260731190000", "20260801143335", "20260801173000", "20260801180000"],
    baseline_version: "20260716090000",
    baseline_repair_candidate: false,
    migration_repair_authorized: false,
    migration_repair_executed: false,
    history_alignment_executed: false,
    db_push_allowed: false,
    future_command_status: "FUTURE_COMMAND_NOT_EXECUTED",
    next_action: "VALIDATE_SUPABASE_CLI_REPAIR_BOOTSTRAP_THEN_REQUEST_EXPLICIT_HISTORY_ALIGNMENT_AUTHORIZATION"
  };
}

function validRows() {
  const versions = ["20260728030000", "20260730090000", "20260731190000", "20260801143335", "20260801173000", "20260801180000"];
  return versions.map((version, index) => `${index + 1},${version},m${index}.sql,hash,FULLY_APPLIED,Step0${index + 1},true,false,true,FUTURE_COMMAND_NOT_EXECUTED,pre,post,stop`);
}

function fixture(mutator = () => {}, rowMutator = (rows) => rows) {
  const root = mkdtempSync(join(tmpdir(), "history-plan-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = validResult();
  mutator(result);
  const header = "order,version,filename,sha256,production_effect_status,cutover_steps,fully_reconciled,contains_deferred_scope,repair_candidate,future_repair_action,precheck_required,postcheck_required,stop_condition";
  writeFileSync(join(reportDir, "migration-history-alignment-plan-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "migration-history-alignment-repair-plan.csv"), `${header}\n${rowMutator(validRows()).join("\n")}\n`);
  writeFileSync(join(reportDir, "migration-history-alignment-plan-summary.md"), "Plan PASS\n");
  writeFileSync(join(docsDir, "41-production-migration-history-alignment-plan.md"), "Plan PASS\n");
  return root;
}

test("baseline included as candidate -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentPlan(fixture((r) => { r.baseline_repair_candidate = true; })), /BASELINE_INCLUDED_AS_CANDIDATE/));
test("partial migration candidate -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentPlan(fixture(() => {}, (rows) => rows.map((row, index) => index === 0 ? row.replace(",true,false,true,", ",false,false,true,") : row))), /PARTIAL_MIGRATION_CANDIDATE/));
test("deferred migration candidate -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentPlan(fixture(() => {}, (rows) => rows.map((row, index) => index === 0 ? row.replace(",true,false,true,", ",true,true,true,") : row))), /DEFERRED_MIGRATION_CANDIDATE/));
test("candidate without full evidence -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentPlan(fixture(() => {}, (rows) => rows.map((row, index) => index === 0 ? row.replace(",FULLY_APPLIED,", ",PARTIALLY_APPLIED,") : row))), /CANDIDATE_WITHOUT_FULL_EVIDENCE/));
test("duplicate version -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentPlan(fixture(() => {}, (rows) => rows.map((row, index) => index === 1 ? row.replace("20260730090000", "20260728030000") : row))), /DUPLICATE_VERSION/));
test("unordered versions -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentPlan(fixture(() => {}, (rows) => [rows[1], rows[0], ...rows.slice(2)])), /UNORDERED_VERSIONS/));
test("repair already authorized -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentPlan(fixture((r) => { r.migration_repair_authorized = true; })), /MIGRATION_REPAIR_AUTHORIZED/));
test("repair executed -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentPlan(fixture((r) => { r.migration_repair_executed = true; })), /MIGRATION_REPAIR_EXECUTED/));
test("db push allowed -> FAIL", () => assert.throws(() => validateMigrationHistoryAlignmentPlan(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("unknown bootstrap behavior with READY decision -> FAIL unless explicitly classified for review", () => assert.throws(() => validateMigrationHistoryAlignmentPlan(fixture((r) => { r.decision = "READY_FOR_MIGRATION_HISTORY_ALIGNMENT_AUTHORIZATION_REVIEW"; r.repair_bootstrap_behavior = "REPAIR_BOOTSTRAP_BEHAVIOR_REQUIRES_VALIDATION"; })), /BOOTSTRAP_LIMITATION_DECISION_REQUIRED/));
test("valid plan -> PASS", () => assert.equal(validateMigrationHistoryAlignmentPlan(fixture()).result.decision, "READY_WITH_REPAIR_BOOTSTRAP_LIMITATION"));
