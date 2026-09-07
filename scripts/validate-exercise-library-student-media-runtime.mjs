import { runPsql } from "./supabase-cycle-8-lib.mjs";

const sql = String.raw`
begin;

create extension if not exists pgtap with schema extensions;

select plan(18);

insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-4000-8000-000000097101', 'authenticated', 'authenticated', 'stage-09-7-professional-a@example.test', crypt('password', gen_salt('bf')), now(), now(), now()),
  ('00000000-0000-4000-8000-000000097102', 'authenticated', 'authenticated', 'stage-09-7-professional-b@example.test', crypt('password', gen_salt('bf')), now(), now(), now()),
  ('00000000-0000-4000-8000-000000097111', 'authenticated', 'authenticated', 'stage-09-7-student-a@example.test', crypt('password', gen_salt('bf')), now(), now(), now()),
  ('00000000-0000-4000-8000-000000097112', 'authenticated', 'authenticated', 'stage-09-7-student-b@example.test', crypt('password', gen_salt('bf')), now(), now(), now())
on conflict (id) do nothing;

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status)
values
  ('00000000-0000-4000-8000-000000097101', '00000000-0000-4000-8000-000000097101', 'Professional A 09.7', 'stage-09-7-professional-a@example.test', 'user', 'assinante', 'ativo'),
  ('00000000-0000-4000-8000-000000097102', '00000000-0000-4000-8000-000000097102', 'Professional B 09.7', 'stage-09-7-professional-b@example.test', 'user', 'assinante', 'ativo'),
  ('00000000-0000-4000-8000-000000097111', '00000000-0000-4000-8000-000000097111', 'Student A 09.7', 'stage-09-7-student-a@example.test', 'student', 'pendente', 'ativo'),
  ('00000000-0000-4000-8000-000000097112', '00000000-0000-4000-8000-000000097112', 'Student B 09.7', 'stage-09-7-student-b@example.test', 'student', 'pendente', 'ativo')
on conflict (user_id) do nothing;

insert into public.alunos (id, user_id, nome, whatsapp, inicio, plano, valor, student_user_id, student_access_status)
values
  ('00000000-0000-4000-8000-000000097201', '00000000-0000-4000-8000-000000097101', 'Aluno A 09.7', '11000000001', current_date, 'QA', 0, '00000000-0000-4000-8000-000000097111', 'active'),
  ('00000000-0000-4000-8000-000000097202', '00000000-0000-4000-8000-000000097102', 'Aluno B 09.7', '11000000002', current_date, 'QA', 0, '00000000-0000-4000-8000-000000097112', 'active')
on conflict (id) do nothing;

insert into public.exercise_library (id, owner_id, origin, name, muscle_group, category, instructions, youtube_url, media_type, media_path, media_mime_type, status)
values
  ('00000000-0000-4000-8000-000000097301', '00000000-0000-4000-8000-000000097101', 'personal', 'Video A', 'Costas', 'Musculacao', 'A', '', 'uploaded_video', '00000000-0000-4000-8000-000000097101/exercises/00000000-0000-4000-8000-000000097301/00000000-0000-4000-8000-000000097901.mp4', 'video/mp4', 'active'),
  ('00000000-0000-4000-8000-000000097302', '00000000-0000-4000-8000-000000097101', 'personal', 'YouTube A', 'Peitoral', 'Musculacao', 'A', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', null, null, 'active'),
  ('00000000-0000-4000-8000-000000097303', '00000000-0000-4000-8000-000000097102', 'personal', 'Video B', 'Pernas', 'Musculacao', 'B', '', 'uploaded_video', '00000000-0000-4000-8000-000000097102/exercises/00000000-0000-4000-8000-000000097303/00000000-0000-4000-8000-000000097903.mp4', 'video/mp4', 'active'),
  ('00000000-0000-4000-8000-000000097304', '00000000-0000-4000-8000-000000097101', 'personal', 'Unprescribed A', 'Ombros', 'Musculacao', 'A', '', 'uploaded_video', '00000000-0000-4000-8000-000000097101/exercises/00000000-0000-4000-8000-000000097304/00000000-0000-4000-8000-000000097904.mp4', 'video/mp4', 'active')
on conflict (id) do nothing;

insert into public.treinos (id, user_id, aluno_id, nome_rotina, lifecycle_status, delivered_at, completed_at, archived_at)
values
  ('00000000-0000-4000-8000-000000097401', '00000000-0000-4000-8000-000000097101', '00000000-0000-4000-8000-000000097201', 'Active A', 'active', now(), null, null),
  ('00000000-0000-4000-8000-000000097402', '00000000-0000-4000-8000-000000097101', '00000000-0000-4000-8000-000000097201', 'Completed A', 'completed', now() - interval '20 days', now() - interval '1 day', null),
  ('00000000-0000-4000-8000-000000097403', '00000000-0000-4000-8000-000000097101', '00000000-0000-4000-8000-000000097201', 'Draft A', 'draft', null, null, null),
  ('00000000-0000-4000-8000-000000097404', '00000000-0000-4000-8000-000000097101', '00000000-0000-4000-8000-000000097201', 'Archived A', 'archived', now() - interval '40 days', null, now()),
  ('00000000-0000-4000-8000-000000097405', '00000000-0000-4000-8000-000000097102', '00000000-0000-4000-8000-000000097202', 'Active B', 'active', now(), null, null)
on conflict (id) do nothing;

insert into public.treino_dias (id, treino_id, nome, ordem)
values
  ('00000000-0000-4000-8000-000000097501', '00000000-0000-4000-8000-000000097401', 'A', 1),
  ('00000000-0000-4000-8000-000000097502', '00000000-0000-4000-8000-000000097402', 'A', 1),
  ('00000000-0000-4000-8000-000000097503', '00000000-0000-4000-8000-000000097403', 'A', 1),
  ('00000000-0000-4000-8000-000000097504', '00000000-0000-4000-8000-000000097404', 'A', 1),
  ('00000000-0000-4000-8000-000000097505', '00000000-0000-4000-8000-000000097405', 'B', 1)
on conflict (id) do nothing;

insert into public.treino_exercicios (id, treino_dia_id, exercise_id, nome, exercise_media_snapshot, ordem)
values
  ('00000000-0000-4000-8000-000000097601', '00000000-0000-4000-8000-000000097501', '00000000-0000-4000-8000-000000097301', 'Video A', '{"schemaVersion":1,"exerciseId":"00000000-0000-4000-8000-000000097301","source":"personal","name":"Video A","media":{"type":"uploaded_video","mediaPath":"00000000-0000-4000-8000-000000097101/exercises/00000000-0000-4000-8000-000000097301/00000000-0000-4000-8000-000000097901.mp4","mimeType":"video/mp4"}}'::jsonb, 1),
  ('00000000-0000-4000-8000-000000097602', '00000000-0000-4000-8000-000000097501', '00000000-0000-4000-8000-000000097302', 'YouTube A', '{"schemaVersion":1,"exerciseId":"00000000-0000-4000-8000-000000097302","source":"personal","name":"YouTube A","media":{"type":"youtube","videoId":"dQw4w9WgXcQ","youtubeUrl":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}}'::jsonb, 2),
  ('00000000-0000-4000-8000-000000097603', '00000000-0000-4000-8000-000000097501', null, 'Manual sem midia', '{"schemaVersion":1,"name":"Manual sem midia","media":{"type":""}}'::jsonb, 3),
  ('00000000-0000-4000-8000-000000097604', '00000000-0000-4000-8000-000000097502', '00000000-0000-4000-8000-000000097301', 'Video A completed', '{"schemaVersion":1,"exerciseId":"00000000-0000-4000-8000-000000097301","source":"personal","name":"Video A completed","media":{"type":"uploaded_video","mediaPath":"00000000-0000-4000-8000-000000097101/exercises/00000000-0000-4000-8000-000000097301/00000000-0000-4000-8000-000000097901.mp4","mimeType":"video/mp4"}}'::jsonb, 1),
  ('00000000-0000-4000-8000-000000097605', '00000000-0000-4000-8000-000000097503', '00000000-0000-4000-8000-000000097301', 'Draft media', '{"schemaVersion":1,"media":{"type":"uploaded_video","mediaPath":"00000000-0000-4000-8000-000000097101/exercises/00000000-0000-4000-8000-000000097301/00000000-0000-4000-8000-000000097901.mp4","mimeType":"video/mp4"}}'::jsonb, 1),
  ('00000000-0000-4000-8000-000000097606', '00000000-0000-4000-8000-000000097504', '00000000-0000-4000-8000-000000097301', 'Archived media', '{"schemaVersion":1,"media":{"type":"uploaded_video","mediaPath":"00000000-0000-4000-8000-000000097101/exercises/00000000-0000-4000-8000-000000097301/00000000-0000-4000-8000-000000097901.mp4","mimeType":"video/mp4"}}'::jsonb, 1),
  ('00000000-0000-4000-8000-000000097607', '00000000-0000-4000-8000-000000097505', '00000000-0000-4000-8000-000000097303', 'Video B', '{"schemaVersion":1,"media":{"type":"uploaded_video","mediaPath":"00000000-0000-4000-8000-000000097102/exercises/00000000-0000-4000-8000-000000097303/00000000-0000-4000-8000-000000097903.mp4","mimeType":"video/mp4"}}'::jsonb, 1)
on conflict (id) do nothing;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000097111', true);

select is((public.get_my_student_workouts() #>> '{student,name}'), 'Aluno A 09.7', 'Student A resolves own linked student identity');
select is(jsonb_array_length(public.get_my_student_workouts()->'activeWorkouts'), 1, 'Student A reads one active workout');
select is(jsonb_array_length(public.get_my_student_workouts()->'completedWorkouts'), 1, 'Student A reads one completed workout');
select ok((public.get_my_student_workouts()::text like '%YouTube A%') and (public.get_my_student_workouts()::text like '%dQw4w9WgXcQ%'), 'Student A receives prescribed YouTube snapshot');
select ok(public.get_my_student_workouts()::text like '%uploaded_video%', 'Student A receives uploaded media marker');
select ok(public.get_my_student_workouts()::text not like '%00000000-0000-4000-8000-000000097101/exercises%', 'Workout payload does not expose uploaded storage path');
select ok(public.get_my_student_workouts()::text like '%Manual sem midia%', 'Student A receives no-media manual exercise text');
select ok(public.get_my_student_workouts()::text not like '%Draft A%' and public.get_my_student_workouts()::text not like '%Archived A%', 'Draft and archived workouts are denied');
select is((public.get_my_student_exercise_media('00000000-0000-4000-8000-000000097601'::uuid)->>'ttlSeconds')::int, 600, 'Student A gets uploaded media TTL');
select ok(public.get_my_student_exercise_media('00000000-0000-4000-8000-000000097601'::uuid)->>'mediaPath' like '00000000-0000-4000-8000-000000097101/exercises/%', 'Student A gets only prescribed on-demand media path');
select is(public.get_my_student_exercise_media('00000000-0000-4000-8000-000000097603'::uuid)->>'type', '', 'FK null no-media exercise does not create private media access');
select throws_ok($$select public.get_my_student_exercise_media('00000000-0000-4000-8000-000000097605'::uuid)$$, '42501', null, 'Student A cannot access draft media');
select throws_ok($$select public.get_my_student_exercise_media('00000000-0000-4000-8000-000000097606'::uuid)$$, '42501', null, 'Student A cannot access archived media');
select throws_ok($$select public.get_my_student_exercise_media('00000000-0000-4000-8000-000000097607'::uuid)$$, '42501', null, 'Student A cannot access Student B media');
select is((select count(*)::int from public.exercise_library where id = '00000000-0000-4000-8000-000000097304'), 0, 'Student A cannot browse unprescribed personal exercise');

update public.exercise_library set status = 'archived', archived_at = now() where id = '00000000-0000-4000-8000-000000097301';
select ok(public.get_my_student_workouts()::text like '%Video A%', 'Archived library exercise keeps rendering prescribed snapshot');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000097112', true);
select throws_ok($$select public.get_my_student_exercise_media('00000000-0000-4000-8000-000000097601'::uuid)$$, '42501', null, 'Student B cannot access Student A media');

reset role;
set local role anon;
select throws_ok($$select public.get_my_student_workouts()$$, '42501', null, 'Anonymous cannot execute student workout RPC');

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

console.log("EXERCISE_LIBRARY_STUDENT_MEDIA_RUNTIME=PASS");
