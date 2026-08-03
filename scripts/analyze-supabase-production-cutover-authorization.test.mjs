import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { validateAuthorization } from "./analyze-supabase-production-cutover-authorization.mjs";

const slugs = [
  "01-workout-delivery",
  "02-student-identity",
  "03-security-reconciliation",
  "04-required-fields",
  "05-aoe-security",
  "06-group-a-security"
];

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "cutover-auth-"));
  const base = join(root, "reports/supabase-production-sync");
  const dir = join(base, "production-cutover-sql");
  mkdirSync(dir, { recursive: true });
  mkdirSync(join(root, "docs/supabase-production-sync"), { recursive: true });
  const steps = slugs.map((slug, index) => ({
    step: String(index + 1).padStart(2, "0"),
    domain: slug,
    precheck_file: `${slug}-precheck.sql`,
    apply_file: `${slug}.sql`,
    postcheck_file: `${slug}-postcheck.sql`,
    recovery_file: `${slug}-recovery.md`,
    risk: "LOW",
    dependencies: [],
    transaction_strategy: "TRANSACTION_SAFE",
    lock_risk: "LOW_LOCK_RISK",
    downtime_expectation: "NO_EXPECTED_DOWNTIME",
    go_no_go_status: "GO_ONLY_AFTER_BACKUP_AND_PRECHECK_PASS",
    execution_authorized: false,
    status: "READY_FOR_REVIEW"
  }));
  for (const slug of slugs) {
    writeFileSync(join(dir, `${slug}-precheck.sql`), "select 'PASS_SKIP_STOP';\n");
    writeFileSync(join(dir, `${slug}-postcheck.sql`), "select 'PASS_SKIP_STOP';\n");
    writeFileSync(join(dir, `${slug}.sql`), "-- apply\nalter table public.alunos add column if not exists example text;\n");
    writeFileSync(join(dir, `${slug}-recovery.md`), "# Recovery\n\nAutomatic rollback is not authorized.\n");
  }
  writeFileSync(join(dir, "05-aoe-security.sql"), "revoke execute on function public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) from anon;\n");
  writeFileSync(join(dir, "06-group-a-security.sql"), "alter function public.set_workout_templates_updated_at() set search_path = public;\n");
  writeFileSync(join(dir, "manifest.json"), JSON.stringify({ production_execution_authorized: false, db_push_allowed: false, history_alignment_allowed_now: false, authorization_reviewed: true, cutover_backup_required: true, cutover_backup_verified: false, execution_method: "MANUAL_SUPERVISED_SQL_EDITOR", maintenance_window: { required: true, estimate: "30-60 min" }, steps }));
  writeFileSync(join(base, "production-cutover-source-traceability.json"), JSON.stringify({ status: "TRACEABILITY_COMPLETE", entries: steps }));
  writeFileSync(join(base, "production-cutover-smoke-test-plan.md"), "# Smoke\n");
  writeFileSync(join(base, "production-cutover-execution-checklist.md"), "# Checklist\n");
  writeFileSync(join(base, "production-cutover-authorization-result.json"), JSON.stringify({ decision: "READY_FOR_SUPERVISED_PRODUCTION_CUTOVER", steps_reviewed: 6, untraced_statements: 0, backup_verified: "NO", production_execution_authorized: "NO", db_push_allowed: "NO", history_alignment_allowed: "NO" }));
  writeFileSync(join(base, "production-cutover-authorization-summary.md"), "# Summary\n");
  writeFileSync(join(root, "docs/supabase-production-sync/24-production-cutover-authorization-review.md"), "# Doc\n");
  mutator(root, dir);
  return root;
}

test("backup_verified=true without evidence fails", () => {
  const root = fixture((root, dir) => {
    const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
    manifest.cutover_backup_verified = true;
    writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest));
  });
  assert.throws(() => validateAuthorization(root), /AUTHORIZATION_BACKUP_VERIFIED_WITHOUT_EVIDENCE/);
});

test("execution_authorized=true fails", () => {
  const root = fixture((root, dir) => {
    const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
    manifest.production_execution_authorized = true;
    writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest));
  });
  assert.throws(() => validateAuthorization(root), /AUTHORIZATION_EXECUTION_FORBIDDEN/);
});

test("db push enabled fails", () => {
  const root = fixture((root, dir) => {
    const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
    manifest.db_push_allowed = true;
    writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest));
  });
  assert.throws(() => validateAuthorization(root), /AUTHORIZATION_DB_PUSH_FORBIDDEN/);
});

test("history alignment enabled fails", () => {
  const root = fixture((root, dir) => {
    const manifest = JSON.parse(readFileSync(join(dir, "manifest.json"), "utf8"));
    manifest.history_alignment_allowed_now = true;
    writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest));
  });
  assert.throws(() => validateAuthorization(root), /AUTHORIZATION_HISTORY_ALIGNMENT_FORBIDDEN/);
});

test("missing step fails", () => {
  const root = fixture((root, dir) => rmSync(join(dir, "03-security-reconciliation.sql")));
  assert.throws(() => validateAuthorization(root), /MISSING_AUTHORIZATION_FILE/);
});

test("missing recovery fails", () => {
  const root = fixture((root, dir) => writeFileSync(join(dir, "04-required-fields-recovery.md"), "# Recovery\n"));
  assert.throws(() => validateAuthorization(root), /RECOVERY_POLICY_MISSING/);
});

test("untraced SQL fails", () => {
  const root = fixture((root) => writeFileSync(join(root, "reports/supabase-production-sync/production-cutover-authorization-result.json"), JSON.stringify({ decision: "READY_FOR_SUPERVISED_PRODUCTION_CUTOVER", steps_reviewed: 6, untraced_statements: 1, backup_verified: "NO", production_execution_authorized: "NO", db_push_allowed: "NO", history_alignment_allowed: "NO" })));
  assert.throws(() => validateAuthorization(root), /AUTHORIZATION_UNTRACED_SQL/);
});

test("valid review passes", () => {
  assert.doesNotThrow(() => validateAuthorization(fixture()));
});
