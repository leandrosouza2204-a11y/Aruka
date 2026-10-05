import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const migrationPath = "supabase/migrations/20261004133801_cycle12_forward_schema_security_reconciliation.sql";
const migration = readFileSync(migrationPath, "utf8");
const discovery = JSON.parse(readFileSync("reports/cycle-12-15-4-pending-chain-drift-discovery.json", "utf8"));

assert.equal(validateLocalGuard(root).ok, true, "local-only guard must pass");
assert.match(migration, /^begin;/i);
assert.match(migration, /commit;\s*$/i);
const executableSql = migration.replace(/--.*$/gm, "");
assert.doesNotMatch(executableSql, /drop\s+function|\bcascade\b/i);
assert.match(migration, /alter default privileges for role postgres\s+revoke execute on functions from public/i);
assert.match(migration, /alter default privileges for role postgres in schema public\s+revoke execute on functions from anon, authenticated, service_role/i);

const canonicalPolicies = discovery.policy_findings.missing_alunos.map((item) => item.canonical);
const legacyPolicies = discovery.policy_findings.missing_alunos.map((item) => item.remote);
for (const name of [...canonicalPolicies, ...legacyPolicies]) {
  assert.ok(migration.includes(name), `policy contract missing from migration: ${name}`);
}

const functions = discovery.definer_functions.map((item) => item.signature);
assert.equal(functions.length, 17, "discovery contract must contain 17 SECURITY DEFINER signatures");
for (const signature of functions) {
  assert.ok(migration.includes(`revoke execute on function ${signature} from public, anon, authenticated, service_role;`),
    `signature-specific revoke missing: ${signature}`);
}

for (const item of discovery.definer_functions) {
  const roles = item.expected_roles;
  const grant = roles.length ? `grant execute on function ${item.signature} to ${roles.join(", ")};` : null;
  if (grant) assert.ok(migration.includes(grant), `expected grant missing: ${grant}`);
  else assert.ok(!migration.includes(`grant execute on function ${item.signature}`), `internal-only function must not be regranted: ${item.signature}`);
}

for (const signature of discovery.legacy_remote_only_overloads) {
  assert.ok(!new RegExp(`drop\\s+function\\s+public\\.${escapeRegExp(signature)}`, "i").test(migration),
    `deferred legacy overload must not be dropped: ${signature}`);
}

const allowlistBlock = readFileSync("supabase/migrations/20260926174027_cycle12_schema_rls_hardening.sql", "utf8")
  .match(/insert into cycle_12_13_expected_policies[\s\S]*?;\s*\n\s*do \$\$/i)?.[0] || "";
const allowlist = [...allowlistBlock.matchAll(/\('([^']+)', '([^']+)', '(SELECT|INSERT|UPDATE|DELETE|ALL)'\)/g)];
assert.equal(allowlist.length, 62, "Cycle 12.13 canonical policy allowlist must remain 62");

console.log("CYCLE_12_15_5_STATIC_CONTRACT=PASS");
console.log("CYCLE_12_15_5_POLICY_CONTRACT=4");
console.log("CYCLE_12_15_5_SECURITY_DEFINER_CONTRACT=17");
console.log("CYCLE_12_15_5_LEGACY_OVERLOADS=DEFERRED_5");
console.log("CYCLE_12_15_5_12_13_ALLOWLIST=62");

if (process.argv.includes("--runtime")) runRuntimeValidation();

function runRuntimeValidation() {
  const catalog = runPsql(root, String.raw`
begin;

do $$
declare
  expected record;
begin
  if (select count(*) from pg_policies where schemaname='public' and tablename='alunos' and policyname = any(array[
    'Usuarios podem listar seus alunos', 'Usuarios podem cadastrar seus alunos',
    'Usuarios podem atualizar seus alunos', 'Usuarios podem excluir seus alunos'
  ]) and roles::text='{authenticated}') <> 4 then
    raise exception 'canonical alunos policy matrix mismatch';
  end if;

  for expected in select * from (values
    ('public.abandon_workout_execution_session(uuid)', true, false),
    ('public.admin_listar_usuarios()', true, true),
    ('public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)', true, true),
    ('public.admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)', true, true),
    ('public.aoe_user_owns_student(uuid)', true, true),
    ('public.complete_workout_execution_session(uuid)', true, false),
    ('public.desvincular_aluno_usuario(uuid)', true, false),
    ('public.exercise_is_prescribed_to_current_student(uuid)', true, true),
    ('public.get_my_workout_execution_state(integer)', true, false),
    ('public.get_student_access_state(uuid)', true, false),
    ('public.get_student_workout_execution_history(uuid,integer)', true, false),
    ('public.manage_student_access(uuid,text,text,text)', true, false),
    ('public.renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text)', true, true),
    ('public.save_workout_execution(uuid,jsonb)', true, false),
    ('public.set_workout_execution_updated_at()', false, false),
    ('public.vincular_aluno_usuario(uuid,uuid)', true, false),
    ('public.workout_execution_session_payload(uuid)', false, false)
  ) matrix(signature, auth_execute, service_execute) loop
    if has_function_privilege('anon', expected.signature, 'execute')
       or has_function_privilege('authenticated', expected.signature, 'execute') <> expected.auth_execute
       or has_function_privilege('service_role', expected.signature, 'execute') <> expected.service_execute then
      raise exception 'ACL mismatch for %', expected.signature;
    end if;
  end loop;
end $$;

create function public.cycle_12_15_5_default_acl_probe()
returns boolean language sql security definer set search_path = '' as $$ select true $$;

do $$
begin
  if has_function_privilege('anon', 'public.cycle_12_15_5_default_acl_probe()', 'execute')
     or has_function_privilege('authenticated', 'public.cycle_12_15_5_default_acl_probe()', 'execute')
     or has_function_privilege('service_role', 'public.cycle_12_15_5_default_acl_probe()', 'execute') then
    raise exception 'new function inherited a client EXECUTE grant';
  end if;
end $$;

rollback;
`);
  assert.equal(catalog.status, 0, catalog.stderr || catalog.stdout);

  const rls = runPsql(root, String.raw`
begin;
insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at) values
  ('00000000-0000-4000-8000-000000121551','authenticated','authenticated','c12155-owner-a@example.test',now(),now(),now()),
  ('00000000-0000-4000-8000-000000121552','authenticated','authenticated','c12155-owner-b@example.test',now(),now(),now());
insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano) values
  ('00000000-0000-4000-8000-000000121561','00000000-0000-4000-8000-000000121551','A','1',current_date,'QA'),
  ('00000000-0000-4000-8000-000000121562','00000000-0000-4000-8000-000000121552','B','2',current_date,'QA');
set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000121551';
select 'visible=' || count(*) from public.alunos where id in (
  '00000000-0000-4000-8000-000000121561', '00000000-0000-4000-8000-000000121562'
);
update public.alunos set nome='cross' where id='00000000-0000-4000-8000-000000121562';
select 'cross_updated=' || count(*) from public.alunos where id='00000000-0000-4000-8000-000000121562' and nome='cross';
delete from public.alunos where id='00000000-0000-4000-8000-000000121562';
select 'owner_visible=' || count(*) from public.alunos where id='00000000-0000-4000-8000-000000121561';
rollback;
`);
  assert.equal(rls.status, 0, rls.stderr || rls.stdout);
  assert.match(rls.stdout, /visible=1/);
  assert.match(rls.stdout, /cross_updated=0/);
  assert.match(rls.stdout, /owner_visible=1/);

  const anon = runPsql(root, String.raw`
begin;
set local role anon;
select 'anon_visible=' || count(*) from public.alunos;
rollback;
`, { throwOnError: false });
  if (anon.status === 0) assert.match(anon.stdout, /anon_visible=0/);
  else assert.match(`${anon.stderr}\n${anon.stdout}`, /permission denied for table alunos|42501/i,
    "anon must be denied by table grants or RLS");

  console.log("CYCLE_12_15_5_RUNTIME_POLICIES=PASS");
  console.log("CYCLE_12_15_5_RUNTIME_ACL_MATRIX=PASS");
  console.log("CYCLE_12_15_5_RUNTIME_DEFAULT_ACL=PASS");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
