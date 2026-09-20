import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const migration = read("supabase/migrations/20260920144904_cycle12_student_evolution_v2.sql");
const app = read("src/App.jsx");
const screen = read("src/features/studentExperienceV2/evolution/StudentEvolutionV2.jsx");
const domain = read("src/features/studentExperienceV2/domain/studentEvolutionV2.js");
const service = read("src/services/studentEvolutionV2Service.js");
const flags = read("src/features/studentExperienceV2/config/studentExperienceV2Config.js");

const checks = [
  ["evolution route replaces only its V2 placeholder", /path="evolucao" element={<StudentEvolutionV2\s*\/>}/.test(app) && /path="perfil" element={<StudentExperienceV2FutureRoute/.test(app)],
  ["rollout gate remains off by default", /VITE_STUDENT_EXPERIENCE_V2_ENABLED/.test(flags) && /String\(configuredValue \|\| ""\)[\s\S]*=== "true"/.test(flags)],
  ["recent history reuses the bounded canonical read", /getValidWorkoutExecutionHistory\(limit\)/.test(service) && /buscarMeuHistoricoValidoV2\(20\)/.test(screen)],
  ["frequency is independent of the bounded history", /get_my_student_workout_frequency_v2/.test(service + migration) && /session_date between v_today - 27 and v_today/.test(migration) && /status = 'completed'/.test(migration)],
  ["student identity and active access are server-derived", (migration.match(/student_user_id = v_user_id/g) || []).length === 2 && (migration.match(/student_access_status = 'active'/g) || []).length === 2 && !/\([^)]*aluno_id[^)]*\)/i.test(migration.match(/create or replace function[\s\S]*?returns jsonb/gi)?.join("\n") || "")],
  ["security definer reads pin search_path and least privilege execute", (migration.match(/security definer\s+set search_path = ''/gi) || []).length === 2 && /revoke all on function public\.get_my_student_workout_frequency_v2\(\) from public, anon/.test(migration) && /grant execute on function public\.get_my_student_assessments_v2\(\) to authenticated/.test(migration)],
  ["assessment payload is bounded and explicitly projected", /v_assessment_limit constant integer := 24/.test(migration) && /limit v_assessment_limit/.test(migration) && !/(foto_|observacoes|aderencia_|objetivo_|dobra_|percentual_|massa_|\bimc\b|\bsexo\b|\bidade\b)/i.test(migration)],
  ["no table grants or mutations are introduced", !/grant\s+(select|insert|update|delete|all)\s+on\s+(table\s+)?public\./i.test(migration) && !/\b(insert|update|delete)\s+(into|public\.|from)/i.test(migration)],
  ["workout presentation excludes non-completed sessions and skipped sets", /status === "completed"/.test(domain) && /filter\(\(set\) => set\.completed\)/.test(domain)],
  ["assessment comparison is numeric and neutral", /delta: current !== null && before !== null/.test(domain) && !/(melhor|pior|diagn[oó]st|recomend|score|ranking|proje[cç][aã]o)/i.test(domain + screen)],
  ["sections expose independent loading error retry and empty states", (screen.match(/status === "loading"/g) || []).length >= 3 && (screen.match(/status === "error"/g) || []).length >= 3 && (screen.match(/onRetry=/g) || []).length >= 3 && /SectionEmpty/.test(screen)],
  ["no photos media or signed URLs are loaded", !/(foto_|signedUrl|download|storage\.from)/i.test(service + screen + domain)],
];

let failed = false;
for (const [label, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${label}`);
  if (!pass) failed = true;
}
assert.equal(failed, false, "Cycle 12.9 static contract failed");
