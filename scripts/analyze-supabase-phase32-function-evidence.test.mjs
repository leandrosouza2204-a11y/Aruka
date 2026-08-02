import test from "node:test";
import assert from "node:assert/strict";

import {
  classifyRow,
  decisionFor,
  grantsFromAcl,
  hash,
  normalizeFunctionDefinition,
  parseCsv,
} from "./analyze-supabase-phase32-function-evidence.mjs";

test("parses multiline CSV using function identity arguments", () => {
  const rows = parseCsv('schema_name,function_name,identity_arguments,full_definition\npublic,x,"a uuid","create function x()\nreturns void"\n');
  assert.equal(rows.length, 2);
  assert.equal(rows[1][2], "a uuid");
  assert.match(rows[1][3], /returns void/);
});

test("normalization preserves semantic SQL differences but removes whitespace noise", () => {
  assert.equal(normalizeFunctionDefinition("SELECT  1\n"), normalizeFunctionDefinition("select 1"));
  assert.notEqual(normalizeFunctionDefinition("select 1"), normalizeFunctionDefinition("select 2"));
});

test("hashes are stable and compact", () => {
  assert.equal(hash("abc"), hash("abc"));
  assert.equal(hash("abc").length, 12);
});

test("extracts execute grants from ACL text", () => {
  const grants = grantsFromAcl("{postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}");
  assert.deepEqual(grants, ["anon.execute", "authenticated.execute", "postgres.execute", "service_role.execute"]);
});

test("classifies remote overloads", () => {
  assert.equal(classifyRow({ local: null, remote: { full_definition: "x" }, category: "ADMIN" }), "REMOTE_OVERLOAD_ONLY");
});

test("detects body equivalent after normalization", () => {
  const local = { definition: "CREATE FUNCTION x() RETURNS void AS $$ BEGIN RETURN; END; $$", security_definer: "false", volatility: "VOLATILE", grants: [] };
  const remote = { full_definition: "create function x() returns void as $$ begin return; end; $$", security_definer: "false", volatility: "VOLATILE", grants: [] };
  assert.equal(classifyRow({ local, remote, category: "UTILITY" }), "BODY_EQUIVALENT_NORMALIZED");
});

test("Group A decision is emitted for utility security configuration difference", () => {
  const row = {
    function_name: "set_workout_templates_updated_at",
    security_state: "SECURITY_CONFIGURATION_DIFFERENT",
    grant_state: "GRANT_EQUIVALENT",
    remote_grants: "",
  };
  assert.equal(decisionFor(row), "READY_FOR_PHASE32_GROUP_A_MIGRATION");
});

test("Group E decision is emitted for AOE anon execute grant difference", () => {
  const row = {
    function_name: "aoe_idempotency_get_or_create",
    security_state: "SECURITY_EQUIVALENT",
    grant_state: "GRANT_DIFFERENT",
    remote_grants: "anon.execute; authenticated.execute",
  };
  assert.equal(decisionFor(row), "READY_FOR_AOE_EXECUTE_SECURITY_MIGRATION");
});

test("financial body differences stay blocked by financial gate", () => {
  const row = {
    category: "FINANCIAL",
    function_name: "admin_upsert_assinatura",
    body_state: "BODY_DIFFERENT_CONFIRMED",
    security_state: "SECURITY_EQUIVALENT",
    grant_state: "GRANT_EQUIVALENT",
    remote_grants: "",
  };
  assert.equal(decisionFor(row), "FINANCIAL_OWNER_REVIEW_REQUIRED");
});

test("student identity remains deferred", () => {
  assert.equal(decisionFor({ category: "STUDENT_IDENTITY", function_name: "vincular_aluno_usuario" }), "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT");
});
