import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep05AoeSecurityPrecheck } from "./analyze-supabase-step05-aoe-security-precheck.mjs";

function valid() {
  return {
    decision: "GO_FOR_STEP05_APPLY_AUTHORIZATION",
    project: "aruka",
    project_ref_masked: "vriz...vdik",
    project_verified: true,
    precheck_exit_code: 0,
    target_functions: [
      "public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text)"
    ],
    target_roles: ["anon"],
    security_operations: [
      "REVOKE EXECUTE ON FUNCTION public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) FROM anon"
    ],
    target_function_count: 1,
    target_functions_present: true,
    body_mutation_expected: false,
    already_present_count: 0,
    expected_drift_count: 1,
    compatible_variation_count: 0,
    blocking_drift_count: 0,
    apply_sql_hash: "CEE9E1BFDE421B2C85480C1EB2C0DAFA4FDA994F94832DA777B85508657B8CF4",
    apply_sql_traceable: true,
    untraceable_statement_count: 0,
    apply_sql_unchanged: true,
    precheck_read_only: true,
    recovery_available: true,
    postcheck_available: true,
    runtime_requirement: "AOE_SECURITY_POSTCHECK_SUFFICIENT",
    rollback_confirmed: true,
    step05_apply_authorized: false,
    step05_apply_executed: false,
    step06_authorized: false,
    next_action: "USER_EXPLICIT_STEP05_APPLY_AUTHORIZATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step05-precheck-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step05-aoe-security-precheck-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step05-aoe-security-precheck-summary.md"), "Step05 AOE security precheck\n");
  writeFileSync(join(docsDir, "36-step05-aoe-security-precheck.md"), "Step05 AOE security precheck\n");
  return root;
}

test("project false -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.project_verified = false; })), /GO_PROJECT_NOT_VERIFIED/));
test("precheck exit != 0 -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.precheck_exit_code = 1; })), /GO_PRECHECK_EXIT_INVALID/));
test("precheck execution failed because runtime SQL is invalid -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.runtime_sql_invalid = true; })), /RUNTIME_SQL_INVALID/));
test("function missing -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.target_functions_present = false; })), /GO_TARGET_FUNCTION_MISSING/));
test("body mutation expected -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.body_mutation_expected = true; })), /BODY_MUTATION_EXPECTED/));
test("blocking drift > 0 -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.blocking_drift_count = 1; })), /GO_BLOCKING_DRIFT/));
test("traceability false -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.apply_sql_traceable = false; })), /APPLY_NOT_TRACEABLE/));
test("untraceable > 0 -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.untraceable_statement_count = 1; })), /UNTRACEABLE_SQL/));
test("recovery unavailable -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.recovery_available = false; })), /RECOVERY_UNAVAILABLE/));
test("postcheck unavailable -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.postcheck_available = false; })), /POSTCHECK_UNAVAILABLE/));
test("rollback false -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.rollback_confirmed = false; })), /GO_ROLLBACK_NOT_CONFIRMED/));
test("apply authorized true -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.step05_apply_authorized = true; })), /APPLY_AUTHORIZED/));
test("apply executed true -> FAIL", () => assert.throws(() => validateStep05AoeSecurityPrecheck(fixture((r) => { r.step05_apply_executed = true; })), /APPLY_EXECUTED/));
test("valid GO -> PASS", () => assert.equal(validateStep05AoeSecurityPrecheck(fixture()).decision, "GO_FOR_STEP05_APPLY_AUTHORIZATION"));
test("valid GO with anon execute present -> PASS", () => {
  const root = fixture((r) => {
    r.expected_drift_count = 1;
    r.already_present_count = 0;
    r.blocking_drift_count = 0;
  });
  assert.equal(validateStep05AoeSecurityPrecheck(root).decision, "GO_FOR_STEP05_APPLY_AUTHORIZATION");
});
test("valid GO with anon execute absent -> PASS", () => {
  const root = fixture((r) => {
    r.expected_drift_count = 0;
    r.already_present_count = 1;
    r.blocking_drift_count = 0;
  });
  assert.equal(validateStep05AoeSecurityPrecheck(root).decision, "GO_FOR_STEP05_APPLY_AUTHORIZATION");
});
test("valid NO_GO -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "NO_GO_STEP05";
    r.blockers = ["BLOCKING_AOE_SECURITY_DRIFT"];
    r.next_action = "FIX_ONLY_STEP05_AOE_SECURITY_BLOCKER";
  });
  assert.equal(validateStep05AoeSecurityPrecheck(root).decision, "NO_GO_STEP05");
});
test("valid AWAITING -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "AWAITING_SECURE_STEP05_PRECHECK_RETRY";
    r.project_verified = false;
    r.precheck_exit_code = null;
    r.target_functions_present = null;
    r.already_present_count = null;
    r.expected_drift_count = null;
    r.blocking_drift_count = null;
    r.rollback_confirmed = null;
    r.production_executed = false;
    r.next_action = "USER_EXECUTE_STEP05_PRECHECK_RUNNER";
  });
  assert.equal(validateStep05AoeSecurityPrecheck(root).decision, "AWAITING_SECURE_STEP05_PRECHECK_RETRY");
});
