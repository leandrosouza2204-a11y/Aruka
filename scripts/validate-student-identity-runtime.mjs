import { runPsql } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();

const sql = String.raw`
begin;

insert into auth.users (id, aud, role, email, email_confirmed_at, created_at, updated_at)
values
  ('10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'runtime-prof-a@example.invalid', now(), now(), now()),
  ('10000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'runtime-prof-b@example.invalid', now(), now(), now()),
  ('10000000-0000-4000-8000-000000000011', 'authenticated', 'authenticated', 'runtime-student-a@example.invalid', now(), now(), now()),
  ('10000000-0000-4000-8000-000000000012', 'authenticated', 'authenticated', 'runtime-student-b@example.invalid', now(), now(), now()),
  ('10000000-0000-4000-8000-000000000013', 'authenticated', 'authenticated', 'runtime-unlinked@example.invalid', now(), now(), now());

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status)
values
  ('10000000-0000-4000-8000-000000000101', '10000000-0000-4000-8000-000000000001', 'Runtime Prof A', 'runtime-prof-a@example.invalid', 'user', 'assinante', 'ativo'),
  ('10000000-0000-4000-8000-000000000102', '10000000-0000-4000-8000-000000000002', 'Runtime Prof B', 'runtime-prof-b@example.invalid', 'user', 'assinante', 'ativo'),
  ('10000000-0000-4000-8000-000000000111', '10000000-0000-4000-8000-000000000011', 'Runtime Student A', 'runtime-student-a@example.invalid', 'student', 'pendente', 'ativo'),
  ('10000000-0000-4000-8000-000000000112', '10000000-0000-4000-8000-000000000012', 'Runtime Student B', 'runtime-student-b@example.invalid', 'student', 'pendente', 'ativo'),
  ('10000000-0000-4000-8000-000000000113', '10000000-0000-4000-8000-000000000013', 'Runtime Unlinked', 'runtime-unlinked@example.invalid', 'student', 'pendente', 'ativo');

insert into public.alunos (id, user_id, nome, whatsapp, inicio, plano, valor, status)
values
  ('10000000-0000-4000-8000-000000000201', '10000000-0000-4000-8000-000000000001', 'Aluno A1', '+5500000000011', current_date, 'Runtime', 0, 'Ativo'),
  ('10000000-0000-4000-8000-000000000202', '10000000-0000-4000-8000-000000000002', 'Aluno B1', '+5500000000012', current_date, 'Runtime', 0, 'Ativo');

insert into public.treinos (id, user_id, aluno_id, nome_rotina, objetivo, nivel, dias_semana, observacoes, status, lifecycle_status, delivered_at, completed_at, archived_at, application_idempotency_key, template_origin_snapshot)
values
  ('10000000-0000-4000-8000-000000000301', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000201', 'A active', 'Forca', 'Inicial', 1, '', 'Ativo', 'active', now(), null, null, 'runtime-active', '{"secret":true}'::jsonb),
  ('10000000-0000-4000-8000-000000000302', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000201', 'A completed', 'Forca', 'Inicial', 1, '', 'Finalizado', 'completed', now(), now(), null, 'runtime-completed', '{"secret":true}'::jsonb),
  ('10000000-0000-4000-8000-000000000303', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000201', 'A draft', 'Forca', 'Inicial', 1, '', 'Em revisao', 'draft', null, null, null, 'runtime-draft', '{"secret":true}'::jsonb),
  ('10000000-0000-4000-8000-000000000304', '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000201', 'A archived', 'Forca', 'Inicial', 1, '', 'Ativo', 'archived', now(), null, now(), 'runtime-archived', '{"secret":true}'::jsonb),
  ('10000000-0000-4000-8000-000000000305', '10000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000202', 'B active', 'Forca', 'Inicial', 1, '', 'Ativo', 'active', now(), null, null, 'runtime-b-active', '{"secret":true}'::jsonb);

insert into public.treino_dias (id, treino_id, nome, grupo_muscular, ordem)
values
  ('10000000-0000-4000-8000-000000000401', '10000000-0000-4000-8000-000000000301', 'Dia A active', '', 1),
  ('10000000-0000-4000-8000-000000000402', '10000000-0000-4000-8000-000000000302', 'Dia A completed', '', 1),
  ('10000000-0000-4000-8000-000000000405', '10000000-0000-4000-8000-000000000305', 'Dia B active', '', 1);

insert into public.treino_exercicios (id, treino_dia_id, nome, series, repeticoes, carga, descanso, observacoes, video_url, ordem)
values
  ('10000000-0000-4000-8000-000000000501', '10000000-0000-4000-8000-000000000401', 'Agachamento', '3', '10', '', '60s', '', '', 1),
  ('10000000-0000-4000-8000-000000000502', '10000000-0000-4000-8000-000000000402', 'Supino', '3', '10', '', '60s', '', '', 1),
  ('10000000-0000-4000-8000-000000000505', '10000000-0000-4000-8000-000000000405', 'Remada', '3', '10', '', '60s', '', '', 1);

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select public.vincular_aluno_usuario('10000000-0000-4000-8000-000000000201', '10000000-0000-4000-8000-000000000011');

do $$
begin
  begin
    perform public.vincular_aluno_usuario('10000000-0000-4000-8000-000000000202', '10000000-0000-4000-8000-000000000012');
    raise exception 'expected cross professional link to fail';
  exception when insufficient_privilege then
    null;
  end;

  begin
    perform public.vincular_aluno_usuario('10000000-0000-4000-8000-000000000202', '10000000-0000-4000-8000-000000000011');
    raise exception 'expected reused account link to fail';
  exception when insufficient_privilege or unique_violation then
    null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000011', true);

do $$
declare
  payload jsonb := public.get_my_student_workouts();
  text_payload text := payload::text;
begin
  if jsonb_array_length(payload->'activeWorkouts') <> 1 then raise exception 'expected one active workout'; end if;
  if jsonb_array_length(payload->'completedWorkouts') <> 1 then raise exception 'expected one completed workout'; end if;
  if text_payload like '%A draft%' then raise exception 'draft leaked'; end if;
  if text_payload like '%A archived%' then raise exception 'archived leaked'; end if;
  if text_payload like '%B active%' then raise exception 'cross student leaked'; end if;
  if text_payload like '%template_origin_snapshot%' or text_payload like '%application_idempotency_key%' then raise exception 'technical key leaked'; end if;

  begin
    perform public.entregar_treino('10000000-0000-4000-8000-000000000301');
    raise exception 'student delivered workout';
  exception when insufficient_privilege then
    null;
  end;

  update public.treinos set nome_rotina = 'student mutation' where id = '10000000-0000-4000-8000-000000000301';
  if found then raise exception 'student updated workout'; end if;

  update public.alunos set student_user_id = null where id = '10000000-0000-4000-8000-000000000201';
  if found then raise exception 'student changed link'; end if;
end $$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000012', true);
do $$
declare
  payload jsonb := public.get_my_student_workouts();
begin
  if payload->'student' <> 'null'::jsonb then raise exception 'student B should be unlinked'; end if;
  if jsonb_array_length(payload->'activeWorkouts') <> 0 then raise exception 'student B received active workouts'; end if;
end $$;

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000013', true);
do $$
declare
  payload jsonb := public.get_my_student_workouts();
begin
  if payload->'student' <> 'null'::jsonb then raise exception 'unlinked user should have null student'; end if;
end $$;

reset role;

delete from auth.users where id = '10000000-0000-4000-8000-000000000011';
do $$
begin
  if not exists (select 1 from public.alunos where id = '10000000-0000-4000-8000-000000000201' and student_user_id is null) then
    raise exception 'auth deletion did not set student_user_id null or removed aluno';
  end if;
  if not exists (select 1 from public.treinos where id = '10000000-0000-4000-8000-000000000301') then
    raise exception 'auth deletion removed workouts';
  end if;
end $$;

rollback;
`;

const result = runPsql(root, sql, { timeoutMs: 120000 });
if (result.status !== 0) {
  console.error(result.stderr || result.stdout);
  process.exit(1);
}

console.log("STUDENT_IDENTITY_RUNTIME_VALIDATED");
