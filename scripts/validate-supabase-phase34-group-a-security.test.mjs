import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeBody,
  parseCsv,
  validateEvidence,
  validateMigrationSql
} from "./validate-supabase-phase34-group-a-security.mjs";

const migration = `begin;
alter function public.set_workout_templates_updated_at()
  set search_path = public;
revoke execute on function public.set_workout_templates_updated_at() from public;
revoke execute on function public.set_workout_templates_updated_at() from anon;
revoke execute on function public.set_workout_templates_updated_at() from authenticated;
commit;`;

test("accepts the exact migration", () => {
  assert.doesNotThrow(() => validateMigrationSql(migration));
});

test("rejects function body replacement", () => {
  assert.throws(() => validateMigrationSql(`${migration}\ncreate or replace function public.set_workout_templates_updated_at() returns trigger as $$ begin return new; end $$ language plpgsql;`), /PHASE34_CREATE_OR_REPLACE_FORBIDDEN/);
});

test("rejects platform role revokes and extra grants", () => {
  assert.throws(() => validateMigrationSql(`${migration}\nrevoke execute on function public.set_workout_templates_updated_at() from service_role;`), /PHASE34_PLATFORM_REVOKE_FORBIDDEN/);
  assert.throws(() => validateMigrationSql(`${migration}\nrevoke execute on function public.set_workout_templates_updated_at() from postgres;`), /PHASE34_PLATFORM_REVOKE_FORBIDDEN/);
  assert.throws(() => validateMigrationSql(`${migration}\ngrant execute on function public.set_workout_templates_updated_at() to authenticated;`), /PHASE34_GRANT_FORBIDDEN/);
});

test("rejects out-of-scope database changes", () => {
  assert.throws(() => validateMigrationSql(`${migration}\nalter table public.workout_templates add column x text;`), /PHASE34_ALTER_TABLE_FORBIDDEN/);
  assert.throws(() => validateMigrationSql(`${migration}\nalter trigger set_workout_templates_updated_at on public.workout_templates rename to changed;`), /PHASE34_TRIGGER_CHANGE_FORBIDDEN/);
  assert.throws(() => validateMigrationSql(`${migration}\nupdate public.workout_templates set name = name;`), /PHASE34_DATA_WRITE_FORBIDDEN/);
});

test("rejects other functions and domains", () => {
  assert.throws(() => validateMigrationSql(`${migration}\nrevoke execute on function public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) from anon;`), /PHASE34_OUT_OF_SCOPE_OBJECT_FORBIDDEN/);
  assert.throws(() => validateMigrationSql(`${migration}\nrevoke execute on function public.get_my_student_workouts() from authenticated;`), /PHASE34_OUT_OF_SCOPE_OBJECT_FORBIDDEN/);
});

test("normalizes equivalent function bodies", () => {
  const remote = "CREATE OR REPLACE FUNCTION public.set_workout_templates_updated_at()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nbegin\n  new.updated_at = now();\n  return new;\nend;\n$function$";
  const local = "create or replace function public.set_workout_templates_updated_at()\nreturns trigger\nlanguage plpgsql\nset search_path = public\nas $$\nbegin\nnew.updated_at = now(); return new;\nend;\n$$;";
  assert.equal(normalizeBody(remote), normalizeBody(local));
});

test("parses multiline CSV fields", () => {
  const rows = parseCsv('name,definition\nx,"begin\n  return new;\n"\n');
  assert.equal(rows[0].definition, "begin\n  return new;\n");
});

test("rejects body differences in evidence", () => {
  const evidence = buildEvidence("begin\n  return old;\nend;");
  assert.throws(() => validateEvidence(evidence, "begin\n  new.updated_at = now();\n  return new;\nend;"), /BLOCKED_GROUP_A_BODY_DIFFERENCE/);
});

function buildEvidence(remoteBody) {
  return {
    FUNCTION_DEFINITION_EVIDENCE: {
      rows: [{
        schema_name: "public",
        function_name: "set_workout_templates_updated_at",
        identity_arguments: "",
        result_type: "trigger",
        language_name: "plpgsql",
        volatility: "VOLATILE",
        security_definer: "false",
        leakproof: "false",
        strict: "false",
        parallel_mode: "u",
        owner_name: "postgres",
        function_config: "null",
        full_definition: `CREATE OR REPLACE FUNCTION public.set_workout_templates_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ ${remoteBody} $$`
      }]
    },
    TRIGGER_DEPENDENCY_EVIDENCE: {
      rows: [{
        table_schema: "public",
        table_name: "workout_templates",
        trigger_name: "set_workout_templates_updated_at",
        trigger_enabled: "enabled",
        function_schema: "public",
        function_name: "set_workout_templates_updated_at",
        identity_arguments: "",
        trigger_definition: "CREATE TRIGGER set_workout_templates_updated_at BEFORE UPDATE ON workout_templates FOR EACH ROW EXECUTE FUNCTION set_workout_templates_updated_at()"
      }]
    },
    FUNCTION_GRANT_EVIDENCE: {
      rows: ["PUBLIC", "anon", "authenticated", "postgres", "service_role"].map((grantee) => ({
        schema_name: "public",
        function_name: "set_workout_templates_updated_at",
        identity_arguments: "",
        grantee,
        privilege_type: "EXECUTE"
      }))
    },
    DEPENDENCY_METADATA_EVIDENCE: {
      rows: [
        { referenced_catalog: "pg_language", dependency_type: "n" },
        { referenced_catalog: "pg_namespace", dependency_type: "n" }
      ]
    }
  };
}
