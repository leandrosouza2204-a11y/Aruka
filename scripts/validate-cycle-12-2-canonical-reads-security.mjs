import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const ids = {
  studentUser: "00000000-0000-4000-8000-000000002211",
  otherUser: "00000000-0000-4000-8000-000000002212",
  suspendedUser: "00000000-0000-4000-8000-000000002213",
  professional: "00000000-0000-4000-8000-000000002214",
  student: "00000000-0000-4000-8000-000000002221",
  otherStudent: "00000000-0000-4000-8000-000000002222",
  suspendedStudent: "00000000-0000-4000-8000-000000002223",
  workout: "00000000-0000-4000-8000-000000002231",
  day: "00000000-0000-4000-8000-000000002241",
  prescription: "00000000-0000-4000-8000-000000002251",
  noHistoryPrescription: "00000000-0000-4000-8000-000000002252",
};

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

function expectError(statement, pattern) {
  const result = sql(statement, { throwOnError: false });
  assert.notEqual(result.status, 0);
  assert.match(`${result.stderr}\n${result.stdout}`, pattern);
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
      ('${ids.studentUser}'::uuid,'reads-student.cycle12@example.invalid'),
      ('${ids.otherUser}'::uuid,'reads-other.cycle12@example.invalid'),
      ('${ids.suspendedUser}'::uuid,'reads-suspended.cycle12@example.invalid'),
      ('${ids.professional}'::uuid,'reads-professional.cycle12@example.invalid')
    ) users(id,email);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status)
    values ('${ids.professional}','${ids.professional}','Reads Professional','reads-professional.cycle12@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at)
    values
      ('${ids.student}','${ids.professional}','Reads Student','+550000002211',current_date,'QA',0,'Ativo','cycle12 reads','${ids.studentUser}','active',now()),
      ('${ids.otherStudent}','${ids.professional}','Reads Other','+550000002212',current_date,'QA',0,'Ativo','cycle12 reads','${ids.otherUser}','active',now()),
      ('${ids.suspendedStudent}','${ids.professional}','Reads Suspended','+550000002213',current_date,'QA',0,'Ativo','cycle12 reads','${ids.suspendedUser}','suspended',now());
    insert into public.treinos(id,user_id,aluno_id,nome_rotina,objetivo,nivel,dias_semana,observacoes,status,data_inicio,lifecycle_status,delivered_at)
    values ('${ids.workout}','${ids.professional}','${ids.student}','Cycle 12 Reads','QA','Intermediario',3,'runtime','Ativo',current_date,'active',now());
    insert into public.treino_dias(id,treino_id,nome,grupo_muscular,ordem)
    values ('${ids.day}','${ids.workout}','Reads','QA',1);
    insert into public.treino_exercicios(id,treino_dia_id,nome,series,repeticoes,carga,descanso,observacoes,ordem,tracking_config)
    values
      ('${ids.prescription}','${ids.day}','Reads Exercise','3','10','20','60s','runtime',1,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}'),
      ('${ids.noHistoryPrescription}','${ids.day}','No History Exercise','3','10','20','60s','runtime',2,'{"load":true,"reps":true,"rir":false,"rpe":false,"duration":false,"distance":false}');
  `);
}

function insertSession(suffix, status, secondsAgo, { shortConfirmed = false, sets = [] } = {}) {
  const sessionId = `00000000-0000-4000-8000-0000000023${suffix}`;
  const exerciseId = `00000000-0000-4000-8000-0000000024${suffix}`;
  const terminalColumn = status === "completed" ? "completed_at" : status === "cancelled" ? "cancelled_at" : status === "abandoned" ? "abandoned_at" : null;
  sql(`
    insert into public.workout_execution_sessions(id,aluno_id,treino_id,treino_dia_id,status,session_date,started_at,${terminalColumn || "last_activity_at"},short_duration_confirmed)
    values ('${sessionId}','${ids.student}','${ids.workout}','${ids.day}','${status}',current_date - ${Math.floor(secondsAgo / 86400)},clock_timestamp()-interval '${secondsAgo + 600} seconds',clock_timestamp()-interval '${secondsAgo} seconds',${shortConfirmed});
    insert into public.workout_execution_exercises(id,session_id,treino_exercicio_id,treino_dia_id,exercise_name_snapshot,prescribed_series_snapshot,prescribed_reps_snapshot,prescribed_load_snapshot,prescribed_rest_snapshot,status)
    values ('${exerciseId}','${sessionId}','${ids.prescription}','${ids.day}','Reads Exercise','3','10','20','60s','${sets.length ? "partial" : "not_started"}');
    ${sets.map((set, index) => `insert into public.workout_execution_sets(execution_exercise_id,set_number,reps,load_value,completed) values ('${exerciseId}',${index + 1},${set.reps},${set.load},true);`).join("\n")}
  `);
  return { sessionId, exerciseId };
}

function main() {
  const guard = validateLocalGuard(root);
  assert.equal(guard.ok, true, guard.errors.join("; "));
  setup();
  try {
    const completedOld = insertSession("01", "completed", 5000, { sets: [{ reps: 10, load: 20 }, { reps: 8, load: 22 }] });
    insertSession("02", "cancelled", 4000, { sets: [{ reps: 12, load: 30 }] });
    insertSession("03", "abandoned", 3000, { sets: [{ reps: 12, load: 35 }] });
    insertSession("04", "in_progress", 2000, { sets: [{ reps: 12, load: 40 }] });
    const completedShort = insertSession("05", "completed", 1000, { shortConfirmed: true, sets: [{ reps: 6, load: 25 }] });

    const history = JSON.parse(scalar(actorSql(ids.studentUser, "select public.get_my_valid_workout_execution_history(20)::text;")));
    assert.deepEqual(history.map((item) => item.id), [completedShort.sessionId, completedOld.sessionId]);
    assert.equal(history[0].shortDurationConfirmed, true);
    assert.equal(JSON.parse(scalar(actorSql(ids.studentUser, "select public.get_my_valid_workout_execution_history(1)::text;"))).length, 1);

    const previous = JSON.parse(scalar(actorSql(ids.studentUser, `select public.get_my_previous_workout_performance('${ids.prescription}',null)::text;`))).previousExecution;
    assert.equal(previous.sessionId, completedShort.sessionId);
    assert.equal(previous.sets.length, 1);
    const previousBeforeShort = JSON.parse(scalar(actorSql(ids.studentUser, `select public.get_my_previous_workout_performance('${ids.prescription}','${completedShort.sessionId}')::text;`))).previousExecution;
    assert.equal(previousBeforeShort.sessionId, completedOld.sessionId);
    assert.equal(previousBeforeShort.sets.length, 2);
    const noHistory = JSON.parse(scalar(actorSql(ids.studentUser, `select public.get_my_previous_workout_performance('${ids.noHistoryPrescription}',null)::text;`)));
    assert.equal(noHistory.previousExecution, null);

    const otherSession = "00000000-0000-4000-8000-000000002399";
    sql(`insert into public.workout_execution_sessions(id,aluno_id,status,session_date,started_at) values ('${otherSession}','${ids.otherStudent}','in_progress',current_date,now());`);
    expectError(actorSql(ids.studentUser, `select public.get_my_previous_workout_performance('${ids.prescription}','${otherSession}');`), /SESSION_NOT_OWNED/);
    expectError(actorSql(ids.otherUser, `select public.get_my_previous_workout_performance('${ids.prescription}','${completedShort.sessionId}');`), /SESSION_NOT_OWNED/);
    expectError(actorSql(ids.professional, "select public.get_my_valid_workout_execution_history(20);"), /WORKOUT_EXECUTION_STUDENT_ACCESS_REQUIRED/);
    expectError(actorSql(ids.suspendedUser, "select public.get_my_valid_workout_execution_history(20);"), /WORKOUT_EXECUTION_STUDENT_ACCESS_REQUIRED/);
    expectError(actorSql(ids.studentUser, "select public.get_my_valid_workout_execution_history(20);", "anon"), /permission denied/);
    expectError(actorSql(ids.studentUser, `update public.workout_execution_exercises set tracking_config_snapshot='{}' where id='${completedOld.exerciseId}';`), /permission denied/);

    const functionAudit = JSON.parse(scalar(`
      select jsonb_agg(jsonb_build_object(
        'name',p.proname,
        'securityDefiner',p.prosecdef,
        'searchPath',p.proconfig,
        'publicExecute',exists(select 1 from aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) acl where acl.grantee=0 and acl.privilege_type='EXECUTE'),
        'anonExecute',has_function_privilege('anon',p.oid,'EXECUTE'),
        'authenticatedExecute',has_function_privilege('authenticated',p.oid,'EXECUTE')
      ) order by p.proname)::text
      from pg_proc p join pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and p.proname in (
        'complete_workout_execution_set','skip_workout_execution_exercise','cancel_workout_execution_session',
        'complete_workout_execution_session_v2','get_my_valid_workout_execution_history','get_my_previous_workout_performance'
      );
    `));
    assert.equal(functionAudit.length, 7);
    for (const fn of functionAudit) {
      assert.equal(fn.securityDefiner, true);
      assert.deepEqual(fn.searchPath, ["search_path=\"\""]);
      assert.equal(fn.publicExecute, false);
      assert.equal(fn.anonExecute, false);
      assert.equal(fn.authenticatedExecute, true);
    }
    assert.equal(scalar("select has_function_privilege('authenticated','public.workout_execution_session_payload(uuid)','EXECUTE')::text;"), "false");
    assert.equal(scalar("select has_table_privilege('authenticated','public.workout_execution_sessions','UPDATE')::text;"), "false");
    assert.equal(scalar("select has_table_privilege('authenticated','public.workout_execution_sets','INSERT')::text;"), "false");

    const historyPlan = sql(`set enable_seqscan=off; explain (format json) select id from public.workout_execution_sessions where aluno_id='${ids.student}' and status='completed' order by completed_at desc limit 20;`).stdout;
    const previousPlan = sql(`set enable_seqscan=off; explain (format json) select e.id from public.workout_execution_exercises e join public.workout_execution_sessions s on s.id=e.session_id where e.treino_exercicio_id='${ids.prescription}' and s.aluno_id='${ids.student}' and s.status='completed' order by s.completed_at desc limit 1;`).stdout;
    assert.match(historyPlan, /workout_execution_sessions_valid_history_idx/);
    assert.match(previousPlan, /workout_execution_exercises_prescription_session_idx/);

    const report = {
      decision: "PASS",
      scope: "CYCLE_12_2_SESSION_2_CANONICAL_READS_SECURITY_PERFORMANCE",
      database_target: "LOCAL",
      production_accessed: false,
      production_mutated: false,
      valid_history: "PASS",
      previous_performance: "PASS",
      invalid_sessions_excluded: "PASS",
      short_confirmed_included: "PASS",
      first_execution_empty: "PASS",
      changed_set_counts: "PASS",
      bounded_history: "PASS",
      cross_student: "DENIED",
      professional_command_access: "DENIED",
      anon: "DENIED",
      suspended: "DENIED",
      security_definer: "PASS",
      search_path: "PASS",
      grants: "PASS",
      direct_writes: "DENIED",
      query_plans: "PASS",
      indexes: ["workout_execution_sessions_valid_history_idx", "workout_execution_exercises_prescription_session_idx"],
    };
    const reportPath = "reports/cycle-12-2-canonical-reads-security.json";
    mkdirSync(dirname(reportPath), { recursive: true });
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    for (const [key, value] of Object.entries(report)) console.log(`${key}=${Array.isArray(value) ? value.join(",") : value}`);
  } finally {
    cleanup();
  }
}

try {
  main();
} catch (error) {
  console.error(error.stack || error.message);
  cleanup();
  process.exit(1);
}
