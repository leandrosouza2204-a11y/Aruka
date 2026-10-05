import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createEphemeralSupabaseWorkdir, SUPABASE_CLI_VERSION } from "./lib/supabase-local-environment.mjs";
import {
  createIsolatedSupabaseCliEnvironment,
  runCommand,
  runPsql,
  validateLocalGuard,
} from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const p12Version = "20260921010053";
const reconciliationPath = "supabase/migrations/20261004133801_cycle12_forward_schema_security_reconciliation.sql";
const cycle1213Path = "supabase/migrations/20260926174027_cycle12_schema_rls_hardening.sql";
const cycle12152Path = "supabase/migrations/20261003163830_cycle12_controlled_rollout_foundation.sql";
const functionSignatures = [
  "public.abandon_workout_execution_session(uuid)",
  "public.admin_listar_usuarios()",
  "public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)",
  "public.admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)",
  "public.aoe_user_owns_student(uuid)",
  "public.complete_workout_execution_session(uuid)",
  "public.desvincular_aluno_usuario(uuid)",
  "public.exercise_is_prescribed_to_current_student(uuid)",
  "public.get_my_workout_execution_state(integer)",
  "public.get_student_access_state(uuid)",
  "public.get_student_workout_execution_history(uuid,integer)",
  "public.manage_student_access(uuid,text,text,text)",
  "public.renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text)",
  "public.save_workout_execution(uuid,jsonb)",
  "public.set_workout_execution_updated_at()",
  "public.vincular_aluno_usuario(uuid,uuid)",
  "public.workout_execution_session_payload(uuid)",
];

function cliReset(workdir, environment, version) {
  const args = ["-y", `supabase@${SUPABASE_CLI_VERSION}`, "--workdir", workdir, "db", "reset", "--local", "--no-seed"];
  if (version) args.push("--version", version);
  const result = runCommand(root, process.platform === "win32" ? "npx.cmd" : "npx", args, {
    env: environment,
    timeoutMs: 600000,
  });
  if (result.status !== 0) throw new Error(`Local reset failed: ${result.stderr || result.stdout}`);
  return result;
}

function scalar(sql) {
  const result = runPsql(root, `\\pset tuples_only on\n\\pset format unaligned\n${sql}`);
  return result.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "";
}

function applyFile(relativePath) {
  const result = runPsql(root, readFileSync(join(root, relativePath), "utf8"), { timeoutMs: 300000 });
  assert.equal(result.status, 0, `${relativePath} must execute successfully`);
}

function simulateRecordedPre1213Drift() {
  const grants = functionSignatures.map((signature) => `grant execute on function ${signature} to anon;`).join("\n");
  runPsql(root, String.raw`
drop policy "Usuarios podem listar seus alunos" on public.alunos;
drop policy "Usuarios podem cadastrar seus alunos" on public.alunos;
drop policy "Usuarios podem atualizar seus alunos" on public.alunos;
drop policy "Usuarios podem excluir seus alunos" on public.alunos;

create policy "Usuário vê apenas seus alunos"
  on public.alunos for select using (auth.uid() = user_id);
create policy "Usuário cadastra seus alunos"
  on public.alunos for insert with check (auth.uid() = user_id);
create policy "Usuário edita seus alunos"
  on public.alunos for update using (auth.uid() = user_id);
create policy "Usuário exclui seus alunos"
  on public.alunos for delete using (auth.uid() = user_id);

alter default privileges for role postgres grant execute on functions to public;
alter default privileges for role postgres in schema public grant execute on functions to anon, authenticated, service_role;
${grants}
`);
}

const guard = validateLocalGuard(root, ["db", "reset", "--local", "--version", p12Version]);
assert.equal(guard.ok, true, guard.errors.join("; "));

const workdir = createEphemeralSupabaseWorkdir(root, "cycle-12-15-5-logical-order");
const isolated = createIsolatedSupabaseCliEnvironment();
let primaryError;

try {
  cliReset(workdir.root, isolated.env, p12Version);
  assert.equal(scalar("select max(version) from supabase_migrations.schema_migrations;"), p12Version);
  console.log("CYCLE_12_15_5_LOGICAL_P12_RESET=PASS");

  simulateRecordedPre1213Drift();
  assert.equal(scalar(String.raw`select count(*) from pg_policies where schemaname='public' and ((coalesce(qual,'') like '%auth.uid()%' and coalesce(qual,'') not like '%SELECT auth.uid()%') or (coalesce(with_check,'') like '%auth.uid()%' and coalesce(with_check,'') not like '%SELECT auth.uid()%'));`), "62");
  console.log("CYCLE_12_15_5_LOGICAL_DRIFT_FIXTURE=62");

  applyFile(reconciliationPath);
  assert.equal(scalar(String.raw`select count(*) from pg_policies where schemaname='public' and tablename='alunos' and policyname in ('Usuarios podem listar seus alunos','Usuarios podem cadastrar seus alunos','Usuarios podem atualizar seus alunos','Usuarios podem excluir seus alunos') and roles::text='{authenticated}';`), "4");
  assert.equal(scalar(String.raw`select count(*) from unnest(array[${functionSignatures.map((signature) => `'${signature}'`).join(",")}]) signature where has_function_privilege('anon', signature, 'EXECUTE');`), "0");
  assert.equal(scalar(String.raw`select count(*) from pg_policies where schemaname='public' and ((coalesce(qual,'') like '%auth.uid()%' and coalesce(qual,'') not like '%SELECT auth.uid()%') or (coalesce(with_check,'') like '%auth.uid()%' and coalesce(with_check,'') not like '%SELECT auth.uid()%'));`), "62");
  console.log("CYCLE_12_15_5_LOGICAL_RECONCILIATION=PASS");
  console.log("CYCLE_12_15_5_LOGICAL_ALLOWLIST_BEFORE_12_13=62/62");

  applyFile(cycle1213Path);
  assert.equal(scalar(String.raw`select count(*) from pg_policies where schemaname='public' and ((coalesce(qual,'') like '%auth.uid()%' and coalesce(qual,'') not like '%SELECT auth.uid()%') or (coalesce(with_check,'') like '%auth.uid()%' and coalesce(with_check,'') not like '%SELECT auth.uid()%'));`), "0");
  // Seven policies were already wrapped before Cycle 12.13; its validated
  // 62-row allowlist raises the global wrapped-expression count to 69.
  assert.equal(scalar(String.raw`select count(*) from pg_policies where schemaname='public' and (coalesce(qual,'') like '%SELECT auth.uid()%' or coalesce(with_check,'') like '%SELECT auth.uid()%');`), "69");
  assert.equal(scalar("select count(*) from pg_policies where schemaname='public';"), "73");
  console.log("CYCLE_12_15_5_LOGICAL_12_13=PASS");
  console.log("CYCLE_12_15_5_LOGICAL_WRAPPED_ALLOWLIST=62/62");

  applyFile(cycle12152Path);
  assert.equal(scalar("select count(*) from information_schema.tables where table_schema='private' and table_name like 'student_experience_%';"), "4");
  assert.equal(scalar("select concat(global_enabled, '|', emergency_blocked, '|', reason) from private.student_experience_rollout_config where singleton;"), "f|f|DEFAULT_OFF");
  assert.equal(scalar("select count(*) from private.student_experience_rollout_targets;"), "0");
  assert.equal(scalar("select column_default from information_schema.columns where table_schema='public' and table_name='workout_execution_sessions' and column_name='experience_origin';"), "'v1'::text");
  console.log("CYCLE_12_15_5_LOGICAL_12_15_2=PASS");
  console.log("CYCLE_12_15_5_LOGICAL_ORDER=PASS");
} catch (error) {
  primaryError = error;
  throw error;
} finally {
  try {
    cliReset(workdir.root, isolated.env);
    console.log("CYCLE_12_15_5_PHYSICAL_BOOTSTRAP_RESTORED=PASS");
  } catch (restoreError) {
    if (!primaryError) throw restoreError;
    console.error(`CYCLE_12_15_5_PHYSICAL_BOOTSTRAP_RESTORE=FAIL: ${restoreError.message}`);
  } finally {
    isolated.cleanup();
    workdir.cleanup();
  }
}
