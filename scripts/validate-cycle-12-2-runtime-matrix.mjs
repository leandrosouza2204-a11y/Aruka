import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { getDbContainer, runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const container = getDbContainer(root);
const ids = {
  studentAUser: "00000000-0000-4000-8000-000000001211",
  studentBUser: "00000000-0000-4000-8000-000000001212",
  suspendedUser: "00000000-0000-4000-8000-000000001213",
  professionalB: "00000000-0000-4000-8000-000000001214",
  professionalA: "00000000-0000-4000-8000-000000001215",
  studentA: "00000000-0000-4000-8000-000000001221",
  studentB: "00000000-0000-4000-8000-000000001222",
  suspended: "00000000-0000-4000-8000-000000001223",
  workoutA: "00000000-0000-4000-8000-000000001231",
  workoutB: "00000000-0000-4000-8000-000000001232",
  workoutSuspended: "00000000-0000-4000-8000-000000001233",
  dayA: "00000000-0000-4000-8000-000000001241",
  dayB: "00000000-0000-4000-8000-000000001242",
  daySuspended: "00000000-0000-4000-8000-000000001243",
  prescriptionA: "00000000-0000-4000-8000-000000001251",
  prescriptionB: "00000000-0000-4000-8000-000000001252",
  prescriptionSuspended: "00000000-0000-4000-8000-000000001253",
};
const professionalA = ids.professionalA;
let sequence = 1300;
const evidence = {};

function sql(value, options = {}) {
  return runPsql(root, value, { ...options, throwOnError: options.throwOnError ?? true });
}

function scalar(value) {
  const result = sql(`\\pset tuples_only on\n\\pset format unaligned\n${value}`);
  return result.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) ?? "";
}

function actorSql(userId, statement, role = "authenticated") {
  return `set request.jwt.claim.sub = '${userId}'; set role ${role}; ${statement}`;
}

function actorCall(userId, statement, role = "authenticated") {
  return sql(actorSql(userId, statement, role));
}

function expectActorError(userId, statement, pattern, role = "authenticated") {
  const result = sql(actorSql(userId, statement, role), { throwOnError: false });
  assert.notEqual(result.status, 0, `Expected command to fail: ${statement}`);
  assert.match(`${result.stderr}\n${result.stdout}`, pattern);
  return result;
}

function nextId() {
  sequence += 1;
  return `00000000-0000-4000-8000-${String(sequence).padStart(12, "0")}`;
}

function createSession({ studentId = ids.studentA, prescriptionId = ids.prescriptionA, startedSeconds = 600, status = "in_progress" } = {}) {
  const sessionId = nextId();
  const exerciseId = nextId();
  const terminal = status === "completed"
    ? ", completed_at = clock_timestamp()"
    : status === "cancelled"
      ? ", cancelled_at = clock_timestamp()"
      : status === "abandoned"
        ? ", abandoned_at = clock_timestamp()"
        : "";
  sql(`
    insert into public.workout_execution_sessions(id, aluno_id, status, session_date, started_at)
    values ('${sessionId}', '${studentId}', 'in_progress', current_date, clock_timestamp() - interval '${startedSeconds} seconds');
    insert into public.workout_execution_exercises(
      id, session_id, treino_exercicio_id, exercise_name_snapshot, prescribed_series_snapshot,
      prescribed_reps_snapshot, prescribed_load_snapshot, prescribed_rest_snapshot
    ) values ('${exerciseId}', '${sessionId}', '${prescriptionId}', 'Cycle 12.2 Runtime', '3', '10', '20', '60s');
    ${status === "in_progress" ? "" : `update public.workout_execution_sessions set status='${status}'${terminal} where id='${sessionId}';`}
  `);
  return { sessionId, exerciseId };
}

function completeSet(userId, sessionId, exerciseId, setNumber = 1, values = { reps: 10, loadValue: 20, loadUnit: "kg", bodyweight: false, rir: 2 }) {
  return actorCall(userId, `select public.complete_workout_execution_set('${sessionId}','${exerciseId}',${setNumber},'${JSON.stringify(values)}'::jsonb);`);
}

function concurrentActorCall(userId, statement) {
  return new Promise((resolve) => {
    const child = spawn("docker", ["exec", container, "psql", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", "postgres", "-q", "-c", actorSql(userId, statement)], {
      cwd: root,
      shell: false,
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

function cleanup() {
  sql(`
    delete from public.workout_execution_sessions where aluno_id in ('${ids.studentA}','${ids.studentB}','${ids.suspended}');
    delete from public.treinos where id in ('${ids.workoutA}','${ids.workoutB}','${ids.workoutSuspended}');
    delete from public.alunos where id in ('${ids.studentA}','${ids.studentB}','${ids.suspended}');
    delete from public.perfis where id in ('${ids.professionalA}','${ids.professionalB}');
    delete from auth.users where id in ('${ids.studentAUser}','${ids.studentBUser}','${ids.suspendedUser}','${ids.professionalA}','${ids.professionalB}');
  `, { throwOnError: false });
}

function setup() {
  cleanup();
  sql(`
    insert into auth.users(id,instance_id,aud,role,email,confirmation_token,recovery_token,email_change_token_new,email_change_token_current,email_change,phone_change,phone_change_token,reauthentication_token,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data,is_super_admin)
    select id,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',email,'','','','','','','','',now(),now(),now(),'{}','{}',false
    from (values
      ('${ids.studentAUser}'::uuid,'student-a.cycle12@example.invalid'),
      ('${ids.studentBUser}'::uuid,'student-b.cycle12@example.invalid'),
      ('${ids.suspendedUser}'::uuid,'student-suspended.cycle12@example.invalid'),
      ('${ids.professionalA}'::uuid,'professional-a.cycle12@example.invalid'),
      ('${ids.professionalB}'::uuid,'professional-b.cycle12@example.invalid')
    ) users(id,email);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status)
    values
      ('${ids.professionalA}','${ids.professionalA}','Professional A Cycle 12','professional-a.cycle12@example.invalid','user','assinante','ativo'),
      ('${ids.professionalB}','${ids.professionalB}','Professional B Cycle 12','professional-b.cycle12@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at)
    values
      ('${ids.studentA}','${professionalA}','Student A Cycle 12','+550000001211',current_date,'QA',0,'Ativo','cycle12 runtime','${ids.studentAUser}','active',now()),
      ('${ids.studentB}','${ids.professionalB}','Student B Cycle 12','+550000001212',current_date,'QA',0,'Ativo','cycle12 runtime','${ids.studentBUser}','active',now()),
      ('${ids.suspended}','${professionalA}','Suspended Cycle 12','+550000001213',current_date,'QA',0,'Ativo','cycle12 runtime','${ids.suspendedUser}','suspended',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,objetivo,nivel,dias_semana,observacoes,status,data_inicio,lifecycle_status,delivered_at)
    values
      ('${ids.workoutA}','${professionalA}','${ids.studentA}','Cycle 12 A','QA','Intermediario',3,'runtime','Ativo',current_date,'active',now()),
      ('${ids.workoutB}','${ids.professionalB}','${ids.studentB}','Cycle 12 B','QA','Intermediario',3,'runtime','Ativo',current_date,'active',now()),
      ('${ids.workoutSuspended}','${professionalA}','${ids.suspended}','Cycle 12 Suspended','QA','Intermediario',3,'runtime','Ativo',current_date,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values
      ('${ids.dayA}','${ids.workoutA}','A','QA',1),('${ids.dayB}','${ids.workoutB}','B','QA',1),('${ids.daySuspended}','${ids.workoutSuspended}','S','QA',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem,tracking_config) values
      ('${ids.prescriptionA}','${ids.dayA}','Exercise A','3','10','20','60s','runtime',1,'{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}'),
      ('${ids.prescriptionB}','${ids.dayB}','Exercise B','3','10','20','60s','runtime',1,'{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}'),
      ('${ids.prescriptionSuspended}','${ids.daySuspended}','Exercise S','3','10','20','60s','runtime',1,'{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}');
  `);
}

async function main() {
  const guard = validateLocalGuard(root);
  assert.equal(guard.ok, true, guard.errors.join("; "));
  setup();
  try {
    const snapshotA = JSON.parse(scalar(actorSql(ids.studentAUser, `select public.start_workout_execution_session('${ids.workoutA}','${ids.dayA}','cycle12-snapshot-a',current_date)::text;`)));
    const snapshotExerciseA = snapshotA.exercises[0].id;
    assert.equal(snapshotA.exercises[0].trackingConfig.rir, true);
    sql(`update public.treino_exercicios set tracking_config='{"load":true,"reps":true,"rir":false,"rpe":true,"duration":false,"distance":false}' where id='${ids.prescriptionA}';`);
    assert.equal(JSON.parse(scalar(`select tracking_config_snapshot::text from public.workout_execution_exercises where id='${snapshotExerciseA}';`)).rir, true);
    actorCall(ids.studentAUser, `select public.cancel_workout_execution_session('${snapshotA.id}','snapshot rollover');`);
    const snapshotB = JSON.parse(scalar(actorSql(ids.studentAUser, `select public.start_workout_execution_session('${ids.workoutA}','${ids.dayA}','cycle12-snapshot-b',current_date)::text;`)));
    assert.equal(snapshotB.exercises[0].trackingConfig.rpe, true);
    const invalidConfig = sql(`update public.treino_exercicios set tracking_config='{"unknown":true}' where id='${ids.prescriptionA}';`, { throwOnError: false });
    assert.notEqual(invalidConfig.status, 0);
    actorCall(ids.studentAUser, `select public.cancel_workout_execution_session('${snapshotB.id}','snapshot done');`);
    sql(`update public.treino_exercicios set tracking_config='{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}' where id='${ids.prescriptionA}';`);
    evidence.TRACKING_SNAPSHOT = "PASS";
    evidence.TRACKING_SNAPSHOT_IMMUTABILITY = "PASS";

    const first = createSession();
    completeSet(ids.studentAUser, first.sessionId, first.exerciseId);
    assert.equal(Number(scalar(`select count(*) from public.workout_execution_sets where execution_exercise_id='${first.exerciseId}';`)), 1);
    completeSet(ids.studentAUser, first.sessionId, first.exerciseId);
    assert.equal(Number(scalar(`select count(*) from public.workout_execution_sets where execution_exercise_id='${first.exerciseId}';`)), 1);
    expectActorError(ids.studentAUser, `select public.complete_workout_execution_set('${first.sessionId}','${first.exerciseId}',1,'{"reps":9,"loadValue":20,"loadUnit":"kg","bodyweight":false,"rir":2}');`, /SET_CONFLICT/);
    expectActorError(ids.studentAUser, `select public.complete_workout_execution_set('${first.sessionId}','${first.exerciseId}',2,'{"reps":9,"rpe":8}');`, /TRACKING_VALIDATION_ERROR/);
    expectActorError(ids.studentAUser, `select public.complete_workout_execution_set('${first.sessionId}','${first.exerciseId}',2,'{"reps":-1,"rir":11}');`, /TRACKING_VALIDATION_ERROR/);
    evidence.COMPLETE_SET_FIRST_WRITE = "PASS";
    evidence.COMPLETE_SET_RETRY = "PASS";
    evidence.DUPLICATE_SET = "NO";

    const concurrent = createSession();
    const concurrentStatement = `select public.complete_workout_execution_set('${concurrent.sessionId}','${concurrent.exerciseId}',1,'{"reps":10,"loadValue":20,"loadUnit":"kg","bodyweight":false,"rir":2}'::jsonb);`;
    const concurrentResults = await Promise.all([
      concurrentActorCall(ids.studentAUser, concurrentStatement),
      concurrentActorCall(ids.studentAUser, concurrentStatement),
    ]);
    assert.deepEqual(concurrentResults.map((item) => item.code), [0, 0], JSON.stringify(concurrentResults));
    assert.equal(Number(scalar(`select count(*) from public.workout_execution_sets where execution_exercise_id='${concurrent.exerciseId}' and set_number=1;`)), 1);
    evidence.CONCURRENT_COMPLETE_SET = "PASS";
    evidence.DUPLICATE_ROWS = 0;

    const foreign = createSession({ studentId: ids.studentB, prescriptionId: ids.prescriptionB });
    expectActorError(ids.studentBUser, `select public.complete_workout_execution_set('${first.sessionId}','${first.exerciseId}',2,'{"reps":8}');`, /SESSION_NOT_OWNED/);
    expectActorError(ids.studentAUser, `select public.complete_workout_execution_set('${first.sessionId}','${foreign.exerciseId}',2,'{"reps":8}');`, /INVALID_SET/);
    evidence.CROSS_STUDENT_COMPLETE_SET = "DENIED";
    evidence.CROSS_SESSION_REFERENCE = "DENIED";

    const skip = createSession();
    actorCall(ids.studentAUser, `select public.skip_workout_execution_exercise('${skip.sessionId}','${skip.exerciseId}');`);
    actorCall(ids.studentAUser, `select public.skip_workout_execution_exercise('${skip.sessionId}','${skip.exerciseId}');`);
    expectActorError(ids.studentBUser, `select public.skip_workout_execution_exercise('${skip.sessionId}','${skip.exerciseId}');`, /SESSION_NOT_IN_PROGRESS/);
    expectActorError(ids.studentAUser, `select public.skip_workout_execution_exercise('${skip.sessionId}','${foreign.exerciseId}');`, /INVALID_EXECUTION_EXERCISE/);
    const skipWithSet = createSession();
    completeSet(ids.studentAUser, skipWithSet.sessionId, skipWithSet.exerciseId);
    expectActorError(ids.studentAUser, `select public.skip_workout_execution_exercise('${skipWithSet.sessionId}','${skipWithSet.exerciseId}');`, /SKIP_AFTER_COMPLETION/);
    const terminalSkip = createSession({ status: "completed" });
    expectActorError(ids.studentAUser, `select public.skip_workout_execution_exercise('${terminalSkip.sessionId}','${terminalSkip.exerciseId}');`, /SESSION_NOT_IN_PROGRESS/);
    assert.equal(Number(scalar(`select count(*) from public.workout_execution_sets s join public.workout_execution_exercises e on e.id=s.execution_exercise_id where e.id='${skip.exerciseId}' and s.completed;`)), 0);
    evidence.SKIP = "PASS";

    const cancelFresh = createSession();
    actorCall(ids.studentAUser, `select public.cancel_workout_execution_session('${cancelFresh.sessionId}','fresh');`);
    actorCall(ids.studentAUser, `select public.cancel_workout_execution_session('${cancelFresh.sessionId}','ignored retry');`);
    assert.equal(scalar(`select status||'|'||(cancelled_at is not null)::text from public.workout_execution_sessions where id='${cancelFresh.sessionId}';`), "cancelled|true");
    const cancelPartial = createSession();
    completeSet(ids.studentAUser, cancelPartial.sessionId, cancelPartial.exerciseId);
    actorCall(ids.studentAUser, `select public.cancel_workout_execution_session('${cancelPartial.sessionId}','partial');`);
    assert.equal(Number(scalar(`select count(*) from public.workout_execution_sets where execution_exercise_id='${cancelPartial.exerciseId}' and completed;`)), 1);
    const completedForCancel = createSession();
    completeSet(ids.studentAUser, completedForCancel.sessionId, completedForCancel.exerciseId);
    actorCall(ids.studentAUser, `select public.complete_workout_execution_session_v2('${completedForCancel.sessionId}',false);`);
    expectActorError(ids.studentAUser, `select public.cancel_workout_execution_session('${completedForCancel.sessionId}','late');`, /SESSION_NOT_IN_PROGRESS/);
    expectActorError(ids.studentBUser, `select public.cancel_workout_execution_session('${first.sessionId}','foreign');`, /SESSION_NOT_OWNED/);
    evidence.CANCEL = "PASS";
    evidence.PARTIAL_DATA_PRESERVED = "YES";

    const zero = createSession();
    expectActorError(ids.studentAUser, `select public.complete_workout_execution_session_v2('${zero.sessionId}',false);`, /ZERO_COMPLETED_SETS/);
    actorCall(ids.studentAUser, `select public.skip_workout_execution_exercise('${zero.sessionId}','${zero.exerciseId}');`);
    expectActorError(ids.studentAUser, `select public.complete_workout_execution_session_v2('${zero.sessionId}',false);`, /ZERO_COMPLETED_SETS/);
    const one = createSession();
    completeSet(ids.studentAUser, one.sessionId, one.exerciseId);
    actorCall(ids.studentAUser, `select public.complete_workout_execution_session_v2('${one.sessionId}',false);`);
    evidence.ZERO_SET = "PASS";

    for (const seconds of [60, 120, 300, 301]) {
      const boundary = createSession({ startedSeconds: seconds });
      completeSet(ids.studentAUser, boundary.sessionId, boundary.exerciseId);
      const boundarySql = (confirmed) => `
        update public.workout_execution_sessions set started_at=clock_timestamp() - interval '${seconds} seconds' where id='${boundary.sessionId}';
        set request.jwt.claim.sub = '${ids.studentAUser}'; set role authenticated;
        select public.complete_workout_execution_session_v2('${boundary.sessionId}',${confirmed});`;
      if (seconds <= 300) {
        const rejected = sql(boundarySql(false), { throwOnError: false });
        assert.notEqual(rejected.status, 0);
        assert.match(`${rejected.stderr}\n${rejected.stdout}`, /SHORT_WORKOUT_CONFIRMATION_REQUIRED/);
        sql(boundarySql(true));
        assert.equal(scalar(`select short_duration_confirmed::text from public.workout_execution_sessions where id='${boundary.sessionId}';`), "true");
      } else {
        sql(boundarySql(false));
        assert.equal(scalar(`select short_duration_confirmed::text from public.workout_execution_sessions where id='${boundary.sessionId}';`), "false");
      }
    }
    evidence.SHORT_WORKOUT = "PASS";
    evidence.SERVER_DURATION = "PASS";

    actorCall(ids.studentAUser, `select public.complete_workout_execution_session_v2('${completedForCancel.sessionId}',false);`);
    for (const state of ["completed", "cancelled", "abandoned"]) {
      const terminal = createSession({ status: state });
      expectActorError(ids.studentAUser, `update public.workout_execution_sessions set status='in_progress' where id='${terminal.sessionId}';`, /permission denied/);
      expectActorError(ids.studentAUser, `select public.complete_workout_execution_set('${terminal.sessionId}','${terminal.exerciseId}',1,'{"reps":8}');`, /SESSION_NOT_IN_PROGRESS/);
    }
    evidence.COMPLETION_RETRY = "PASS";
    evidence.TERMINAL_STATE_IMMUTABILITY = "PASS";

    assert.ok(JSON.parse(scalar(actorSql(ids.studentAUser, `select public.get_my_workout_execution_state(50)::text;`))).currentSession);
    expectActorError(professionalA, `select public.complete_workout_execution_set('${first.sessionId}','${first.exerciseId}',3,'{"reps":8}');`, /SESSION_NOT_OWNED/);
    expectActorError(ids.professionalB, `select public.complete_workout_execution_set('${first.sessionId}','${first.exerciseId}',3,'{"reps":8}');`, /SESSION_NOT_OWNED/);
    expectActorError(ids.studentAUser, `insert into public.workout_execution_sets(execution_exercise_id,set_number) values ('${first.exerciseId}',99);`, /permission denied/);
    expectActorError(ids.suspendedUser, `select public.start_workout_execution_session('${ids.workoutSuspended}','${ids.daySuspended}','suspended',current_date);`, /WORKOUT_EXECUTION_STUDENT_ACCESS_REQUIRED/);
    expectActorError(ids.studentAUser, `select public.complete_workout_execution_set('${first.sessionId}','${first.exerciseId}',3,'{"reps":8}');`, /permission denied/, "anon");
    evidence.RLS_RUNTIME_MATRIX = "PASS";

    const legacy = JSON.parse(scalar(actorSql(ids.studentAUser, `select public.start_workout_execution_session('${ids.workoutA}','${ids.dayA}','cycle12-legacy',current_date)::text;`)));
    const legacyExercise = legacy.exercises[0].id;
    actorCall(ids.studentAUser, `select public.save_workout_execution('${legacy.id}','[{"id":"${legacyExercise}","status":"partial","sets":[{"setNumber":1,"reps":8,"completed":true}]}]'::jsonb);`);
    const resumed = JSON.parse(scalar(actorSql(ids.studentAUser, `select public.get_my_workout_execution_state(5)::text;`)));
    assert.equal(resumed.currentSession.id, legacy.id);
    actorCall(ids.studentAUser, `select public.complete_workout_execution_session('${legacy.id}');`);
    const history = JSON.parse(scalar(actorSql(ids.studentAUser, `select public.get_my_workout_execution_state(5)::text;`)));
    assert.ok(history.recentSessions.some((item) => item.id === legacy.id));
    evidence.LEGACY_EXECUTION_REGRESSION = "PASS";

    const result = {
      decision: "PASS",
      scope: "CYCLE_12_2_SESSION_1_RUNTIME_MATRIX_AND_CONCURRENCY",
      local_runtime: true,
      production_accessed: false,
      production_mutated: false,
      concurrent_clients: 2,
      ...evidence,
    };
    const reportPath = "reports/cycle-12-2-runtime-matrix.json";
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, `${JSON.stringify(result, null, 2)}\n`);
    for (const [key, value] of Object.entries(result)) console.log(`${key}=${value}`);
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  cleanup();
  process.exit(1);
});
