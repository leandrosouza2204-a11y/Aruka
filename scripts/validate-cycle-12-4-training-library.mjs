import { readFile } from "node:fs/promises";

const [app, page, service, domain, homeService, css, migration] = await Promise.all([
  readFile("src/App.jsx", "utf8"),
  readFile("src/features/studentExperienceV2/training/StudentTrainingLibraryV2.jsx", "utf8"),
  readFile("src/services/studentTrainingLibraryV2Service.js", "utf8"),
  readFile("src/features/studentExperienceV2/domain/studentTrainingLibraryV2.js", "utf8"),
  readFile("src/services/studentHomeV2Service.js", "utf8"),
  readFile("src/index.css", "utf8"),
  readFile("supabase/migrations/20260915140229_cycle12_student_training_library_v2.sql", "utf8"),
]);

const checks = [
  ["Training Library mounts on list and detail routes", /path="treinos" element=\{<StudentTrainingLibraryV2 \/>\}/.test(app) && /path="treinos\/:workoutId" element=\{<StudentTrainingLibraryV2 \/>\}/.test(app)],
  ["Home RPC remains isolated", /get_my_student_home_v2/.test(homeService) && !/training_library|workout_detail/.test(homeService)],
  ["library uses one bounded summary RPC", /get_my_student_training_library_v2/.test(service) && !/get_my_student_workouts/.test(service)],
  ["detail is fetched lazily by selected day", /if \(!workoutId\) return null/.test(page) && /get_my_student_workout_detail_v2/.test(service)],
  ["start revalidates global active session", /freshLibrary = await buscarMinhaBibliotecaTreinosV2/.test(page) && /freshLibrary\.activeSession/.test(page)],
  ["double interaction has a synchronous lock", /actionLock\.current/.test(page) && /disabled=\{disabled\}/.test(page)],
  ["continue uses the real active session id", /navigate\(`\/workout\/\$\{active\.id\}`\)/.test(page)],
  ["detail is a deep link rather than execution UI", /treinos\/:workoutId/.test(app) && !/completeWorkoutSet|RestTimer|previousPerformance/.test(page)],
  ["missing media has a nonblocking fallback", /Sem demonstração em vídeo/.test(page)],
  ["videos are delegated to the lazy existing media contract", /ExerciseVideoPlayer/.test(page)],
  ["no duration or muscle heuristics exist", !/Duração|duração estimada|estimateDuration/.test(page) && !/split.*muscle|infer.*muscle/i.test(domain)],
  ["mobile cards and safe-area sticky action exist", /student-workout-grid \{ grid-template-columns: 1fr/.test(css) && /student-training-sticky-action[\s\S]*safe-area-inset-bottom/.test(css)],
  ["primary controls retain 44px minimum", /student-v2-button[\s\S]*min-height: 46px/.test(css)],
  ["reduced motion remains supported", /prefers-reduced-motion: reduce/.test(css)],
  ["summary function pins search_path and derives ownership", /get_my_student_training_library_v2\(\)[\s\S]*set search_path = ''[\s\S]*student_user_id = v_user_id/.test(migration)],
  ["detail verifies current program ownership", /get_my_student_workout_detail_v2[\s\S]*d\.treino_id = v_program_id/.test(migration)],
  ["both RPCs have least-privilege grants", (migration.match(/revoke all on function public\.get_my_student_/g) || []).length === 2 && (migration.match(/grant execute on function public\.get_my_student_/g) || []).length === 2],
  ["canonical order is explicit", /order by e\.ordem, e\.created_at, e\.id/.test(migration) && /order by w\.ordem, w\.created_at, w\.id/.test(migration)],
  ["set totals only accept integer prescriptions", /bool_and\(btrim\(e\.series\) ~ '\^\[0-9\]\+\$'\)/.test(migration)],
  ["summary does not expose exercises or media", !/'exercises'|'trackingConfig'|'media'/.test(migration.split("create or replace function public.get_my_student_workout_detail_v2")[0])],
];

let failed = false;
for (const [label, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${label}`);
  if (!pass) failed = true;
}
if (failed) process.exit(1);
