-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 04 REQUIRED FIELDS POSTCHECK
-- READ_ONLY_SQL=YES
select 'PASS_SKIP_STOP:required_fields_not_null' as check_name, column_name, is_nullable from information_schema.columns where table_schema = 'public' and table_name = 'alunos' and column_name in ('created_at','user_id','whatsapp') order by column_name;
