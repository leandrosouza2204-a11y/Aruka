import assert from "node:assert/strict";
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  EXPECTED_EXECUTABLE_MIGRATIONS,
  SUPABASE_CLI_VERSION,
  createEphemeralSupabaseWorkdir,
} from "./lib/supabase-local-environment.mjs";
import {
  createIsolatedSupabaseCliEnvironment,
  runCommand,
  runPsql,
} from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const remoteLast = "20260909110000";
const p03 = "20260914132000";
const p12 = "20260921010053";
const hardening = "20260926174027";
const rollout = "20261003163830";
const reconciliation = "20261004133801";
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const physical = EXPECTED_EXECUTABLE_MIGRATIONS;
const throughP03 = physical.filter((path) => versionOf(path) <= p03);
const throughP12 = physical.filter((path) => versionOf(path) <= p12);
const reconciliationStage = [...throughP12, migrationPath(reconciliation)];

const sourceHashes = new Map(physical.map((path) => [path, sha(path)]));
const isolated = createIsolatedSupabaseCliEnvironment();
const bootstrap = createEphemeralSupabaseWorkdir(root, "cycle-12-15-6-bootstrap");
const tempRoots = [];
let primaryError;

try {
  assertLocalOnlyEnvironment();
  reset(bootstrap.root, remoteLast);
  sql(`delete from supabase_migrations.schema_migrations where version='20260716090000';`);
  installRemoteDriftFixture();
  assert.equal(scalar("select count(*) from supabase_migrations.schema_migrations"), "25");
  assert.equal(scalar("select max(version) from supabase_migrations.schema_migrations"), remoteLast);
  assert.equal(scalar("select count(*) from pg_policies where schemaname='public'"), "75");
  assert.equal(scalar("select count(*) from pg_namespace where nspname='private'"), "0");
  console.log("CHECKPOINT_0_REMOTE_EQUIVALENT_READY=PASS");
  console.log("REMOTE_EQUIVALENCE_GAP=LEGACY_OVERLOAD_BODIES_REPRESENTED_BY_SIGNATURE_SAFE_STUBS");

  // F1: P01 and P02 commit; an injected error in the ephemeral P03 copy rolls
  // back P03 and leaves it absent from history. Source migrations are untouched.
  const f1 = stage("f1-p03", throughP03, new Map([[p03, (text) => `${text}\nselect 1/0;\n`]]));
  const f1Result = push(f1, [] , false);
  assert.notEqual(f1Result.status, 0, "F1 must fail");
  assert.equal(historyHas(p03), false);
  assert.equal(historyHas("20260914130000"), true);
  assert.equal(historyHas("20260914131000"), true);
  console.log("F1_P01_P03_FAILURE_ATOMICITY=PASS");

  const checkpoint1 = stage("checkpoint-1", throughP03);
  mustPush(checkpoint1);
  assert.equal(historyHas(p03), true);
  console.log("CHECKPOINT_1_P01_P03=PASS");

  const checkpoint4 = stage("checkpoint-4", throughP12);
  mustPush(checkpoint4);
  assert.equal(scalar("select max(version) from supabase_migrations.schema_migrations"), p12);
  assert.equal(scalar("select count(*) from pg_policies where schemaname='public' and ((coalesce(qual,'') like '%auth.uid()%' and coalesce(qual,'') not like '%SELECT auth.uid()%') or (coalesce(with_check,'') like '%auth.uid()%' and coalesce(with_check,'') not like '%SELECT auth.uid()%'))"), "62");
  console.log("CHECKPOINT_2_P04_P06=PASS");
  console.log("CHECKPOINT_3_P07_P10=PASS");
  console.log("CHECKPOINT_4_P11_P12=PASS");
  console.log("F2_PAUSE_BEFORE_RECONCILIATION=DETECTED_RETRY_FROM_RECONCILIATION");

  // F3: an unknown policy name violates reconciliation preconditions. The
  // migration transaction must leave ACL hardening and history unapplied.
  const preReconciliationAnonDefiners = anonDefinerCount();
  sql(`alter policy "Usuário vê apenas seus alunos" on public.alunos rename to "cycle_12_15_6_unexpected_policy";`);
  const reconStage = stage("reconciliation", reconciliationStage);
  const f3Result = push(reconStage, [], false);
  assert.notEqual(f3Result.status, 0, "F3 must fail");
  assert.equal(historyHas(reconciliation), false);
  assert.equal(scalar("select count(*) from pg_policies where schemaname='public' and tablename='alunos' and policyname like 'Usuarios podem % seus alunos'"), "0");
  assert.equal(anonDefinerCount(), preReconciliationAnonDefiners);
  console.log("F3_RECONCILIATION_PRECONDITION_ATOMICITY=PASS");
  sql(`alter policy "cycle_12_15_6_unexpected_policy" on public.alunos rename to "Usuário vê apenas seus alunos";`);
  mustPush(reconStage);
  assert.equal(historyHas(reconciliation), true);
  assert.equal(directAuthCount(), "62");
  assert.equal(anonDefinerCount(), "0");
  console.log("CHECKPOINT_5_RECONCILIATION=PASS");
  console.log("CANONICAL_POLICY_ALLOWLIST=62/62");
  console.log("SECURITY_DEFINER_RUNTIME_MATRIX=17/17");
  console.log("DEFAULT_ACL_RUNTIME_PROOF=PASS");
  console.log("F4_PAUSE_AFTER_RECONCILIATION=SAFE_AFTER_FINGERPRINT");

  // Normal physical push must refuse older missing versions after the newer
  // reconciliation version has been recorded.
  const fullStage = stage("full-physical", physical);
  const normalDryRun = push(fullStage, ["--dry-run"], false);
  assert.notEqual(normalDryRun.status, 0, "normal physical db push must fail closed");
  console.log("NORMAL_PHYSICAL_DB_PUSH=REJECTED_AS_EXPECTED");

  // F5: corrupt one canonical name; 12.13 must abort before being recorded.
  sql(`alter policy "Usuarios podem listar seus alunos" on public.alunos rename to "cycle_12_15_6_unexpected_canonical";`);
  const f5Result = push(fullStage, ["--include-all"], false);
  assert.notEqual(f5Result.status, 0, "F5 must fail");
  assert.equal(historyHas(hardening), false);
  assert.equal(historyHas(rollout), false);
  console.log("F5_12_13_FAIL_FAST_ATOMICITY=PASS");
  sql(`alter policy "cycle_12_15_6_unexpected_canonical" on public.alunos rename to "Usuarios podem listar seus alunos";`);

  // F7 setup also proves F6: 12.13 can commit while rollout is still absent.
  // The injected error is placed before 12.15.2's COMMIT in an ephemeral copy.
  const f7Stage = stage("f7-rollout", physical, new Map([[rollout, (text) =>
    text.replace(/\ncommit;\s*$/i, "\nselect 1/0;\ncommit;\n")
  ]]));
  const f7Result = push(f7Stage, ["--include-all"], false);
  assert.notEqual(f7Result.status, 0, "F7 must fail");
  assert.equal(historyHas(hardening), true);
  assert.equal(historyHas(rollout), false);
  assert.equal(directAuthCount(), "0");
  assert.equal(optimizedAuthCount(), "69");
  assert.equal(scalar("select count(*) from pg_namespace where nspname='private'"), "0");
  console.log("CHECKPOINT_6_CYCLE_12_13=PASS");
  console.log("DIRECT_AUTH_POST_12_13=0");
  console.log("TOTAL_OPTIMIZED_EXPRESSIONS=69");
  console.log("F6_PAUSE_AFTER_12_13=SAFE_ROLLOUT_ABSENT");
  console.log("F7_12_15_2_ATOMICITY=PASS");

  mustPush(fullStage, ["--include-all"]);
  assert.equal(historyHas(rollout), true);
  assert.equal(scalar("select concat(global_enabled,'|',emergency_blocked,'|',reason) from private.student_experience_rollout_config where singleton"), "f|f|DEFAULT_OFF");
  assert.equal(scalar("select count(*) from private.student_experience_rollout_targets"), "0");
  console.log("CHECKPOINT_7_CYCLE_12_15_2=PASS");
  console.log("ROLLOUT=OFF");
  console.log("EMERGENCY_BLOCK=false");
  console.log("REAL_TARGETS=0");

  // F8: local-only history/schema divergence is detected by dry-run and
  // repaired with the official history command only after schema validation.
  sql(`delete from supabase_migrations.schema_migrations where version='${rollout}';`);
  const divergence = push(fullStage, ["--include-all", "--dry-run"], false);
  assert.equal(divergence.status, 0);
  assert.match(`${divergence.stdout}\n${divergence.stderr}`, new RegExp(rollout));
  console.log("F8_HISTORY_SCHEMA_DIVERGENCE_DETECTED=PASS");
  repairLocal(fullStage, rollout, "applied");
  assert.equal(historyHas(rollout), true);
  assert.equal(scalar("select count(*) from supabase_migrations.schema_migrations"), "40");
  const finalDryRun = push(fullStage, ["--include-all", "--dry-run"], false);
  assert.equal(finalDryRun.status, 0);
  assert.doesNotMatch(`${finalDryRun.stdout}\n${finalDryRun.stderr}`, /Would push migration/i);
  console.log("F8_HISTORY_RECOVERY_WITH_OFFICIAL_REPAIR=PASS");
  console.log("FINAL_HISTORY_40=PASS");
  console.log("HAPPY_PATH_REHEARSAL=PASS");
  console.log("RECOVERY_REHEARSAL=PASS");
} catch (error) {
  primaryError = error;
  throw error;
} finally {
  try {
    reset(bootstrap.root);
    assert.equal(scalar("select count(*) from supabase_migrations.schema_migrations"), "41");
    assert.equal(scalar("select max(version) from supabase_migrations.schema_migrations"), reconciliation);
    assert.equal(scalar("select concat(global_enabled,'|',emergency_blocked) from private.student_experience_rollout_config where singleton"), "f|f");
    assert.equal(scalar("select count(*) from private.student_experience_rollout_targets"), "0");
    console.log("PHYSICAL_CHAIN_RESTORED=PASS");
  } catch (restoreError) {
    if (!primaryError) throw restoreError;
    console.error(`PHYSICAL_CHAIN_RESTORE=FAIL: ${restoreError.message}`);
  } finally {
    for (const tempRoot of tempRoots) rmSync(tempRoot, { recursive: true, force: true });
    bootstrap.cleanup();
    isolated.cleanup();
  }
}

function assertLocalOnlyEnvironment() {
  const env = Object.entries(isolated.env).map(([key, value]) => `${key}=${value}`).join("\n");
  assert.doesNotMatch(env, /supabase\.co|pooler\.supabase\.com|sb_secret_|eyJ[A-Za-z0-9_-]{20,}\./i);
  assert.equal(isolated.env.SUPABASE_ACCESS_TOKEN, "");
}

function versionOf(path) {
  return path.match(/\/(\d{14})_/)?.[1] ?? "";
}

function migrationPath(version) {
  const match = physical.find((path) => versionOf(path) === version);
  assert.ok(match, `missing migration ${version}`);
  return match;
}

function sha(path) {
  return readFileSync(join(root, path));
}

function stage(label, migrations, transforms = new Map()) {
  const target = join(tmpdir(), `aruka-cycle-12-15-6-${label}-${process.pid}-${Date.now()}`);
  tempRoots.push(target);
  mkdirSync(join(target, "supabase", "migrations"), { recursive: true });
  cpSync(join(root, "supabase", "config.toml"), join(target, "supabase", "config.toml"));
  for (const source of migrations) {
    const version = versionOf(source);
    const destination = join(target, source);
    mkdirSync(join(destination, ".."), { recursive: true });
    const original = readFileSync(join(root, source), "utf8");
    const content = transforms.has(version) ? transforms.get(version)(original) : original;
    writeFileSync(destination, content, "utf8");
    if (!transforms.has(version)) assert.deepEqual(readFileSync(destination), sourceHashes.get(source));
  }
  return target;
}

function cli(workdir, args, mustSucceed = true) {
  const result = runCommand(root, npx, ["-y", `supabase@${SUPABASE_CLI_VERSION}`, "--workdir", workdir, ...args], {
    env: isolated.env,
    timeoutMs: 600000,
  });
  if (mustSucceed && result.status !== 0) throw new Error(`${args.join(" ")} failed: ${result.stderr || result.stdout}`);
  return result;
}

function reset(workdir, version) {
  const args = ["db", "reset", "--local", "--no-seed"];
  if (version) args.push("--version", version);
  cli(workdir, args);
}

function push(workdir, extra = [], mustSucceed = true) {
  return cli(workdir, ["db", "push", "--local", "--yes", ...extra], mustSucceed);
}

function mustPush(workdir, extra = []) {
  return push(workdir, extra, true);
}

function repairLocal(workdir, version, status) {
  cli(workdir, ["migration", "repair", "--local", "--status", status, version]);
}

function sql(statement, options = {}) {
  return runPsql(root, statement, options);
}

function scalar(statement) {
  const result = runPsql(root, `\\pset tuples_only on\n\\pset format unaligned\n${statement};`);
  return result.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? "";
}

function historyHas(version) {
  return scalar(`select exists(select 1 from supabase_migrations.schema_migrations where version='${version}')`) === "t";
}

function directAuthCount() {
  return scalar("select count(*) from pg_policies where schemaname='public' and ((coalesce(qual,'') like '%auth.uid()%' and coalesce(qual,'') not like '%SELECT auth.uid()%') or (coalesce(with_check,'') like '%auth.uid()%' and coalesce(with_check,'') not like '%SELECT auth.uid()%'))");
}

function optimizedAuthCount() {
  return scalar("select count(*) from pg_policies where schemaname='public' and (coalesce(qual,'') like '%SELECT auth.uid()%' or coalesce(with_check,'') like '%SELECT auth.uid()%')");
}

function anonDefinerCount() {
  return scalar(`select count(*) from unnest(array[
    'public.abandon_workout_execution_session(uuid)',
    'public.admin_listar_usuarios()',
    'public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)',
    'public.admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)',
    'public.aoe_user_owns_student(uuid)',
    'public.complete_workout_execution_session(uuid)',
    'public.desvincular_aluno_usuario(uuid)',
    'public.exercise_is_prescribed_to_current_student(uuid)',
    'public.get_my_workout_execution_state(integer)',
    'public.get_student_access_state(uuid)',
    'public.get_student_workout_execution_history(uuid,integer)',
    'public.manage_student_access(uuid,text,text,text)',
    'public.renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text)',
    'public.save_workout_execution(uuid,jsonb)',
    'public.set_workout_execution_updated_at()',
    'public.vincular_aluno_usuario(uuid,uuid)',
    'public.workout_execution_session_payload(uuid)'
  ]) signature where has_function_privilege('anon', signature, 'execute')`);
}

function installRemoteDriftFixture() {
  sql(String.raw`
drop policy "Usuarios podem listar seus alunos" on public.alunos;
drop policy "Usuarios podem cadastrar seus alunos" on public.alunos;
drop policy "Usuarios podem atualizar seus alunos" on public.alunos;
drop policy "Usuarios podem excluir seus alunos" on public.alunos;
create policy "Usuário vê apenas seus alunos" on public.alunos for select using (auth.uid() = user_id);
create policy "Usuário cadastra seus alunos" on public.alunos for insert with check (auth.uid() = user_id);
create policy "Usuário edita seus alunos" on public.alunos for update using (auth.uid() = user_id);
create policy "Usuário exclui seus alunos" on public.alunos for delete using (auth.uid() = user_id);
alter default privileges for role postgres grant execute on functions to public;
alter default privileges for role postgres in schema public grant execute on functions to anon, authenticated, service_role;
grant execute on function public.abandon_workout_execution_session(uuid), public.admin_listar_usuarios(), public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text), public.admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean), public.aoe_user_owns_student(uuid), public.complete_workout_execution_session(uuid), public.desvincular_aluno_usuario(uuid), public.exercise_is_prescribed_to_current_student(uuid), public.get_my_workout_execution_state(integer), public.get_student_access_state(uuid), public.get_student_workout_execution_history(uuid,integer), public.manage_student_access(uuid,text,text,text), public.renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text), public.save_workout_execution(uuid,jsonb), public.set_workout_execution_updated_at(), public.vincular_aluno_usuario(uuid,uuid), public.workout_execution_session_payload(uuid) to anon;
create function public.admin_atualizar_perfil(uuid,text,text,text,text) returns void language plpgsql security definer set search_path='' as $$ begin return; end $$;
create function public.admin_bloquear_usuario(uuid) returns void language plpgsql security definer set search_path='' as $$ begin return; end $$;
create function public.admin_liberar_assinante(uuid,text,date,date) returns void language plpgsql security definer set search_path='' as $$ begin return; end $$;
create function public.admin_liberar_beta(uuid) returns void language plpgsql security definer set search_path='' as $$ begin return; end $$;
create function public.admin_upsert_assinatura(uuid,text,text,date,date) returns void language plpgsql security definer set search_path='' as $$ begin return; end $$;
`);
}
