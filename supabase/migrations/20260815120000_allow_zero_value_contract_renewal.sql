create or replace function public.renovar_aluno_contrato(
  p_aluno_id uuid,
  p_novo_plano_id uuid,
  p_novo_inicio date,
  p_novo_vencimento date,
  p_novo_valor numeric,
  p_registrar_pagamento boolean default true,
  p_forma_pagamento text default 'Pix',
  p_observacao text default '',
  p_event_key text default null
)
returns jsonb
language plpgsql
security definer
set search_path to public
as $$
declare
  v_user_id uuid := auth.uid();
  v_aluno public.alunos%rowtype;
  v_plano public.planos%rowtype;
  v_contrato_anterior public.aluno_contratos%rowtype;
  v_novo_contrato_id uuid;
  v_pagamento_id uuid;
  v_event_key text;
begin
  if v_user_id is null then
    raise exception 'AUTH_REQUIRED';
  end if;

  select * into v_aluno
  from public.alunos
  where id = p_aluno_id
    and user_id = v_user_id
  for update;

  if not found then
    raise exception 'ALUNO_NOT_FOUND';
  end if;

  select * into v_plano
  from public.planos
  where id = p_novo_plano_id
    and user_id = v_user_id;

  if not found then
    raise exception 'PLANO_NOT_FOUND';
  end if;

  if p_novo_inicio is null or p_novo_inicio > current_date + interval '10 years' then
    raise exception 'INVALID_CONTRACT_START';
  end if;

  if p_novo_vencimento is null or p_novo_vencimento < p_novo_inicio then
    raise exception 'INVALID_CONTRACT_END';
  end if;

  if p_novo_valor < 0 then
    raise exception 'INVALID_CONTRACT_VALUE';
  end if;

  if coalesce(p_registrar_pagamento, false) and p_novo_valor <= 0 then
    raise exception 'INVALID_PAYMENT_VALUE';
  end if;

  if v_aluno.consultoria_inicio is null then
    update public.alunos
    set
      consultoria_inicio = least(coalesce(v_aluno.inicio, p_novo_inicio), p_novo_inicio),
      consultoria_inicio_confianca = case when v_aluno.inicio is not null then 'DERIVED_LOW_CONFIDENCE' else 'UNKNOWN' end
    where id = v_aluno.id;
  end if;

  select * into v_contrato_anterior
  from public.aluno_contratos
  where aluno_id = v_aluno.id
    and status = 'ativo'
  order by inicio desc, created_at desc
  limit 1
  for update;

  if found then
    update public.aluno_contratos
    set
      status = 'renovado',
      metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('renovado_em', now())
    where id = v_contrato_anterior.id;
  end if;

  insert into public.aluno_contratos (
    user_id, aluno_id, plano_id, plano_nome_snapshot, inicio, vencimento, valor, status, origem, renovado_de_id, metadata
  )
  values (
    v_user_id,
    v_aluno.id,
    v_plano.id,
    v_plano.nome,
    p_novo_inicio,
    p_novo_vencimento,
    p_novo_valor,
    'ativo',
    case
      when coalesce(v_aluno.acompanhamento_status, 'ativo') in ('encerrado', 'nao_renovado', 'cancelado') then 'reactivation_after_closure'
      else 'renewal_continuous_relationship'
    end,
    v_contrato_anterior.id,
    jsonb_build_object(
      'previous_plan_id', v_aluno.plano,
      'previous_plan_name', coalesce(v_contrato_anterior.plano_nome_snapshot, v_aluno.plano, ''),
      'previous_contract_start', v_aluno.inicio,
      'previous_contract_end', v_aluno.vencimento,
      'previous_value', v_aluno.valor,
      'new_plan_id', v_plano.id,
      'new_plan_name', v_plano.nome,
      'new_contract_start', p_novo_inicio,
      'new_contract_end', p_novo_vencimento,
      'new_value', p_novo_valor
    )
  )
  returning id into v_novo_contrato_id;

  update public.alunos
  set
    plano = v_plano.id::text,
    valor = p_novo_valor,
    inicio = p_novo_inicio,
    vencimento = p_novo_vencimento,
    aviso7 = p_novo_vencimento - 7,
    aviso1 = p_novo_vencimento - 1,
    pagamento_recebido = coalesce(p_registrar_pagamento, false),
    data_pagamento = case when coalesce(p_registrar_pagamento, false) then current_date else null end,
    status = 'Ativo',
    acompanhamento_status = 'ativo',
    acompanhamento_encerrado_em = null,
    acompanhamento_motivo = null,
    acompanhamento_motivo_detalhe = ''
  where id = v_aluno.id;

  if coalesce(p_registrar_pagamento, false) then
    insert into public.pagamentos (
      user_id, aluno_id, plano, data_pagamento, valor, forma_pagamento, parcela, total_parcelas,
      tipo_movimento, vencimento_parcela, vencimento_anterior, vencimento_novo, observacao, observacoes
    )
    values (
      v_user_id,
      v_aluno.id,
      v_plano.nome,
      current_date,
      p_novo_valor,
      coalesce(nullif(trim(p_forma_pagamento), ''), 'Pix'),
      '1',
      1,
      'renovacao_plano',
      null,
      v_aluno.vencimento,
      p_novo_vencimento,
      coalesce(p_observacao, ''),
      coalesce(p_observacao, '')
    )
    returning id into v_pagamento_id;
  end if;

  v_event_key := coalesce(nullif(trim(p_event_key), ''), 'renovacao:' || v_aluno.id::text || ':' || v_novo_contrato_id::text);

  insert into public.acompanhamento_eventos (
    user_id, aluno_id, tipo, plano_id, plano_nome, vencimento_anterior, vencimento_novo, metadata, event_key
  )
  values (
    v_user_id,
    v_aluno.id,
    'plano_renovado',
    v_plano.id,
    v_plano.nome,
    v_aluno.vencimento,
    p_novo_vencimento,
    jsonb_build_object(
      'origem', 'financeiro',
      'previous_contract_id', v_contrato_anterior.id,
      'new_contract_id', v_novo_contrato_id,
      'previous_plan_id', v_aluno.plano,
      'previous_plan_name', coalesce(v_contrato_anterior.plano_nome_snapshot, v_aluno.plano, ''),
      'previous_contract_start', v_aluno.inicio,
      'previous_contract_end', v_aluno.vencimento,
      'previous_value', v_aluno.valor,
      'new_plan_id', v_plano.id,
      'new_plan_name', v_plano.nome,
      'new_contract_start', p_novo_inicio,
      'new_contract_end', p_novo_vencimento,
      'new_value', p_novo_valor,
      'pagamento_id', v_pagamento_id
    ),
    v_event_key
  )
  on conflict (user_id, event_key) where event_key is not null do nothing;

  return jsonb_build_object(
    'ok', true,
    'aluno_id', v_aluno.id,
    'previous_contract_id', v_contrato_anterior.id,
    'new_contract_id', v_novo_contrato_id,
    'payment_id', v_pagamento_id,
    'consultoria_inicio_preserved', true
  );
end;
$$;

grant execute on function public.renovar_aluno_contrato(uuid, uuid, date, date, numeric, boolean, text, text, text) to authenticated, service_role;
