create or replace function public.processar_encerramento_automatico_aluno(
  p_user_id uuid,
  p_aluno_id uuid,
  p_vencimento date,
  p_ocorrido_em date,
  p_event_key text,
  p_plano_id uuid default null,
  p_plano_nome text default '',
  p_dias_apos_vencimento integer default 0,
  p_status_anterior text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_aluno record;
  v_evento_id uuid;
begin
  if p_user_id is null
    or p_aluno_id is null
    or p_vencimento is null
    or p_ocorrido_em is null
    or nullif(trim(coalesce(p_event_key, '')), '') is null then
    return jsonb_build_object('ok', false, 'status', 'invalid_payload');
  end if;

  select
    id,
    user_id,
    vencimento,
    acompanhamento_status
  into v_aluno
  from public.alunos
  where id = p_aluno_id
    and user_id = p_user_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'status', 'aluno_nao_encontrado');
  end if;

  if v_aluno.vencimento is distinct from p_vencimento then
    return jsonb_build_object('ok', false, 'status', 'vencimento_alterado');
  end if;

  if coalesce(v_aluno.acompanhamento_status, 'ativo') in ('nao_renovado', 'cancelado', 'encerrado') then
    return jsonb_build_object('ok', false, 'status', 'ja_encerrado_manual_ou_processado');
  end if;

  update public.alunos
  set
    acompanhamento_status = 'encerrado',
    acompanhamento_encerrado_em = p_ocorrido_em,
    acompanhamento_motivo = 'vencimento_sem_renovacao',
    acompanhamento_motivo_detalhe = ''
  where id = p_aluno_id
    and user_id = p_user_id;

  begin
    insert into public.acompanhamento_eventos (
      user_id,
      aluno_id,
      tipo,
      ocorrido_em,
      motivo,
      motivo_detalhe,
      plano_id,
      plano_nome,
      vencimento_anterior,
      vencimento_novo,
      metadata,
      event_key
    )
    values (
      p_user_id,
      p_aluno_id,
      'acompanhamento_encerrado',
      p_ocorrido_em::timestamptz,
      'vencimento_sem_renovacao',
      null,
      p_plano_id,
      nullif(trim(coalesce(p_plano_nome, '')), ''),
      p_vencimento,
      null,
      jsonb_build_object(
        'origem', 'automatico_90_dias',
        'dias_apos_vencimento', greatest(coalesce(p_dias_apos_vencimento, 0), 0),
        'status_anterior', coalesce(nullif(trim(p_status_anterior), ''), 'ativo')
      ),
      p_event_key
    )
    returning id into v_evento_id;
  exception
    when unique_violation then
      return jsonb_build_object(
        'ok', true,
        'status', 'duplicado',
        'duplicate', true,
        'event_key', p_event_key
      );
  end;

  return jsonb_build_object(
    'ok', true,
    'status', 'processado',
    'duplicate', false,
    'evento_id', v_evento_id,
    'event_key', p_event_key
  );
end;
$$;

revoke execute on function public.processar_encerramento_automatico_aluno(
  uuid,
  uuid,
  date,
  date,
  text,
  uuid,
  text,
  integer,
  text
) from public, anon, authenticated;

grant execute on function public.processar_encerramento_automatico_aluno(
  uuid,
  uuid,
  date,
  date,
  text,
  uuid,
  text,
  integer,
  text
) to service_role;
