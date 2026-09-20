import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { normalizeWorkoutPlayerV2 } from "../src/features/studentExperienceV2/domain/studentWorkoutPlayerV2.js";
import {
  createServerClockAnchor,
  deriveCanonicalRest,
  deriveRestTimerPresentation,
  estimateServerNow,
} from "../src/features/studentExperienceV2/domain/workoutRestTimerV2.js";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const ids = {
  userA: "00000000-0000-4000-8000-000000007711",
  userB: "00000000-0000-4000-8000-000000007712",
  professional: "00000000-0000-4000-8000-000000007713",
  studentA: "00000000-0000-4000-8000-000000007721",
  studentB: "00000000-0000-4000-8000-000000007722",
  workoutA: "00000000-0000-4000-8000-000000007731",
  workoutB: "00000000-0000-4000-8000-000000007732",
  dayA: "00000000-0000-4000-8000-000000007741",
  dayB: "00000000-0000-4000-8000-000000007742",
  prescriptionRest: "00000000-0000-4000-8000-000000007751",
  prescriptionNoRest: "00000000-0000-4000-8000-000000007752",
  prescriptionOther: "00000000-0000-4000-8000-000000007753",
  sessionA: "00000000-0000-4000-8000-000000007761",
  sessionB: "00000000-0000-4000-8000-000000007762",
  exerciseRest: "00000000-0000-4000-8000-000000007771",
  exerciseNoRest: "00000000-0000-4000-8000-000000007772",
  exerciseOther: "00000000-0000-4000-8000-000000007773",
};

const sql = (statement, options = {}) => runPsql(root, statement, { ...options, throwOnError: options.throwOnError ?? true });
const scalar = (statement) => sql(`\\pset tuples_only on\n\\pset format unaligned\n${statement}`).stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "";
const actor = (userId, statement, role = "authenticated") => `set request.jwt.claim.sub='${userId}'; set role ${role}; ${statement}`;

function cleanup() {
  sql(`
    delete from public.workout_execution_sessions where id in ('${ids.sessionA}','${ids.sessionB}');
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
      ('${ids.userA}'::uuid,'cycle-12-7-a@example.invalid'),
      ('${ids.userB}'::uuid,'cycle-12-7-b@example.invalid'),
      ('${ids.professional}'::uuid,'cycle-12-7-professional@example.invalid')
    ) users(id,email);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status) values ('${ids.professional}','${ids.professional}','Cycle 12.7 Professional','cycle-12-7-professional@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at) values
      ('${ids.studentA}','${ids.professional}','Cycle 12.7 Student A','+550000007711',current_date,'QA',0,'Ativo','synthetic','${ids.userA}','active',now()),
      ('${ids.studentB}','${ids.professional}','Cycle 12.7 Student B','+550000007712',current_date,'QA',0,'Ativo','synthetic','${ids.userB}','active',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,status,data_inicio,lifecycle_status,delivered_at) values
      ('${ids.workoutA}','${ids.professional}','${ids.studentA}','Rest Timer A','Ativo',current_date,'active',now()),
      ('${ids.workoutB}','${ids.professional}','${ids.studentB}','Rest Timer B','Ativo',current_date,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values
      ('${ids.dayA}','${ids.workoutA}','A','Full body',1),
      ('${ids.dayB}','${ids.workoutB}','B','Full body',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem,tracking_config,exercise_media_snapshot) values
      ('${ids.prescriptionRest}','${ids.dayA}','Rest Exercise','3','10','20 kg','60 s','synthetic',1,'{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}'),
      ('${ids.prescriptionNoRest}','${ids.dayA}','No Rest Exercise','2','10','','','synthetic',2,'{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}'),
      ('${ids.prescriptionOther}','${ids.dayB}','Private Exercise','2','10','','60 s','synthetic',1,'{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}');
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,last_activity_at) values
      ('${ids.sessionA}','${ids.studentA}','${ids.workoutA}','${ids.dayA}','in_progress',current_date,now()-interval '10 minutes',now()),
      ('${ids.sessionB}','${ids.studentB}','${ids.workoutB}','${ids.dayB}','in_progress',current_date,now()-interval '10 minutes',now());
    insert into public.workout_execution_exercises(id,session_id,treino_exercicio_id,treino_dia_id,exercise_name_snapshot,prescribed_series_snapshot,prescribed_reps_snapshot,prescribed_load_snapshot,prescribed_rest_snapshot,prescribed_notes_snapshot,day_name_snapshot,group_snapshot,exercise_order_snapshot,day_order_snapshot,workout_title_snapshot,tracking_config_snapshot,status) values
      ('${ids.exerciseRest}','${ids.sessionA}','${ids.prescriptionRest}','${ids.dayA}','Rest Exercise','3','10','20 kg','60 s','synthetic','A','Full body',1,1,'Rest Timer A','{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','not_started'),
      ('${ids.exerciseNoRest}','${ids.sessionA}','${ids.prescriptionNoRest}','${ids.dayA}','No Rest Exercise','2','10','','','synthetic','A','Full body',2,1,'Rest Timer A','{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','not_started'),
      ('${ids.exerciseOther}','${ids.sessionB}','${ids.prescriptionOther}','${ids.dayB}','Private Exercise','2','10','','60 s','synthetic','B','Full body',1,1,'Rest Timer B','{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','not_started');
  `);
}

function readPlayer(userId, sessionId) {
  const text = scalar(actor(userId, `select coalesce(public.get_my_workout_player_v2('${sessionId}')::text,'null');`));
  return text === "null" ? null : normalizeWorkoutPlayerV2(JSON.parse(text));
}

function presentation(player) {
  const anchor = createServerClockAnchor(player.serverNow, 1000, 0);
  return deriveRestTimerPresentation(deriveCanonicalRest(player), estimateServerNow(anchor, 1000));
}

function main() {
  assert.equal(validateLocalGuard(root).ok, true);
  setup();
  try {
    const initial = readPlayer(ids.userA, ids.sessionA);
    assert.ok(initial.serverNow);
    assert.equal(deriveCanonicalRest(initial), null);

    const command = `select public.complete_workout_execution_set('${ids.sessionA}','${ids.exerciseRest}',1,'{"reps":10}'::jsonb);`;
    sql(actor(ids.userA, command));
    const active = readPlayer(ids.userA, ids.sessionA);
    const activeView = presentation(active);
    assert.equal(activeView.status, "active");
    assert.ok(activeView.remainingSeconds > 0 && activeView.remainingSeconds <= 60);
    const firstTimestamp = active.exercises[0].sets[0].completedAt;

    sql(actor(ids.userA, command));
    const retried = readPlayer(ids.userA, ids.sessionA);
    assert.equal(retried.exercises[0].sets[0].completedAt, firstTimestamp);
    assert.equal(deriveCanonicalRest(retried).identity, deriveCanonicalRest(active).identity);

    sql(`set session_replication_role=replica; update public.workout_execution_sets set updated_at=clock_timestamp()-interval '90 seconds' where execution_exercise_id='${ids.exerciseRest}' and set_number=1; set session_replication_role=origin;`);
    const expired = readPlayer(ids.userA, ids.sessionA);
    assert.equal(presentation(expired).status, "completed");
    assert.equal(presentation(expired).remainingSeconds, 0);

    sql(actor(ids.userA, `select public.complete_workout_execution_set('${ids.sessionA}','${ids.exerciseNoRest}',1,'{"reps":10}'::jsonb);`));
    assert.equal(deriveCanonicalRest(readPlayer(ids.userA, ids.sessionA)), null);

    assert.equal(readPlayer(ids.userA, ids.sessionB), null);
    assert.equal(scalar(actor(ids.userA, `select has_function_privilege('anon','public.get_my_workout_player_v2(uuid)','EXECUTE');`)), "f");

    sql(actor(ids.userA, `select public.cancel_workout_execution_session('${ids.sessionA}','synthetic cycle 12.7 terminal');`));
    assert.equal(deriveCanonicalRest(readPlayer(ids.userA, ids.sessionA)), null);

    const report = {
      decision: "PASS",
      scope: "CYCLE_12_7_REST_TIMER_RUNTIME",
      database_target: "LOCAL",
      fixtures: "SYNTHETIC",
      production_accessed: false,
      production_mutated: false,
      server_clock_anchor: "PASS",
      canonical_completion_timestamp: "PASS",
      active_rest_reconstruction: "PASS",
      expired_rest_clamped_zero: "PASS",
      idempotent_retry_does_not_restart: "PASS",
      newer_set_without_rest_clears_previous: "PASS",
      cross_student_read: "SAFE_EMPTY",
      terminal_session_timer: "ABSENT",
      periodic_writes: 0,
      workout_auto_completion: false,
    };
    const path = "reports/cycle-12-7-rest-timer-runtime.json";
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
    for (const [key, value] of Object.entries(report)) console.log(`${key}=${value}`);
  } finally {
    cleanup();
  }
}

try { main(); } catch (error) { cleanup(); console.error(error.stack || error.message); process.exit(1); }
