import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const ids = {
  studentUser: "00000000-0000-4000-8000-000000004411",
  otherUser: "00000000-0000-4000-8000-000000004412",
  suspendedUser: "00000000-0000-4000-8000-000000004413",
  professional: "00000000-0000-4000-8000-000000004414",
  student: "00000000-0000-4000-8000-000000004421",
  otherStudent: "00000000-0000-4000-8000-000000004422",
  suspendedStudent: "00000000-0000-4000-8000-000000004423",
  program: "00000000-0000-4000-8000-000000004431",
  olderProgram: "00000000-0000-4000-8000-000000004432",
  dayA: "00000000-0000-4000-8000-000000004441",
  dayB: "00000000-0000-4000-8000-000000004442",
  exerciseA1: "00000000-0000-4000-8000-000000004451",
  exerciseA2: "00000000-0000-4000-8000-000000004452",
  exerciseB: "00000000-0000-4000-8000-000000004453",
  session: "00000000-0000-4000-8000-000000004461",
  executionExercise: "00000000-0000-4000-8000-000000004471",
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
    delete from public.treinos where aluno_id in ('${ids.student}','${ids.otherStudent}','${ids.suspendedStudent}');
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
      ('${ids.studentUser}'::uuid,'library-student.cycle12@example.invalid'),
      ('${ids.otherUser}'::uuid,'library-other.cycle12@example.invalid'),
      ('${ids.suspendedUser}'::uuid,'library-suspended.cycle12@example.invalid'),
      ('${ids.professional}'::uuid,'library-professional.cycle12@example.invalid')
    ) users(id,email);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status)
    values ('${ids.professional}','${ids.professional}','Library Professional','library-professional.cycle12@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at)
    values
      ('${ids.student}','${ids.professional}','Ana Library','+550000004411',current_date,'QA',0,'Ativo','cycle12 library','${ids.studentUser}','active',now()),
      ('${ids.otherStudent}','${ids.professional}','Bia Library','+550000004412',current_date,'QA',0,'Ativo','cycle12 library','${ids.otherUser}','active',now()),
      ('${ids.suspendedStudent}','${ids.professional}','Cris Library','+550000004413',current_date,'QA',0,'Ativo','cycle12 library','${ids.suspendedUser}','suspended',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,objetivo,nivel,dias_semana,observacoes,status,data_inicio,lifecycle_status,delivered_at)
    values
      ('${ids.olderProgram}','${ids.professional}','${ids.student}','Programa técnico antigo','Força','Iniciante',2,'runtime','Ativo',current_date-60,'active',now()-interval '30 days'),
      ('${ids.program}','${ids.professional}','${ids.student}','Programa público atual','Hipertrofia','Intermediário',4,'runtime','Ativo',current_date-10,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem) values
      ('${ids.dayB}','${ids.program}','Treino B','Costas e bíceps',2),
      ('${ids.dayA}','${ids.program}','Treino A','Peito e tríceps',1);
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem)
    select ('00000000-0000-4000-8000-00000000444' || value)::uuid,'${ids.program}'::uuid,'Treino ' || value,'Pernas',value
    from generate_series(3,6) value;
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,video_url,ordem,tracking_config,exercise_media_snapshot) values
      ('${ids.exerciseA2}','${ids.dayA}','Crucifixo','2','12','8 kg','45 s','Amplitude confortável','',2,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}'),
      ('${ids.exerciseA1}','${ids.dayA}','Supino reto','3','8–12','20 kg','90 s','Controle a descida','https://www.youtube.com/watch?v=dQw4w9WgXcQ',1,'{"load":true,"reps":true,"rir":true,"rpe":false,"duration":false,"distance":false}','{"name":"Supino reto","media":{"type":"youtube","videoId":"dQw4w9WgXcQ","youtubeUrl":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}}'),
      ('${ids.exerciseB}','${ids.dayB}','Remada','pirâmide','10','','60 s','','',1,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}','{}');
    insert into public.treino_exercicios(treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem)
    select d.id,'Exercício ' || exercise_number,'3','10','','60 s','',exercise_number
    from public.treino_dias d cross join generate_series(1,3) exercise_number
    where d.treino_id='${ids.program}' and d.ordem between 3 and 6;
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,last_activity_at)
    values ('${ids.session}','${ids.student}','${ids.program}','${ids.dayB}','in_progress',current_date,now()-interval '20 minutes',now()-interval '2 minutes');
    insert into public.workout_execution_exercises(id,session_id,treino_exercicio_id,treino_dia_id,exercise_name_snapshot,prescribed_series_snapshot,prescribed_reps_snapshot,prescribed_load_snapshot,prescribed_rest_snapshot,day_name_snapshot,group_snapshot,exercise_order_snapshot,day_order_snapshot,workout_title_snapshot,status)
    values ('${ids.executionExercise}','${ids.session}','${ids.exerciseB}','${ids.dayB}','Remada','pirâmide','10','','60 s','Treino B','Costas e bíceps',1,2,'Programa público atual','not_started');
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
    const summaryText = scalar(actor(ids.studentUser, "select public.get_my_student_training_library_v2()::text;"));
    const summary = JSON.parse(summaryText);
    assert.ok(Buffer.byteLength(summaryText, "utf8") < 15000);
    assert.deepEqual(Object.keys(summary).sort(), ["activeSession", "currentProgram", "studentAccess", "workouts"].sort());
    assert.equal(summary.currentProgram.id, ids.program);
    assert.equal(summary.currentProgram.displayName, "Programa público atual");
    assert.equal(summary.currentProgram.workoutCount, 6);
    assert.deepEqual(summary.workouts.map((workout) => workout.order), [1,2,3,4,5,6]);
    assert.equal(summary.workouts[0].exerciseCount, 2);
    assert.equal(summary.workouts[0].setCount, 5);
    assert.equal(summary.workouts[1].setCount, null);
    assert.equal(summary.activeSession.id, ids.session);
    assert.equal(summary.activeSession.treinoDiaId, ids.dayB);
    assert.equal("exercises" in summary, false);

    const detailText = scalar(actor(ids.studentUser, `select public.get_my_student_workout_detail_v2('${ids.dayA}')::text;`));
    const detail = JSON.parse(detailText);
    assert.ok(Buffer.byteLength(detailText, "utf8") < 30000);
    assert.deepEqual(detail.exercises.map((exercise) => exercise.name), ["Supino reto", "Crucifixo"]);
    assert.equal(detail.exerciseCount, 2);
    assert.equal(detail.setCount, 5);
    assert.equal(detail.exercises[0].series, "3");
    assert.equal(detail.exercises[0].repetitions, "8–12");
    assert.equal(detail.exercises[0].rest, "90 s");
    assert.equal(detail.exercises[0].trackingConfig.rir, true);
    assert.equal(detail.exercises[0].media.type, "youtube");
    assert.equal(detail.exercises[1].media.type, "");

    const crossDetail = scalar(actor(ids.otherUser, `select coalesce(public.get_my_student_workout_detail_v2('${ids.dayA}')::text, 'null');`));
    assert.equal(crossDetail, "null");
    const otherLibrary = JSON.parse(scalar(actor(ids.otherUser, "select public.get_my_student_training_library_v2()::text;")));
    assert.equal(otherLibrary.currentProgram, null);
    assert.deepEqual(otherLibrary.workouts, []);
    const suspendedLibrary = JSON.parse(scalar(actor(ids.suspendedUser, "select public.get_my_student_training_library_v2()::text;")));
    assert.equal(suspendedLibrary.studentAccess.status, "suspended");
    assert.equal(suspendedLibrary.currentProgram, null);
    expectDenied(actor(ids.studentUser, "select public.get_my_student_training_library_v2();", "anon"));
    expectDenied(actor(ids.studentUser, `select public.get_my_student_workout_detail_v2('${ids.dayA}');`, "anon"));

    for (const functionName of ["get_my_student_training_library_v2", "get_my_student_workout_detail_v2"]) {
      const audit = JSON.parse(scalar(`select jsonb_build_object(
        'securityDefiner',p.prosecdef,
        'searchPath',p.proconfig,
        'publicExecute',has_function_privilege('public',p.oid,'EXECUTE'),
        'anonExecute',has_function_privilege('anon',p.oid,'EXECUTE'),
        'authenticatedExecute',has_function_privilege('authenticated',p.oid,'EXECUTE')
      )::text from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname='${functionName}';`));
      assert.equal(audit.securityDefiner, true);
      assert.deepEqual(audit.searchPath, ["search_path=\"\""]);
      assert.equal(audit.publicExecute, false);
      assert.equal(audit.anonExecute, false);
      assert.equal(audit.authenticatedExecute, true);
    }

    const dayPlan = sql(`set enable_seqscan=off; explain (format json) select id from public.treino_dias where treino_id='${ids.program}' order by ordem,created_at,id;`).stdout;
    const exercisePlan = sql(`set enable_seqscan=off; explain (format json) select id from public.treino_exercicios where treino_dia_id='${ids.dayA}' order by ordem,created_at,id;`).stdout;
    assert.match(dayPlan, /treino_dias_treino_id_idx/);
    assert.match(exercisePlan, /treino_exercicios_treino_dia_id_idx/);

    const report = {
      decision: "PASS",
      scope: "CYCLE_12_4_TRAINING_LIBRARY_V2",
      database_target: "LOCAL",
      production_accessed: false,
      production_mutated: false,
      summary_payload_bytes: Buffer.byteLength(summaryText, "utf8"),
      summary_payload_budget_bytes: 15000,
      detail_payload_bytes: Buffer.byteLength(detailText, "utf8"),
      detail_payload_budget_bytes: 30000,
      request_strategy: "ONE_SUMMARY_RPC_PLUS_ONE_LAZY_DETAIL_RPC",
      no_n_plus_one: "PASS",
      no_full_history: "PASS",
      canonical_order: "PASS",
      active_session_mapping: "PASS",
      student_a_own: "PASS",
      student_b_cross_owner: "NOT_FOUND",
      suspended: "NO_STUDENT_DATA",
      anon: "DENIED",
      search_path: "SAFE",
      grants: "LEAST_PRIVILEGE",
      query_plans: "PASS_EXISTING_FOREIGN_KEY_INDEXES",
    };
    const path = "reports/cycle-12-4-training-library-runtime.json";
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
    for (const [key, value] of Object.entries(report)) console.log(`${key}=${value}`);
  } finally {
    cleanup();
  }
}

try { main(); } catch (error) { console.error(error.stack || error.message); cleanup(); process.exit(1); }
