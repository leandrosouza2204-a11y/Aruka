create or replace view public.valid_workout_execution_sessions
with (security_invoker = true)
as
select *
from public.workout_execution_sessions
where status = 'completed';

revoke all on table public.valid_workout_execution_sessions from public, anon, authenticated;

create index if not exists workout_execution_exercises_prescription_session_idx
  on public.workout_execution_exercises (treino_exercicio_id, session_id)
  where treino_exercicio_id is not null;

create or replace function public.get_my_valid_workout_execution_history(p_limit integer default 20)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_aluno_id uuid;
begin
  select a.id into v_aluno_id
  from public.alunos a
  where a.student_user_id = auth.uid()
    and a.student_access_status = 'active';

  if v_aluno_id is null then
    raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_STUDENT_ACCESS_REQUIRED';
  end if;

  return coalesce((
    select jsonb_agg(public.workout_execution_session_payload(s.id) order by s.completed_at desc, s.id)
    from (
      select v.id, v.completed_at
      from public.valid_workout_execution_sessions v
      where v.aluno_id = v_aluno_id
      order by v.completed_at desc, v.id
      limit least(greatest(coalesce(p_limit, 20), 1), 50)
    ) s
  ), '[]'::jsonb);
end;
$$;

create or replace function public.get_my_previous_workout_performance(
  p_treino_exercicio_id uuid,
  p_before_session_id uuid default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_aluno_id uuid;
  v_before_started_at timestamptz;
  v_previous jsonb;
begin
  select a.id into v_aluno_id
  from public.alunos a
  where a.student_user_id = auth.uid()
    and a.student_access_status = 'active';

  if v_aluno_id is null then
    raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_STUDENT_ACCESS_REQUIRED';
  end if;

  if p_before_session_id is not null then
    select s.started_at into v_before_started_at
    from public.workout_execution_sessions s
    where s.id = p_before_session_id
      and s.aluno_id = v_aluno_id;
    if v_before_started_at is null then
      raise exception using errcode = '42501', message = 'SESSION_NOT_OWNED';
    end if;
  end if;

  select jsonb_build_object(
    'sessionId', s.id,
    'sessionDate', s.session_date,
    'completedAt', s.completed_at,
    'shortDurationConfirmed', s.short_duration_confirmed,
    'executionExerciseId', e.id,
    'trackingConfig', e.tracking_config_snapshot,
    'sets', coalesce((
      select jsonb_agg(jsonb_build_object(
        'setNumber', sets.set_number,
        'reps', sets.reps,
        'loadValue', sets.load_value,
        'loadUnit', sets.load_unit,
        'bodyweight', sets.bodyweight,
        'rir', sets.rir,
        'rpe', sets.rpe
      ) order by sets.set_number)
      from public.workout_execution_sets sets
      where sets.execution_exercise_id = e.id
        and sets.completed
    ), '[]'::jsonb)
  ) into v_previous
  from public.valid_workout_execution_sessions s
  join public.workout_execution_exercises e on e.session_id = s.id
  where s.aluno_id = v_aluno_id
    and e.treino_exercicio_id = p_treino_exercicio_id
    and (v_before_started_at is null or s.started_at < v_before_started_at)
  order by s.completed_at desc, s.id
  limit 1;

  return jsonb_build_object('previousExecution', v_previous);
end;
$$;

revoke all on function public.get_my_valid_workout_execution_history(integer), public.get_my_previous_workout_performance(uuid,uuid) from public, anon;
grant execute on function public.get_my_valid_workout_execution_history(integer), public.get_my_previous_workout_performance(uuid,uuid) to authenticated;
