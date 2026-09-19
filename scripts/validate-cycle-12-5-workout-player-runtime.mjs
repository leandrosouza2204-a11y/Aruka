import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const ids = {
  userA: "00000000-0000-4000-8000-000000005511",
  userB: "00000000-0000-4000-8000-000000005512",
  suspendedUser: "00000000-0000-4000-8000-000000005513",
  professional: "00000000-0000-4000-8000-000000005514",
  studentA: "00000000-0000-4000-8000-000000005521",
  studentB: "00000000-0000-4000-8000-000000005522",
  suspendedStudent: "00000000-0000-4000-8000-000000005523",
  programA: "00000000-0000-4000-8000-000000005531",
  programB: "00000000-0000-4000-8000-000000005532",
  dayA: "00000000-0000-4000-8000-000000005541",
  dayB: "00000000-0000-4000-8000-000000005542",
  prescription1: "00000000-0000-4000-8000-000000005551",
  prescription2: "00000000-0000-4000-8000-000000005552",
  prescription3: "00000000-0000-4000-8000-000000005553",
  otherPrescription: "00000000-0000-4000-8000-000000005554",
  active: "00000000-0000-4000-8000-000000005561",
  completed: "00000000-0000-4000-8000-000000005563",
  abandoned: "00000000-0000-4000-8000-000000005564",
  other: "00000000-0000-4000-8000-000000005565",
  execution1: "00000000-0000-4000-8000-000000005571",
  execution2: "00000000-0000-4000-8000-000000005572",
  execution3: "00000000-0000-4000-8000-000000005573",
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
function cleanup() {
  sql(`
    delete from public.workout_execution_sessions where id in ('${ids.active}','${ids.completed}','${ids.abandoned}','${ids.other}');
    delete from public.treinos where id in ('${ids.programA}','${ids.programB}');
    delete from public.alunos where id in ('${ids.studentA}','${ids.studentB}','${ids.suspendedStudent}');
    delete from public.perfis where id='${ids.professional}';
    delete from auth.users where id in ('${ids.userA}','${ids.userB}','${ids.suspendedUser}','${ids.professional}');
  `, { throwOnError: false });
}
function setup() {
  cleanup();
  sql(`
    insert into auth.users(id,instance_id,aud,role,email,confirmation_token,recovery_token,email_change_token_new,email_change_token_current,email_change,phone_change,phone_change_token,reauthentication_token,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data,is_super_admin)
    select id,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',email,'','','','','','','','',now(),now(),now(),'{}','{}',false
    from (values
      ('${ids.userA}'::uuid,'player-a.cycle12@example.invalid'),
      ('${ids.userB}'::uuid,'player-b.cycle12@example.invalid'),
      ('${ids.suspendedUser}'::uuid,'player-suspended.cycle12@example.invalid'),
      ('${ids.professional}'::uuid,'player-professional.cycle12@example.invalid')
    ) users(id,email);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status)
    values ('${ids.professional}','${ids.professional}','Player Professional','player-professional.cycle12@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at)
    values
      ('${ids.studentA}','${ids.professional}','Aluno Player A','+550000005511',current_date,'QA',0,'Ativo','cycle12 player','${ids.userA}','active',now()),
      ('${ids.studentB}','${ids.professional}','Aluno Player B','+550000005512',current_date,'QA',0,'Ativo','cycle12 player','${ids.userB}','active',now()),
      ('${ids.suspendedStudent}','${ids.professional}','Aluno Suspenso','+550000005513',current_date,'QA',0,'Ativo','cycle12 player','${ids.suspendedUser}','suspended',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,status,data_inicio,lifecycle_status,delivered_at)
    values
      ('${ids.programA}','${ids.professional}','${ids.studentA}','Programa Player A','Ativo',current_date,'active',now()),
      ('${ids.programB}','${ids.professional}','${ids.studentB}','Programa Player B','Ativo',current_date,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values
      ('${ids.dayA}','${ids.programA}','Treino A','Corpo inteiro',1),
      ('${ids.dayB}','${ids.programB}','Treino B','Pernas',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,video_url,ordem,tracking_config,exercise_media_snapshot) values
      ('${ids.prescription1}','${ids.dayA}','Exercício fonte 1','3','10','20 kg','60 s','fonte 1','',2,'{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','{}'),
      ('${ids.prescription2}','${ids.dayA}','Exercício fonte 2','4','8','30 kg','90 s','fonte 2','',1,'{"load":true,"reps":true,"rir":false,"rpe":true,"duration":false,"distance":false}','{"name":"Exercício fonte 2","media":{"type":"youtube","videoId":"dQw4w9WgXcQ","youtubeUrl":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}}'),
      ('${ids.prescription3}','${ids.dayA}','Exercício fonte 3','2','12','','45 s','','',2,'{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}'),
      ('${ids.otherPrescription}','${ids.dayB}','Exercício B','3','10','','60 s','','',1,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}');
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,last_activity_at,completed_at,abandoned_at) values
      ('${ids.active}','${ids.studentA}','${ids.programA}','${ids.dayA}','in_progress',current_date,now()-interval '20 minutes',now(),null,null),
      ('${ids.completed}','${ids.studentA}','${ids.programA}','${ids.dayA}','completed',current_date-1,now()-interval '1 day 20 minutes',now()-interval '1 day',now()-interval '1 day',null),
      ('${ids.abandoned}','${ids.studentA}','${ids.programA}','${ids.dayA}','abandoned',current_date-2,now()-interval '2 days 20 minutes',now()-interval '2 days',null,now()-interval '2 days'),
      ('${ids.other}','${ids.studentB}','${ids.programB}','${ids.dayB}','in_progress',current_date,now()-interval '10 minutes',now(),null,null);
    insert into public.workout_execution_exercises(id,session_id,treino_exercicio_id,treino_dia_id,exercise_name_snapshot,prescribed_series_snapshot,prescribed_reps_snapshot,prescribed_load_snapshot,prescribed_rest_snapshot,prescribed_notes_snapshot,day_name_snapshot,group_snapshot,exercise_order_snapshot,day_order_snapshot,workout_title_snapshot,tracking_config_snapshot,status) values
      ('${ids.execution1}','${ids.active}','${ids.prescription1}','${ids.dayA}','Snapshot Um','3','10','20 kg','60 s','Orientação snapshot','Treino A','Corpo inteiro',2,1,'Programa Player A','{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','not_started'),
      ('${ids.execution2}','${ids.active}','${ids.prescription2}','${ids.dayA}','Snapshot Dois','4','8','30 kg','90 s','','Treino A','Corpo inteiro',1,1,'Programa Player A','{"load":true,"reps":true,"rir":false,"rpe":true,"duration":false,"distance":false}','not_started'),
      ('${ids.execution3}','${ids.active}','${ids.prescription3}','${ids.dayA}','Snapshot Três','2','12','','45 s','','Treino A','Corpo inteiro',2,1,'Programa Player A','{"load":false,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','not_started'),
      ('00000000-0000-4000-8000-000000005575','${ids.completed}','${ids.prescription1}','${ids.dayA}','Concluído','3','10','','60 s','','Treino A','Corpo inteiro',1,1,'Programa Player A','{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','completed'),
      ('00000000-0000-4000-8000-000000005576','${ids.abandoned}','${ids.prescription1}','${ids.dayA}','Abandonado','3','10','','60 s','','Treino A','Corpo inteiro',1,1,'Programa Player A','{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','partial'),
      ('00000000-0000-4000-8000-000000005577','${ids.other}','${ids.otherPrescription}','${ids.dayB}','Segredo B','3','10','','60 s','','Treino B','Pernas',1,1,'Programa Player B','{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','not_started');
  `);
}
function expectDenied(statement) {
  const result = sql(statement, { throwOnError: false });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /permission denied|authentication required/i);
}

function main() {
  const guard = validateLocalGuard(root);
  assert.equal(guard.ok, true, guard.errors.join("; "));
  setup();
  try {
    const firstText = scalar(actor(ids.userA, `select public.get_my_workout_player_v2('${ids.active}')::text;`));
    const first = JSON.parse(firstText);
    assert.equal(first.id, ids.active);
    assert.equal(first.status, "in_progress");
    assert.deepEqual(first.exercises.map((exercise) => exercise.name), ["Snapshot Dois", "Snapshot Um", "Snapshot Três"]);
    assert.equal(first.exercises[0].media.type, "youtube");
    assert.equal(first.exercises.find((exercise) => exercise.id === ids.execution1).trackingConfig.rir, true);
    assert.ok(Buffer.byteLength(firstText, "utf8") < 30000);
    assert.equal(/history|programs|studentAccess/i.test(firstText), false);

    const cross = scalar(actor(ids.userA, `select coalesce(public.get_my_workout_player_v2('${ids.other}')::text, 'null');`));
    assert.equal(cross, "null");
    assert.equal(cross.includes("Segredo B"), false);
    assert.equal(scalar(actor(ids.suspendedUser, `select coalesce(public.get_my_workout_player_v2('${ids.active}')::text, 'null');`)), "null");
    assert.equal(scalar(actor(ids.professional, `select coalesce(public.get_my_workout_player_v2('${ids.active}')::text, 'null');`)), "null");
    assert.equal(scalar(actor(ids.userA, "select coalesce(public.get_my_workout_player_v2('00000000-0000-4000-8000-000000005599')::text, 'null');")), "null");
    expectDenied(actor(ids.userA, `select public.get_my_workout_player_v2('${ids.active}');`, "anon"));

    for (const [sessionId, status] of [[ids.completed, "completed"], [ids.abandoned, "abandoned"]]) {
      const terminal = JSON.parse(scalar(actor(ids.userA, `select public.get_my_workout_player_v2('${sessionId}')::text;`)));
      assert.equal(terminal.status, status);
    }

    sql(`update public.treino_exercicios set nome='Fonte alterada',series='99',repeticoes='1',tracking_config='{"load":false,"reps":false,"rir":false,"rpe":false,"duration":true,"distance":true}' where id='${ids.prescription1}';`);
    const reloadedText = scalar(actor(ids.userA, `select public.get_my_workout_player_v2('${ids.active}')::text;`));
    const reloaded = JSON.parse(reloadedText);
    const immutable = reloaded.exercises.find((exercise) => exercise.id === ids.execution1);
    assert.equal(immutable.name, "Snapshot Um");
    assert.equal(immutable.prescribedSeries, "3");
    assert.equal(immutable.prescribedReps, "10");
    assert.equal(immutable.trackingConfig.rir, true);
    assert.equal(reloaded.id, first.id);

    scalar(actor(ids.userA, `select public.skip_workout_execution_exercise('${ids.active}','${ids.execution1}')::text;`));
    const afterSkip = JSON.parse(scalar(actor(ids.userA, `select public.get_my_workout_player_v2('${ids.active}')::text;`)));
    assert.equal(afterSkip.exercises.find((exercise) => exercise.id === ids.execution1).status, "skipped");
    scalar(actor(ids.userA, `select public.cancel_workout_execution_session('${ids.active}','runtime confirmation')::text;`));
    const cancelled = JSON.parse(scalar(actor(ids.userA, `select public.get_my_workout_player_v2('${ids.active}')::text;`)));
    assert.equal(cancelled.status, "cancelled");
    const terminalWrite = sql(actor(ids.userA, `select public.skip_workout_execution_exercise('${ids.active}','${ids.execution1}');`), { throwOnError: false });
    assert.notEqual(terminalWrite.status, 0);
    assert.match(`${terminalWrite.stdout}\n${terminalWrite.stderr}`, /SESSION_NOT_IN_PROGRESS/);

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

    const sessionPlan = sql(`set enable_seqscan=off; explain (format json) select id from public.workout_execution_sessions where id='${ids.active}' and aluno_id='${ids.studentA}';`).stdout;
    const exercisesPlan = sql(`set enable_seqscan=off; explain (format json) select id from public.workout_execution_exercises where session_id='${ids.active}' order by day_order_snapshot,exercise_order_snapshot,id;`).stdout;
    assert.match(sessionPlan, /workout_execution_sessions_(pkey|aluno_recent_idx)/);
    assert.match(exercisesPlan, /workout_execution_exercises_session_(id|order)_idx/);

    const report = {
      decision: "PASS",
      scope: "CYCLE_12_5_WORKOUT_PLAYER_V2",
      database_target: "LOCAL",
      production_accessed: false,
      production_mutated: false,
      player_request_count: 1,
      player_payload_bytes: Buffer.byteLength(firstText, "utf8"),
      player_payload_budget_bytes: 30000,
      exercise_count: first.exercises.length,
      no_n_plus_one: "PASS",
      no_full_history_or_global_library: "PASS",
      own_student: "PASS",
      cross_student: "SAFE_EMPTY",
      anon: "DENIED",
      professional: "SAFE_EMPTY",
      suspended: "SAFE_EMPTY",
      invalid_session: "SAFE_EMPTY",
      terminal_sessions: "READ_ONLY_UI_CONTRACT",
      terminal_write: "DENIED",
      canonical_order: "PASS",
      snapshot_immutability: "PASS",
      same_session_after_reload: "PASS",
      skip_persistence: "PASS",
      cancel_contract: "PASS",
      search_path: "SAFE",
      grants: "LEAST_PRIVILEGE",
      query_plans: "PASS_EXISTING_INDEXES",
    };
    const path = "reports/cycle-12-5-workout-player-runtime.json";
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
    for (const [key, value] of Object.entries(report)) console.log(`${key}=${value}`);
  } finally {
    cleanup();
  }
}

try { main(); } catch (error) { console.error(error.stack || error.message); cleanup(); process.exit(1); }
