-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 05 AOE PRECHECK
-- READ_ONLY_SQL=YES
select 'PASS_SKIP_STOP:aoe_signature' as check_name, p.proname, pg_get_function_identity_arguments(p.oid) as signature from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'aoe_idempotency_get_or_create';
select 'PASS_SKIP_STOP:aoe_grants' as check_name, grantee, privilege_type from information_schema.routine_privileges where routine_schema = 'public' and routine_name = 'aoe_idempotency_get_or_create' and grantee in ('anon','authenticated','service_role');
