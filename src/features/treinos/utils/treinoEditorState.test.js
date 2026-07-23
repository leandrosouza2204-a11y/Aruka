import assert from "node:assert/strict";
import test from "node:test";
import {
  areTreinoEditorStatesEqual,
  normalizeTreinoEditorState,
  validateTreinoEditorState,
} from "./treinoEditorState.js";

const alunos = [{ id: "aluno-1", nome: "Ana" }];

const treinoValido = {
  alunoId: "aluno-1",
  rotina: "Hipertrofia",
  dias: [
    {
      id: "day-temp",
      nome: "Treino A",
      exercicios: [{ id: "ex-temp", nome: "Supino", series: "3", repeticoes: "10" }],
    },
  ],
};

test("normaliza treino novo sem ids temporarios", () => {
  const normalized = normalizeTreinoEditorState(treinoValido);

  assert.equal(normalized.dias[0].nome, "Treino A");
  assert.equal(normalized.dias[0].id, undefined);
  assert.equal(normalized.dias[0].exercicios[0].id, undefined);
});

test("pre-selecao automatica por alunoId nao marca dirty", () => {
  const initial = { alunoId: "aluno-1", rotina: "", dias: [] };
  const current = { alunoId: "aluno-1", rotina: "", dias: [] };

  assert.equal(areTreinoEditorStatesEqual(initial, current), true);
});

test("detecta alteracoes e reversao completa", () => {
  const edited = structuredClone(treinoValido);
  edited.rotina = "Hipertrofia Fase 2";

  assert.equal(areTreinoEditorStatesEqual(treinoValido, edited), false);
  edited.rotina = "Hipertrofia";
  assert.equal(areTreinoEditorStatesEqual(treinoValido, edited), true);
});

test("detecta aluno, dia, exercicio e ordem como alteracoes", () => {
  const changedStudent = { ...treinoValido, alunoId: "aluno-2" };
  const changedDays = { ...treinoValido, dias: [] };
  const changedExercise = structuredClone(treinoValido);
  changedExercise.dias[0].exercicios.push({ nome: "Crucifixo" });
  const reordered = {
    ...treinoValido,
    dias: [{ nome: "Treino B", exercicios: [] }, ...treinoValido.dias],
  };

  assert.equal(areTreinoEditorStatesEqual(treinoValido, changedStudent), false);
  assert.equal(areTreinoEditorStatesEqual(treinoValido, changedDays), false);
  assert.equal(areTreinoEditorStatesEqual(treinoValido, changedExercise), false);
  assert.equal(areTreinoEditorStatesEqual(treinoValido, reordered), false);
});

test("rascunho de exercicio temporario marca dirty", () => {
  assert.equal(
    areTreinoEditorStatesEqual(treinoValido, {
      form: treinoValido,
      exerciseDrafts: { "day-temp": { nome: "Agachamento" } },
    }),
    false
  );
});

test("valida nome, aluno, dias e exercicio valido", () => {
  assert.equal(validateTreinoEditorState(treinoValido, alunos).ok, true);

  assert.equal(validateTreinoEditorState({ ...treinoValido, rotina: " " }, alunos).errors.name, "Preencha o nome do treino.");
  assert.equal(validateTreinoEditorState({ ...treinoValido, alunoId: "" }, alunos).errors.student, "Selecione um aluno.");
  assert.equal(validateTreinoEditorState({ ...treinoValido, dias: [] }, alunos).errors.days, "Adicione pelo menos um dia ao treino.");
  assert.equal(
    validateTreinoEditorState({ ...treinoValido, dias: [{ nome: "A", exercicios: [] }] }, alunos).errors.exercises,
    "Adicione pelo menos um exercicio antes de salvar."
  );
  assert.equal(
    validateTreinoEditorState({ ...treinoValido, dias: [{ nome: "A", exercicios: [{ nome: " " }] }] }, alunos).errors.exercises,
    "Adicione pelo menos um exercicio antes de salvar."
  );
});
