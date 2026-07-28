import { readFileSync } from "node:fs";

const migration = readFileSync("supabase/migrations/20260728030000_workout_delivery_integration_v1.sql", "utf8");
const functions = readFileSync("supabase/baseline-src/05-functions.sql", "utf8");
const policies = readFileSync("supabase/baseline-src/08-policies.sql", "utf8");
const migrationStatements = sqlStatements(migration);
const policyStatements = sqlStatements(policies);
const eventGrantStatements = [...migrationStatements, ...policyStatements]
  .filter((statement) => /\b(?:grant|revoke)\b[\s\S]*\bpublic\.treino_eventos\b/i.test(statement))
  .join("\n");
const eventPolicies = policies
  .split(/\r?\n/)
  .filter((line) => line.includes("treino_eventos"))
  .join("\n");
const diffFiles = process.env.ARUKA_STAGED_FILES || "";
const checks = [];

function add(name, passed) {
  checks.push({ name, passed: Boolean(passed) });
}

for (const fn of ["salvar_treino_composto", "entregar_treino", "alterar_estado_treino"]) {
  const body = functionBody(functions, fn) || functionBody(migration, fn);
  add(`${fn} requires auth.uid`, /v_user_id uuid := auth\.uid\(\)/.test(body) && /AUTH_REQUIRED/.test(body));
  add(`${fn} security definer`, new RegExp(`create or replace function public\\.${fn}[\\s\\S]*security definer[\\s\\S]*set search_path = public`).test(functions + "\n" + migration));
}

add("save validates student ownership", /from public\.alunos[\s\S]*user_id = v_user_id/.test(functionBody(functions, "salvar_treino_composto")));
add("deliver validates workout ownership", /where id = p_treino_id[\s\S]*user_id = v_user_id/.test(functionBody(functions, "entregar_treino")));
add("state change validates workout ownership", /where id = p_treino_id[\s\S]*user_id = v_user_id/.test(functionBody(functions, "alterar_estado_treino")));
add("no client user_id trusted", !/p_treino->>'user_id'|p_treino->>'userId'/.test(functions));
add("treino_eventos has RLS", /alter table public\.treino_eventos enable row level security/.test(policies + "\n" + migration));
add("treino_eventos select policy checks user and treino", /auth\.uid\(\) = user_id[\s\S]*treinos\.user_id = auth\.uid\(\)/.test(policies));
add("treino_eventos grants select to authenticated", hasStatement(migrationStatements, /^grant\s+select\s+on\s+table\s+public\.treino_eventos\s+to\s+authenticated$/i) && hasStatement(policyStatements, /^grant\s+select\s+on\s+table\s+public\.treino_eventos\s+to\s+authenticated$/i));
add("treino_eventos revokes anon access", hasStatement(migrationStatements, /^revoke\s+all\s+on\s+table\s+public\.treino_eventos\s+from\s+anon$/i) && hasStatement(policyStatements, /^revoke\s+all\s+on\s+table\s+public\.treino_eventos\s+from\s+anon$/i));
add("treino_eventos revokes authenticated non-select access", hasStatement(migrationStatements, /^revoke\s+all\s+on\s+table\s+public\.treino_eventos\s+from\s+authenticated$/i) && hasStatement(policyStatements, /^revoke\s+all\s+on\s+table\s+public\.treino_eventos\s+from\s+authenticated$/i));
add("treino_eventos no authenticated non-select grants", !/\bgrant\s+(?:all|insert|update|delete|truncate|references|trigger)\b[\s\S]*\bpublic\.treino_eventos\b[\s\S]*\bto\s+authenticated\b/i.test(eventGrantStatements));
add("treino_eventos no anon grants", !/\bgrant\b[\s\S]*\bpublic\.treino_eventos\b[\s\S]*\bto\s+anon\b/i.test(eventGrantStatements));
add("no permissive true policy", !/using\s*\(\s*true\s*\)|with check\s*\(\s*true\s*\)/i.test(policies + "\n" + migration));
add("no authenticated student policy invented", !/student|aluno autenticado|portal/i.test(eventPolicies));
add("no event update policy", !/treino_eventos for update/i.test(policies + "\n" + migration));
add("no event delete policy", !/treino_eventos for delete/i.test(policies + "\n" + migration));
add("no event insert policy", !/treino_eventos for insert/i.test(policies + "\n" + migration));
add("revoke public grants", /revoke all on function public\.entregar_treino\(uuid\) from public/.test(migration));
add("no anon execute grant", !/grant execute on function public\.(entregar_treino|alterar_estado_treino)[\s\S]*to[\s\S]*anon/i.test(migration));
add("financial module outside staged diff", !/src\/features\/financeiro|pagamentosService|planosService/.test(diffFiles));

const failed = checks.filter((check) => !check.passed);
for (const check of checks) console.log(`${check.passed ? "PASS" : "FAIL"} ${check.name}`);
if (failed.length) process.exitCode = 1;

function functionBody(source, name) {
  const match = source.match(new RegExp(`create or replace function public\\.${name}[\\s\\S]*?\\n\\$\\$;`, "i"));
  return match?.[0] || "";
}

function sqlStatements(source) {
  return source
    .replace(/--.*$/gm, "")
    .split(";")
    .map((statement) => statement.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function hasStatement(statements, pattern) {
  return statements.some((statement) => pattern.test(statement));
}
