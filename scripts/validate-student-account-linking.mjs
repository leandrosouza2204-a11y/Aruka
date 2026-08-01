import { readFileSync } from "node:fs";

const functions = readFileSync("supabase/baseline-src/05-functions.sql", "utf8");
const migration = readFileSync("supabase/migrations/20260730090000_student_identity_contract.sql", "utf8");
const link = functionBody(functions, "vincular_aluno_usuario");
const unlink = functionBody(functions, "desvincular_aluno_usuario");
const checks = [];

add("link validates professional ownership", /where id = p_aluno_id[\s\S]*and user_id = v_professional_user_id/.test(link));
add("link locks row before update", /for update/.test(link));
add("link validates target profile", /from public\.perfis[\s\S]*where user_id = p_student_user_id/.test(link) && /role <> 'student'/.test(link));
add("link blocks reused account", /student_user_id = p_student_user_id[\s\S]*id <> p_aluno_id/.test(link));
add("link blocks replacing existing linked account", /v_existing_student_user_id is not null[\s\S]*<> p_student_user_id/.test(link));
add("unlink validates professional ownership", /where id = p_aluno_id[\s\S]*and user_id = v_professional_user_id/.test(unlink));
add("unlink sets student_user_id null", /set student_user_id = null/.test(unlink));
add("auth deletion preserves aluno by set null", /references auth\.users\(id\) on delete set null/i.test(migration));
add("no email based linking", !/email/i.test(link + "\n" + migration));
add("no professional user id parameter", !/p_professional|p_professional_user_id/i.test(link));

report();

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

function functionBody(source, name) {
  return source.match(new RegExp(`create or replace function public\\.${name}[\\s\\S]*?\\n\\$\\$;`, "i"))?.[0] || "";
}

function report() {
  for (const check of checks) console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
  if (checks.some((check) => !check.passed)) process.exitCode = 1;
}
