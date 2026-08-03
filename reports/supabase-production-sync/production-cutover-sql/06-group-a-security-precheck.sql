-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 06 GROUP A PRECHECK
-- READ_ONLY_SQL=YES
select 'PASS_SKIP_STOP:group_a_function' as check_name, p.proname, p.prosecdef as security_definer, md5(pg_get_functiondef(p.oid)) as body_hash_before, pg_get_functiondef(p.oid) like '%SET search_path TO public%' as search_path_public from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname = 'set_workout_templates_updated_at';
select 'PASS_SKIP_STOP:group_a_trigger' as check_name, tgname, pg_get_triggerdef(oid) as definition from pg_trigger where tgname = 'set_workout_templates_updated_at';
select 'PASS_SKIP_STOP:group_a_grants' as check_name, grantee, privilege_type from information_schema.routine_privileges where routine_schema = 'public' and routine_name = 'set_workout_templates_updated_at';
