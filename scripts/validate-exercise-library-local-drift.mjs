import { queryJson } from "./supabase-cycle-8-lib.mjs";

const errors = [];
const one = (sql) => queryJson(process.cwd(), sql)[0] ?? {};

function expect(ok, message) {
  if (!ok) errors.push(message);
}

const migration = one("select exists (select 1 from supabase_migrations.schema_migrations where version = '20260905120000') as ok");
expect(migration.ok === true, "Migration 20260905120000 is not applied locally");

const columns = queryJson(
  process.cwd(),
  `select table_name, column_name
   from information_schema.columns
   where table_schema = 'public'
     and (
       table_name in ('exercise_library', 'exercise_favorites')
       or (table_name = 'treino_exercicios' and column_name = 'exercise_id')
     )`
);
const columnKeys = new Set(columns.map((row) => `${row.table_name}.${row.column_name}`));
for (const key of [
  "exercise_library.id",
  "exercise_library.owner_id",
  "exercise_library.origin",
  "exercise_library.name",
  "exercise_library.status",
  "exercise_library.media_path",
  "exercise_favorites.professional_id",
  "exercise_favorites.exercise_id",
  "treino_exercicios.exercise_id",
]) {
  expect(columnKeys.has(key), `Missing local column ${key}`);
}

const fk = one(
  `select rc.delete_rule
   from information_schema.referential_constraints rc
   join information_schema.table_constraints tc
     on tc.constraint_name = rc.constraint_name
    and tc.constraint_schema = rc.constraint_schema
   where tc.table_schema = 'public'
     and tc.table_name = 'treino_exercicios'
     and tc.constraint_name = 'treino_exercicios_exercise_id_fkey'`
);
expect(fk.delete_rule === "SET NULL", "treino_exercicios.exercise_id FK must use ON DELETE SET NULL");

const rls = queryJson(
  process.cwd(),
  `select tablename, rowsecurity
   from pg_tables
   where schemaname = 'public'
     and tablename in ('exercise_library', 'exercise_favorites')`
);
expect(rls.length === 2 && rls.every((row) => row.rowsecurity === true), "RLS must be enabled on exercise tables");

const policies = queryJson(
  process.cwd(),
  `select tablename, policyname, cmd
   from pg_policies
   where schemaname = 'public'
     and tablename in ('exercise_library', 'exercise_favorites')`
);
expect(policies.length === 7, `Expected 7 exercise policies, got ${policies.length}`);

const bucket = one("select public, file_size_limit, allowed_mime_types from storage.buckets where id = 'exercise-media'");
expect(bucket.public === false, "exercise-media bucket must be private");
expect(bucket.file_size_limit === 104857600, "exercise-media bucket size limit mismatch");
expect(Array.isArray(bucket.allowed_mime_types) && bucket.allowed_mime_types.includes("video/mp4"), "exercise-media MIME allowlist missing video/mp4");

if (errors.length > 0) {
  console.error("LOCAL_SCHEMA_DRIFT_GATE=FAIL");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("LOCAL_SCHEMA_DRIFT_GATE=PASS");
