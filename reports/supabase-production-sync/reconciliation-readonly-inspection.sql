-- Supabase reconciliation read-only inspection package
-- Export each result set as CSV. Do not append corrective SQL.

-- Function grants by signature.
-- Function grants signature inspection
-- Execute manually in Supabase SQL Editor and export results as CSV.
-- Read-only SELECT statements only.

select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  r.specific_name,
  rp.grantee,
  rp.privilege_type,
  p.prosecdef as security_definer,
  coalesce(array_to_string(p.proconfig, ','), '') as function_config
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
left join information_schema.routines r
  on r.specific_schema = n.nspname
 and r.routine_name = p.proname
left join information_schema.routine_privileges rp
  on rp.specific_schema = r.specific_schema
 and rp.specific_name = r.specific_name
where n.nspname = 'public'
order by p.proname, identity_arguments, rp.grantee, rp.privilege_type;


-- Nullability profile for divergent columns.
-- Remote nullability profile
-- Read-only. Execute manually and export the result.

select 'alunos' as table_name, 'acompanhamento_motivo' as column_name, count(*) as total_rows, count(*) filter (where "acompanhamento_motivo" is null) as null_rows from public."alunos";
select 'alunos' as table_name, 'created_at' as column_name, count(*) as total_rows, count(*) filter (where "created_at" is null) as null_rows from public."alunos";
select 'alunos' as table_name, 'inicio' as column_name, count(*) as total_rows, count(*) filter (where "inicio" is null) as null_rows from public."alunos";
select 'alunos' as table_name, 'observacoes' as column_name, count(*) as total_rows, count(*) filter (where "observacoes" is null) as null_rows from public."alunos";
select 'alunos' as table_name, 'pagamento_recebido' as column_name, count(*) as total_rows, count(*) filter (where "pagamento_recebido" is null) as null_rows from public."alunos";
select 'alunos' as table_name, 'plano' as column_name, count(*) as total_rows, count(*) filter (where "plano" is null) as null_rows from public."alunos";
select 'alunos' as table_name, 'status' as column_name, count(*) as total_rows, count(*) filter (where "status" is null) as null_rows from public."alunos";
select 'alunos' as table_name, 'user_id' as column_name, count(*) as total_rows, count(*) filter (where "user_id" is null) as null_rows from public."alunos";
select 'alunos' as table_name, 'valor' as column_name, count(*) as total_rows, count(*) filter (where "valor" is null) as null_rows from public."alunos";
select 'alunos' as table_name, 'whatsapp' as column_name, count(*) as total_rows, count(*) filter (where "whatsapp" is null) as null_rows from public."alunos";


-- Role existence relevant to reconciliation.
select rolname, rolcanlogin, rolsuper from pg_roles where rolname in ('anon', 'authenticated', 'service_role', 'postgres', 'supabase_admin', 'dashboard_user') order by rolname;

-- Critical grants currently visible through information_schema.
select table_name, grantee, privilege_type
from information_schema.table_privileges
where table_schema = 'public'
  and grantee in ('anon', 'authenticated', 'PUBLIC', 'public')
order by table_name, grantee, privilege_type;

-- Public functions with security mode and configuration.
select n.nspname as schema_name, p.proname as function_name, pg_get_function_identity_arguments(p.oid) as identity_arguments, p.prosecdef as security_definer, coalesce(array_to_string(p.proconfig, ','), '') as function_config
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname, identity_arguments;
