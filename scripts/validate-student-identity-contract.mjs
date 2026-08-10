import { readFileSync } from "node:fs";

const files = {
  migration: "supabase/migrations/20260730090000_student_identity_contract.sql",
  tables: "supabase/baseline-src/02-tables.sql",
  constraints: "supabase/baseline-src/03-constraints.sql",
  indexes: "supabase/baseline-src/04-indexes.sql",
  functions: "supabase/baseline-src/05-functions.sql",
  grants: "supabase/baseline-src/09-grants.sql",
};

const sql = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, readFileSync(file, "utf8")]));
const allSql = Object.values(sql).join("\n");
const checks = [];

add("student_user_id nullable column", /add column if not exists student_user_id uuid/.test(sql.migration) && /student_user_id uuid/.test(sql.tables) && !/student_user_id uuid not null/i.test(allSql));
add("alunos user_id preserved as professional owner", /comment on column public\.alunos\.user_id[\s\S]*Professional owner user id/i.test(sql.migration) && /alunos_user_id_fkey/.test(sql.constraints));
add("student_user_id FK to auth users", /alunos_student_user_id_fkey[\s\S]*foreign key \(student_user_id\) references auth\.users\(id\) on delete set null/i.test(sql.constraints) && /foreign key \(student_user_id\) references auth\.users\(id\) on delete set null/i.test(sql.migration));
add("student_user_id unique when filled", /unique index[\s\S]*alunos_student_user_id_uidx[\s\S]*where student_user_id is not null/i.test(sql.indexes) && /unique index[\s\S]*alunos_student_user_id_uidx[\s\S]*where student_user_id is not null/i.test(sql.migration));
add("student role allowed without removing existing roles", /perfis_role_check check \(role in \('admin', 'user', 'student'\)\)/.test(sql.constraints) && /role in \('admin', 'user', 'student'\)/.test(sql.migration));
add("link RPC exists and derives professional from auth uid", /create or replace function public\.vincular_aluno_usuario\(p_aluno_id uuid, p_student_user_id uuid\)/.test(sql.functions) && /v_professional_user_id uuid := auth\.uid\(\)/.test(functionBody(sql.functions, "vincular_aluno_usuario")));
add("unlink RPC exists and derives professional from auth uid", /create or replace function public\.desvincular_aluno_usuario\(p_aluno_id uuid\)/.test(sql.functions) && /v_professional_user_id uuid := auth\.uid\(\)/.test(functionBody(sql.functions, "desvincular_aluno_usuario")));
add("student role validated during linking", /v_student_profile\.role <> 'student'/.test(functionBody(sql.functions, "vincular_aluno_usuario")));
add("professional account cannot self-link as student", /p_student_user_id = v_professional_user_id/.test(functionBody(sql.functions, "vincular_aluno_usuario")));
add("execute grants limited to authenticated", /grant execute on function public\.vincular_aluno_usuario\(uuid, uuid\) to authenticated/.test(sql.grants) && /revoke all on function public\.vincular_aluno_usuario\(uuid, uuid\) from public/.test(sql.grants));

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
