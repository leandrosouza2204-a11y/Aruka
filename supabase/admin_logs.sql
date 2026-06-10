create extension if not exists "pgcrypto";

create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references auth.users(id),
  target_user_id uuid references auth.users(id),
  acao text not null,
  entidade text,
  entidade_id uuid,
  dados_anteriores jsonb,
  dados_novos jsonb,
  ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.admin_logs enable row level security;

create index if not exists admin_logs_admin_user_id_idx on public.admin_logs(admin_user_id);
create index if not exists admin_logs_target_user_id_idx on public.admin_logs(target_user_id);
create index if not exists admin_logs_acao_idx on public.admin_logs(acao);
create index if not exists admin_logs_created_at_idx on public.admin_logs(created_at desc);

drop policy if exists "Admins podem listar logs administrativos" on public.admin_logs;
drop policy if exists "Usuarios comuns nao inserem logs administrativos" on public.admin_logs;

create policy "Admins podem listar logs administrativos"
on public.admin_logs
for select
using (
  exists (
    select 1
    from public.perfis
    where perfis.user_id = auth.uid()
      and perfis.status = 'ativo'
      and (perfis.role = 'admin' or perfis.tipo_acesso = 'admin')
  )
);

create policy "Usuarios comuns nao inserem logs administrativos"
on public.admin_logs
for insert
with check (false);

create or replace function public.admin_registrar_log(
  p_target_user_id uuid,
  p_acao text,
  p_entidade text default null,
  p_entidade_id uuid default null,
  p_dados_anteriores jsonb default null,
  p_dados_novos jsonb default null,
  p_user_agent text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_log_id uuid;
begin
  if not exists (
    select 1
    from public.perfis
    where perfis.user_id = auth.uid()
      and perfis.status = 'ativo'
      and (perfis.role = 'admin' or perfis.tipo_acesso = 'admin')
  ) then
    raise exception 'Acesso negado: permissao de administrador necessaria.';
  end if;

  insert into public.admin_logs (
    admin_user_id,
    target_user_id,
    acao,
    entidade,
    entidade_id,
    dados_anteriores,
    dados_novos,
    user_agent
  )
  values (
    auth.uid(),
    p_target_user_id,
    p_acao,
    p_entidade,
    p_entidade_id,
    p_dados_anteriores,
    p_dados_novos,
    nullif(trim(coalesce(p_user_agent, '')), '')
  )
  returning id into v_log_id;

  return v_log_id;
end;
$$;

create or replace function public.admin_listar_logs(
  p_acao text default null,
  p_target_user_id uuid default null,
  p_data_inicio date default null,
  p_data_fim date default null,
  p_busca text default null
)
returns table (
  id uuid,
  admin_user_id uuid,
  admin_email text,
  admin_nome text,
  target_user_id uuid,
  target_email text,
  target_nome text,
  acao text,
  entidade text,
  entidade_id uuid,
  dados_anteriores jsonb,
  dados_novos jsonb,
  ip text,
  user_agent text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_busca text := lower(trim(coalesce(p_busca, '')));
begin
  if not exists (
    select 1
    from public.perfis
    where perfis.user_id = auth.uid()
      and perfis.status = 'ativo'
      and (perfis.role = 'admin' or perfis.tipo_acesso = 'admin')
  ) then
    raise exception 'Acesso negado: permissao de administrador necessaria.';
  end if;

  return query
  select
    logs.id,
    logs.admin_user_id,
    admin_users.email::text as admin_email,
    admin_perfis.nome as admin_nome,
    logs.target_user_id,
    target_users.email::text as target_email,
    target_perfis.nome as target_nome,
    logs.acao,
    logs.entidade,
    logs.entidade_id,
    logs.dados_anteriores,
    logs.dados_novos,
    logs.ip,
    logs.user_agent,
    logs.created_at
  from public.admin_logs logs
  left join auth.users admin_users on admin_users.id = logs.admin_user_id
  left join auth.users target_users on target_users.id = logs.target_user_id
  left join public.perfis admin_perfis on admin_perfis.user_id = logs.admin_user_id
  left join public.perfis target_perfis on target_perfis.user_id = logs.target_user_id
  where
    (p_acao is null or p_acao = '' or logs.acao = p_acao)
    and (p_target_user_id is null or logs.target_user_id = p_target_user_id)
    and (p_data_inicio is null or logs.created_at >= p_data_inicio::timestamptz)
    and (
      p_data_fim is null
      or logs.created_at < (p_data_fim + interval '1 day')::timestamptz
    )
    and (
      v_busca = ''
      or lower(coalesce(target_users.email::text, '')) like '%' || v_busca || '%'
      or lower(coalesce(target_perfis.nome, '')) like '%' || v_busca || '%'
      or lower(coalesce(admin_users.email::text, '')) like '%' || v_busca || '%'
      or lower(coalesce(admin_perfis.nome, '')) like '%' || v_busca || '%'
      or lower(coalesce(logs.acao, '')) like '%' || v_busca || '%'
    )
  order by logs.created_at desc
  limit 500;
end;
$$;

revoke all on table public.admin_logs from public;
revoke all on function public.admin_registrar_log(uuid, text, text, uuid, jsonb, jsonb, text) from public;
revoke all on function public.admin_listar_logs(text, uuid, date, date, text) from public;

grant select on table public.admin_logs to authenticated;
grant execute on function public.admin_registrar_log(uuid, text, text, uuid, jsonb, jsonb, text) to authenticated;
grant execute on function public.admin_listar_logs(text, uuid, date, date, text) to authenticated;
