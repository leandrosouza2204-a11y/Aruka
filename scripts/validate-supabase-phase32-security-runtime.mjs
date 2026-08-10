import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { queryJson } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const signature = "text, uuid, uuid, text, text, text";
const functionName = "aoe_idempotency_get_or_create";

const grants = queryJson(root, `
  select grantee, privilege_type
  from information_schema.routine_privileges
  where specific_schema = 'public'
    and routine_name = '${functionName}'
  order by grantee, privilege_type
`);

const anonExecute = grants.some((row) => row.grantee === "anon" && row.privilege_type.toLowerCase() === "execute");
const authenticatedExecute = grants.some((row) => row.grantee === "authenticated" && row.privilege_type.toLowerCase() === "execute");
const serviceRoleExecute = grants.some((row) => row.grantee === "service_role" && row.privilege_type.toLowerCase() === "execute");

if (anonExecute) throw new Error("anon still has EXECUTE on aoe_idempotency_get_or_create.");
if (!authenticatedExecute) throw new Error("authenticated EXECUTE was not preserved.");
if (!serviceRoleExecute) throw new Error("service_role EXECUTE was not preserved.");

const catalog = queryJson(root, `
  select pg_get_functiondef(p.oid) as definition
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname = '${functionName}'
    and pg_get_function_identity_arguments(p.oid) = 'p_id text, p_actor_id uuid, p_organization_id uuid, p_operation text, p_idempotency_key text, p_request_fingerprint text'
`);

if (catalog.length !== 1) throw new Error(`Expected one ${functionName}(${signature}) definition, found ${catalog.length}.`);

const migration = readFileSync("supabase/migrations/20260801173000_revoke_aoe_idempotency_anon_execute.sql", "utf8");
if (/create\s+or\s+replace\s+function/i.test(migration)) throw new Error("Migration must not replace the AOE function body.");
if (!/revoke\s+execute\s+on\s+function\s+public\.aoe_idempotency_get_or_create/i.test(migration)) throw new Error("Migration does not revoke the expected function.");

const definitionHash = createHash("sha256").update(catalog[0].definition.replace(/\s+/g, " ").trim()).digest("hex").slice(0, 12);

console.log(JSON.stringify({
  status: "SUPABASE_PHASE32_SECURITY_RUNTIME_PASS",
  function_name: functionName,
  anon_execute: false,
  authenticated_execute: true,
  service_role_execute: true,
  body_replaced_by_migration: false,
  local_definition_hash: definitionHash,
}));
