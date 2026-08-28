import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { readLocalSupabaseRuntime } from "./lib/local-supabase-runtime.mjs";
import { loadQaEnvFile, validateQaEnvironment } from "./lib/qa-environment-guard.mjs";
import { runPsql } from "./supabase-cycle-8-lib.mjs";
import {
  buildExecutionProgressionSnapshot,
  getCompletedExerciseSets,
} from "../src/features/workoutExecution/utils/workoutExecutionProgression.js";
import { normalizeExecutionSession } from "../src/features/workoutExecution/utils/workoutExecutionSession.js";

loadQaEnvFile(".env.local");
loadQaEnvFile(".env.qa.local");

const runtime = readLocalSupabaseRuntime();
validateQaEnvironment(process.env, { detectedSupabaseUrl: runtime.apiUrl });

const PROFESSIONAL_EMAIL = "qa.local@aruka.test";
const STUDENT_EMAIL = "student.qa.local@aruka.test";
const FALLBACK_PASSWORD = "Cycle08ActualHistoryLocalOnly!2026";
const PROFESSIONAL_PASSWORD = process.env.QA_USER_PASSWORD || FALLBACK_PASSWORD;
const STUDENT_PASSWORD = process.env.QA_USER_PASSWORD || FALLBACK_PASSWORD;
const STUDENT_NAME = "Student QA Daily Experience";
const WORKOUT_NAME = "Cycle 08 Actual History QA";
const DAY_NAME = "Dia A";
const EXERCISE_NAME = "Supino reto";
const MARKER = `cycle08-actual-history-${Date.now()}`;
const SESSION_DATE = "2026-08-28";
const sessionAInput = [
  { setNumber: 1, reps: 12, loadValue: 22, loadUnit: "kg", bodyweight: false, rir: 4, rpe: 6, completed: true },
  { setNumber: 2, reps: 10, loadValue: 24, loadUnit: "kg", bodyweight: false, rir: 2, rpe: 8, completed: true },
  { setNumber: 3, reps: 10, loadValue: 26, loadUnit: "kg", bodyweight: false, rir: 0, rpe: 10, completed: true },
];

const admin = createClient(runtime.apiUrl, runtime.serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const coach = await ensureAuthUser(PROFESSIONAL_EMAIL, "QA Local Aruka");
const student = await ensureAuthUser(STUDENT_EMAIL, "Student QA Daily Experience");
archivePriorFixtureWorkouts(student.id);
const fixture = await createFixture({ professionalUserId: coach.id, studentUserId: student.id });

const studentClient = createClient(runtime.apiUrl, runtime.anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const professionalClient = createClient(runtime.apiUrl, runtime.anonKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

await signIn(studentClient, STUDENT_EMAIL);
await signIn(professionalClient, PROFESSIONAL_EMAIL);

const sessionA = await rpc(studentClient, "start_workout_execution_session", {
  p_treino_id: fixture.treinoId,
  p_treino_dia_id: fixture.diaId,
  p_idempotency_key: `${MARKER}-session-a`,
  p_session_date: SESSION_DATE,
});
const exerciseA = normalizeExecutionSession(sessionA).exercises.find((exercise) => exercise.name === EXERCISE_NAME);
assert.ok(exerciseA, "SESSION_A_EXERCISE_MISSING");

const savedA = await rpc(studentClient, "save_workout_execution", {
  p_session_id: sessionA.id,
  p_exercises: [{
    id: exerciseA.id,
    status: "completed",
    notes: "",
    sets: sessionAInput,
  }],
});
assert.equal(normalizeExecutionSession(savedA).exercises[0].sets.length, 3);

const completedA = normalizeExecutionSession(await rpc(studentClient, "complete_workout_execution_session", {
  p_session_id: sessionA.id,
}));
assert.equal(completedA.status, "completed");

const persistedSets = await readPersistedSets(completedA.id);
assert.deepEqual(persistedSets.map((set) => Number(set.reps)), [12, 10, 10]);
assert.deepEqual(persistedSets.map((set) => Number(set.load_value)), [22, 24, 26]);
assert.deepEqual(persistedSets.map((set) => Number(set.rir)), [4, 2, 0]);
assert.deepEqual(persistedSets.map((set) => Number(set.rpe)), [6, 8, 10]);

const studentStateAfterA = await rpc(studentClient, "get_my_workout_execution_state", { p_limit: 5 });
const sessionAFromStudentPayload = (studentStateAfterA.recentSessions || studentStateAfterA.recent_sessions || [])
  .map(normalizeExecutionSession)
  .find((session) => session.id === completedA.id);
assert.ok(sessionAFromStudentPayload, "SESSION_A_NOT_RETURNED_BY_STUDENT_HISTORY_PAYLOAD");
const studentPayloadSets = getCompletedExerciseSets(sessionAFromStudentPayload.exercises[0]);
assert.deepEqual(studentPayloadSets.map((set) => set.loadValue), [22, 24, 26]);

const professionalHistory = (await rpc(professionalClient, "get_student_workout_execution_history", {
  p_aluno_id: fixture.alunoId,
  p_limit: 5,
})).map(normalizeExecutionSession);
const sessionAFromProfessionalPayload = professionalHistory.find((session) => session.id === completedA.id);
assert.ok(sessionAFromProfessionalPayload, "SESSION_A_NOT_RETURNED_BY_PROFESSIONAL_HISTORY_PAYLOAD");
assert.deepEqual(getCompletedExerciseSets(sessionAFromProfessionalPayload.exercises[0]).map((set) => set.loadValue), [22, 24, 26]);

const sessionB = normalizeExecutionSession(await rpc(studentClient, "start_workout_execution_session", {
  p_treino_id: fixture.treinoId,
  p_treino_dia_id: fixture.diaId,
  p_idempotency_key: `${MARKER}-session-b`,
  p_session_date: SESSION_DATE,
}));
const exerciseB = sessionB.exercises.find((exercise) => exercise.name === EXERCISE_NAME);
assert.ok(exerciseB, "SESSION_B_EXERCISE_MISSING");
assert.equal(exerciseB.sets.length, 0);

const studentStateAfterB = await rpc(studentClient, "get_my_workout_execution_state", { p_limit: 5 });
const snapshotB = buildExecutionProgressionSnapshot({
  currentSession: normalizeExecutionSession(studentStateAfterB.currentSession || studentStateAfterB.current_session),
  recentSessions: (studentStateAfterB.recentSessions || studentStateAfterB.recent_sessions || []).map(normalizeExecutionSession),
});
const sessionBReference = snapshotB.exercises.find((exercise) => exercise.exerciseName === EXERCISE_NAME);
assert.ok(sessionBReference?.previousExercise, "SESSION_B_PREVIOUS_REFERENCE_MISSING");
assert.deepEqual(getCompletedExerciseSets(sessionBReference.previousExercise).map((set) => set.loadValue), [22, 24, 26]);
assert.equal(sessionBReference.previousBestSet.loadValue, 26);
assert.equal(sessionBReference.previousBestSet.reps, 10);

const currentInputsEmpty = [1, 2, 3].every((setNumber) => {
  const current = exerciseB.sets.find((set) => set.setNumber === setNumber) || {};
  return [current.reps, current.loadValue, current.rir, current.rpe].every((value) => value === undefined || value === "");
});
assert.equal(currentInputsEmpty, true);

const prescription = await readPrescription(fixture.exercicioId);
assert.equal(prescription.carga, "24 kg");
archiveCreatedFixtureWorkout(fixture.treinoId);

console.log("WORKOUT_EXECUTION_ACTUAL_LOAD_HISTORY_QA=PASS");
console.log("SESSION_A_COMPLETED=YES");
console.log("SESSION_A_SET_1=12 reps · 22 kg · RIR 4 · RPE 6");
console.log("SESSION_A_SET_2=10 reps · 24 kg · RIR 2 · RPE 8");
console.log("SESSION_A_SET_3=10 reps · 26 kg · RIR 0 · RPE 10");
console.log("SESSION_A_RETURNED_BY_APP_HISTORY_PAYLOAD=YES");
console.log("SESSION_A_EXERCISES_RETURNED=YES");
console.log(`SESSION_A_SETS_RETURNED=${studentPayloadSets.length}`);
console.log("HISTORY_PAYLOAD_SOURCE=get_my_workout_execution_state + get_student_workout_execution_history -> workout_execution_session_payload");
console.log(`HISTORY_PAYLOAD_SET_COUNT=${studentPayloadSets.length}`);
console.log("SESSION_B_INPUTS_EMPTY=YES");
console.log("SESSION_B_PREVIOUS_REFERENCE=YES");
console.log("SESSION_B_PREVIOUS_SET_1_LOAD=22");
console.log("SESSION_B_PREVIOUS_SET_2_LOAD=24");
console.log("SESSION_B_PREVIOUS_SET_3_LOAD=26");
console.log("PROFESSIONAL_SESSION_A_VISIBLE=YES");
console.log("PROFESSIONAL_ACTUAL_SET_DETAILS_VISIBLE=YES");
console.log("EXECUTION_DOES_NOT_UPDATE_PRESCRIPTION=YES");
console.log("PRESCRIBED_LOAD_AFTER_EXECUTION=24 kg");
console.log("NEW_RPC_REQUIRED=NO");
console.log("PRODUCTION_ACCESSED=NO");
console.log("DB_PUSH=NO");

async function ensureAuthUser(email, name) {
  const existing = await findUserByEmail(email);
  if (existing) {
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      password: passwordForEmail(email),
      email_confirm: true,
      user_metadata: { nome: name },
    });
    if (error) throw error;
    return data.user;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: passwordForEmail(email),
    email_confirm: true,
    user_metadata: { nome: name },
  });
  if (error) throw error;
  return data.user;
}

async function findUserByEmail(email) {
  for (let page = 1; page < 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const user = data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    if (data.users.length < 100) return null;
  }
  return null;
}

async function createFixture({ professionalUserId, studentUserId }) {
  const sql = `
\\pset tuples_only on
\\pset format unaligned
with existing_student as (
  select id
  from public.alunos
  where student_user_id = '${studentUserId}'::uuid
  limit 1
),
profile_upsert as (
  insert into public.perfis (user_id, nome, email, role, tipo_acesso, status)
  values ('${professionalUserId}'::uuid, 'QA Local Aruka', '${PROFESSIONAL_EMAIL}', 'user', 'assinante', 'ativo')
  on conflict (user_id) do update set nome = excluded.nome, email = excluded.email, role = excluded.role, tipo_acesso = excluded.tipo_acesso, status = excluded.status
  returning user_id
),
updated_aluno as (
  update public.alunos
  set user_id = '${professionalUserId}'::uuid,
      student_access_status = 'active',
      student_access_email = '${STUDENT_EMAIL}',
      student_access_activated_at = now(),
      nome = '${STUDENT_NAME}',
      status = 'Ativo',
      observacoes = '${MARKER}'
  where id in (select id from existing_student)
  returning id
),
inserted_aluno as (
  insert into public.alunos (
    user_id, student_user_id, student_access_status, student_access_email, student_access_activated_at,
    nome, whatsapp, nascimento, inicio, vencimento, aviso7, aviso1, plano, valor, status,
    pagamento_recebido, data_pagamento, observacoes
  )
  select
    '${professionalUserId}'::uuid, '${studentUserId}'::uuid, 'active', '${STUDENT_EMAIL}', now(),
    '${STUDENT_NAME}', '11990009999', '1995-01-01', '${SESSION_DATE}', '2026-12-31',
    '2026-12-24', '2026-12-30', '', 0, 'Ativo', true, '${SESSION_DATE}', '${MARKER}'
  where not exists (select 1 from existing_student)
  returning id
),
aluno as (
  select id from updated_aluno
  union all
  select id from inserted_aluno
  limit 1
),
treino as (
  insert into public.treinos (
    user_id, aluno_id, nome_rotina, objetivo, nivel, dias_semana, status,
    lifecycle_status, delivered_at, data_inicio, data_revisao
  )
  select '${professionalUserId}'::uuid, id, '${WORKOUT_NAME}', 'Hipertrofia', 'Intermediario', 1,
    'Ativo', 'active', now(), '${SESSION_DATE}', '2026-09-28'
  from aluno
  returning id
),
dia as (
  insert into public.treino_dias (treino_id, nome, grupo_muscular, ordem)
  select id, '${DAY_NAME}', 'Peito', 1 from treino
  returning id
),
exercicio as (
  insert into public.treino_exercicios (treino_dia_id, nome, series, repeticoes, carga, descanso, observacoes, ordem)
  select id, '${EXERCISE_NAME}', '3', '10', '24 kg', '90s', '${MARKER}', 1 from dia
  returning id
)
select jsonb_build_object(
  'alunoId', (select id from aluno),
  'treinoId', (select id from treino),
  'diaId', (select id from dia),
  'exercicioId', (select id from exercicio)
)::text;
`;
  const result = runPsql(process.cwd(), sql);
  const line = result.stdout.trim().split(/\r?\n/).find((item) => item.startsWith("{"));
  if (!line) throw new Error("FIXTURE_RESULT_MISSING");
  return JSON.parse(line);
}

function archivePriorFixtureWorkouts(studentUserId) {
  runPsql(process.cwd(), `
with target_workouts as (
  select t.id
  from public.treinos t
  join public.alunos a on a.id = t.aluno_id
  where a.student_user_id = '${studentUserId}'::uuid
    and t.nome_rotina = '${WORKOUT_NAME}'
),
abandoned_sessions as (
  update public.workout_execution_sessions
  set status = 'abandoned',
      abandoned_at = coalesce(abandoned_at, now())
  where treino_id in (select id from target_workouts)
    and status = 'in_progress'
  returning id
)
update public.treinos
set lifecycle_status = 'archived',
    archived_at = coalesce(archived_at, now())
where id in (select id from target_workouts)
  and lifecycle_status <> 'archived';
`);
}

function archiveCreatedFixtureWorkout(treinoId) {
  runPsql(process.cwd(), `
with abandoned_sessions as (
  update public.workout_execution_sessions
  set status = 'abandoned',
      abandoned_at = coalesce(abandoned_at, now())
  where treino_id = '${treinoId}'::uuid
    and status = 'in_progress'
  returning id
)
update public.treinos
set lifecycle_status = 'archived',
    archived_at = coalesce(archived_at, now())
where id = '${treinoId}'::uuid;
`);
}

async function signIn(client, email) {
  const { error } = await client.auth.signInWithPassword({ email, password: passwordForEmail(email) });
  if (error) throw error;
}

function passwordForEmail(email) {
  return email === PROFESSIONAL_EMAIL ? PROFESSIONAL_PASSWORD : STUDENT_PASSWORD;
}

async function rpc(client, name, args) {
  const { data, error } = await client.rpc(name, args);
  if (error) throw error;
  return data;
}

async function readPersistedSets(sessionId) {
  const result = runPsql(process.cwd(), `
\\pset tuples_only on
\\pset format unaligned
select coalesce(jsonb_agg(jsonb_build_object(
  'set_number', s.set_number,
  'reps', s.reps,
  'load_value', s.load_value,
  'load_unit', s.load_unit,
  'bodyweight', s.bodyweight,
  'rir', s.rir,
  'rpe', s.rpe,
  'completed', s.completed
) order by s.set_number), '[]'::jsonb)::text
from public.workout_execution_sets s
join public.workout_execution_exercises e on e.id = s.execution_exercise_id
where e.session_id = '${sessionId}'::uuid and e.exercise_name_snapshot = '${EXERCISE_NAME}';
`);
  return JSON.parse(result.stdout.trim().split(/\r?\n/).find((item) => item.startsWith("[")) || "[]");
}

async function readPrescription(exercicioId) {
  const result = runPsql(process.cwd(), `
\\pset tuples_only on
\\pset format unaligned
select jsonb_build_object('carga', carga)::text from public.treino_exercicios where id = '${exercicioId}'::uuid;
`);
  return JSON.parse(result.stdout.trim().split(/\r?\n/).find((item) => item.startsWith("{")) || "{}");
}
