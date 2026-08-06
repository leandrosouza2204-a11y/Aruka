import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep04RequiredFieldsPrecheck } from "./analyze-supabase-step04-required-fields-precheck.mjs";

function valid() {
  return {
    decision: "GO_FOR_STEP04_APPLY_AUTHORIZATION",
    project: "aruka",
    project_ref_masked: "vriz...vdik",
    project_verified: true,
    precheck_exit_code: 0,
    required_columns: [
      "public.alunos.created_at",
      "public.alunos.user_id",
      "public.alunos.whatsapp"
    ],
    required_fields_data_gate: "PASS",
    rows_reviewed: 26,
    null_counts: {
      "public.alunos.created_at": 0,
      "public.alunos.user_id": 0,
      "public.alunos.whatsapp": 0
    },
    total_null_count: 0,
    already_present_count: 0,
    expected_drift_count: 3,
    compatible_variation_count: 0,
    blocking_drift_count: 0,
    apply_sql_hash: "20A545B036CAD34D74548AE1BF15FA1EE96FBD5C40205F98C8275EB71EEA42D7",
    apply_sql_traceable: true,
    untraceable_statement_count: 0,
    apply_sql_unchanged: true,
    precheck_read_only: true,
    recovery_available: true,
    postcheck_available: true,
    runtime_requirement: "REQUIRED_FIELDS_POSTCHECK_SUFFICIENT",
    step04_apply_authorized: false,
    step04_apply_executed: false,
    next_action: "USER_EXPLICIT_STEP04_APPLY_AUTHORIZATION"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step04-precheck-"));
  const reportDir = join(root, "reports/supabase-production-sync");
  const docsDir = join(root, "docs/supabase-production-sync");
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = valid();
  mutator(result);
  writeFileSync(join(reportDir, "step04-required-fields-precheck-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(reportDir, "step04-required-fields-precheck-summary.md"), "Step04 precheck\n");
  writeFileSync(join(docsDir, "34-step04-required-fields-precheck.md"), "Step04 precheck\n");
  return root;
}

test("project false -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsPrecheck(fixture((r) => { r.project_verified = false; })), /GO_PROJECT_NOT_VERIFIED/));
test("precheck exit !=0 -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsPrecheck(fixture((r) => { r.precheck_exit_code = 1; })), /GO_PRECHECK_EXIT_INVALID/));
test("null count >0 -> FAIL para GO", () => assert.throws(() => validateStep04RequiredFieldsPrecheck(fixture((r) => { r.total_null_count = 1; })), /GO_NULL_COUNT_NOT_ZERO/));
test("blocking drift >0 -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsPrecheck(fixture((r) => { r.blocking_drift_count = 1; })), /GO_BLOCKING_DRIFT/));
test("traceability false -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsPrecheck(fixture((r) => { r.apply_sql_traceable = false; })), /APPLY_NOT_TRACEABLE/));
test("untraceable >0 -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsPrecheck(fixture((r) => { r.untraceable_statement_count = 1; })), /UNTRACEABLE_SQL/));
test("recovery false -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsPrecheck(fixture((r) => { r.recovery_available = false; })), /RECOVERY_NOT_AVAILABLE/));
test("postcheck false -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsPrecheck(fixture((r) => { r.postcheck_available = false; })), /POSTCHECK_NOT_AVAILABLE/));
test("apply authorized true -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsPrecheck(fixture((r) => { r.step04_apply_authorized = true; })), /APPLY_AUTHORIZED/));
test("apply executed true -> FAIL", () => assert.throws(() => validateStep04RequiredFieldsPrecheck(fixture((r) => { r.step04_apply_executed = true; })), /APPLY_EXECUTED/));
test("valid GO -> PASS", () => assert.equal(validateStep04RequiredFieldsPrecheck(fixture()).decision, "GO_FOR_STEP04_APPLY_AUTHORIZATION"));
test("valid NO_GO -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "NO_GO_STEP04";
    r.blockers = ["NO_GO_STEP04_NULL_DATA_PRESENT"];
    r.next_action = "FIX_ONLY_STEP04_DATA_OR_SCHEMA_BLOCKER";
  });
  assert.equal(validateStep04RequiredFieldsPrecheck(root).decision, "NO_GO_STEP04");
});
test("valid AWAITING -> PASS", () => {
  const root = fixture((r) => {
    r.decision = "AWAITING_SECURE_STEP04_PRECHECK_EXECUTION";
    r.project_verified = false;
    r.precheck_exit_code = null;
    r.rows_reviewed = null;
    r.total_null_count = null;
    r.blocking_drift_count = null;
    r.production_executed = false;
    r.next_action = "USER_EXECUTE_STEP04_PRECHECK_RUNNER";
  });
  assert.equal(validateStep04RequiredFieldsPrecheck(root).decision, "AWAITING_SECURE_STEP04_PRECHECK_EXECUTION");
});
