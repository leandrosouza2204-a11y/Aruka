import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep04RequiredFieldsApply } from "./analyze-supabase-step04-required-fields-apply.mjs";

function valid() {
  return {
    decision: "STEP04_REQUIRED_FIELDS_APPLIED_AND_VALIDATED",
    project: "aruka",
    project_ref_masked: "vriz...vdik",
    fresh_precheck_result: "PASS",
    required_fields_data_gate: "PASS",
    required_columns: [
      "public.alunos.created_at",
      "public.alunos.user_id",
      "public.alunos.whatsapp"
    ],
    rows_reviewed: 26,
    null_counts: {
      "public.alunos.created_at": 0,
      "public.alunos.user_id": 0,
      "public.alunos.whatsapp": 0
    },
    total_null_count: 0,
    apply_sql_hash: "20A545B036CAD34D74548AE1BF15FA1EE96FBD5C40205F98C8275EB71EEA42D7",
    apply_exit_code: 0,
    apply_result: "PASS",
    postcheck_exit_code: 0,
    postcheck_result: "PASS",
    required_fields_production_reconciled: true,
    recovery_executed: false,
    step05_authorized: false,
    step05_executed: false,
    db_push_allowed: false,
    history_alignment_allowed: false,
    next_action: "STEP05_AOE_SECURITY_PRECHECK_PREPARATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step04-apply-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step04-required-fields-apply-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step04-required-fields-apply-summary.md"), "Step04 apply PASS\n");
  writeFileSync(join(docsDir, "35-step04-required-fields-production-apply.md"), "Step04 production apply PASS\n");
  return root;
}

test("data gate fail -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsApply(fixture((r) => { r.required_fields_data_gate = "FAIL"; })), /DATA_GATE_NOT_PASS/));
test("apply fail -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsApply(fixture((r) => { r.apply_result = "FAIL"; })), /APPLY_NOT_PASS/));
test("postcheck fail -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsApply(fixture((r) => { r.postcheck_result = "FAIL"; })), /POSTCHECK_NOT_PASS/));
test("reconciled false -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsApply(fixture((r) => { r.required_fields_production_reconciled = false; })), /REQUIRED_FIELDS_NOT_RECONCILED/));
test("recovery true -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsApply(fixture((r) => { r.recovery_executed = true; })), /RECOVERY_EXECUTED/));
test("Step05 authorized -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsApply(fixture((r) => { r.step05_authorized = true; })), /STEP05_AUTHORIZED/));
test("db push true -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsApply(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("history alignment true -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsApply(fixture((r) => { r.history_alignment_allowed = true; })), /HISTORY_ALIGNMENT_ALLOWED/));
test("valid success -> PASS", () => assert.equal(validateStep04RequiredFieldsApply(fixture()).decision, "STEP04_REQUIRED_FIELDS_APPLIED_AND_VALIDATED"));
