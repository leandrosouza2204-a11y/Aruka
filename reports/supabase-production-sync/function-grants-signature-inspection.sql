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
