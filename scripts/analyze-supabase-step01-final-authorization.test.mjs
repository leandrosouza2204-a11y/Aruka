import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep01FinalAuthorization } from "./analyze-supabase-step01-final-authorization.mjs";

function valid() {
  return {
    decision: "READY_FOR_STEP01_APPLY_AUTHORIZATION",
    step01_precheck_exit_code: 0,
    project_verified: true,
    rollback_confirmed: true,
    remote_mutation_executed: false,
    blocking_remote_drift_count: 0,
    untraceable_statement_count: 0,
    apply_sql_unchanged: true,
    apply_compatible_with_remote_state: true,
    recovery_available: true,
    recovery_reviewed: true,
    postcheck_available: true,
    smoke_plan_available: true,
    step01_apply_authorized: false,
    step01_apply_executed: false,
    step01_postcheck_executed: false,
    step01_smoke_executed: false,
    blockers: [],
    next_action: "USER_EXPLICIT_STEP01_APPLY_AUTHORIZATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step01-final-auth-"));
  const dir = join(root, "reports/supabase-production-sync");
  mkdirSync(dir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(dir, "step01-final-authorization-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  return root;
}

test("precheck exit !=0 -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.step01_precheck_exit_code = 1; })), /PRECHECK_EXIT_NOT_ZERO/));
test("project false -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.project_verified = false; })), /PROJECT_NOT_VERIFIED/));
test("rollback false -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.rollback_confirmed = false; })), /ROLLBACK_NOT_CONFIRMED/));
test("remote mutation true -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.remote_mutation_executed = true; })), /REMOTE_MUTATION_EXECUTED/));
test("blocking drift >0 -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.blocking_remote_drift_count = 1; })), /READY_BLOCKING_DRIFT/));
test("untraceable statement >0 -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.untraceable_statement_count = 1; })), /UNTRACEABLE_STATEMENTS/));
test("apply changed -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.apply_sql_unchanged = false; })), /APPLY_SQL_CHANGED/));
test("apply incompatible -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.apply_compatible_with_remote_state = false; })), /APPLY_INCOMPATIBLE/));
test("recovery missing -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.recovery_available = false; })), /RECOVERY_MISSING/));
test("postcheck missing -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.postcheck_available = false; })), /POSTCHECK_MISSING/));
test("smoke missing -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.smoke_plan_available = false; })), /SMOKE_PLAN_MISSING/));
test("apply authorized true -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.step01_apply_authorized = true; })), /APPLY_AUTHORIZED/));
test("apply executed true -> FAIL", () => assert.throws(() => validateStep01FinalAuthorization(fixture((r) => { r.step01_apply_executed = true; })), /APPLY_EXECUTED/));
test("valid READY -> PASS", () => assert.equal(validateStep01FinalAuthorization(fixture()).decision, "READY_FOR_STEP01_APPLY_AUTHORIZATION"));
test("valid NO_GO -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "NO_GO_STEP01_FINAL_AUTHORIZATION";
    r.blocking_remote_drift_count = 1;
    r.blockers = ["BLOCKING_REMOTE_DRIFT"];
    r.next_action = "INVESTIGATE_STEP01_FINAL_AUTHORIZATION_BLOCKER";
  });
  assert.equal(validateStep01FinalAuthorization(root).decision, "NO_GO_STEP01_FINAL_AUTHORIZATION");
});
