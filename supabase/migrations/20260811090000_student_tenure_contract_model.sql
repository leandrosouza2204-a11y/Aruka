alter table public.alunos
  add column if not exists consultoria_inicio date,
  add column if not exists consultoria_inicio_confianca text not null default 'UNKNOWN';

alter table only public.alunos drop constraint if exists alunos_consultoria_inicio_confianca_check;
alter table only public.alunos
  add constraint alunos_consultoria_inicio_confianca_check
  check (consultoria_inicio_confianca in ('EXACT', 'DERIVED_HIGH_CONFIDENCE', 'DERIVED_LOW_CONFIDENCE', 'UNKNOWN'));

comment on column public.alunos.inicio is 'CURRENT_CONTRACT_START_DATE. Inicio do contrato/plano comercial vigente.';
comment on column public.alunos.consultoria_inicio is 'CONSULTANCY_START_DATE. Primeira data valida conhecida do relacionamento historico com a consultoria.';
comment on column public.alunos.consultoria_inicio_confianca is 'Classificacao da origem do backfill/captura de consultoria_inicio.';

create table if not exists public.aluno_contratos (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  aluno_id uuid not null,
  plano_id uuid,
  plano_nome_snapshot text default ''::text not null,
  inicio date not null,
  vencimento date,
  valor numeric(10,2) default 0 not null,
  status text default 'ativo'::text not null,
  origem text default 'legacy_current_contract'::text not null,
  renovado_de_id uuid,
  metadata jsonb default '{}'::jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table only public.aluno_contratos add constraint aluno_contratos_pkey primary key (id);
alter table only public.aluno_contratos add constraint aluno_contratos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.aluno_contratos add constraint aluno_contratos_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete cascade;
alter table only public.aluno_contratos add constraint aluno_contratos_plano_id_fkey foreign key (plano_id) references public.planos(id) on delete set null;
alter table only public.aluno_contratos add constraint aluno_contratos_renovado_de_id_fkey foreign key (renovado_de_id) references public.aluno_contratos(id) on delete set null;
alter table only public.aluno_contratos add constraint aluno_contratos_status_check check (status in ('ativo', 'renovado', 'encerrado', 'cancelado'));
alter table only public.aluno_contratos add constraint aluno_contratos_periodo_check check (vencimento is null or vencimento >= inicio);

create index if not exists aluno_contratos_user_id_idx on public.aluno_contratos using btree (user_id);
create index if not exists aluno_contratos_aluno_id_idx on public.aluno_contratos using btree (aluno_id);
create index if not exists aluno_contratos_plano_id_idx on public.aluno_contratos using btree (plano_id) where plano_id is not null;
create index if not exists aluno_contratos_renovado_de_id_idx on public.aluno_contratos using btree (renovado_de_id) where renovado_de_id is not null;
create index if not exists aluno_contratos_user_aluno_inicio_idx on public.aluno_contratos using btree (user_id, aluno_id, inicio);
create unique index if not exists aluno_contratos_um_ativo_por_aluno_uidx on public.aluno_contratos using btree (aluno_id) where status = 'ativo';

alter table public.aluno_contratos enable row level security;

revoke all on table public.aluno_contratos from anon;
revoke all on table public.aluno_contratos from authenticated;
grant select on table public.aluno_contratos to authenticated;

drop policy if exists "Usuarios podem listar seus contratos de alunos" on public.aluno_contratos;
create policy "Usuarios podem listar seus contratos de alunos" on public.aluno_contratos for select to authenticated using (
  (select auth.uid()) = user_id
  and exists (select 1 from public.alunos where alunos.id = aluno_contratos.aluno_id and alunos.user_id = (select auth.uid()))
);

drop policy if exists "Usuarios podem cadastrar contratos dos seus alunos" on public.aluno_contratos;
drop policy if exists "Usuarios podem atualizar contratos dos seus alunos" on public.aluno_contratos;
drop policy if exists "Usuarios podem excluir contratos dos seus alunos" on public.aluno_contratos;

with eventos_inicio as (
  select distinct on (aluno_id)
    aluno_id,
    ocorrido_em::date as data_inicio
  from public.acompanhamento_eventos
  where tipo = 'acompanhamento_iniciado'
    and ocorrido_em::date <= current_date
  order by aluno_id, ocorrido_em asc, created_at asc
),
classificacao as (
  select
    a.id,
    case
      when ei.data_inicio is not null then ei.data_inicio
      when a.inicio is not null and a.inicio <= current_date then a.inicio
      else null
    end as consultoria_inicio,
    case
      when ei.data_inicio is not null then 'EXACT'
      when a.inicio is not null and a.inicio <= current_date then 'DERIVED_LOW_CONFIDENCE'
      else 'UNKNOWN'
    end as confianca
  from public.alunos a
  left join eventos_inicio ei on ei.aluno_id = a.id
)
update public.alunos a
set
  consultoria_inicio = c.consultoria_inicio,
  consultoria_inicio_confianca = c.confianca
from classificacao c
where c.id = a.id;

insert into public.aluno_contratos (
  user_id, aluno_id, plano_id, plano_nome_snapshot, inicio, vencimento, valor, status, origem, metadata
)
select
  a.user_id,
  a.id,
  case when p.id is not null then p.id else null end,
  coalesce(p.nome, a.plano, ''),
  a.inicio,
  a.vencimento,
  a.valor,
  case
    when coalesce(a.acompanhamento_status, 'ativo') in ('encerrado', 'nao_renovado') then 'encerrado'
    when coalesce(a.acompanhamento_status, 'ativo') = 'cancelado' then 'cancelado'
    else 'ativo'
  end,
  'legacy_current_contract',
  jsonb_build_object(
    'backfill', true,
    'consultoria_inicio_confianca', a.consultoria_inicio_confianca
  )
from public.alunos a
left join public.planos p on p.id::text = a.plano and p.user_id = a.user_id
where a.inicio is not null
  and not exists (
    select 1 from public.aluno_contratos c
    where c.aluno_id = a.id
      and c.inicio = a.inicio
      and coalesce(c.vencimento, '9999-12-31'::date) = coalesce(a.vencimento, '9999-12-31'::date)
  );

create or replace function public.set_aluno_contratos_updated_at()
returns trigger
language plpgsql
set search_path to public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_aluno_contratos_updated_at on public.aluno_contratos;
create trigger set_aluno_contratos_updated_at
before update on public.aluno_contratos
for each row execute function public.set_aluno_contratos_updated_at();

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

  if p_novo_valor <= 0 then
    raise exception 'INVALID_CONTRACT_VALUE';
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
