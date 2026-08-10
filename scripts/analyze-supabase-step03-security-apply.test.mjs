import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep03SecurityApply } from "./analyze-supabase-step03-security-apply.mjs";

function valid() {
  return {
    decision: "STEP03_SECURITY_RECONCILIATION_APPLIED_AND_VALIDATED",
    project: "aruka",
    project_ref_masked: "vriz...vdik",
    fresh_precheck_result: "PASS",
    apply_sql_hash: "BD2753069A1F2F6565AFD1E846872D1E48EA5A4FE24F413415C8E66BC3392D54",
    apply_exit_code: 0,
    apply_result: "PASS",
    postcheck_exit_code: 0,
    postcheck_result: "PASS",
    security_production_reconciled: true,
    recovery_executed: false,
    step04_authorized: false,
    step04_executed: false,
    db_push_allowed: false,
    history_alignment_allowed: false,
    next_action: "STEP04_REQUIRED_FIELDS_PRECHECK_PREPARATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step03-apply-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step03-security-apply-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step03-security-apply-summary.md"), "Step03 apply PASS\n");
  writeFileSync(join(docsDir, "33-step03-security-production-apply.md"), "Step03 production apply PASS\n");
  return root;
}

test("apply fail -> FAIL", () => assert.throws(() => validateStep03SecurityApply(fixture((r) => { r.apply_result = "FAIL"; })), /APPLY_NOT_PASS/));
test("postcheck fail -> FAIL", () => assert.throws(() => validateStep03SecurityApply(fixture((r) => { r.postcheck_result = "FAIL"; })), /POSTCHECK_NOT_PASS/));
test("security reconciled false -> FAIL", () => assert.throws(() => validateStep03SecurityApply(fixture((r) => { r.security_production_reconciled = false; })), /SECURITY_NOT_RECONCILED/));
test("recovery true -> FAIL", () => assert.throws(() => validateStep03SecurityApply(fixture((r) => { r.recovery_executed = true; })), /RECOVERY_EXECUTED/));
test("Step04 authorized -> FAIL", () => assert.throws(() => validateStep03SecurityApply(fixture((r) => { r.step04_authorized = true; })), /STEP04_AUTHORIZED/));
test("db push true -> FAIL", () => assert.throws(() => validateStep03SecurityApply(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("history alignment true -> FAIL", () => assert.throws(() => validateStep03SecurityApply(fixture((r) => { r.history_alignment_allowed = true; })), /HISTORY_ALIGNMENT_ALLOWED/));
test("valid success -> PASS", () => assert.equal(validateStep03SecurityApply(fixture()).decision, "STEP03_SECURITY_RECONCILIATION_APPLIED_AND_VALIDATED"));
