create index if not exists treinos_aluno_active_delivery_idx
  on public.treinos (aluno_id, delivered_at desc, created_at desc)
  where lifecycle_status = 'active';

create or replace function public.get_my_student_home_v2()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_aluno public.alunos%rowtype;
  v_today date := (now() at time zone 'America/Sao_Paulo')::date;
  v_week_start date;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select a.* into v_aluno
  from public.alunos a
  where a.student_user_id = v_user_id;

  if not found then
    return jsonb_build_object(
      'student', null,
      'studentAccess', jsonb_build_object('status', 'unlinked'),
      'activeSession', null,
      'todayWorkout', null,
      'currentProgram', null,
      'weeklyProgress', jsonb_build_object('completedCount', 0, 'targetCount', null),
      'review', null,
      'evolutionSummary', jsonb_build_object('completedCount', 0, 'lastCompletedAt', null),
      'calendar', jsonb_build_object('today', v_today, 'weekStartsOn', 'monday', 'timeZone', 'America/Sao_Paulo')
    );
  end if;

  if v_aluno.student_access_status <> 'active' then
    return jsonb_build_object(
      'student', jsonb_build_object('id', v_aluno.id, 'name', v_aluno.nome, 'status', v_aluno.status),
      'studentAccess', jsonb_build_object('status', v_aluno.student_access_status),
      'activeSession', null,
      'todayWorkout', null,
      'currentProgram', null,
      'weeklyProgress', jsonb_build_object('completedCount', 0, 'targetCount', null),
      'review', null,
      'evolutionSummary', jsonb_build_object('completedCount', 0, 'lastCompletedAt', null),
      'calendar', jsonb_build_object('today', v_today, 'weekStartsOn', 'monday', 'timeZone', 'America/Sao_Paulo')
    );
  end if;

  v_week_start := v_today - (extract(isodow from v_today)::integer - 1);

  return (
    with current_program as (
      select
        t.id,
        t.nome_rotina,
        coalesce(nullif(to_jsonb(t)->>'display_name', ''), t.nome_rotina) as display_name,
        t.objetivo,
        t.nivel,
        nullif(t.dias_semana, 0) as weekly_target,
        t.data_inicio,
        t.data_revisao
      from public.treinos t
      where t.aluno_id = v_aluno.id
        and t.lifecycle_status = 'active'
      order by t.delivered_at desc nulls last, t.created_at desc, t.id
      limit 1
    ),
    active_session as (
      select s.*
      from public.workout_execution_sessions s
      where s.aluno_id = v_aluno.id
        and s.status = 'in_progress'
      order by s.started_at desc, s.id
      limit 1
    ),
    latest_completed_day as (
      select d.ordem as day_order
      from public.valid_workout_execution_sessions s
      join current_program p on p.id = s.treino_id
      join public.treino_dias d on d.id = s.treino_dia_id
      where s.aluno_id = v_aluno.id
      order by s.completed_at desc, s.id
      limit 1
    ),
    today_day as (
      select d.*
      from public.treino_dias d
      join current_program p on p.id = d.treino_id
      left join latest_completed_day lcd on true
      order by
        case when lcd.day_order is null or d.ordem > lcd.day_order then 0 else 1 end,
        d.ordem,
        d.created_at,
        d.id
      limit 1
    ),
    weekly as (
      select count(*)::integer as completed_count
      from public.valid_workout_execution_sessions s
      where s.aluno_id = v_aluno.id
        and s.completed_at >= (v_week_start::timestamp at time zone 'America/Sao_Paulo')
        and s.completed_at < ((v_week_start + 7)::timestamp at time zone 'America/Sao_Paulo')
    ),
    evolution as (
      select count(*)::integer as completed_count, max(s.completed_at) as last_completed_at
      from public.valid_workout_execution_sessions s
      where s.aluno_id = v_aluno.id
        and s.completed_at >= ((v_today - 27)::timestamp at time zone 'America/Sao_Paulo')
        and s.completed_at < ((v_today + 1)::timestamp at time zone 'America/Sao_Paulo')
    )
    select jsonb_build_object(
      'student', jsonb_build_object('id', v_aluno.id, 'name', v_aluno.nome, 'status', v_aluno.status),
      'studentAccess', jsonb_build_object('status', v_aluno.student_access_status),
      'activeSession', (
        select jsonb_build_object(
          'id', s.id,
          'treinoId', s.treino_id,
          'treinoDiaId', s.treino_dia_id,
          'status', s.status,
          'startedAt', s.started_at,
          'lastActivityAt', s.last_activity_at,
          'workoutTitle', coalesce((
            select nullif(e.workout_title_snapshot, '')
            from public.workout_execution_exercises e
            where e.session_id = s.id
            order by e.day_order_snapshot, e.exercise_order_snapshot, e.id
            limit 1
          ), 'Treino'),
          'dayName', coalesce((
            select nullif(e.day_name_snapshot, '')
            from public.workout_execution_exercises e
            where e.session_id = s.id
            order by e.day_order_snapshot, e.exercise_order_snapshot, e.id
            limit 1
          ), 'Treino atual'),
          'muscleGroups', (
            select nullif(e.group_snapshot, '')
            from public.workout_execution_exercises e
            where e.session_id = s.id
            order by e.day_order_snapshot, e.exercise_order_snapshot, e.id
            limit 1
          ),
          'exerciseCount', (
            select count(*)::integer
            from public.workout_execution_exercises e
            where e.session_id = s.id
          ),
          'completedSetCount', (
            select count(*)::integer
            from public.workout_execution_sets sets
            join public.workout_execution_exercises e on e.id = sets.execution_exercise_id
            where e.session_id = s.id and sets.completed
          ),
          'totalSetCount', (
            select case
              when count(*) > 0 and bool_and(btrim(e.prescribed_series_snapshot) ~ '^[0-9]+$')
                then sum(btrim(e.prescribed_series_snapshot)::integer)::integer
              else null
            end
            from public.workout_execution_exercises e
            where e.session_id = s.id
          )
        )
        from active_session s
      ),
      'todayWorkout', (
        select jsonb_build_object(
          'treinoId', p.id,
          'treinoDiaId', d.id,
          'programDisplayName', p.display_name,
          'name', d.nome,
          'muscleGroups', nullif(d.grupo_muscular, ''),
          'exerciseCount', count(e.id)::integer,
          'setCount', case
            when count(e.id) > 0 and bool_and(btrim(e.series) ~ '^[0-9]+$')
              then sum(btrim(e.series)::integer)::integer
            else null
          end
        )
        from current_program p
        join today_day d on d.treino_id = p.id
        left join public.treino_exercicios e on e.treino_dia_id = d.id
        group by p.id, p.display_name, d.id, d.nome, d.grupo_muscular
      ),
      'currentProgram', (
        select jsonb_build_object(
          'id', p.id,
          'displayName', p.display_name,
          'internalName', p.nome_rotina,
          'objective', nullif(p.objetivo, ''),
          'level', nullif(p.nivel, ''),
          'weeklyTarget', p.weekly_target,
          'startedOn', p.data_inicio
        )
        from current_program p
      ),
      'weeklyProgress', jsonb_build_object(
        'completedCount', coalesce((select w.completed_count from weekly w), 0),
        'targetCount', (select p.weekly_target from current_program p)
      ),
      'review', (
        select case when p.data_revisao is null then null else jsonb_build_object('date', p.data_revisao) end
        from current_program p
      ),
      'evolutionSummary', jsonb_build_object(
        'completedCount', coalesce((select e.completed_count from evolution e), 0),
        'lastCompletedAt', (select e.last_completed_at from evolution e),
        'windowDays', 28
      ),
      'calendar', jsonb_build_object(
        'today', v_today,
        'weekStart', v_week_start,
        'weekStartsOn', 'monday',
        'timeZone', 'America/Sao_Paulo'
      )
    )
  );
end;
$$;

revoke all on function public.get_my_student_home_v2() from public, anon;
grant execute on function public.get_my_student_home_v2() to authenticated;
