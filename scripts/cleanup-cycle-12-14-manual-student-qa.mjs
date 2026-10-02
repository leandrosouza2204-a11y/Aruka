import { runPsql } from "./supabase-cycle-8-lib.mjs";
import {
  FIXTURE_IDS,
  FIXTURE_NAMESPACE,
  PROFESSIONAL_EMAIL,
  STUDENT_EMAIL,
  assertFixtureAuthUser,
  assertLocalServices,
  createAdminClient,
  findAuthUserByEmail,
  loadAndValidateManualQaEnvironment,
  sqlLiteral,
} from "./lib/cycle-12-14-manual-student-qa.mjs";

const destroyBase = process.argv.includes("--destroy-base");
const destroyConfirmed = process.argv.includes(`--confirm=${FIXTURE_NAMESPACE}`);
if (destroyBase && !destroyConfirmed) {
  throw new Error(`MANUAL_QA_BLOCKED: --destroy-base exige --confirm=${FIXTURE_NAMESPACE}.`);
}

const { runtime } = loadAndValidateManualQaEnvironment();
await assertLocalServices(runtime);
const admin = createAdminClient(runtime);
const student = await findAuthUserByEmail(admin, STUDENT_EMAIL);
const professional = await findAuthUserByEmail(admin, PROFESSIONAL_EMAIL);
assertFixtureAuthUser(student, "student");
assertFixtureAuthUser(professional, "professional");

if (!destroyBase) {
  runPsql(process.cwd(), `
begin;
delete from public.workout_execution_sessions
where aluno_id=${sqlLiteral(FIXTURE_IDS.student)}::uuid
  and treino_id=${sqlLiteral(FIXTURE_IDS.workout)}::uuid
  and id<>${sqlLiteral(FIXTURE_IDS.historicalSession)}::uuid;
commit;
`);
  console.log("MANUAL_QA_SELECTIVE_CLEANUP=PASS");
  console.log("BASE_FIXTURE_PRESERVED=YES");
  console.log("AUTH_USERS_DELETED=NO");
  process.exit(0);
}

runPsql(process.cwd(), `
begin;
delete from public.workout_execution_sessions where aluno_id=${sqlLiteral(FIXTURE_IDS.student)}::uuid;
delete from public.avaliacoes where aluno_id=${sqlLiteral(FIXTURE_IDS.student)}::uuid;
delete from public.treinos where id=${sqlLiteral(FIXTURE_IDS.workout)}::uuid;
delete from public.alunos where id=${sqlLiteral(FIXTURE_IDS.student)}::uuid;
delete from public.professional_contact_settings where professional_user_id=${sqlLiteral(professional.id)}::uuid;
delete from public.perfis where user_id in (${sqlLiteral(student.id)}::uuid, ${sqlLiteral(professional.id)}::uuid);
commit;
`);
for (const user of [student, professional]) {
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw error;
}
console.log("MANUAL_QA_FULL_DESTROY=PASS");
console.log("BASE_FIXTURE_PRESERVED=NO");
