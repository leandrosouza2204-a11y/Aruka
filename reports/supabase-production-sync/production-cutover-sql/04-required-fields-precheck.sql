-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 04 REQUIRED FIELDS PRECHECK
-- READ_ONLY_SQL=YES
select 'PASS_SKIP_STOP:required_fields_nulls' as check_name, count(*) as total_rows, count(*) filter (where created_at is null) as null_created_at, count(*) filter (where user_id is null) as null_user_id, count(*) filter (where whatsapp is null) as null_whatsapp from public.alunos;
