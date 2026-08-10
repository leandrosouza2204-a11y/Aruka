-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 02 STUDENT IDENTITY POSTCHECK
-- READ_ONLY_SQL=YES
select 'PASS_SKIP_STOP:student_column' as check_name, column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'alunos' and column_name in ('user_id','student_user_id');
select 'PASS_SKIP_STOP:student_fk_indexes_role' as check_name, conname, pg_get_constraintdef(oid) from pg_constraint where connamespace in ('public'::regnamespace) and conname in ('alunos_student_user_id_fkey','perfis_role_check');
select 'PASS_SKIP_STOP:student_indexes' as check_name, indexname, indexdef from pg_indexes where schemaname = 'public' and indexname in ('alunos_student_user_id_uidx','alunos_student_user_id_idx');
select 'PASS_SKIP_STOP:student_rpcs' as check_name, p.proname, p.prosecdef, md5(pg_get_functiondef(p.oid)) as body_hash_target, pg_get_functiondef(p.oid) like '%SET search_path TO public%' as search_path_public from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public' and p.proname in ('vincular_aluno_usuario','desvincular_aluno_usuario','get_my_student_workouts');
select 'PASS_SKIP_STOP:professional_owner_column' as check_name, col_description('public.alunos'::regclass, (select ordinal_position from information_schema.columns where table_schema='public' and table_name='alunos' and column_name='user_id')) as user_id_comment;
