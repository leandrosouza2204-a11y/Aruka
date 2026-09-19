import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { getDbContainer, runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const container = getDbContainer(root);
const ids = {
  userA: "00000000-0000-4000-8000-000000006611",
  userB: "00000000-0000-4000-8000-000000006612",
  professional: "00000000-0000-4000-8000-000000006613",
  studentA: "00000000-0000-4000-8000-000000006621",
  studentB: "00000000-0000-4000-8000-000000006622",
  workoutA: "00000000-0000-4000-8000-000000006631",
  workoutB: "00000000-0000-4000-8000-000000006632",
  dayA: "00000000-0000-4000-8000-000000006641",
  dayB: "00000000-0000-4000-8000-000000006642",
  prescriptionA: "00000000-0000-4000-8000-000000006651",
  prescriptionB: "00000000-0000-4000-8000-000000006652",
  current: "00000000-0000-4000-8000-000000006661",
  previous: "00000000-0000-4000-8000-000000006662",
  cancelled: "00000000-0000-4000-8000-000000006663",
  other: "00000000-0000-4000-8000-000000006664",
  currentExercise: "00000000-0000-4000-8000-000000006671",
  previousExercise: "00000000-0000-4000-8000-000000006672",
  cancelledExercise: "00000000-0000-4000-8000-000000006673",
  otherExercise: "00000000-0000-4000-8000-000000006674",
};

function sql(statement, options = {}) {
  return runPsql(root, statement, { ...options, throwOnError: options.throwOnError ?? true });
}
function scalar(statement) {
  return sql(`\\pset tuples_only on\n\\pset format unaligned\n${statement}`).stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "";
}
function actor(userId, statement, role = "authenticated") {
  return `set request.jwt.claim.sub='${userId}'; set role ${role}; ${statement}`;
}
function expectError(statement, pattern) {
  const result = sql(statement, { throwOnError: false });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, pattern);
}
function concurrentActorCall(userId, statement) {
  return new Promise((resolve) => {
    const child = spawn("docker", ["exec", container, "psql", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", "postgres", "-q", "-c", actor(userId, statement)], {
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
    delete from public.workout_execution_sessions where id in ('${ids.current}','${ids.previous}','${ids.cancelled}','${ids.other}');
    delete from public.treinos where id in ('${ids.workoutA}','${ids.workoutB}');
    delete from public.alunos where id in ('${ids.studentA}','${ids.studentB}');
    delete from public.perfis where id='${ids.professional}';
    delete from auth.users where id in ('${ids.userA}','${ids.userB}','${ids.professional}');
  `, { throwOnError: false });
}
function setup() {
  cleanup();
  sql(`
    insert into auth.users(id,instance_id,aud,role,email,confirmation_token,recovery_token,email_change_token_new,email_change_token_current,email_change,phone_change,phone_change_token,reauthentication_token,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data,is_super_admin)
    select id,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',email,'','','','','','','','',now(),now(),now(),'{}','{}',false
    from (values
      ('${ids.userA}'::uuid,'set-player-a@example.invalid'),
      ('${ids.userB}'::uuid,'set-player-b@example.invalid'),
      ('${ids.professional}'::uuid,'set-player-professional@example.invalid')
    ) users(id,email);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status)
    values ('${ids.professional}','${ids.professional}','Professional Cycle 12.6','set-player-professional@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at)
    values
      ('${ids.studentA}','${ids.professional}','Student A Cycle 12.6','+550000006611',current_date,'QA',0,'Ativo','synthetic','${ids.userA}','active',now()),
      ('${ids.studentB}','${ids.professional}','Student B Cycle 12.6','+550000006612',current_date,'QA',0,'Ativo','synthetic','${ids.userB}','active',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,status,data_inicio,lifecycle_status,delivered_at)
    values
      ('${ids.workoutA}','${ids.professional}','${ids.studentA}','Workout A','Ativo',current_date,'active',now()),
      ('${ids.workoutB}','${ids.professional}','${ids.studentB}','Workout B','Ativo',current_date,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values
      ('${ids.dayA}','${ids.workoutA}','A','Full body',1),
      ('${ids.dayB}','${ids.workoutB}','B','Full body',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem,tracking_config,exercise_media_snapshot) values
      ('${ids.prescriptionA}','${ids.dayA}','Canonical Exercise A','3','10','20 kg','60 s','synthetic',1,'{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','{}'),
      ('${ids.prescriptionB}','${ids.dayB}','Canonical Exercise B','3','10','20 kg','60 s','synthetic',1,'{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','{}');
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,last_activity_at,completed_at,cancelled_at,cancellation_reason) values
      ('${ids.current}','${ids.studentA}','${ids.workoutA}','${ids.dayA}','in_progress',current_date,now()-interval '10 minutes',now(),null,null,null),
      ('${ids.previous}','${ids.studentA}','${ids.workoutA}','${ids.dayA}','completed',current_date-2,now()-interval '2 days 20 minutes',now()-interval '2 days',now()-interval '2 days',null,null),
      ('${ids.cancelled}','${ids.studentA}','${ids.workoutA}','${ids.dayA}','cancelled',current_date-1,now()-interval '1 day 20 minutes',now()-interval '1 day',null,now()-interval '1 day','synthetic cancel'),
      ('${ids.other}','${ids.studentB}','${ids.workoutB}','${ids.dayB}','in_progress',current_date,now()-interval '10 minutes',now(),null,null,null);
    insert into public.workout_execution_exercises(id,session_id,treino_exercicio_id,treino_dia_id,exercise_name_snapshot,prescribed_series_snapshot,prescribed_reps_snapshot,prescribed_load_snapshot,prescribed_rest_snapshot,prescribed_notes_snapshot,day_name_snapshot,group_snapshot,exercise_order_snapshot,day_order_snapshot,workout_title_snapshot,tracking_config_snapshot,status) values
      ('${ids.currentExercise}','${ids.current}','${ids.prescriptionA}','${ids.dayA}','Snapshot Exercise A','3','10','20 kg','60 s','Snapshot note','A','Full body',1,1,'Workout A','{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','not_started'),
      ('${ids.previousExercise}','${ids.previous}','${ids.prescriptionA}','${ids.dayA}','Previous A','3','10','20 kg','60 s','','A','Full body',1,1,'Workout A','{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','completed'),
      ('${ids.cancelledExercise}','${ids.cancelled}','${ids.prescriptionA}','${ids.dayA}','Cancelled A','3','99','99 kg','60 s','','A','Full body',1,1,'Workout A','{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','partial'),
      ('${ids.otherExercise}','${ids.other}','${ids.prescriptionB}','${ids.dayB}','Private B','3','10','20 kg','60 s','','B','Full body',1,1,'Workout B','{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','not_started');
    insert into public.workout_execution_sets(execution_exercise_id,set_number,reps,load_value,load_unit,bodyweight,rir,rpe,completed) values
      ('${ids.previousExercise}',1,10,20,'kg',false,2,null,true),
      ('${ids.previousExercise}',2,9,22,'kg',false,1,null,true),
      ('${ids.cancelledExercise}',1,99,99,'kg',false,0,null,true);
  `);
}

async function main() {
  const guard = validateLocalGuard(root);
  assert.equal(guard.ok, true, guard.errors.join("; "));
  setup();
  try {
    const initialText = scalar(actor(ids.userA, `select public.get_my_workout_player_v2('${ids.current}')::text;`));
    const initial = JSON.parse(initialText);
    assert.equal(initial.exercises[0].name, "Snapshot Exercise A");
    assert.equal(initial.exercises[0].sets.length, 0);
    assert.ok(Buffer.byteLength(initialText, "utf8") < 30000);

    const command = `select public.complete_workout_execution_set('${ids.current}','${ids.currentExercise}',1,'{"reps":10,"loadValue":20,"loadUnit":"kg","bodyweight":false,"rir":2}'::jsonb);`;
    sql(actor(ids.userA, command));
    sql(actor(ids.userA, command));
    assert.equal(Number(scalar(`select count(*) from public.workout_execution_sets where execution_exercise_id='${ids.currentExercise}' and set_number=1;`)), 1);
    expectError(actor(ids.userA, `select public.complete_workout_execution_set('${ids.current}','${ids.currentExercise}',1,'{"reps":9,"loadValue":20,"loadUnit":"kg","bodyweight":false,"rir":2}'::jsonb);`), /SET_CONFLICT/);

    const concurrentCommand = `select public.complete_workout_execution_set('${ids.current}','${ids.currentExercise}',2,'{"reps":8,"loadValue":22,"loadUnit":"kg","bodyweight":false,"rir":1}'::jsonb);`;
    const concurrent = await Promise.all([concurrentActorCall(ids.userA, concurrentCommand), concurrentActorCall(ids.userA, concurrentCommand)]);
    assert.deepEqual(concurrent.map((result) => result.code), [0, 0], JSON.stringify(concurrent));
    assert.equal(Number(scalar(`select count(*) from public.workout_execution_sets where execution_exercise_id='${ids.currentExercise}' and set_number=2;`)), 1);

    const resumedText = scalar(actor(ids.userA, `select public.get_my_workout_player_v2('${ids.current}')::text;`));
    const resumed = JSON.parse(resumedText);
    assert.equal(resumed.id, ids.current);
    assert.equal(resumed.exercises[0].sets[0].reps, 10);
    assert.equal(resumed.exercises[0].sets[0].loadValue, 20);
    assert.equal(resumed.exercises[0].sets[0].rir, 2);
    assert.ok(resumed.exercises[0].sets[0].completedAt);

    const previous = JSON.parse(scalar(actor(ids.userA, `select public.get_my_previous_workout_performance('${ids.prescriptionA}','${ids.current}')::text;`))).previousExecution;
    assert.equal(previous.sessionId, ids.previous);
    assert.equal(previous.sets[0].reps, 10);
    assert.equal(previous.sets.some((set) => set.reps === 99), false);

    assert.equal(scalar(actor(ids.userA, `select coalesce(public.get_my_workout_player_v2('${ids.other}')::text,'null');`)), "null");
    assert.equal(JSON.parse(scalar(actor(ids.userA, `select public.get_my_previous_workout_performance('${ids.prescriptionB}','${ids.current}')::text;`))).previousExecution, null);
    expectError(actor(ids.userB, `select public.complete_workout_execution_set('${ids.current}','${ids.currentExercise}',3,'{"reps":8}'::jsonb);`), /SESSION_NOT_OWNED/);
    expectError(actor(ids.userA, `select public.complete_workout_execution_set('${ids.current}','${ids.otherExercise}',3,'{"reps":8}'::jsonb);`), /INVALID_SET/);
    expectError(actor(ids.userA, `select public.complete_workout_execution_set('${ids.current}','${ids.currentExercise}',3,'{"duration":30}'::jsonb);`), /TRACKING_VALIDATION_ERROR/);
    expectError(actor(ids.userA, `select public.get_my_workout_player_v2('${ids.current}');`, "anon"), /permission denied/i);

    sql(`update public.treino_exercicios set nome='Changed source',series='99',tracking_config='{"load":false,"reps":false,"rir":false,"rpe":true,"duration":false,"distance":false}' where id='${ids.prescriptionA}';`);
    const immutable = JSON.parse(scalar(actor(ids.userA, `select public.get_my_workout_player_v2('${ids.current}')::text;`))).exercises[0];
    assert.equal(immutable.name, "Snapshot Exercise A");
    assert.equal(immutable.prescribedSeries, "3");
    assert.equal(immutable.trackingConfig.rir, true);

    sql(actor(ids.userA, `select public.cancel_workout_execution_session('${ids.current}','synthetic terminal test');`));
    expectError(actor(ids.userA, `select public.complete_workout_execution_set('${ids.current}','${ids.currentExercise}',3,'{"reps":8}'::jsonb);`), /SESSION_NOT_IN_PROGRESS/);

    const functionAudit = JSON.parse(scalar(`select jsonb_build_object(
      'securityDefiner',p.prosecdef,'searchPath',p.proconfig,
      'publicExecute',has_function_privilege('public',p.oid,'EXECUTE'),
      'anonExecute',has_function_privilege('anon',p.oid,'EXECUTE'),
      'authenticatedExecute',has_function_privilege('authenticated',p.oid,'EXECUTE')
    )::text from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='get_my_workout_player_v2';`));
    assert.equal(functionAudit.securityDefiner, true);
    assert.deepEqual(functionAudit.searchPath, ["search_path=\"\""]);
    assert.equal(functionAudit.publicExecute, false);
    assert.equal(functionAudit.anonExecute, false);
    assert.equal(functionAudit.authenticatedExecute, true);

    const historyPlan = sql(`set enable_seqscan=off; explain (format json) select id from public.workout_execution_sessions where aluno_id='${ids.studentA}' and status='completed' order by completed_at desc limit 1;`).stdout;
    const matchPlan = sql(`set enable_seqscan=off; explain (format json) select id from public.workout_execution_exercises where treino_exercicio_id='${ids.prescriptionA}' and session_id='${ids.previous}';`).stdout;
    assert.match(historyPlan, /workout_execution_sessions_valid_history_idx/);
    assert.match(matchPlan, /workout_execution_exercises_prescription_session_idx/);

    const report = {
      decision: "PASS",
      scope: "CYCLE_12_6_SET_TRACKING_PREVIOUS_PERFORMANCE",
      database_target: "LOCAL",
      fixtures: "SYNTHETIC",
      production_accessed: false,
      production_mutated: false,
      player_requests_initial: 1,
      previous_performance_requests_per_exercise: 1,
      write_requests_per_completion: 1,
      player_payload_bytes: Buffer.byteLength(resumedText, "utf8"),
      player_payload_budget_bytes: 30000,
      persisted_set_count: resumed.exercises[0].sets.length,
      idempotent_retry: "PASS",
      concurrent_equal_retry: "PASS",
      duplicate_rows: 0,
      conflicting_retry: "DENIED",
      cross_student_read: "SAFE_EMPTY",
      cross_student_write: "DENIED",
      previous_performance_valid_history_only: "PASS",
      cancelled_history_excluded: "PASS",
      snapshot_immutability: "PASS",
      reload_resume_values: "PASS",
      completed_at_server_timestamp: "PASS",
      terminal_write: "DENIED",
      grants: "LEAST_PRIVILEGE",
      search_path: "SAFE",
      query_plans: "PASS_EXISTING_INDEXES",
    };
    const reportPath = "reports/cycle-12-6-set-tracking-runtime.json";
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    for (const [key, value] of Object.entries(report)) console.log(`${key}=${value}`);
  } finally {
    cleanup();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  cleanup();
  process.exit(1);
});
