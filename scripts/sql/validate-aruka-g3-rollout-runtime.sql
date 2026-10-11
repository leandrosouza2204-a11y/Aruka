\pset tuples_only on
\pset format unaligned
\pset fieldsep '|'

begin;
-- See validate-aruka-g3-security-runtime.sql. This grant is fixture-only and
-- is rolled back with all synthetic identities and rollout changes.
grant usage on schema auth to supabase_auth_admin;
insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at) values
('00000000-0000-4000-8000-000000003401','authenticated','authenticated','g3-prof@example.invalid',now(),now(),now()),
('00000000-0000-4000-8000-000000003402','authenticated','authenticated','g3-student-a@example.invalid',now(),now(),now()),
('00000000-0000-4000-8000-000000003403','authenticated','authenticated','g3-student-b@example.invalid',now(),now(),now());
insert into public.perfis(user_id,role,tipo_acesso,status) values
('00000000-0000-4000-8000-000000003401','user','beta','ativo');
insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,student_user_id,student_access_status) values
('00000000-0000-4000-8000-000000003411','00000000-0000-4000-8000-000000003401','G3 Student A','1',current_date,'QA','00000000-0000-4000-8000-000000003402','active'),
('00000000-0000-4000-8000-000000003412','00000000-0000-4000-8000-000000003401','G3 Student B','2',current_date,'QA','00000000-0000-4000-8000-000000003403','active');

do $$ begin
  if private.resolve_student_experience_route(null)->>'reasonCode' <> 'AUTH_REQUIRED' then raise exception 'null identity not denied'; end if;
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000003401')->>'experience' <> 'professional' then raise exception 'professional precedence failed'; end if;
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000003402')->>'reasonCode' <> 'GLOBAL_DISABLED' then raise exception 'default OFF failed'; end if;
end $$;

update private.student_experience_rollout_config set global_enabled=true,config_version=config_version+1,reason='G3_ROLLBACK_FIXTURE';
do $$ begin
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000003402')->>'reasonCode' <> 'NOT_IN_COHORT' then raise exception 'default deny failed'; end if;
end $$;
insert into private.student_experience_rollout_targets(target_type,target_id,enabled,reason)
values('student','00000000-0000-4000-8000-000000003411',true,'G3_ROLLBACK_FIXTURE');

do $$ begin
  if has_table_privilege('authenticated','private.student_experience_rollout_config','select') then raise exception 'authenticated can read private config'; end if;
  if has_table_privilege('authenticated','private.student_experience_rollout_targets','select') then raise exception 'authenticated can read private targets'; end if;
end $$;

set local role authenticated;
set local request.jwt.claim.sub='00000000-0000-4000-8000-000000003402';
do $$ begin
  if public.get_my_student_experience_route()->>'experience' <> 'v2' then raise exception 'owned student target failed'; end if;
end $$;
reset role;

select 'application','route_default_off','PASS';
select 'application','route_default_deny','PASS';
select 'application','student_identity_isolation','PASS';
select 'application','private_rollout_tables','PASS';
select 'application','synthetic_transaction_rollback','PASS';
rollback;
