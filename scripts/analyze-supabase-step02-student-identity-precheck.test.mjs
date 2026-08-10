import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep02StudentIdentityPrecheck } from "./analyze-supabase-step02-student-identity-precheck.mjs";

function valid() {
  return {
    decision: "GO_FOR_STEP02_APPLY_AUTHORIZATION",
    project: "aruka",
    project_verified: true,
    precheck_read_only: true,
    precheck_exit_code: 0,
    student_user_id_state: "EXPECTED_REMOTE_DRIFT_COVERED_BY_APPLY",
    fk_state: "EXPECTED_REMOTE_DRIFT_COVERED_BY_APPLY",
    indexes_state: "EXPECTED_REMOTE_DRIFT_COVERED_BY_APPLY",
    role_state: "EXPECTED_REMOTE_DRIFT_COVERED_BY_APPLY",
    rpcs_state: "EXPECTED_REMOTE_DRIFT_COVERED_BY_APPLY",
    rpc_grants_state: "EXPECTED_REMOTE_DRIFT_COVERED_BY_APPLY",
    duplicate_student_identity_count: 0,
    orphan_student_identity_count: 0,
    expected_remote_drift_count: 6,
    blocking_remote_drift_count: 0,
    apply_sql_hash: "93C0AD41BD51551BF0F0A6516AC1FD5B3915C724DD1109E2E1CEBBD1AB04D170",
    apply_sql_traceable: true,
    untraceable_statement_count: 0,
    apply_sql_unchanged: true,
    recovery_available: true,
    postcheck_available: true,
    runtime_qa_reusable: true,
    runtime_qa_classification: "EXISTING_RUNTIME_QA_REUSABLE",
    step02_apply_authorized: false,
    step02_apply_executed: false,
    production_executed: false,
    db_push_allowed: false,
    history_alignment_allowed: false,
    next_action: "USER_EXPLICIT_STEP02_APPLY_AUTHORIZATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step02-precheck-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step02-student-identity-precheck-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step02-student-identity-precheck-summary.md"), "Step02 Student Identity precheck\n");
  writeFileSync(join(docsDir, "30-step02-student-identity-precheck.md"), "Step02 Student Identity precheck\n");
  return root;
}

test("project false -> FAIL", () => assert.throws(() => validateStep02StudentIdentityPrecheck(fixture((r) => { r.project_verified = false; })), /GO_PROJECT_NOT_VERIFIED/));
test("precheck exit !=0 -> FAIL", () => assert.throws(() => validateStep02StudentIdentityPrecheck(fixture((r) => { r.precheck_exit_code = 1; })), /GO_PRECHECK_EXIT_INVALID/));
test("duplicate_count >0 -> FAIL", () => assert.throws(() => validateStep02StudentIdentityPrecheck(fixture((r) => { r.duplicate_student_identity_count = 1; })), /GO_DUPLICATE_IDENTITIES/));
test("orphan_count >0 -> FAIL", () => assert.throws(() => validateStep02StudentIdentityPrecheck(fixture((r) => { r.orphan_student_identity_count = 1; })), /GO_ORPHAN_IDENTITIES/));
test("blocking drift >0 -> FAIL", () => assert.throws(() => validateStep02StudentIdentityPrecheck(fixture((r) => { r.blocking_remote_drift_count = 1; })), /GO_BLOCKING_DRIFT/));
test("apply traceable false -> FAIL", () => assert.throws(() => validateStep02StudentIdentityPrecheck(fixture((r) => { r.apply_sql_traceable = false; })), /APPLY_NOT_TRACEABLE/));
test("apply authorized true -> FAIL", () => assert.throws(() => validateStep02StudentIdentityPrecheck(fixture((r) => { r.step02_apply_authorized = true; })), /APPLY_AUTHORIZED/));
test("apply executed true -> FAIL", () => assert.throws(() => validateStep02StudentIdentityPrecheck(fixture((r) => { r.step02_apply_executed = true; })), /APPLY_EXECUTED/));
test("valid GO -> PASS", () => assert.equal(validateStep02StudentIdentityPrecheck(fixture()).decision, "GO_FOR_STEP02_APPLY_AUTHORIZATION"));
test("valid NO_GO -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "NO_GO_STEP02";
    r.project_verified = false;
    r.blockers = ["PROJECT_NOT_VERIFIED"];
    r.next_action = "FIX_ONLY_STEP02_BLOCKER";
  });
  assert.equal(validateStep02StudentIdentityPrecheck(root).decision, "NO_GO_STEP02");
});
test("valid AWAITING -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "AWAITING_SECURE_STEP02_PRECHECK_EXECUTION";
    r.project_verified = null;
    r.precheck_exit_code = null;
    r.duplicate_student_identity_count = null;
    r.orphan_student_identity_count = null;
    r.blocking_remote_drift_count = null;
    r.next_action = "USER_EXECUTE_STEP02_PRECHECK_RUNNER";
  });
  assert.equal(validateStep02StudentIdentityPrecheck(root).decision, "AWAITING_SECURE_STEP02_PRECHECK_EXECUTION");
});
