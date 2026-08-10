import test from "node:test";
import assert from "node:assert/strict";
import {
  buildMatrix,
  buildResult,
  validateIdentityModel,
  validateNoDuplicateMigration,
  validatePayloadMinimization,
  validateStudentIdentityContract
} from "./analyze-supabase-student-identity-deployment-design.mjs";

const validSql = `
alter table public.alunos add column if not exists student_user_id uuid;
comment on column public.alunos.user_id is 'Professional owner user id. This value remains the tenant boundary for professional operations.';
comment on column public.alunos.student_user_id is 'Authenticated student account allowed to read its own minimized workout prescription contract.';
alter table only public.alunos add constraint alunos_student_user_id_fkey foreign key (student_user_id) references auth.users(id) on delete set null;
create unique index if not exists alunos_student_user_id_uidx on public.alunos using btree (student_user_id) where student_user_id is not null;
create index if not exists alunos_student_user_id_idx on public.alunos using btree (student_user_id) where student_user_id is not null;
alter table only public.perfis add constraint perfis_role_check check (role in ('admin', 'user', 'student'));
create or replace function public.vincular_aluno_usuario(p_aluno_id uuid, p_student_user_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$ begin perform 1 from public.alunos where id = p_aluno_id and user_id = v_professional_user_id; return '{}'::jsonb; end; $$;
create or replace function public.desvincular_aluno_usuario(p_aluno_id uuid) returns jsonb language plpgsql security definer set search_path = public as $$ begin return '{}'::jsonb; end; $$;
create or replace function public.get_my_student_workouts() returns jsonb language plpgsql security definer set search_path = public as $$ begin perform 1 from public.alunos where student_user_id = v_student_user_id; perform 1 from public.treinos t where t.lifecycle_status in ('active', 'completed'); return jsonb_build_object('student', null, 'activeWorkouts', '[]'::jsonb, 'completedWorkouts', '[]'::jsonb); end; $$;
revoke all on function public.get_my_student_workouts() from public;
grant execute on function public.get_my_student_workouts() to authenticated;
`;

test("student_user_id covered by migration becomes remote pending", () => {
  assert.equal(buildMatrix().find((row) => row.object === "public.alunos.student_user_id").remote_pending, "YES");
});

test("role student is covered by migration", () => {
  assert.equal(buildMatrix().find((row) => row.object === "public.perfis.perfis_role_check").new_migration_required, "NO");
});

test("RPC covered by migration is remote pending", () => {
  assert.equal(buildMatrix().find((row) => row.object === "public.get_my_student_workouts").remote_pending, "YES");
});

test("user_id cannot become student identity", () => {
  assert.throws(() => validateIdentityModel("comment on column public.alunos.user_id is 'student identity';"), /BLOCKED_STUDENT_IDENTITY_MODEL_CONFLICT/);
});

test("duplicate student_user_id uniqueness must exist", () => {
  assert.throws(() => validateStudentIdentityContract(validSql.replace("create unique index", "create index")), /BLOCKED_STUDENT_IDENTITY_UNIQUENESS/);
});

test("SECURITY DEFINER without search_path is blocked", () => {
  assert.throws(() => validateStudentIdentityContract(validSql.replaceAll("set search_path = public", "")), /INSECURE/);
});

test("PUBLIC execute is blocked", () => {
  assert.throws(() => validateStudentIdentityContract(`${validSql}\ngrant execute on function public.get_my_student_workouts() to public;`), /PUBLIC_EXECUTE/);
});

test("anon execute is blocked", () => {
  assert.throws(() => validateStudentIdentityContract(`${validSql}\ngrant execute on function public.get_my_student_workouts() to anon;`), /ANON_EXECUTE/);
});

test("technical payload exposure is blocked", () => {
  assert.throws(() => validatePayloadMinimization(`${validSql} 'application_idempotency_key'`), /DATA_EXPOSURE/);
});

test("Workout Delivery dependency is valid", () => {
  assert.equal(buildMatrix().find((row) => row.object === "public.get_my_student_workouts").dependency, "WORKOUT_DELIVERY_LOCAL_COMPLETE");
});

test("duplicate migration attempt fails", () => {
  assert.throws(() => validateNoDuplicateMigration({ new_migration_required: false, migration_created: true }), /DUPLICATE_MIGRATION/);
});

test("final local drift zero is ready", () => {
  const result = buildResult();
  assert.equal(result.final_local_drift_count, 0);
  assert.equal(result.next_safe_group, "PRODUCTION_RECONCILIATION_PACKAGE_DESIGN");
});
