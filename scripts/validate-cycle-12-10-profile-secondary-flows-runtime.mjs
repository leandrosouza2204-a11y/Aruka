import assert from "node:assert/strict";
import { runPsql, validateLocalGuard } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const ids = {
  studentUserA: "00000000-0000-4000-8000-000000121001",
  studentUserB: "00000000-0000-4000-8000-000000121002",
  professionalA: "00000000-0000-4000-8000-000000121011",
  professionalB: "00000000-0000-4000-8000-000000121012",
  studentA: "00000000-0000-4000-8000-000000121021",
  studentB: "00000000-0000-4000-8000-000000121022",
};
const sql = (statement, options = {}) => runPsql(root, statement, { ...options, throwOnError: options.throwOnError ?? true });
const scalar = (statement) => sql(`\\pset tuples_only on\n\\pset format unaligned\n${statement}`).stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "";
const actor = (userId, statement, role = "authenticated") => `set request.jwt.claim.sub='${userId}'; set role ${role}; ${statement}`;

function cleanup() {
  sql(`
    delete from public.professional_contact_settings where professional_user_id in ('${ids.professionalA}','${ids.professionalB}');
    delete from public.alunos where id in ('${ids.studentA}','${ids.studentB}');
    delete from public.perfis where user_id in ('${ids.professionalA}','${ids.professionalB}');
    delete from auth.users where id in ('${ids.studentUserA}','${ids.studentUserB}','${ids.professionalA}','${ids.professionalB}');
  `, { throwOnError: false });
}

function setup() {
  cleanup();
  sql(`
    insert into auth.users(id,instance_id,aud,role,email,confirmation_token,recovery_token,email_change_token_new,email_change_token_current,email_change,phone_change,phone_change_token,reauthentication_token,email_confirmed_at,created_at,updated_at,raw_app_meta_data,raw_user_meta_data,is_super_admin)
    select id,'00000000-0000-0000-0000-000000000000','authenticated','authenticated',email,'','','','','','','','',now(),now(),now(),'{}','{}',false
    from (values
      ('${ids.studentUserA}'::uuid,'student-a@example.invalid'),('${ids.studentUserB}'::uuid,'student-b@example.invalid'),
      ('${ids.professionalA}'::uuid,'login-prof-a@example.invalid'),('${ids.professionalB}'::uuid,'login-prof-b@example.invalid')
    ) users(id,email);
    insert into public.perfis(user_id,nome,email,role,tipo_acesso,status) values
      ('${ids.professionalA}','Profissional A','private-login-a@example.invalid','user','assinante','ativo'),
      ('${ids.professionalB}','Profissional B','private-login-b@example.invalid','user','assinante','ativo');
    insert into public.alunos(id,user_id,nome,whatsapp,inicio,plano,valor,status,observacoes,student_user_id,student_access_status) values
      ('${ids.studentA}','${ids.professionalA}','Aluno A','+551100000001',current_date,'QA',0,'Ativo','synthetic','${ids.studentUserA}','active'),
      ('${ids.studentB}','${ids.professionalB}','Aluno B','+551100000002',current_date,'QA',0,'Ativo','synthetic','${ids.studentUserB}','active');
  `);
}

assert.equal(validateLocalGuard(root).ok, true);
setup();
try {
  const empty = JSON.parse(scalar(actor(ids.professionalA, "select public.get_my_professional_contact_settings()::text;")));
  assert.deepEqual(empty, { whatsappEnabled: false, whatsappNumber: "", emailEnabled: false, contactEmail: "" });

  const saved = JSON.parse(scalar(actor(ids.professionalA, "select public.save_my_professional_contact_settings(true,'5511999991234',true,' Support@Example.com ')::text;")));
  assert.equal(saved.whatsappEnabled, true);
  assert.equal(saved.contactEmail, "support@example.com");

  const studentA = JSON.parse(scalar(actor(ids.studentUserA, "select public.get_my_student_profile_v2()::text;")));
  assert.equal(studentA.student.name, "Aluno A");
  assert.equal(studentA.professional.name, "Profissional A");
  assert.equal(studentA.professional.whatsappNumber, "5511999991234");
  assert.equal(studentA.professional.contactEmail, "support@example.com");
  assert.equal(JSON.stringify(studentA).includes("private-login"), false);
  assert.deepEqual(Object.keys(studentA).sort(), ["professional", "student"]);

  const duplicateLink = sql(`update public.alunos set student_user_id='${ids.studentUserA}' where id='${ids.studentB}';`, { throwOnError: false });
  assert.notEqual(duplicateLink.status, 0);
  assert.match(`${duplicateLink.stderr}${duplicateLink.stdout}`, /alunos_student_user_id_uidx|duplicate key/i);

  const unlinked = sql(actor(ids.professionalA, "select public.get_my_student_profile_v2();"), { throwOnError: false });
  assert.match(`${unlinked.stderr}${unlinked.stdout}`, /STUDENT_PROFILE_ACCESS_REQUIRED/);

  scalar(actor(ids.professionalA, "select public.save_my_professional_contact_settings(false,'5511999991234',false,'support@example.com')::text;"));
  const disabled = JSON.parse(scalar(actor(ids.studentUserA, "select public.get_my_student_profile_v2()::text;")));
  assert.equal(disabled.professional.whatsappNumber, null);
  assert.equal(disabled.professional.contactEmail, null);

  const studentB = JSON.parse(scalar(actor(ids.studentUserB, "select public.get_my_student_profile_v2()::text;")));
  assert.equal(studentB.professional.name, "Profissional B");
  assert.equal(JSON.stringify(studentB).includes("5511999991234"), false);

  scalar(actor(ids.professionalA, "select public.save_my_professional_contact_settings(true,'5511999991234',true,'support@example.com')::text;"));
  sql(`update public.perfis set status='inativo' where user_id='${ids.professionalA}';`);
  const inactiveProfessional = JSON.parse(scalar(actor(ids.studentUserA, "select public.get_my_student_profile_v2()::text;")));
  assert.equal(inactiveProfessional.professional.name, null);
  assert.equal(inactiveProfessional.professional.whatsappNumber, null);
  assert.equal(inactiveProfessional.professional.contactEmail, null);
  const homeWithInactiveProfessional = JSON.parse(scalar(actor(ids.studentUserA, "select public.get_my_student_home_v2()::text;")));
  assert.equal(homeWithInactiveProfessional.studentAccess.status, "active");
  sql(`update public.perfis set status='ativo' where user_id='${ids.professionalA}';`);

  const invalid = sql(actor(ids.professionalA, "select public.save_my_professional_contact_settings(true,null,false,null);"), { throwOnError: false });
  assert.notEqual(invalid.status, 0);
  assert.match(`${invalid.stderr}${invalid.stdout}`, /CONTACT_WHATSAPP_REQUIRED/);

  const directWrite = sql(actor(ids.professionalA, `update public.professional_contact_settings set professional_user_id='${ids.professionalB}' where professional_user_id='${ids.professionalA}';`), { throwOnError: false });
  assert.notEqual(directWrite.status, 0);
  assert.equal(scalar("select has_table_privilege('authenticated','public.professional_contact_settings','UPDATE')::text;"), "false");
  assert.equal(scalar("select has_function_privilege('anon','public.get_my_student_profile_v2()','EXECUTE')::text;"), "false");

  for (const status of ["suspended", "revoked"]) {
    sql(`update public.alunos set student_access_status='${status}' where id='${ids.studentA}';`);
    const denied = sql(actor(ids.studentUserA, "select public.get_my_student_profile_v2();"), { throwOnError: false });
    assert.match(`${denied.stderr}${denied.stdout}`, /STUDENT_PROFILE_ACCESS_REQUIRED/);
    const home = JSON.parse(scalar(actor(ids.studentUserA, "select public.get_my_student_home_v2()::text;")));
    assert.equal(home.studentAccess.status, status);
  }
  console.log("PASS Cycle 12.10 local RPC/RLS authorization matrix");
} finally {
  cleanup();
}
