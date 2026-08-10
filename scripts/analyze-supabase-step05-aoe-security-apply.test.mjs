import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep05AoeSecurityApply } from "./analyze-supabase-step05-aoe-security-apply.mjs";

function valid() {
  return {
    decision: "STEP05_AOE_SECURITY_APPLIED_AND_VALIDATED",
    project: "aruka",
    project_ref_masked: "vriz...vdik",
    fresh_precheck_result: "PASS",
    target_function: "public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text)",
    target_role: "anon",
    apply_sql_hash: "CEE9E1BFDE421B2C85480C1EB2C0DAFA4FDA994F94832DA777B85508657B8CF4",
    apply_exit_code: 0,
    apply_result: "PASS",
    postcheck_exit_code: 0,
    postcheck_result: "PASS",
    anon_execute_final: false,
    aoe_security_production_reconciled: true,
    recovery_executed: false,
    step06_authorized: false,
    step06_executed: false,
    db_push_allowed: false,
    history_alignment_allowed: false,
    next_action: "STEP06_GROUP_A_SECURITY_PRECHECK_PREPARATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step05-apply-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step05-aoe-security-apply-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step05-aoe-security-apply-summary.md"), "Step05 apply PASS\n");
  writeFileSync(join(docsDir, "37-step05-aoe-security-production-apply.md"), "Step05 production apply PASS\n");
  return root;
}

test("apply fail -> FAIL", () => assert.throws(() => validateStep05AoeSecurityApply(fixture((r) => { r.apply_result = "FAIL"; })), /APPLY_NOT_PASS/));
test("postcheck fail -> FAIL", () => assert.throws(() => validateStep05AoeSecurityApply(fixture((r) => { r.postcheck_result = "FAIL"; })), /POSTCHECK_NOT_PASS/));
test("anon execute final true -> FAIL", () => assert.throws(() => validateStep05AoeSecurityApply(fixture((r) => { r.anon_execute_final = true; })), /ANON_EXECUTE_FINAL_TRUE/));
test("reconciled false -> FAIL", () => assert.throws(() => validateStep05AoeSecurityApply(fixture((r) => { r.aoe_security_production_reconciled = false; })), /AOE_SECURITY_NOT_RECONCILED/));
test("recovery true -> FAIL", () => assert.throws(() => validateStep05AoeSecurityApply(fixture((r) => { r.recovery_executed = true; })), /RECOVERY_EXECUTED/));
test("Step06 authorized -> FAIL", () => assert.throws(() => validateStep05AoeSecurityApply(fixture((r) => { r.step06_authorized = true; })), /STEP06_AUTHORIZED/));
test("db push true -> FAIL", () => assert.throws(() => validateStep05AoeSecurityApply(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("history alignment true -> FAIL", () => assert.throws(() => validateStep05AoeSecurityApply(fixture((r) => { r.history_alignment_allowed = true; })), /HISTORY_ALIGNMENT_ALLOWED/));
test("valid success -> PASS", () => assert.equal(validateStep05AoeSecurityApply(fixture()).decision, "STEP05_AOE_SECURITY_APPLIED_AND_VALIDATED"));
