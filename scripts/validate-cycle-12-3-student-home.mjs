import { readFile } from "node:fs/promises";

const [app, shell, home, guard, service, domain, css, migration] = await Promise.all([
  readFile("src/App.jsx", "utf8"),
  readFile("src/features/studentExperienceV2/layout/StudentShell.jsx", "utf8"),
  readFile("src/features/studentExperienceV2/home/StudentHomeV2.jsx", "utf8"),
  readFile("src/features/studentExperienceV2/guards/StudentExperienceV2Route.jsx", "utf8"),
  readFile("src/services/studentHomeV2Service.js", "utf8"),
  readFile("src/features/studentExperienceV2/domain/studentHomeV2.js", "utf8"),
  readFile("src/index.css", "utf8"),
  readFile("supabase/migrations/20260915014848_cycle12_student_home_v2.sql", "utf8"),
]);

const checks = [
  ["legacy /minha-area remains registered", /path="\/minha-area"[\s\S]*?<MinhaArea/.test(app)],
  ["V2 Home route mounts StudentHomeV2", /path="inicio" element=\{<StudentHomeV2 \/>\}/.test(app)],
  ["Training and Evolution advance while Profile remains an explicit future route", /path="treinos" element=\{<StudentTrainingLibraryV2 \/>\}/.test(app) && /path="evolucao" element=\{<StudentEvolutionV2 \/>\}/.test(app) && app.includes('path="perfil" element={<StudentExperienceV2FutureRoute />}')],
  ["unknown Student V2 route recovers to inicio", /path="\*" element=\{<Navigate to="inicio" replace \/>\}/.test(app)],
  ["focused player does not mount StudentShell", /path="\/workout\/:sessionId"[\s\S]*?<StudentWorkoutFallback/.test(app)],
  ["single four-pillar navigation config", /STUDENT_V2_NAVIGATION/.test(shell) && (shell.match(/label: "/g) || []).length === 4],
  ["active navigation uses NavLink semantics", /NavLink/.test(shell) && /is-active/.test(shell)],
  ["logout remains accessible", /aria-label="Sair da área do aluno"/.test(shell) && /supabase\.auth\.signOut/.test(shell)],
  ["flag OFF skips the V2 data read", /if \(!enabled\) return undefined/.test(guard)],
  ["guard and Home share one bounded read", /get_my_student_home_v2/.test(service) && !/get_my_student_workouts/.test(service)],
  ["active session precedes today workout", home.indexOf("view.activeSession ?") < home.indexOf(": view.todayWorkout ?")],
  ["start rechecks active session", /const freshHome[\s\S]*freshHome\.activeSession/.test(home)],
  ["real retry calls reload", /async function retry[\s\S]*await reload\(\)/.test(home)],
  ["loading uses proportional skeletons", /StudentHomeSkeleton/.test(home) && /student-v2-skeleton-card/.test(home)],
  ["empty evolution avoids zero-value claims", /Seus resultados vão aparecer aqui/.test(home)],
  ["display name has canonical fallback", /displayName: program\.displayName \|\| program\.display_name \|\| internalName/.test(domain)],
  ["mobile navigation reserves safe area", /env\(safe-area-inset-bottom/.test(css) && /position: fixed/.test(css)],
  ["320px layout hardening exists", /@media \(max-width: 350px\)/.test(css)],
  ["reduced motion is respected", /prefers-reduced-motion: reduce/.test(css)],
  ["touch targets are at least 44px", /min-height: 46px/.test(css) && /height: 44px/.test(css)],
  ["Home RPC pins search_path", /get_my_student_home_v2\(\)[\s\S]*set search_path = ''/.test(migration)],
  ["Home RPC uses auth ownership", /student_user_id = v_user_id/.test(migration)],
  ["Home RPC excludes invalid metric states through canonical view", (migration.match(/valid_workout_execution_sessions/g) || []).length >= 3],
  ["Home RPC converts local calendar boundaries to timestamptz", (migration.match(/timestamp at time zone 'America\/Sao_Paulo'/g) || []).length >= 4],
  ["Home RPC is least privilege", /revoke all on function public\.get_my_student_home_v2\(\) from public, anon/.test(migration) && /grant execute[\s\S]*to authenticated/.test(migration)],
  ["Home payload contains no exercise list or history list", !/'exercises'|'history'|'sets'/.test(migration)],
];

let failed = false;
for (const [label, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${label}`);
  if (!pass) failed = true;
}
if (failed) process.exit(1);
