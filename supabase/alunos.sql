create extension if not exists "pgcrypto";

create table if not exists public.alunos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  whatsapp text not null,
  nascimento date,
  inicio date not null,
  vencimento date,
  aviso7 date,
  aviso1 date,
  plano text not null,
  valor numeric(10, 2) not null default 0,
  status text not null default 'Ativo',
  pagamento_recebido boolean not null default false,
  data_pagamento date,
  observacoes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.alunos enable row level security;

create policy "Usuarios podem listar seus alunos"
on public.alunos
for select
using (auth.uid() = user_id);

create policy "Usuarios podem cadastrar seus alunos"
on public.alunos
for insert
with check (auth.uid() = user_id);

create policy "Usuarios podem atualizar seus alunos"
on public.alunos
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuarios podem excluir seus alunos"
on public.alunos
for delete
using (auth.uid() = user_id);

create index if not exists alunos_user_id_idx on public.alunos(user_id);
create index if not exists alunos_vencimento_idx on public.alunos(vencimento);
