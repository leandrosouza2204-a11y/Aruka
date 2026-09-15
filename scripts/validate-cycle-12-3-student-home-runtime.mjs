import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const ids = {
  studentUser: "00000000-0000-4000-8000-000000003311",
  otherUser: "00000000-0000-4000-8000-000000003312",
  suspendedUser: "00000000-0000-4000-8000-000000003313",
  professional: "00000000-0000-4000-8000-000000003314",
  student: "00000000-0000-4000-8000-000000003321",
  otherStudent: "00000000-0000-4000-8000-000000003322",
  suspendedStudent: "00000000-0000-4000-8000-000000003323",
  workout: "00000000-0000-4000-8000-000000003331",
  dayA: "00000000-0000-4000-8000-000000003341",
  dayB: "00000000-0000-4000-8000-000000003342",
  exerciseA: "00000000-0000-4000-8000-000000003351",
  exerciseB1: "00000000-0000-4000-8000-000000003352",
  exerciseB2: "00000000-0000-4000-8000-000000003353",
  active: "00000000-0000-4000-8000-000000003361",
  activeExercise1: "00000000-0000-4000-8000-000000003371",
  activeExercise2: "00000000-0000-4000-8000-000000003372",
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
    delete from public.workout_execution_sessions where aluno_id in ('${ids.student}','${ids.otherStudent}','${ids.suspendedStudent}');
    delete from public.treinos where id='${ids.workout}';
    delete from public.alunos where id in ('${ids.student}','${ids.otherStudent}','${ids.suspendedStudent}');
    delete from public.perfis where id='${ids.professional}';
    delete from auth.users where id in ('${ids.studentUser}','${ids.otherUser}','${ids.suspendedUser}','${ids.professional}');
  `, { throwOnError: false });
}

function setup() {
  cleanup();
  sql(`
    insert into auth.users(id,instance_id,aud,role,email,confirmation_token,recovery_token,email_change_token_new,email_change_token_current,email_change,phone_change,phone_change_token,reauthentication_token,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data,is_super_admin)
    select id,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',email,'','','','','','','','',now(),now(),now(),'{}','{}',false
    from (values
      ('${ids.studentUser}'::uuid,'home-student.cycle12@example.invalid'),
      ('${ids.otherUser}'::uuid,'home-other.cycle12@example.invalid'),
      ('${ids.suspendedUser}'::uuid,'home-suspended.cycle12@example.invalid'),
      ('${ids.professional}'::uuid,'home-professional.cycle12@example.invalid')
    ) users(id,email);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status)
    values ('${ids.professional}','${ids.professional}','Home Professional','home-professional.cycle12@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at)
    values
      ('${ids.student}','${ids.professional}','Ana Home','+550000003311',current_date,'QA',0,'Ativo','cycle12 home','${ids.studentUser}','active',now()),
      ('${ids.otherStudent}','${ids.professional}','Bia Home','+550000003312',current_date,'QA',0,'Ativo','cycle12 home','${ids.otherUser}','active',now()),
      ('${ids.suspendedStudent}','${ids.professional}','Cris Home','+550000003313',current_date,'QA',0,'Ativo','cycle12 home','${ids.suspendedUser}','suspended',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,objetivo,nivel,dias_semana,observacoes,status,data_inicio,data_revisao,lifecycle_status,delivered_at)
    values ('${ids.workout}','${ids.professional}','${ids.student}','Hipertrofia — Fase 2','Hipertrofia','Intermediário',3,'runtime','Ativo',current_date - 30,current_date + 10,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values
      ('${ids.dayA}','${ids.workout}','Treino A','Peito e tríceps',1),
      ('${ids.dayB}','${ids.workout}','Treino B','Costas e bíceps',2);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem,tracking_config) values
      ('${ids.exerciseA}','${ids.dayA}','Supino','3','10','20','60s','runtime',1,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}'),
      ('${ids.exerciseB1}','${ids.dayB}','Remada','3','10','20','60s','runtime',1,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}'),
      ('${ids.exerciseB2}','${ids.dayB}','Rosca','2','12','10','60s','runtime',2,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}');
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,completed_at,short_duration_confirmed) values
      ('00000000-0000-4000-8000-000000003362','${ids.student}','${ids.workout}','${ids.dayA}','completed',current_date,now()-interval '2 hours',now()-interval '1 hour',false),
      ('00000000-0000-4000-8000-000000003363','${ids.student}','${ids.workout}','${ids.dayA}','completed',current_date,now()-interval '4 hours',now()-interval '3 hours',true);
    with boundary as (
      select ((now() at time zone 'America/Sao_Paulo')::date - (extract(isodow from (now() at time zone 'America/Sao_Paulo')::date)::integer - 1)) as week_start
    )
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,completed_at,short_duration_confirmed)
    select '00000000-0000-4000-8000-000000003366'::uuid,'${ids.student}'::uuid,'${ids.workout}'::uuid,'${ids.dayA}'::uuid,'completed',week_start,
      (week_start::timestamp at time zone 'America/Sao_Paulo') + interval '20 minutes',
      (week_start::timestamp at time zone 'America/Sao_Paulo') + interval '30 minutes',true
    from boundary
    union all
    select '00000000-0000-4000-8000-000000003367'::uuid,'${ids.student}'::uuid,'${ids.workout}'::uuid,'${ids.dayA}'::uuid,'completed',week_start - 1,
      (week_start::timestamp at time zone 'America/Sao_Paulo') - interval '40 minutes',
      (week_start::timestamp at time zone 'America/Sao_Paulo') - interval '30 minutes',true
    from boundary;
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,cancelled_at) values
      ('00000000-0000-4000-8000-000000003364','${ids.student}','${ids.workout}','${ids.dayA}','cancelled',current_date,now()-interval '6 hours',now()-interval '5 hours');
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,abandoned_at) values
      ('00000000-0000-4000-8000-000000003365','${ids.student}','${ids.workout}','${ids.dayA}','abandoned',current_date,now()-interval '8 hours',now()-interval '7 hours');
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,last_activity_at)
    values ('${ids.active}','${ids.student}','${ids.workout}','${ids.dayB}','in_progress',current_date,now()-interval '30 minutes',now()-interval '5 minutes');
    insert into public.workout_execution_exercises(id,session_id,treino_exercicio_id,treino_dia_id,exercise_name_snapshot,prescribed_series_snapshot,prescribed_reps_snapshot,prescribed_load_snapshot,prescribed_rest_snapshot,day_name_snapshot,group_snapshot,exercise_order_snapshot,day_order_snapshot,workout_title_snapshot,status) values
      ('${ids.activeExercise1}','${ids.active}','${ids.exerciseB1}','${ids.dayB}','Remada','3','10','20','60s','Treino B','Costas e bíceps',1,2,'Hipertrofia — Fase 2','partial'),
      ('${ids.activeExercise2}','${ids.active}','${ids.exerciseB2}','${ids.dayB}','Rosca','2','12','10','60s','Treino B','Costas e bíceps',2,2,'Hipertrofia — Fase 2','not_started');
    insert into public.workout_execution_sets(execution_exercise_id,set_number,reps,load_value,completed)
    values ('${ids.activeExercise1}',1,10,20,true),('${ids.activeExercise1}',2,0,null,false);
  `);
}

function expectDenied(statement) {
  const result = sql(statement, { throwOnError: false });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stdout}\n${result.stderr}`, /permission denied/i);
}

function main() {
  const guard = validateLocalGuard(root);
  assert.equal(guard.ok, true, guard.errors.join("; "));
  setup();
  try {
    const homeText = scalar(actor(ids.studentUser, "select public.get_my_student_home_v2()::text;"));
    const home = JSON.parse(homeText);
    assert.ok(Buffer.byteLength(homeText, "utf8") < 5000);
    assert.deepEqual(Object.keys(home).sort(), ["activeSession", "calendar", "currentProgram", "evolutionSummary", "review", "student", "studentAccess", "todayWorkout", "weeklyProgress"].sort());
    assert.equal(home.student.id, ids.student);
    assert.equal(home.activeSession.id, ids.active);
    assert.equal(home.activeSession.completedSetCount, 1);
    assert.equal(home.activeSession.totalSetCount, 5);
    assert.equal(home.todayWorkout.treinoDiaId, ids.dayB);
    assert.equal(home.todayWorkout.exerciseCount, 2);
    assert.equal(home.todayWorkout.setCount, 5);
    assert.equal(home.currentProgram.displayName, "Hipertrofia — Fase 2");
    assert.equal(home.weeklyProgress.completedCount, 3);
    assert.equal(home.weeklyProgress.targetCount, 3);
    assert.equal(home.evolutionSummary.completedCount, 4);
    assert.equal(home.calendar.weekStartsOn, "monday");
    assert.equal(home.calendar.timeZone, "America/Sao_Paulo");
    assert.equal("exercises" in home, false);
    assert.equal("history" in home, false);

    const otherHome = JSON.parse(scalar(actor(ids.otherUser, "select public.get_my_student_home_v2()::text;")));
    assert.equal(otherHome.student.id, ids.otherStudent);
    assert.equal(otherHome.currentProgram, null);
    assert.equal(otherHome.activeSession, null);
    const suspendedHome = JSON.parse(scalar(actor(ids.suspendedUser, "select public.get_my_student_home_v2()::text;")));
    assert.equal(suspendedHome.studentAccess.status, "suspended");
    assert.equal(suspendedHome.currentProgram, null);
    const professionalHome = JSON.parse(scalar(actor(ids.professional, "select public.get_my_student_home_v2()::text;")));
    assert.equal(professionalHome.student, null);
    expectDenied(actor(ids.studentUser, "select public.get_my_student_home_v2();", "anon"));

    const audit = JSON.parse(scalar(`select jsonb_build_object(
      'securityDefiner',p.prosecdef,
      'searchPath',p.proconfig,
      'publicExecute',has_function_privilege('public',p.oid,'EXECUTE'),
      'anonExecute',has_function_privilege('anon',p.oid,'EXECUTE'),
      'authenticatedExecute',has_function_privilege('authenticated',p.oid,'EXECUTE')
    )::text from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='get_my_student_home_v2';`));
    assert.equal(audit.securityDefiner, true);
    assert.deepEqual(audit.searchPath, ["search_path=\"\""]);
    assert.equal(audit.publicExecute, false);
    assert.equal(audit.anonExecute, false);
    assert.equal(audit.authenticatedExecute, true);

    const programPlan = sql(`set enable_seqscan=off; explain (format json) select id from public.treinos where aluno_id='${ids.student}' and lifecycle_status='active' order by delivered_at desc nulls last, created_at desc limit 1;`).stdout;
    const metricPlan = sql(`set enable_seqscan=off; explain (format json) select id from public.workout_execution_sessions where aluno_id='${ids.student}' and status='completed' order by completed_at desc limit 20;`).stdout;
    assert.match(programPlan, /treinos_aluno_active_delivery_idx/);
    assert.match(metricPlan, /workout_execution_sessions_valid_history_idx/);

    const report = {
      decision: "PASS",
      scope: "CYCLE_12_3_STUDENT_HOME_V2",
      database_target: "LOCAL",
      production_accessed: false,
      production_mutated: false,
      payload_bounded: "PASS",
      request_strategy: "ONE_RPC",
      active_session: "PASS",
      today_workout: "PASS",
      weekly_metrics: "PASS",
      timezone_boundary: "PASS_AMERICA_SAO_PAULO_LOCAL_MIDNIGHT",
      review: "PASS",
      evolution_summary: "PASS",
      student_a_own: "PASS",
      student_b_cross_owner: "STRUCTURALLY_UNADDRESSABLE",
      professional_unrelated: "UNLINKED_PAYLOAD",
      suspended: "NO_STUDENT_DATA",
      anon: "DENIED",
      search_path: "SAFE",
      grants: "LEAST_PRIVILEGE",
      query_plans: "PASS",
    };
    const path = "reports/cycle-12-3-student-home-runtime.json";
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
    for (const [key, value] of Object.entries(report)) console.log(`${key}=${value}`);
  } finally {
    cleanup();
  }
}

try { main(); } catch (error) { console.error(error.stack || error.message); cleanup(); process.exit(1); }
