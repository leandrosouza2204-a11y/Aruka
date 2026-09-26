import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { queryJson, runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const migrationPath = "supabase/migrations/20260926174027_cycle12_schema_rls_hardening.sql";
const migration = readFileSync(migrationPath, "utf8");

assert.equal(validateLocalGuard(root).ok, true, "local-only guard must pass");

const allowlistBlock = migration.match(/insert into cycle_12_13_expected_policies[\s\S]*?;\s*\n\s*do \$\$/i)?.[0] || "";
const expected = [...allowlistBlock.matchAll(/\('([^']+)', '([^']+)', '(SELECT|INSERT|UPDATE|DELETE|ALL)'\)/g)]
  .map((match) => ({ table_name: match[1], policy_name: match[2], command: match[3] }));
const altered = [...migration.matchAll(/alter policy "([^"]+)" on public\.([a-z_]+)/gi)]
  .map((match) => ({ table_name: match[2], policy_name: match[1] }));

assert.equal(expected.length, 62, "migration allowlist must contain exactly 62 policies");
assert.equal(altered.length, 62, "migration must contain exactly 62 ALTER POLICY statements");
assert.equal(new Set(expected.map(key)).size, 62, "allowlist must be unique");
assert.equal(new Set(altered.map(key)).size, 62, "ALTER POLICY targets must be unique");
assert.deepEqual(new Set(altered.map(key)), new Set(expected.map(key)), "ALTER POLICY targets must equal the allowlist");
assert.doesNotMatch(migration, /\b(?:drop|create)\s+policy\b/i);
assert.doesNotMatch(migration, /alter policy[\s\S]*?storage\.objects/i);
assert.equal((migration.match(/create or replace function/gi) || []).length, 2);
assert.match(migration, /perform public\.admin_upsert_assinatura\([\s\S]*?p_user_agent,\s*null::date,\s*false\s*\);/i);
assert.doesNotMatch(lifecycleBody(), /\bv_status\b|\bv_plan\b/);
assert.doesNotMatch(migration, /select\s+public\.aoe_user_owns_student\(student_id\)/i);
assert.doesNotMatch(migration, /select\s+public\.exercise_is_prescribed_to_current_student\(id\)/i);

const policies = await queryJson(root, `
  select p.tablename as table_name, p.policyname as policy_name, p.cmd as command,
         p.permissive, p.roles::text as roles, p.qual, p.with_check
  from pg_policies p
  where p.schemaname = 'public'
  order by p.tablename, p.policyname
`);
assert.equal(policies.length, 73, "public policy count must remain 73");

const byKey = new Map(policies.map((policy) => [key(policy), policy]));
for (const item of expected) {
  const current = byKey.get(key(item));
  assert.ok(current, `missing policy ${key(item)}`);
  assert.equal(current.command, item.command, `command drift: ${key(item)}`);
  assert.equal(current.permissive, "PERMISSIVE", `permissiveness drift: ${key(item)}`);
  assert.equal(current.roles, "{authenticated}", `roles drift: ${key(item)}`);
  const expression = `${current.qual || ""}\n${current.with_check || ""}`;
  assert.match(expression, /SELECT auth\.uid\(\)/, `missing Auth initplan: ${key(item)}`);
  assert.equal(hasDirectAuth(expression), false, `direct Auth call remains: ${key(item)}`);
}

const unexpectedDirect = policies.filter((policy) => hasDirectAuth(`${policy.qual || ""}\n${policy.with_check || ""}`));
assert.deepEqual(unexpectedDirect, [], "all public auth.uid policy calls must now use initplans");

const v2Policies = [
  ["professional_contact_settings", "Professionals can insert own contact settings"],
  ["professional_contact_settings", "Professionals can read own contact settings"],
  ["professional_contact_settings", "Professionals can update own contact settings"],
  ["workout_execution_exercises", "Authorized read workout execution exercises"],
  ["workout_execution_sessions", "Authorized read workout execution sessions"],
  ["workout_execution_sets", "Authorized read workout execution sets"],
];
for (const [table_name, policy_name] of v2Policies) {
  assert.ok(byKey.has(key({ table_name, policy_name })), `Student V2 policy missing: ${table_name}.${policy_name}`);
  assert.equal(altered.some((item) => item.table_name === table_name && item.policy_name === policy_name), false,
    `Student V2 policy must not be altered: ${table_name}.${policy_name}`);
}

const functions = await queryJson(root, `
  select p.oid::regprocedure::text as signature,
         p.proowner::regrole::text as owner,
         p.prosecdef as security_definer,
         p.proconfig::text as config,
         coalesce(p.proacl::text, 'NULL') as acl
  from pg_proc p
  where p.oid in (
    'public.admin_liberar_assinante(uuid,text,date,date,text)'::regprocedure,
    'public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)'::regprocedure
  )
  order by signature
`);
assert.equal(functions.length, 2);
for (const fn of functions) {
  assert.equal(fn.owner, "postgres");
  assert.equal(fn.security_definer, true);
  assert.equal(fn.config, '{"search_path=public, auth"}');
  assert.match(fn.acl, /authenticated=X\/postgres/);
  assert.match(fn.acl, /service_role=X\/postgres/);
  assert.doesNotMatch(fn.acl, /anon=X\/postgres/);
}

const overloads = await queryJson(root, `
  select p.oid::regprocedure::text as signature
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = 'admin_upsert_assinatura'
  order by signature
`);
assert.deepEqual(new Set(overloads.map((item) => item.signature)), new Set([
  "admin_upsert_assinatura(uuid,text,text,date,date,text)",
  "admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)",
]));

const nullResult = runPsql(root, `
  begin read only;
  set local role anon;
  select ((auth.uid() = null) is null and ((select auth.uid()) = null) is null)::text as equivalent;
  rollback;
`);
assert.match(nullResult.stdout, /\btrue\b/i, "anon NULL behavior must remain SQL UNKNOWN");

const explain = runPsql(root, `
  begin read only;
  set local role authenticated;
  set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';
  explain (costs off) select id from public.perfis;
  rollback;
`);
assert.match(explain.stdout, /InitPlan/, "final RLS plan must contain an Auth InitPlan");

const history = await queryJson(root, `
  select version from supabase_migrations.schema_migrations
  where version = '20260926174027'
`);
assert.equal(history.length, 1, "new migration must be recorded exactly once locally");

console.log("CYCLE_12_13_STATIC_ALLOWLIST=PASS");
console.log("CYCLE_12_13_POLICIES_ALTERED=62");
console.log("CYCLE_12_13_UNEXPECTED_POLICIES_ALTERED=0");
console.log("CYCLE_12_13_PUBLIC_DIRECT_AUTH_POLICIES=0");
console.log("CYCLE_12_13_NULL_EQUIVALENCE=PASS");
console.log("CYCLE_12_13_SECURITY_DEFINER_METADATA=PASS");
console.log("CYCLE_12_13_INITPLAN=YES");
console.log("CYCLE_12_13_LOCAL_MIGRATION_HISTORY=PASS");

function key(item) {
  return `${item.table_name}.${item.policy_name}`;
}

function hasDirectAuth(expression) {
  return expression.replace(/\( SELECT auth\.uid\(\) AS uid\)/g, "").includes("auth.uid()");
}

function lifecycleBody() {
  const start = migration.indexOf("create or replace function public.admin_subscription_lifecycle_action");
  const end = migration.indexOf("-- Core ownership", start);
  return migration.slice(start, end);
}
