-- Supabase production schema read-only inspection.
-- Target: aruka (vriz...vdik).
-- Purpose: inspect whether the remote public schema is empty, matches local migrations,
-- or contains untracked/manual objects before any migration push.
-- Safety: this file contains only SELECT statements.

select
  table_schema,
  table_name
from information_schema.tables
where table_schema = 'public'
  and table_type = 'BASE TABLE'
order by table_name;

select
  table_schema,
  table_name,
  column_name,
  data_type,
  is_nullable
from information_schema.columns
where table_schema = 'public'
order by table_name, ordinal_position;

select
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  tc.constraint_type,
  cc.check_clause
from information_schema.table_constraints tc
left join information_schema.check_constraints cc
  on cc.constraint_schema = tc.constraint_schema
  and cc.constraint_name = tc.constraint_name
where tc.table_schema = 'public'
order by tc.table_name, tc.constraint_name;

select
  schemaname,
  tablename,
  indexname,
  indexdef
from pg_indexes
where schemaname = 'public'
order by tablename, indexname;

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname = 'public'
order by tablename, policyname;

select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  p.prosecdef as security_definer,
  array_to_string(p.proconfig, ',') as function_config
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname, arguments;

select
  table_schema,
  table_name,
  privilege_type,
  grantee
from information_schema.table_privileges
where table_schema = 'public'
order by table_name, grantee, privilege_type;

select
  routine_schema,
  routine_name,
  privilege_type,
  grantee
from information_schema.routine_privileges
where routine_schema = 'public'
order by routine_name, grantee, privilege_type;

select
  to_regclass('supabase_migrations.schema_migrations') as migration_history_table;

select
  version,
  name,
  statements
from supabase_migrations.schema_migrations
order by version;
