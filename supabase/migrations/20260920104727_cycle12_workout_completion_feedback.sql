-- Cycle 12.8: explicit workout completion with optional, immutable session feedback.
-- Feedback is intentionally a single bounded text value: the roadmap does not
-- define a rating scale, tags, analytics or professional-facing presentation.
create table public.workout_execution_session_feedback (
  session_id uuid primary key references public.workout_execution_sessions(id) on delete cascade,
  feedback_text text not null,
  submitted_at timestamptz not null default now(),
  constraint workout_execution_session_feedback_text_check check (
    char_length(btrim(feedback_text)) between 1 and 1000
  )
);

comment on table public.workout_execution_session_feedback is
  'Optional student feedback submitted atomically with a completed workout session.';

alter table public.workout_execution_session_feedback enable row level security;
revoke all on table public.workout_execution_session_feedback from public, anon, authenticated;

-- Supabase's legacy public-schema default ACL grants non-DML table privileges
-- to Data API roles. Keep the intentional SELECT grant, but remove capabilities
-- that are not required by any workout execution flow.
revoke truncate, references, trigger, maintain
  on table public.workout_execution_sessions
  from authenticated;

create or replace function public.complete_workout_execution_session_v2(
  p_session_id uuid,
  p_short_duration_confirmed boolean,
  p_feedback_text text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_started timestamptz;
  v_status text;
  v_count integer;
  v_feedback text := nullif(btrim(coalesce(p_feedback_text, '')), '');
  v_existing_feedback text;
begin
  if v_feedback is not null and char_length(v_feedback) > 1000 then
    raise exception using errcode = '22023', message = 'FEEDBACK_TOO_LONG';
  end if;

  select s.status, s.started_at
    into v_status, v_started
  from public.workout_execution_sessions s
  join public.alunos a on a.id = s.aluno_id
  where s.id = p_session_id
    and a.student_user_id = auth.uid()
    and a.student_access_status = 'active'
  for update of s;

  if not found then
    raise exception using errcode = '42501', message = 'SESSION_NOT_OWNED';
  end if;

  if v_status = 'completed' then
    select f.feedback_text
      into v_existing_feedback
    from public.workout_execution_session_feedback f
    where f.session_id = p_session_id;

    if v_feedback is distinct from v_existing_feedback then
      raise exception using errcode = '23505', message = 'FEEDBACK_CONFLICT';
    end if;

    return public.workout_execution_session_payload(p_session_id)
      || jsonb_build_object('feedback', v_existing_feedback);
  end if;

  if v_status <> 'in_progress' then
    raise exception using errcode = '55000', message = 'SESSION_NOT_IN_PROGRESS';
  end if;

  select count(*)
    into v_count
  from public.workout_execution_sets ws
  join public.workout_execution_exercises e on e.id = ws.execution_exercise_id
  where e.session_id = p_session_id
    and ws.completed;

  if v_count = 0 then
    raise exception using errcode = '22023', message = 'ZERO_COMPLETED_SETS';
  end if;

  if floor(extract(epoch from clock_timestamp() - v_started)) <= 300
    and not p_short_duration_confirmed then
    raise exception using errcode = '22023', message = 'SHORT_WORKOUT_CONFIRMATION_REQUIRED';
  end if;

  update public.workout_execution_sessions
  set status = 'completed',
      completed_at = now(),
      short_duration_confirmed = p_short_duration_confirmed,
      last_activity_at = now()
  where id = p_session_id;

  if v_feedback is not null then
    insert into public.workout_execution_session_feedback (session_id, feedback_text)
    values (p_session_id, v_feedback);
  end if;

  return public.workout_execution_session_payload(p_session_id)
    || jsonb_build_object('feedback', v_feedback);
end;
$$;

revoke all on function public.complete_workout_execution_session_v2(uuid, boolean, text)
  from public, anon;
grant execute on function public.complete_workout_execution_session_v2(uuid, boolean, text)
  to authenticated;

-- Keep the bounded Player read as the only student-facing feedback read surface.
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
      'shortDurationConfirmed', s.short_duration_confirmed,
      'feedback', (
        select f.feedback_text
        from public.workout_execution_session_feedback f
        where f.session_id = s.id
      ),
      'serverNow', statement_timestamp(),
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
