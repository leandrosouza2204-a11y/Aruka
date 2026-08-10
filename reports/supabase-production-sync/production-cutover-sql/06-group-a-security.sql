-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 06 GROUP A SECURITY
-- DO NOT RUN WITHOUT APPROVED PRECHECKS
-- NOT A MIGRATION FILE
-- PRODUCTION_EXECUTION_AUTHORIZED=NO
-- DB_PUSH_ALLOWED_NOW=NO
-- HISTORY_ALIGNMENT_ALLOWED_NOW=NO
begin;

alter function public.set_workout_templates_updated_at()
  set search_path = public;

revoke execute
  on function public.set_workout_templates_updated_at()
  from public;

revoke execute
  on function public.set_workout_templates_updated_at()
  from anon;

revoke execute
  on function public.set_workout_templates_updated_at()
  from authenticated;

commit;
