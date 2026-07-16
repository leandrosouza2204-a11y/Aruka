


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."admin_atualizar_perfil"("p_user_id" "uuid", "p_nome" "text", "p_role" "text", "p_tipo_acesso" "text", "p_status" "text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
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


ALTER FUNCTION "public"."admin_atualizar_perfil"("p_user_id" "uuid", "p_nome" "text", "p_role" "text", "p_tipo_acesso" "text", "p_status" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_atualizar_perfil"("p_user_id" "uuid", "p_nome" "text", "p_role" "text", "p_tipo_acesso" "text", "p_status" "text", "p_user_agent" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
declare
  v_email text;
  v_antes jsonb;
  v_depois jsonb;
  v_acao text := 'alterar_perfil';
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

  select to_jsonb(perfis.*)
  into v_antes
  from public.perfis
  where perfis.user_id = p_user_id;

  if coalesce(v_antes->>'role', 'user') <> 'admin' and p_role = 'admin' then
    v_acao := 'tornar_admin';
  elsif coalesce(v_antes->>'role', 'user') = 'admin' and p_role <> 'admin' then
    v_acao := 'remover_admin';
  elsif coalesce(v_antes->>'status', 'ativo') = 'inativo' and p_status = 'ativo' then
    v_acao := 'reativar_usuario';
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

  select to_jsonb(perfis.*)
  into v_depois
  from public.perfis
  where perfis.user_id = p_user_id;

  perform public.admin_registrar_log(
    p_user_id,
    v_acao,
    'perfis',
    (v_depois->>'id')::uuid,
    v_antes,
    v_depois,
    p_user_agent
  );
end;
$$;


ALTER FUNCTION "public"."admin_atualizar_perfil"("p_user_id" "uuid", "p_nome" "text", "p_role" "text", "p_tipo_acesso" "text", "p_status" "text", "p_user_agent" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_bloquear_usuario"("p_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
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


ALTER FUNCTION "public"."admin_bloquear_usuario"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_bloquear_usuario"("p_user_id" "uuid", "p_user_agent" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
declare
  v_email text;
  v_antes jsonb;
  v_depois jsonb;
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

  select to_jsonb(perfis.*)
  into v_antes
  from public.perfis
  where perfis.user_id = p_user_id;

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

  select to_jsonb(perfis.*)
  into v_depois
  from public.perfis
  where perfis.user_id = p_user_id;

  perform public.admin_registrar_log(
    p_user_id,
    'bloquear_usuario',
    'perfis',
    (v_depois->>'id')::uuid,
    v_antes,
    v_depois,
    p_user_agent
  );
end;
$$;


ALTER FUNCTION "public"."admin_bloquear_usuario"("p_user_id" "uuid", "p_user_agent" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_eh_admin"() RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1
    from public.perfis
    where perfis.user_id = auth.uid()
      and perfis.status = 'ativo'
      and (perfis.role = 'admin' or perfis.tipo_acesso = 'admin')
  );
$$;


ALTER FUNCTION "public"."admin_eh_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_liberar_assinante"("p_user_id" "uuid", "p_plano" "text", "p_data_inicio" "date", "p_data_vencimento" "date") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
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


ALTER FUNCTION "public"."admin_liberar_assinante"("p_user_id" "uuid", "p_plano" "text", "p_data_inicio" "date", "p_data_vencimento" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_liberar_assinante"("p_user_id" "uuid", "p_plano" "text", "p_data_inicio" "date", "p_data_vencimento" "date", "p_user_agent" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
declare
  v_antes jsonb;
  v_depois jsonb;
begin
  perform public.admin_validar_acesso();

  select jsonb_build_object(
    'perfil', to_jsonb(perfis.*),
    'assinatura', to_jsonb(assinaturas.*)
  )
  into v_antes
  from auth.users
  left join public.perfis on perfis.user_id = users.id
  left join lateral (
    select *
    from public.assinaturas
    where assinaturas.user_id = users.id
    order by assinaturas.created_at desc
    limit 1
  ) assinaturas on true
  where users.id = p_user_id;

  perform public.admin_atualizar_perfil(
    p_user_id,
    coalesce((select perfis.nome from public.perfis where perfis.user_id = p_user_id), ''),
    'user',
    'assinante',
    'ativo',
    p_user_agent
  );

  perform public.admin_upsert_assinatura(
    p_user_id,
    p_plano,
    'ativo',
    p_data_inicio,
    p_data_vencimento,
    p_user_agent
  );

  select jsonb_build_object(
    'perfil', to_jsonb(perfis.*),
    'assinatura', to_jsonb(assinaturas.*)
  )
  into v_depois
  from auth.users
  left join public.perfis on perfis.user_id = users.id
  left join lateral (
    select *
    from public.assinaturas
    where assinaturas.user_id = users.id
    order by assinaturas.created_at desc
    limit 1
  ) assinaturas on true
  where users.id = p_user_id;

  perform public.admin_registrar_log(
    p_user_id,
    'liberar_assinante',
    'assinaturas',
    null,
    v_antes,
    v_depois,
    p_user_agent
  );
end;
$$;


ALTER FUNCTION "public"."admin_liberar_assinante"("p_user_id" "uuid", "p_plano" "text", "p_data_inicio" "date", "p_data_vencimento" "date", "p_user_agent" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_liberar_beta"("p_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
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


ALTER FUNCTION "public"."admin_liberar_beta"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_liberar_beta"("p_user_id" "uuid", "p_user_agent" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
declare
  v_email text;
  v_antes jsonb;
  v_depois jsonb;
begin
  perform public.admin_validar_acesso();

  select users.email::text
  into v_email
  from auth.users
  where users.id = p_user_id;

  if v_email is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  select to_jsonb(perfis.*)
  into v_antes
  from public.perfis
  where perfis.user_id = p_user_id;

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

  select to_jsonb(perfis.*)
  into v_depois
  from public.perfis
  where perfis.user_id = p_user_id;

  perform public.admin_registrar_log(
    p_user_id,
    'liberar_usuario_beta',
    'perfis',
    (v_depois->>'id')::uuid,
    v_antes,
    v_depois,
    p_user_agent
  );
end;
$$;


ALTER FUNCTION "public"."admin_liberar_beta"("p_user_id" "uuid", "p_user_agent" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_listar_logs"("p_acao" "text" DEFAULT NULL::"text", "p_target_user_id" "uuid" DEFAULT NULL::"uuid", "p_data_inicio" "date" DEFAULT NULL::"date", "p_data_fim" "date" DEFAULT NULL::"date", "p_busca" "text" DEFAULT NULL::"text") RETURNS TABLE("id" "uuid", "admin_user_id" "uuid", "admin_email" "text", "admin_nome" "text", "target_user_id" "uuid", "target_email" "text", "target_nome" "text", "acao" "text", "entidade" "text", "entidade_id" "uuid", "dados_anteriores" "jsonb", "dados_novos" "jsonb", "ip" "text", "user_agent" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
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


ALTER FUNCTION "public"."admin_listar_logs"("p_acao" "text", "p_target_user_id" "uuid", "p_data_inicio" "date", "p_data_fim" "date", "p_busca" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_listar_usuarios"() RETURNS TABLE("user_id" "uuid", "email" "text", "created_at" timestamp with time zone, "nome" "text", "role" "text", "tipo_acesso" "text", "status" "text", "assinatura_plano" "text", "assinatura_status" "text", "data_inicio" "date", "data_vencimento" "date")
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
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


ALTER FUNCTION "public"."admin_listar_usuarios"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_registrar_log"("p_target_user_id" "uuid", "p_acao" "text", "p_entidade" "text" DEFAULT NULL::"text", "p_entidade_id" "uuid" DEFAULT NULL::"uuid", "p_dados_anteriores" "jsonb" DEFAULT NULL::"jsonb", "p_dados_novos" "jsonb" DEFAULT NULL::"jsonb", "p_user_agent" "text" DEFAULT NULL::"text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
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


ALTER FUNCTION "public"."admin_registrar_log"("p_target_user_id" "uuid", "p_acao" "text", "p_entidade" "text", "p_entidade_id" "uuid", "p_dados_anteriores" "jsonb", "p_dados_novos" "jsonb", "p_user_agent" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_upsert_assinatura"("p_user_id" "uuid", "p_plano" "text", "p_status" "text", "p_data_inicio" "date", "p_data_vencimento" "date") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
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


ALTER FUNCTION "public"."admin_upsert_assinatura"("p_user_id" "uuid", "p_plano" "text", "p_status" "text", "p_data_inicio" "date", "p_data_vencimento" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_upsert_assinatura"("p_user_id" "uuid", "p_plano" "text", "p_status" "text", "p_data_inicio" "date", "p_data_vencimento" "date", "p_user_agent" "text" DEFAULT NULL::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
declare
  v_assinatura_id uuid;
  v_antes jsonb;
  v_depois jsonb;
  v_acao text := 'alterar_assinatura';
begin
  perform public.admin_validar_acesso();

  if p_status not in ('pendente', 'ativo', 'vencido', 'cancelado', 'teste') then
    raise exception 'Status de assinatura invalido: %', p_status;
  end if;

  if not exists (select 1 from auth.users where users.id = p_user_id) then
    raise exception 'Usuario nao encontrado.';
  end if;

  select assinaturas.id, to_jsonb(assinaturas.*)
  into v_assinatura_id, v_antes
  from public.assinaturas
  where assinaturas.user_id = p_user_id
  order by assinaturas.created_at desc
  limit 1;

  if p_status = 'cancelado' then
    v_acao := 'cancelar_assinatura';
  end if;

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
    )
    returning assinaturas.id into v_assinatura_id;
  else
    update public.assinaturas
    set
      plano = coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'),
      status = p_status,
      data_inicio = p_data_inicio,
      data_vencimento = p_data_vencimento
    where assinaturas.id = v_assinatura_id;
  end if;

  select to_jsonb(assinaturas.*)
  into v_depois
  from public.assinaturas
  where assinaturas.id = v_assinatura_id;

  perform public.admin_registrar_log(
    p_user_id,
    v_acao,
    'assinaturas',
    v_assinatura_id,
    v_antes,
    v_depois,
    p_user_agent
  );
end;
$$;


ALTER FUNCTION "public"."admin_upsert_assinatura"("p_user_id" "uuid", "p_plano" "text", "p_status" "text", "p_data_inicio" "date", "p_data_vencimento" "date", "p_user_agent" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."admin_validar_acesso"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  if not public.admin_eh_admin() then
    raise exception 'Acesso negado: permissao de administrador necessaria.';
  end if;
end;
$$;


ALTER FUNCTION "public"."admin_validar_acesso"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."aoe_idempotency_get_or_create"("p_id" "text", "p_actor_id" "uuid", "p_organization_id" "uuid", "p_operation" "text", "p_idempotency_key" "text", "p_request_fingerprint" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_row public.aoe_idempotency_keys%rowtype;
  v_inserted integer := 0;
begin
  insert into public.aoe_idempotency_keys (
    id, actor_id, organization_id, operation, idempotency_key, request_fingerprint, status
  )
  values (
    p_id, p_actor_id, p_organization_id, p_operation, p_idempotency_key, p_request_fingerprint, 'PROCESSING'
  )
  on conflict on constraint aoe_idempotency_keys_pkey do nothing;

  get diagnostics v_inserted = row_count;

  select * into v_row
  from public.aoe_idempotency_keys
  where id = p_id
  for update;

  return jsonb_build_object('created', v_inserted > 0, 'record', to_jsonb(v_row));
end;
$$;


ALTER FUNCTION "public"."aoe_idempotency_get_or_create"("p_id" "text", "p_actor_id" "uuid", "p_organization_id" "uuid", "p_operation" "text", "p_idempotency_key" "text", "p_request_fingerprint" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."aoe_user_owns_student"("p_student_id" "uuid") RETURNS boolean
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1 from public.alunos
    where alunos.id = p_student_id
      and alunos.user_id = auth.uid()
  );
$$;


ALTER FUNCTION "public"."aoe_user_owns_student"("p_student_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."processar_encerramento_automatico_aluno"("p_user_id" "uuid", "p_aluno_id" "uuid", "p_vencimento" "date", "p_ocorrido_em" "date", "p_event_key" "text", "p_plano_id" "uuid" DEFAULT NULL::"uuid", "p_plano_nome" "text" DEFAULT ''::"text", "p_dias_apos_vencimento" integer DEFAULT 0, "p_status_anterior" "text" DEFAULT ''::"text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  v_aluno record;
  v_evento_id uuid;
begin
  if p_user_id is null
    or p_aluno_id is null
    or p_vencimento is null
    or p_ocorrido_em is null
    or nullif(trim(coalesce(p_event_key, '')), '') is null then
    return jsonb_build_object('ok', false, 'status', 'invalid_payload');
  end if;

  select
    id,
    user_id,
    vencimento,
    acompanhamento_status
  into v_aluno
  from public.alunos
  where id = p_aluno_id
    and user_id = p_user_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'status', 'aluno_nao_encontrado');
  end if;

  if v_aluno.vencimento is distinct from p_vencimento then
    return jsonb_build_object('ok', false, 'status', 'vencimento_alterado');
  end if;

  if coalesce(v_aluno.acompanhamento_status, 'ativo') in ('nao_renovado', 'cancelado', 'encerrado') then
    return jsonb_build_object('ok', false, 'status', 'ja_encerrado_manual_ou_processado');
  end if;

  update public.alunos
  set
    acompanhamento_status = 'encerrado',
    acompanhamento_encerrado_em = p_ocorrido_em,
    acompanhamento_motivo = 'vencimento_sem_renovacao',
    acompanhamento_motivo_detalhe = ''
  where id = p_aluno_id
    and user_id = p_user_id;

  begin
    insert into public.acompanhamento_eventos (
      user_id,
      aluno_id,
      tipo,
      ocorrido_em,
      motivo,
      motivo_detalhe,
      plano_id,
      plano_nome,
      vencimento_anterior,
      vencimento_novo,
      metadata,
      event_key
    )
    values (
      p_user_id,
      p_aluno_id,
      'acompanhamento_encerrado',
      p_ocorrido_em::timestamptz,
      'vencimento_sem_renovacao',
      null,
      p_plano_id,
      nullif(trim(coalesce(p_plano_nome, '')), ''),
      p_vencimento,
      null,
      jsonb_build_object(
        'origem', 'automatico_90_dias',
        'dias_apos_vencimento', greatest(coalesce(p_dias_apos_vencimento, 0), 0),
        'status_anterior', coalesce(nullif(trim(p_status_anterior), ''), 'ativo')
      ),
      p_event_key
    )
    returning id into v_evento_id;
  exception
    when unique_violation then
      return jsonb_build_object(
        'ok', true,
        'status', 'duplicado',
        'duplicate', true,
        'event_key', p_event_key
      );
  end;

  return jsonb_build_object(
    'ok', true,
    'status', 'processado',
    'duplicate', false,
    'evento_id', v_evento_id,
    'event_key', p_event_key
  );
end;
$$;


ALTER FUNCTION "public"."processar_encerramento_automatico_aluno"("p_user_id" "uuid", "p_aluno_id" "uuid", "p_vencimento" "date", "p_ocorrido_em" "date", "p_event_key" "text", "p_plano_id" "uuid", "p_plano_nome" "text", "p_dias_apos_vencimento" integer, "p_status_anterior" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_workout_templates_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."set_workout_templates_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."aceites_legais" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "politica_versao" "text" NOT NULL,
    "termos_versao" "text" NOT NULL,
    "politica_aceita" boolean DEFAULT false NOT NULL,
    "termos_aceitos" boolean DEFAULT false NOT NULL,
    "aceito_em" timestamp with time zone,
    "ip" "text",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."aceites_legais" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."acompanhamento_eventos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "aluno_id" "uuid" NOT NULL,
    "tipo" "text" NOT NULL,
    "ocorrido_em" timestamp with time zone DEFAULT "now"() NOT NULL,
    "motivo" "text",
    "motivo_detalhe" "text",
    "plano_id" "uuid",
    "plano_nome" "text",
    "vencimento_anterior" "date",
    "vencimento_novo" "date",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "event_key" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "acompanhamento_eventos_tipo_check" CHECK (("tipo" = ANY (ARRAY['acompanhamento_iniciado'::"text", 'acompanhamento_encerrado'::"text", 'acompanhamento_reativado'::"text", 'plano_renovado'::"text"])))
);


ALTER TABLE "public"."acompanhamento_eventos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."admin_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "admin_user_id" "uuid",
    "target_user_id" "uuid",
    "acao" "text" NOT NULL,
    "entidade" "text",
    "entidade_id" "uuid",
    "dados_anteriores" "jsonb",
    "dados_novos" "jsonb",
    "ip" "text",
    "user_agent" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."admin_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."alunos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "nome" "text" NOT NULL,
    "whatsapp" "text",
    "nascimento" "date",
    "inicio" "date",
    "vencimento" "date",
    "aviso7" "date",
    "aviso1" "date",
    "plano" "text",
    "valor" numeric,
    "status" "text" DEFAULT 'Ativo'::"text",
    "pagamento_recebido" boolean DEFAULT false,
    "data_pagamento" "date",
    "observacoes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "acompanhamento_status" "text" DEFAULT 'ativo'::"text" NOT NULL,
    "acompanhamento_encerrado_em" "date",
    "acompanhamento_motivo" "text" DEFAULT ''::"text" NOT NULL,
    "acompanhamento_motivo_detalhe" "text" DEFAULT ''::"text" NOT NULL,
    CONSTRAINT "alunos_acompanhamento_status_check" CHECK (("acompanhamento_status" = ANY (ARRAY['ativo'::"text", 'nao_renovado'::"text", 'cancelado'::"text", 'encerrado'::"text"])))
);


ALTER TABLE "public"."alunos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."anamneses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "aluno_id" "uuid" NOT NULL,
    "profissao" "text" DEFAULT ''::"text" NOT NULL,
    "rotina_trabalho" "text" DEFAULT ''::"text" NOT NULL,
    "objetivo_principal" "text" DEFAULT ''::"text" NOT NULL,
    "objetivo_secundario" "text" DEFAULT ''::"text" NOT NULL,
    "doenca_diagnosticada" "text" DEFAULT ''::"text" NOT NULL,
    "usa_medicamento" "text" DEFAULT ''::"text" NOT NULL,
    "dores_lesoes" "text" DEFAULT ''::"text" NOT NULL,
    "cirurgia" "text" DEFAULT ''::"text" NOT NULL,
    "restricao_medica" "text" DEFAULT ''::"text" NOT NULL,
    "liberado_exercicio" "text" DEFAULT ''::"text" NOT NULL,
    "experiencia_musculacao" "text" DEFAULT ''::"text" NOT NULL,
    "frequencia_semanal" "text" DEFAULT ''::"text" NOT NULL,
    "dias_disponiveis" "text" DEFAULT ''::"text" NOT NULL,
    "tempo_treino" "text" DEFAULT ''::"text" NOT NULL,
    "local_treino" "text" DEFAULT ''::"text" NOT NULL,
    "equipamentos" "text" DEFAULT ''::"text" NOT NULL,
    "sono" "text" DEFAULT ''::"text" NOT NULL,
    "horas_sono" "text" DEFAULT ''::"text" NOT NULL,
    "estresse" "text" DEFAULT ''::"text" NOT NULL,
    "agua" "text" DEFAULT ''::"text" NOT NULL,
    "alcool" "text" DEFAULT ''::"text" NOT NULL,
    "tabagismo" "text" DEFAULT ''::"text" NOT NULL,
    "dieta" "text" DEFAULT ''::"text" NOT NULL,
    "nutricionista" "text" DEFAULT ''::"text" NOT NULL,
    "refeicoes_dia" "text" DEFAULT ''::"text" NOT NULL,
    "dificuldade_alimentacao" "text" DEFAULT ''::"text" NOT NULL,
    "fome_noite" "text" DEFAULT ''::"text" NOT NULL,
    "compulsao" "text" DEFAULT ''::"text" NOT NULL,
    "exercicios_gosta" "text" DEFAULT ''::"text" NOT NULL,
    "exercicios_nao_gosta" "text" DEFAULT ''::"text" NOT NULL,
    "grupos_prioritarios" "text" DEFAULT ''::"text" NOT NULL,
    "limitacoes_horario" "text" DEFAULT ''::"text" NOT NULL,
    "observacoes" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "escala_sono" "text" DEFAULT ''::"text" NOT NULL,
    "escala_estresse" "text" DEFAULT ''::"text" NOT NULL,
    "escala_energia" "text" DEFAULT ''::"text" NOT NULL,
    "escala_fome" "text" DEFAULT ''::"text" NOT NULL,
    "escala_motivacao" "text" DEFAULT ''::"text" NOT NULL,
    "escala_adesao_rotina" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."anamneses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."aoe_audit_events" (
    "id" "text" NOT NULL,
    "event_type" "text" NOT NULL,
    "actor_id" "uuid",
    "actor_role" "text",
    "organization_id" "uuid",
    "resource_type" "text",
    "resource_id" "text",
    "request_id" "text",
    "correlation_id" "text",
    "outcome" "text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "versions" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "occurred_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."aoe_audit_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."aoe_decision_traces" (
    "id" "text" NOT NULL,
    "decision_id" "text" NOT NULL,
    "organization_id" "uuid",
    "trace_version" "text" NOT NULL,
    "trace_payload" "jsonb" NOT NULL,
    "redaction_version" "text" DEFAULT '1.0.0'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."aoe_decision_traces" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."aoe_decisions" (
    "id" "text" NOT NULL,
    "request_id" "text" NOT NULL,
    "actor_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL,
    "organization_id" "uuid",
    "status" "text" NOT NULL,
    "selected_model_code" "text",
    "selected_model_version" "text",
    "selected_apl_release" "text",
    "alternatives" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "compatibility_score" numeric,
    "raw_score" numeric,
    "confidence_score" numeric,
    "confidence_level" "text",
    "risk_score" numeric,
    "risk_level" "text",
    "ambiguity_level" "text",
    "warnings" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "reason_codes" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "human_review_required" boolean DEFAULT false NOT NULL,
    "human_review_id" "text",
    "versions" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "public_response" "jsonb" NOT NULL,
    "trace_reference" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."aoe_decisions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."aoe_human_reviews" (
    "id" "text" NOT NULL,
    "decision_id" "text" NOT NULL,
    "organization_id" "uuid",
    "status" "text" NOT NULL,
    "required" boolean DEFAULT true NOT NULL,
    "blocking" boolean DEFAULT false NOT NULL,
    "reason_codes" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "checklist" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "reviewer_id" "uuid",
    "reviewer_role" "text",
    "adjustments" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "notes" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "completed_at" timestamp with time zone,
    CONSTRAINT "aoe_human_reviews_notes_length" CHECK (("char_length"("notes") <= 500))
);


ALTER TABLE "public"."aoe_human_reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."aoe_idempotency_keys" (
    "id" "text" NOT NULL,
    "actor_id" "uuid" NOT NULL,
    "organization_id" "uuid",
    "operation" "text" NOT NULL,
    "idempotency_key" "text" NOT NULL,
    "request_fingerprint" "text" NOT NULL,
    "status" "text" NOT NULL,
    "decision_id" "text",
    "response_payload" "jsonb",
    "error_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone
);


ALTER TABLE "public"."aoe_idempotency_keys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."assinaturas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "plano" "text" NOT NULL,
    "status" "text" DEFAULT 'pendente'::"text" NOT NULL,
    "data_inicio" "date",
    "data_vencimento" "date",
    "pagamento_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "assinaturas_status_check" CHECK (("status" = ANY (ARRAY['pendente'::"text", 'ativo'::"text", 'vencido'::"text", 'cancelado'::"text", 'teste'::"text"])))
);


ALTER TABLE "public"."assinaturas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."avaliacoes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "aluno_id" "uuid" NOT NULL,
    "data_avaliacao" "date" NOT NULL,
    "idade" numeric(5,1),
    "sexo" "text",
    "altura" numeric(6,2),
    "peso" numeric(6,2),
    "pescoco" numeric(6,2),
    "ombro" numeric(6,2),
    "torax" numeric(6,2),
    "cintura" numeric(6,2),
    "abdomen" numeric(6,2),
    "quadril" numeric(6,2),
    "braco_direito" numeric(6,2),
    "braco_esquerdo" numeric(6,2),
    "antebraco_direito" numeric(6,2),
    "antebraco_esquerdo" numeric(6,2),
    "coxa_direita" numeric(6,2),
    "coxa_esquerda" numeric(6,2),
    "panturrilha_direita" numeric(6,2),
    "panturrilha_esquerda" numeric(6,2),
    "percentual_gordura" numeric(6,2),
    "percentual_massa_magra" numeric(6,2),
    "massa_gorda" numeric(6,2),
    "massa_magra" numeric(6,2),
    "imc" numeric(6,2),
    "observacoes" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "dobra_peitoral" numeric(6,2),
    "dobra_abdominal" numeric(6,2),
    "dobra_coxa" numeric(6,2),
    "dobra_triceps" numeric(6,2),
    "dobra_subescapular" numeric(6,2),
    "dobra_supra_iliaca" numeric(6,2),
    "dobra_axilar_media" numeric(6,2),
    "status" "text" DEFAULT 'inicial'::"text" NOT NULL,
    "objetivo_atual" "text" DEFAULT ''::"text" NOT NULL,
    "aderencia_treino" "text" DEFAULT ''::"text" NOT NULL,
    "aderencia_dieta" "text" DEFAULT ''::"text" NOT NULL,
    "foto_frente_url" "text",
    "foto_lateral_url" "text",
    "foto_costas_url" "text"
);


ALTER TABLE "public"."avaliacoes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pagamentos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "aluno_id" "uuid" NOT NULL,
    "data_pagamento" "date" NOT NULL,
    "valor" numeric(10,2) DEFAULT 0 NOT NULL,
    "forma_pagamento" "text" DEFAULT ''::"text" NOT NULL,
    "parcela" "text" DEFAULT '1'::"text" NOT NULL,
    "total_parcelas" integer DEFAULT 1 NOT NULL,
    "observacoes" "text" DEFAULT ''::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "plano" "text" DEFAULT ''::"text" NOT NULL,
    "vencimento_anterior" "date",
    "vencimento_novo" "date",
    "observacao" "text" DEFAULT ''::"text" NOT NULL,
    "tipo_movimento" "text" DEFAULT 'pagamento_avulso'::"text" NOT NULL,
    "vencimento_parcela" "date"
);


ALTER TABLE "public"."pagamentos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."perfis" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "nome" "text",
    "email" "text",
    "role" "text" DEFAULT 'user'::"text" NOT NULL,
    "tipo_acesso" "text" DEFAULT 'pendente'::"text" NOT NULL,
    "status" "text" DEFAULT 'ativo'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "perfis_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'user'::"text"]))),
    CONSTRAINT "perfis_status_check" CHECK (("status" = ANY (ARRAY['ativo'::"text", 'inativo'::"text"]))),
    CONSTRAINT "perfis_tipo_acesso_check" CHECK (("tipo_acesso" = ANY (ARRAY['admin'::"text", 'beta'::"text", 'assinante'::"text", 'pendente'::"text", 'bloqueado'::"text"])))
);


ALTER TABLE "public"."perfis" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."planos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "nome" "text" NOT NULL,
    "descricao" "text" DEFAULT ''::"text" NOT NULL,
    "duracao_meses" integer DEFAULT 1 NOT NULL,
    "valor" numeric(10,2) DEFAULT 0 NOT NULL,
    "ativo" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "permite_parcelamento" boolean DEFAULT false NOT NULL,
    "quantidade_parcelas" integer DEFAULT 1 NOT NULL,
    "valor_parcela" numeric(10,2) DEFAULT 0 NOT NULL,
    "intervalo_parcelas_meses" integer DEFAULT 1 NOT NULL
);


ALTER TABLE "public"."planos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."treino_dias" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "treino_id" "uuid" NOT NULL,
    "nome" "text" NOT NULL,
    "grupo_muscular" "text" DEFAULT ''::"text" NOT NULL,
    "ordem" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."treino_dias" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."treino_exercicios" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "treino_dia_id" "uuid" NOT NULL,
    "nome" "text" NOT NULL,
    "series" "text" DEFAULT ''::"text" NOT NULL,
    "repeticoes" "text" DEFAULT ''::"text" NOT NULL,
    "carga" "text" DEFAULT ''::"text" NOT NULL,
    "descanso" "text" DEFAULT ''::"text" NOT NULL,
    "observacoes" "text" DEFAULT ''::"text" NOT NULL,
    "video_url" "text" DEFAULT ''::"text" NOT NULL,
    "ordem" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."treino_exercicios" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."treinos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "aluno_id" "uuid" NOT NULL,
    "nome_rotina" "text" NOT NULL,
    "objetivo" "text" DEFAULT ''::"text" NOT NULL,
    "nivel" "text" DEFAULT ''::"text" NOT NULL,
    "dias_semana" integer DEFAULT 0 NOT NULL,
    "observacoes" "text" DEFAULT ''::"text" NOT NULL,
    "status" "text" DEFAULT 'Ativo'::"text" NOT NULL,
    "data_inicio" "date",
    "data_revisao" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."treinos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "owner_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "reference_gender" "text" DEFAULT 'Unissex'::"text" NOT NULL,
    "split_type" "text" DEFAULT 'Outro'::"text" NOT NULL,
    "objective" "text" DEFAULT ''::"text" NOT NULL,
    "level" "text" DEFAULT ''::"text" NOT NULL,
    "description" "text" DEFAULT ''::"text" NOT NULL,
    "template_data" "jsonb" NOT NULL,
    "is_system" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "workout_templates_gender_check" CHECK (("reference_gender" = ANY (ARRAY['Masculino'::"text", 'Feminino'::"text", 'Unissex'::"text"]))),
    CONSTRAINT "workout_templates_name_required" CHECK (("length"("btrim"("name")) > 0)),
    CONSTRAINT "workout_templates_personal_only" CHECK (("is_system" = false)),
    CONSTRAINT "workout_templates_split_check" CHECK (("split_type" = ANY (ARRAY['ABC'::"text", 'ABCD'::"text", 'ABCDE'::"text", 'Full Body'::"text", 'Upper/Lower'::"text", 'Outro'::"text"]))),
    CONSTRAINT "workout_templates_template_data_object" CHECK (("jsonb_typeof"("template_data") = 'object'::"text"))
);


ALTER TABLE "public"."workout_templates" OWNER TO "postgres";


ALTER TABLE ONLY "public"."aceites_legais"
    ADD CONSTRAINT "aceites_legais_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."aceites_legais"
    ADD CONSTRAINT "aceites_legais_versao_unica" UNIQUE ("user_id", "politica_versao", "termos_versao");



ALTER TABLE ONLY "public"."acompanhamento_eventos"
    ADD CONSTRAINT "acompanhamento_eventos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_logs"
    ADD CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."alunos"
    ADD CONSTRAINT "alunos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."anamneses"
    ADD CONSTRAINT "anamneses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."aoe_audit_events"
    ADD CONSTRAINT "aoe_audit_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."aoe_decision_traces"
    ADD CONSTRAINT "aoe_decision_traces_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."aoe_decisions"
    ADD CONSTRAINT "aoe_decisions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."aoe_human_reviews"
    ADD CONSTRAINT "aoe_human_reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."aoe_idempotency_keys"
    ADD CONSTRAINT "aoe_idempotency_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."assinaturas"
    ADD CONSTRAINT "assinaturas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."avaliacoes"
    ADD CONSTRAINT "avaliacoes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pagamentos"
    ADD CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."perfis"
    ADD CONSTRAINT "perfis_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."perfis"
    ADD CONSTRAINT "perfis_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."planos"
    ADD CONSTRAINT "planos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."treino_dias"
    ADD CONSTRAINT "treino_dias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."treino_exercicios"
    ADD CONSTRAINT "treino_exercicios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."treinos"
    ADD CONSTRAINT "treinos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_templates"
    ADD CONSTRAINT "workout_templates_pkey" PRIMARY KEY ("id");



CREATE INDEX "aceites_legais_aceito_em_idx" ON "public"."aceites_legais" USING "btree" ("aceito_em");



CREATE INDEX "aceites_legais_user_id_idx" ON "public"."aceites_legais" USING "btree" ("user_id");



CREATE INDEX "aceites_legais_versoes_idx" ON "public"."aceites_legais" USING "btree" ("politica_versao", "termos_versao");



CREATE INDEX "acompanhamento_eventos_aluno_id_idx" ON "public"."acompanhamento_eventos" USING "btree" ("aluno_id");



CREATE INDEX "acompanhamento_eventos_ocorrido_em_idx" ON "public"."acompanhamento_eventos" USING "btree" ("ocorrido_em" DESC);



CREATE INDEX "acompanhamento_eventos_user_aluno_ocorrido_idx" ON "public"."acompanhamento_eventos" USING "btree" ("user_id", "aluno_id", "ocorrido_em" DESC);



CREATE UNIQUE INDEX "acompanhamento_eventos_user_event_key_uidx" ON "public"."acompanhamento_eventos" USING "btree" ("user_id", "event_key") WHERE ("event_key" IS NOT NULL);



CREATE INDEX "acompanhamento_eventos_user_id_idx" ON "public"."acompanhamento_eventos" USING "btree" ("user_id");



CREATE INDEX "admin_logs_acao_idx" ON "public"."admin_logs" USING "btree" ("acao");



CREATE INDEX "admin_logs_admin_user_id_idx" ON "public"."admin_logs" USING "btree" ("admin_user_id");



CREATE INDEX "admin_logs_created_at_idx" ON "public"."admin_logs" USING "btree" ("created_at" DESC);



CREATE INDEX "admin_logs_target_user_id_idx" ON "public"."admin_logs" USING "btree" ("target_user_id");



CREATE INDEX "alunos_user_acompanhamento_status_idx" ON "public"."alunos" USING "btree" ("user_id", "acompanhamento_status");



CREATE INDEX "alunos_user_vencimento_idx" ON "public"."alunos" USING "btree" ("user_id", "vencimento");



CREATE INDEX "anamneses_aluno_id_idx" ON "public"."anamneses" USING "btree" ("aluno_id");



CREATE INDEX "anamneses_user_created_at_idx" ON "public"."anamneses" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "anamneses_user_id_idx" ON "public"."anamneses" USING "btree" ("user_id");



CREATE INDEX "aoe_audit_org_event_date_idx" ON "public"."aoe_audit_events" USING "btree" ("organization_id", "event_type", "occurred_at" DESC);



CREATE INDEX "aoe_decisions_actor_idx" ON "public"."aoe_decisions" USING "btree" ("actor_id");



CREATE INDEX "aoe_decisions_model_idx" ON "public"."aoe_decisions" USING "btree" ("selected_model_code");



CREATE INDEX "aoe_decisions_org_idx" ON "public"."aoe_decisions" USING "btree" ("organization_id");



CREATE INDEX "aoe_decisions_request_idx" ON "public"."aoe_decisions" USING "btree" ("request_id");



CREATE INDEX "aoe_decisions_student_idx" ON "public"."aoe_decisions" USING "btree" ("student_id");



CREATE UNIQUE INDEX "aoe_human_reviews_one_active_per_decision" ON "public"."aoe_human_reviews" USING "btree" ("decision_id");



CREATE INDEX "aoe_idempotency_expires_idx" ON "public"."aoe_idempotency_keys" USING "btree" ("expires_at");



CREATE UNIQUE INDEX "aoe_idempotency_unique_key" ON "public"."aoe_idempotency_keys" USING "btree" (COALESCE("organization_id", '00000000-0000-0000-0000-000000000000'::"uuid"), "actor_id", "operation", "idempotency_key");



CREATE INDEX "aoe_reviews_decision_idx" ON "public"."aoe_human_reviews" USING "btree" ("decision_id");



CREATE INDEX "aoe_traces_decision_idx" ON "public"."aoe_decision_traces" USING "btree" ("decision_id");



CREATE INDEX "assinaturas_data_vencimento_idx" ON "public"."assinaturas" USING "btree" ("data_vencimento");



CREATE INDEX "assinaturas_status_idx" ON "public"."assinaturas" USING "btree" ("status");



CREATE INDEX "assinaturas_user_created_at_idx" ON "public"."assinaturas" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "assinaturas_user_id_idx" ON "public"."assinaturas" USING "btree" ("user_id");



CREATE INDEX "assinaturas_user_status_vencimento_idx" ON "public"."assinaturas" USING "btree" ("user_id", "status", "data_vencimento");



CREATE INDEX "avaliacoes_aluno_id_idx" ON "public"."avaliacoes" USING "btree" ("aluno_id");



CREATE INDEX "avaliacoes_data_idx" ON "public"."avaliacoes" USING "btree" ("data_avaliacao");



CREATE INDEX "avaliacoes_user_data_idx" ON "public"."avaliacoes" USING "btree" ("user_id", "data_avaliacao" DESC);



CREATE INDEX "avaliacoes_user_id_idx" ON "public"."avaliacoes" USING "btree" ("user_id");



CREATE INDEX "pagamentos_aluno_id_idx" ON "public"."pagamentos" USING "btree" ("aluno_id");



CREATE INDEX "pagamentos_data_pagamento_idx" ON "public"."pagamentos" USING "btree" ("data_pagamento");



CREATE INDEX "pagamentos_user_aluno_data_idx" ON "public"."pagamentos" USING "btree" ("user_id", "aluno_id", "data_pagamento" DESC, "created_at" DESC);



CREATE INDEX "pagamentos_user_id_idx" ON "public"."pagamentos" USING "btree" ("user_id");



CREATE INDEX "perfis_status_idx" ON "public"."perfis" USING "btree" ("status");



CREATE INDEX "perfis_tipo_acesso_idx" ON "public"."perfis" USING "btree" ("tipo_acesso");



CREATE INDEX "perfis_user_id_idx" ON "public"."perfis" USING "btree" ("user_id");



CREATE INDEX "planos_ativo_idx" ON "public"."planos" USING "btree" ("ativo");



CREATE INDEX "planos_user_ativo_idx" ON "public"."planos" USING "btree" ("user_id", "ativo");



CREATE INDEX "planos_user_id_idx" ON "public"."planos" USING "btree" ("user_id");



CREATE UNIQUE INDEX "planos_user_nome_normalizado_unique_idx" ON "public"."planos" USING "btree" ("user_id", "lower"("regexp_replace"(TRIM(BOTH FROM "nome"), '\s+'::"text", ' '::"text", 'g'::"text")));



CREATE INDEX "treino_dias_treino_id_idx" ON "public"."treino_dias" USING "btree" ("treino_id");



CREATE INDEX "treino_exercicios_treino_dia_id_idx" ON "public"."treino_exercicios" USING "btree" ("treino_dia_id");



CREATE INDEX "treinos_aluno_id_idx" ON "public"."treinos" USING "btree" ("aluno_id");



CREATE INDEX "treinos_user_created_at_idx" ON "public"."treinos" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "treinos_user_id_idx" ON "public"."treinos" USING "btree" ("user_id");



CREATE INDEX "workout_templates_owner_id_idx" ON "public"."workout_templates" USING "btree" ("owner_id");



CREATE INDEX "workout_templates_owner_split_idx" ON "public"."workout_templates" USING "btree" ("owner_id", "split_type");



CREATE INDEX "workout_templates_owner_updated_idx" ON "public"."workout_templates" USING "btree" ("owner_id", "updated_at" DESC);



CREATE OR REPLACE TRIGGER "set_workout_templates_updated_at" BEFORE UPDATE ON "public"."workout_templates" FOR EACH ROW EXECUTE FUNCTION "public"."set_workout_templates_updated_at"();



ALTER TABLE ONLY "public"."aceites_legais"
    ADD CONSTRAINT "aceites_legais_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."acompanhamento_eventos"
    ADD CONSTRAINT "acompanhamento_eventos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunos"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."acompanhamento_eventos"
    ADD CONSTRAINT "acompanhamento_eventos_plano_id_fkey" FOREIGN KEY ("plano_id") REFERENCES "public"."planos"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."acompanhamento_eventos"
    ADD CONSTRAINT "acompanhamento_eventos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."admin_logs"
    ADD CONSTRAINT "admin_logs_admin_user_id_fkey" FOREIGN KEY ("admin_user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."admin_logs"
    ADD CONSTRAINT "admin_logs_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."alunos"
    ADD CONSTRAINT "alunos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."anamneses"
    ADD CONSTRAINT "anamneses_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."anamneses"
    ADD CONSTRAINT "anamneses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."aoe_decision_traces"
    ADD CONSTRAINT "aoe_decision_traces_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "public"."aoe_decisions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."aoe_decisions"
    ADD CONSTRAINT "aoe_decisions_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."aoe_decisions"
    ADD CONSTRAINT "aoe_decisions_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."alunos"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."aoe_human_reviews"
    ADD CONSTRAINT "aoe_human_reviews_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "public"."aoe_decisions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."aoe_human_reviews"
    ADD CONSTRAINT "aoe_human_reviews_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."aoe_idempotency_keys"
    ADD CONSTRAINT "aoe_idempotency_keys_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "auth"."users"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."aoe_idempotency_keys"
    ADD CONSTRAINT "aoe_idempotency_keys_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "public"."aoe_decisions"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."assinaturas"
    ADD CONSTRAINT "assinaturas_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."avaliacoes"
    ADD CONSTRAINT "avaliacoes_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."avaliacoes"
    ADD CONSTRAINT "avaliacoes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pagamentos"
    ADD CONSTRAINT "pagamentos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."pagamentos"
    ADD CONSTRAINT "pagamentos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfis"
    ADD CONSTRAINT "perfis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."planos"
    ADD CONSTRAINT "planos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."treino_dias"
    ADD CONSTRAINT "treino_dias_treino_id_fkey" FOREIGN KEY ("treino_id") REFERENCES "public"."treinos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."treino_exercicios"
    ADD CONSTRAINT "treino_exercicios_treino_dia_id_fkey" FOREIGN KEY ("treino_dia_id") REFERENCES "public"."treino_dias"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."treinos"
    ADD CONSTRAINT "treinos_aluno_id_fkey" FOREIGN KEY ("aluno_id") REFERENCES "public"."alunos"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."treinos"
    ADD CONSTRAINT "treinos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_templates"
    ADD CONSTRAINT "workout_templates_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins podem listar logs administrativos" ON "public"."admin_logs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."perfis"
  WHERE (("perfis"."user_id" = "auth"."uid"()) AND ("perfis"."status" = 'ativo'::"text") AND (("perfis"."role" = 'admin'::"text") OR ("perfis"."tipo_acesso" = 'admin'::"text"))))));



CREATE POLICY "Auditoria AOE somente admin leitura" ON "public"."aoe_audit_events" FOR SELECT USING ("public"."admin_eh_admin"());



CREATE POLICY "Idempotencia AOE restrita ao ator" ON "public"."aoe_idempotency_keys" USING ((("actor_id" = "auth"."uid"()) OR "public"."admin_eh_admin"())) WITH CHECK ((("actor_id" = "auth"."uid"()) OR "public"."admin_eh_admin"()));



CREATE POLICY "Traces AOE restritos ao profissional autorizado" ON "public"."aoe_decision_traces" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."aoe_decisions" "d"
  WHERE (("d"."id" = "aoe_decision_traces"."decision_id") AND (("d"."actor_id" = "auth"."uid"()) OR "public"."admin_eh_admin"())))));



CREATE POLICY "Usuarios comuns nao inserem logs administrativos" ON "public"."admin_logs" FOR INSERT WITH CHECK (false);



CREATE POLICY "Usuarios podem atualizar dias dos seus treinos" ON "public"."treino_dias" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."treinos"
  WHERE (("treinos"."id" = "treino_dias"."treino_id") AND ("treinos"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."treinos"
  WHERE (("treinos"."id" = "treino_dias"."treino_id") AND ("treinos"."user_id" = "auth"."uid"())))));



CREATE POLICY "Usuarios podem atualizar exercicios dos seus treinos" ON "public"."treino_exercicios" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM ("public"."treino_dias"
     JOIN "public"."treinos" ON (("treinos"."id" = "treino_dias"."treino_id")))
  WHERE (("treino_dias"."id" = "treino_exercicios"."treino_dia_id") AND ("treinos"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."treino_dias"
     JOIN "public"."treinos" ON (("treinos"."id" = "treino_dias"."treino_id")))
  WHERE (("treino_dias"."id" = "treino_exercicios"."treino_dia_id") AND ("treinos"."user_id" = "auth"."uid"())))));



CREATE POLICY "Usuarios podem atualizar reviews AOE autorizadas" ON "public"."aoe_human_reviews" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."aoe_decisions" "d"
  WHERE (("d"."id" = "aoe_human_reviews"."decision_id") AND ("d"."actor_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."aoe_decisions" "d"
  WHERE (("d"."id" = "aoe_human_reviews"."decision_id") AND ("d"."actor_id" = "auth"."uid"())))));



CREATE POLICY "Usuarios podem atualizar seus modelos de treino" ON "public"."workout_templates" FOR UPDATE USING ((("auth"."uid"() = "owner_id") AND ("is_system" = false))) WITH CHECK ((("auth"."uid"() = "owner_id") AND ("is_system" = false)));



CREATE POLICY "Usuarios podem atualizar seus pagamentos" ON "public"."pagamentos" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK ((("auth"."uid"() = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."alunos"
  WHERE (("alunos"."id" = "pagamentos"."aluno_id") AND ("alunos"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Usuarios podem atualizar seus planos" ON "public"."planos" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios podem atualizar seus treinos" ON "public"."treinos" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."alunos"
  WHERE (("alunos"."id" = "treinos"."aluno_id") AND ("alunos"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "Usuarios podem atualizar suas anamneses" ON "public"."anamneses" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."alunos"
  WHERE (("alunos"."id" = "anamneses"."aluno_id") AND ("alunos"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "Usuarios podem atualizar suas avaliacoes" ON "public"."avaliacoes" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."alunos"
  WHERE (("alunos"."id" = "avaliacoes"."aluno_id") AND ("alunos"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "Usuarios podem cadastrar dias dos seus treinos" ON "public"."treino_dias" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."treinos"
  WHERE (("treinos"."id" = "treino_dias"."treino_id") AND ("treinos"."user_id" = "auth"."uid"())))));



CREATE POLICY "Usuarios podem cadastrar exercicios dos seus treinos" ON "public"."treino_exercicios" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."treino_dias"
     JOIN "public"."treinos" ON (("treinos"."id" = "treino_dias"."treino_id")))
  WHERE (("treino_dias"."id" = "treino_exercicios"."treino_dia_id") AND ("treinos"."user_id" = "auth"."uid"())))));



CREATE POLICY "Usuarios podem cadastrar seus eventos de acompanhamento" ON "public"."acompanhamento_eventos" FOR INSERT TO "authenticated" WITH CHECK ((("auth"."uid"() = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."alunos"
  WHERE (("alunos"."id" = "acompanhamento_eventos"."aluno_id") AND ("alunos"."user_id" = "auth"."uid"())))) AND (("plano_id" IS NULL) OR (EXISTS ( SELECT 1
   FROM "public"."planos"
  WHERE (("planos"."id" = "acompanhamento_eventos"."plano_id") AND ("planos"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Usuarios podem cadastrar seus modelos de treino" ON "public"."workout_templates" FOR INSERT WITH CHECK ((("auth"."uid"() = "owner_id") AND ("is_system" = false)));



CREATE POLICY "Usuarios podem cadastrar seus pagamentos" ON "public"."pagamentos" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."alunos"
  WHERE (("alunos"."id" = "pagamentos"."aluno_id") AND ("alunos"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Usuarios podem cadastrar seus planos" ON "public"."planos" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios podem cadastrar seus treinos" ON "public"."treinos" FOR INSERT WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."alunos"
  WHERE (("alunos"."id" = "treinos"."aluno_id") AND ("alunos"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "Usuarios podem cadastrar suas anamneses" ON "public"."anamneses" FOR INSERT WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."alunos"
  WHERE (("alunos"."id" = "anamneses"."aluno_id") AND ("alunos"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "Usuarios podem cadastrar suas assinaturas" ON "public"."assinaturas" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND ("status" = 'pendente'::"text")));



CREATE POLICY "Usuarios podem cadastrar suas avaliacoes" ON "public"."avaliacoes" FOR INSERT WITH CHECK (((( SELECT "auth"."uid"() AS "uid") = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."alunos"
  WHERE (("alunos"."id" = "avaliacoes"."aluno_id") AND ("alunos"."user_id" = ( SELECT "auth"."uid"() AS "uid")))))));



CREATE POLICY "Usuarios podem consultar reviews AOE autorizadas" ON "public"."aoe_human_reviews" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."aoe_decisions" "d"
  WHERE (("d"."id" = "aoe_human_reviews"."decision_id") AND (("d"."actor_id" = "auth"."uid"()) OR "public"."admin_eh_admin"())))));



CREATE POLICY "Usuarios podem criar decisoes AOE dos seus alunos" ON "public"."aoe_decisions" FOR INSERT WITH CHECK ((("actor_id" = "auth"."uid"()) AND "public"."aoe_user_owns_student"("student_id")));



CREATE POLICY "Usuarios podem criar reviews AOE autorizadas" ON "public"."aoe_human_reviews" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."aoe_decisions" "d"
  WHERE (("d"."id" = "aoe_human_reviews"."decision_id") AND ("d"."actor_id" = "auth"."uid"())))));



CREATE POLICY "Usuarios podem criar seu perfil padrao" ON "public"."perfis" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND ("role" = 'user'::"text") AND ("tipo_acesso" = 'pendente'::"text") AND ("status" = 'ativo'::"text")));



CREATE POLICY "Usuarios podem excluir dias dos seus treinos" ON "public"."treino_dias" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."treinos"
  WHERE (("treinos"."id" = "treino_dias"."treino_id") AND ("treinos"."user_id" = "auth"."uid"())))));



CREATE POLICY "Usuarios podem excluir exercicios dos seus treinos" ON "public"."treino_exercicios" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM ("public"."treino_dias"
     JOIN "public"."treinos" ON (("treinos"."id" = "treino_dias"."treino_id")))
  WHERE (("treino_dias"."id" = "treino_exercicios"."treino_dia_id") AND ("treinos"."user_id" = "auth"."uid"())))));



CREATE POLICY "Usuarios podem excluir seus modelos de treino" ON "public"."workout_templates" FOR DELETE USING ((("auth"."uid"() = "owner_id") AND ("is_system" = false)));



CREATE POLICY "Usuarios podem excluir seus pagamentos" ON "public"."pagamentos" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios podem excluir seus planos" ON "public"."planos" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios podem excluir seus treinos" ON "public"."treinos" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Usuarios podem excluir suas anamneses" ON "public"."anamneses" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Usuarios podem excluir suas avaliacoes" ON "public"."avaliacoes" FOR DELETE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Usuarios podem listar decisoes AOE dos seus alunos" ON "public"."aoe_decisions" FOR SELECT USING ((("actor_id" = "auth"."uid"()) OR "public"."admin_eh_admin"() OR "public"."aoe_user_owns_student"("student_id")));



CREATE POLICY "Usuarios podem listar dias dos seus treinos" ON "public"."treino_dias" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."treinos"
  WHERE (("treinos"."id" = "treino_dias"."treino_id") AND ("treinos"."user_id" = "auth"."uid"())))));



CREATE POLICY "Usuarios podem listar exercicios dos seus treinos" ON "public"."treino_exercicios" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."treino_dias"
     JOIN "public"."treinos" ON (("treinos"."id" = "treino_dias"."treino_id")))
  WHERE (("treino_dias"."id" = "treino_exercicios"."treino_dia_id") AND ("treinos"."user_id" = "auth"."uid"())))));



CREATE POLICY "Usuarios podem listar seu perfil" ON "public"."perfis" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios podem listar seus aceites legais" ON "public"."aceites_legais" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios podem listar seus eventos de acompanhamento" ON "public"."acompanhamento_eventos" FOR SELECT TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios podem listar seus modelos de treino" ON "public"."workout_templates" FOR SELECT USING ((("auth"."uid"() = "owner_id") AND ("is_active" = true) AND ("is_system" = false)));



CREATE POLICY "Usuarios podem listar seus pagamentos" ON "public"."pagamentos" FOR SELECT USING ((("auth"."uid"() = "user_id") AND (EXISTS ( SELECT 1
   FROM "public"."alunos"
  WHERE (("alunos"."id" = "pagamentos"."aluno_id") AND ("alunos"."user_id" = "auth"."uid"()))))));



CREATE POLICY "Usuarios podem listar seus planos" ON "public"."planos" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios podem listar seus treinos" ON "public"."treinos" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Usuarios podem listar suas anamneses" ON "public"."anamneses" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Usuarios podem listar suas assinaturas" ON "public"."assinaturas" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios podem listar suas avaliacoes" ON "public"."avaliacoes" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Usuarios podem registrar seus aceites legais" ON "public"."aceites_legais" FOR INSERT WITH CHECK ((("auth"."uid"() = "user_id") AND ("politica_aceita" = true) AND ("termos_aceitos" = true)));



CREATE POLICY "Usuário cadastra seus alunos" ON "public"."alunos" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuário edita seus alunos" ON "public"."alunos" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuário exclui seus alunos" ON "public"."alunos" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuário vê apenas seus alunos" ON "public"."alunos" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."aceites_legais" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."acompanhamento_eventos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."admin_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."alunos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."anamneses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."aoe_audit_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."aoe_decision_traces" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."aoe_decisions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."aoe_human_reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."aoe_idempotency_keys" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."assinaturas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."avaliacoes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pagamentos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."perfis" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."planos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."treino_dias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."treino_exercicios" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."treinos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_templates" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_atualizar_perfil"("p_user_id" "uuid", "p_nome" "text", "p_role" "text", "p_tipo_acesso" "text", "p_status" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_atualizar_perfil"("p_user_id" "uuid", "p_nome" "text", "p_role" "text", "p_tipo_acesso" "text", "p_status" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_atualizar_perfil"("p_user_id" "uuid", "p_nome" "text", "p_role" "text", "p_tipo_acesso" "text", "p_status" "text", "p_user_agent" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_atualizar_perfil"("p_user_id" "uuid", "p_nome" "text", "p_role" "text", "p_tipo_acesso" "text", "p_status" "text", "p_user_agent" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_atualizar_perfil"("p_user_id" "uuid", "p_nome" "text", "p_role" "text", "p_tipo_acesso" "text", "p_status" "text", "p_user_agent" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_bloquear_usuario"("p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_bloquear_usuario"("p_user_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_bloquear_usuario"("p_user_id" "uuid", "p_user_agent" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_bloquear_usuario"("p_user_id" "uuid", "p_user_agent" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_bloquear_usuario"("p_user_id" "uuid", "p_user_agent" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_eh_admin"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_eh_admin"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_liberar_assinante"("p_user_id" "uuid", "p_plano" "text", "p_data_inicio" "date", "p_data_vencimento" "date") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_liberar_assinante"("p_user_id" "uuid", "p_plano" "text", "p_data_inicio" "date", "p_data_vencimento" "date") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_liberar_assinante"("p_user_id" "uuid", "p_plano" "text", "p_data_inicio" "date", "p_data_vencimento" "date", "p_user_agent" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_liberar_assinante"("p_user_id" "uuid", "p_plano" "text", "p_data_inicio" "date", "p_data_vencimento" "date", "p_user_agent" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_liberar_assinante"("p_user_id" "uuid", "p_plano" "text", "p_data_inicio" "date", "p_data_vencimento" "date", "p_user_agent" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_liberar_beta"("p_user_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_liberar_beta"("p_user_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_liberar_beta"("p_user_id" "uuid", "p_user_agent" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_liberar_beta"("p_user_id" "uuid", "p_user_agent" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_liberar_beta"("p_user_id" "uuid", "p_user_agent" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_listar_logs"("p_acao" "text", "p_target_user_id" "uuid", "p_data_inicio" "date", "p_data_fim" "date", "p_busca" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_listar_logs"("p_acao" "text", "p_target_user_id" "uuid", "p_data_inicio" "date", "p_data_fim" "date", "p_busca" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_listar_logs"("p_acao" "text", "p_target_user_id" "uuid", "p_data_inicio" "date", "p_data_fim" "date", "p_busca" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_listar_usuarios"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_listar_usuarios"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_listar_usuarios"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_registrar_log"("p_target_user_id" "uuid", "p_acao" "text", "p_entidade" "text", "p_entidade_id" "uuid", "p_dados_anteriores" "jsonb", "p_dados_novos" "jsonb", "p_user_agent" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_registrar_log"("p_target_user_id" "uuid", "p_acao" "text", "p_entidade" "text", "p_entidade_id" "uuid", "p_dados_anteriores" "jsonb", "p_dados_novos" "jsonb", "p_user_agent" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_upsert_assinatura"("p_user_id" "uuid", "p_plano" "text", "p_status" "text", "p_data_inicio" "date", "p_data_vencimento" "date") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_upsert_assinatura"("p_user_id" "uuid", "p_plano" "text", "p_status" "text", "p_data_inicio" "date", "p_data_vencimento" "date") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_upsert_assinatura"("p_user_id" "uuid", "p_plano" "text", "p_status" "text", "p_data_inicio" "date", "p_data_vencimento" "date", "p_user_agent" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_upsert_assinatura"("p_user_id" "uuid", "p_plano" "text", "p_status" "text", "p_data_inicio" "date", "p_data_vencimento" "date", "p_user_agent" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."admin_upsert_assinatura"("p_user_id" "uuid", "p_plano" "text", "p_status" "text", "p_data_inicio" "date", "p_data_vencimento" "date", "p_user_agent" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."admin_validar_acesso"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."admin_validar_acesso"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."aoe_idempotency_get_or_create"("p_id" "text", "p_actor_id" "uuid", "p_organization_id" "uuid", "p_operation" "text", "p_idempotency_key" "text", "p_request_fingerprint" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."aoe_idempotency_get_or_create"("p_id" "text", "p_actor_id" "uuid", "p_organization_id" "uuid", "p_operation" "text", "p_idempotency_key" "text", "p_request_fingerprint" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."aoe_idempotency_get_or_create"("p_id" "text", "p_actor_id" "uuid", "p_organization_id" "uuid", "p_operation" "text", "p_idempotency_key" "text", "p_request_fingerprint" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."aoe_idempotency_get_or_create"("p_id" "text", "p_actor_id" "uuid", "p_organization_id" "uuid", "p_operation" "text", "p_idempotency_key" "text", "p_request_fingerprint" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."aoe_user_owns_student"("p_student_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."aoe_user_owns_student"("p_student_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."aoe_user_owns_student"("p_student_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."aoe_user_owns_student"("p_student_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."processar_encerramento_automatico_aluno"("p_user_id" "uuid", "p_aluno_id" "uuid", "p_vencimento" "date", "p_ocorrido_em" "date", "p_event_key" "text", "p_plano_id" "uuid", "p_plano_nome" "text", "p_dias_apos_vencimento" integer, "p_status_anterior" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."processar_encerramento_automatico_aluno"("p_user_id" "uuid", "p_aluno_id" "uuid", "p_vencimento" "date", "p_ocorrido_em" "date", "p_event_key" "text", "p_plano_id" "uuid", "p_plano_nome" "text", "p_dias_apos_vencimento" integer, "p_status_anterior" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."set_workout_templates_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_workout_templates_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_workout_templates_updated_at"() TO "service_role";



GRANT ALL ON TABLE "public"."aceites_legais" TO "anon";
GRANT ALL ON TABLE "public"."aceites_legais" TO "authenticated";
GRANT ALL ON TABLE "public"."aceites_legais" TO "service_role";



GRANT ALL ON TABLE "public"."acompanhamento_eventos" TO "anon";
GRANT ALL ON TABLE "public"."acompanhamento_eventos" TO "authenticated";
GRANT ALL ON TABLE "public"."acompanhamento_eventos" TO "service_role";



GRANT ALL ON TABLE "public"."admin_logs" TO "anon";
GRANT ALL ON TABLE "public"."admin_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_logs" TO "service_role";



GRANT ALL ON TABLE "public"."alunos" TO "anon";
GRANT ALL ON TABLE "public"."alunos" TO "authenticated";
GRANT ALL ON TABLE "public"."alunos" TO "service_role";



GRANT ALL ON TABLE "public"."anamneses" TO "anon";
GRANT ALL ON TABLE "public"."anamneses" TO "authenticated";
GRANT ALL ON TABLE "public"."anamneses" TO "service_role";



GRANT ALL ON TABLE "public"."aoe_audit_events" TO "anon";
GRANT ALL ON TABLE "public"."aoe_audit_events" TO "authenticated";
GRANT ALL ON TABLE "public"."aoe_audit_events" TO "service_role";



GRANT ALL ON TABLE "public"."aoe_decision_traces" TO "anon";
GRANT ALL ON TABLE "public"."aoe_decision_traces" TO "authenticated";
GRANT ALL ON TABLE "public"."aoe_decision_traces" TO "service_role";



GRANT ALL ON TABLE "public"."aoe_decisions" TO "anon";
GRANT ALL ON TABLE "public"."aoe_decisions" TO "authenticated";
GRANT ALL ON TABLE "public"."aoe_decisions" TO "service_role";



GRANT ALL ON TABLE "public"."aoe_human_reviews" TO "anon";
GRANT ALL ON TABLE "public"."aoe_human_reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."aoe_human_reviews" TO "service_role";



GRANT ALL ON TABLE "public"."aoe_idempotency_keys" TO "anon";
GRANT ALL ON TABLE "public"."aoe_idempotency_keys" TO "authenticated";
GRANT ALL ON TABLE "public"."aoe_idempotency_keys" TO "service_role";



GRANT ALL ON TABLE "public"."assinaturas" TO "anon";
GRANT ALL ON TABLE "public"."assinaturas" TO "authenticated";
GRANT ALL ON TABLE "public"."assinaturas" TO "service_role";



GRANT ALL ON TABLE "public"."avaliacoes" TO "anon";
GRANT ALL ON TABLE "public"."avaliacoes" TO "authenticated";
GRANT ALL ON TABLE "public"."avaliacoes" TO "service_role";



GRANT ALL ON TABLE "public"."pagamentos" TO "anon";
GRANT ALL ON TABLE "public"."pagamentos" TO "authenticated";
GRANT ALL ON TABLE "public"."pagamentos" TO "service_role";



GRANT ALL ON TABLE "public"."perfis" TO "anon";
GRANT ALL ON TABLE "public"."perfis" TO "authenticated";
GRANT ALL ON TABLE "public"."perfis" TO "service_role";



GRANT ALL ON TABLE "public"."planos" TO "anon";
GRANT ALL ON TABLE "public"."planos" TO "authenticated";
GRANT ALL ON TABLE "public"."planos" TO "service_role";



GRANT ALL ON TABLE "public"."treino_dias" TO "anon";
GRANT ALL ON TABLE "public"."treino_dias" TO "authenticated";
GRANT ALL ON TABLE "public"."treino_dias" TO "service_role";



GRANT ALL ON TABLE "public"."treino_exercicios" TO "anon";
GRANT ALL ON TABLE "public"."treino_exercicios" TO "authenticated";
GRANT ALL ON TABLE "public"."treino_exercicios" TO "service_role";



GRANT ALL ON TABLE "public"."treinos" TO "anon";
GRANT ALL ON TABLE "public"."treinos" TO "authenticated";
GRANT ALL ON TABLE "public"."treinos" TO "service_role";



GRANT ALL ON TABLE "public"."workout_templates" TO "anon";
GRANT ALL ON TABLE "public"."workout_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_templates" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







