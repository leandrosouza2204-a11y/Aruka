create or replace function public.admin_eh_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.perfis
    where perfis.user_id = auth.uid()
      and perfis.status = 'ativo'
      and (perfis.role = 'admin' or perfis.tipo_acesso = 'admin')
  );
$$;

create or replace function public.admin_validar_acesso()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_eh_admin() then
    raise exception 'Acesso negado: permissao de administrador necessaria.';
  end if;
end;
$$;

create or replace function public.admin_listar_usuarios()
returns table (
  user_id uuid,
  email text,
  created_at timestamptz,
  nome text,
  role text,
  tipo_acesso text,
  status text,
  assinatura_plano text,
  assinatura_status text,
  data_inicio date,
  data_vencimento date
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  perform public.admin_validar_acesso();

  return query
  with ultima_assinatura as (
    select distinct on (assinaturas.user_id)
      assinaturas.user_id,
      assinaturas.plano,
      assinaturas.status,
      assinaturas.data_inicio,
      assinaturas.data_vencimento
    from public.assinaturas
    order by assinaturas.user_id, assinaturas.created_at desc
  )
  select
    users.id as user_id,
    users.email::text as email,
    users.created_at,
    perfis.nome,
    coalesce(perfis.role, 'user') as role,
    coalesce(perfis.tipo_acesso, 'pendente') as tipo_acesso,
    coalesce(perfis.status, 'ativo') as status,
    ultima_assinatura.plano as assinatura_plano,
    ultima_assinatura.status as assinatura_status,
    ultima_assinatura.data_inicio,
    ultima_assinatura.data_vencimento
  from auth.users
  left join public.perfis on perfis.user_id = users.id
  left join ultima_assinatura on ultima_assinatura.user_id = users.id
  order by users.created_at desc;
end;
$$;

create or replace function public.admin_atualizar_perfil(
  p_user_id uuid,
  p_nome text,
  p_role text,
  p_tipo_acesso text,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text;
begin
  perform public.admin_validar_acesso();

  if p_role not in ('admin', 'user') then
    raise exception 'Role invalida: %', p_role;
  end if;

  if p_tipo_acesso not in ('admin', 'beta', 'assinante', 'pendente', 'bloqueado') then
    raise exception 'Tipo de acesso invalido: %', p_tipo_acesso;
  end if;

  if p_status not in ('ativo', 'inativo') then
    raise exception 'Status invalido: %', p_status;
  end if;

  select users.email::text
  into v_email
  from auth.users
  where users.id = p_user_id;

  if v_email is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  insert into public.perfis (
    user_id,
    nome,
    email,
    role,
    tipo_acesso,
    status
  )
  values (
    p_user_id,
    nullif(trim(coalesce(p_nome, '')), ''),
    v_email,
    p_role,
    p_tipo_acesso,
    p_status
  )
  on conflict (user_id) do update
  set
    nome = excluded.nome,
    email = excluded.email,
    role = excluded.role,
    tipo_acesso = excluded.tipo_acesso,
    status = excluded.status;
end;
$$;

create or replace function public.admin_upsert_assinatura(
  p_user_id uuid,
  p_plano text,
  p_status text,
  p_data_inicio date,
  p_data_vencimento date
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_assinatura_id uuid;
begin
  perform public.admin_validar_acesso();

  if p_status not in ('pendente', 'ativo', 'vencido', 'cancelado', 'teste') then
    raise exception 'Status de assinatura invalido: %', p_status;
  end if;

  if not exists (select 1 from auth.users where users.id = p_user_id) then
    raise exception 'Usuario nao encontrado.';
  end if;

  select assinaturas.id
  into v_assinatura_id
  from public.assinaturas
  where assinaturas.user_id = p_user_id
  order by assinaturas.created_at desc
  limit 1;

  if v_assinatura_id is null then
    insert into public.assinaturas (
      user_id,
      plano,
      status,
      data_inicio,
      data_vencimento
    )
    values (
      p_user_id,
      coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'),
      p_status,
      p_data_inicio,
      p_data_vencimento
    );
  else
    update public.assinaturas
    set
      plano = coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'),
      status = p_status,
      data_inicio = p_data_inicio,
      data_vencimento = p_data_vencimento
    where assinaturas.id = v_assinatura_id;
  end if;
end;
$$;

create or replace function public.admin_bloquear_usuario(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text;
begin
  perform public.admin_validar_acesso();

  if p_user_id = auth.uid() then
    raise exception 'Nao e permitido bloquear o proprio usuario.';
  end if;

  select users.email::text
  into v_email
  from auth.users
  where users.id = p_user_id;

  if v_email is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  insert into public.perfis (
    user_id,
    email,
    role,
    tipo_acesso,
    status
  )
  values (
    p_user_id,
    v_email,
    'user',
    'bloqueado',
    'inativo'
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    tipo_acesso = 'bloqueado',
    status = 'inativo';
end;
$$;

create or replace function public.admin_liberar_beta(p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text;
begin
  perform public.admin_validar_acesso();

  select users.email::text
  into v_email
  from auth.users
  where users.id = p_user_id;

  if v_email is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  insert into public.perfis (
    user_id,
    email,
    role,
    tipo_acesso,
    status
  )
  values (
    p_user_id,
    v_email,
    'user',
    'beta',
    'ativo'
  )
  on conflict (user_id) do update
  set
    email = excluded.email,
    role = case when perfis.role = 'admin' then 'admin' else 'user' end,
    tipo_acesso = 'beta',
    status = 'ativo';
end;
$$;

create or replace function public.admin_liberar_assinante(
  p_user_id uuid,
  p_plano text,
  p_data_inicio date,
  p_data_vencimento date
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  perform public.admin_validar_acesso();

  perform public.admin_atualizar_perfil(
    p_user_id,
    coalesce((select perfis.nome from public.perfis where perfis.user_id = p_user_id), ''),
    'user',
    'assinante',
    'ativo'
  );

  perform public.admin_upsert_assinatura(
    p_user_id,
    p_plano,
    'ativo',
    p_data_inicio,
    p_data_vencimento
  );
end;
$$;

revoke all on function public.admin_eh_admin() from public;
revoke all on function public.admin_validar_acesso() from public;
revoke all on function public.admin_listar_usuarios() from public;
revoke all on function public.admin_atualizar_perfil(uuid, text, text, text, text) from public;
revoke all on function public.admin_upsert_assinatura(uuid, text, text, date, date) from public;
revoke all on function public.admin_bloquear_usuario(uuid) from public;
revoke all on function public.admin_liberar_beta(uuid) from public;
revoke all on function public.admin_liberar_assinante(uuid, text, date, date) from public;

grant execute on function public.admin_eh_admin() to authenticated;
grant execute on function public.admin_validar_acesso() to authenticated;
grant execute on function public.admin_listar_usuarios() to authenticated;
grant execute on function public.admin_atualizar_perfil(uuid, text, text, text, text) to authenticated;
grant execute on function public.admin_upsert_assinatura(uuid, text, text, date, date) to authenticated;
grant execute on function public.admin_bloquear_usuario(uuid) to authenticated;
grant execute on function public.admin_liberar_beta(uuid) to authenticated;
grant execute on function public.admin_liberar_assinante(uuid, text, date, date) to authenticated;
