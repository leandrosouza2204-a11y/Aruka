begin;

create extension if not exists btree_gist with schema extensions;
create schema if not exists private;

create table public.agenda_series (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null,
  titulo text not null,
  tipo text not null,
  observacoes text not null default '',
  frequencia text not null,
  intervalo integer not null default 1,
  dias_semana smallint[] not null default '{}'::smallint[],
  primeiro_inicio timestamptz not null,
  duracao_minutos integer not null,
  fuso_horario text not null default 'America/Sao_Paulo',
  termina_em date,
  limite_ocorrencias integer not null,
  quantidade_ocorrencias integer not null default 0,
  status text not null default 'ativa',
  client_request_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agenda_series_titulo_check check (char_length(btrim(titulo)) between 1 and 160),
  constraint agenda_series_tipo_check check (tipo in ('atendimento', 'pessoal', 'bloqueio', 'outro')),
  constraint agenda_series_frequencia_check check (frequencia in ('diaria', 'semanal', 'dias_semana')),
  constraint agenda_series_intervalo_check check (intervalo between 1 and 30),
  constraint agenda_series_duracao_check check (duracao_minutos between 5 and 1440),
  constraint agenda_series_limite_check check (limite_ocorrencias between 1 and 366),
  constraint agenda_series_quantidade_check check (quantidade_ocorrencias between 0 and 366),
  constraint agenda_series_status_check check (status in ('ativa', 'cancelada')),
  constraint agenda_series_request_unique unique (profissional_id, client_request_id)
);

create table public.agenda_compromissos (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null,
  serie_id uuid references public.agenda_series(id) on delete cascade,
  ocorrencia_original timestamptz,
  titulo text not null,
  tipo text not null,
  inicio timestamptz not null,
  fim timestamptz not null,
  status text not null default 'agendado',
  observacoes text not null default '',
  is_exception boolean not null default false,
  client_request_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agenda_compromissos_titulo_check check (char_length(btrim(titulo)) between 1 and 160),
  constraint agenda_compromissos_tipo_check check (tipo in ('atendimento', 'pessoal', 'bloqueio', 'outro')),
  constraint agenda_compromissos_periodo_check check (fim > inicio and fim <= inicio + interval '24 hours'),
  constraint agenda_compromissos_status_check check (status in ('agendado', 'concluido', 'falta', 'cancelado')),
  constraint agenda_compromissos_serie_check check (
    (serie_id is null and ocorrencia_original is null)
    or (serie_id is not null and ocorrencia_original is not null)
  ),
  constraint agenda_compromissos_id_profissional_unique unique (id, profissional_id),
  constraint agenda_compromissos_serie_ocorrencia_unique unique (serie_id, ocorrencia_original),
  constraint agenda_compromissos_request_unique unique (profissional_id, client_request_id),
  constraint agenda_no_overlap exclude using gist (
    profissional_id with =,
    tstzrange(inicio, fim, '[)') with &&
  ) where (status <> 'cancelado') deferrable initially immediate
);

create table public.agenda_participantes (
  compromisso_id uuid not null,
  aluno_id uuid not null references public.alunos(id) on delete restrict,
  profissional_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (compromisso_id, aluno_id),
  constraint agenda_participantes_compromisso_owner_fkey
    foreign key (compromisso_id, profissional_id)
    references public.agenda_compromissos(id, profissional_id)
    on delete cascade
);

create table public.agenda_excecoes (
  id uuid primary key default gen_random_uuid(),
  serie_id uuid not null references public.agenda_series(id) on delete cascade,
  compromisso_id uuid references public.agenda_compromissos(id) on delete cascade,
  profissional_id uuid not null,
  ocorrencia_original timestamptz not null,
  acao text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint agenda_excecoes_acao_check check (acao in ('modificada', 'cancelada')),
  constraint agenda_excecoes_serie_ocorrencia_unique unique (serie_id, ocorrencia_original)
);

create index agenda_series_profissional_status_idx
  on public.agenda_series (profissional_id, status, primeiro_inicio);
create index agenda_compromissos_profissional_intervalo_idx
  on public.agenda_compromissos (profissional_id, inicio, fim);
create index agenda_compromissos_serie_idx
  on public.agenda_compromissos (serie_id, ocorrencia_original)
  where serie_id is not null;
create index agenda_participantes_profissional_idx
  on public.agenda_participantes (profissional_id, aluno_id, compromisso_id);
create index agenda_excecoes_profissional_idx
  on public.agenda_excecoes (profissional_id, serie_id, ocorrencia_original);

comment on table public.agenda_series is 'Séries recorrentes limitadas da agenda profissional.';
comment on table public.agenda_compromissos is 'Ocorrências materializadas e compromissos avulsos da agenda profissional.';
comment on table public.agenda_participantes is 'Vínculos N:N entre compromissos e alunos do mesmo profissional.';
comment on table public.agenda_excecoes is 'Exceções preservadas ao editar ou cancelar ocorrências de uma série.';

create or replace function private.agenda_touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function private.agenda_validate_commitment_series()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.serie_id is not null and not exists (
    select 1
    from public.agenda_series s
    where s.id = new.serie_id
      and s.profissional_id = new.profissional_id
  ) then
    raise exception using errcode = '23514', message = 'AGENDA_SERIES_OWNER_MISMATCH';
  end if;
  return new;
end;
$$;

create or replace function private.agenda_validate_participant_owner()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.alunos a
    where a.id = new.aluno_id
      and a.user_id = new.profissional_id
  ) then
    raise exception using errcode = '23514', message = 'AGENDA_STUDENT_OWNER_MISMATCH';
  end if;
  return new;
end;
$$;

create trigger agenda_series_touch_updated_at
before update on public.agenda_series
for each row execute function private.agenda_touch_updated_at();

create trigger agenda_compromissos_touch_updated_at
before update on public.agenda_compromissos
for each row execute function private.agenda_touch_updated_at();

create trigger agenda_excecoes_touch_updated_at
before update on public.agenda_excecoes
for each row execute function private.agenda_touch_updated_at();

create trigger agenda_compromissos_validate_series
before insert or update of serie_id, profissional_id on public.agenda_compromissos
for each row execute function private.agenda_validate_commitment_series();

create trigger agenda_participantes_validate_owner
before insert or update of aluno_id, profissional_id on public.agenda_participantes
for each row execute function private.agenda_validate_participant_owner();

alter table public.agenda_series enable row level security;
alter table public.agenda_compromissos enable row level security;
alter table public.agenda_participantes enable row level security;
alter table public.agenda_excecoes enable row level security;

create policy "Profissionais gerenciam suas series de agenda"
on public.agenda_series
for all
to authenticated
using (profissional_id = (select auth.uid()))
with check (profissional_id = (select auth.uid()));

create policy "Profissionais gerenciam seus compromissos de agenda"
on public.agenda_compromissos
for all
to authenticated
using (profissional_id = (select auth.uid()))
with check (profissional_id = (select auth.uid()));

create policy "Profissionais gerenciam participantes da propria agenda"
on public.agenda_participantes
for all
to authenticated
using (
  profissional_id = (select auth.uid())
  and exists (
    select 1 from public.agenda_compromissos c
    where c.id = agenda_participantes.compromisso_id
      and c.profissional_id = (select auth.uid())
  )
)
with check (
  profissional_id = (select auth.uid())
  and exists (
    select 1 from public.agenda_compromissos c
    where c.id = agenda_participantes.compromisso_id
      and c.profissional_id = (select auth.uid())
  )
  and exists (
    select 1 from public.alunos a
    where a.id = agenda_participantes.aluno_id
      and a.user_id = (select auth.uid())
  )
);

create policy "Profissionais gerenciam excecoes da propria agenda"
on public.agenda_excecoes
for all
to authenticated
using (profissional_id = (select auth.uid()))
with check (
  profissional_id = (select auth.uid())
  and exists (
    select 1 from public.agenda_series s
    where s.id = agenda_excecoes.serie_id
      and s.profissional_id = (select auth.uid())
  )
);

revoke all on table public.agenda_series from anon;
revoke all on table public.agenda_compromissos from anon;
revoke all on table public.agenda_participantes from anon;
revoke all on table public.agenda_excecoes from anon;
grant select, insert, update, delete on table public.agenda_series to authenticated;
grant select, insert, update, delete on table public.agenda_compromissos to authenticated;
grant select, insert, update, delete on table public.agenda_participantes to authenticated;
grant select, insert, update, delete on table public.agenda_excecoes to authenticated;

create or replace function public.agenda_criar_compromisso(
  p_titulo text,
  p_tipo text,
  p_inicio timestamptz,
  p_fim timestamptz,
  p_observacoes text default '',
  p_aluno_ids uuid[] default '{}'::uuid[],
  p_recorrencia jsonb default null,
  p_client_request_id uuid default gen_random_uuid(),
  p_fuso_horario text default 'America/Sao_Paulo'
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_alunos uuid[];
  v_frequencia text := coalesce(nullif(p_recorrencia->>'frequencia', ''), 'nenhuma');
  v_intervalo integer := coalesce(nullif(p_recorrencia->>'intervalo', '')::integer, 1);
  v_dias_semana smallint[] := '{}'::smallint[];
  v_quantidade integer := nullif(p_recorrencia->>'quantidade', '')::integer;
  v_termina_em date := nullif(p_recorrencia->>'termina_em', '')::date;
  v_serie_id uuid;
  v_compromisso_id uuid;
  v_ids uuid[] := '{}'::uuid[];
  v_inicio_local timestamp;
  v_data_inicial date;
  v_hora_local time;
  v_data_candidata date;
  v_inicio_candidato timestamptz;
  v_fim_candidato timestamptz;
  v_duracao interval;
  v_limite integer;
  v_geradas integer := 0;
  v_iteracoes integer := 0;
  v_elegivel boolean;
begin
  if v_actor is null then
    raise exception using errcode = '28000', message = 'AUTH_REQUIRED';
  end if;
  if not exists (
    select 1 from public.perfis p
    where p.user_id = v_actor
      and p.status = 'ativo'
      and (p.role = 'admin' or p.tipo_acesso = 'admin' or (p.role = 'user' and p.tipo_acesso in ('beta', 'assinante')))
  ) then
    raise exception using errcode = '42501', message = 'AGENDA_PROFESSIONAL_REQUIRED';
  end if;
  if p_client_request_id is null then
    raise exception using errcode = '22023', message = 'AGENDA_REQUEST_ID_REQUIRED';
  end if;
  if char_length(btrim(coalesce(p_titulo, ''))) not between 1 and 160 then
    raise exception using errcode = '22023', message = 'AGENDA_INVALID_TITLE';
  end if;
  if p_tipo not in ('atendimento', 'pessoal', 'bloqueio', 'outro') then
    raise exception using errcode = '22023', message = 'AGENDA_INVALID_TYPE';
  end if;
  if p_inicio is null or p_fim is null or p_fim <= p_inicio or p_fim > p_inicio + interval '24 hours' then
    raise exception using errcode = '22023', message = 'AGENDA_INVALID_TIME_RANGE';
  end if;
  if not exists (select 1 from pg_catalog.pg_timezone_names z where z.name = p_fuso_horario) then
    raise exception using errcode = '22023', message = 'AGENDA_INVALID_TIMEZONE';
  end if;

  select coalesce(array_agg(distinct aluno_id), '{}'::uuid[])
  into v_alunos
  from unnest(coalesce(p_aluno_ids, '{}'::uuid[])) aluno_id
  where aluno_id is not null;

  if p_tipo = 'atendimento' and cardinality(v_alunos) = 0 then
    raise exception using errcode = '22023', message = 'AGENDA_STUDENT_REQUIRED';
  end if;
  if (
    select count(*) from public.alunos a
    where a.id = any(v_alunos) and a.user_id = v_actor
  ) <> cardinality(v_alunos) then
    raise exception using errcode = '42501', message = 'AGENDA_STUDENT_OWNER_MISMATCH';
  end if;

  if v_frequencia = 'nenhuma' then
    select c.id into v_compromisso_id
    from public.agenda_compromissos c
    where c.profissional_id = v_actor and c.client_request_id = p_client_request_id;
    if found then
      return jsonb_build_object('compromisso_id', v_compromisso_id, 'replayed', true);
    end if;

    if exists (
      select 1 from public.agenda_compromissos c
      where c.profissional_id = v_actor and c.status <> 'cancelado'
        and c.inicio < p_fim and c.fim > p_inicio
    ) then
      raise exception using errcode = '23P01', message = 'AGENDA_CONFLICT';
    end if;

    insert into public.agenda_compromissos (
      profissional_id, titulo, tipo, inicio, fim, observacoes, client_request_id
    ) values (
      v_actor, btrim(p_titulo), p_tipo, p_inicio, p_fim, coalesce(p_observacoes, ''), p_client_request_id
    ) returning id into v_compromisso_id;

    insert into public.agenda_participantes (compromisso_id, aluno_id, profissional_id)
    select v_compromisso_id, aluno_id, v_actor from unnest(v_alunos) aluno_id;

    return jsonb_build_object('compromisso_id', v_compromisso_id, 'replayed', false);
  end if;

  if v_frequencia not in ('diaria', 'semanal', 'dias_semana') or v_intervalo not between 1 and 30 then
    raise exception using errcode = '22023', message = 'AGENDA_INVALID_RECURRENCE';
  end if;
  if p_recorrencia ? 'dias_semana' then
    select coalesce(array_agg(distinct dia::smallint order by dia::smallint), '{}'::smallint[])
    into v_dias_semana
    from jsonb_array_elements_text(p_recorrencia->'dias_semana') dia;
  end if;
  if v_frequencia = 'dias_semana' and (
    cardinality(v_dias_semana) = 0
    or exists (select 1 from unnest(v_dias_semana) d where d < 0 or d > 6)
  ) then
    raise exception using errcode = '22023', message = 'AGENDA_INVALID_WEEKDAYS';
  end if;
  if v_quantidade is null and v_termina_em is null then
    raise exception using errcode = '22023', message = 'AGENDA_RECURRENCE_END_REQUIRED';
  end if;
  if v_quantidade is not null and v_quantidade not between 1 and 366 then
    raise exception using errcode = '22023', message = 'AGENDA_RECURRENCE_LIMIT';
  end if;

  v_inicio_local := p_inicio at time zone p_fuso_horario;
  v_data_inicial := v_inicio_local::date;
  v_hora_local := v_inicio_local::time;
  if v_termina_em is not null and (v_termina_em < v_data_inicial or v_termina_em > v_data_inicial + 730) then
    raise exception using errcode = '22023', message = 'AGENDA_RECURRENCE_HORIZON';
  end if;
  v_limite := least(coalesce(v_quantidade, 366), 366);

  select s.id into v_serie_id
  from public.agenda_series s
  where s.profissional_id = v_actor and s.client_request_id = p_client_request_id;
  if found then
    return jsonb_build_object('serie_id', v_serie_id, 'replayed', true);
  end if;

  insert into public.agenda_series (
    profissional_id, titulo, tipo, observacoes, frequencia, intervalo, dias_semana,
    primeiro_inicio, duracao_minutos, fuso_horario, termina_em, limite_ocorrencias, client_request_id
  ) values (
    v_actor, btrim(p_titulo), p_tipo, coalesce(p_observacoes, ''), v_frequencia, v_intervalo, v_dias_semana,
    p_inicio, greatest(5, floor(extract(epoch from (p_fim - p_inicio)) / 60)::integer), p_fuso_horario,
    v_termina_em, v_limite, p_client_request_id
  ) returning id into v_serie_id;

  v_duracao := p_fim - p_inicio;
  v_data_candidata := v_data_inicial;
  while v_geradas < v_limite and v_iteracoes <= 730 loop
    exit when v_termina_em is not null and v_data_candidata > v_termina_em;
    v_elegivel := case v_frequencia
      when 'diaria' then ((v_data_candidata - v_data_inicial) % v_intervalo) = 0
      when 'semanal' then extract(dow from v_data_candidata) = extract(dow from v_data_inicial)
        and (((v_data_candidata - v_data_inicial) / 7) % v_intervalo) = 0
      when 'dias_semana' then extract(dow from v_data_candidata)::smallint = any(v_dias_semana)
        and (((v_data_candidata - v_data_inicial) / 7) % v_intervalo) = 0
      else false
    end;

    if v_elegivel then
      v_inicio_candidato := (v_data_candidata + v_hora_local) at time zone p_fuso_horario;
      v_fim_candidato := v_inicio_candidato + v_duracao;
      if exists (
        select 1 from public.agenda_compromissos c
        where c.profissional_id = v_actor and c.status <> 'cancelado'
          and c.inicio < v_fim_candidato and c.fim > v_inicio_candidato
      ) then
        raise exception using errcode = '23P01', message = 'AGENDA_CONFLICT';
      end if;

      insert into public.agenda_compromissos (
        profissional_id, serie_id, ocorrencia_original, titulo, tipo, inicio, fim, observacoes
      ) values (
        v_actor, v_serie_id, v_inicio_candidato, btrim(p_titulo), p_tipo,
        v_inicio_candidato, v_fim_candidato, coalesce(p_observacoes, '')
      ) returning id into v_compromisso_id;
      v_ids := array_append(v_ids, v_compromisso_id);

      insert into public.agenda_participantes (compromisso_id, aluno_id, profissional_id)
      select v_compromisso_id, aluno_id, v_actor from unnest(v_alunos) aluno_id;
      v_geradas := v_geradas + 1;
    end if;
    v_data_candidata := v_data_candidata + 1;
    v_iteracoes := v_iteracoes + 1;
  end loop;

  if v_geradas = 0 then
    raise exception using errcode = '22023', message = 'AGENDA_RECURRENCE_EMPTY';
  end if;
  update public.agenda_series set quantidade_ocorrencias = v_geradas where id = v_serie_id;
  return jsonb_build_object('serie_id', v_serie_id, 'compromisso_ids', to_jsonb(v_ids), 'quantidade', v_geradas, 'replayed', false);
end;
$$;

create or replace function public.agenda_atualizar_compromisso(
  p_compromisso_id uuid,
  p_escopo text,
  p_titulo text,
  p_tipo text,
  p_inicio timestamptz,
  p_fim timestamptz,
  p_observacoes text default '',
  p_aluno_ids uuid[] default '{}'::uuid[]
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_atual public.agenda_compromissos%rowtype;
  v_alunos uuid[];
  v_ids uuid[];
  v_delta interval;
  v_duracao interval;
begin
  if v_actor is null then raise exception using errcode = '28000', message = 'AUTH_REQUIRED'; end if;
  select * into v_atual from public.agenda_compromissos
  where id = p_compromisso_id and profissional_id = v_actor;
  if not found then raise exception using errcode = 'P0002', message = 'AGENDA_COMMITMENT_NOT_FOUND'; end if;
  if p_escopo not in ('ocorrencia', 'serie') then raise exception using errcode = '22023', message = 'AGENDA_INVALID_SCOPE'; end if;
  if char_length(btrim(coalesce(p_titulo, ''))) not between 1 and 160
     or p_tipo not in ('atendimento', 'pessoal', 'bloqueio', 'outro')
     or p_inicio is null or p_fim is null or p_fim <= p_inicio or p_fim > p_inicio + interval '24 hours' then
    raise exception using errcode = '22023', message = 'AGENDA_INVALID_COMMITMENT';
  end if;
  select coalesce(array_agg(distinct aluno_id), '{}'::uuid[]) into v_alunos
  from unnest(coalesce(p_aluno_ids, '{}'::uuid[])) aluno_id where aluno_id is not null;
  if p_tipo = 'atendimento' and cardinality(v_alunos) = 0 then
    raise exception using errcode = '22023', message = 'AGENDA_STUDENT_REQUIRED';
  end if;
  if (select count(*) from public.alunos a where a.id = any(v_alunos) and a.user_id = v_actor) <> cardinality(v_alunos) then
    raise exception using errcode = '42501', message = 'AGENDA_STUDENT_OWNER_MISMATCH';
  end if;

  set constraints public.agenda_no_overlap deferred;
  if p_escopo = 'serie' and v_atual.serie_id is not null then
    v_delta := p_inicio - v_atual.inicio;
    v_duracao := p_fim - p_inicio;
    select coalesce(array_agg(c.id), '{}'::uuid[]) into v_ids
    from public.agenda_compromissos c
    where c.serie_id = v_atual.serie_id
      and c.profissional_id = v_actor
      and c.ocorrencia_original >= v_atual.ocorrencia_original
      and c.is_exception = false
      and c.status <> 'cancelado';

    update public.agenda_compromissos c
    set titulo = btrim(p_titulo), tipo = p_tipo, observacoes = coalesce(p_observacoes, ''),
        inicio = c.inicio + v_delta, fim = c.inicio + v_delta + v_duracao
    where c.id = any(v_ids);
    update public.agenda_series
    set titulo = btrim(p_titulo), tipo = p_tipo, observacoes = coalesce(p_observacoes, ''),
        duracao_minutos = floor(extract(epoch from v_duracao) / 60)::integer
    where id = v_atual.serie_id and profissional_id = v_actor;

    delete from public.agenda_participantes where compromisso_id = any(v_ids);
    insert into public.agenda_participantes (compromisso_id, aluno_id, profissional_id)
    select compromisso_id, aluno_id, v_actor from unnest(v_ids) compromisso_id cross join unnest(v_alunos) aluno_id;
    return jsonb_build_object('serie_id', v_atual.serie_id, 'atualizados', cardinality(v_ids));
  end if;

  update public.agenda_compromissos
  set titulo = btrim(p_titulo), tipo = p_tipo, inicio = p_inicio, fim = p_fim,
      observacoes = coalesce(p_observacoes, ''), is_exception = (serie_id is not null)
  where id = p_compromisso_id and profissional_id = v_actor;
  delete from public.agenda_participantes where compromisso_id = p_compromisso_id;
  insert into public.agenda_participantes (compromisso_id, aluno_id, profissional_id)
  select p_compromisso_id, aluno_id, v_actor from unnest(v_alunos) aluno_id;

  if v_atual.serie_id is not null then
    insert into public.agenda_excecoes (
      serie_id, compromisso_id, profissional_id, ocorrencia_original, acao
    ) values (
      v_atual.serie_id, p_compromisso_id, v_actor, v_atual.ocorrencia_original, 'modificada'
    ) on conflict (serie_id, ocorrencia_original) do update
      set compromisso_id = excluded.compromisso_id, acao = 'modificada';
  end if;
  return jsonb_build_object('compromisso_id', p_compromisso_id, 'atualizados', 1);
end;
$$;

create or replace function public.agenda_atualizar_status(
  p_compromisso_id uuid,
  p_status text
)
returns public.agenda_compromissos
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_resultado public.agenda_compromissos%rowtype;
begin
  if v_actor is null then raise exception using errcode = '28000', message = 'AUTH_REQUIRED'; end if;
  if p_status not in ('agendado', 'concluido', 'falta') then
    raise exception using errcode = '22023', message = 'AGENDA_INVALID_STATUS';
  end if;
  update public.agenda_compromissos
  set status = p_status
  where id = p_compromisso_id and profissional_id = v_actor and status <> 'cancelado'
  returning * into v_resultado;
  if not found then raise exception using errcode = 'P0002', message = 'AGENDA_COMMITMENT_NOT_FOUND'; end if;
  return v_resultado;
end;
$$;

create or replace function public.agenda_cancelar_compromisso(
  p_compromisso_id uuid,
  p_escopo text default 'ocorrencia'
)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_atual public.agenda_compromissos%rowtype;
  v_quantidade integer;
begin
  if v_actor is null then raise exception using errcode = '28000', message = 'AUTH_REQUIRED'; end if;
  if p_escopo not in ('ocorrencia', 'serie') then raise exception using errcode = '22023', message = 'AGENDA_INVALID_SCOPE'; end if;
  select * into v_atual from public.agenda_compromissos
  where id = p_compromisso_id and profissional_id = v_actor;
  if not found then raise exception using errcode = 'P0002', message = 'AGENDA_COMMITMENT_NOT_FOUND'; end if;

  if p_escopo = 'serie' and v_atual.serie_id is not null then
    update public.agenda_series set status = 'cancelada'
    where id = v_atual.serie_id and profissional_id = v_actor;
    update public.agenda_compromissos set status = 'cancelado'
    where serie_id = v_atual.serie_id and profissional_id = v_actor and status <> 'cancelado';
    get diagnostics v_quantidade = row_count;
    return jsonb_build_object('serie_id', v_atual.serie_id, 'cancelados', v_quantidade);
  end if;

  update public.agenda_compromissos
  set status = 'cancelado', is_exception = (serie_id is not null)
  where id = p_compromisso_id and profissional_id = v_actor;
  if v_atual.serie_id is not null then
    insert into public.agenda_excecoes (
      serie_id, compromisso_id, profissional_id, ocorrencia_original, acao
    ) values (
      v_atual.serie_id, p_compromisso_id, v_actor, v_atual.ocorrencia_original, 'cancelada'
    ) on conflict (serie_id, ocorrencia_original) do update
      set compromisso_id = excluded.compromisso_id, acao = 'cancelada';
  end if;
  return jsonb_build_object('compromisso_id', p_compromisso_id, 'cancelados', 1);
end;
$$;

revoke all on function private.agenda_touch_updated_at() from public, anon, authenticated;
revoke all on function private.agenda_validate_commitment_series() from public, anon, authenticated;
revoke all on function private.agenda_validate_participant_owner() from public, anon, authenticated;
grant execute on function private.agenda_touch_updated_at() to service_role;
grant execute on function private.agenda_validate_commitment_series() to service_role;
grant execute on function private.agenda_validate_participant_owner() to service_role;

revoke all on function public.agenda_criar_compromisso(text, text, timestamptz, timestamptz, text, uuid[], jsonb, uuid, text) from public, anon;
revoke all on function public.agenda_atualizar_compromisso(uuid, text, text, text, timestamptz, timestamptz, text, uuid[]) from public, anon;
revoke all on function public.agenda_atualizar_status(uuid, text) from public, anon;
revoke all on function public.agenda_cancelar_compromisso(uuid, text) from public, anon;
grant execute on function public.agenda_criar_compromisso(text, text, timestamptz, timestamptz, text, uuid[], jsonb, uuid, text) to authenticated;
grant execute on function public.agenda_atualizar_compromisso(uuid, text, text, text, timestamptz, timestamptz, text, uuid[]) to authenticated;
grant execute on function public.agenda_atualizar_status(uuid, text) to authenticated;
grant execute on function public.agenda_cancelar_compromisso(uuid, text) to authenticated;

commit;
