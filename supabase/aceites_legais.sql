create extension if not exists "pgcrypto";

create table if not exists public.aceites_legais (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  politica_versao text not null,
  termos_versao text not null,
  politica_aceita boolean not null default false,
  termos_aceitos boolean not null default false,
  aceito_em timestamptz,
  ip text,
  user_agent text,
  created_at timestamptz not null default now(),
  constraint aceites_legais_versao_unica unique (
    user_id,
    politica_versao,
    termos_versao
  )
);

alter table public.aceites_legais enable row level security;

drop policy if exists "Usuarios podem listar seus aceites legais"
on public.aceites_legais;

drop policy if exists "Usuarios podem registrar seus aceites legais"
on public.aceites_legais;

drop policy if exists "Usuarios nao podem atualizar aceites legais"
on public.aceites_legais;

drop policy if exists "Usuarios nao podem excluir aceites legais"
on public.aceites_legais;

create policy "Usuarios podem listar seus aceites legais"
on public.aceites_legais
for select
using (auth.uid() = user_id);

create policy "Usuarios podem registrar seus aceites legais"
on public.aceites_legais
for insert
with check (
  auth.uid() = user_id
  and politica_aceita = true
  and termos_aceitos = true
);

create index if not exists aceites_legais_user_id_idx
on public.aceites_legais(user_id);

create index if not exists aceites_legais_versoes_idx
on public.aceites_legais(politica_versao, termos_versao);

create index if not exists aceites_legais_aceito_em_idx
on public.aceites_legais(aceito_em);
