import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { getDbContainer, runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const container = getDbContainer(root);
const ids = {
  professional: "00000000-0000-4000-8000-000000121551",
  studentUser: "00000000-0000-4000-8000-000000121552",
  student: "00000000-0000-4000-8000-000000121553",
  workout: "00000000-0000-4000-8000-000000121554",
  day: "00000000-0000-4000-8000-000000121555",
  exercise: "00000000-0000-4000-8000-000000121556",
};

assert.equal(validateLocalGuard(root).ok, true, "local-only guard must pass");

function sql(statement, throwOnError = true) {
  return runPsql(root, statement, { throwOnError });
}

function actorCall(origin, key) {
  return concurrentActor(`select public.start_workout_execution_session('${ids.workout}','${ids.day}','${key}',current_date,'${origin}');`);
}

function concurrentActor(call) {
  const statement = `set request.jwt.claim.sub='${ids.studentUser}'; set role authenticated; ${call}`;
  return new Promise((resolve) => {
    const child = spawn("docker", ["exec", container, "psql", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", "postgres", "-q", "-c", statement], {
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

function actorSync(call, throwOnError = true) {
  return sql(`set request.jwt.claim.sub='${ids.studentUser}'; set role authenticated; ${call}`, throwOnError);
}

function scalar(statement) {
  return sql(`\\pset tuples_only on
\\pset format unaligned
${statement}`).stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "";
}

function cleanup() {
  sql(`
    delete from private.student_experience_rollout_targets where target_type='student' and target_id='${ids.student}';
    update private.student_experience_rollout_config set global_enabled=false, emergency_blocked=false, reason='DEFAULT_OFF';
    delete from public.workout_execution_sessions where aluno_id='${ids.student}';
    delete from public.treinos where id='${ids.workout}';
    delete from public.alunos where id='${ids.student}';
    delete from public.perfis where user_id='${ids.professional}';
    delete from auth.users where id in ('${ids.studentUser}','${ids.professional}');
  `, false);
}

cleanup();
try {
  sql(`
    insert into auth.users(id,aud,role,email,email_confirmed_at,created_at,updated_at) values
      ('${ids.professional}','authenticated','authenticated','race-prof@example.test',now(),now(),now()),
      ('${ids.studentUser}','authenticated','authenticated','race-student@example.test',now(),now(),now());
    insert into public.perfis(user_id,role,tipo_acesso,status) values ('${ids.professional}','user','beta','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,student_user_id,student_access_status)
      values('${ids.student}','${ids.professional}','Race','1',current_date,'QA','${ids.studentUser}','active');
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,lifecycle_status,delivered_at)
      values('${ids.workout}','${ids.professional}','${ids.student}','Race','active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem)
      values('${ids.day}','${ids.workout}','A','QA',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem)
      values('${ids.exercise}','${ids.day}','Race','1','10','0','30s','',1);
    update private.student_experience_rollout_config set global_enabled=true, emergency_blocked=false, config_version=config_version+1, reason='QA_RACE';
    insert into private.student_experience_rollout_targets(target_type,target_id,enabled,reason)
      values('student','${ids.student}',true,'QA_RACE');
  `);

  const results = await Promise.all([
    actorCall("v1", "cycle-12-15-2-race-v1"),
    actorCall("v2", "cycle-12-15-2-race-v2"),
  ]);
  assert.deepEqual(results.map((result) => result.code), [0, 0], JSON.stringify(results));

  const final = sql(`\\pset tuples_only on
    \\pset format unaligned
    select count(*)||'|'||min(experience_origin)||'|'||max(experience_origin)
    from public.workout_execution_sessions
    where aluno_id='${ids.student}' and treino_id='${ids.workout}' and status='in_progress';
  `).stdout.trim().split(/\r?\n/).filter(Boolean).at(-1);
  assert.match(final, /^1\|(v1|v2)\|\1$/);
  console.log(`CYCLE_12_15_2_START_RACE=PASS origin=${final.split("|")[1]} sessions=1`);

  sql(`delete from public.workout_execution_sessions where aluno_id='${ids.student}';`);
  actorSync(`select public.start_workout_execution_session('${ids.workout}','${ids.day}','cycle-12-15-2-v2',current_date,'v2');`);
  const v2Session = scalar(`select id from public.workout_execution_sessions where aluno_id='${ids.student}' and status='in_progress';`);
  const v2Exercise = scalar(`select id from public.workout_execution_exercises where session_id='${v2Session}' limit 1;`);
  const setCall = `select public.complete_workout_execution_set('${v2Session}','${v2Exercise}',1,'{"reps":10,"loadValue":0,"loadUnit":"kg","bodyweight":false}'::jsonb);`;
  const twoTabs = await Promise.all([concurrentActor(setCall), concurrentActor(setCall)]);
  assert.deepEqual(twoTabs.map((result) => result.code), [0, 0], JSON.stringify(twoTabs));
  assert.equal(scalar(`select count(*) from public.workout_execution_sets where execution_exercise_id='${v2Exercise}' and set_number=1;`), "1");
  const legacyWrite = actorSync(`select public.save_workout_execution('${v2Session}','[]'::jsonb);`, false);
  assert.notEqual(legacyWrite.status, 0);
  assert.match(`${legacyWrite.stdout}\n${legacyWrite.stderr}`, /SESSION_EXPERIENCE_CONFLICT/);

  sql(`delete from private.student_experience_rollout_targets where target_type='student' and target_id='${ids.student}';`);
  assert.equal(scalar(`select private.resolve_student_experience_route('${ids.studentUser}')->>'reasonCode';`), "ACTIVE_V2_WORKOUT");
  const completions = await Promise.all([
    concurrentActor(`select public.complete_workout_execution_session_v2('${v2Session}',true,null);`),
    concurrentActor(`select public.complete_workout_execution_session_v2('${v2Session}',true,null);`),
  ]);
  assert.deepEqual(completions.map((result) => result.code), [0, 0], JSON.stringify(completions));

  actorSync(`select public.start_workout_execution_session('${ids.workout}','${ids.day}','cycle-12-15-2-v1',current_date,'v1');`);
  const v1Session = scalar(`select id from public.workout_execution_sessions where aluno_id='${ids.student}' and status='in_progress';`);
  const v1Exercise = scalar(`select id from public.workout_execution_exercises where session_id='${v1Session}' limit 1;`);
  actorSync(`select public.save_workout_execution('${v1Session}','[]'::jsonb);`);
  sql(`insert into private.student_experience_rollout_targets(target_type,target_id,enabled,reason) values('student','${ids.student}',true,'QA_GRANT');`);
  assert.equal(scalar(`select private.resolve_student_experience_route('${ids.studentUser}')->>'reasonCode';`), "ACTIVE_V1_WORKOUT");
  const v2AgainstV1 = actorSync(`select public.complete_workout_execution_set('${v1Session}','${v1Exercise}',1,'{"reps":10}'::jsonb);`, false);
  assert.notEqual(v2AgainstV1.status, 0);
  assert.match(`${v2AgainstV1.stdout}\n${v2AgainstV1.stderr}`, /SESSION_EXPERIENCE_CONFLICT/);

  sql(`update public.workout_execution_sessions set status='cancelled',cancelled_at=now() where id='${v1Session}';`);
  actorSync(`select public.start_workout_execution_session('${ids.workout}','${ids.day}','cycle-12-15-2-terminal-race',current_date,'v2');`);
  const terminalRaceSession = scalar(`select id from public.workout_execution_sessions where aluno_id='${ids.student}' and status='in_progress';`);
  const terminalRaceExercise = scalar(`select id from public.workout_execution_exercises where session_id='${terminalRaceSession}' limit 1;`);
  actorSync(`select public.complete_workout_execution_set('${terminalRaceSession}','${terminalRaceExercise}',1,'{"reps":10}'::jsonb);`);
  const terminalRace = await Promise.all([
    concurrentActor(`select public.cancel_workout_execution_session('${terminalRaceSession}','QA race');`),
    concurrentActor(`select public.complete_workout_execution_session_v2('${terminalRaceSession}',true,null);`),
  ]);
  assert.deepEqual(terminalRace.map((result) => result.code).sort(), [0, 1], JSON.stringify(terminalRace));
  assert.match(scalar(`select status from public.workout_execution_sessions where id='${terminalRaceSession}';`), /^(cancelled|completed)$/);
  console.log("CYCLE_12_15_2_COEXISTENCE_MATRIX=PASS");
  console.log("CYCLE_12_15_2_CONCURRENT_RESUME_SET_COMPLETION=PASS");
  console.log("CYCLE_12_15_2_CANCEL_VS_COMPLETION=PASS");
} finally {
  cleanup();
}
