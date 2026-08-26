drop function if exists public.start_workout_execution_session(uuid, uuid, text);

create or replace function public.start_workout_execution_session(
  p_treino_id uuid,
  p_treino_dia_id uuid default null,
  p_idempotency_key text default null,
  p_session_date date default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_user_id uuid := auth.uid();
  v_aluno public.alunos%rowtype;
  v_treino public.treinos%rowtype;
  v_session_id uuid;
  v_key text := nullif(btrim(coalesce(p_idempotency_key, '')), '');
begin
  if v_student_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select * into v_aluno from public.alunos where student_user_id = v_student_user_id;
  if not found or v_aluno.student_access_status <> 'active' then
    raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_STUDENT_ACCESS_REQUIRED';
  end if;

  select * into v_treino from public.treinos where id = p_treino_id and aluno_id = v_aluno.id and lifecycle_status = 'active';
  if not found then
    raise exception using errcode = '42501', message = 'WORKOUT_EXECUTION_WORKOUT_NOT_AVAILABLE';
  end if;

  if p_treino_dia_id is not null and not exists (select 1 from public.treino_dias where id = p_treino_dia_id and treino_id = p_treino_id) then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_DAY_INVALID';
  end if;

  if v_key is not null then
    select id into v_session_id
    from public.workout_execution_sessions
    where aluno_id = v_aluno.id and idempotency_key = v_key
    limit 1;
    if v_session_id is not null then
      return public.workout_execution_session_payload(v_session_id);
    end if;
  end if;

  select id into v_session_id
  from public.workout_execution_sessions
  where aluno_id = v_aluno.id
    and treino_id = p_treino_id
    and coalesce(treino_dia_id, '00000000-0000-0000-0000-000000000000'::uuid) = coalesce(p_treino_dia_id, '00000000-0000-0000-0000-000000000000'::uuid)
    and status = 'in_progress'
  limit 1;
  if v_session_id is not null then
    return public.workout_execution_session_payload(v_session_id);
  end if;

  if p_session_date is null then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_SESSION_DATE_REQUIRED';
  end if;

  if p_session_date < current_date - 31 or p_session_date > current_date + 1 then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_SESSION_DATE_OUT_OF_RANGE';
  end if;

  insert into public.workout_execution_sessions (aluno_id, treino_id, treino_dia_id, idempotency_key, session_date)
  values (v_aluno.id, p_treino_id, p_treino_dia_id, v_key, p_session_date)
  returning id into v_session_id;

  insert into public.workout_execution_exercises (
    session_id, treino_exercicio_id, treino_dia_id, exercise_name_snapshot,
    prescribed_series_snapshot, prescribed_reps_snapshot, prescribed_load_snapshot,
    prescribed_rest_snapshot, prescribed_notes_snapshot, day_name_snapshot, group_snapshot,
    exercise_order_snapshot, day_order_snapshot, workout_title_snapshot
  )
  select
    v_session_id, e.id, d.id, e.nome,
    coalesce(e.series, ''), coalesce(e.repeticoes, ''), coalesce(e.carga, ''),
    coalesce(e.descanso, ''), coalesce(e.observacoes, ''), coalesce(d.nome, ''),
    coalesce(d.grupo_muscular, ''), coalesce(e.ordem, 0), coalesce(d.ordem, 0),
    coalesce(v_treino.nome_rotina, '')
  from public.treino_dias d
  join public.treino_exercicios e on e.treino_dia_id = d.id
  where d.treino_id = p_treino_id
    and (p_treino_dia_id is null or d.id = p_treino_dia_id)
  order by d.ordem, e.ordem;

  if not exists (select 1 from public.workout_execution_exercises where session_id = v_session_id) then
    raise exception using errcode = '22023', message = 'WORKOUT_EXECUTION_EXERCISES_REQUIRED';
  end if;

  return public.workout_execution_session_payload(v_session_id);
end;
$$;

revoke all on function public.start_workout_execution_session(uuid, uuid, text, date) from public;
revoke all on function public.start_workout_execution_session(uuid, uuid, text, date) from anon;
grant execute on function public.start_workout_execution_session(uuid, uuid, text, date) to authenticated;
