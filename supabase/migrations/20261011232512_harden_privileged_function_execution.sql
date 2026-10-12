begin;

-- G3 security remediation. These definitions are inherited from the production
-- snapshot after the approved 15-migration rehearsal. Keep the public API
-- signatures stable, but remove PostgreSQL's implicit PUBLIC execution path.
-- Background mutations are intentionally service_role-only: they run without
-- an end-user session and therefore must not infer authorization from auth.uid().
do $migration$
declare
  v_target record;
  v_oid oid;
  v_actual_count integer;
begin
  create temporary table aruka_g3_privileged_function_allowlist (
    signature text primary key,
    required_in_canonical_chain boolean not null,
    allow_authenticated boolean not null,
    allow_service_role boolean not null,
    contract text not null
  ) on commit drop;

  insert into aruka_g3_privileged_function_allowlist
    (signature, required_in_canonical_chain, allow_authenticated, allow_service_role, contract)
  values
    ('admin_atualizar_perfil(uuid,text,text,text,text,text)', true, true, true, 'authenticated admin RPC'),
    ('admin_atualizar_perfil(uuid,text,text,text,text)', false, true, true, 'production legacy authenticated admin overload'),
    ('admin_bloquear_usuario(uuid,text)', true, true, true, 'authenticated admin RPC'),
    ('admin_bloquear_usuario(uuid)', false, true, true, 'production legacy authenticated admin overload'),
    ('admin_eh_admin()', true, true, true, 'authenticated authorization helper and RLS dependency'),
    ('admin_liberar_assinante(uuid,text,date,date,text)', true, true, true, 'authenticated admin RPC'),
    ('admin_liberar_assinante(uuid,text,date,date)', false, true, true, 'production legacy authenticated admin overload'),
    ('admin_liberar_beta(uuid,text)', true, true, true, 'authenticated admin RPC'),
    ('admin_liberar_beta(uuid)', false, true, true, 'production legacy authenticated admin overload'),
    ('admin_listar_logs(text,uuid,date,date,text)', true, true, true, 'authenticated admin RPC'),
    ('admin_registrar_log(uuid,text,text,uuid,jsonb,jsonb,text)', true, true, true, 'authenticated admin audit helper'),
    ('admin_upsert_assinatura(uuid,text,text,date,date,text)', true, true, true, 'authenticated admin RPC'),
    ('admin_upsert_assinatura(uuid,text,text,date,date)', false, true, true, 'production legacy authenticated admin overload'),
    ('admin_validar_acesso()', true, true, true, 'authenticated authorization helper'),
    ('alterar_estado_treino(uuid,text)', true, true, false, 'authenticated professional RPC bound to auth.uid()'),
    ('aoe_idempotency_get_or_create(text,uuid,uuid,text,text,text)', true, false, true, 'internal AOE service operation'),
    ('claim_pending_student_invite()', true, true, false, 'authenticated student self-claim RPC'),
    ('entregar_treino(uuid)', true, true, false, 'authenticated professional RPC bound to auth.uid()'),
    ('get_my_student_exercise_media(uuid)', true, true, false, 'authenticated student self-read RPC'),
    ('get_my_student_workouts()', true, true, false, 'authenticated student self-read RPC'),
    ('processar_encerramento_automatico_aluno(uuid,uuid,date,date,text,uuid,text,integer,text)', true, false, true, 'internal lifecycle background operation'),
    ('salvar_treino_composto(jsonb)', true, true, false, 'authenticated professional RPC bound to auth.uid()');

  select count(*) into v_actual_count
  from aruka_g3_privileged_function_allowlist;
  if v_actual_count <> 22 then
    raise exception 'G3_SECURITY_ALLOWLIST_COUNT_MISMATCH:%', v_actual_count;
  end if;

  for v_target in
    select * from aruka_g3_privileged_function_allowlist order by signature
  loop
    v_oid := to_regprocedure('public.' || v_target.signature);
    if v_oid is null then
      if v_target.required_in_canonical_chain then
        raise exception 'G3_SECURITY_EXPECTED_FUNCTION_MISSING:%', v_target.signature;
      end if;
      continue;
    end if;

    if not (select p.prosecdef from pg_catalog.pg_proc p where p.oid = v_oid) then
      raise exception 'G3_SECURITY_EXPECTED_DEFINER_MISMATCH:%', v_target.signature;
    end if;

    -- All referenced relations/functions in these definitions are schema
    -- qualified. An empty path prevents object shadowing while pg_catalog
    -- remains implicitly available for built-ins.
    execute format('alter function %s set search_path = %L', v_oid::regprocedure, '');
    execute format(
      'revoke all privileges on function %s from public, anon, authenticated, service_role',
      v_oid::regprocedure
    );

    if v_target.allow_authenticated then
      execute format('grant execute on function %s to authenticated', v_oid::regprocedure);
    end if;
    if v_target.allow_service_role then
      execute format('grant execute on function %s to service_role', v_oid::regprocedure);
    end if;
  end loop;

  if exists (
    select 1
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
      and has_function_privilege('anon', p.oid, 'execute')
  ) then
    raise exception 'G3_SECURITY_ANON_DEFINER_EXECUTE_REMAINS';
  end if;

  if exists (
    select 1
    from aruka_g3_privileged_function_allowlist a
    join pg_catalog.pg_proc p on p.oid = to_regprocedure('public.' || a.signature)
    where coalesce(array_to_string(p.proconfig, ','), '') <> 'search_path=""'
  ) then
    raise exception 'G3_SECURITY_UNSAFE_TARGET_SEARCH_PATH_REMAINS';
  end if;

  if exists (
    select 1
    from aruka_g3_privileged_function_allowlist a
    join pg_catalog.pg_proc p on p.oid = to_regprocedure('public.' || a.signature)
    where has_function_privilege('authenticated', p.oid, 'execute') <> a.allow_authenticated
       or has_function_privilege('service_role', p.oid, 'execute') <> a.allow_service_role
  ) then
    raise exception 'G3_SECURITY_EFFECTIVE_ALLOWLIST_MISMATCH';
  end if;
end
$migration$;

-- Preserve the secure default established by the Cycle 12 reconciliation.
alter default privileges for role postgres in schema public
  revoke execute on functions from public, anon, authenticated, service_role;

commit;
