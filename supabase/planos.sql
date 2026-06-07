create extension if not exists "pgcrypto";

create table if not exists public.planos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  descricao text not null default '',
  duracao_meses integer not null default 1,
  valor numeric(10, 2) not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

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
