alter table public.assinaturas
  add column if not exists grace_until date,
  add column if not exists cancel_at_period_end boolean not null default false,
  add column if not exists cancelled_at date,
  add column if not exists suspended_at date,
  add column if not exists reactivated_at date;

update public.assinaturas
set
  cancel_at_period_end = coalesce(cancel_at_period_end, false),
  cancelled_at = case
    when status = 'cancelado' then coalesce(cancelled_at, current_date)
    else cancelled_at
  end
where cancel_at_period_end is null
   or (status = 'cancelado' and cancelled_at is null);

alter table public.assinaturas
  drop constraint if exists assinaturas_lifecycle_dates_check;

alter table public.assinaturas
  add constraint assinaturas_lifecycle_dates_check
  check (
    (grace_until is null or data_vencimento is null or grace_until >= data_vencimento)
    and (status <> 'cancelado' or cancelled_at is not null)
  );

create index if not exists assinaturas_grace_until_idx
  on public.assinaturas using btree (grace_until)
  where grace_until is not null;

create index if not exists assinaturas_cancel_at_period_end_idx
  on public.assinaturas using btree (cancel_at_period_end)
  where cancel_at_period_end = true;

create index if not exists assinaturas_suspended_at_idx
  on public.assinaturas using btree (suspended_at)
  where suspended_at is not null;

drop function if exists public.admin_listar_usuarios();

create function public.admin_listar_usuarios()
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
  data_vencimento date,
  grace_until date,
  cancel_at_period_end boolean,
  cancelled_at date,
  suspended_at date,
  reactivated_at date
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
      assinaturas.data_vencimento,
      assinaturas.grace_until,
      assinaturas.cancel_at_period_end,
      assinaturas.cancelled_at,
      assinaturas.suspended_at,
      assinaturas.reactivated_at
    from public.assinaturas
    order by assinaturas.user_id, assinaturas.created_at desc
  )
  select
    users.id,
    users.email::text,
    users.created_at,
    coalesce(perfis.nome, users.raw_user_meta_data->>'nome', '')::text,
    coalesce(perfis.role, 'user')::text,
    coalesce(perfis.tipo_acesso, 'pendente')::text,
    coalesce(perfis.status, 'ativo')::text,
    ultima_assinatura.plano::text,
    ultima_assinatura.status::text,
    ultima_assinatura.data_inicio,
    ultima_assinatura.data_vencimento,
    ultima_assinatura.grace_until,
    coalesce(ultima_assinatura.cancel_at_period_end, false),
    ultima_assinatura.cancelled_at,
    ultima_assinatura.suspended_at,
    ultima_assinatura.reactivated_at
  from auth.users
  left join public.perfis on perfis.user_id = users.id
  left join ultima_assinatura on ultima_assinatura.user_id = users.id
  order by users.created_at desc;
end;
$$;

create or replace function public.admin_upsert_assinatura(
  p_user_id uuid,
  p_plano text,
  p_status text,
  p_data_inicio date,
  p_data_vencimento date,
  p_user_agent text default null,
  p_grace_until date default null,
  p_cancel_at_period_end boolean default false
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
    insert into public.assinaturas (
      user_id, plano, status, data_inicio, data_vencimento, grace_until,
      cancel_at_period_end, cancelled_at
    )
    values (
      p_user_id,
      coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'),
      p_status,
      p_data_inicio,
      p_data_vencimento,
      p_grace_until,
      coalesce(p_cancel_at_period_end, false),
      case when p_status = 'cancelado' then current_date else null end
    )
    returning id into v_assinatura_id;
  else
    update public.assinaturas
    set plano = coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'),
        status = p_status,
        data_inicio = p_data_inicio,
        data_vencimento = p_data_vencimento,
        grace_until = p_grace_until,
        cancel_at_period_end = coalesce(p_cancel_at_period_end, false),
        cancelled_at = case when p_status = 'cancelado' then coalesce(cancelled_at, current_date) else null end,
        suspended_at = case when p_status <> 'vencido' then null else suspended_at end
    where assinaturas.id = v_assinatura_id;
  end if;

  select to_jsonb(assinaturas.*) into v_depois from public.assinaturas where assinaturas.id = v_assinatura_id;
  perform public.admin_registrar_log(p_user_id, v_acao, 'assinaturas', v_assinatura_id, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.admin_subscription_lifecycle_action(
  p_user_id uuid,
  p_action text,
  p_plano text default null,
  p_data_inicio date default null,
  p_data_vencimento date default null,
  p_grace_until date default null,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_action text := lower(trim(coalesce(p_action, '')));
  v_assinatura_id uuid;
  v_antes jsonb;
  v_depois jsonb;
  v_status text;
  v_plan text;
  v_start date;
  v_end date;
  v_grace date;
  v_log_action text;
begin
  perform public.admin_validar_acesso();

  if p_user_id is null then
    raise exception 'Usuario alvo obrigatorio.';
  end if;

  select id, to_jsonb(assinaturas.*), status, plano, data_inicio, data_vencimento, grace_until
  into v_assinatura_id, v_antes, v_status, v_plan, v_start, v_end, v_grace
  from public.assinaturas
  where user_id = p_user_id
  order by created_at desc
  limit 1;

  if v_assinatura_id is null then
    insert into public.assinaturas (user_id, plano, status, data_inicio, data_vencimento)
    values (p_user_id, coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'), 'pendente', p_data_inicio, p_data_vencimento)
    returning id into v_assinatura_id;

    select id, to_jsonb(assinaturas.*), status, plano, data_inicio, data_vencimento, grace_until
    into v_assinatura_id, v_antes, v_status, v_plan, v_start, v_end, v_grace
    from public.assinaturas
    where id = v_assinatura_id;
  end if;

  if v_action = 'mark_paid' then
    v_start := coalesce(p_data_inicio, current_date);
    v_end := p_data_vencimento;
    if v_end is null or v_end < current_date then
      raise exception 'Reativacao exige periodo de assinatura valido.';
    end if;
    update public.assinaturas
    set plano = coalesce(nullif(trim(coalesce(p_plano, '')), ''), plano, 'Mensal'),
        status = 'ativo',
        data_inicio = v_start,
        data_vencimento = v_end,
        grace_until = null,
        cancel_at_period_end = false,
        suspended_at = null,
        cancelled_at = null,
        reactivated_at = current_date
    where id = v_assinatura_id;
    v_log_action := 'subscription_marked_paid';
  elsif v_action = 'enter_grace' then
    v_grace := coalesce(p_grace_until, coalesce(v_end, current_date) + 7);
    if v_grace < current_date then
      raise exception 'Periodo de tolerancia precisa terminar hoje ou no futuro.';
    end if;
    update public.assinaturas
    set status = 'vencido',
        grace_until = v_grace,
        suspended_at = null
    where id = v_assinatura_id;
    v_log_action := 'subscription_grace_extended';
  elsif v_action = 'extend_grace' then
    v_grace := p_grace_until;
    if v_grace is null or v_grace < current_date then
      raise exception 'Informe uma data de tolerancia futura.';
    end if;
    update public.assinaturas
    set status = 'vencido',
        grace_until = v_grace,
        suspended_at = null
    where id = v_assinatura_id;
    v_log_action := 'subscription_grace_extended';
  elsif v_action = 'suspend_subscription' then
    update public.assinaturas
    set status = 'vencido',
        grace_until = null,
        suspended_at = current_date,
        cancel_at_period_end = false
    where id = v_assinatura_id;
    v_log_action := 'subscription_suspended';
  elsif v_action = 'reactivate_subscription' then
    v_start := coalesce(p_data_inicio, current_date);
    v_end := p_data_vencimento;
    if v_end is null or v_end < current_date then
      raise exception 'Reativacao exige periodo de assinatura valido.';
    end if;
    update public.assinaturas
    set plano = coalesce(nullif(trim(coalesce(p_plano, '')), ''), plano, 'Mensal'),
        status = 'ativo',
        data_inicio = v_start,
        data_vencimento = v_end,
        grace_until = null,
        cancel_at_period_end = false,
        cancelled_at = null,
        suspended_at = null,
        reactivated_at = current_date
    where id = v_assinatura_id;
    v_log_action := 'subscription_reactivated';
  elsif v_action = 'schedule_cancellation' then
    if coalesce(v_end, p_data_vencimento) is null then
      raise exception 'Cancelamento ao fim do periodo exige data de vencimento.';
    end if;
    update public.assinaturas
    set cancel_at_period_end = true,
        cancelled_at = null,
        suspended_at = null
    where id = v_assinatura_id;
    v_log_action := 'subscription_cancel_scheduled';
  elsif v_action = 'cancel_now' then
    update public.assinaturas
    set status = 'cancelado',
        cancel_at_period_end = false,
        grace_until = null,
        suspended_at = null,
        cancelled_at = current_date
    where id = v_assinatura_id;
    v_log_action := 'subscription_cancelled_now';
  else
    raise exception 'Acao de lifecycle invalida: %', p_action;
  end if;

  select to_jsonb(assinaturas.*) into v_depois
  from public.assinaturas
  where id = v_assinatura_id;

  perform public.admin_registrar_log(p_user_id, v_log_action, 'assinaturas', v_assinatura_id, v_antes, v_depois, p_user_agent);
end;
$$;

revoke all on function public.admin_subscription_lifecycle_action(uuid, text, text, date, date, date, text) from public;
grant execute on function public.admin_subscription_lifecycle_action(uuid, text, text, date, date, date, text) to authenticated, service_role;
revoke all on function public.admin_upsert_assinatura(uuid, text, text, date, date, text, date, boolean) from public;
grant execute on function public.admin_upsert_assinatura(uuid, text, text, date, date, text, date, boolean) to authenticated, service_role;
revoke all on function public.admin_listar_usuarios() from public;
grant execute on function public.admin_listar_usuarios() to authenticated, service_role;
