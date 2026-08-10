import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getWorkoutLifecycleActions,
  getWorkoutLifecyclePresentation,
  getWorkoutLifecycleStatus,
  getWorkoutOriginPresentation,
  getWorkoutPrimaryLifecycleAction,
  getWorkoutRelevantDate,
  mapWorkoutLifecycleUiError,
} from "./workoutLifecyclePresentation.js";

test("apresenta estados canonicos em portugues", () => {
  assert.equal(getWorkoutLifecyclePresentation("draft").label, "Em revisão");
  assert.equal(getWorkoutLifecyclePresentation("active").label, "Ativo");
  assert.equal(getWorkoutLifecyclePresentation("completed").label, "Concluído");
  assert.equal(getWorkoutLifecyclePresentation("archived").label, "Arquivado");
});

test("aplica fallback legado e desconhecido", () => {
  assert.equal(getWorkoutLifecycleStatus({ status: "Em revisao" }), "draft");
  assert.equal(getWorkoutLifecycleStatus({ status: "Em revisão" }), "draft");
  assert.equal(getWorkoutLifecycleStatus({ status: "Finalizado" }), "completed");
  assert.equal(getWorkoutLifecycleStatus({ status: "Ativo" }), "active");
  assert.equal(getWorkoutLifecycleStatus({ lifecycleStatus: "unknown" }), "draft");
});

test("centraliza acoes por estado sem exclusao fisica", () => {
  assert.deepEqual(getWorkoutLifecycleActions({ lifecycleStatus: "draft" }), [
    "edit",
    "deliver",
    "archive",
  ]);
  assert.deepEqual(getWorkoutLifecycleActions({ lifecycleStatus: "active" }), [
    "view",
    "complete",
    "archive",
  ]);
  assert.deepEqual(getWorkoutLifecycleActions({ lifecycleStatus: "completed" }), [
    "view",
    "archive",
  ]);
  assert.deepEqual(getWorkoutLifecycleActions({ lifecycleStatus: "archived" }), ["view"]);
  assert.equal(getWorkoutLifecycleActions({ lifecycleStatus: "draft" }).includes("delete"), false);
});

test("define acao primaria contextual", () => {
  assert.equal(getWorkoutPrimaryLifecycleAction({ lifecycleStatus: "draft" }), "deliver");
  assert.equal(getWorkoutPrimaryLifecycleAction({ lifecycleStatus: "active" }), "complete");
  assert.equal(getWorkoutPrimaryLifecycleAction({ lifecycleStatus: "completed" }), "view");
});

test("define data relevante por estado", () => {
  assert.deepEqual(getWorkoutRelevantDate({ lifecycleStatus: "draft", appliedAt: "2026-07-29" }), {
    label: "Criado em",
    value: "2026-07-29",
  });
  assert.equal(getWorkoutRelevantDate({ lifecycleStatus: "active", deliveredAt: "2026-07-30" }).label, "Entregue em");
  assert.equal(getWorkoutRelevantDate({ lifecycleStatus: "completed", completedAt: "2026-08-01" }).label, "Concluído em");
  assert.equal(getWorkoutRelevantDate({ lifecycleStatus: "archived", archivedAt: "2026-08-02" }).label, "Arquivado em");
});

test("apresenta origem official, personal e manual", () => {
  assert.equal(
    getWorkoutOriginPresentation({ templateOriginType: "official", templateOriginName: "ABC" }).value,
    "Modelo oficial: ABC"
  );
  assert.equal(
    getWorkoutOriginPresentation({ templateOriginType: "personal", templateOriginName: "Hipertrofia" }).value,
    "Modelo pessoal: Hipertrofia"
  );
  assert.equal(getWorkoutOriginPresentation({}).value, "Criação manual");
});

test("mapeia erros sem expor detalhes tecnicos", () => {
  assert.equal(
    mapWorkoutLifecycleUiError({ code: "WORKOUT_INCOMPLETE" }),
    "Complete os dias e exercícios antes de entregar."
  );
  assert.equal(
    mapWorkoutLifecycleUiError({ code: "WORKOUT_DELIVERY_INVALID_TRANSITION" }),
    "Esta ação não está disponível para o estado atual do treino."
  );
  assert.equal(
    mapWorkoutLifecycleUiError({ code: "WORKOUT_DELIVERY_NOT_AUTHORIZED" }),
    "Você não tem permissão para alterar este treino."
  );
});
