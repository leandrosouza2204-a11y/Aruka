-- Cycle 12.9: bounded, factual student evolution reads.
-- Recent workout details continue to use get_my_valid_workout_execution_history;
-- frequency is aggregated independently so a paginated list cannot undercount it.
create or replace function public.get_my_student_workout_frequency_v2()
returns jsonb
language plpgsql
security definer
set search_path = ''
stable
as $$
declare
  v_user_id uuid := auth.uid();
  v_aluno_id uuid;
  v_today date := (now() at time zone 'America/Sao_Paulo')::date;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;
  select a.id into v_aluno_id from public.alunos a
  where a.student_user_id = v_user_id and a.student_access_status = 'active';
  if v_aluno_id is null then
    raise exception using errcode = '42501', message = 'STUDENT_EVOLUTION_ACCESS_REQUIRED';
  end if;
  return jsonb_build_object(
    'calendar', jsonb_build_object('today', v_today, 'timeZone', 'America/Sao_Paulo'),
    'frequency', (
      select jsonb_build_array(
        jsonb_build_object(
          'key', 'last7Days', 'startDate', v_today - 6, 'endDate', v_today,
          'completedCount', count(*) filter (where s.session_date between v_today - 6 and v_today)
        ),
        jsonb_build_object(
          'key', 'last28Days', 'startDate', v_today - 27, 'endDate', v_today,
          'completedCount', count(*)
        )
      )
      from public.workout_execution_sessions s
      where s.aluno_id = v_aluno_id
        and s.status = 'completed'
        and s.session_date between v_today - 27 and v_today
    )
  );
end;
$$;

create or replace function public.get_my_student_assessments_v2()
returns jsonb
language plpgsql
security definer
set search_path = ''
stable
as $$
declare
  v_user_id uuid := auth.uid();
  v_aluno_id uuid;
  v_professional_id uuid;
  v_assessment_limit constant integer := 24;
begin
  if v_user_id is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;
  select a.id, a.user_id into v_aluno_id, v_professional_id from public.alunos a
  where a.student_user_id = v_user_id and a.student_access_status = 'active';
  if v_aluno_id is null then
    raise exception using errcode = '42501', message = 'STUDENT_EVOLUTION_ACCESS_REQUIRED';
  end if;
  return jsonb_build_object(
    'limit', v_assessment_limit,
    'totalCount', (
      select count(*)::integer from public.avaliacoes a
      where a.aluno_id = v_aluno_id and a.user_id = v_professional_id
    ),
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'date', a.data_avaliacao,
        'measurements', jsonb_strip_nulls(jsonb_build_object(
          'weightKg', a.peso, 'waistCm', a.cintura, 'abdomenCm', a.abdomen, 'hipCm', a.quadril,
          'rightArmCm', a.braco_direito, 'leftArmCm', a.braco_esquerdo,
          'rightThighCm', a.coxa_direita, 'leftThighCm', a.coxa_esquerda,
          'rightCalfCm', a.panturrilha_direita, 'leftCalfCm', a.panturrilha_esquerda
        ))
      ) order by a.data_avaliacao desc, a.id desc)
      from (
        select av.id, av.data_avaliacao, av.peso, av.cintura, av.abdomen, av.quadril,
          av.braco_direito, av.braco_esquerdo, av.coxa_direita, av.coxa_esquerda,
          av.panturrilha_direita, av.panturrilha_esquerda
        from public.avaliacoes av
        where av.aluno_id = v_aluno_id and av.user_id = v_professional_id
        order by av.data_avaliacao desc, av.id desc
        limit v_assessment_limit
      ) a
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_my_student_workout_frequency_v2() from public, anon;
revoke all on function public.get_my_student_assessments_v2() from public, anon;
grant execute on function public.get_my_student_workout_frequency_v2() to authenticated;
grant execute on function public.get_my_student_assessments_v2() to authenticated;
