import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep03SecurityPrecheck } from "./analyze-supabase-step03-security-precheck.mjs";

function valid() {
  return {
    decision: "GO_FOR_STEP03_APPLY_AUTHORIZATION",
    project_verified: true,
    precheck_exit_code: 0,
    blocking_security_drift_count: 0,
    apply_sql_hash: "BD2753069A1F2F6565AFD1E846872D1E48EA5A4FE24F413415C8E66BC3392D54",
    apply_sql_traceable: true,
    untraceable_statement_count: 0,
    apply_sql_unchanged: true,
    recovery_available: true,
    postcheck_available: true,
    runtime_requirement: "SECURITY_POSTCHECK_SUFFICIENT",
    step03_apply_authorized: false,
    step03_apply_executed: false,
    next_action: "USER_EXPLICIT_STEP03_APPLY_AUTHORIZATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step03-precheck-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step03-security-precheck-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step03-security-precheck-summary.md"), "Step03 security precheck\n");
  writeFileSync(join(docsDir, "32-step03-security-precheck.md"), "Step03 security precheck\n");
  return root;
}

test("project false -> FAIL", () => assert.throws(() => validateStep03SecurityPrecheck(fixture((r) => { r.project_verified = false; })), /GO_PROJECT_NOT_VERIFIED/));
test("precheck exit !=0 -> FAIL", () => assert.throws(() => validateStep03SecurityPrecheck(fixture((r) => { r.precheck_exit_code = 1; })), /GO_PRECHECK_EXIT_INVALID/));
test("blocking drift >0 -> FAIL para GO", () => assert.throws(() => validateStep03SecurityPrecheck(fixture((r) => { r.blocking_security_drift_count = 1; })), /GO_BLOCKING_SECURITY_DRIFT/));
test("traceability false -> FAIL", () => assert.throws(() => validateStep03SecurityPrecheck(fixture((r) => { r.apply_sql_traceable = false; })), /APPLY_NOT_TRACEABLE/));
test("untraceable >0 -> FAIL", () => assert.throws(() => validateStep03SecurityPrecheck(fixture((r) => { r.untraceable_statement_count = 1; })), /UNTRACEABLE_SQL/));
test("recovery false -> FAIL", () => assert.throws(() => validateStep03SecurityPrecheck(fixture((r) => { r.recovery_available = false; })), /RECOVERY_NOT_AVAILABLE/));
test("postcheck false -> FAIL", () => assert.throws(() => validateStep03SecurityPrecheck(fixture((r) => { r.postcheck_available = false; })), /POSTCHECK_NOT_AVAILABLE/));
test("apply authorized true -> FAIL", () => assert.throws(() => validateStep03SecurityPrecheck(fixture((r) => { r.step03_apply_authorized = true; })), /APPLY_AUTHORIZED/));
test("apply executed true -> FAIL", () => assert.throws(() => validateStep03SecurityPrecheck(fixture((r) => { r.step03_apply_executed = true; })), /APPLY_EXECUTED/));
test("valid GO -> PASS", () => assert.equal(validateStep03SecurityPrecheck(fixture()).decision, "GO_FOR_STEP03_APPLY_AUTHORIZATION"));
test("valid NO_GO -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "NO_GO_STEP03";
    r.blockers = ["BLOCKING_REMOTE_SECURITY_DRIFT"];
    r.next_action = "FIX_ONLY_STEP03_BLOCKER";
  });
  assert.equal(validateStep03SecurityPrecheck(root).decision, "NO_GO_STEP03");
});
test("valid AWAITING -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "AWAITING_SECURE_STEP03_PRECHECK_EXECUTION";
    r.precheck_exit_code = null;
    r.production_executed = false;
    r.next_action = "USER_EXECUTE_STEP03_PRECHECK_RUNNER";
  });
  assert.equal(validateStep03SecurityPrecheck(root).decision, "AWAITING_SECURE_STEP03_PRECHECK_EXECUTION");
});
