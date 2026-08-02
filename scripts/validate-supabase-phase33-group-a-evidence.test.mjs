import test from "node:test";
import assert from "node:assert/strict";
import {
  validateExpectedCsvDirectory,
  validateNoMigrationDiff,
  validateReadonlySql,
  validateRequest,
  validateSqlCoverage,
  validateTargetFunction
} from "./validate-supabase-phase33-group-a-evidence.mjs";

const goodSql = `
select pg_get_functiondef(p.oid), pg_get_function_identity_arguments(p.oid), p.proacl
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname = 'set_workout_templates_updated_at';
select pg_get_triggerdef(t.oid, true) from pg_trigger t;
select acl.privilege_type from pg_proc p cross join lateral aclexplode(p.proacl) acl;
`;

test("accepts the exact Phase 3.3 target function", () => {
  assert.doesNotThrow(() => validateTargetFunction(goodSql));
});

test("rejects a different function in executable SQL", () => {
  assert.throws(() => validateTargetFunction(`${goodSql}\nselect admin_eh_admin();`), /PHASE33_OUT_OF_SCOPE_FUNCTION/);
});

test("rejects write SQL statements", () => {
  assert.throws(() => validateReadonlySql(`${goodSql}\nalter function public.set_workout_templates_updated_at() owner to postgres;`), /PHASE33_READONLY_SQL_FORBIDDEN_STATEMENT/);
  assert.throws(() => validateReadonlySql(`${goodSql}\nrevoke execute on function public.set_workout_templates_updated_at() from anon;`), /PHASE33_READONLY_SQL_FORBIDDEN_STATEMENT/);
});

test("requires function definition coverage", () => {
  assert.throws(() => validateSqlCoverage(goodSql.replace("pg_get_functiondef", "p.oid")), /PHASE33_FUNCTION_DEFINITION_QUERY_MISSING/);
});

test("requires trigger coverage", () => {
  assert.throws(() => validateSqlCoverage(goodSql.replace("pg_trigger", "pg_proc")), /PHASE33_TRIGGER_QUERY_MISSING/);
});

test("requires grant coverage", () => {
  assert.throws(() => validateSqlCoverage(goodSql.replace("aclexplode", "unnest")), /PHASE33_GRANTS_QUERY_MISSING/);
});

test("rejects migration diffs", () => {
  assert.throws(() => validateNoMigrationDiff("supabase/migrations/20260801180000_bad.sql\n"), /PHASE33_MIGRATION_DIFF_NOT_ALLOWED/);
});

test("requires the ignored CSV evidence directory", () => {
  assert.throws(() => validateExpectedCsvDirectory("reports/supabase-production-sync/remote-phase31-input/"), /PHASE33_EXPECTED_CSV_DIRECTORY_MISSING/);
});

test("validates the evidence request contract", () => {
  assert.doesNotThrow(() => validateRequest({
    decision: "READY_FOR_PHASE33_EVIDENCE_COLLECTION",
    supabase_change: "NO",
    migration_created: "NO",
    target: {
      function_name: "set_workout_templates_updated_at",
      identity_arguments: ""
    },
    expected_export_directory: "reports/supabase-production-sync/remote-phase33-input/"
  }));
});
