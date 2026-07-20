import assert from "node:assert/strict";
import test from "node:test";
import {
  areWorkoutTemplateDraftsEqual,
  createWorkoutTemplateEditorDraft,
  normalizeWorkoutTemplateDraft,
  validateWorkoutTemplateDraft,
} from "./workoutTemplateEditorState.js";

const treino = {
  rotina: "Modelo QA",
  objetivo: "Hipertrofia",
  nivel: "Intermediario",
  dias: [
    {
      id: "day-a",
      nome: "Treino A",
      descricao: "Peito",
      exercicios: [
        { id: "ex-1", nome: "Supino", series: "3", repeticoes: "8-10", carga: "80kg", descanso: "90s" },
        { id: "ex-2", nome: "Crucifixo", series: "2", repeticoes: "12", descanso: "60s" },
      ],
    },
  ],
};

test("cria snapshot normalizado sem campos transitorios proibidos", () => {
  const draft = createWorkoutTemplateEditorDraft({ treino });
  const normalized = normalizeWorkoutTemplateDraft(draft);

  assert.equal(normalized.metadata.name, "Modelo QA");
  assert.equal(normalized.templateData.days[0].exercises[0].name, "Supino");
  assert.equal(normalized.templateData.days[0].exercises[0].carga, undefined);
});

test("detecta alteracao pendente e remove pendencia ao reverter", () => {
  const original = createWorkoutTemplateEditorDraft({ treino });
  const edited = structuredClone(original);
  edited.metadata.name = "Modelo QA Editado";

  assert.equal(areWorkoutTemplateDraftsEqual(original, edited), false);
  edited.metadata.name = "Modelo QA";
  assert.equal(areWorkoutTemplateDraftsEqual(original, edited), true);
});

test("preserva ordem dos exercicios na comparacao", () => {
  const original = createWorkoutTemplateEditorDraft({ treino });
  const reordered = structuredClone(original);
  reordered.workout.dias[0].exercicios.reverse();

  assert.equal(areWorkoutTemplateDraftsEqual(original, reordered), false);
});

test("valida nome do modelo, exercicios e series invalidas", () => {
  const draft = createWorkoutTemplateEditorDraft({ treino });
  draft.metadata.name = " ";
  draft.workout.dias[0].exercicios[0].nome = "";
  draft.workout.dias[0].exercicios[1].series = "0";

  const result = validateWorkoutTemplateDraft(draft);

  assert.equal(result.ok, false);
  assert.equal(result.errors.name, "Informe o nome do modelo.");
  assert.equal(result.errors["day-0-exercise-0-sets"], "Informe séries com valor válido.");
});
