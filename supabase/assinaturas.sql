create extension if not exists "pgcrypto";

create table if not exists public.assinaturas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plano text not null,
  status text not null default 'pendente',
  data_inicio date,
  data_vencimento date,
  pagamento_id text,
  created_at timestamptz not null default now(),
  constraint assinaturas_status_check check (
    status in ('pendente', 'ativo', 'vencido', 'cancelado', 'teste')
  )
);

alter table public.assinaturas enable row level security;

drop policy if exists "Usuarios podem listar suas assinaturas" on public.assinaturas;
drop policy if exists "Usuarios podem cadastrar suas assinaturas" on public.assinaturas;
drop policy if exists "Usuarios podem atualizar suas assinaturas" on public.assinaturas;
drop policy if exists "Usuarios podem excluir suas assinaturas" on public.assinaturas;

create policy "Usuarios podem listar suas assinaturas"
on public.assinaturas
for select
using (auth.uid() = user_id);

create policy "Usuarios podem cadastrar suas assinaturas"
on public.assinaturas
for insert
with check (auth.uid() = user_id and status = 'pendente');

create index if not exists assinaturas_user_id_idx on public.assinaturas(user_id);
create index if not exists assinaturas_status_idx on public.assinaturas(status);
create index if not exists assinaturas_data_vencimento_idx on public.assinaturas(data_vencimento);