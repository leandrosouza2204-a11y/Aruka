create extension if not exists "pgcrypto";

create table if not exists public.acompanhamento_eventos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aluno_id uuid not null references public.alunos(id) on delete restrict,
  tipo text not null,
  ocorrido_em timestamptz not null default now(),
  motivo text,
  motivo_detalhe text,
  plano_id uuid references public.planos(id) on delete set null,
  plano_nome text,
  vencimento_anterior date,
  vencimento_novo date,
  metadata jsonb not null default '{}'::jsonb,
  event_key text,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'acompanhamento_eventos_tipo_check'
  ) then
    alter table public.acompanhamento_eventos
      add constraint acompanhamento_eventos_tipo_check
      check (
        tipo in (
          'acompanhamento_iniciado',
          'acompanhamento_encerrado',
          'acompanhamento_reativado',
          'plano_renovado'
        )
      );
  end if;
end $$;

create index if not exists acompanhamento_eventos_user_id_idx
on public.acompanhamento_eventos(user_id);

create index if not exists acompanhamento_eventos_aluno_id_idx
on public.acompanhamento_eventos(aluno_id);

create index if not exists acompanhamento_eventos_ocorrido_em_idx
on public.acompanhamento_eventos(ocorrido_em desc);

create index if not exists acompanhamento_eventos_user_aluno_ocorrido_idx
on public.acompanhamento_eventos(user_id, aluno_id, ocorrido_em desc);

create unique index if not exists acompanhamento_eventos_user_event_key_uidx
on public.acompanhamento_eventos(user_id, event_key)
where event_key is not null;

alter table public.acompanhamento_eventos enable row level security;

drop policy if exists "Usuarios podem listar seus eventos de acompanhamento" on public.acompanhamento_eventos;
drop policy if exists "Usuarios podem cadastrar seus eventos de acompanhamento" on public.acompanhamento_eventos;

create policy "Usuarios podem listar seus eventos de acompanhamento"
on public.acompanhamento_eventos
for select
to authenticated
using (auth.uid() = user_id);

create policy "Usuarios podem cadastrar seus eventos de acompanhamento"
on public.acompanhamento_eventos
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.alunos
    where alunos.id = acompanhamento_eventos.aluno_id
      and alunos.user_id = auth.uid()
  )
  and (
    acompanhamento_eventos.plano_id is null
    or exists (
      select 1
      from public.planos
      where planos.id = acompanhamento_eventos.plano_id
        and planos.user_id = auth.uid()
    )
  )
);
