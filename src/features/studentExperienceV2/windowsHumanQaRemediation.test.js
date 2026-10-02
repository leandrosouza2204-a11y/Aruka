import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(path, "utf8");
const player = read("src/features/studentExperienceV2/player/StudentWorkoutPlayerV2.jsx");
const guard = read("src/features/studentExperienceV2/guards/StudentExperienceV2Route.jsx");
const evolution = read("src/features/studentExperienceV2/evolution/StudentEvolutionV2.jsx");
const css = read("src/index.css");

test("terminal server confirmations refresh shared Home state without optimistic clearing", () => {
  assert.match(player, /result\?\.status !== "completed"[\s\S]*refreshAfterConfirmedSessionTransition\(result, reloadStudentExperience\)/);
  assert.match(player, /cancelWorkoutSession[\s\S]*refreshAfterConfirmedSessionTransition\(cancelled, reloadStudentExperience\)/);
  assert.match(guard, /setState\(\{ status: "loading", home: null, error: null \}\)/);
});

test("Evolution exposes a keyboard-native completed-session detail link with canonical route builder", () => {
  assert.match(evolution, /<Link[^>]*aria-label=.*Ver detalhes/);
  assert.match(evolution, /to=\{buildStudentWorkoutPlayerRoute\(item\.id\)\}/);
  assert.match(evolution, />Ver detalhes<\/Link>/);
  assert.match(css, /\.student-evolution-detail-link[^}]*min-height:\s*44px/);
});

test("rest timer is viewport-fixed, dismissible, persistent across exercise navigation, and politely announced", () => {
  assert.match(css, /\.workout-player-rest[^}]*position:\s*fixed/);
  assert.match(css, /\.workout-player-rest[^}]*z-index:\s*40/);
  assert.match(player, /Dispensar aviso/);
  assert.match(player, /dismissedRestKey\(player\.id\)/);
  assert.match(player, /aria-live="polite" className="sr-only"/);
});

test("exercise completion, skip affordance, and exit semantics remain distinct", () => {
  assert.match(player, /workout-player-exercise-complete/);
  assert.match(player, /<strong>Exercício concluído<\/strong>/);
  assert.doesNotMatch(player, /isPlayerExerciseComplete[\s\S]{0,300}selectExercise\(/);
  assert.match(css, /\.workout-player-skip[^}]*background:\s*#fff[^}]*border:\s*1px solid/);
  assert.match(player, /Sair do treino\?/);
  assert.match(player, /Sair e continuar depois/);
  assert.match(player, /Encerrar este treino\?/);
  assert.match(player, /cancelWorkoutSession/);
});
