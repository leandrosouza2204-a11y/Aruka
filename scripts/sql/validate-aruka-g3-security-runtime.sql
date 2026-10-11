\pset tuples_only on
\pset format unaligned
\pset fieldsep '|'

begin;

-- pg_dump does not carry the managed platform's global role/bootstrap state.
-- The official local stack grants this USAGE; emulate it only in this rolled
-- back fixture so auth.users foreign-key checks run under the production role.
grant usage on schema auth to supabase_auth_admin;

do $$
declare
  v_count bigint;
  v_signature text;
begin
  select count(*) into v_count from pg_policies where schemaname='public'
    and ((coalesce(qual,'') like '%auth.uid()%' and coalesce(qual,'') not like '%SELECT auth.uid()%')
      or (coalesce(with_check,'') like '%auth.uid()%' and coalesce(with_check,'') not like '%SELECT auth.uid()%'));
  if v_count <> 0 then raise exception 'direct auth.uid policy expressions remain: %',v_count; end if;
  select count(*) into v_count from pg_policies where schemaname='public'
    and (coalesce(qual,'') like '%SELECT auth.uid()%' or coalesce(with_check,'') like '%SELECT auth.uid()%');
  if v_count <> 69 then raise exception 'optimized policy expression count mismatch: %',v_count; end if;
  foreach v_signature in array array[
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
    if has_function_privilege('anon',v_signature,'execute') then
      raise exception 'anon execute remains on reconciled signature %',v_signature;
    end if;
  end loop;
  if has_schema_privilege('anon','public','create') or has_schema_privilege('authenticated','public','create') then
    raise exception 'client role can create objects in public schema';
  end if;
end $$;

create function public.aruka_g3_default_acl_probe() returns boolean
language sql security definer set search_path='' as $$ select true $$;
do $$ begin
  if has_function_privilege('anon','public.aruka_g3_default_acl_probe()','execute')
    or has_function_privilege('authenticated','public.aruka_g3_default_acl_probe()','execute')
    or has_function_privilege('service_role','public.aruka_g3_default_acl_probe()','execute') then
    raise exception 'default function ACL grants client execute';
  end if;
end $$;

insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at) values
('00000000-0000-4000-8000-000000003301','authenticated','authenticated','g3-a@example.invalid',now(),now(),now()),
('00000000-0000-4000-8000-000000003302','authenticated','authenticated','g3-b@example.invalid',now(),now(),now());
insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano) values
('00000000-0000-4000-8000-000000003311','00000000-0000-4000-8000-000000003301','G3 A','1',current_date,'QA'),
('00000000-0000-4000-8000-000000003312','00000000-0000-4000-8000-000000003302','G3 B','2',current_date,'QA');

-- Production currently denies authenticated direct table privileges; exercise
-- the policy predicates with fixture-only grants, all reverted at ROLLBACK.
grant select,insert,update,delete on public.alunos to authenticated;

set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-4000-8000-000000003301';
do $$ begin
  if (select count(*) from public.alunos where id in ('00000000-0000-4000-8000-000000003311','00000000-0000-4000-8000-000000003312')) <> 1 then
    raise exception 'cross-professional select isolation failed';
  end if;
  update public.alunos set nome='cross' where id='00000000-0000-4000-8000-000000003312';
  if found then raise exception 'cross-professional update allowed'; end if;
  delete from public.alunos where id='00000000-0000-4000-8000-000000003312';
  if found then raise exception 'cross-professional delete allowed'; end if;
end $$;
reset role;

set local role anon;
do $$ begin
  begin
    perform count(*) from public.alunos;
    raise exception 'anon table read allowed';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

select 'security','rls_runtime_isolation','PASS';
select 'security','optimized_policy_matrix','PASS';
select 'security','reconciled_definer_matrix_17','PASS';
select 'security','public_schema_create_denied','PASS';
select 'security','function_acl_and_defaults','PASS';
select 'security','anon_denied','PASS';
rollback;
