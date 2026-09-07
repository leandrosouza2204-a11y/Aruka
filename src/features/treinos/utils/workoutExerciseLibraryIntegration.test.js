import assert from "node:assert/strict";
import { test } from "node:test";
import {
  hasPersistedSignedUrl,
  libraryExerciseToWorkoutExercise,
  manualWorkoutExercise,
  normalizeWorkoutExerciseReference,
} from "./workoutExerciseLibraryIntegration.js";
import { duplicateWorkoutDraft, workoutToPersistencePayload } from "./workoutDataContract.js";

const libraryExercise = {
  id: "11111111-1111-4111-8111-111111111111",
  nome: "Agachamento",
  descricao: "Base de pernas",
  instrucoes: "Coluna neutra",
  grupoMuscular: "Quadriceps",
  categoria: "Musculacao",
  origem: "official",
  midia: {
    type: "youtube",
    youtubeUrl: "https://youtu.be/dQw4w9WgXcQ",
  },
};

test("normaliza exercicio da biblioteca para snapshot de treino", () => {
  const exercise = libraryExerciseToWorkoutExercise(libraryExercise, {
    series: "4",
    repeticoes: "8",
  });

  assert.equal(exercise.exerciseId, libraryExercise.id);
  assert.equal(exercise.nome, "Agachamento");
  assert.equal(exercise.series, "4");
  assert.equal(exercise.exerciseMediaSnapshot.name, "Agachamento");
  assert.equal(exercise.exerciseMediaSnapshot.media.type, "youtube");
  assert.equal(exercise.video, "https://www.youtube.com/watch?v=dQw4w9WgXcQ");
});

test("edicao posterior da biblioteca nao muta snapshot existente", () => {
  const exercise = libraryExerciseToWorkoutExercise(libraryExercise);
  const previous = structuredClone(exercise.exerciseMediaSnapshot);

  const changed = { ...libraryExercise, nome: "Agachamento livre" };

  assert.deepEqual(exercise.exerciseMediaSnapshot, previous);
  assert.equal(exercise.nome, "Agachamento");
  assert.equal(changed.nome, "Agachamento livre");
});

test("nova adicao apos edicao usa snapshot atual em nova adicao", () => {
  const changed = { ...libraryExercise, nome: "Agachamento livre" };
  const exercise = libraryExerciseToWorkoutExercise(changed);

  assert.equal(exercise.nome, "Agachamento livre");
  assert.equal(exercise.exerciseMediaSnapshot.name, "Agachamento livre");
});

test("exercicio manual preserva exercise_id null no payload", () => {
  const manual = manualWorkoutExercise({ nome: "Livre", series: "3" });
  const payload = workoutToPersistencePayload({
    alunoId: "student",
    rotina: "Manual",
    dias: [{ nome: "A", exercicios: [manual] }],
  });

  assert.equal(payload.dias[0].exercicios[0].exerciseId, "");
  assert.deepEqual(payload.dias[0].exercicios[0].exerciseMediaSnapshot, {});
});

test("payload preserva exercise_id e snapshot sem signed URL", () => {
  const exercise = libraryExerciseToWorkoutExercise({
    ...libraryExercise,
    midia: {
      type: "uploaded_video",
      mediaPath: "11111111-1111-4111-8111-111111111111/exercises/22222222-2222-4222-8222-222222222222/33333333-3333-4333-8333-333333333333.mp4",
      mimeType: "video/mp4",
      signedUrl: "https://example.com/temp",
    },
  });
  const payload = workoutToPersistencePayload({
    alunoId: "student",
    rotina: "Upload",
    dias: [{ nome: "A", exercicios: [exercise] }],
  });

  assert.equal(payload.dias[0].exercicios[0].exerciseId, libraryExercise.id);
  assert.equal(payload.dias[0].exercicios[0].exerciseMediaSnapshot.media.type, "uploaded_video");
  assert.equal(hasPersistedSignedUrl(payload), false);
});

test("duplicacao preserva snapshot e remove apenas ids temporarios", () => {
  const exercise = libraryExerciseToWorkoutExercise(libraryExercise);
  const duplicated = duplicateWorkoutDraft({
    id: "workout",
    alunoId: "student",
    rotina: "Treino",
    dias: [{ id: "day", exercicios: [exercise] }],
  });

  assert.equal(duplicated.dias[0].exercicios[0].id, undefined);
  assert.equal(duplicated.dias[0].exercicios[0].exerciseId, libraryExercise.id);
  assert.equal(duplicated.dias[0].exercicios[0].exerciseMediaSnapshot.name, "Agachamento");
});

test("normaliza FK null preservando snapshot vazio", () => {
  assert.deepEqual(normalizeWorkoutExerciseReference({ exercise_id: null }), {
    exerciseId: "",
    exerciseMediaSnapshot: {},
  });
});
