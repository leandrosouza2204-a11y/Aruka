-- Cycle 12.6: enrich the existing bounded Player payload with canonical set data.
-- No new write path is introduced; set completion remains owned by
-- complete_workout_execution_set.
create or replace function public.get_my_workout_player_v2(p_session_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
stable
as $$
declare
  v_user_id uuid := auth.uid();
  v_aluno_id uuid;
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

  return (
    select jsonb_build_object(
      'id', s.id,
      'treinoId', s.treino_id,
      'treinoDiaId', s.treino_dia_id,
      'status', s.status,
      'sessionDate', s.session_date,
      'startedAt', s.started_at,
      'completedAt', s.completed_at,
      'abandonedAt', s.abandoned_at,
      'cancelledAt', s.cancelled_at,
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
      'exercises', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', e.id,
          'treinoExercicioId', e.treino_exercicio_id,
          'name', e.exercise_name_snapshot,
          'dayName', e.day_name_snapshot,
          'group', e.group_snapshot,
          'exerciseOrder', e.exercise_order_snapshot,
          'dayOrder', e.day_order_snapshot,
          'prescribedSeries', nullif(e.prescribed_series_snapshot, ''),
          'prescribedReps', nullif(e.prescribed_reps_snapshot, ''),
          'prescribedLoad', nullif(e.prescribed_load_snapshot, ''),
          'prescribedRest', nullif(e.prescribed_rest_snapshot, ''),
          'prescribedNotes', nullif(e.prescribed_notes_snapshot, ''),
          'trackingConfig', e.tracking_config_snapshot,
          'status', e.status,
          'media', case
            when te.exercise_media_snapshot #>> '{media,type}' = 'youtube'
              then jsonb_build_object(
                'type', 'youtube',
                'videoId', te.exercise_media_snapshot #>> '{media,videoId}',
                'youtubeUrl', te.exercise_media_snapshot #>> '{media,youtubeUrl}'
              )
            when te.exercise_id is not null
              and te.exercise_media_snapshot #>> '{media,type}' = 'uploaded_video'
              and te.exercise_media_snapshot #>> '{media,mediaPath}' is not null
              then jsonb_build_object(
                'type', 'uploaded_video',
                'mimeType', te.exercise_media_snapshot #>> '{media,mimeType}'
              )
            else jsonb_build_object('type', '')
          end,
          'sets', coalesce((
            select jsonb_agg(jsonb_build_object(
              'id', ws.id,
              'setNumber', ws.set_number,
              'reps', ws.reps,
              'loadValue', ws.load_value,
              'loadUnit', ws.load_unit,
              'bodyweight', ws.bodyweight,
              'rir', ws.rir,
              'rpe', ws.rpe,
              'completed', ws.completed,
              'completedAt', case when ws.completed then ws.updated_at else null end
            ) order by ws.set_number, ws.id)
            from public.workout_execution_sets ws
            where ws.execution_exercise_id = e.id
          ), '[]'::jsonb)
        ) order by e.day_order_snapshot, e.exercise_order_snapshot, e.id)
        from public.workout_execution_exercises e
        left join public.treino_exercicios te on te.id = e.treino_exercicio_id
        where e.session_id = s.id
      ), '[]'::jsonb)
    )
    from public.workout_execution_sessions s
    where s.id = p_session_id
      and s.aluno_id = v_aluno_id
  );
end;
$$;

revoke all on function public.get_my_workout_player_v2(uuid) from public, anon;
grant execute on function public.get_my_workout_player_v2(uuid) to authenticated;
