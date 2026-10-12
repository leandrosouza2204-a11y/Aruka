-- G4.1 production evidence template. SELECT/catalog only.
-- Do not add CALL, DO, EXPLAIN ANALYZE, DDL, DML, repair or configuration statements.

select current_database(), current_setting('server_version'), now() at time zone 'utc';

select version, name
from supabase_migrations.schema_migrations
order by version;

select n.nspname as schema_name, c.relname as table_name,
       c.relrowsecurity as rls_enabled, c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and n.nspname in ('public', 'private')
order by n.nspname, c.relname;

select p.oid::regprocedure::text as function_signature,
       p.prosecdef as security_definer,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_execute,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as authenticated_execute,
       has_function_privilege('service_role', p.oid, 'EXECUTE') as service_role_execute,
       p.proconfig
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by 1;

select to_regclass('private.student_experience_rollout_config')::text as config_table,
       to_regclass('private.student_experience_rollout_targets')::text as targets_table,
       to_regprocedure('public.get_my_student_experience_route()')::text as route_rpc;

select b.id, b.public, b.file_size_limit, b.allowed_mime_types,
       count(o.id)::bigint as object_count,
       coalesce(sum((o.metadata ->> 'size')::bigint), 0)::bigint as metadata_size_bytes,
       max(o.updated_at) as newest_object_update_at
from storage.buckets b
left join storage.objects o on o.bucket_id = b.id
group by b.id, b.public, b.file_size_limit, b.allowed_mime_types
order by b.id;

select extname, extversion
from pg_extension
order by extname;
