create extension if not exists "pgcrypto";

create table if not exists public.planos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  descricao text not null default '',
  duracao_meses integer not null default 1,
  valor numeric(10, 2) not null default 0,
  permite_parcelamento boolean not null default false,
  quantidade_parcelas integer not null default 1,
  valor_parcela numeric(10, 2) not null default 0,
  intervalo_parcelas_meses integer not null default 1,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.planos
  add column if not exists permite_parcelamento boolean not null default false,
  add column if not exists quantidade_parcelas integer not null default 1,
  add column if not exists valor_parcela numeric(10, 2) not null default 0,
  add column if not exists intervalo_parcelas_meses integer not null default 1;

update public.planos
set
  quantidade_parcelas = greatest(coalesce(quantidade_parcelas, 1), 1),
  intervalo_parcelas_meses = greatest(coalesce(intervalo_parcelas_meses, 1), 1),
  valor_parcela = case
    when permite_parcelamento
      and coalesce(valor_parcela, 0) = 0
      and greatest(coalesce(quantidade_parcelas, 1), 1) > 0
    then round((valor / greatest(coalesce(quantidade_parcelas, 1), 1))::numeric, 2)
    else coalesce(valor_parcela, 0)
  end;

alter table public.planos enable row level security;

create policy "Usuarios podem listar seus planos"
on public.planos
for select
using (auth.uid() = user_id);

create policy "Usuarios podem cadastrar seus planos"
on public.planos
for insert
with check (auth.uid() = user_id);

create policy "Usuarios podem atualizar seus planos"
on public.planos
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuarios podem excluir seus planos"
on public.planos
for delete
using (auth.uid() = user_id);

create index if not exists planos_user_id_idx on public.planos(user_id);
create index if not exists planos_ativo_idx on public.planos(ativo);
