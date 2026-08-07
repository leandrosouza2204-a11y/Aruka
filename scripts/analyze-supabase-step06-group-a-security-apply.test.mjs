import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep06GroupASecurityApply } from "./analyze-supabase-step06-group-a-security-apply.mjs";

function valid() {
  return {
    decision: "STEP06_GROUP_A_SECURITY_APPLIED_AND_VALIDATED",
    project: "aruka",
    project_ref_masked: "vriz...vdik",
    fresh_precheck_result: "PASS",
    apply_sql_hash: "343CF76EC22DA674EC035C74D80FDEF8F2B34F83F223C73A30B549B83C95643C",
    apply_exit_code: 0,
    apply_result: "PASS",
    postcheck_exit_code: 0,
    postcheck_result: "PASS",
    function_body_preserved: true,
    search_path_reconciled: true,
    public_execute_final: false,
    anon_execute_final: false,
    authenticated_execute_final: false,
    trigger_state: "PASS",
    group_a_security_production_reconciled: true,
    recovery_executed: false,
    history_alignment_authorized: false,
    history_alignment_executed: false,
    db_push_allowed: false,
    next_action: "PRODUCTION_MIGRATION_HISTORY_ALIGNMENT_DISCOVERY"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step06-apply-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step06-group-a-security-apply-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step06-group-a-security-apply-summary.md"), "Step06 apply PASS\n");
  writeFileSync(join(docsDir, "39-step06-group-a-security-production-apply.md"), "Step06 production apply PASS\n");
  return root;
}

test("apply fail -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.apply_result = "FAIL"; })), /APPLY_NOT_PASS/));
test("postcheck fail -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.postcheck_result = "FAIL"; })), /POSTCHECK_NOT_PASS/));
test("body preserved false -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.function_body_preserved = false; })), /FUNCTION_BODY_NOT_PRESERVED/));
test("search_path false -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.search_path_reconciled = false; })), /SEARCH_PATH_NOT_RECONCILED/));
test("public execute true -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.public_execute_final = true; })), /PUBLIC_EXECUTE_FINAL_TRUE/));
test("anon execute true -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.anon_execute_final = true; })), /ANON_EXECUTE_FINAL_TRUE/));
test("authenticated execute true -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.authenticated_execute_final = true; })), /AUTHENTICATED_EXECUTE_FINAL_TRUE/));
test("trigger fail -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.trigger_state = "FAIL"; })), /TRIGGER_NOT_PASS/));
test("production reconciled false -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.group_a_security_production_reconciled = false; })), /GROUP_A_SECURITY_NOT_RECONCILED/));
test("recovery true -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.recovery_executed = true; })), /RECOVERY_EXECUTED/));
test("history alignment true -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.history_alignment_authorized = true; })), /HISTORY_ALIGNMENT_AUTHORIZED/));
test("db push true -> FAIL", () => assert.throws(() => validateStep06GroupASecurityApply(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("valid success -> PASS", () => assert.equal(validateStep06GroupASecurityApply(fixture()).decision, "STEP06_GROUP_A_SECURITY_APPLIED_AND_VALIDATED"));
