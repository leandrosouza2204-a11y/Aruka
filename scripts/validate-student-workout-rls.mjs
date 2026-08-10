import { readFileSync } from "node:fs";

const migration = readFileSync("supabase/migrations/20260730090000_student_identity_contract.sql", "utf8");
const functions = readFileSync("supabase/baseline-src/05-functions.sql", "utf8");
const policies = readFileSync("supabase/baseline-src/08-policies.sql", "utf8");
const grants = readFileSync("supabase/baseline-src/09-grants.sql", "utf8");
const allSql = [migration, functions, policies, grants].join("\n");
const studentReader = functionBody(functions, "get_my_student_workouts");
const checks = [];

add("student workout RPC exists", /create or replace function public\.get_my_student_workouts\(\)/.test(functions));
add("student workout RPC requires auth uid", /v_student_user_id uuid := auth\.uid\(\)/.test(studentReader) && /AUTH_REQUIRED/.test(studentReader));
add("student identity derived from student_user_id", /where student_user_id = v_student_user_id/.test(studentReader));
add("student workout RPC allows only active and completed", /lifecycle_status in \('active', 'completed'\)/.test(studentReader));
add("student workout RPC does not accept arbitrary ids", !/get_my_student_workouts\([^)]*(aluno|student|professional|user).*uuid/i.test(functions));
add("draft not returned", !/lifecycle_status in \([^)]*draft/i.test(studentReader));
add("archived not returned", !/lifecycle_status in \([^)]*archived/i.test(studentReader));
add("student RPC security definer with search path", /create or replace function public\.get_my_student_workouts\(\)[\s\S]*security definer[\s\S]*set search_path = public/.test(functions));
add("student RPC execution granted to authenticated", /grant execute on function public\.get_my_student_workouts\(\) to authenticated/.test(grants) && /revoke all on function public\.get_my_student_workouts\(\) from public/.test(grants));
add("no student write policy on workout tables", !/create policy[\s\S]*student[\s\S]*on public\.(?:treinos|treino_dias|treino_exercicios)[\s\S]*for (?:insert|update|delete)/i.test(policies + "\n" + migration));
add("professional workout policies preserved", /Usuarios podem listar seus treinos/.test(policies) && /Usuarios podem atualizar seus treinos/.test(policies));
add("no permissive true policy", !/using\s*\(\s*true\s*\)|with check\s*\(\s*true\s*\)/i.test(allSql));

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
