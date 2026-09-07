import { runPsql } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const sql = String.raw`
do $$
declare
  v_professional_a uuid := '00000000-0000-4000-8000-000000009601'::uuid;
  v_professional_b uuid := '00000000-0000-4000-8000-000000009602'::uuid;
  v_student_a uuid := '00000000-0000-4000-8000-000000009611'::uuid;
  v_student_b uuid := '00000000-0000-4000-8000-000000009612'::uuid;
  v_official_exercise uuid := '00000000-0000-4000-8000-000000009621'::uuid;
  v_personal_a_exercise uuid := '00000000-0000-4000-8000-000000009622'::uuid;
  v_personal_b_exercise uuid := '00000000-0000-4000-8000-000000009623'::uuid;
  v_workout_id uuid;
  v_snapshot jsonb := jsonb_build_object(
    'schemaVersion', 1,
    'exerciseId', v_personal_a_exercise::text,
    'source', 'personal',
    'name', 'Remada particular',
    'media', jsonb_build_object(
      'type', 'uploaded_video',
      'mediaPath', v_professional_a::text || '/exercises/' || v_personal_a_exercise::text || '/video.mp4',
      'mimeType', 'video/mp4',
      'thumbnailPath', ''
    )
  );
  v_payload jsonb;
begin
  delete from public.treinos where aluno_id in (v_student_a, v_student_b);
  delete from public.exercise_library where id in (v_official_exercise, v_personal_a_exercise, v_personal_b_exercise);
  delete from public.alunos where id in (v_student_a, v_student_b);
  delete from auth.users where id in (v_professional_a, v_professional_b);

  insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  values
    (v_professional_a, 'authenticated', 'authenticated', 'stage-09-6-a@example.test', crypt('password', gen_salt('bf')), now(), now(), now()),
    (v_professional_b, 'authenticated', 'authenticated', 'stage-09-6-b@example.test', crypt('password', gen_salt('bf')), now(), now(), now());

  insert into public.alunos (id, user_id, nome, whatsapp, inicio, plano)
  values
    (v_student_a, v_professional_a, 'Aluno A 09.6', '11999990001', current_date, 'Plano'),
    (v_student_b, v_professional_b, 'Aluno B 09.6', '11999990002', current_date, 'Plano');

  insert into public.exercise_library (id, owner_id, origin, name, muscle_group, category, instructions, youtube_url, media_type, media_path, media_mime_type, status)
  values
    (v_official_exercise, null, 'official', 'Agachamento oficial', 'Quadriceps', 'Forca', 'Controle o movimento.', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube', null, null, 'active'),
    (v_personal_a_exercise, v_professional_a, 'personal', 'Remada particular', 'Costas', 'Forca', 'Escapulas firmes.', '', 'uploaded_video', v_professional_a::text || '/exercises/' || v_personal_a_exercise::text || '/video.mp4', 'video/mp4', 'active'),
    (v_personal_b_exercise, v_professional_b, 'personal', 'Supino outro profissional', 'Peitoral', 'Forca', 'Nao deve cruzar.', '', null, null, null, 'active');

  perform set_config('request.jwt.claim.sub', v_professional_a::text, true);
  perform set_config('request.jwt.claim.role', 'authenticated', true);

  v_payload := jsonb_build_object(
    'alunoId', v_student_a::text,
    'rotina', 'Treino biblioteca 09.6',
    'status', 'Ativo',
    'dias', jsonb_build_array(jsonb_build_object(
      'nome', 'A',
      'exercicios', jsonb_build_array(
        jsonb_build_object(
          'nome', 'Remada particular',
          'series', '4',
          'repeticoes', '10',
          'exerciseId', v_personal_a_exercise::text,
          'exerciseMediaSnapshot', v_snapshot
        ),
        jsonb_build_object(
          'nome', 'Livre manual',
          'series', '3',
          'repeticoes', '12',
          'exerciseId', '',
          'exerciseMediaSnapshot', '{}'::jsonb
        )
      )
    ))
  );

  v_workout_id := (public.salvar_treino_composto(v_payload)->>'id')::uuid;

  if not exists (
    select 1
    from public.treino_exercicios te
    join public.treino_dias td on td.id = te.treino_dia_id
    where td.treino_id = v_workout_id
      and te.exercise_id = v_personal_a_exercise
      and te.exercise_media_snapshot = v_snapshot
  ) then
    raise exception 'workout library exercise reference/snapshot was not persisted';
  end if;

  if not exists (
    select 1
    from public.treino_exercicios te
    join public.treino_dias td on td.id = te.treino_dia_id
    where td.treino_id = v_workout_id
      and te.nome = 'Livre manual'
      and te.exercise_id is null
      and te.exercise_media_snapshot = '{}'::jsonb
  ) then
    raise exception 'manual workout exercise did not remain nullable';
  end if;

  begin
    perform public.salvar_treino_composto(jsonb_build_object(
      'alunoId', v_student_a::text,
      'rotina', 'Treino cross-owner 09.6',
      'dias', jsonb_build_array(jsonb_build_object(
        'nome', 'A',
        'exercicios', jsonb_build_array(jsonb_build_object(
          'nome', 'Supino outro profissional',
          'exerciseId', v_personal_b_exercise::text,
          'exerciseMediaSnapshot', jsonb_build_object('schemaVersion', 1, 'exerciseId', v_personal_b_exercise::text, 'source', 'personal', 'name', 'Supino outro profissional', 'media', jsonb_build_object('type', ''))
        ))
      ))
    ));
    raise exception 'cross-owner workout exercise reference was allowed';
  exception
    when insufficient_privilege then null;
  end;
end $$;
`;

runPsql(root, sql);
console.log("WORKOUT_LIBRARY_INTEGRATION_RUNTIME=PASS");
