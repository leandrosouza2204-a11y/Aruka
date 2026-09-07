set check_function_bodies = off;

create or replace function public.get_my_student_workouts()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_user_id uuid := auth.uid();
  v_aluno_id uuid;
begin
  if v_student_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select id
    into v_aluno_id
  from public.alunos
  where student_user_id = v_student_user_id
    and student_access_status = 'active';

  if v_aluno_id is null then
    return jsonb_build_object(
      'student', null,
      'studentAccess', jsonb_build_object('status', 'unlinked'),
      'activeWorkouts', '[]'::jsonb,
      'completedWorkouts', '[]'::jsonb
    );
  end if;

  return (
    with allowed_workouts as (
      select
        t.id,
        t.nome_rotina,
        t.objetivo,
        t.nivel,
        t.dias_semana,
        t.observacoes,
        t.lifecycle_status,
        t.delivered_at,
        t.completed_at,
        t.created_at,
        t.data_revisao
      from public.treinos t
      where t.aluno_id = v_aluno_id
        and t.lifecycle_status in ('active', 'completed')
    ),
    workout_payloads as (
      select
        w.id,
        w.lifecycle_status,
        w.delivered_at,
        w.completed_at,
        w.created_at,
        jsonb_build_object(
          'id', w.id,
          'name', w.nome_rotina,
          'objective', w.objetivo,
          'level', w.nivel,
          'daysPerWeek', w.dias_semana,
          'notes', w.observacoes,
          'lifecycleStatus', w.lifecycle_status,
          'deliveredAt', w.delivered_at,
          'completedAt', w.completed_at,
          'dataRevisao', w.data_revisao,
          'days', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', d.id,
                'name', d.nome,
                'notes', d.grupo_muscular,
                'order', d.ordem,
                'exercises', coalesce((
                  select jsonb_agg(
                    jsonb_build_object(
                      'id', e.id,
                      'treinoExercicioId', e.id,
                      'name', coalesce(nullif(e.exercise_media_snapshot->>'name', ''), e.nome),
                      'order', e.ordem,
                      'series', e.series,
                      'repetitions', e.repeticoes,
                      'rest', e.descanso,
                      'prescribedLoad', e.carga,
                      'notes', e.observacoes,
                      'videoUrl', case
                        when e.exercise_media_snapshot #>> '{media,type}' = 'youtube'
                          then coalesce(nullif(e.exercise_media_snapshot #>> '{media,youtubeUrl}', ''), e.video_url)
                        else e.video_url
                      end,
                      'exerciseId', e.exercise_id,
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
                    )
                    order by e.ordem, e.created_at, e.id
                  )
                  from public.treino_exercicios e
                  where e.treino_dia_id = d.id
                ), '[]'::jsonb)
              )
              order by d.ordem, d.created_at, d.id
            )
            from public.treino_dias d
            where d.treino_id = w.id
          ), '[]'::jsonb)
        ) as payload
      from allowed_workouts w
    )
    select jsonb_build_object(
      'student', (
        select jsonb_build_object(
          'id', a.id,
          'name', a.nome,
          'status', a.status
        )
        from public.alunos a
        where a.id = v_aluno_id
      ),
      'studentAccess', jsonb_build_object('status', 'active'),
      'activeWorkouts', coalesce((
        select jsonb_agg(payload order by delivered_at desc nulls last, created_at desc)
        from workout_payloads
        where lifecycle_status = 'active'
      ), '[]'::jsonb),
      'completedWorkouts', coalesce((
        select jsonb_agg(payload order by completed_at desc nulls last, delivered_at desc nulls last, created_at desc)
        from workout_payloads
        where lifecycle_status = 'completed'
      ), '[]'::jsonb)
    )
  );
end;
$$;

create or replace function public.get_my_student_exercise_media(p_treino_exercicio_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  v_student_user_id uuid := auth.uid();
  v_media jsonb;
begin
  if v_student_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  select case
    when te.exercise_id is not null
      and te.exercise_media_snapshot #>> '{media,type}' = 'uploaded_video'
      and te.exercise_media_snapshot #>> '{media,mediaPath}' is not null
      then jsonb_build_object(
        'type', 'uploaded_video',
        'bucket', 'exercise-media',
        'mediaPath', te.exercise_media_snapshot #>> '{media,mediaPath}',
        'mimeType', te.exercise_media_snapshot #>> '{media,mimeType}',
        'ttlSeconds', 600
      )
    when te.exercise_media_snapshot #>> '{media,type}' = 'youtube'
      then jsonb_build_object(
        'type', 'youtube',
        'videoId', te.exercise_media_snapshot #>> '{media,videoId}',
        'youtubeUrl', te.exercise_media_snapshot #>> '{media,youtubeUrl}'
      )
    else jsonb_build_object('type', '')
  end
    into v_media
  from public.treino_exercicios te
  join public.treino_dias td on td.id = te.treino_dia_id
  join public.treinos t on t.id = td.treino_id
  join public.alunos a on a.id = t.aluno_id
  where te.id = p_treino_exercicio_id
    and t.lifecycle_status in ('active', 'completed')
    and a.student_user_id = v_student_user_id
    and a.student_access_status = 'active';

  if v_media is null then
    raise exception using errcode = '42501', message = 'STUDENT_EXERCISE_MEDIA_FORBIDDEN';
  end if;

  return v_media;
end;
$$;

revoke all on function public.get_my_student_workouts() from public;
revoke all on function public.get_my_student_workouts() from anon;
grant execute on function public.get_my_student_workouts() to authenticated;

revoke all on function public.get_my_student_exercise_media(uuid) from public;
revoke all on function public.get_my_student_exercise_media(uuid) from anon;
grant execute on function public.get_my_student_exercise_media(uuid) to authenticated;
