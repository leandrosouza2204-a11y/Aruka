import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildWorkoutTemplateApplicationPreview,
  createWorkoutTemplateApplicationIntent,
  getOrCreateWorkoutTemplateApplicationIntent,
  mapWorkoutTemplateApplicationError,
  normalizeTemplateForApplication,
  prepareWorkoutTemplateApplicationPayload,
  submitWorkoutTemplateApplicationOnce,
  validateWorkoutTemplateApplication,
} from "./workoutTemplateApplication.js";

const student = { id: "aluno-1", nome: "Ana Silva" };
const officialTemplate = {
  id: "official-abc",
  nome: "Oficial ABC",
  objetivo: "Forca",
  nivel: "Intermediario",
  divisao: "ABC",
  descricao: "Modelo oficial",
  isSystem: true,
  dias: [
    {
      nome: "Treino A",
      descricao: "Peito",
      exercicios: [
        { nome: "Supino", series: "4", repeticoes: "8", descanso: "90s", carga: "80kg" },
      ],
    },
  ],
};
const personalTemplate = {
  id: "personal-deep",
  nome: "Pessoal profundo",
  isSystem: false,
  descricao: "Modelo pessoal com estrutura aninhada",
  objetivo: "Hipertrofia",
  nivel: "Avancado",
  templateData: {
    schemaVersion: 1,
    source: "test-suite",
    days: [
      {
        name: "Treino A",
        notes: "Peito e triceps",
        order: 1,
        exercises: [
          {
            name: "Supino reto",
            sets: "4",
            repetitions: "6-8",
            rest: "120s",
            technique: "RIR 1",
            notes: "Pausar no peito",
            video: "",
            order: 1,
          },
          {
            name: "Triceps corda",
            sets: "3",
            repetitions: "12-15",
            rest: "60s",
            notes: "Controle total",
            order: 2,
          },
        ],
      },
      {
        name: "Treino B",
        notes: "Costas",
        order: 2,
        exercises: [
          {
            name: "Remada baixa",
            sets: "4",
            repetitions: "8-10",
            rest: "90s",
            technique: "Escapulas firmes",
            order: 1,
          },
        ],
      },
    ],
    auxiliary: {
      tags: ["hipertrofia", "academia"],
      audit: { createdBy: "test" },
    },
  },
};

test("constroi previa com contagem de dias, exercicios e modelo oficial", () => {
  const preview = buildWorkoutTemplateApplicationPreview({
    template: officialTemplate,
    student,
    options: { rotina: "Treino Ana" },
  });

  assert.equal(preview.templateOrigin, "official");
  assert.equal(preview.workoutName, "Treino Ana");
  assert.equal(preview.dayCount, 1);
  assert.equal(preview.exerciseCount, 1);
  assert.deepEqual(preview.mainExercises, ["Supino"]);
  assert.equal(preview.validation.ok, true);
});

test("constroi previa de modelo pessoal sem descricao e com valores nulos", () => {
  const preview = buildWorkoutTemplateApplicationPreview({
    template: {
      id: "personal-1",
      nome: "Pessoal",
      isSystem: false,
      descricao: null,
      templateData: {
        days: [{ name: "Full Body", exercises: [{ name: "Agachamento" }] }],
      },
    },
    student,
  });

  assert.equal(preview.templateOrigin, "personal");
  assert.equal(preview.level, "Nao informado");
  assert.equal(preview.warnings.includes("Modelo sem descricao."), true);
  assert.equal(preview.validation.ok, true);
});

test("prepara payload com aluno correto, sanitiza e nao muta o modelo original", () => {
  const intent = createWorkoutTemplateApplicationIntent({
    template: officialTemplate,
    student,
    options: { rotina: "Aplicado" },
    applicationIdempotencyKey: "retry-key-1",
  });
  const original = structuredClone(officialTemplate);
  const payload = prepareWorkoutTemplateApplicationPayload({
    template: officialTemplate,
    student,
    options: { rotina: "Aplicado", dataInicio: "2026-07-27", intent },
  });

  assert.deepEqual(officialTemplate, original);
  assert.equal(payload.alunoId, "aluno-1");
  assert.equal(payload.aluno, "Ana Silva");
  assert.equal(payload.rotina, "Aplicado");
  assert.equal(payload.dataInicio, "2026-07-27");
  assert.equal(payload.dias[0].exercicios[0].carga, "");
  assert.equal(payload.status, "Em revisao");
  assert.equal(payload.lifecycleStatus, "draft");
  assert.equal(payload.templateOriginType, "official");
  assert.equal(payload.templateOriginId, "official-abc");
  assert.equal(payload.templateOriginName, "Oficial ABC");
  assert.equal(payload.applicationIdempotencyKey, "retry-key-1");
  assert.deepEqual(payload.templateOriginSnapshot, {
    id: "official-abc",
    name: "Oficial ABC",
    originType: "official",
    objective: "Forca",
    level: "Intermediario",
    split: "ABC",
    schemaVersion: 1,
    dayCount: 1,
  });
});

test("reaproveita intencao de aplicacao para retries idempotentes", () => {
  const controller = {};
  const first = getOrCreateWorkoutTemplateApplicationIntent(controller, {
    template: personalTemplate,
    student,
    options: { rotina: "Aplicado pessoal" },
  });
  const second = getOrCreateWorkoutTemplateApplicationIntent(controller, {
    template: officialTemplate,
    student: { id: "outro-aluno", nome: "Outro" },
    options: { rotina: "Outra rotina" },
  });

  assert.strictEqual(first, second);
  assert.equal(first.templateOriginType, "personal");
  assert.equal(first.templateOriginId, "personal-deep");
  assert.equal(first.templateOriginName, "Pessoal profundo");
  assert.equal(first.templateOriginSnapshot.dayCount, 2);
  assert.match(first.applicationIdempotencyKey, /^workout-template-application:/);
});

test("rejeita aplicacao sem aluno, sem dias e com estrutura invalida", () => {
  assert.equal(
    validateWorkoutTemplateApplication({ template: officialTemplate, student: null }).ok,
    false
  );
  assert.throws(
    () => prepareWorkoutTemplateApplicationPayload({ template: { dias: [] }, student }),
    /ao menos um dia|dias e exercicios/
  );
  assert.throws(
    () =>
      prepareWorkoutTemplateApplicationPayload({
        template: { dias: [{ nome: "A", exercicios: [] }] },
        student,
      }),
    /dias e exercicios/
  );
});

test("mapeia erro de persistencia para mensagem compreensivel", () => {
  assert.equal(
    mapWorkoutTemplateApplicationError(new Error("network timeout")),
    "Nao foi possivel conectar ao servidor. Verifique a conexao e tente novamente."
  );
  assert.equal(
    mapWorkoutTemplateApplicationError(new Error("Aluno invalido.")),
    "Aluno invalido."
  );
});

test("bloqueia submissao duplicada durante chamada ativa", async () => {
  const controller = { active: false, result: null };
  let calls = 0;
  let resolveSubmit;
  const submit = () => {
    calls += 1;
    return new Promise((resolve) => {
      resolveSubmit = resolve;
    });
  };

  const first = submitWorkoutTemplateApplicationOnce(controller, submit);
  const second = submitWorkoutTemplateApplicationOnce(controller, submit);
  await Promise.resolve();
  resolveSubmit({ id: "treino-1" });

  assert.deepEqual(await first, { id: "treino-1" });
  assert.deepEqual(await second, { id: "treino-1" });
  assert.equal(calls, 1);
});

test("nao muta modelo oficial congelado", () => {
  const input = deepFreeze(structuredClone(officialTemplate));
  const before = structuredClone(input);

  const preview = buildWorkoutTemplateApplicationPreview({ template: input, student });
  const normalized = normalizeTemplateForApplication(input);
  const validation = validateWorkoutTemplateApplication({ template: input, student });
  const payload = prepareWorkoutTemplateApplicationPayload({ template: input, student });

  assert.deepStrictEqual(input, before);
  assert.equal(preview.dayCount, 1);
  assert.equal(normalized.days.length, 1);
  assert.equal(validation.ok, true);
  assert.equal(payload.dias[0].exercicios[0].nome, "Supino");
});

test("nao muta modelo pessoal profundamente aninhado", () => {
  const input = deepFreeze(structuredClone(personalTemplate));
  const before = structuredClone(input);

  const preview = buildWorkoutTemplateApplicationPreview({ template: input, student });
  const normalized = normalizeTemplateForApplication(input);
  const validation = validateWorkoutTemplateApplication({
    template: input,
    student,
    canonicalTemplateData: normalized,
  });
  const payload = prepareWorkoutTemplateApplicationPayload({ template: input, student });

  assert.deepStrictEqual(input, before);
  assert.equal(preview.dayCount, 2);
  assert.equal(preview.exerciseCount, 3);
  assert.equal(validation.ok, true);
  assert.equal(payload.dias.length, 2);
  assert.equal(payload.dias[0].exercicios[0].observacoes, "Pausar no peito | RIR 1");
});

test("payload nao compartilha referencias mutaveis", () => {
  const input = structuredClone(personalTemplate);
  const before = structuredClone(input);
  const payload = prepareWorkoutTemplateApplicationPayload({ template: input, student });

  assert.notStrictEqual(payload, input);
  assert.notStrictEqual(payload.dias, input.templateData.days);
  assert.notStrictEqual(payload.dias[0], input.templateData.days[0]);
  assert.notStrictEqual(payload.dias[0].exercicios, input.templateData.days[0].exercises);
  assert.notStrictEqual(payload.dias[0].exercicios[0], input.templateData.days[0].exercises[0]);

  payload.dias[0].nome = "ALTERADO";
  payload.dias[0].exercicios.push({ nome: "Novo exercicio" });

  assert.deepStrictEqual(input, before);
});

test("erro de persistencia preserva modelo", () => {
  const input = deepFreeze(structuredClone(personalTemplate));
  const before = structuredClone(input);
  const error = new Error("network timeout");

  assert.equal(
    mapWorkoutTemplateApplicationError(error),
    "Nao foi possivel conectar ao servidor. Verifique a conexao e tente novamente."
  );
  assert.deepStrictEqual(input, before);
});

test("submissao duplicada preserva modelo", async () => {
  const input = deepFreeze(structuredClone(personalTemplate));
  const before = structuredClone(input);
  const controller = { active: false, result: null };
  let calls = 0;
  let rejectSubmit;
  const submit = () => {
    calls += 1;
    return new Promise((resolve, reject) => {
      rejectSubmit = reject;
    });
  };

  const first = submitWorkoutTemplateApplicationOnce(controller, submit);
  const second = submitWorkoutTemplateApplicationOnce(controller, submit);
  await Promise.resolve();
  rejectSubmit(new Error("Falha controlada"));

  await assert.rejects(first, /Falha controlada/);
  await assert.rejects(second, /Falha controlada/);
  assert.equal(calls, 1);
  assert.deepStrictEqual(input, before);

  controller.result = null;
  await assert.rejects(
    submitWorkoutTemplateApplicationOnce(controller, () => {
      calls += 1;
      throw new Error("Nova tentativa");
    }),
    /Nova tentativa/
  );
  assert.equal(calls, 2);
  assert.deepStrictEqual(input, before);
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;

  Object.freeze(value);
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return value;
}
