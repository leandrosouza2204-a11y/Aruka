create extension if not exists "pgcrypto";

create table if not exists public.perfis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nome text,
  email text,
  role text not null default 'user',
  tipo_acesso text not null default 'pendente',
  status text not null default 'ativo',
  created_at timestamptz not null default now(),
  constraint perfis_role_check check (role in ('admin', 'user')),
  constraint perfis_tipo_acesso_check check (
    tipo_acesso in ('admin', 'beta', 'assinante', 'pendente', 'bloqueado')
  ),
  constraint perfis_status_check check (status in ('ativo', 'inativo'))
);

alter table public.perfis enable row level security;

drop policy if exists "Usuarios podem listar seu perfil" on public.perfis;
drop policy if exists "Usuarios podem criar seu perfil padrao" on public.perfis;
drop policy if exists "Usuarios podem atualizar seu perfil" on public.perfis;
drop policy if exists "Usuarios podem excluir seu perfil" on public.perfis;

create policy "Usuarios podem listar seu perfil"
on public.perfis
for select
using (auth.uid() = user_id);

create policy "Usuarios podem criar seu perfil padrao"
on public.perfis
for insert
with check (
  auth.uid() = user_id
  and role = 'user'
  and tipo_acesso = 'pendente'
  and status = 'ativo'
);

create index if not exists perfis_user_id_idx on public.perfis(user_id);
create index if not exists perfis_tipo_acesso_idx on public.perfis(tipo_acesso);
create index if not exists perfis_status_idx on public.perfis(status);
