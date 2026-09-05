import { runPsql } from "./supabase-cycle-8-lib.mjs";

const sql = String.raw`
begin;

create extension if not exists pgtap with schema extensions;

select plan(16);

insert into auth.users (id, email)
values
  ('00000000-0000-4000-8000-000000009101', 'cycle-09-professional-a@example.invalid'),
  ('00000000-0000-4000-8000-000000009102', 'cycle-09-professional-b@example.invalid'),
  ('00000000-0000-4000-8000-000000009103', 'cycle-09-student@example.invalid')
on conflict (id) do nothing;

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status)
values
  ('00000000-0000-4000-8000-000000009101', '00000000-0000-4000-8000-000000009101', 'Cycle 09 Professional A', 'cycle-09-professional-a@example.invalid', 'user', 'assinante', 'ativo'),
  ('00000000-0000-4000-8000-000000009102', '00000000-0000-4000-8000-000000009102', 'Cycle 09 Professional B', 'cycle-09-professional-b@example.invalid', 'user', 'assinante', 'ativo'),
  ('00000000-0000-4000-8000-000000009103', '00000000-0000-4000-8000-000000009103', 'Cycle 09 Student', 'cycle-09-student@example.invalid', 'student', 'pendente', 'ativo')
on conflict (user_id) do nothing;

insert into public.exercise_library (id, origin, owner_id, name, muscle_group, category, media_type, media_path, media_mime_type)
values
  ('00000000-0000-4000-8000-000000009201', 'official', null, 'Cycle 09 Official Exercise', 'Peitoral', 'Musculacao', null, null, null),
  ('00000000-0000-4000-8000-000000009202', 'personal', '00000000-0000-4000-8000-000000009101', 'Cycle 09 Personal A', 'Costas', 'Musculacao', 'uploaded_video', '00000000-0000-4000-8000-000000009101/exercises/00000000-0000-4000-8000-000000009202/demo.mp4', 'video/mp4')
on conflict (id) do nothing;

insert into public.alunos (id, user_id, nome, whatsapp, inicio, plano, valor, student_user_id, student_access_status)
values ('00000000-0000-4000-8000-000000009301', '00000000-0000-4000-8000-000000009101', 'Cycle 09 Student', '000', current_date, 'QA', 0, '00000000-0000-4000-8000-000000009103', 'active')
on conflict (id) do nothing;

insert into public.treinos (id, user_id, aluno_id, nome_rotina, lifecycle_status, delivered_at)
values ('00000000-0000-4000-8000-000000009401', '00000000-0000-4000-8000-000000009101', '00000000-0000-4000-8000-000000009301', 'Cycle 09 Workout', 'active', now())
on conflict (id) do nothing;

insert into public.treino_dias (id, treino_id, nome)
values ('00000000-0000-4000-8000-000000009501', '00000000-0000-4000-8000-000000009401', 'A')
on conflict (id) do nothing;

insert into public.treino_exercicios (id, treino_dia_id, exercise_id, nome)
values ('00000000-0000-4000-8000-000000009601', '00000000-0000-4000-8000-000000009501', '00000000-0000-4000-8000-000000009202', 'Cycle 09 Personal A')
on conflict (id) do nothing;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000009101', true);
select is((select count(*)::int from public.exercise_library where id in ('00000000-0000-4000-8000-000000009201', '00000000-0000-4000-8000-000000009202')), 2, 'professional A reads official and own personal');
insert into public.exercise_library (origin, owner_id, name) values ('personal', '00000000-0000-4000-8000-000000009101', 'Cycle 09 Runtime Own');
select ok(exists (select 1 from public.exercise_library where name = 'Cycle 09 Runtime Own'), 'professional A creates own personal');
update public.exercise_library set instructions = 'updated' where id = '00000000-0000-4000-8000-000000009202';
select is((select instructions from public.exercise_library where id = '00000000-0000-4000-8000-000000009202'), 'updated', 'professional A edits own personal');
update public.exercise_library set status = 'archived', archived_at = now() where id = '00000000-0000-4000-8000-000000009202';
select is((select status from public.exercise_library where id = '00000000-0000-4000-8000-000000009202'), 'archived', 'professional A archives own personal');
update public.exercise_library set name = 'bad' where id = '00000000-0000-4000-8000-000000009201';
select is((select name from public.exercise_library where id = '00000000-0000-4000-8000-000000009201'), 'Cycle 09 Official Exercise', 'professional A cannot update official');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000009102', true);
select is((select count(*)::int from public.exercise_library where id = '00000000-0000-4000-8000-000000009202'), 0, 'professional B cannot read archived personal A');
update public.exercise_library set name = 'bad' where id = '00000000-0000-4000-8000-000000009202';
select is((select name from public.exercise_library where id = '00000000-0000-4000-8000-000000009202'), null, 'professional B cannot edit personal A');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000009103', true);
select is((select count(*)::int from public.exercise_library where id = '00000000-0000-4000-8000-000000009202'), 1, 'student reads prescribed exercise');
select throws_ok($$insert into public.exercise_library (origin, owner_id, name) values ('personal', '00000000-0000-4000-8000-000000009103', 'bad')$$, '42501', null, 'student cannot write library');

reset role;
set local role anon;
select throws_ok($$insert into public.exercise_library (origin, owner_id, name) values ('personal', '00000000-0000-4000-8000-000000009101', 'bad')$$, '42501', null, 'anon cannot write library');

reset role;
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000009101', true);
insert into storage.objects (bucket_id, name, owner, metadata)
values ('exercise-media', '00000000-0000-4000-8000-000000009101/exercises/00000000-0000-4000-8000-000000009202/runtime.mp4', '00000000-0000-4000-8000-000000009101', '{}'::jsonb);
select ok(exists (select 1 from storage.objects where bucket_id = 'exercise-media' and name like '00000000-0000-4000-8000-000000009101/%runtime.mp4'), 'owner uploads media');
select ok(exists (select 1 from storage.objects where bucket_id = 'exercise-media' and name like '00000000-0000-4000-8000-000000009101/%runtime.mp4'), 'owner reads media');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000009102', true);
select is((select count(*)::int from storage.objects where bucket_id = 'exercise-media' and name like '00000000-0000-4000-8000-000000009101/%runtime.mp4'), 0, 'cross-owner media read denied');
select throws_ok($$insert into storage.objects (bucket_id, name, owner, metadata) values ('exercise-media', '00000000-0000-4000-8000-000000009101/exercises/bad.mp4', '00000000-0000-4000-8000-000000009102', '{}'::jsonb)$$, '42501', null, 'cross-owner media upload denied');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000009101', true);
select ok(exists (
  select 1
  from pg_policies
  where schemaname = 'storage'
    and tablename = 'objects'
    and policyname = 'exercise_media_delete_own_folder'
), 'owner delete policy exists for Storage API path');

reset role;
set local role anon;
select throws_ok($$insert into storage.objects (bucket_id, name, owner, metadata) values ('exercise-media', '00000000-0000-4000-8000-000000009101/exercises/anon.mp4', null, '{}'::jsonb)$$, '42501', null, 'anon cannot upload media');

reset role;
select * from finish();
rollback;
`;

const result = runPsql(process.cwd(), sql, { timeoutMs: 180000, throwOnError: false });
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);

if (result.status !== 0 || /not ok/i.test(result.stdout)) {
  process.exit(1);
}

console.log("Exercise library RLS runtime validation passed.");
