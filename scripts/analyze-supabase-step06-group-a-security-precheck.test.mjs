import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep06GroupASecurityPrecheck } from "./analyze-supabase-step06-group-a-security-precheck.mjs";

function valid() {
  return {
    decision: "GO_FOR_STEP06_APPLY_AUTHORIZATION",
    project: "aruka",
    project_ref_masked: "vriz...vdik",
    project_verified: true,
    precheck_exit_code: 0,
    target_functions: ["public.set_workout_templates_updated_at()"],
    target_triggers: ["public.workout_templates.set_workout_templates_updated_at"],
    target_tables: ["public.workout_templates"],
    target_roles: ["public", "anon", "authenticated"],
    security_operations: [
      "ALTER FUNCTION public.set_workout_templates_updated_at() SET search_path = public",
      "REVOKE EXECUTE ON FUNCTION public.set_workout_templates_updated_at() FROM public",
      "REVOKE EXECUTE ON FUNCTION public.set_workout_templates_updated_at() FROM anon",
      "REVOKE EXECUTE ON FUNCTION public.set_workout_templates_updated_at() FROM authenticated"
    ],
    target_function_count: 1,
    target_function_present: true,
    function_signature_state: "PASS",
    body_state: "COMPATIBLE",
    body_mutation_expected: false,
    search_path_state: "EXPECTED_REMOTE_DRIFT_COVERED_BY_APPLY",
    security_mode_state: "ALREADY_PRESENT_SKIP_SAFE",
    trigger_state: "ALREADY_PRESENT_SKIP_SAFE",
    grants_state: "EXPECTED_REMOTE_DRIFT_COVERED_BY_APPLY",
    already_present_count: 0,
    expected_drift_count: 1,
    compatible_variation_count: 0,
    blocking_drift_count: 0,
    apply_sql_hash: "343CF76EC22DA674EC035C74D80FDEF8F2B34F83F223C73A30B549B83C95643C",
    apply_sql_traceable: true,
    untraceable_statement_count: 0,
    apply_sql_unchanged: true,
    precheck_read_only: true,
    recovery_available: true,
    postcheck_available: true,
    runtime_requirement: "GROUP_A_POSTCHECK_SUFFICIENT",
    rollback_confirmed: true,
    step06_apply_authorized: false,
    step06_apply_executed: false,
    history_alignment_allowed: false,
    next_action: "USER_EXPLICIT_STEP06_APPLY_AUTHORIZATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step06-precheck-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step06-group-a-security-precheck-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step06-group-a-security-precheck-summary.md"), "Step06 Group A precheck\n");
  writeFileSync(join(docsDir, "38-step06-group-a-security-precheck.md"), "Step06 Group A precheck\n");
  return root;
}

test("project false -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.project_verified = false; })), /GO_PROJECT_NOT_VERIFIED/));
test("precheck exit !=0 -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.precheck_exit_code = 1; })), /GO_PRECHECK_EXIT_INVALID/));
test("target missing -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.target_function_present = false; })), /GO_TARGET_MISSING/));
test("signature fail -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.function_signature_state = "FAIL"; })), /GO_SIGNATURE_NOT_PASS/));
test("body blocking -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.body_state = "BLOCKING"; })), /GO_BODY_BLOCKING/));
test("trigger blocking -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.trigger_state = "BLOCKING_GROUP_A_DRIFT"; })), /GO_TRIGGER_BLOCKING/));
test("blocking drift >0 -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.blocking_drift_count = 1; })), /GO_BLOCKING_DRIFT/));
test("traceability false -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.apply_sql_traceable = false; })), /APPLY_NOT_TRACEABLE/));
test("untraceable >0 -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.untraceable_statement_count = 1; })), /UNTRACEABLE_SQL/));
test("recovery false -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.recovery_available = false; })), /RECOVERY_NOT_AVAILABLE/));
test("postcheck false -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.postcheck_available = false; })), /POSTCHECK_NOT_AVAILABLE/));
test("rollback false -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.rollback_confirmed = false; })), /GO_ROLLBACK_NOT_CONFIRMED/));
test("apply authorized true -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.step06_apply_authorized = true; })), /APPLY_AUTHORIZED/));
test("apply executed true -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.step06_apply_executed = true; })), /APPLY_EXECUTED/));
test("history alignment true -> FAIL", () => assert.throws(() => validateStep06GroupASecurityPrecheck(fixture((r) => { r.history_alignment_allowed = true; })), /HISTORY_ALIGNMENT_ALLOWED/));
test("valid GO -> PASS", () => assert.equal(validateStep06GroupASecurityPrecheck(fixture()).decision, "GO_FOR_STEP06_APPLY_AUTHORIZATION"));
test("valid NO_GO -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "NO_GO_STEP06";
    r.blockers = ["BLOCKING_GROUP_A_DRIFT"];
    r.next_action = "FIX_ONLY_STEP06_GROUP_A_BLOCKER";
  });
  assert.equal(validateStep06GroupASecurityPrecheck(root).decision, "NO_GO_STEP06");
});
test("valid AWAITING -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "AWAITING_SECURE_STEP06_PRECHECK_EXECUTION";
    r.project_verified = false;
    r.precheck_exit_code = null;
    r.target_function_present = null;
    r.function_signature_state = null;
    r.search_path_state = null;
    r.security_mode_state = null;
    r.trigger_state = null;
    r.grants_state = null;
    r.already_present_count = null;
    r.expected_drift_count = null;
    r.blocking_drift_count = null;
    r.rollback_confirmed = null;
    r.production_executed = false;
    r.next_action = "USER_EXECUTE_STEP06_PRECHECK_RUNNER";
  });
  assert.equal(validateStep06GroupASecurityPrecheck(root).decision, "AWAITING_SECURE_STEP06_PRECHECK_EXECUTION");
});
