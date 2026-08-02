import { createHash } from "node:crypto";
import { queryJson, runPsql } from "./supabase-cycle-8-lib.mjs";
import { normalizeBody } from "./validate-supabase-phase34-group-a-security.mjs";

const root = process.cwd();
const functionName = "set_workout_templates_updated_at";

const functions = queryJson(root, `
  select
    p.prosecdef as security_definer,
    p.proconfig as function_config,
    pg_get_functiondef(p.oid) as definition
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = '${functionName}'
    and pg_get_function_identity_arguments(p.oid) = ''
`);

if (functions.length !== 1) throw new Error(`Expected one ${functionName}(), found ${functions.length}.`);
const fn = functions[0];
if (fn.security_definer !== false) throw new Error("Function unexpectedly uses SECURITY DEFINER.");
if (!Array.isArray(fn.function_config) || !fn.function_config.includes("search_path=public")) throw new Error("Function search_path is not public.");

const expectedBody = normalizeBody("begin\n  new.updated_at = now();\n  return new;\nend;");
const actualBody = normalizeBody(fn.definition);
if (actualBody !== expectedBody) throw new Error("Function body changed.");

const triggers = queryJson(root, `
  select
    tn.nspname as table_schema,
    c.relname as table_name,
    t.tgname as trigger_name,
    t.tgenabled as trigger_enabled,
    pg_get_triggerdef(t.oid, true) as trigger_definition
  from pg_trigger t
  join pg_class c on c.oid = t.tgrelid
  join pg_namespace tn on tn.oid = c.relnamespace
  join pg_proc p on p.oid = t.tgfoid
  join pg_namespace pn on pn.oid = p.pronamespace
  where not t.tgisinternal
    and pn.nspname = 'public'
    and p.proname = '${functionName}'
    and pg_get_function_identity_arguments(p.oid) = ''
`);

if (triggers.length !== 1) throw new Error(`Expected one trigger dependency, found ${triggers.length}.`);
const trigger = triggers[0];
const triggerDefinition = trigger.trigger_definition.toLowerCase();
if (trigger.table_schema !== "public" || trigger.table_name !== "workout_templates") throw new Error("Trigger table mismatch.");
if (trigger.trigger_name !== functionName || trigger.trigger_enabled !== "O") throw new Error("Trigger enabled/name mismatch.");
if (!triggerDefinition.includes("before update") || !triggerDefinition.includes("for each row")) throw new Error("Trigger timing/orientation mismatch.");

const grants = queryJson(root, `
  select grantee, privilege_type
  from information_schema.routine_privileges
  where routine_schema = 'public'
    and routine_name = '${functionName}'
  order by grantee, privilege_type
`);

function hasExecute(role) {
  return grants.some((row) => row.grantee === role && row.privilege_type === "EXECUTE");
}

if (hasExecute("PUBLIC")) throw new Error("PUBLIC still has EXECUTE.");
if (hasExecute("anon")) throw new Error("anon still has EXECUTE.");
if (hasExecute("authenticated")) throw new Error("authenticated still has EXECUTE.");
if (!hasExecute("postgres")) throw new Error("postgres EXECUTE was not preserved.");
if (!hasExecute("service_role")) throw new Error("service_role EXECUTE was not preserved.");

runPsql(root, String.raw`
begin;

insert into auth.users (id, aud, role, email, email_confirmed_at, created_at, updated_at)
values ('30000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'phase34-owner@example.invalid', now(), now(), now());

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status)
values ('30000000-0000-4000-8000-000000000101', '30000000-0000-4000-8000-000000000001', 'Phase34 Owner', 'phase34-owner@example.invalid', 'user', 'assinante', 'ativo');

insert into public.workout_templates (id, owner_id, name, objective, split_type, template_data, is_system, is_active, updated_at)
values ('30000000-0000-4000-8000-000000000201', '30000000-0000-4000-8000-000000000001', 'Phase34 Template', 'Forca', 'Outro', '{}'::jsonb, false, true, '2026-01-01 00:00:00+00');

do $$
declare
  before_value timestamptz;
  after_value timestamptz;
begin
  select updated_at into before_value
  from public.workout_templates
  where id = '30000000-0000-4000-8000-000000000201';

  perform pg_sleep(0.01);

  update public.workout_templates
  set name = 'Phase34 Template Updated'
  where id = '30000000-0000-4000-8000-000000000201';

  select updated_at into after_value
  from public.workout_templates
  where id = '30000000-0000-4000-8000-000000000201';

  if after_value <= before_value then
    raise exception 'updated_at trigger did not advance';
  end if;
end $$;

rollback;
`, { timeoutMs: 120000 });

console.log(JSON.stringify({
  status: "SUPABASE_PHASE34_GROUP_A_SECURITY_RUNTIME_PASS",
  function_name: functionName,
  security_definer: false,
  search_path: "public",
  body_hash: createHash("sha256").update(actualBody).digest("hex").slice(0, 12),
  grants: {
    PUBLIC_execute: false,
    anon_execute: false,
    authenticated_execute: false,
    postgres_execute: true,
    service_role_execute: true
  },
  trigger_runtime: "PASS"
}));
