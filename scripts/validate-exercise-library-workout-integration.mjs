import { existsSync, readFileSync } from "node:fs";

const files = {
  modal: "src/components/TreinoModal.jsx",
  card: "src/components/ExercicioCard.jsx",
  mapper: "src/services/exerciseLibraryMapper.js",
  service: "src/services/treinosService.js",
  contract: "src/features/treinos/utils/workoutDataContract.js",
  integration: "src/features/treinos/utils/workoutExerciseLibraryIntegration.js",
  tests: "src/features/treinos/utils/workoutExerciseLibraryIntegration.test.js",
  migration: "supabase/migrations/20260907090000_workout_exercise_library_integration_v1.sql",
  baselineTables: "supabase/baseline-src/02-tables.sql",
  baselineConstraints: "supabase/baseline-src/03-constraints.sql",
  baselineFunctions: "supabase/baseline-src/05-functions.sql",
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, existsSync(path) ? readFileSync(path, "utf8") : ""])
);
const checks = [];

check("arquivos canonicos existem", Object.values(files).every((path) => existsSync(path)));
check("modal abre picker de biblioteca no editor", all(source.modal, [
  "buscarBibliotecaExerciciosSupabase",
  "workout-library-picker",
  "exercise-library-picker-open",
  "libraryExerciseToWorkoutExercise",
]));
check("picker cobre busca, origem, grupo, categoria, midia, erro, retry, vazio e selecao", all(source.modal, [
  "workout-library-picker-search",
  "workout-library-picker-origin",
  "workout-library-picker-muscle",
  "workout-library-picker-category",
  "workout-library-picker-media",
  "workout-library-picker-retry",
  "Nenhum exercício encontrado",
  "workout-library-picker-select",
]));
check("filtros da biblioteca incluem categoria no mapper", all(source.mapper, ["filtros.categoria", "combinaCategoria", "categorias: uniqueSorted"]));
check("caminho manual limpa referencia de biblioteca", all(source.modal + source.integration, ["manualWorkoutExercise", "exerciseId: \"\"", "exerciseMediaSnapshot: {}"]));
check("payload persiste exercise_id e snapshot", all(source.contract + source.service, [
  "exerciseId: reference.exerciseId",
  "exerciseMediaSnapshot: reference.exerciseMediaSnapshot",
  "exercise_id || \"\"",
  "exercise_media_snapshot || {}",
]));
check("schema/RPC persistem referencia atomica", all(source.migration + source.baselineFunctions, [
  "exercise_media_snapshot",
  "WORKOUT_EXERCISE_LIBRARY_FORBIDDEN",
  "exercise.owner_id = v_user_id",
  "exercise.origin = 'official' and exercise.status = 'active'",
  "nullif(btrim(coalesce(v_exercise->>'exerciseId'",
]));
check("schema preserva FK nullable e snapshot objeto", all(source.migration + source.baselineTables + source.baselineConstraints, [
  "exercise_id uuid",
  "on delete set null",
  "jsonb_typeof(exercise_media_snapshot) = 'object'",
]));
check("snapshot nao persiste signed URLs", !/signedUrl\s*:|getPublicUrl/.test(source.integration + source.contract + source.service + source.modal));
check("testes dedicados existem", all(source.tests, ["snapshot", "manual", "signed URL", "exerciseId"]));

for (const item of checks) console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}`);
if (checks.some((item) => !item.ok)) process.exitCode = 1;

function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}

function all(text, markers) {
  return markers.every((marker) => text.includes(marker));
}
