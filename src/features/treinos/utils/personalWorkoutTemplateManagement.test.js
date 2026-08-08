import assert from "node:assert/strict";
import test from "node:test";
import {
  PERSONAL_TEMPLATE_MODES,
  buildPersonalTemplatePersistencePayload,
  buildPersonalTemplatePreview,
  createEmptyPersonalWorkoutTemplateDraft,
  createSubmissionGate,
  preparePersonalTemplateDraft,
  submitPersonalTemplateOnce,
  validatePersonalTemplateDraft,
} from "./personalWorkoutTemplateManagement.js";

const workout = {
  id: "workout-1",
  alunoId: "student-1",
  aluno: "Ana",
  nomeAluno: "Ana",
  status: "Ativo",
  dataInicio: "2026-07-01",
  dataRevisao: "2026-08-01",
  rotina: "Hipertrofia ABC",
  objetivo: "Hipertrofia",
  nivel: "Intermediario",
  dias: [
    {
      id: "day-1",
      nome: "A",
      descricao: "Peito",
      exercicios: [
        {
          id: "exercise-1",
          nome: "Supino",
          series: "4",
          repeticoes: "8",
          carga: "80kg",
          descanso: "90s",
          observacoes: "Controlar descida",
        },
      ],
    },
  ],
};

const officialTemplate = {
  id: "official-1",
  nome: "Modelo Oficial",
  genero: "Unissex",
  divisao: "ABC",
  objetivo: "Hipertrofia",
  nivel: "Intermediario",
  descricao: "Base oficial",
  isSystem: true,
  origem: "official",
  templateData: {
    days: [{ name: "A", notes: "Peito", exercises: [{ name: "Supino", sets: "4", repetitions: "8" }] }],
  },
};

const personalTemplate = {
  ...officialTemplate,
  id: "personal-1",
  nome: "Meu Modelo",
  isSystem: false,
  origem: "personal",
  ownerId: "user-1",
};

test("criacao: cria estrutura inicial valida e rejeita modelo vazio", () => {
  const draft = createEmptyPersonalWorkoutTemplateDraft();
  assert.deepEqual(draft.workout.dias, []);

  const validation = validatePersonalTemplateDraft({ draft });
  assert.equal(validation.ok, false);
  assert.equal(validation.errors.name, "Informe o nome do modelo.");
  assert.equal(validation.errors.days, "Inclua pelo menos um dia.");
});

test("criacao: sanitiza campos e nao muta entrada", () => {
  const draft = preparePersonalTemplateDraft({
    mode: PERSONAL_TEMPLATE_MODES.CREATE_FROM_WORKOUT,
    workout,
  });
  draft.metadata.name = "Modelo Novo";
  const frozen = deepFreeze(structuredClone(draft));
  const snapshot = structuredClone(frozen);

  const payload = buildPersonalTemplatePersistencePayload({ draft: frozen });

  assert.equal(payload.id, undefined);
  assert.equal(payload.metadata.name, "Modelo Novo");
  assert.equal(payload.templateData.days[0].exercises[0].name, "Supino");
  assert.equal("alunoId" in payload.templateData, false);
  assert.equal("id" in payload.templateData.days[0], false);
  assert.deepEqual(frozen, snapshot);
});

test("criacao a partir de treino: remove aluno, ids, execucao, preserva ordem e referencias independentes", () => {
  const original = deepFreeze(structuredClone(workout));
  const snapshot = structuredClone(original);
  const draft = preparePersonalTemplateDraft({
    mode: PERSONAL_TEMPLATE_MODES.CREATE_FROM_WORKOUT,
    workout: original,
  });
  const payload = buildPersonalTemplatePersistencePayload({
    mode: PERSONAL_TEMPLATE_MODES.CREATE_FROM_WORKOUT,
    draft,
  });

  assert.deepEqual(original, snapshot);
  assert.equal(payload.templateData.days[0].order, 1);
  assert.equal(payload.templateData.days[0].exercises[0].order, 1);
  assert.equal(payload.templateData.days[0].exercises[0].carga, undefined);
  assert.notStrictEqual(draft.workout.dias, original.dias);
  assert.notStrictEqual(draft.workout.dias[0].exercicios, original.dias[0].exercicios);
});

test("edicao: mantem identificador, rejeita oficial e ownership invalido sem alterar original", () => {
  const original = deepFreeze(structuredClone(personalTemplate));
  const snapshot = structuredClone(original);
  const draft = preparePersonalTemplateDraft({
    mode: PERSONAL_TEMPLATE_MODES.EDIT,
    template: original,
    currentUserId: "user-1",
  });
  draft.metadata.name = "Editado";

  const payload = buildPersonalTemplatePersistencePayload({
    mode: PERSONAL_TEMPLATE_MODES.EDIT,
    draft,
    originalTemplate: original,
    currentUserId: "user-1",
  });

  assert.equal(payload.id, "personal-1");
  assert.equal(payload.metadata.name, "Editado");
  assert.deepEqual(original, snapshot);
  assert.throws(() =>
    preparePersonalTemplateDraft({
      mode: PERSONAL_TEMPLATE_MODES.EDIT,
      template: officialTemplate,
      currentUserId: "user-1",
    })
  );
  assert.equal(
    validatePersonalTemplateDraft({
      mode: PERSONAL_TEMPLATE_MODES.EDIT,
      draft,
      originalTemplate: personalTemplate,
      currentUserId: "other",
    }).errors.ownership,
    "Você só pode editar seus próprios modelos."
  );
});

test("duplicacao oficial: remove identificador, sugere copia, vira pessoal e nao altera oficial", () => {
  const original = deepFreeze(structuredClone(officialTemplate));
  const snapshot = structuredClone(original);
  const draft = preparePersonalTemplateDraft({
    mode: PERSONAL_TEMPLATE_MODES.DUPLICATE_OFFICIAL,
    template: original,
  });
  const payload = buildPersonalTemplatePersistencePayload({
    mode: PERSONAL_TEMPLATE_MODES.DUPLICATE_OFFICIAL,
    draft,
  });

  assert.equal(draft.metadata.name, "Copia de Modelo Oficial");
  assert.equal(payload.id, undefined);
  assert.equal(payload.createsNewRecord, true);
  assert.deepEqual(original, snapshot);
});

test("duplicacao pessoal: gera payload novo, permite nome personalizado e nao compartilha referencias", () => {
  const original = deepFreeze(structuredClone(personalTemplate));
  const draft = preparePersonalTemplateDraft({
    mode: PERSONAL_TEMPLATE_MODES.DUPLICATE_PERSONAL,
    template: original,
    name: "Minha copia",
  });
  const payload = buildPersonalTemplatePersistencePayload({
    mode: PERSONAL_TEMPLATE_MODES.DUPLICATE_PERSONAL,
    draft,
  });

  assert.equal(payload.id, undefined);
  assert.equal(payload.metadata.name, "Minha copia");
  assert.notStrictEqual(draft.workout.dias, original.templateData.days);
  payload.templateData.days[0].name = "Alterado";
  assert.equal(original.templateData.days[0].name, "A");
});

test("preview: mostra resumo, mudancas e avisos antes da persistencia", () => {
  const draft = preparePersonalTemplateDraft({
    mode: PERSONAL_TEMPLATE_MODES.EDIT,
    template: personalTemplate,
    currentUserId: "user-1",
  });
  draft.metadata.name = "Outro nome";
  const preview = buildPersonalTemplatePreview({
    mode: PERSONAL_TEMPLATE_MODES.EDIT,
    draft,
    originalTemplate: personalTemplate,
    currentUserId: "user-1",
  });

  assert.equal(preview.operationLabel, "Salvar alteracoes");
  assert.equal(preview.dayCount, 1);
  assert.equal(preview.exerciseCount, 1);
  assert.deepEqual(preview.changes, ["Nome alterado."]);
});

test("submissao: bloqueia clique duplicado, reutiliza promessa ativa e permite retry apos erro", async () => {
  const gate = createSubmissionGate();
  let calls = 0;
  const first = submitPersonalTemplateOnce(gate, async () => {
    calls += 1;
    await Promise.resolve();
    return "ok";
  });
  const second = submitPersonalTemplateOnce(gate, async () => {
    calls += 1;
    return "duplicado";
  });

  assert.strictEqual(first, second);
  assert.equal(await first, "ok");
  assert.equal(calls, 1);

  let errors = 0;
  await assert.rejects(
    submitPersonalTemplateOnce(gate, async () => {
      errors += 1;
      throw new Error("falha");
    })
  );
  await assert.rejects(
    submitPersonalTemplateOnce(gate, async () => {
      errors += 1;
      throw new Error("falha novamente");
    })
  );
  assert.equal(errors, 2);
});

function deepFreeze(value) {
  if (!value || typeof value !== "object") return value;
  Object.freeze(value);
  Object.values(value).forEach((child) => deepFreeze(child));
  return value;
}
