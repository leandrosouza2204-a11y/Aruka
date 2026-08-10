import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { steps, validatePackage } from "./validate-supabase-production-cutover-review.mjs";

function fixture(mutator = () => {}) {
  const root = mkdtempSync(join(tmpdir(), "cutover-review-"));
  const dir = join(root, "reports/supabase-production-sync/production-cutover-sql");
  mkdirSync(dir, { recursive: true });
  for (const [, , slug] of steps) {
    writeFileSync(join(dir, `${slug}.sql`), "-- PRODUCTION_EXECUTION_AUTHORIZED=NO\nselect 1;\n");
    writeFileSync(join(dir, `${slug}-precheck.sql`), "-- READ_ONLY\nselect 'PASS_SKIP_STOP', * from pg_policies;\n");
    writeFileSync(join(dir, `${slug}-postcheck.sql`), "-- READ_ONLY\nselect 'PASS_SKIP_STOP';\n");
    writeFileSync(join(dir, `${slug}-recovery.md`), "# Recovery\n");
  }
  writeFileSync(join(dir, "01-workout-delivery.sql"), "-- ok\nalter table public.treinos add column if not exists lifecycle_status text;\nalter table public.treinos add constraint treinos_lifecycle_dates_check check (true);\n");
  writeFileSync(join(dir, "03-security-reconciliation-precheck.sql"), "select * from pg_policies;\n");
  writeFileSync(join(dir, "04-required-fields-precheck.sql"), "select count(*) filter (where created_at is null) as null_created_at, count(*) filter (where user_id is null) as null_user_id, count(*) filter (where whatsapp is null) as null_whatsapp from public.alunos;\n");
  writeFileSync(join(dir, "05-aoe-security.sql"), "revoke execute on function public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) from anon;\n");
  writeFileSync(join(dir, "06-group-a-security.sql"), "alter function public.set_workout_templates_updated_at() set search_path = public;\n");
  writeFileSync(join(dir, "manifest.json"), JSON.stringify({ production_execution_authorized: false, db_push_allowed: false, history_alignment_allowed_now: false }));
  mutator(dir);
  return root;
}

test("baseline apply file fails", () => {
  const root = fixture((dir) => writeFileSync(join(dir, "00-baseline.sql"), "create table nope(id int);"));
  assert.throws(() => validatePackage(root), /BASELINE_APPLY_FILE_FORBIDDEN/);
});

test("missing precheck fails", () => {
  const root = fixture((dir) => writeFileSync(join(dir, "02-student-identity-precheck.sql"), "alter table public.alunos add column nope text;"));
  assert.throws(() => validatePackage(root), /READ_ONLY_SQL_VALIDATION_FAILED/);
});

test("missing recovery fails", () => {
  const root = fixture((dir) => rmSync(join(dir, "02-student-identity-recovery.md")));
  assert.throws(() => validatePackage(root), /MISSING_CUTOVER_FILE:02-student-identity-recovery.md/);
});

test("workout with student identity fails", () => {
  const root = fixture((dir) => writeFileSync(join(dir, "01-workout-delivery.sql"), "alter table public.alunos add column student_user_id uuid;"));
  assert.throws(() => validatePackage(root), /WORKOUT_CONTAINS_STUDENT_IDENTITY/);
});

test("workout with admin financial scope fails", () => {
  const root = fixture((dir) => writeFileSync(join(dir, "01-workout-delivery.sql"), "select * from public.pagamentos;"));
  assert.throws(() => validatePackage(root), /WORKOUT_SCOPE_EXPANSION/);
});

test("security missing policy precheck fails", () => {
  const root = fixture((dir) => writeFileSync(join(dir, "03-security-reconciliation-precheck.sql"), "select 1;"));
  assert.throws(() => validatePackage(root), /SECURITY_POLICY_PRECHECK_MISSING/);
});

test("required fields missing null check fails", () => {
  const root = fixture((dir) => writeFileSync(join(dir, "04-required-fields-precheck.sql"), "select count(*) from public.alunos;"));
  assert.throws(() => validatePackage(root), /REQUIRED_FIELDS_NULL_CHECK_MISSING/);
});

test("AOE CREATE FUNCTION fails", () => {
  const root = fixture((dir) => writeFileSync(join(dir, "05-aoe-security.sql"), "create function public.aoe_idempotency_get_or_create() returns void language sql as $$ select 1 $$;"));
  assert.throws(() => validatePackage(root), /AOE_BODY_CHANGE_FORBIDDEN/);
});

test("Group A CREATE OR REPLACE fails", () => {
  const root = fixture((dir) => writeFileSync(join(dir, "06-group-a-security.sql"), "create or replace function public.set_workout_templates_updated_at() returns trigger language plpgsql as $$ begin return new; end $$;"));
  assert.throws(() => validatePackage(root), /GROUP_A_BODY_REPLACE_FORBIDDEN/);
});

test("execution authorized true fails", () => {
  const root = fixture((dir) => writeFileSync(join(dir, "manifest.json"), JSON.stringify({ production_execution_authorized: true, db_push_allowed: false, history_alignment_allowed_now: false })));
  assert.throws(() => validatePackage(root), /CUTOVER_AUTHORIZATION_FLAGS_INVALID/);
});

test("valid package passes", () => {
  assert.doesNotThrow(() => validatePackage(fixture()));
});
