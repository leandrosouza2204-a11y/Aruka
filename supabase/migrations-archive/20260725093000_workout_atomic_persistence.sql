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
      data_inicio,
      data_revisao
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
      nullif(p_treino->>'dataInicio', '')::date,
      nullif(p_treino->>'dataRevisao', '')::date
    )
    returning id into v_treino_id;
  else
    update public.treinos
    set aluno_id = v_aluno_id,
        nome_rotina = v_rotina,
        objetivo = coalesce(p_treino->>'objetivo', ''),
        nivel = coalesce(p_treino->>'nivel', ''),
        dias_semana = coalesce(nullif(p_treino->>'diasPorSemana', '')::integer, jsonb_array_length(v_days)),
        observacoes = coalesce(p_treino->>'observacoes', ''),
        status = v_status,
        data_inicio = nullif(p_treino->>'dataInicio', '')::date,
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
        nome,
        series,
        repeticoes,
        carga,
        descanso,
        observacoes,
        video_url,
        ordem
      )
      values (
        v_day_id,
        btrim(coalesce(v_exercise->>'nome', '')),
        coalesce(v_exercise->>'series', ''),
        coalesce(v_exercise->>'repeticoes', ''),
        coalesce(v_exercise->>'carga', ''),
        coalesce(v_exercise->>'descanso', ''),
        coalesce(v_exercise->>'observacoes', ''),
        coalesce(v_exercise->>'video', ''),
        v_exercise_index
      );
    end loop;
  end loop;

  return jsonb_build_object('id', v_treino_id);
end;
$$;

revoke all on function public.salvar_treino_composto(jsonb) from public;
grant execute on function public.salvar_treino_composto(jsonb) to authenticated;
