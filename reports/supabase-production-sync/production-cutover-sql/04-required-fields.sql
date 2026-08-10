-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 04 REQUIRED FIELDS
-- DO NOT RUN WITHOUT APPROVED PRECHECKS
-- NOT A MIGRATION FILE
-- PRODUCTION_EXECUTION_AUTHORIZED=NO
-- DB_PUSH_ALLOWED_NOW=NO
-- HISTORY_ALIGNMENT_ALLOWED_NOW=NO
begin;

alter table public.alunos
  alter column created_at set not null,
  alter column user_id set not null,
  alter column whatsapp set not null;

commit;
