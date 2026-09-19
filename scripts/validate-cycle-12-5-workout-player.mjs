import { readFile } from "node:fs/promises";

const [app, player, service, domain, home, library, css, migration] = await Promise.all([
  readFile("src/App.jsx", "utf8"),
  readFile("src/features/studentExperienceV2/player/StudentWorkoutPlayerV2.jsx", "utf8"),
  readFile("src/services/studentWorkoutPlayerV2Service.js", "utf8"),
  readFile("src/features/studentExperienceV2/domain/studentWorkoutPlayerV2.js", "utf8"),
  readFile("src/features/studentExperienceV2/home/StudentHomeV2.jsx", "utf8"),
  readFile("src/features/studentExperienceV2/training/StudentTrainingLibraryV2.jsx", "utf8"),
  readFile("src/index.css", "utf8"),
  readFile("supabase/migrations/20260915201101_cycle12_workout_player_v2.sql", "utf8"),
]);

const checks = [
  ["player route is session-based and outside StudentShell", /path="\/minha-area\/treino\/:sessionId"/.test(app) && /<StudentWorkoutPlayerV2 \/>/.test(app)],
  ["legacy workout fallback remains registered", /path="\/workout\/:sessionId"/.test(app) && /StudentWorkoutFallback/.test(app)],
  ["Home and Library navigate with returned session ids", /buildStudentWorkoutPlayerRoute\(session\.id\)/.test(home) && /buildStudentWorkoutPlayerRoute\(session\.id\)/.test(library)],
  ["one bounded player RPC is isolated in a dedicated service", /get_my_workout_player_v2/.test(service) && !/history|library/i.test(service)],
  ["canonical exercise ordering has deterministic tie-breaker", /dayOrder - right\.dayOrder/.test(domain) && /exerciseOrder - right\.exerciseOrder/.test(domain) && /localeCompare/.test(domain) && /order by e\.day_order_snapshot, e\.exercise_order_snapshot, e\.id/.test(migration)],
  ["RPC derives ownership and active access from auth uid", /v_user_id uuid := auth\.uid\(\)/.test(migration) && /student_user_id = v_user_id/.test(migration) && /student_access_status = 'active'/.test(migration)],
  ["RPC pins search path and denies anon", /set search_path = ''/.test(migration) && /revoke all on function public\.get_my_workout_player_v2\(uuid\) from public, anon/.test(migration)],
  ["payload contains snapshots without global history", /tracking_config_snapshot/.test(migration) && /prescribed_series_snapshot/.test(migration) && !/valid_workout_execution_sessions|get_my_previous/.test(migration)],
  ["navigation does not write and skip uses the canonical command", /setCurrentIndex/.test(player) && /skipWorkoutExercise/.test(player) && !/completeWorkoutSet/.test(player)],
  ["leave and cancel are separate explicit actions", /Sair do player e continuar depois/.test(player) && /cancelWorkoutSession/.test(player) && /showModal/.test(player)],
  ["set tracking and previous performance preserve the prepared boundaries", /data-testid="set-tracker-boundary"/.test(player) && /data-previous-performance-boundary="ready"/.test(player)],
  ["terminal, invalid, empty, error and retry states exist", /isPlayerSessionTerminal/.test(player) && /status === "missing"/.test(player) && /Treino sem exercícios/.test(player) && /Tentar novamente/.test(player)],
  ["current media is lazy and has a dignified fallback", /ExerciseVideoPlayer/.test(player) && /Sem demonstração disponível/.test(player) && !/autoplay/.test(player)],
  ["mobile safe areas, touch targets and reduced motion exist", /safe-area-inset-top/.test(css) && /safe-area-inset-bottom/.test(css) && /min-height: 46px/.test(css) && /prefers-reduced-motion: reduce/.test(css)],
  ["no client-side lifecycle cancellation hooks exist", !/beforeunload|visibilitychange/.test(player)],
];

let failed = false;
for (const [label, pass] of checks) {
  console.log(`${pass ? "PASS" : "FAIL"} ${label}`);
  if (!pass) failed = true;
}
if (failed) process.exit(1);
