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
