import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateStep01Precheck } from "./analyze-supabase-step01-workout-delivery-precheck.mjs";

function baseResult() {
  return {
    decision: "GO_FOR_STEP01_APPLY_REVIEW",
    backup_verified: true,
    restore_method_reviewed: true,
    supervised_cutover_start_authorized: true,
    step01_precheck_authorized: true,
    step01_precheck_read_only: true,
    step01_precheck_executed: true,
    step01_precheck_exit_code: 0,
    blocking_remote_drift_count: 0,
    apply_sql_traceable: true,
    apply_sql_unchanged: true,
    recovery_available: true,
    project_verified: true,
    step01_apply_authorized: false,
    step01_apply_executed: false,
    step01_postcheck_executed: false,
    step01_smoke_executed: false,
    blockers: [],
    next_action: "USER_REVIEW_AND_STEP01_APPLY_AUTHORIZATION"
  };
}

function baseEvidence() {
  return {
    authorization: {
      step01_apply_authorized: false
    },
    step: {
      apply_executed: false
    }
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "step01-precheck-"));
  const base = join(root, "reports/supabase-production-sync");
  mkdirSync(base, { recursive: true });
  mkdirSync(join(root, "docs/supabase-production-sync"), { recursive: true });
  const result = baseResult();
  const evidence = baseEvidence();
  mutator(result, evidence);
  writeFileSync(join(base, "step01-workout-delivery-precheck-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(base, "step01-workout-delivery-precheck-evidence.json"), `${JSON.stringify(evidence, null, 2)}\n`);
  writeFileSync(join(base, "step01-workout-delivery-precheck-summary.md"), "# Summary\n");
  writeFileSync(join(root, "docs/supabase-production-sync/27-step01-workout-delivery-precheck.md"), "# Doc\n");
  return root;
}

test("backup false -> FAIL", () => {
  assert.throws(() => validateStep01Precheck(fixture((result) => { result.backup_verified = false; })), /BACKUP_NOT_VERIFIED/);
});

test("project false -> FAIL for GO", () => {
  assert.throws(() => validateStep01Precheck(fixture((result) => { result.project_verified = false; })), /GO_PROJECT_NOT_VERIFIED/);
});

test("precheck not read-only -> FAIL", () => {
  assert.throws(() => validateStep01Precheck(fixture((result) => { result.step01_precheck_read_only = false; })), /STEP01_PRECHECK_NOT_READ_ONLY/);
});

test("precheck not executed -> FAIL for GO", () => {
  assert.throws(() => validateStep01Precheck(fixture((result) => { result.step01_precheck_executed = false; })), /GO_PRECHECK_NOT_EXECUTED/);
});

test("blocking drift >0 -> FAIL para GO", () => {
  assert.throws(() => validateStep01Precheck(fixture((result) => { result.blocking_remote_drift_count = 1; })), /GO_BLOCKING_DRIFT/);
});

test("apply authorized=true -> FAIL", () => {
  assert.throws(() => validateStep01Precheck(fixture((result) => { result.step01_apply_authorized = true; })), /STEP01_APPLY_AUTHORIZED/);
});

test("apply executed=true -> FAIL", () => {
  assert.throws(() => validateStep01Precheck(fixture((result) => { result.step01_apply_executed = true; })), /STEP01_APPLY_EXECUTED/);
});

test("postcheck executed=true -> FAIL", () => {
  assert.throws(() => validateStep01Precheck(fixture((result) => { result.step01_postcheck_executed = true; })), /STEP01_POSTCHECK_EXECUTED/);
});

test("smoke executed=true -> FAIL", () => {
  assert.throws(() => validateStep01Precheck(fixture((result) => { result.step01_smoke_executed = true; })), /STEP01_SMOKE_EXECUTED/);
});

test("apply changed -> FAIL for GO", () => {
  assert.throws(() => validateStep01Precheck(fixture((result) => { result.apply_sql_unchanged = false; })), /GO_APPLY_SQL_CHANGED/);
});

test("valid GO state -> PASS", () => {
  assert.equal(validateStep01Precheck(fixture()).decision, "GO_FOR_STEP01_APPLY_REVIEW");
});

test("valid NO_GO state -> PASS", () => {
  const root = fixture((result) => {
    result.decision = "NO_GO_STEP01";
    result.project_verified = false;
    result.step01_precheck_executed = false;
    result.step01_precheck_exit_code = null;
    result.blocking_remote_drift_count = 1;
    result.apply_sql_unchanged = null;
    result.blockers = ["REMOTE_PRECHECK_CLIENT_UNAVAILABLE"];
    result.next_action = "INVESTIGATE_STEP01_BLOCKER";
  });
  assert.equal(validateStep01Precheck(root).decision, "NO_GO_STEP01");
});

test("valid awaiting secure execution state -> PASS", () => {
  const root = fixture((result) => {
    result.decision = "AWAITING_SECURE_STEP01_PRECHECK_EXECUTION";
    result.project_verified = false;
    result.step01_precheck_executed = false;
    result.step01_precheck_exit_code = null;
    result.blocking_remote_drift_count = 0;
    result.apply_sql_unchanged = true;
    result.remote_precheck_client = "DOCKER_PSQL";
    result.windows_psql_required = false;
    result.supabase_cli_global_required = false;
    result.persistent_link_required = false;
    result.blockers = [];
    result.next_action = "RUN_EXTERNAL_SECURE_STEP01_PRECHECK_RUNNER";
  });
  assert.equal(validateStep01Precheck(root).decision, "AWAITING_SECURE_STEP01_PRECHECK_EXECUTION");
});

test("secret scan catches db url pattern", () => {
  const root = fixture();
  const file = join(root, "reports/supabase-production-sync/step01-workout-delivery-precheck-summary.md");
  const uri = "postgres" + "ql://" + "user:pass@example.test/postgres";
  writeFileSync(file, `${readFileSync(file, "utf8")}${uri}\n`);
  assert.throws(() => validateStep01Precheck(root), /SECRET_SCAN_FAILED/);
});
