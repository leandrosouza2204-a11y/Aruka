\pset tuples_only on
\pset format unaligned
\pset fieldsep '|'

begin;

-- Database-only pg_dump does not preserve managed-role bootstrap grants.
grant usage on schema auth to supabase_auth_admin;

do $$
declare
  v_count bigint;
  v_signature text;
begin
  select count(*) into v_count
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.prosecdef
    and has_function_privilege('anon', p.oid, 'execute');
  if v_count <> 0 then
    raise exception 'anonymous SECURITY DEFINER execution remains: %', v_count;
  end if;

  select count(*) into v_count
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.prosecdef
    and p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' in (
      'admin_atualizar_perfil(uuid,text,text,text,text,text)',
      'admin_atualizar_perfil(uuid,text,text,text,text)',
      'admin_bloquear_usuario(uuid,text)', 'admin_bloquear_usuario(uuid)',
      'admin_eh_admin()',
      'admin_liberar_assinante(uuid,text,date,date,text)',
      'admin_liberar_assinante(uuid,text,date,date)',
      'admin_liberar_beta(uuid,text)', 'admin_liberar_beta(uuid)',
      'admin_listar_logs(text,uuid,date,date,text)',
      'admin_registrar_log(uuid,text,text,uuid,jsonb,jsonb,text)',
      'admin_upsert_assinatura(uuid,text,text,date,date,text)',
      'admin_upsert_assinatura(uuid,text,text,date,date)',
      'admin_validar_acesso()', 'alterar_estado_treino(uuid,text)',
      'aoe_idempotency_get_or_create(text,uuid,uuid,text,text,text)',
      'claim_pending_student_invite()', 'entregar_treino(uuid)',
      'get_my_student_exercise_media(uuid)', 'get_my_student_workouts()',
      'processar_encerramento_automatico_aluno(uuid,uuid,date,date,text,uuid,text,integer,text)',
      'salvar_treino_composto(jsonb)'
    )
    and coalesce(array_to_string(p.proconfig, ','), '') <> 'search_path=""';
  if v_count <> 0 then
    raise exception 'unsafe target search paths remain: %', v_count;
  end if;

  foreach v_signature in array array[
    'public.aoe_idempotency_get_or_create(text,uuid,uuid,text,text,text)',
    'public.processar_encerramento_automatico_aluno(uuid,uuid,date,date,text,uuid,text,integer,text)'
  ] loop
    if has_function_privilege('anon', v_signature, 'execute') then
      raise exception 'anon execute remains on %', v_signature;
    end if;
    if has_function_privilege('authenticated', v_signature, 'execute') then
      raise exception 'authenticated execute remains on internal function %', v_signature;
    end if;
    if not has_function_privilege('service_role', v_signature, 'execute') then
      raise exception 'service_role execute missing on internal function %', v_signature;
    end if;
  end loop;

  select count(*) into v_count
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname in (
      'admin_atualizar_perfil', 'admin_bloquear_usuario',
      'admin_liberar_assinante', 'admin_liberar_beta', 'admin_upsert_assinatura'
    )
    and has_function_privilege('anon', p.oid, 'execute');
  if v_count <> 0 then
    raise exception 'anonymous legacy overload path remains: %', v_count;
  end if;
end $$;

insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at) values
('00000000-0000-4000-8000-000000003601','authenticated','authenticated','g3-security-service@example.invalid',now(),now(),now()),
('00000000-0000-4000-8000-000000003602','authenticated','authenticated','g3-security-user@example.invalid',now(),now(),now());

insert into public.alunos(
  id,user_id,student_user_id,nome,whatsapp,inicio,plano,vencimento,acompanhamento_status
) values (
  '00000000-0000-4000-8000-000000003611',
  '00000000-0000-4000-8000-000000003601',
  '00000000-0000-4000-8000-000000003602',
  'G3 Security Fixture','1',current_date,'QA',current_date-100,'ativo'
);

set local role anon;
do $$ begin
  begin
    perform public.processar_encerramento_automatico_aluno(
      '00000000-0000-4000-8000-000000003601',
      '00000000-0000-4000-8000-000000003611',
      current_date-100,current_date,'g3-security-anon-closure'
    );
    raise exception 'anon automatic closure unexpectedly executed';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.aoe_idempotency_get_or_create(
      'g3-security-anon-key',
      '00000000-0000-4000-8000-000000003601',
      '00000000-0000-4000-8000-000000003601',
      'g3-security','forged','fingerprint'
    );
    raise exception 'anon AOE idempotency unexpectedly executed';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-4000-8000-000000003602';
do $$ begin
  begin
    perform public.processar_encerramento_automatico_aluno(
      '00000000-0000-4000-8000-000000003601',
      '00000000-0000-4000-8000-000000003611',
      current_date-100,current_date,'g3-security-auth-closure'
    );
    raise exception 'authenticated forged automatic closure unexpectedly executed';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.aoe_idempotency_get_or_create(
      'g3-security-auth-key',
      '00000000-0000-4000-8000-000000003601',
      '00000000-0000-4000-8000-000000003601',
      'g3-security','forged','fingerprint'
    );
    raise exception 'authenticated forged AOE idempotency unexpectedly executed';
  exception when insufficient_privilege then null;
  end;
  if public.admin_eh_admin() then
    raise exception 'synthetic student unexpectedly resolved as admin';
  end if;
  if public.get_my_student_workouts() is null then
    raise exception 'authorized student RPC returned null';
  end if;
end $$;
reset role;

set local role service_role;
select public.processar_encerramento_automatico_aluno(
  '00000000-0000-4000-8000-000000003601',
  '00000000-0000-4000-8000-000000003611',
  current_date-100,current_date,'g3-security-service-closure'
)->>'status' as service_closure_status;
select public.aoe_idempotency_get_or_create(
  'g3-security-service-key',
  '00000000-0000-4000-8000-000000003601',
  '00000000-0000-4000-8000-000000003601',
  'g3-security','service','fingerprint'
)->>'created' as service_idempotency_created;
reset role;

do $$ begin
  if not exists (
    select 1 from public.alunos
    where id='00000000-0000-4000-8000-000000003611'
      and acompanhamento_status='encerrado'
  ) then
    raise exception 'service_role automatic closure did not execute';
  end if;
  if not exists (
    select 1 from public.aoe_idempotency_keys
    where id='g3-security-service-key'
  ) then
    raise exception 'service_role AOE idempotency did not execute';
  end if;
end $$;

select 'security_remediation','anon_privileged_execution_zero','PASS';
select 'security_remediation','authenticated_forged_ids_denied','PASS';
select 'security_remediation','service_role_internal_contract','PASS';
select 'security_remediation','authenticated_legitimate_rpcs','PASS';
select 'security_remediation','legacy_overloads_closed','PASS';
select 'security_remediation','target_search_path_empty','PASS';
select 'security_remediation','synthetic_transaction','ROLLBACK';

rollback;
