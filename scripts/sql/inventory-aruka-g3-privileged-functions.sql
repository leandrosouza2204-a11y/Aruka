\pset tuples_only on
\pset format unaligned

select jsonb_pretty(jsonb_agg(to_jsonb(inventory) order by inventory.signature))
from (
  select
    'public.' || p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' as signature,
    pg_get_userbyid(p.proowner) as owner,
    p.prosecdef as security_definer,
    coalesce(array_to_string(p.proconfig, ','), '') as function_config,
    coalesce(array_to_string(p.proacl, ','), '') as acl,
    has_function_privilege('anon', p.oid, 'execute') as anon_execute,
    has_function_privilege('authenticated', p.oid, 'execute') as authenticated_execute,
    has_function_privilege('service_role', p.oid, 'execute') as service_role_execute,
    (select count(*) from pg_trigger t where t.tgfoid=p.oid and not t.tgisinternal) as trigger_dependencies
  from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.prosecdef
) inventory;
