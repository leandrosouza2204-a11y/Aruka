import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep02StudentIdentityApply } from "./analyze-supabase-step02-student-identity-apply.mjs";

function valid() {
  return {
    decision: "STEP02_STUDENT_IDENTITY_APPLIED_AND_VALIDATED",
    project: "aruka",
    project_ref_masked: "vriz...vdik",
    fresh_precheck_result: "PASS",
    apply_sql_hash: "93C0AD41BD51551BF0F0A6516AC1FD5B3915C724DD1109E2E1CEBBD1AB04D170",
    apply_result: "PASS",
    postcheck_result: "PASS",
    runtime_exit_code: 0,
    runtime_result: "PASS",
    smoke_result: "PASS",
    smoke_residual_rows: 0,
    recovery_executed: false,
    production_reconciled: true,
    step03_authorized: false,
    step03_executed: false,
    db_push_allowed: false,
    history_alignment_allowed: false,
    next_action: "STEP03_SECURITY_PRECHECK_PREPARATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step02-apply-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step02-student-identity-apply-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step02-student-identity-apply-summary.md"), "Step02 apply PASS\n");
  writeFileSync(join(docsDir, "31-step02-student-identity-production-apply.md"), "Step02 production apply PASS\n");
  return root;
}

test("apply fail -> FAIL", () => assert.throws(() => validateStep02StudentIdentityApply(fixture((r) => { r.apply_result = "FAIL"; })), /APPLY_NOT_PASS/));
test("postcheck fail -> FAIL", () => assert.throws(() => validateStep02StudentIdentityApply(fixture((r) => { r.postcheck_result = "FAIL"; })), /POSTCHECK_NOT_PASS/));
test("runtime fail -> FAIL", () => assert.throws(() => validateStep02StudentIdentityApply(fixture((r) => { r.runtime_result = "FAIL"; })), /RUNTIME_NOT_PASS/));
test("residual rows >0 -> FAIL", () => assert.throws(() => validateStep02StudentIdentityApply(fixture((r) => { r.smoke_residual_rows = 1; })), /SMOKE_RESIDUAL_ROWS_NOT_ZERO/));
test("recovery true -> FAIL", () => assert.throws(() => validateStep02StudentIdentityApply(fixture((r) => { r.recovery_executed = true; })), /RECOVERY_EXECUTED/));
test("Step03 authorized -> FAIL", () => assert.throws(() => validateStep02StudentIdentityApply(fixture((r) => { r.step03_authorized = true; })), /STEP03_AUTHORIZED/));
test("db push true -> FAIL", () => assert.throws(() => validateStep02StudentIdentityApply(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("history alignment true -> FAIL", () => assert.throws(() => validateStep02StudentIdentityApply(fixture((r) => { r.history_alignment_allowed = true; })), /HISTORY_ALIGNMENT_ALLOWED/));
test("valid success -> PASS", () => assert.equal(validateStep02StudentIdentityApply(fixture()).decision, "STEP02_STUDENT_IDENTITY_APPLIED_AND_VALIDATED"));
