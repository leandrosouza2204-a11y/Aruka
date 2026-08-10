import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, renameSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateDbPushDryRun } from "./analyze-supabase-db-push-dry-run.mjs";

const BASELINE_HASH = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B";
const executableNames = [
  "20260728030000_workout_delivery_integration_v1.sql",
  "20260730090000_student_identity_contract.sql",
  "20260731190000_reconcile_security_policies_and_grants.sql",
  "20260801143335_reconcile_alunos_required_fields.sql",
  "20260801173000_revoke_aoe_idempotency_anon_execute.sql",
  "20260801180000_harden_workout_templates_updated_at.sql"
];

function validResult() {
  return {
    decision: "DB_PUSH_DRY_RUN_CLEAN",
    dry_run_executed: true,
    dry_run_exit_code: 0,
    pending_migration_count: 0,
    pending_versions: [],
    baseline_pending: false,
    authorized_history_migrations_pending: false,
    unexpected_pending_count: 0,
    db_push_needed: false,
    baseline_sha256_before: BASELINE_HASH,
    baseline_sha256_after: BASELINE_HASH,
    baseline_content_preserved: true,
    db_push_executed: false,
    db_push_allowed: false,
    production_mutation_executed: false
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "db-push-dry-run-"));
  mkdirSync(join(root, "reports/supabase-production-sync"), { recursive: true });
  mkdirSync(join(root, "docs/supabase-production-sync"), { recursive: true });
  mkdirSync(join(root, "supabase/migrations"), { recursive: true });
  mkdirSync(join(root, "supabase/reference-baselines"), { recursive: true });
  for (const name of executableNames) writeFileSync(join(root, "supabase/migrations", name), "-- sql\n");
  writeFileSync(join(root, "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql"), "-- baseline\n");
  const result = validResult();
  mutator(result, root);
  writeFileSync(join(root, "reports/supabase-production-sync/db-push-dry-run-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(root, "reports/supabase-production-sync/db-push-dry-run-summary.md"), "Dry-run summary\n");
  writeFileSync(join(root, "docs/supabase-production-sync/45-reference-only-baseline-separation.md"), "Baseline separation\n");
  return root;
}

test("dry-run executed=false with result -> FAIL", () => assert.throws(() => validateDbPushDryRun(fixture((r) => { r.dry_run_executed = false; })), /DRY_RUN_NOT_EXECUTED/));
test("exit !=0 -> FAIL final", () => assert.throws(() => validateDbPushDryRun(fixture((r) => { r.dry_run_exit_code = 1; })), /DRY_RUN_EXIT_CODE_INVALID/));
test("pending >0 -> FAIL final", () => assert.throws(() => validateDbPushDryRun(fixture((r) => { r.pending_migration_count = 1; r.pending_versions = ["20260716090000"]; })), /PENDING_MIGRATIONS/));
test("baseline pending -> FAIL", () => assert.throws(() => validateDbPushDryRun(fixture((r) => { r.baseline_pending = true; })), /BASELINE_PENDING/));
test("authorized history pending -> FAIL", () => assert.throws(() => validateDbPushDryRun(fixture((r) => { r.authorized_history_migrations_pending = true; })), /AUTHORIZED_HISTORY_MIGRATIONS_PENDING/));
test("unexpected pending -> FAIL", () => assert.throws(() => validateDbPushDryRun(fixture((r) => { r.unexpected_pending_count = 1; })), /UNEXPECTED_PENDING_MIGRATIONS/));
test("db push needed=true -> FAIL", () => assert.throws(() => validateDbPushDryRun(fixture((r) => { r.db_push_needed = true; })), /DB_PUSH_NEEDED/));
test("db push executed=true -> FAIL", () => assert.throws(() => validateDbPushDryRun(fixture((r) => { r.db_push_executed = true; })), /DB_PUSH_EXECUTED/));
test("db push allowed=true -> FAIL", () => assert.throws(() => validateDbPushDryRun(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("production mutation=true -> FAIL", () => assert.throws(() => validateDbPushDryRun(fixture((r) => { r.production_mutation_executed = true; })), /PRODUCTION_MUTATION_EXECUTED/));
test("valid clean dry-run -> PASS", () => assert.equal(validateDbPushDryRun(fixture()).decision, "DB_PUSH_DRY_RUN_CLEAN"));
test("baseline still executable -> FAIL", () => assert.throws(() => validateDbPushDryRun(fixture((_, root) => { renameSync(join(root, "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql"), join(root, "supabase/migrations/20260716090000_baseline_aruka_v1.sql")); })), /BASELINE_STILL_EXECUTABLE/));
