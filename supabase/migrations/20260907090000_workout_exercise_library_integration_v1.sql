set check_function_bodies = off;

alter table public.treino_exercicios
  add column if not exists exercise_media_snapshot jsonb default '{}'::jsonb not null;

alter table only public.treino_exercicios
  drop constraint if exists treino_exercicios_media_snapshot_object;

alter table only public.treino_exercicios
  add constraint treino_exercicios_media_snapshot_object
  check (jsonb_typeof(exercise_media_snapshot) = 'object');

create or replace function public.salvar_treino_composto(p_treino jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_treino_id uuid := nullif(p_treino->>'id', '')::uuid;
  v_aluno_id uuid := nullif(p_treino->>'alunoId', '')::uuid;
  v_rotina text := btrim(coalesce(p_treino->>'rotina', ''));
  v_status text := coalesce(nullif(btrim(p_treino->>'status'), ''), 'Ativo');
  v_lifecycle_status text := nullif(btrim(coalesce(p_treino->>'lifecycleStatus', p_treino->>'lifecycle_status')), '');
  v_template_origin_id text := nullif(btrim(coalesce(p_treino->>'templateOriginId', p_treino->>'template_origin_id')), '');
  v_template_origin_type text := nullif(btrim(coalesce(p_treino->>'templateOriginType', p_treino->>'template_origin_type')), '');
  v_template_origin_name text := nullif(btrim(coalesce(p_treino->>'templateOriginName', p_treino->>'template_origin_name')), '');
  v_template_origin_snapshot jsonb := coalesce(p_treino->'templateOriginSnapshot', p_treino->'template_origin_snapshot');
  v_application_idempotency_key text := nullif(btrim(coalesce(p_treino->>'applicationIdempotencyKey', p_treino->>'application_idempotency_key')), '');
  v_days jsonb := coalesce(p_treino->'dias', '[]'::jsonb);
  v_day jsonb;
  v_exercise jsonb;
  v_day_id uuid;
  v_day_index integer;
  v_exercise_index integer;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;

  if v_aluno_id is null then
    raise exception using errcode = '22023', message = 'WORKOUT_STUDENT_REQUIRED';
  end if;

  if v_rotina = '' then
    raise exception using errcode = '22023', message = 'WORKOUT_NAME_REQUIRED';
  end if;

  if v_status not in ('Ativo', 'Em revisao', 'Finalizado') then
    raise exception using errcode = '22023', message = 'WORKOUT_STATUS_INVALID';
  end if;

  if v_treino_id is null and v_lifecycle_status is null then
    v_lifecycle_status := 'draft';
  end if;

  if v_treino_id is null then
    v_lifecycle_status := 'draft';
  elsif v_lifecycle_status not in ('draft', 'active', 'completed', 'archived') then
    raise exception using errcode = '22023', message = 'WORKOUT_LIFECYCLE_STATUS_INVALID';
  end if;

  if v_template_origin_type is not null and v_template_origin_type not in ('official', 'personal') then
    raise exception using errcode = '22023', message = 'WORKOUT_TEMPLATE_ORIGIN_INVALID';
  end if;

  if v_template_origin_type is not null and v_template_origin_name is null then
    raise exception using errcode = '22023', message = 'WORKOUT_TEMPLATE_ORIGIN_NAME_REQUIRED';
  end if;

  if v_template_origin_snapshot is not null and jsonb_typeof(v_template_origin_snapshot) <> 'object' then
    raise exception using errcode = '22023', message = 'WORKOUT_TEMPLATE_ORIGIN_SNAPSHOT_INVALID';
  end if;

  if jsonb_typeof(v_days) <> 'array' or jsonb_array_length(v_days) = 0 then
    raise exception using errcode = '22023', message = 'WORKOUT_DAYS_REQUIRED';
  end if;

  if not exists (
    select 1
    from public.alunos
    where id = v_aluno_id
      and user_id = v_user_id
  ) then
    raise exception using errcode = '42501', message = 'WORKOUT_STUDENT_FORBIDDEN';
  end if;

  if v_treino_id is not null and not exists (
    select 1
    from public.treinos
    where id = v_treino_id
      and user_id = v_user_id
  ) then
    raise exception using errcode = '42501', message = 'WORKOUT_FORBIDDEN';
  end if;

  if v_template_origin_type = 'personal' and v_template_origin_id is not null and not exists (
    select 1
    from public.workout_templates
    where id::text = v_template_origin_id
      and owner_id = v_user_id
      and is_system = false
  ) then
    raise exception using errcode = '42501', message = 'WORKOUT_TEMPLATE_FORBIDDEN';
  end if;

  if v_treino_id is null and v_application_idempotency_key is not null then
    select id into v_treino_id
    from public.treinos
    where user_id = v_user_id
      and application_idempotency_key = v_application_idempotency_key
    limit 1;

    if v_treino_id is not null then
      return jsonb_build_object('id', v_treino_id, 'idempotent', true);
    end if;
  end if;

  for v_day, v_day_index in
    select value, ordinality::integer
    from jsonb_array_elements(v_days) with ordinality
  loop
    if btrim(coalesce(v_day->>'nome', '')) = '' then
      raise exception using errcode = '22023', message = 'WORKOUT_DAY_NAME_REQUIRED';
    end if;

    if jsonb_typeof(coalesce(v_day->'exercicios', '[]'::jsonb)) <> 'array'
      or jsonb_array_length(coalesce(v_day->'exercicios', '[]'::jsonb)) = 0 then
      raise exception using errcode = '22023', message = 'WORKOUT_EXERCISES_REQUIRED';
    end if;

    for v_exercise, v_exercise_index in
      select value, ordinality::integer
      from jsonb_array_elements(coalesce(v_day->'exercicios', '[]'::jsonb)) with ordinality
    loop
      if btrim(coalesce(v_exercise->>'nome', '')) = '' then
        raise exception using errcode = '22023', message = 'WORKOUT_EXERCISE_NAME_REQUIRED';
      end if;

      if nullif(btrim(coalesce(v_exercise->>'exerciseId', v_exercise->>'exercise_id')), '') is not null
        and not exists (
          select 1
          from public.exercise_library exercise
          where exercise.id = nullif(btrim(coalesce(v_exercise->>'exerciseId', v_exercise->>'exercise_id')), '')::uuid
            and (
              (exercise.origin = 'official' and exercise.status = 'active')
              or (exercise.origin = 'personal' and exercise.owner_id = v_user_id)
            )
        ) then
        raise exception using errcode = '42501', message = 'WORKOUT_EXERCISE_LIBRARY_FORBIDDEN';
      end if;

      if jsonb_typeof(coalesce(v_exercise->'exerciseMediaSnapshot', v_exercise->'exercise_media_snapshot', '{}'::jsonb)) <> 'object' then
        raise exception using errcode = '22023', message = 'WORKOUT_EXERCISE_MEDIA_SNAPSHOT_INVALID';
      end if;
    end loop;
  end loop;

  if v_treino_id is null then
    insert into public.treinos (
      user_id,
      aluno_id,
      nome_rotina,
      objetivo,
      nivel,
      dias_semana,
      observacoes,
      status,
      lifecycle_status,
      template_origin_id,
      template_origin_type,
      template_origin_name,
      template_origin_snapshot,
      applied_by,
      applied_at,
      data_inicio,
      data_fim,
      data_revisao,
      application_idempotency_key
    )
    values (
      v_user_id,
      v_aluno_id,
      v_rotina,
      coalesce(p_treino->>'objetivo', ''),
      coalesce(p_treino->>'nivel', ''),
      coalesce(nullif(p_treino->>'diasPorSemana', '')::integer, jsonb_array_length(v_days)),
      coalesce(p_treino->>'observacoes', ''),
      v_status,
      v_lifecycle_status,
      v_template_origin_id,
      v_template_origin_type,
      v_template_origin_name,
      v_template_origin_snapshot,
      case when v_template_origin_type is not null then v_user_id else null end,
      case when v_template_origin_type is not null then now() else null end,
      nullif(p_treino->>'dataInicio', '')::date,
      nullif(coalesce(p_treino->>'dataFim', p_treino->>'data_fim'), '')::date,
      nullif(p_treino->>'dataRevisao', '')::date,
      v_application_idempotency_key
    )
    returning id into v_treino_id;

    if v_template_origin_type is not null then
      insert into public.treino_eventos (
        treino_id, user_id, aluno_id, event_type, from_status, to_status, actor_id, metadata
      )
      values (
        v_treino_id,
        v_user_id,
        v_aluno_id,
        'applied',
        null,
        v_lifecycle_status,
        v_user_id,
        jsonb_build_object(
          'template_origin_id', v_template_origin_id,
          'template_origin_type', v_template_origin_type,
          'template_origin_name', v_template_origin_name,
          'application_idempotency_key', v_application_idempotency_key
        )
      );
    end if;
  else
    update public.treinos
    set aluno_id = v_aluno_id,
        nome_rotina = v_rotina,
        objetivo = coalesce(p_treino->>'objetivo', ''),
        nivel = coalesce(p_treino->>'nivel', ''),
        dias_semana = coalesce(nullif(p_treino->>'diasPorSemana', '')::integer, jsonb_array_length(v_days)),
        observacoes = coalesce(p_treino->>'observacoes', ''),
        status = v_status,
        lifecycle_status = coalesce(nullif(v_lifecycle_status, ''), lifecycle_status),
        data_inicio = nullif(p_treino->>'dataInicio', '')::date,
        data_fim = nullif(coalesce(p_treino->>'dataFim', p_treino->>'data_fim'), '')::date,
        data_revisao = nullif(p_treino->>'dataRevisao', '')::date
    where id = v_treino_id
      and user_id = v_user_id;
  end if;

  delete from public.treino_dias
  where treino_id = v_treino_id;

  for v_day, v_day_index in
    select value, ordinality::integer
    from jsonb_array_elements(v_days) with ordinality
  loop
    insert into public.treino_dias (treino_id, nome, grupo_muscular, ordem)
    values (
      v_treino_id,
      btrim(coalesce(v_day->>'nome', '')),
      coalesce(v_day->>'descricao', ''),
      v_day_index
    )
    returning id into v_day_id;

    for v_exercise, v_exercise_index in
      select value, ordinality::integer
      from jsonb_array_elements(coalesce(v_day->'exercicios', '[]'::jsonb)) with ordinality
    loop
      insert into public.treino_exercicios (
        treino_dia_id,
        exercise_id,
        nome,
        series,
        repeticoes,
        carga,
        descanso,
        observacoes,
        video_url,
        exercise_media_snapshot,
        ordem
      )
      values (
        v_day_id,
        nullif(btrim(coalesce(v_exercise->>'exerciseId', v_exercise->>'exercise_id')), '')::uuid,
        btrim(coalesce(v_exercise->>'nome', '')),
        coalesce(v_exercise->>'series', ''),
        coalesce(v_exercise->>'repeticoes', ''),
        coalesce(v_exercise->>'carga', ''),
        coalesce(v_exercise->>'descanso', ''),
        coalesce(v_exercise->>'observacoes', ''),
        coalesce(v_exercise->>'video', ''),
        coalesce(v_exercise->'exerciseMediaSnapshot', v_exercise->'exercise_media_snapshot', '{}'::jsonb),
        v_exercise_index
      );
    end loop;
  end loop;

  return jsonb_build_object('id', v_treino_id);
end;
$$;

revoke all on function public.salvar_treino_composto(jsonb) from public;
revoke all on function public.salvar_treino_composto(jsonb) from anon;
grant execute on function public.salvar_treino_composto(jsonb) to authenticated;
