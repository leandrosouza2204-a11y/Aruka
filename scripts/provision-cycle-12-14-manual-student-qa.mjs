import assert from "node:assert/strict";
import { runPsql, queryJson } from "./supabase-cycle-8-lib.mjs";
import {
  CONTACT_EMAIL,
  CONTACT_WHATSAPP,
  FIXTURE_IDS,
  FIXTURE_NAMESPACE,
  PROFESSIONAL_EMAIL,
  STUDENT_EMAIL,
  assertFixtureAuthUser,
  assertLocalServices,
  createAdminClient,
  createStudentClient,
  findAuthUserByEmail,
  loadAndValidateManualQaEnvironment,
  sqlLiteral,
} from "./lib/cycle-12-14-manual-student-qa.mjs";

const root = process.cwd();
const { runtime, password, dbContainer } = loadAndValidateManualQaEnvironment();
await assertLocalServices(runtime);

const admin = createAdminClient(runtime);
const studentUser = await ensureStudentAuthUser(admin, password);
const professionalUser = await ensureProfessionalAuthUser(admin);

provisionDatabaseFixture(studentUser.id, professionalUser.id);
const validation = await validateAsStudent(studentUser.id, password);
const inventory = readInventory(studentUser.id, professionalUser.id);

assert.equal(inventory.auth_users, 2);
assert.equal(inventory.students, 1);
assert.equal(inventory.professionals, 1);
assert.equal(inventory.workouts, 1);
assert.equal(inventory.days, 1);
assert.equal(inventory.exercises, 5);
assert.equal(inventory.historical_sessions, 1);
assert.equal(inventory.assessments, 2);
assert.equal(inventory.contacts, 1);

console.log("MANUAL_QA_PROVISION=PASS");
console.log(`FIXTURE_NAMESPACE=${FIXTURE_NAMESPACE}`);
console.log(`LOCAL_DB_CONTAINER=${dbContainer}`);
console.log(`STUDENT_EMAIL=${STUDENT_EMAIL}`);
console.log(`STUDENT_AUTH_USER_ID=${studentUser.id}`);
console.log(`STUDENT_EMAIL_CONFIRMED=${studentUser.email_confirmed_at ? "YES" : "NO"}`);
console.log(`STUDENT_BANNED=${isBanned(studentUser) ? "YES" : "NO"}`);
console.log(`PROFESSIONAL_AUTH_USER_ID=${professionalUser.id}`);
console.log(`STUDENT_ID=${FIXTURE_IDS.student}`);
console.log(`WORKOUT_ID=${FIXTURE_IDS.workout}`);
console.log(`WORKOUT_DAY_ID=${FIXTURE_IDS.day}`);
console.log(`HISTORICAL_SESSION_ID=${FIXTURE_IDS.historicalSession}`);
console.log(`ASSESSMENT_COUNT=${inventory.assessments}`);
console.log(`EXERCISE_COUNT=${inventory.exercises}`);
console.log("PLAYER_ENTRY_MODE=START_FROM_LIBRARY");
console.log("MANUAL_LOGIN=PASS");
console.log(`V2_RPC_HOME=${validation.home ? "PASS" : "FAIL"}`);
console.log(`V2_RPC_TRAINING_LIBRARY=${validation.library ? "PASS" : "FAIL"}`);
console.log(`V2_RPC_WORKOUT_DETAIL=${validation.detail ? "PASS" : "FAIL"}`);
console.log(`V2_RPC_WORKOUT_PLAYER=${validation.player ? "PASS" : "FAIL"}`);
console.log(`V2_RPC_FREQUENCY=${validation.frequency ? "PASS" : "FAIL"}`);
console.log(`V2_RPC_ASSESSMENTS=${validation.assessments ? "PASS" : "FAIL"}`);
console.log(`V2_RPC_PROFILE=${validation.profile ? "PASS" : "FAIL"}`);
console.log("PASSWORD_SOURCE=QA_USER_PASSWORD");
console.log("PASSWORD_EXPOSED=NO");
console.log(`EXPECTED_CONTACT_EMAIL=${CONTACT_EMAIL}`);
console.log(`EXPECTED_CONTACT_WHATSAPP=${CONTACT_WHATSAPP}`);
console.log("CLEANUP_EXECUTED=NO");
console.log("PRODUCTION_ACCESSED=NO");

async function ensureStudentAuthUser(client, configuredPassword) {
  const existing = await findAuthUserByEmail(client, STUDENT_EMAIL);
  if (existing) {
    assertFixtureAuthUser(existing, "student");
    if (!existing.email_confirmed_at) throw new Error("MANUAL_QA_BLOCKED: estudante existente sem email confirmado.");
    return existing;
  }
  const { data, error } = await client.auth.admin.createUser({
    email: STUDENT_EMAIL,
    password: configuredPassword,
    email_confirm: true,
    app_metadata: { qa_fixture: FIXTURE_NAMESPACE, qa_fixture_role: "student" },
    user_metadata: { nome: "Aluno Manual QA Cycle 12.14" },
  });
  if (error) throw error;
  assertFixtureAuthUser(data.user, "student");
  return data.user;
}

async function ensureProfessionalAuthUser(client) {
  const existing = await findAuthUserByEmail(client, PROFESSIONAL_EMAIL);
  if (existing) {
    assertFixtureAuthUser(existing, "professional");
    return existing;
  }
  const { data, error } = await client.auth.admin.createUser({
    email: PROFESSIONAL_EMAIL,
    email_confirm: true,
    app_metadata: { qa_fixture: FIXTURE_NAMESPACE, qa_fixture_role: "professional" },
    user_metadata: { nome: "Profissional Manual QA Cycle 12.14" },
  });
  if (error) throw error;
  assertFixtureAuthUser(data.user, "professional");
  return data.user;
}

function provisionDatabaseFixture(studentUserId, professionalUserId) {
  const exerciseRows = [
    [FIXTURE_IDS.exercises[0], "Agachamento QA controlado", "3", "10", "24 kg", "90s", 1],
    [FIXTURE_IDS.exercises[1], "Remada QA controlada", "3", "12", "18 kg", "75s", 2],
    [FIXTURE_IDS.exercises[2], "Desenvolvimento QA controlado", "3", "10", "12 kg", "60s", 3],
    [FIXTURE_IDS.exercises[3], "Afundo QA controlado", "2", "10", "10 kg", "60s", 4],
    [FIXTURE_IDS.exercises[4], "Prancha QA controlada", "3", "30", "0 kg", "45s", 5],
  ];
  const executionRows = exerciseRows.map((row, index) => [FIXTURE_IDS.historicalExercises[index], ...row]);
  const setRows = executionRows.flatMap((row, exerciseIndex) => [1, 2, 3].map((setNumber) => ({
    id: `12143b00-0000-4000-8000-${String(100 + exerciseIndex * 3 + setNumber).padStart(12, "0")}`,
    executionExerciseId: row[0],
    setNumber,
    reps: exerciseIndex === 4 ? 30 : Number(row[4]),
    load: exerciseIndex === 4 ? 0 : 16 + exerciseIndex * 2 + setNumber * 2,
    rir: Math.max(1, 4 - setNumber),
    rpe: Math.min(9, 5 + setNumber),
  })));
  const tracking = JSON.stringify({ reps: true, load: true, rir: true, rpe: true, duration: false, distance: false });

  const sql = `
begin;
do $$
begin
  if exists (select 1 from public.alunos where student_user_id = ${sqlLiteral(studentUserId)}::uuid and id <> ${sqlLiteral(FIXTURE_IDS.student)}::uuid) then
    raise exception 'MANUAL_QA_COLLISION: student auth already linked to another aluno';
  end if;
  if exists (select 1 from public.alunos where lower(coalesce(student_access_email, '')) = lower(${sqlLiteral(STUDENT_EMAIL)}) and id <> ${sqlLiteral(FIXTURE_IDS.student)}::uuid) then
    raise exception 'MANUAL_QA_COLLISION: student email already belongs to another aluno';
  end if;
  if exists (select 1 from public.treinos where application_idempotency_key = ${sqlLiteral(`${FIXTURE_NAMESPACE}:workout-base`)} and id <> ${sqlLiteral(FIXTURE_IDS.workout)}::uuid) then
    raise exception 'MANUAL_QA_COLLISION: workout namespace already belongs to another id';
  end if;
end $$;

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status)
values
  (${sqlLiteral(professionalUserId)}::uuid, ${sqlLiteral(professionalUserId)}::uuid, 'Profissional Manual QA Cycle 12.14', ${sqlLiteral(PROFESSIONAL_EMAIL)}, 'user', 'assinante', 'ativo'),
  (${sqlLiteral(studentUserId)}::uuid, ${sqlLiteral(studentUserId)}::uuid, 'Aluno Manual QA Cycle 12.14', ${sqlLiteral(STUDENT_EMAIL)}, 'student', 'pendente', 'ativo')
on conflict (user_id) do update set
  nome = excluded.nome, email = excluded.email, role = excluded.role,
  tipo_acesso = excluded.tipo_acesso, status = excluded.status;

insert into public.alunos (
  id, user_id, student_user_id, nome, whatsapp, nascimento, inicio, vencimento, aviso7, aviso1,
  plano, valor, status, pagamento_recebido, observacoes, acompanhamento_status,
  consultoria_inicio, consultoria_inicio_confianca, student_access_status, student_access_email,
  student_access_activated_at, student_access_reason
) values (
  ${sqlLiteral(FIXTURE_IDS.student)}::uuid, ${sqlLiteral(professionalUserId)}::uuid, ${sqlLiteral(studentUserId)}::uuid,
  'Aluno Manual QA Cycle 12.14', '5500000000000', '1995-01-15', current_date - 90, current_date + 180,
  current_date + 173, current_date + 179, ${sqlLiteral(FIXTURE_NAMESPACE)}, 0, 'Ativo', true,
  ${sqlLiteral(`MANUAL_QA_FIXTURE:${FIXTURE_NAMESPACE}`)}, 'ativo', current_date - 90, 'EXACT',
  'active', ${sqlLiteral(STUDENT_EMAIL)}, coalesce((select student_access_activated_at from public.alunos where id=${sqlLiteral(FIXTURE_IDS.student)}::uuid), now()),
  ${sqlLiteral(`MANUAL_QA_FIXTURE:${FIXTURE_NAMESPACE}`)}
)
on conflict (id) do update set
  user_id=excluded.user_id, student_user_id=excluded.student_user_id, nome=excluded.nome,
  whatsapp=excluded.whatsapp, nascimento=excluded.nascimento, inicio=excluded.inicio,
  vencimento=excluded.vencimento, aviso7=excluded.aviso7, aviso1=excluded.aviso1,
  plano=excluded.plano, valor=excluded.valor, status=excluded.status,
  pagamento_recebido=excluded.pagamento_recebido, observacoes=excluded.observacoes,
  acompanhamento_status=excluded.acompanhamento_status, consultoria_inicio=excluded.consultoria_inicio,
  consultoria_inicio_confianca=excluded.consultoria_inicio_confianca,
  student_access_status='active', student_access_email=excluded.student_access_email,
  student_access_activated_at=coalesce(public.alunos.student_access_activated_at, excluded.student_access_activated_at),
  student_access_suspended_at=null, student_access_revoked_at=null, student_access_reason=excluded.student_access_reason;

insert into public.professional_contact_settings (
  professional_user_id, whatsapp_enabled, whatsapp_number, email_enabled, contact_email
) values (${sqlLiteral(professionalUserId)}::uuid, true, ${sqlLiteral(CONTACT_WHATSAPP)}, true, ${sqlLiteral(CONTACT_EMAIL)})
on conflict (professional_user_id) do update set
  whatsapp_enabled=true, whatsapp_number=excluded.whatsapp_number,
  email_enabled=true, contact_email=excluded.contact_email, updated_at=now();

insert into public.treinos (
  id, user_id, aluno_id, nome_rotina, objetivo, nivel, dias_semana, observacoes, status,
  data_inicio, data_revisao, lifecycle_status, delivered_by, delivered_at, application_idempotency_key
) values (
  ${sqlLiteral(FIXTURE_IDS.workout)}::uuid, ${sqlLiteral(professionalUserId)}::uuid, ${sqlLiteral(FIXTURE_IDS.student)}::uuid,
  '[MANUAL QA 12.14] Programa Multiplataforma', 'Validacao funcional da Student Experience V2',
  'Intermediario', 3, ${sqlLiteral(`MANUAL_QA_FIXTURE:${FIXTURE_NAMESPACE}`)}, 'Ativo', current_date - 30,
  current_date + 60, 'active', ${sqlLiteral(professionalUserId)}::uuid, now() - interval '30 days',
  ${sqlLiteral(`${FIXTURE_NAMESPACE}:workout-base`)}
)
on conflict (id) do update set
  user_id=excluded.user_id, aluno_id=excluded.aluno_id, nome_rotina=excluded.nome_rotina,
  objetivo=excluded.objetivo, nivel=excluded.nivel, dias_semana=excluded.dias_semana,
  observacoes=excluded.observacoes, status='Ativo', data_inicio=excluded.data_inicio,
  data_revisao=excluded.data_revisao, lifecycle_status='active', delivered_by=excluded.delivered_by,
  delivered_at=coalesce(public.treinos.delivered_at, excluded.delivered_at), completed_at=null,
  archived_at=null, application_idempotency_key=excluded.application_idempotency_key;

insert into public.treino_dias (id, treino_id, nome, grupo_muscular, ordem)
values (${sqlLiteral(FIXTURE_IDS.day)}::uuid, ${sqlLiteral(FIXTURE_IDS.workout)}::uuid, 'Treino Manual QA A', 'Corpo inteiro', 1)
on conflict (id) do update set treino_id=excluded.treino_id, nome=excluded.nome, grupo_muscular=excluded.grupo_muscular, ordem=excluded.ordem;

insert into public.treino_exercicios (
  id, treino_dia_id, nome, series, repeticoes, carga, descanso, observacoes, video_url, ordem,
  exercise_media_snapshot, tracking_config
) values
${exerciseRows.map((row) => `  (${sqlLiteral(row[0])}::uuid, ${sqlLiteral(FIXTURE_IDS.day)}::uuid, ${sqlLiteral(row[1])}, ${sqlLiteral(row[2])}, ${sqlLiteral(row[3])}, ${sqlLiteral(row[4])}, ${sqlLiteral(row[5])}, ${sqlLiteral(`MANUAL_QA_FIXTURE:${FIXTURE_NAMESPACE}`)}, '', ${row[6]}, '{}'::jsonb, ${sqlLiteral(tracking)}::jsonb)`).join(",\n")}
on conflict (id) do update set
  treino_dia_id=excluded.treino_dia_id, nome=excluded.nome, series=excluded.series,
  repeticoes=excluded.repeticoes, carga=excluded.carga, descanso=excluded.descanso,
  observacoes=excluded.observacoes, ordem=excluded.ordem,
  exercise_media_snapshot=excluded.exercise_media_snapshot, tracking_config=excluded.tracking_config;

insert into public.workout_execution_sessions (
  id, aluno_id, treino_id, treino_dia_id, status, session_date, started_at, completed_at,
  notes, idempotency_key, short_duration_confirmed, last_activity_at
) values (
  ${sqlLiteral(FIXTURE_IDS.historicalSession)}::uuid, ${sqlLiteral(FIXTURE_IDS.student)}::uuid,
  ${sqlLiteral(FIXTURE_IDS.workout)}::uuid, ${sqlLiteral(FIXTURE_IDS.day)}::uuid, 'completed', current_date - 3,
  (current_date - 3)::timestamp + interval '18 hours',
  (current_date - 3)::timestamp + interval '18 hours 42 minutes',
  ${sqlLiteral(`MANUAL_QA_FIXTURE:${FIXTURE_NAMESPACE}:historical-base`)},
  ${sqlLiteral(`${FIXTURE_NAMESPACE}:historical-session-base`)}, true,
  (current_date - 3)::timestamp + interval '18 hours 42 minutes'
)
on conflict (id) do update set
  aluno_id=excluded.aluno_id, treino_id=excluded.treino_id, treino_dia_id=excluded.treino_dia_id,
  status='completed', session_date=excluded.session_date, started_at=excluded.started_at,
  completed_at=excluded.completed_at, abandoned_at=null, cancelled_at=null, cancellation_reason=null,
  notes=excluded.notes, idempotency_key=excluded.idempotency_key,
  short_duration_confirmed=true, last_activity_at=excluded.last_activity_at;

insert into public.workout_execution_exercises (
  id, session_id, treino_exercicio_id, treino_dia_id, exercise_name_snapshot,
  prescribed_series_snapshot, prescribed_reps_snapshot, prescribed_load_snapshot,
  prescribed_rest_snapshot, prescribed_notes_snapshot, day_name_snapshot, group_snapshot,
  exercise_order_snapshot, day_order_snapshot, workout_title_snapshot, status, notes,
  tracking_config_snapshot
) values
${executionRows.map((row) => `  (${sqlLiteral(row[0])}::uuid, ${sqlLiteral(FIXTURE_IDS.historicalSession)}::uuid, ${sqlLiteral(row[1])}::uuid, ${sqlLiteral(FIXTURE_IDS.day)}::uuid, ${sqlLiteral(row[2])}, ${sqlLiteral(row[3])}, ${sqlLiteral(row[4])}, ${sqlLiteral(row[5])}, ${sqlLiteral(row[6])}, ${sqlLiteral(`MANUAL_QA_FIXTURE:${FIXTURE_NAMESPACE}`)}, 'Treino Manual QA A', 'Corpo inteiro', ${row[7]}, 1, '[MANUAL QA 12.14] Programa Multiplataforma', 'completed', '', ${sqlLiteral(tracking)}::jsonb)`).join(",\n")}
on conflict (id) do update set
  session_id=excluded.session_id, treino_exercicio_id=excluded.treino_exercicio_id,
  treino_dia_id=excluded.treino_dia_id, exercise_name_snapshot=excluded.exercise_name_snapshot,
  prescribed_series_snapshot=excluded.prescribed_series_snapshot,
  prescribed_reps_snapshot=excluded.prescribed_reps_snapshot,
  prescribed_load_snapshot=excluded.prescribed_load_snapshot,
  prescribed_rest_snapshot=excluded.prescribed_rest_snapshot,
  prescribed_notes_snapshot=excluded.prescribed_notes_snapshot,
  day_name_snapshot=excluded.day_name_snapshot, group_snapshot=excluded.group_snapshot,
  exercise_order_snapshot=excluded.exercise_order_snapshot, day_order_snapshot=1,
  workout_title_snapshot=excluded.workout_title_snapshot, status='completed',
  tracking_config_snapshot=excluded.tracking_config_snapshot;

insert into public.workout_execution_sets (
  id, execution_exercise_id, set_number, reps, load_value, load_unit, bodyweight, rir, rpe, completed,
  created_at, updated_at
) values
${setRows.map((row) => `  (${sqlLiteral(row.id)}::uuid, ${sqlLiteral(row.executionExerciseId)}::uuid, ${row.setNumber}, ${row.reps}, ${row.load}, 'kg', false, ${row.rir}, ${row.rpe}, true, (current_date - 3)::timestamp + interval '18 hours ${10 + row.setNumber * 2} minutes', (current_date - 3)::timestamp + interval '18 hours ${10 + row.setNumber * 2} minutes')`).join(",\n")}
on conflict (id) do update set
  execution_exercise_id=excluded.execution_exercise_id, set_number=excluded.set_number,
  reps=excluded.reps, load_value=excluded.load_value, load_unit='kg', bodyweight=false,
  rir=excluded.rir, rpe=excluded.rpe, completed=true, created_at=excluded.created_at, updated_at=excluded.updated_at;

insert into public.avaliacoes (
  id, user_id, aluno_id, data_avaliacao, idade, sexo, altura, peso, cintura, abdomen, quadril,
  braco_direito, braco_esquerdo, coxa_direita, coxa_esquerda, panturrilha_direita,
  panturrilha_esquerda, percentual_gordura, massa_gorda, massa_magra, imc, status,
  objetivo_atual, observacoes
) values
  (${sqlLiteral(FIXTURE_IDS.assessments[0])}::uuid, ${sqlLiteral(professionalUserId)}::uuid, ${sqlLiteral(FIXTURE_IDS.student)}::uuid,
   current_date - 60, 31, 'nao_informado', 175, 82.4, 88, 92, 101, 34, 33.5, 58, 57.5, 38, 37.5,
   24.0, 19.8, 62.6, 26.9, 'inicial', 'Validacao manual QA', ${sqlLiteral(`MANUAL_QA_FIXTURE:${FIXTURE_NAMESPACE}:assessment-baseline`)}),
  (${sqlLiteral(FIXTURE_IDS.assessments[1])}::uuid, ${sqlLiteral(professionalUserId)}::uuid, ${sqlLiteral(FIXTURE_IDS.student)}::uuid,
   current_date - 5, 31, 'nao_informado', 175, 79.8, 84, 88, 98, 35, 34.5, 59, 58.5, 38.5, 38,
   21.5, 17.2, 62.6, 26.1, 'acompanhamento', 'Validacao manual QA', ${sqlLiteral(`MANUAL_QA_FIXTURE:${FIXTURE_NAMESPACE}:assessment-current`)})
on conflict (id) do update set
  user_id=excluded.user_id, aluno_id=excluded.aluno_id, data_avaliacao=excluded.data_avaliacao,
  idade=excluded.idade, sexo=excluded.sexo, altura=excluded.altura, peso=excluded.peso,
  cintura=excluded.cintura, abdomen=excluded.abdomen, quadril=excluded.quadril,
  braco_direito=excluded.braco_direito, braco_esquerdo=excluded.braco_esquerdo,
  coxa_direita=excluded.coxa_direita, coxa_esquerda=excluded.coxa_esquerda,
  panturrilha_direita=excluded.panturrilha_direita,
  panturrilha_esquerda=excluded.panturrilha_esquerda,
  percentual_gordura=excluded.percentual_gordura, massa_gorda=excluded.massa_gorda,
  massa_magra=excluded.massa_magra, imc=excluded.imc, status=excluded.status,
  objetivo_atual=excluded.objetivo_atual, observacoes=excluded.observacoes;
commit;
`;
  runPsql(root, sql);
}

async function validateAsStudent(expectedUserId, configuredPassword) {
  const student = createStudentClient(runtime);
  const { data: login, error: loginError } = await student.auth.signInWithPassword({
    email: STUDENT_EMAIL,
    password: configuredPassword,
  });
  if (loginError) throw loginError;
  assert.equal(login.user.id, expectedUserId);

  const home = await rpc(student, "get_my_student_home_v2");
  const library = await rpc(student, "get_my_student_training_library_v2");
  const detail = await rpc(student, "get_my_student_workout_detail_v2", { p_treino_dia_id: FIXTURE_IDS.day });
  const player = await rpc(student, "get_my_workout_player_v2", { p_session_id: FIXTURE_IDS.historicalSession });
  const frequency = await rpc(student, "get_my_student_workout_frequency_v2");
  const assessments = await rpc(student, "get_my_student_assessments_v2");
  const profile = await rpc(student, "get_my_student_profile_v2");
  const history = await rpc(student, "get_my_valid_workout_execution_history", { p_limit: 20 });

  assert.equal(home.studentAccess?.status, "active");
  assert.equal(home.student?.id, FIXTURE_IDS.student);
  assert.equal(home.todayWorkout?.treinoDiaId, FIXTURE_IDS.day);
  assert.equal(library.currentProgram?.id, FIXTURE_IDS.workout);
  assert.ok(library.workouts?.some((item) => item.id === FIXTURE_IDS.day));
  assert.equal(detail?.id, FIXTURE_IDS.day);
  assert.equal(detail?.exercises?.length, 5);
  assert.equal(player?.session?.id || player?.id, FIXTURE_IDS.historicalSession);
  assert.ok(frequency.frequency?.some((item) => Number(item.completedCount) >= 1));
  assert.equal(assessments.totalCount, 2);
  assert.equal(profile.student?.name, "Aluno Manual QA Cycle 12.14");
  assert.equal(profile.professional?.contactEmail, CONTACT_EMAIL);
  assert.ok(Array.isArray(history) && history.some((item) => item.id === FIXTURE_IDS.historicalSession));

  const { error: signOutError } = await student.auth.signOut();
  if (signOutError) throw signOutError;
  return { home, library, detail, player, frequency, assessments, profile };
}

async function rpc(client, name, args) {
  const { data, error } = await client.rpc(name, args);
  if (error) throw new Error(`${name}: ${error.message}`);
  return data;
}

function readInventory(studentUserId, professionalUserId) {
  return queryJson(root, `
    select
      (select count(*)::int from auth.users where id in (${sqlLiteral(studentUserId)}::uuid, ${sqlLiteral(professionalUserId)}::uuid)) as auth_users,
      (select count(*)::int from public.alunos where id=${sqlLiteral(FIXTURE_IDS.student)}::uuid and student_user_id=${sqlLiteral(studentUserId)}::uuid) as students,
      (select count(*)::int from public.perfis where user_id=${sqlLiteral(professionalUserId)}::uuid and nome='Profissional Manual QA Cycle 12.14') as professionals,
      (select count(*)::int from public.treinos where id=${sqlLiteral(FIXTURE_IDS.workout)}::uuid and application_idempotency_key=${sqlLiteral(`${FIXTURE_NAMESPACE}:workout-base`)}) as workouts,
      (select count(*)::int from public.treino_dias where id=${sqlLiteral(FIXTURE_IDS.day)}::uuid) as days,
      (select count(*)::int from public.treino_exercicios where id=any(array[${FIXTURE_IDS.exercises.map((id) => `${sqlLiteral(id)}::uuid`).join(",")}])) as exercises,
      (select count(*)::int from public.workout_execution_sessions where id=${sqlLiteral(FIXTURE_IDS.historicalSession)}::uuid and status='completed') as historical_sessions,
      (select count(*)::int from public.avaliacoes where id=any(array[${FIXTURE_IDS.assessments.map((id) => `${sqlLiteral(id)}::uuid`).join(",")}])) as assessments,
      (select count(*)::int from public.professional_contact_settings where professional_user_id=${sqlLiteral(professionalUserId)}::uuid) as contacts
  `)[0];
}

function isBanned(user) {
  return Boolean(user.banned_until && new Date(user.banned_until).getTime() > Date.now());
}
