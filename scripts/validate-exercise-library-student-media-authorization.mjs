import { readFileSync } from "node:fs";

const migration = readFileSync("supabase/migrations/20260907120000_student_exercise_media_experience_v1.sql", "utf8");
const storageMigration = readFileSync("supabase/migrations/20260905120000_exercise_library_media_v1.sql", "utf8");

const checks = [
  ["auth uid required", /v_student_user_id uuid := auth\.uid\(\)[\s\S]*AUTH_REQUIRED/i.test(migration)],
  ["student identity link required", /a\.student_user_id = v_student_user_id/i.test(migration)],
  ["student access active required", /a\.student_access_status = 'active'/i.test(migration)],
  ["own workout only", /join public\.alunos a on a\.id = t\.aluno_id/i.test(migration)],
  ["prescribed exercise only", /where te\.id = p_treino_exercicio_id/i.test(migration)],
  ["draft denied", !/lifecycle_status in \('draft'|= 'draft'/i.test(migration)],
  ["archived denied", !/lifecycle_status in \('archived'|= 'archived'/i.test(migration)],
  ["anon execute revoked", /revoke all on function public\.get_my_student_exercise_media\(uuid\) from anon/i.test(migration)],
  ["storage bucket private", /'exercise-media'[\s\S]*false/i.test(storageMigration)],
  ["storage select uses prescribed helper", /create policy exercise_media_select_authorized[\s\S]*public\.exercise_is_prescribed_to_current_student\(e\.id\)/i.test(storageMigration)],
  ["no anon storage policy", !/bucket_id\s*=\s*'exercise-media'[\s\S]{0,160}to\s+anon/i.test(storageMigration)],
];

const failed = checks.filter(([, pass]) => !pass);
for (const [name, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${name}`);
}
if (failed.length) process.exit(1);
