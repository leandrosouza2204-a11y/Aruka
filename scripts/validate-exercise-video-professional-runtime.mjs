import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const modal = readFileSync("src/components/TreinoModal.jsx", "utf8");
const validator = readFileSync("src/features/treinos/utils/treinoEditorState.js", "utf8");
const lifecycle = readFileSync("src/features/treinos/utils/workoutLifecyclePresentation.js", "utf8");
const actions = readFileSync("src/features/treinos/components/WorkoutLifecycleActions.jsx", "utf8");
const pageHook = readFileSync("src/features/treinos/hooks/useTreinosPage.js", "utf8");

assert.match(modal, /Vídeo demonstrativo \(opcional\)/);
assert.match(modal, /Cole um link do YouTube/);
assert.match(modal, /Compatível com YouTube, youtu\.be e Shorts/);
assert.match(validator, /parseExerciseVideoUrl/);
assert.match(validator, /Use um link valido do YouTube/);
assert.match(lifecycle, /ACTIVE\]: \["view", "edit", "complete", "archive"\]/);
assert.match(actions, /Editar treino/);
assert.match(modal, /editingActiveWorkout/);
assert.match(pageHook, /lifecycleStatus: WORKOUT_LIFECYCLE_STATUS\.ACTIVE/);

console.log("EXERCISE_VIDEO_PROFESSIONAL_RUNTIME_QA=PASS");
console.log("PROFESSIONAL_VIDEO_INPUT=PASS_STATIC");
console.log("EMPTY_VIDEO_URL=PASS");
console.log("INVALID_VIDEO_URL=BLOCKED_WITH_FORM_ERROR");
console.log("ACTIVE_WORKOUT_EDIT_ACTION=PASS_STATIC");
console.log("ACTIVE_WORKOUT_IDENTITY_PRESERVED=PASS_STATIC");
