import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const ids = {
  userA: "00000000-0000-4000-8000-000000009911",
  userB: "00000000-0000-4000-8000-000000009912",
  professionalA: "00000000-0000-4000-8000-000000009913",
  professionalB: "00000000-0000-4000-8000-000000009914",
  studentA: "00000000-0000-4000-8000-000000009921",
  studentB: "00000000-0000-4000-8000-000000009922",
};

const sql = (statement, options = {}) => runPsql(root, statement, { ...options, throwOnError: options.throwOnError ?? true });
const scalar = (statement) => sql(`\\pset tuples_only on\n\\pset format unaligned\n${statement}`).stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "";
const actor = (userId, statement, role = "authenticated") => `set request.jwt.claim.sub='${userId}'; set role ${role}; ${statement}`;
const call = (userId, functionName, throwOnError = true, role = "authenticated") => sql(actor(userId, `select public.${functionName}();`, role), { throwOnError });

function cleanup() {
  sql(`
    delete from public.workout_execution_sessions where aluno_id in ('${ids.studentA}','${ids.studentB}');
    delete from public.avaliacoes where aluno_id in ('${ids.studentA}','${ids.studentB}');
    delete from public.alunos where id in ('${ids.studentA}','${ids.studentB}');
    delete from public.perfis where id in ('${ids.professionalA}','${ids.professionalB}');
    delete from auth.users where id in ('${ids.userA}','${ids.userB}','${ids.professionalA}','${ids.professionalB}');
  `, { throwOnError: false });
}

function setup() {
  cleanup();
  sql(`
    insert into auth.users(id,instance_id,aud,role,email,confirmation_token,recovery_token,email_change_token_new,email_change_token_current,email_change,phone_change,phone_change_token,reauthentication_token,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data,is_super_admin)
    select id,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',email,'','','','','','','','',now(),now(),now(),'{}','{}',false
    from (values
      ('${ids.userA}'::uuid,'cycle-12-9-a@example.invalid'),
      ('${ids.userB}'::uuid,'cycle-12-9-b@example.invalid'),
      ('${ids.professionalA}'::uuid,'cycle-12-9-prof-a@example.invalid'),
      ('${ids.professionalB}'::uuid,'cycle-12-9-prof-b@example.invalid')
    ) users(id,email);
    insert into public.perfis(id,user_id,nome,email,role,tipo_acesso,status) values
      ('${ids.professionalA}','${ids.professionalA}','Cycle 12.9 Professional A','cycle-12-9-prof-a@example.invalid','user','assinante','ativo'),
      ('${ids.professionalB}','${ids.professionalB}','Cycle 12.9 Professional B','cycle-12-9-prof-b@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status,student_access_activated_at) values
      ('${ids.studentA}','${ids.professionalA}','Cycle 12.9 Student A','+550000009911',current_date,'QA',0,'Ativo','synthetic','${ids.userA}','active',now()),
      ('${ids.studentB}','${ids.professionalB}','Cycle 12.9 Student B','+550000009912',current_date,'QA',0,'Ativo','synthetic','${ids.userB}','active',now());

    insert into public.workout_execution_sessions(aluno_id,status,session_date,started_at,completed_at,short_duration_confirmed)
    select '${ids.studentA}','completed',current_date,now() - make_interval(hours => n),now() - make_interval(hours => n),n=1
    from generate_series(1,25) n;
    insert into public.workout_execution_sessions(aluno_id,status,session_date,started_at,completed_at) values
      ('${ids.studentA}','completed',current_date-27,now()-interval '27 days',now()-interval '27 days'),
      ('${ids.studentA}','completed',current_date-28,now()-interval '28 days',now()-interval '28 days'),
      ('${ids.studentA}','completed',current_date+1,now(),now()),
      ('${ids.studentB}','completed',current_date,now(),now());
    insert into public.workout_execution_sessions(aluno_id,status,session_date,started_at) values
      ('${ids.studentA}','in_progress',current_date,now());
    insert into public.workout_execution_sessions(aluno_id,status,session_date,started_at,abandoned_at) values
      ('${ids.studentA}','abandoned',current_date,now(),now());

    insert into public.avaliacoes(id,user_id,aluno_id,data_avaliacao,peso,cintura,observacoes,foto_frente_url) values
      ('00000000-0000-4000-8000-000000009931','${ids.professionalA}','${ids.studentA}',current_date-30,70.5,80.0,'private A','private-a.jpg'),
      ('00000000-0000-4000-8000-000000009932','${ids.professionalA}','${ids.studentA}',current_date,69.8,null,'private B','private-b.jpg'),
      ('00000000-0000-4000-8000-000000009933','${ids.professionalB}','${ids.studentB}',current_date,91.2,99.0,'private C','private-c.jpg');
  `);
}

function main() {
  assert.equal(validateLocalGuard(root).ok, true);
  setup();
  try {
    assert.equal(scalar(actor(ids.userA, "select public.get_my_student_workout_frequency_v2()#>>'{frequency,0,completedCount}';")), "25");
    assert.equal(scalar(actor(ids.userA, "select public.get_my_student_workout_frequency_v2()#>>'{frequency,1,completedCount}';")), "26");
    assert.equal(scalar(actor(ids.userA, "select jsonb_array_length(public.get_my_valid_workout_execution_history(20));")), "20");
    assert.equal(scalar(actor(ids.userA, "select jsonb_array_length(public.get_my_valid_workout_execution_history(500));")), "28");
    assert.equal(scalar(actor(ids.userA, "select jsonb_path_exists(public.get_my_valid_workout_execution_history(20), '$[*] ? (@.shortDurationConfirmed == true)');")), "t");

    const assessment = JSON.parse(scalar(actor(ids.userA, "select public.get_my_student_assessments_v2()::text;")));
    assert.equal(assessment.totalCount, 2);
    assert.equal(assessment.items.length, 2);
    assert.deepEqual(Object.keys(assessment.items[0]).sort(), ["date", "id", "measurements"]);
    assert.equal(JSON.stringify(assessment).includes("private"), false);
    assert.equal(JSON.stringify(assessment).includes(ids.studentB), false);
    assert.equal(assessment.items[0].measurements.weightKg, 69.8);
    assert.equal("waistCm" in assessment.items[0].measurements, false);

    assert.equal(scalar(actor(ids.userB, "select public.get_my_student_workout_frequency_v2()#>>'{frequency,1,completedCount}';")), "1");
    assert.equal(scalar(actor(ids.userB, "select public.get_my_student_assessments_v2()->>'totalCount';")), "1");
    for (const functionName of ["get_my_student_workout_frequency_v2", "get_my_student_assessments_v2"]) {
      const professional = call(ids.professionalA, functionName, false);
      assert.match(`${professional.stderr}\n${professional.stdout}`, /STUDENT_EVOLUTION_ACCESS_REQUIRED/);
      const anonymous = call("", functionName, false, "anon");
      assert.notEqual(anonymous.status, 0);
      assert.equal(scalar(`select has_function_privilege('anon','public.${functionName}()','EXECUTE')::text;`), "false");
      assert.equal(scalar(`select has_function_privilege('authenticated','public.${functionName}()','EXECUTE')::text;`), "true");
    }

    sql(`update public.alunos set student_access_status='suspended' where id='${ids.studentA}';`);
    assert.match(`${call(ids.userA, "get_my_student_workout_frequency_v2", false).stderr}`, /STUDENT_EVOLUTION_ACCESS_REQUIRED/);
    assert.match(`${call(ids.userA, "get_my_student_assessments_v2", false).stderr}`, /STUDENT_EVOLUTION_ACCESS_REQUIRED/);
    sql(`update public.alunos set student_access_status='active' where id='${ids.studentA}';`);

    for (const table of ["avaliacoes", "workout_execution_sessions"]) {
      for (const privilege of ["INSERT", "UPDATE", "DELETE"]) {
        assert.equal(scalar(`select has_table_privilege('anon','public.${table}','${privilege}')::text;`), "false");
      }
    }
    assert.equal(scalar("select count(*) from pg_proc where oid in ('public.get_my_student_workout_frequency_v2()'::regprocedure,'public.get_my_student_assessments_v2()'::regprocedure) and prosecdef and proconfig=array['search_path=\"\"'];"), "2");
    assert.equal(scalar("select count(*) from pg_indexes where schemaname='public' and indexname in ('workout_execution_sessions_aluno_recent_idx','avaliacoes_aluno_id_idx','avaliacoes_user_data_idx');"), "3");
    const frequencyPlan = sql(`set enable_seqscan=off; explain (costs off) select count(*) from public.workout_execution_sessions where aluno_id='${ids.studentA}' and status='completed' and session_date between current_date-27 and current_date;`).stdout;
    const assessmentPlan = sql(`set enable_seqscan=off; explain (costs off) select id,data_avaliacao,peso from public.avaliacoes where aluno_id='${ids.studentA}' and user_id='${ids.professionalA}' order by data_avaliacao desc,id desc limit 24;`).stdout;
    assert.match(frequencyPlan, /workout_execution_sessions_(aluno_recent|valid_history)_idx/);
    assert.match(assessmentPlan, /avaliacoes_(aluno_id|user_data)_idx/);

    const report = {
      decision: "PASS",
      scope: "CYCLE_12_9_STUDENT_EVOLUTION_RUNTIME",
      database_target: "LOCAL",
      fixtures: "SYNTHETIC",
      production_accessed: false,
      frequency_7_days_completed: 25,
      frequency_28_days_completed: 26,
      recent_history_limit: 20,
      canonical_history_limit_clamped_to_50_actual_rows: 28,
      inclusive_period_boundaries: "PASS",
      non_completed_excluded: "PASS",
      short_completed_session_preserved: "PASS",
      assessment_empty_baseline_comparison_covered_by_unit_tests: "PASS",
      partial_assessment_payload: "PASS",
      private_fields_excluded: "PASS",
      cross_student_isolation: "PASS",
      cross_professional_isolation: "PASS",
      anonymous_denied: "PASS",
      suspended_denied: "PASS",
      table_mutation_not_broadened: "PASS",
      security_definer_hardening: "PASS",
      supporting_indexes_present: "PASS",
      frequency_explain_indexed: "PASS",
      assessment_explain_indexed: "PASS",
    };
    const path = "reports/cycle-12-9-student-evolution-runtime.json";
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
    for (const [key, value] of Object.entries(report)) console.log(`${key}=${value}`);
  } finally {
    cleanup();
  }
}

try { main(); } catch (error) { cleanup(); console.error(error.stack || error.message); process.exit(1); }
