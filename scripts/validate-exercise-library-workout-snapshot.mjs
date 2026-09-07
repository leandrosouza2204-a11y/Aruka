import { existsSync, readFileSync } from "node:fs";

const files = {
  helper: "src/features/treinos/utils/workoutExerciseLibraryIntegration.js",
  helperTest: "src/features/treinos/utils/workoutExerciseLibraryIntegration.test.js",
  contractTest: "src/features/treinos/utils/workoutDataContract.test.js",
  migration: "supabase/migrations/20260907090000_workout_exercise_library_integration_v1.sql",
};

const source = Object.fromEntries(
  Object.entries(files).map(([key, path]) => [key, existsSync(path) ? readFileSync(path, "utf8") : ""])
);
const checks = [];

check("arquivos de snapshot existem", Object.values(files).every((path) => existsSync(path)));
check("snapshot cobre identidade, texto e classificacao", all(source.helper, [
  "schemaVersion: 1",
  "exerciseId",
  "source",
  "name",
  "description",
  "instructions",
  "muscleGroup",
  "category",
]));
check("snapshot cobre YouTube canonico", all(source.helper + source.helperTest, ["parseYouTubeMediaInput", "youtubeUrl", "videoId", "thumbnailUrl"]));
check("snapshot cobre upload sem URL assinada", all(source.helper + source.helperTest, ["uploaded_video", "mediaPath", "mimeType", "thumbnailPath"]) && !/signedUrl\s*:|createSignedUrl|getPublicUrl/.test(source.helper));
check("testes cobrem imutabilidade e novo snapshot apos edicao", all(source.helperTest, ["nao muta snapshot", "usa snapshot atual em nova adicao"]));
check("testes cobrem legado/FK nula e duplicacao", all(source.helperTest + source.contractTest, ["manual", "FK null", "duplica treino preservando exercise_id"]));
check("RPC valida snapshot JSON object", all(source.migration, ["WORKOUT_EXERCISE_MEDIA_SNAPSHOT_INVALID", "jsonb_typeof", "exerciseMediaSnapshot"]));

for (const item of checks) console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}`);
if (checks.some((item) => !item.ok)) process.exitCode = 1;

function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}

function all(text, markers) {
  return markers.every((marker) => text.includes(marker));
}
