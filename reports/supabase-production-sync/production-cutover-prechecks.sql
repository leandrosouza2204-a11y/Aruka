-- Production cutover prechecks. Read-only only.
select 'migration_history' as check_name, version, name from supabase_migrations.schema_migrations order by version;
select 'required_fields_nulls' as check_name,
  count(*) filter (where created_at is null) as created_at_nulls,
  count(*) filter (where user_id is null) as user_id_nulls,
  count(*) filter (where whatsapp is null) as whatsapp_nulls
from public.alunos;
select 'student_identity_column' as check_name, column_name, data_type, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'alunos' and column_name in ('user_id', 'student_user_id');
select 'student_identity_constraints' as check_name, conname from pg_constraint where conname in ('alunos_student_user_id_fkey', 'perfis_role_check');
select 'student_identity_indexes' as check_name, indexname from pg_indexes where schemaname = 'public' and indexname in ('alunos_student_user_id_uidx', 'alunos_student_user_id_idx');
select 'workout_delivery_columns' as check_name, column_name from information_schema.columns where table_schema = 'public' and table_name = 'treinos' and column_name in ('lifecycle_status', 'template_origin_snapshot', 'application_idempotency_key');
select 'workout_delivery_events' as check_name, table_name from information_schema.tables where table_schema = 'public' and table_name = 'treino_eventos';
select 'function_signatures' as check_name, routine_name from information_schema.routines where routine_schema = 'public' and routine_name in ('salvar_treino_composto', 'entregar_treino', 'alterar_estado_treino', 'vincular_aluno_usuario', 'desvincular_aluno_usuario', 'get_my_student_workouts', 'aoe_idempotency_get_or_create', 'set_workout_templates_updated_at');
select 'policies' as check_name, schemaname, tablename, policyname from pg_policies where schemaname = 'public';
select 'function_grants' as check_name, routine_name, grantee, privilege_type from information_schema.routine_privileges where routine_schema = 'public';
