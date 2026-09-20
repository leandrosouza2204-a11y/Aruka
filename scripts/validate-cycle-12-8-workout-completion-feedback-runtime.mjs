import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const ids = {
  userA: "00000000-0000-4000-8000-000000008811",
  userB: "00000000-0000-4000-8000-000000008812",
  professional: "00000000-0000-4000-8000-000000008813",
  studentA: "00000000-0000-4000-8000-000000008821",
  studentB: "00000000-0000-4000-8000-000000008822",
  workout: "00000000-0000-4000-8000-000000008831",
  day: "00000000-0000-4000-8000-000000008841",
  prescription: "00000000-0000-4000-8000-000000008851",
};

const sql = (statement, options = {}) => runPsql(root, statement, { ...options, throwOnError: options.throwOnError ?? true });
const scalar = (statement) => sql(`\\pset tuples_only on\n\\pset format unaligned\n${statement}`).stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "";
const actor = (userId, statement, role = "authenticated") => `set request.jwt.claim.sub='${userId}'; set role ${role}; ${statement}`;

function cleanup() {
  sql(`
    delete from public.workout_execution_sessions where treino_id='${ids.workout}';
    delete from public.treinos where id='${ids.workout}';
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
      ('${ids.userA}'::uuid,'cycle-12-8-a@example.invalid'),
      ('${ids.userB}'::uuid,'cycle-12-8-b@example.invalid'),
      ('${ids.professional}'::uuid,'cycle-12-8-professional@example.invalid')
    ) users(id,email);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status) values ('${ids.professional}','${ids.professional}','Cycle 12.8 Professional','cycle-12-8-professional@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at) values
      ('${ids.studentA}','${ids.professional}','Cycle 12.8 Student A','+550000008811',current_date,'QA',0,'Ativo','synthetic','${ids.userA}','active',now()),
      ('${ids.studentB}','${ids.professional}','Cycle 12.8 Student B','+550000008812',current_date,'QA',0,'Ativo','synthetic','${ids.userB}','active',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,status,data_inicio,lifecycle_status,delivered_at) values ('${ids.workout}','${ids.professional}','${ids.studentA}','Completion QA','Ativo',current_date,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values ('${ids.day}','${ids.workout}','A','Full body',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem,tracking_config,exercise_media_snapshot) values ('${ids.prescription}','${ids.day}','Completion Exercise','1','10','','60 s','synthetic',1,'{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}');
  `);
}

function createSession(suffix, elapsedSeconds, withCompletedSet = true) {
  const sessionId = `00000000-0000-4000-8000-0000000089${suffix}`;
  const exerciseId = `00000000-0000-4000-8000-0000000088${suffix}`;
  sql(`
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,last_activity_at)
    values ('${sessionId}','${ids.studentA}','${ids.workout}','${ids.day}','in_progress',current_date,clock_timestamp()-interval '${elapsedSeconds} seconds',now());
    insert into public.workout_execution_exercises(id,session_id,treino_exercicio_id,treino_dia_id,exercise_name_snapshot,prescribed_series_snapshot,prescribed_reps_snapshot,prescribed_load_snapshot,prescribed_rest_snapshot,prescribed_notes_snapshot,day_name_snapshot,group_snapshot,exercise_order_snapshot,day_order_snapshot,workout_title_snapshot,tracking_config_snapshot,status)
    values ('${exerciseId}','${sessionId}','${ids.prescription}','${ids.day}','Completion Exercise','1','10','','60 s','synthetic','A','Full body',1,1,'Completion QA','{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','not_started');
  `);
  if (withCompletedSet) sql(actor(ids.userA, `select public.complete_workout_execution_set('${sessionId}','${exerciseId}',1,'{"reps":10}'::jsonb);`));
  return { sessionId, exerciseId };
}

function callCompletion(userId, sessionId, confirmed, feedback, throwOnError = true) {
  const value = feedback === null ? "null" : `'${feedback.replaceAll("'", "''")}'`;
  return sql(actor(userId, `select public.complete_workout_execution_session_v2('${sessionId}',${confirmed},${value});`), { throwOnError });
}

function callLegacyCompletion(userId, sessionId, confirmed, throwOnError = true) {
  return sql(actor(userId, `select public.complete_workout_execution_session_v2('${sessionId}',${confirmed});`), { throwOnError });
}

function callCompletionAtElapsed(userId, sessionId, elapsedSeconds, confirmed, feedback, throwOnError = true) {
  const value = feedback === null ? "null" : `'${feedback.replaceAll("'", "''")}'`;
  return sql(`
    update public.workout_execution_sessions set started_at=clock_timestamp()-interval '${elapsedSeconds} seconds' where id='${sessionId}';
    ${actor(userId, `select public.complete_workout_execution_session_v2('${sessionId}',${confirmed},${value});`)}
  `, { throwOnError });
}

function main() {
  assert.equal(validateLocalGuard(root).ok, true);
  const forbiddenSessionPrivileges = ["INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES", "TRIGGER", "MAINTAIN"];
  for (const role of ["anon", "authenticated"]) {
    for (const privilege of forbiddenSessionPrivileges) {
      assert.equal(
        scalar(`select has_table_privilege('${role}','public.workout_execution_sessions','${privilege}')::text;`),
        "false",
        `${role} unexpectedly retains ${privilege} on workout_execution_sessions`,
      );
    }
  }
  assert.equal(scalar("select has_table_privilege('authenticated','public.workout_execution_sessions','SELECT')::text;"), "true");
  assert.equal(scalar(`
    select count(*)::text
    from aclexplode((select relacl from pg_class where oid='public.workout_execution_sessions'::regclass)) acl
    where acl.grantee=0 and acl.privilege_type=any(array['INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER','MAINTAIN']);
  `), "0");
  setup();
  try {
    for (const [suffix, seconds] of [["01", 60], ["02", 120], ["03", 300]]) {
      const current = createSession(suffix, seconds);
      const rejected = callCompletionAtElapsed(ids.userA, current.sessionId, seconds, false, null, false);
      assert.notEqual(rejected.status, 0, `short completion unexpectedly succeeded at ${seconds}s: ${rejected.stdout}`);
      assert.match(`${rejected.stderr}\n${rejected.stdout}`, /SHORT_WORKOUT_CONFIRMATION_REQUIRED/);
      callCompletion(ids.userA, current.sessionId, true, `Feedback ${seconds}`);
      assert.equal(scalar(`select status from public.workout_execution_sessions where id='${current.sessionId}';`), "completed");
    }

    const long = createSession("04", 301);
    callCompletion(ids.userA, long.sessionId, false, "Treino acima do limiar");
    assert.equal(scalar(`select short_duration_confirmed from public.workout_execution_sessions where id='${long.sessionId}';`), "f");
    assert.equal(scalar(`select feedback_text from public.workout_execution_session_feedback where session_id='${long.sessionId}';`), "Treino acima do limiar");

    callCompletion(ids.userA, long.sessionId, false, "Treino acima do limiar");
    assert.equal(scalar(`select count(*) from public.workout_execution_session_feedback where session_id='${long.sessionId}';`), "1");
    const conflict = callCompletion(ids.userA, long.sessionId, false, "Outro feedback", false);
    assert.notEqual(conflict.status, 0);
    assert.match(`${conflict.stderr}\n${conflict.stdout}`, /FEEDBACK_CONFLICT/);

    const invalidFeedback = createSession("06", 400);
    const invalidFeedbackResult = callCompletion(ids.userA, invalidFeedback.sessionId, false, "x".repeat(1001), false);
    assert.match(`${invalidFeedbackResult.stderr}\n${invalidFeedbackResult.stdout}`, /FEEDBACK_TOO_LONG/);
    assert.equal(scalar(`select status from public.workout_execution_sessions where id='${invalidFeedback.sessionId}';`), "in_progress");
    sql(`delete from public.workout_execution_sessions where id='${invalidFeedback.sessionId}';`);

    const zero = createSession("05", 400, false);
    const zeroResult = callCompletion(ids.userA, zero.sessionId, false, null, false);
    assert.match(`${zeroResult.stderr}\n${zeroResult.stdout}`, /ZERO_COMPLETED_SETS/);
    assert.equal(scalar(`select status from public.workout_execution_sessions where id='${zero.sessionId}';`), "in_progress");

    const foreign = callCompletion(ids.userB, zero.sessionId, false, null, false);
    assert.match(`${foreign.stderr}\n${foreign.stdout}`, /SESSION_NOT_OWNED/);
    sql(`delete from public.workout_execution_sessions where id='${zero.sessionId}';`);
    assert.equal(scalar(actor(ids.userA, `select has_table_privilege('authenticated','public.workout_execution_session_feedback','SELECT');`)), "f");
    assert.equal(scalar(actor(ids.userA, `select coalesce(public.get_my_workout_player_v2('${long.sessionId}')->>'feedback','');`)), "Treino acima do limiar");
    assert.equal(scalar(actor(ids.userB, `select coalesce(public.get_my_workout_player_v2('${long.sessionId}')::text,'null');`)), "null");

    const terminalWrite = sql(actor(ids.userA, `select public.complete_workout_execution_set('${long.sessionId}','${long.exerciseId}',1,'{"reps":10}'::jsonb);`), { throwOnError: false });
    assert.match(`${terminalWrite.stderr}\n${terminalWrite.stdout}`, /SESSION_NOT_IN_PROGRESS/);
    assert.equal(scalar(`select count(*) from public.workout_execution_sets ws join public.workout_execution_exercises e on e.id=ws.execution_exercise_id where e.session_id='${long.sessionId}' and ws.completed;`), "1");

    const legacy = createSession("07", 301);
    callLegacyCompletion(ids.userA, legacy.sessionId, false);
    assert.equal(scalar(`select status from public.workout_execution_sessions where id='${legacy.sessionId}';`), "completed");
    assert.equal(scalar(`select count(*) from public.workout_execution_session_feedback where session_id='${legacy.sessionId}';`), "0");

    const report = {
      decision: "PASS",
      scope: "CYCLE_12_8_WORKOUT_COMPLETION_FEEDBACK_RUNTIME",
      database_target: "LOCAL",
      fixtures: "SYNTHETIC",
      production_accessed: false,
      production_mutated: false,
      explicit_completion: "PASS",
      short_duration_60_120_300: "PASS",
      duration_301_without_confirmation: "PASS",
      zero_set_gate: "PASS",
      feedback_validation_persistence_reload: "PASS",
      invalid_feedback_rejected: "PASS",
      equal_retry_idempotency: "PASS",
      divergent_retry_conflict: "PASS",
      cross_student_isolation: "PASS",
      terminal_immutability: "PASS",
      session_table_least_privilege: "PASS",
      legacy_signature_compatibility: "PASS",
      feedback_direct_access: "PASS",
    };
    const path = "reports/cycle-12-8-workout-completion-feedback-runtime.json";
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
    for (const [key, value] of Object.entries(report)) console.log(`${key}=${value}`);
  } finally {
    cleanup();
  }
}

try { main(); } catch (error) { cleanup(); console.error(error.stack || error.message); process.exit(1); }
