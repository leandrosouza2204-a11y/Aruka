-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 03 SECURITY PRECHECK
-- READ_ONLY_SQL=YES
select 'PASS_SKIP_STOP:security_tables' as check_name, table_name from information_schema.tables where table_schema = 'public' and table_name in ('perfis','planos','assinaturas','pagamentos','admin_logs','aceites_legais','avaliacoes','anamneses','treinos','treino_dias','treino_exercicios','workout_templates','aoe_decisions','aoe_decision_traces','aoe_human_reviews','aoe_idempotency_keys','aoe_audit_events','treino_eventos');
select 'PASS_SKIP_STOP:security_rpcs' as check_name, routine_name from information_schema.routines where routine_schema = 'public' and routine_name in ('salvar_treino_composto','entregar_treino','alterar_estado_treino');
select 'PASS_SKIP_STOP:security_policies_current' as check_name, schemaname, tablename, policyname, roles, cmd from pg_policies where schemaname = 'public' order by tablename, policyname;
select 'PASS_SKIP_STOP:security_grants_current' as check_name, table_schema, table_name, grantee, privilege_type from information_schema.table_privileges where table_schema = 'public' and grantee in ('anon','authenticated') order by table_name, grantee, privilege_type;
