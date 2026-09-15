create or replace function public.get_my_student_training_library_v2()
returns jsonb
language plpgsql
security definer
set search_path = ''
stable
as $$
declare
  v_user_id uuid := auth.uid();
  v_aluno public.alunos%rowtype;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select a.* into v_aluno
  from public.alunos a
  where a.student_user_id = v_user_id;

  if not found then
    return jsonb_build_object(
      'studentAccess', jsonb_build_object('status', 'unlinked'),
      'currentProgram', null,
      'workouts', '[]'::jsonb,
      'activeSession', null
    );
  end if;

  if v_aluno.student_access_status <> 'active' then
    return jsonb_build_object(
      'studentAccess', jsonb_build_object('status', v_aluno.student_access_status),
      'currentProgram', null,
      'workouts', '[]'::jsonb,
      'activeSession', null
    );
  end if;

  return (
    with current_program as (
      select
        t.id,
        t.nome_rotina,
        coalesce(nullif(to_jsonb(t)->>'display_name', ''), t.nome_rotina) as display_name,
        nullif(t.objetivo, '') as objective,
        nullif(t.nivel, '') as level,
        nullif(t.dias_semana, 0) as weekly_target
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
    workout_summaries as (
      select
        d.id,
        d.nome,
        nullif(d.grupo_muscular, '') as muscle_groups,
        d.ordem,
        d.created_at,
        (select count(*)::integer from public.treino_exercicios e where e.treino_dia_id = d.id) as exercise_count,
        (
          select case
            when count(*) > 0 and bool_and(btrim(e.series) ~ '^[0-9]+$')
              then sum(case when btrim(e.series) ~ '^[0-9]+$' then btrim(e.series)::integer else 0 end)::integer
            else null
          end
          from public.treino_exercicios e
          where e.treino_dia_id = d.id
        ) as set_count,
        (
          select max(vs.completed_at)
          from public.valid_workout_execution_sessions vs
          where vs.aluno_id = v_aluno.id
            and vs.treino_id = p.id
            and vs.treino_dia_id = d.id
        ) as last_completed_at
      from current_program p
      join public.treino_dias d on d.treino_id = p.id
    )
    select jsonb_build_object(
      'studentAccess', jsonb_build_object('status', 'active'),
      'currentProgram', (
        select jsonb_build_object(
          'id', p.id,
          'displayName', p.display_name,
          'objective', p.objective,
          'level', p.level,
          'weeklyTarget', p.weekly_target,
          'workoutCount', (select count(*)::integer from workout_summaries)
        )
        from current_program p
      ),
      'workouts', coalesce((
        select jsonb_agg(
          jsonb_build_object(
            'id', w.id,
            'name', w.nome,
            'order', w.ordem,
            'muscleGroups', w.muscle_groups,
            'exerciseCount', w.exercise_count,
            'setCount', w.set_count,
            'lastCompletedAt', w.last_completed_at
          )
          order by w.ordem, w.created_at, w.id
        )
        from workout_summaries w
      ), '[]'::jsonb),
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
          ), 'Treino atual')
        )
        from active_session s
      )
    )
  );
end;
$$;

create or replace function public.get_my_student_workout_detail_v2(p_treino_dia_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
stable
as $$
declare
  v_user_id uuid := auth.uid();
  v_aluno_id uuid;
  v_program_id uuid;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select a.id into v_aluno_id
  from public.alunos a
  where a.student_user_id = v_user_id
    and a.student_access_status = 'active';

  if v_aluno_id is null then
    return null;
  end if;

  select t.id into v_program_id
  from public.treinos t
  where t.aluno_id = v_aluno_id
    and t.lifecycle_status = 'active'
  order by t.delivered_at desc nulls last, t.created_at desc, t.id
  limit 1;

  if v_program_id is null then
    return null;
  end if;

  return (
    select jsonb_build_object(
      'id', d.id,
      'treinoId', d.treino_id,
      'name', d.nome,
      'order', d.ordem,
      'muscleGroups', nullif(d.grupo_muscular, ''),
      'exerciseCount', count(e.id)::integer,
      'setCount', case
        when count(e.id) > 0 and bool_and(btrim(e.series) ~ '^[0-9]+$')
          then sum(case when btrim(e.series) ~ '^[0-9]+$' then btrim(e.series)::integer else 0 end)::integer
        else null
      end,
      'exercises', coalesce(jsonb_agg(
        jsonb_build_object(
          'id', e.id,
          'exerciseId', e.exercise_id,
          'name', coalesce(nullif(e.exercise_media_snapshot->>'name', ''), e.nome),
          'order', e.ordem,
          'series', nullif(e.series, ''),
          'repetitions', nullif(e.repeticoes, ''),
          'prescribedLoad', nullif(e.carga, ''),
          'rest', nullif(e.descanso, ''),
          'notes', nullif(e.observacoes, ''),
          'trackingConfig', e.tracking_config,
          'videoUrl', case
            when e.exercise_media_snapshot #>> '{media,type}' = 'youtube'
              then coalesce(nullif(e.exercise_media_snapshot #>> '{media,youtubeUrl}', ''), nullif(e.video_url, ''))
            else nullif(e.video_url, '')
          end,
          'media', case
            when e.exercise_media_snapshot #>> '{media,type}' = 'youtube'
              then jsonb_build_object(
                'type', 'youtube',
                'videoId', e.exercise_media_snapshot #>> '{media,videoId}',
                'youtubeUrl', e.exercise_media_snapshot #>> '{media,youtubeUrl}'
              )
            when e.exercise_id is not null
              and e.exercise_media_snapshot #>> '{media,type}' = 'uploaded_video'
              and e.exercise_media_snapshot #>> '{media,mediaPath}' is not null
              then jsonb_build_object(
                'type', 'uploaded_video',
                'mimeType', e.exercise_media_snapshot #>> '{media,mimeType}'
              )
            else jsonb_build_object('type', '')
          end
        ) order by e.ordem, e.created_at, e.id
      ) filter (where e.id is not null), '[]'::jsonb)
    )
    from public.treino_dias d
    left join public.treino_exercicios e on e.treino_dia_id = d.id
    where d.id = p_treino_dia_id
      and d.treino_id = v_program_id
    group by d.id, d.treino_id, d.nome, d.ordem, d.grupo_muscular
  );
end;
$$;

revoke all on function public.get_my_student_training_library_v2() from public, anon;
grant execute on function public.get_my_student_training_library_v2() to authenticated;

revoke all on function public.get_my_student_workout_detail_v2(uuid) from public, anon;
grant execute on function public.get_my_student_workout_detail_v2(uuid) to authenticated;
