begin;

-- Cycle 12.15.5: forward-only reconciliation of the production drift recorded
-- by Cycle 12.15.4. This file is deliberately safe in both supported states:
--   1. the logical production state after P01-P12 and before Cycle 12.13; and
--   2. a clean repository bootstrap, where Cycle 12.13 and 12.15.2 ran first.
-- It does not resolve the physical migration-order constraint for production.

create temporary table cycle_12_15_5_alunos_policies (
  command text primary key,
  legacy_name text not null,
  canonical_name text not null
) on commit drop;

insert into cycle_12_15_5_alunos_policies (command, legacy_name, canonical_name) values
  ('SELECT', 'Usuário vê apenas seus alunos', 'Usuarios podem listar seus alunos'),
  ('INSERT', 'Usuário cadastra seus alunos', 'Usuarios podem cadastrar seus alunos'),
  ('UPDATE', 'Usuário edita seus alunos', 'Usuarios podem atualizar seus alunos'),
  ('DELETE', 'Usuário exclui seus alunos', 'Usuarios podem excluir seus alunos');

do $$
declare
  expected record;
  current_policy record;
  normalized_using text;
  normalized_check text;
begin
  if to_regclass('public.alunos') is null then
    raise exception 'C12.15.5 precondition failed: public.alunos is missing';
  end if;

  if not exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'alunos'
      and c.relrowsecurity
  ) then
    raise exception 'C12.15.5 precondition failed: RLS is not enabled on public.alunos';
  end if;

  for expected in select * from cycle_12_15_5_alunos_policies loop
    if (
      select count(*)
      from pg_policies p
      where p.schemaname = 'public'
        and p.tablename = 'alunos'
        and p.policyname in (expected.legacy_name, expected.canonical_name)
    ) <> 1 then
      raise exception 'C12.15.5 precondition failed: expected exactly one known % alunos policy', expected.command;
    end if;

    select p.*
      into strict current_policy
    from pg_policies p
    where p.schemaname = 'public'
      and p.tablename = 'alunos'
      and p.policyname in (expected.legacy_name, expected.canonical_name);

    if current_policy.cmd <> expected.command
       or current_policy.permissive <> 'PERMISSIVE' then
      raise exception 'C12.15.5 precondition failed: unexpected command/permissiveness for policy %', current_policy.policyname;
    end if;

    if current_policy.policyname = expected.legacy_name
       and current_policy.roles::text <> '{public}' then
      raise exception 'C12.15.5 precondition failed: legacy policy % has unexpected roles %', current_policy.policyname, current_policy.roles;
    end if;

    if current_policy.policyname = expected.canonical_name
       and current_policy.roles::text <> '{authenticated}' then
      raise exception 'C12.15.5 precondition failed: canonical policy % has unexpected roles %', current_policy.policyname, current_policy.roles;
    end if;

    normalized_using := lower(regexp_replace(coalesce(current_policy.qual, ''), '[[:space:]"()]', '', 'g'));
    normalized_check := lower(regexp_replace(coalesce(current_policy.with_check, ''), '[[:space:]"()]', '', 'g'));

    if expected.command in ('SELECT', 'UPDATE', 'DELETE')
       and normalized_using not in ('auth.uid=user_id', 'selectauth.uidasuid=user_id') then
      raise exception 'C12.15.5 precondition failed: unexpected USING expression for policy %: %', current_policy.policyname, current_policy.qual;
    end if;

    if expected.command = 'INSERT'
       and normalized_check not in ('auth.uid=user_id', 'selectauth.uidasuid=user_id') then
      raise exception 'C12.15.5 precondition failed: unexpected WITH CHECK expression for policy %: %', current_policy.policyname, current_policy.with_check;
    end if;

    if expected.command = 'UPDATE'
       and current_policy.policyname = expected.canonical_name
       and normalized_check not in ('auth.uid=user_id', 'selectauth.uidasuid=user_id') then
      raise exception 'C12.15.5 precondition failed: canonical UPDATE policy has unexpected WITH CHECK expression: %', current_policy.with_check;
    end if;

    if expected.command = 'UPDATE'
       and current_policy.policyname = expected.legacy_name
       and normalized_check not in ('', 'auth.uid=user_id') then
      raise exception 'C12.15.5 precondition failed: legacy UPDATE policy has unexpected WITH CHECK expression: %', current_policy.with_check;
    end if;
  end loop;
end
$$;

do $$
declare
  signature text;
  function_oid oid;
begin
  foreach signature in array array[
    'public.abandon_workout_execution_session(uuid)',
    'public.admin_listar_usuarios()',
    'public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)',
    'public.admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)',
    'public.aoe_user_owns_student(uuid)',
    'public.complete_workout_execution_session(uuid)',
    'public.desvincular_aluno_usuario(uuid)',
    'public.exercise_is_prescribed_to_current_student(uuid)',
    'public.get_my_workout_execution_state(integer)',
    'public.get_student_access_state(uuid)',
    'public.get_student_workout_execution_history(uuid,integer)',
    'public.manage_student_access(uuid,text,text,text)',
    'public.renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text)',
    'public.save_workout_execution(uuid,jsonb)',
    'public.set_workout_execution_updated_at()',
    'public.vincular_aluno_usuario(uuid,uuid)',
    'public.workout_execution_session_payload(uuid)'
  ] loop
    function_oid := to_regprocedure(signature);
    if function_oid is null then
      raise exception 'C12.15.5 precondition failed: expected function % is missing', signature;
    end if;

    if not exists (
      select 1
      from pg_proc p
      where p.oid = function_oid
        and p.prosecdef
        and p.proowner = 'postgres'::regrole
        and exists (
          select 1
          from unnest(coalesce(p.proconfig, array[]::text[])) config
          where config like 'search_path=%'
        )
    ) then
      raise exception 'C12.15.5 precondition failed: SECURITY DEFINER metadata drift for %', signature;
    end if;
  end loop;
end
$$;

-- Reconcile only legacy policies. Canonical policies are left untouched so a
-- physical clean bootstrap retains Cycle 12.13's wrapped auth.uid() InitPlans.
do $$
begin
  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'alunos' and policyname = 'Usuário vê apenas seus alunos') then
    drop policy "Usuário vê apenas seus alunos" on public.alunos;
    create policy "Usuarios podem listar seus alunos"
      on public.alunos for select to authenticated
      using (auth.uid() = user_id);
  end if;

  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'alunos' and policyname = 'Usuário cadastra seus alunos') then
    drop policy "Usuário cadastra seus alunos" on public.alunos;
    create policy "Usuarios podem cadastrar seus alunos"
      on public.alunos for insert to authenticated
      with check (auth.uid() = user_id);
  end if;

  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'alunos' and policyname = 'Usuário edita seus alunos') then
    drop policy "Usuário edita seus alunos" on public.alunos;
    create policy "Usuarios podem atualizar seus alunos"
      on public.alunos for update to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'alunos' and policyname = 'Usuário exclui seus alunos') then
    drop policy "Usuário exclui seus alunos" on public.alunos;
    create policy "Usuarios podem excluir seus alunos"
      on public.alunos for delete to authenticated
      using (auth.uid() = user_id);
  end if;
end
$$;

-- New public functions must receive client execution explicitly in their own
-- migration. This removes the hosted legacy default that exposed new definers.
-- PostgreSQL's per-schema defaults are added to the global defaults, so PUBLIC
-- must be revoked globally; a schema-local revoke alone cannot subtract it.
alter default privileges for role postgres
  revoke execute on functions from public;

alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated, service_role;

revoke execute on function public.abandon_workout_execution_session(uuid) from public, anon, authenticated, service_role;
revoke execute on function public.admin_listar_usuarios() from public, anon, authenticated, service_role;
revoke execute on function public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text) from public, anon, authenticated, service_role;
revoke execute on function public.admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean) from public, anon, authenticated, service_role;
revoke execute on function public.aoe_user_owns_student(uuid) from public, anon, authenticated, service_role;
revoke execute on function public.complete_workout_execution_session(uuid) from public, anon, authenticated, service_role;
revoke execute on function public.desvincular_aluno_usuario(uuid) from public, anon, authenticated, service_role;
revoke execute on function public.exercise_is_prescribed_to_current_student(uuid) from public, anon, authenticated, service_role;
revoke execute on function public.get_my_workout_execution_state(integer) from public, anon, authenticated, service_role;
revoke execute on function public.get_student_access_state(uuid) from public, anon, authenticated, service_role;
revoke execute on function public.get_student_workout_execution_history(uuid,integer) from public, anon, authenticated, service_role;
revoke execute on function public.manage_student_access(uuid,text,text,text) from public, anon, authenticated, service_role;
revoke execute on function public.renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text) from public, anon, authenticated, service_role;
revoke execute on function public.save_workout_execution(uuid,jsonb) from public, anon, authenticated, service_role;
revoke execute on function public.set_workout_execution_updated_at() from public, anon, authenticated, service_role;
revoke execute on function public.vincular_aluno_usuario(uuid,uuid) from public, anon, authenticated, service_role;
revoke execute on function public.workout_execution_session_payload(uuid) from public, anon, authenticated, service_role;

grant execute on function public.abandon_workout_execution_session(uuid) to authenticated;
grant execute on function public.admin_listar_usuarios() to authenticated, service_role;
grant execute on function public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text) to authenticated, service_role;
grant execute on function public.admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean) to authenticated, service_role;
grant execute on function public.aoe_user_owns_student(uuid) to authenticated, service_role;
grant execute on function public.complete_workout_execution_session(uuid) to authenticated;
grant execute on function public.desvincular_aluno_usuario(uuid) to authenticated;
grant execute on function public.exercise_is_prescribed_to_current_student(uuid) to authenticated, service_role;
grant execute on function public.get_my_workout_execution_state(integer) to authenticated;
grant execute on function public.get_student_access_state(uuid) to authenticated;
grant execute on function public.get_student_workout_execution_history(uuid,integer) to authenticated;
grant execute on function public.manage_student_access(uuid,text,text,text) to authenticated;
grant execute on function public.renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text) to authenticated, service_role;
grant execute on function public.save_workout_execution(uuid,jsonb) to authenticated;
grant execute on function public.vincular_aluno_usuario(uuid,uuid) to authenticated;

do $$
declare
  expected record;
begin
  for expected in
    select * from (values
      ('public.abandon_workout_execution_session(uuid)', true, false),
      ('public.admin_listar_usuarios()', true, true),
      ('public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)', true, true),
      ('public.admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)', true, true),
      ('public.aoe_user_owns_student(uuid)', true, true),
      ('public.complete_workout_execution_session(uuid)', true, false),
      ('public.desvincular_aluno_usuario(uuid)', true, false),
      ('public.exercise_is_prescribed_to_current_student(uuid)', true, true),
      ('public.get_my_workout_execution_state(integer)', true, false),
      ('public.get_student_access_state(uuid)', true, false),
      ('public.get_student_workout_execution_history(uuid,integer)', true, false),
      ('public.manage_student_access(uuid,text,text,text)', true, false),
      ('public.renovar_aluno_contrato(uuid,uuid,date,date,numeric,boolean,text,text,text)', true, true),
      ('public.save_workout_execution(uuid,jsonb)', true, false),
      ('public.set_workout_execution_updated_at()', false, false),
      ('public.vincular_aluno_usuario(uuid,uuid)', true, false),
      ('public.workout_execution_session_payload(uuid)', false, false)
    ) as matrix(signature, authenticated_execute, service_role_execute)
  loop
    if has_function_privilege('anon', expected.signature, 'EXECUTE') then
      raise exception 'C12.15.5 postcondition failed: anon can execute %', expected.signature;
    end if;
    if has_function_privilege('authenticated', expected.signature, 'EXECUTE') <> expected.authenticated_execute then
      raise exception 'C12.15.5 postcondition failed: authenticated ACL mismatch for %', expected.signature;
    end if;
    if has_function_privilege('service_role', expected.signature, 'EXECUTE') <> expected.service_role_execute then
      raise exception 'C12.15.5 postcondition failed: service_role ACL mismatch for %', expected.signature;
    end if;
  end loop;

  if exists (
    select 1
    from pg_default_acl d
    cross join lateral aclexplode(d.defaclacl) acl
    left join pg_roles grantee on grantee.oid = acl.grantee
    where d.defaclrole = 'postgres'::regrole
      and d.defaclnamespace = 'public'::regnamespace
      and d.defaclobjtype = 'f'
      and acl.privilege_type = 'EXECUTE'
      and (acl.grantee = 0 or grantee.rolname in ('anon', 'authenticated', 'service_role'))
  ) then
    raise exception 'C12.15.5 postcondition failed: public client EXECUTE remains in postgres public function default ACL';
  end if;

  if exists (
    select 1
    from pg_default_acl d
    cross join lateral aclexplode(d.defaclacl) acl
    where d.defaclrole = 'postgres'::regrole
      and d.defaclnamespace = 0
      and d.defaclobjtype = 'f'
      and acl.privilege_type = 'EXECUTE'
      and acl.grantee = 0
  ) then
    raise exception 'C12.15.5 postcondition failed: global PUBLIC function EXECUTE remains in postgres default ACL';
  end if;

  if (
    select count(*)
    from pg_policies p
    join cycle_12_15_5_alunos_policies policy_expected
      on policy_expected.canonical_name = p.policyname
     and policy_expected.command = p.cmd
    where p.schemaname = 'public'
      and p.tablename = 'alunos'
      and p.permissive = 'PERMISSIVE'
      and p.roles::text = '{authenticated}'
  ) <> 4 then
    raise exception 'C12.15.5 postcondition failed: canonical alunos policy contract is incomplete';
  end if;

  if exists (
    select 1
    from pg_policies p
    join cycle_12_15_5_alunos_policies policy_expected on policy_expected.legacy_name = p.policyname
    where p.schemaname = 'public' and p.tablename = 'alunos'
  ) then
    raise exception 'C12.15.5 postcondition failed: legacy alunos policies remain';
  end if;
end
$$;

-- The five remote-only administrative overloads are intentionally retained.
-- Repository evidence cannot prove that external service-role consumers are
-- absent; removing them remains DEFERRED_HUMAN_DECISION and no CASCADE is used.

commit;
