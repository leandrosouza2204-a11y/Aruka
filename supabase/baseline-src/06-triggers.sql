create or replace trigger set_workout_templates_updated_at
before update on public.workout_templates
for each row execute function public.set_workout_templates_updated_at();

create or replace trigger set_exercise_library_updated_at
before update on public.exercise_library
for each row execute function public.set_exercise_library_updated_at();
