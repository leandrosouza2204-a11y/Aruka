import assert from "node:assert/strict";
import { test } from "node:test";
import {
  WORKOUT_STATUS,
  WORKOUT_LIFECYCLE_STATUS,
  WORKOUT_TEMPLATE_ORIGIN_TYPE,
  WORKOUT_TEMPLATE_SCHEMA_VERSION,
  assertTemplateDataIsSanitized,
  canonicalTemplateToWorkout,
  duplicateWorkoutDraft,
  isValidWorkoutLifecycleStatus,
  isValidWorkoutTemplateOriginType,
  normalizeCanonicalTemplateData,
  normalizeWorkoutLifecycleStatus,
  normalizeWorkoutStatus,
  normalizeWorkoutTemplateOrigin,
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
  assert.equal(normalizeWorkoutStatus("em revisão"), WORKOUT_STATUS.IN_REVIEW);
  assert.equal(normalizeWorkoutStatus("Ativo"), WORKOUT_STATUS.ACTIVE);
});

test("normaliza lifecycle status canonico e legado", () => {
  assert.equal(normalizeWorkoutLifecycleStatus("draft"), WORKOUT_LIFECYCLE_STATUS.DRAFT);
  assert.equal(normalizeWorkoutLifecycleStatus("Ativo"), WORKOUT_LIFECYCLE_STATUS.ACTIVE);
  assert.equal(normalizeWorkoutLifecycleStatus("Em revisao"), WORKOUT_LIFECYCLE_STATUS.DRAFT);
  assert.equal(normalizeWorkoutLifecycleStatus("Em revisão"), WORKOUT_LIFECYCLE_STATUS.DRAFT);
  assert.equal(normalizeWorkoutLifecycleStatus("em revisão"), WORKOUT_LIFECYCLE_STATUS.DRAFT);
  assert.equal(normalizeWorkoutLifecycleStatus("Finalizado"), WORKOUT_LIFECYCLE_STATUS.COMPLETED);
  assert.equal(normalizeWorkoutLifecycleStatus("archived"), WORKOUT_LIFECYCLE_STATUS.ARCHIVED);
  assert.equal(isValidWorkoutLifecycleStatus("active"), true);
  assert.equal(isValidWorkoutLifecycleStatus("invalid"), false);
});

test("normaliza origem official e personal e rejeita tipo invalido", () => {
  assert.equal(isValidWorkoutTemplateOriginType("official"), true);
  assert.equal(isValidWorkoutTemplateOriginType("personal"), true);
  assert.equal(isValidWorkoutTemplateOriginType("shared"), false);

  assert.deepEqual(normalizeWorkoutTemplateOrigin({
    templateOriginId: "modelo-1",
    templateOriginType: WORKOUT_TEMPLATE_ORIGIN_TYPE.OFFICIAL,
    templateOriginName: "Modelo oficial",
  }), {
    templateOriginId: "modelo-1",
    templateOriginType: WORKOUT_TEMPLATE_ORIGIN_TYPE.OFFICIAL,
    templateOriginName: "Modelo oficial",
    templateOriginSnapshot: null,
  });

  assert.equal(normalizeWorkoutTemplateOrigin({
    type: WORKOUT_TEMPLATE_ORIGIN_TYPE.PERSONAL,
    name: "Meu modelo",
  }).templateOriginType, WORKOUT_TEMPLATE_ORIGIN_TYPE.PERSONAL);

  assert.equal(normalizeWorkoutTemplateOrigin({ type: "shared" }).templateOriginType, "");
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

test("gera payload preservando referencia e snapshot da biblioteca", () => {
  const payload = workoutToPersistencePayload({
    alunoId: "student-id",
    rotina: "Biblioteca",
    dias: [
      {
        nome: "Treino A",
        exercicios: [
          {
            nome: "Agachamento",
            exerciseId: "11111111-1111-4111-8111-111111111111",
            exerciseMediaSnapshot: {
              schemaVersion: 1,
              exerciseId: "11111111-1111-4111-8111-111111111111",
              source: "official",
              name: "Agachamento",
              media: { type: "youtube", youtubeUrl: "https://youtu.be/dQw4w9WgXcQ" },
            },
          },
        ],
      },
    ],
  });

  assert.equal(payload.dias[0].exercicios[0].exerciseId, "11111111-1111-4111-8111-111111111111");
  assert.equal(payload.dias[0].exercicios[0].exerciseMediaSnapshot.name, "Agachamento");
  assert.equal(payload.dias[0].exercicios[0].exerciseMediaSnapshot.media.type, "youtube");
});

test("gera payload manual sem origem e com idempotency key opcional vazia", () => {
  const payload = workoutToPersistencePayload({
    alunoId: "student-id",
    rotina: "Manual",
    dias: [{ nome: "A", exercicios: [{ nome: "Supino" }] }],
  });

  assert.equal("templateOriginType" in payload, false);
  assert.equal("templateOriginId" in payload, false);
  assert.equal("templateOriginName" in payload, false);
  assert.equal("templateOriginSnapshot" in payload, false);
  assert.equal(payload.applicationIdempotencyKey, "");
});

test("gera payload aplicado com origem, lifecycle e idempotencia sem mutar original", () => {
  const source = {
    alunoId: "student-id",
    rotina: "Aplicado",
    lifecycleStatus: "active",
    templateOriginId: "tpl-1",
    templateOriginType: "official",
    templateOriginName: "Masculino ABC",
    templateOriginSnapshot: { id: "tpl-1", name: "Masculino ABC" },
    applicationIdempotencyKey: " retry-key ",
    dias: [{ nome: "A", exercicios: [{ nome: "Supino" }] }],
  };

  const payload = workoutToPersistencePayload(source);

  assert.equal(payload.lifecycleStatus, WORKOUT_LIFECYCLE_STATUS.ACTIVE);
  assert.equal(payload.templateOriginType, WORKOUT_TEMPLATE_ORIGIN_TYPE.OFFICIAL);
  assert.equal(payload.applicationIdempotencyKey, "retry-key");
  assert.deepEqual(payload.templateOriginSnapshot, { id: "tpl-1", name: "Masculino ABC" });
  payload.templateOriginSnapshot.name = "Alterado";
  assert.equal(source.templateOriginSnapshot.name, "Masculino ABC");
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

test("duplica treino preservando exercise_id e snapshot", () => {
  const duplicated = duplicateWorkoutDraft({
    id: "original",
    alunoId: "student",
    rotina: "Treino",
    dias: [
      {
        id: "day",
        exercicios: [
          {
            id: "exercise",
            nome: "Agachamento",
            exerciseId: "11111111-1111-4111-8111-111111111111",
            exerciseMediaSnapshot: { name: "Agachamento", media: { type: "" } },
          },
        ],
      },
    ],
  });

  assert.equal(duplicated.dias[0].exercicios[0].exerciseId, "11111111-1111-4111-8111-111111111111");
  assert.equal(duplicated.dias[0].exercicios[0].exerciseMediaSnapshot.name, "Agachamento");
});

test("rejeita template vazio, dia invalido e exercicio invalido", () => {
  assert.equal(validateCanonicalTemplateData({ days: [] }), false);
  assert.equal(validateCanonicalTemplateData({ days: [{ name: "", exercises: [] }] }), false);
  assert.equal(
    validateCanonicalTemplateData({ days: [{ name: "A", exercises: [{ name: "" }] }] }),
    false
  );
});
