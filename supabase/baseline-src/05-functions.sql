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
  perform public.admin_validar_acesso();

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
  perform public.admin_validar_acesso();

  return query
  select
    logs.id,
    logs.admin_user_id,
    admin_users.email::text,
    admin_perfis.nome,
    logs.target_user_id,
    target_users.email::text,
    target_perfis.nome,
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
    and (p_data_fim is null or logs.created_at < (p_data_fim + interval '1 day')::timestamptz)
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
    users.id,
    users.email::text,
    users.created_at,
    perfis.nome,
    coalesce(perfis.role, 'user'),
    coalesce(perfis.tipo_acesso, 'pendente'),
    coalesce(perfis.status, 'ativo'),
    ultima_assinatura.plano,
    ultima_assinatura.status,
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
  p_status text,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
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

  select users.email::text into v_email from auth.users where users.id = p_user_id;
  if v_email is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  select to_jsonb(perfis.*) into v_antes from public.perfis where perfis.user_id = p_user_id;

  if coalesce(v_antes->>'role', 'user') <> 'admin' and p_role = 'admin' then
    v_acao := 'tornar_admin';
  elsif coalesce(v_antes->>'role', 'user') = 'admin' and p_role <> 'admin' then
    v_acao := 'remover_admin';
  elsif coalesce(v_antes->>'status', 'ativo') = 'inativo' and p_status = 'ativo' then
    v_acao := 'reativar_usuario';
  end if;

  insert into public.perfis (user_id, nome, email, role, tipo_acesso, status)
  values (p_user_id, nullif(trim(coalesce(p_nome, '')), ''), v_email, p_role, p_tipo_acesso, p_status)
  on conflict (user_id) do update
  set nome = excluded.nome,
      email = excluded.email,
      role = excluded.role,
      tipo_acesso = excluded.tipo_acesso,
      status = excluded.status;

  select to_jsonb(perfis.*) into v_depois from public.perfis where perfis.user_id = p_user_id;
  perform public.admin_registrar_log(p_user_id, v_acao, 'perfis', (v_depois->>'id')::uuid, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.admin_upsert_assinatura(
  p_user_id uuid,
  p_plano text,
  p_status text,
  p_data_inicio date,
  p_data_vencimento date,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
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
    insert into public.assinaturas (user_id, plano, status, data_inicio, data_vencimento)
    values (p_user_id, coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'), p_status, p_data_inicio, p_data_vencimento)
    returning id into v_assinatura_id;
  else
    update public.assinaturas
    set plano = coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'),
        status = p_status,
        data_inicio = p_data_inicio,
        data_vencimento = p_data_vencimento
    where assinaturas.id = v_assinatura_id;
  end if;

  select to_jsonb(assinaturas.*) into v_depois from public.assinaturas where assinaturas.id = v_assinatura_id;
  perform public.admin_registrar_log(p_user_id, v_acao, 'assinaturas', v_assinatura_id, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.admin_bloquear_usuario(p_user_id uuid, p_user_agent text default null)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text;
  v_antes jsonb;
  v_depois jsonb;
begin
  perform public.admin_validar_acesso();

  if p_user_id = auth.uid() then
    raise exception 'Nao e permitido bloquear o proprio usuario.';
  end if;

  select users.email::text into v_email from auth.users where users.id = p_user_id;
  if v_email is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  select to_jsonb(perfis.*) into v_antes from public.perfis where perfis.user_id = p_user_id;

  insert into public.perfis (user_id, email, role, tipo_acesso, status)
  values (p_user_id, v_email, 'user', 'bloqueado', 'inativo')
  on conflict (user_id) do update
  set email = excluded.email,
      tipo_acesso = 'bloqueado',
      status = 'inativo';

  select to_jsonb(perfis.*) into v_depois from public.perfis where perfis.user_id = p_user_id;
  perform public.admin_registrar_log(p_user_id, 'bloquear_usuario', 'perfis', (v_depois->>'id')::uuid, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.admin_liberar_beta(p_user_id uuid, p_user_agent text default null)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text;
  v_antes jsonb;
  v_depois jsonb;
begin
  perform public.admin_validar_acesso();

  select users.email::text into v_email from auth.users where users.id = p_user_id;
  if v_email is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  select to_jsonb(perfis.*) into v_antes from public.perfis where perfis.user_id = p_user_id;

  insert into public.perfis (user_id, email, role, tipo_acesso, status)
  values (p_user_id, v_email, 'user', 'beta', 'ativo')
  on conflict (user_id) do update
  set email = excluded.email,
      role = case when perfis.role = 'admin' then 'admin' else 'user' end,
      tipo_acesso = 'beta',
      status = 'ativo';

  select to_jsonb(perfis.*) into v_depois from public.perfis where perfis.user_id = p_user_id;
  perform public.admin_registrar_log(p_user_id, 'liberar_usuario_beta', 'perfis', (v_depois->>'id')::uuid, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.admin_liberar_assinante(
  p_user_id uuid,
  p_plano text,
  p_data_inicio date,
  p_data_vencimento date,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_antes jsonb;
  v_depois jsonb;
begin
  perform public.admin_validar_acesso();

  select jsonb_build_object('perfil', to_jsonb(perfis.*), 'assinatura', to_jsonb(assinaturas.*))
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

  perform public.admin_atualizar_perfil(p_user_id, coalesce((select perfis.nome from public.perfis where perfis.user_id = p_user_id), ''), 'user', 'assinante', 'ativo', p_user_agent);
  perform public.admin_upsert_assinatura(p_user_id, p_plano, 'ativo', p_data_inicio, p_data_vencimento, p_user_agent);

  select jsonb_build_object('perfil', to_jsonb(perfis.*), 'assinatura', to_jsonb(assinaturas.*))
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

  perform public.admin_registrar_log(p_user_id, 'liberar_assinante', 'assinaturas', null, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.processar_encerramento_automatico_aluno(
  p_user_id uuid,
  p_aluno_id uuid,
  p_vencimento date,
  p_ocorrido_em date,
  p_event_key text,
  p_plano_id uuid default null,
  p_plano_nome text default '',
  p_dias_apos_vencimento integer default 0,
  p_status_anterior text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_aluno record;
  v_evento_id uuid;
begin
  if p_user_id is null or p_aluno_id is null or p_vencimento is null or p_ocorrido_em is null or nullif(trim(coalesce(p_event_key, '')), '') is null then
    return jsonb_build_object('ok', false, 'status', 'invalid_payload');
  end if;

  select id, user_id, vencimento, acompanhamento_status
  into v_aluno
  from public.alunos
  where id = p_aluno_id and user_id = p_user_id
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
  set acompanhamento_status = 'encerrado',
      acompanhamento_encerrado_em = p_ocorrido_em,
      acompanhamento_motivo = 'vencimento_sem_renovacao',
      acompanhamento_motivo_detalhe = ''
  where id = p_aluno_id and user_id = p_user_id;

  begin
    insert into public.acompanhamento_eventos (
      user_id, aluno_id, tipo, ocorrido_em, motivo, motivo_detalhe, plano_id, plano_nome,
      vencimento_anterior, vencimento_novo, metadata, event_key
    )
    values (
      p_user_id, p_aluno_id, 'acompanhamento_encerrado', p_ocorrido_em::timestamptz,
      'vencimento_sem_renovacao', null, p_plano_id, nullif(trim(coalesce(p_plano_nome, '')), ''),
      p_vencimento, null,
      jsonb_build_object('origem', 'automatico_90_dias', 'dias_apos_vencimento', greatest(coalesce(p_dias_apos_vencimento, 0), 0), 'status_anterior', coalesce(nullif(trim(p_status_anterior), ''), 'ativo')),
      p_event_key
    )
    returning id into v_evento_id;
  exception
    when unique_violation then
      return jsonb_build_object('ok', true, 'status', 'duplicado', 'duplicate', true, 'event_key', p_event_key);
  end;

  return jsonb_build_object('ok', true, 'status', 'processado', 'duplicate', false, 'evento_id', v_evento_id, 'event_key', p_event_key);
end;
$$;

create or replace function public.aoe_user_owns_student(p_student_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.alunos
    where alunos.id = p_student_id
      and alunos.user_id = auth.uid()
  );
$$;

create or replace function public.aoe_idempotency_get_or_create(
  p_id text,
  p_actor_id uuid,
  p_organization_id uuid,
  p_operation text,
  p_idempotency_key text,
  p_request_fingerprint text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.aoe_idempotency_keys%rowtype;
  v_inserted integer := 0;
begin
  if p_actor_id is distinct from auth.uid() and not public.admin_eh_admin() then
    raise exception 'Acesso negado: ator nao corresponde ao usuario autenticado.';
  end if;

  insert into public.aoe_idempotency_keys (id, actor_id, organization_id, operation, idempotency_key, request_fingerprint, status)
  values (p_id, p_actor_id, p_organization_id, p_operation, p_idempotency_key, p_request_fingerprint, 'PROCESSING')
  on conflict on constraint aoe_idempotency_keys_pkey do nothing;

  get diagnostics v_inserted = row_count;

  select * into v_row
  from public.aoe_idempotency_keys
  where id = p_id
  for update;

  return jsonb_build_object('created', v_inserted > 0, 'record', to_jsonb(v_row));
end;
$$;

create or replace function public.set_workout_templates_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
