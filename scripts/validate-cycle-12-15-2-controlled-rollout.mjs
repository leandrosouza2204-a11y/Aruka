import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const migration = readFileSync("supabase/migrations/20261003163830_cycle12_controlled_rollout_foundation.sql", "utf8");

assert.equal(validateLocalGuard(root).ok, true, "local-only guard must pass");
assert.match(migration, /values \(true, 1, false, false, 'DEFAULT_OFF'\)/i);
assert.match(migration, /create schema if not exists private/i);
assert.match(migration, /revoke all on all tables in schema private from public, anon, authenticated/i);
assert.match(migration, /set search_path = ''/i);
assert.match(migration, /WORKOUT_EXECUTION_V2_NOT_ELIGIBLE/i);
assert.match(migration, /exception when unique_violation/i);
assert.match(migration, /SESSION_EXPERIENCE_CONFLICT/i);
assert.doesNotMatch(migration, /grant\s+(?:select|insert|update|delete).*student_experience_rollout_(?:config|targets)/i);

const runtime = runPsql(root, String.raw`
begin;

insert into auth.users (id, aud, role, email, email_confirmed_at, created_at, updated_at) values
('00000000-0000-4000-8000-000000121501','authenticated','authenticated','c1215-prof@example.test',now(),now(),now()),
('00000000-0000-4000-8000-000000121502','authenticated','authenticated','c1215-a@example.test',now(),now(),now()),
('00000000-0000-4000-8000-000000121503','authenticated','authenticated','c1215-b@example.test',now(),now(),now()),
('00000000-0000-4000-8000-000000121504','authenticated','authenticated','c1215-inactive@example.test',now(),now(),now()),
('00000000-0000-4000-8000-000000121505','authenticated','authenticated','c1215-admin@example.test',now(),now(),now());

insert into public.perfis(user_id, role, tipo_acesso, status) values
('00000000-0000-4000-8000-000000121501','user','beta','ativo'),
('00000000-0000-4000-8000-000000121505','admin','admin','ativo');

insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,student_user_id,student_access_status) values
('00000000-0000-4000-8000-000000121511','00000000-0000-4000-8000-000000121501','A','1',current_date,'QA','00000000-0000-4000-8000-000000121502','active'),
('00000000-0000-4000-8000-000000121512','00000000-0000-4000-8000-000000121501','B','2',current_date,'QA','00000000-0000-4000-8000-000000121503','active'),
('00000000-0000-4000-8000-000000121513','00000000-0000-4000-8000-000000121501','I','3',current_date,'QA','00000000-0000-4000-8000-000000121504','suspended');

do $$
begin
  if private.resolve_student_experience_route(null)->>'reasonCode' <> 'AUTH_REQUIRED' then raise exception 'null identity did not fail closed'; end if;
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000121501')->>'experience' <> 'professional' then raise exception 'professional precedence failed'; end if;
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000121502')->>'reasonCode' <> 'GLOBAL_DISABLED' then raise exception 'global OFF failed'; end if;
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000121504')->>'reasonCode' <> 'STUDENT_ACCESS_INACTIVE' then raise exception 'inactive access failed'; end if;
end $$;

update private.student_experience_rollout_config set global_enabled=true, config_version=2, reason='QA';
do $$ begin
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000121502')->>'reasonCode' <> 'NOT_IN_COHORT' then raise exception 'default deny failed'; end if;
end $$;

insert into private.student_experience_rollout_targets(target_type,target_id,enabled,reason) values
('professional','00000000-0000-4000-8000-000000121501',true,'QA');
do $$ begin
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000121503')->>'experience' <> 'v2' then raise exception 'professional cohort failed'; end if;
end $$;

insert into private.student_experience_rollout_targets(target_type,target_id,enabled,reason) values
('student','00000000-0000-4000-8000-000000121511',false,'QA');
do $$ begin
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000121502')->>'reasonCode' <> 'STUDENT_EXPLICIT_DENY' then raise exception 'student deny precedence failed'; end if;
end $$;
update private.student_experience_rollout_targets set enabled=true where target_type='student' and target_id='00000000-0000-4000-8000-000000121511';

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000121502',true);
do $$ begin
  if public.get_my_student_experience_route()->>'experience' <> 'v2' then raise exception 'public auth-derived decision failed'; end if;
end $$;
reset role;

insert into public.treinos(id,user_id,aluno_id,nome_rotina,lifecycle_status,delivered_at)
values('00000000-0000-4000-8000-000000121521','00000000-0000-4000-8000-000000121501','00000000-0000-4000-8000-000000121511','QA','active',now());
insert into public.workout_execution_sessions(id,aluno_id,treino_id,status,session_date,experience_origin)
values('00000000-0000-4000-8000-000000121531','00000000-0000-4000-8000-000000121511','00000000-0000-4000-8000-000000121521','in_progress',current_date,'v2');
update private.student_experience_rollout_config set emergency_blocked=true, config_version=3;
do $$ begin
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000121502')->>'reasonCode' <> 'ACTIVE_V2_WORKOUT' then raise exception 'active pin was not preserved'; end if;
end $$;
update public.workout_execution_sessions set status='cancelled', cancelled_at=now() where id='00000000-0000-4000-8000-000000121531';
do $$ begin
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000121502')->>'reasonCode' <> 'EMERGENCY_BLOCKED' then raise exception 'terminal reevaluation failed'; end if;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000121505',true);
select public.admin_set_student_experience_rollout_config(false,false,'QA admin audit');
reset role;
do $$ begin
  if (select config_version from private.student_experience_rollout_config where singleton) <> 4 then raise exception 'admin config version failed'; end if;
  if (select count(*) from private.student_experience_rollout_audit where action_type='config_updated') <> 1 then raise exception 'admin audit failed'; end if;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000121502',true);
do $$
declare denied boolean := false;
begin
  begin
    perform public.admin_set_student_experience_rollout_config(true,false,'must deny');
  exception when others then
    denied := position('Acesso negado' in sqlerrm) > 0;
  end;
  if not denied then raise exception 'non-admin config mutation was not denied'; end if;
end $$;
reset role;

delete from private.student_experience_rollout_config;
do $$ begin
  if private.resolve_student_experience_route('00000000-0000-4000-8000-000000121502')->>'reasonCode' <> 'CONFIG_UNAVAILABLE' then raise exception 'missing config did not fail closed'; end if;
  if has_table_privilege('authenticated','private.student_experience_rollout_config','select') then raise exception 'authenticated can read config'; end if;
  if has_table_privilege('anon','private.student_experience_rollout_targets','select') then raise exception 'anon can read targets'; end if;
  if has_function_privilege('anon','public.get_my_student_experience_route()','execute') then raise exception 'anon can execute decision'; end if;
  if not has_function_privilege('authenticated','public.get_my_student_experience_route()','execute') then raise exception 'authenticated lacks decision execute'; end if;
end $$;

rollback;
`);

assert.equal(runtime.status, 0, runtime.stderr || runtime.stdout);
console.log("CYCLE_12_15_2_STATIC_SECURITY=PASS");
console.log("CYCLE_12_15_2_DECISION_MATRIX=PASS");
console.log("CYCLE_12_15_2_PINNING_MATRIX=PASS");
console.log("CYCLE_12_15_2_PRIVATE_CONFIG_ACCESS=PASS");
console.log("CYCLE_12_15_2_ADMIN_AUDIT=PASS");
console.log("CYCLE_12_15_2_ROLLOUT_STATE=OFF");
