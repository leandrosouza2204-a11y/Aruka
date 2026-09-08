import { queryJson } from "./supabase-cycle-8-lib.mjs";

const errors = [];
const one = (sql) => queryJson(process.cwd(), sql)[0] ?? {};

function expect(ok, message) {
  if (!ok) errors.push(message);
}

const migration = one("select exists (select 1 from supabase_migrations.schema_migrations where version = '20260908110000') as ok");
expect(migration.ok === true, "Migration 20260908110000 is not applied locally");

const columns = queryJson(
  process.cwd(),
  `select table_name, column_name, data_type, numeric_precision, numeric_scale
   from information_schema.columns
   where table_schema = 'public'
     and table_name in (
       'smart_management_locations',
       'smart_management_transfer_rules',
       'smart_management_transfer_tiers'
     )`
);
const columnKeys = new Set(columns.map((row) => `${row.table_name}.${row.column_name}`));
for (const key of [
  "smart_management_locations.professional_id",
  "smart_management_locations.name",
  "smart_management_locations.status",
  "smart_management_transfer_rules.location_id",
  "smart_management_transfer_rules.professional_id",
  "smart_management_transfer_rules.rule_type",
  "smart_management_transfer_rules.fixed_amount",
  "smart_management_transfer_rules.per_student_amount",
  "smart_management_transfer_rules.percentage_rate",
  "smart_management_transfer_tiers.transfer_rule_id",
  "smart_management_transfer_tiers.professional_id",
  "smart_management_transfer_tiers.min_students",
  "smart_management_transfer_tiers.max_students",
  "smart_management_transfer_tiers.amount",
]) {
  expect(columnKeys.has(key), `Missing local column ${key}`);
}

for (const key of [
  ["smart_management_transfer_rules", "fixed_amount", 10, 2],
  ["smart_management_transfer_rules", "per_student_amount", 10, 2],
  ["smart_management_transfer_rules", "percentage_rate", 5, 2],
  ["smart_management_transfer_tiers", "amount", 10, 2],
]) {
  const [table, column, precision, scale] = key;
  const found = columns.find((row) => row.table_name === table && row.column_name === column);
  expect(found?.numeric_precision === precision && found?.numeric_scale === scale, `${table}.${column} numeric precision mismatch`);
}

const rls = queryJson(
  process.cwd(),
  `select tablename, rowsecurity
   from pg_tables
   where schemaname = 'public'
     and tablename in (
       'smart_management_locations',
       'smart_management_transfer_rules',
       'smart_management_transfer_tiers'
     )`
);
expect(rls.length === 3 && rls.every((row) => row.rowsecurity === true), "RLS must be enabled on smart management tables");

const policies = queryJson(
  process.cwd(),
  `select tablename, policyname
   from pg_policies
   where schemaname = 'public'
     and tablename in (
       'smart_management_locations',
       'smart_management_transfer_rules',
       'smart_management_transfer_tiers'
     )`
);
expect(policies.length === 3, `Expected 3 smart management policies, got ${policies.length}`);

const indexes = queryJson(
  process.cwd(),
  `select indexname
   from pg_indexes
   where schemaname = 'public'
     and indexname like 'smart_management_%'`
);
expect(indexes.length >= 5, "Expected smart management indexes are missing");

if (errors.length > 0) {
  console.error("SMART_MANAGEMENT_LOCAL_DRIFT=FAIL");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SMART_MANAGEMENT_LOCAL_DRIFT=PASS");
