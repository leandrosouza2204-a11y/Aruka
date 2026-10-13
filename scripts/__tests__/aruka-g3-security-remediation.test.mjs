import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL("../../supabase/migrations/20261011232512_harden_privileged_function_execution.sql", import.meta.url),
  "utf8",
);
const runtime = readFileSync(
  new URL("../sql/validate-aruka-g3-security-remediation.sql", import.meta.url),
  "utf8",
);
const runner = readFileSync(
  new URL("../run-aruka-g3-security-remediation.mjs", import.meta.url),
  "utf8",
);

test("migration defines the exact 22-signature allowlist", () => {
  const rows = [...migration.matchAll(/^\s*\('([^']+)',\s*(true|false),\s*(?:true|false),\s*(?:true|false),/gm)];
  const signatures = rows.map((match) => match[1]);
  assert.equal(signatures.length, 22);
  assert.equal(new Set(signatures).size, 22);
  assert.equal(rows.filter((match) => match[2] === "true").length, 17);
  assert.ok(signatures.includes("aoe_idempotency_get_or_create(text,uuid,uuid,text,text,text)"));
  assert.ok(signatures.includes("processar_encerramento_automatico_aluno(uuid,uuid,date,date,text,uuid,text,integer,text)"));
});

test("background mutations are service-only and every target loses implicit execution", () => {
  assert.match(migration, /aoe_idempotency_get_or_create[^\n]+true, false, true/);
  assert.match(migration, /processar_encerramento_automatico_aluno[^\n]+true, false, true/);
  assert.match(migration, /revoke all privileges on function %s from public, anon, authenticated, service_role/);
  assert.match(migration, /set search_path = %L/);
  assert.match(migration, /G3_SECURITY_ANON_DEFINER_EXECUTE_REMAINS/);
});

test("runtime proof covers anonymous, forged authenticated, service and overload paths", () => {
  for (const marker of [
    "anon_privileged_execution_zero",
    "authenticated_forged_ids_denied",
    "service_role_internal_contract",
    "authenticated_legitimate_rpcs",
    "legacy_overloads_closed",
    "target_search_path_empty",
  ]) assert.match(runtime, new RegExp(marker));
  assert.match(runtime, /set local role anon/);
  assert.match(runtime, /set local role authenticated/);
  assert.match(runtime, /set local role service_role/);
  assert.match(runtime, /rollback;/);
  assert.match(runtime, /pg_get_function_identity_arguments/);
});

test("runner is isolated, resumable, atomic with history, and emits restricted reports", () => {
  assert.match(runner, /NetworkMode, "none"/);
  assert.match(runner, /initialHistory\.length === 40 \|\| initialHistory\.length === 41/);
  assert.match(runner, /insert into supabase_migrations\.schema_migrations/);
  assert.match(runner, /vulnerability-proof-before\.txt/);
  assert.match(runner, /legacyProof\.status === 0/);
  assert.match(runner, /permission denied for function/);
  assert.match(runner, /replace\(\/\\r\\n\/g, "\\n"\)/);
  assert.match(runner, /raw_worktree_sha256/);
  assert.match(runner, /privileged-functions-before\.json/);
  assert.match(runner, /report\.json/);
  assert.match(runner, /production_writes: 0/);
});
