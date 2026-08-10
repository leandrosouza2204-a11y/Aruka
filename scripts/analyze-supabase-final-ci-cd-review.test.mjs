import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateFinalCiCdReview } from "./analyze-supabase-final-ci-cd-review.mjs";

const BASELINE_HASH = "67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B";

function validResult() {
  return {
    decision: "READY_FOR_SUPABASE_FRONT_CLOSEOUT",
    manual_cutover_complete: true,
    manual_cutover_steps: 6,
    history_alignment_validated: true,
    remote_history_count: 6,
    executable_migration_count: 6,
    reference_baseline_count: 1,
    pending_migration_count: 0,
    db_push_needed: false,
    db_push_allowed: false,
    automatic_production_db_mutation_in_ci: false,
    baseline_contract_valid: true,
    required_validation_check_present: true,
    migration_hashes_preserved: true,
    reference_baseline_sha256: BASELINE_HASH,
    unit_tests: "NOT_CONFIGURED",
    lint: "PASS",
    build: "PASS",
    production_database_front_status: "CLOSED"
  };
}

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "final-ci-cd-"));
  mkdirSync(join(root, "reports/supabase-production-sync"), { recursive: true });
  mkdirSync(join(root, "docs/supabase-production-sync"), { recursive: true });
  mkdirSync(join(root, "supabase/migrations"), { recursive: true });
  mkdirSync(join(root, "supabase/reference-baselines"), { recursive: true });
  for (let i = 0; i < 6; i += 1) writeFileSync(join(root, "supabase/migrations", `2026080100000${i}_migration.sql`), "-- sql\n");
  writeFileSync(join(root, "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql"), "-- baseline\n");
  const result = validResult();
  mutator(result, root);
  writeFileSync(join(root, "reports/supabase-production-sync/final-ci-cd-review-result.json"), `${JSON.stringify(result, null, 2)}\n`);
  writeFileSync(join(root, "reports/supabase-production-sync/final-ci-cd-review-summary.md"), "Final closeout\n");
  writeFileSync(join(root, "docs/supabase-production-sync/47-final-ci-cd-review-and-closeout.md"), "Final closeout\n");
  return root;
}

test("manual cutover false -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.manual_cutover_complete = false; })), /MANUAL_CUTOVER_INCOMPLETE/));
test("steps !=6 -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.manual_cutover_steps = 5; })), /MANUAL_CUTOVER_STEPS_INVALID/));
test("history validation false -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.history_alignment_validated = false; })), /HISTORY_ALIGNMENT_NOT_VALIDATED/));
test("remote history !=6 -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.remote_history_count = 5; })), /REMOTE_HISTORY_COUNT_INVALID/));
test("executable migrations !=6 -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.executable_migration_count = 5; })), /EXECUTABLE_MIGRATION_COUNT_INVALID/));
test("reference baseline !=1 -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.reference_baseline_count = 0; })), /REFERENCE_BASELINE_COUNT_INVALID/));
test("pending migrations >0 -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.pending_migration_count = 1; })), /PENDING_MIGRATIONS/));
test("db push needed true -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.db_push_needed = true; })), /DB_PUSH_NEEDED/));
test("db push allowed true -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.db_push_allowed = true; })), /DB_PUSH_ALLOWED/));
test("automatic production mutation in CI true -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.automatic_production_db_mutation_in_ci = true; })), /AUTOMATIC_PRODUCTION_DB_MUTATION_IN_CI/));
test("baseline contract false -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.baseline_contract_valid = false; })), /BASELINE_CONTRACT_INVALID/));
test("required validation absent -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.required_validation_check_present = false; })), /REQUIRED_VALIDATION_CHECK_ABSENT/));
test("lint fail -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.lint = "FAIL"; })), /LINT_FAILED/));
test("build fail -> FAIL", () => assert.throws(() => validateFinalCiCdReview(fixture((r) => { r.build = "FAIL"; })), /BUILD_FAILED/));
test("valid closeout -> PASS", () => assert.equal(validateFinalCiCdReview(fixture()).decision, "READY_FOR_SUPABASE_FRONT_CLOSEOUT"));
