import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep01WorkoutDeliveryApply } from "./analyze-supabase-step01-workout-delivery-apply.mjs";

function valid() {
  return {
    decision: "STEP01_WORKOUT_DELIVERY_APPLIED_AND_VALIDATED",
    project: "aruka",
    project_ref_masked: "vriz...vdik",
    backup_verified: true,
    maintenance_window_confirmed: true,
    fresh_precheck_result: "PASS",
    apply_sql_hash: "DC512FB0400792A3741993B09A7A16DE23B797D3B6031C07B936E63E7295A803",
    apply_started_at_utc: "2026-08-05T19:42:32.7166164Z",
    apply_completed_at_utc: "2026-08-05T19:42:40.4699492Z",
    apply_exit_code: 0,
    apply_result: "PASS",
    postcheck_exit_code: 0,
    postcheck_result: "PASS",
    smoke_exit_code: 0,
    smoke_result: "PASS",
    smoke_residual_rows: 0,
    recovery_executed: false,
    production_reconciled: true,
    step02_authorized: false,
    step02_executed: false,
    db_push_allowed: false,
    history_alignment_allowed: false,
    next_action: "STEP02_STUDENT_IDENTITY_PRECHECK_AND_EXECUTION_PREPARATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step01-apply-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step01-workout-delivery-apply-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step01-workout-delivery-apply-summary.md"), "Step01 apply PASS\n");
  writeFileSync(join(docsDir, "29-step01-workout-delivery-production-apply.md"), "Step01 production apply PASS\n");
  return root;
}

test("apply fail -> FAIL", () => assert.throws(() => validateStep01WorkoutDeliveryApply(fixture((r) => { r.apply_exit_code = 1; })), /APPLY_EXIT_NOT_ZERO/));
test("postcheck fail -> FAIL", () => assert.throws(() => validateStep01WorkoutDeliveryApply(fixture((r) => { r.postcheck_exit_code = 1; })), /POSTCHECK_EXIT_NOT_ZERO/));
test("smoke fail -> FAIL", () => assert.throws(() => validateStep01WorkoutDeliveryApply(fixture((r) => { r.smoke_exit_code = 1; })), /SMOKE_EXIT_NOT_ZERO/));
test("residual rows > 0 -> FAIL", () => assert.throws(() => validateStep01WorkoutDeliveryApply(fixture((r) => { r.smoke_residual_rows = 1; })), /SMOKE_RESIDUAL_ROWS_NOT_ZERO/));
test("recovery true -> FAIL", () => assert.throws(() => validateStep01WorkoutDeliveryApply(fixture((r) => { r.recovery_executed = true; })), /RECOVERY_EXECUTED/));
test("Step02 authorized -> FAIL", () => assert.throws(() => validateStep01WorkoutDeliveryApply(fixture((r) => { r.step02_authorized = true; })), /STEP02_AUTHORIZED/));
test("db push true -> FAIL", () => assert.throws(() => validateStep01WorkoutDeliveryApply(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("history alignment true -> FAIL", () => assert.throws(() => validateStep01WorkoutDeliveryApply(fixture((r) => { r.history_alignment_allowed = true; })), /HISTORY_ALIGNMENT_ALLOWED/));
test("valid success -> PASS", () => assert.equal(validateStep01WorkoutDeliveryApply(fixture()).decision, "STEP01_WORKOUT_DELIVERY_APPLIED_AND_VALIDATED"));
