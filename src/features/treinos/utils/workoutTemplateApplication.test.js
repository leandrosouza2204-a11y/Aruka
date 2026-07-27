import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildWorkoutTemplateApplicationPreview,
  mapWorkoutTemplateApplicationError,
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
  const original = structuredClone(officialTemplate);
  const payload = prepareWorkoutTemplateApplicationPayload({
    template: officialTemplate,
    student,
    options: { rotina: "Aplicado", dataInicio: "2026-07-27" },
  });

  assert.deepEqual(officialTemplate, original);
  assert.equal(payload.alunoId, "aluno-1");
  assert.equal(payload.aluno, "Ana Silva");
  assert.equal(payload.rotina, "Aplicado");
  assert.equal(payload.dataInicio, "2026-07-27");
  assert.equal(payload.dias[0].exercicios[0].carga, "");
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
