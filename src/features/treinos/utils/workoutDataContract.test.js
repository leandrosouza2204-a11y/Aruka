import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WORKOUT_STATUS,
  WORKOUT_TEMPLATE_SCHEMA_VERSION,
  assertTemplateDataIsSanitized,
  canonicalTemplateToWorkout,
  duplicateWorkoutDraft,
  normalizeCanonicalTemplateData,
  normalizeWorkoutStatus,
  validateCanonicalTemplateData,
  workoutToCanonicalTemplateData,
  workoutToPersistencePayload,
} from "./workoutDataContract.js";

test("normaliza template canonico com schemaVersion e ordem estavel", () => {
  const template = normalizeCanonicalTemplateData({
    days: [
      {
        name: "Treino A",
        exercises: [
          { name: "Supino", sets: "4", repetitions: "8", rest: "90s" },
          { name: "Remada", order: 9 },
        ],
      },
    ],
  });

  assert.equal(template.schemaVersion, WORKOUT_TEMPLATE_SCHEMA_VERSION);
  assert.equal(template.days[0].order, 1);
  assert.equal(template.days[0].exercises[0].order, 1);
  assert.equal(template.days[0].exercises[1].order, 9);
});

test("aceita template legado sem schemaVersion", () => {
  const template = normalizeCanonicalTemplateData({
    days: [{ name: "Full Body", exercises: [{ name: "Agachamento" }] }],
  });

  assert.equal(template.schemaVersion, 1);
  assert.equal(validateCanonicalTemplateData(template), true);
});

test("remove dados de aluno, ids e carga do template", () => {
  const template = workoutToCanonicalTemplateData({
    id: "treino-1",
    alunoId: "aluno-1",
    aluno: "Aluno",
    status: "Ativo",
    dias: [
      {
        id: "dia-1",
        nome: "Treino A",
        exercicios: [
          {
            id: "ex-1",
            nome: "Supino",
            series: "4",
            repeticoes: "8",
            carga: "80kg",
            descanso: "90s",
            observacoes: "Controle",
            tecnica: "RIR 2",
            video: "https://example.com/video",
          },
        ],
      },
    ],
  });

  assert.equal(assertTemplateDataIsSanitized(template).ok, true);
  assert.equal(JSON.stringify(template).includes("80kg"), false);
  assert.equal(template.days[0].exercises[0].technique, "RIR 2");
  assert.equal(template.days[0].exercises[0].notes, "Controle");
});

test("converte template pessoal para editor preservando tecnica e observacoes", () => {
  const workout = canonicalTemplateToWorkout({
    id: "tpl-1",
    nome: "Modelo",
    objetivo: "Forca",
    templateData: {
      days: [
        {
          name: "Treino A",
          notes: "Peito",
          exercises: [{ name: "Supino", notes: "Controle", technique: "RIR 2" }],
        },
      ],
    },
  });

  assert.equal(workout.status, WORKOUT_STATUS.IN_REVIEW);
  assert.equal(workout.objetivo, "Forca");
  assert.equal(workout.dias[0].exercicios[0].observacoes, "Controle | RIR 2");
  assert.equal(workout.dias[0].exercicios[0].carga, "");
});

test("normaliza status canonico e variantes antigas", () => {
  assert.equal(normalizeWorkoutStatus("Em revisão"), WORKOUT_STATUS.IN_REVIEW);
  assert.equal(normalizeWorkoutStatus("Em revisao"), WORKOUT_STATUS.IN_REVIEW);
  assert.equal(normalizeWorkoutStatus("Ativo"), WORKOUT_STATUS.ACTIVE);
});

test("gera payload persistido sem ids temporarios e com status canonico", () => {
  const payload = workoutToPersistencePayload({
    id: "workout-id",
    alunoId: "student-id",
    rotina: " Hipertrofia ",
    status: "Em revisão",
    dias: [
      {
        id: "tmp-day",
        nome: "Treino A",
        exercicios: [{ id: "tmp-ex", nome: "Supino", carga: "80kg" }],
      },
    ],
  });

  assert.equal(payload.id, "workout-id");
  assert.equal(payload.rotina, "Hipertrofia");
  assert.equal(payload.status, WORKOUT_STATUS.IN_REVIEW);
  assert.equal(payload.dias[0].ordem, 1);
  assert.equal(payload.dias[0].exercicios[0].ordem, 1);
  assert.equal("id" in payload.dias[0], false);
});

test("duplica treino removendo ids originais e usando status canonico", () => {
  const duplicated = duplicateWorkoutDraft({
    id: "original",
    alunoId: "student",
    rotina: "Treino",
    dias: [{ id: "day", exercicios: [{ id: "exercise", nome: "Supino" }] }],
  });

  assert.equal(duplicated.id, undefined);
  assert.equal(duplicated.status, WORKOUT_STATUS.IN_REVIEW);
  assert.equal(duplicated.dias[0].id, undefined);
  assert.equal(duplicated.dias[0].exercicios[0].id, undefined);
});

test("rejeita template vazio, dia invalido e exercicio invalido", () => {
  assert.equal(validateCanonicalTemplateData({ days: [] }), false);
  assert.equal(validateCanonicalTemplateData({ days: [{ name: "", exercises: [] }] }), false);
  assert.equal(
    validateCanonicalTemplateData({ days: [{ name: "A", exercises: [{ name: "" }] }] }),
    false
  );
});
