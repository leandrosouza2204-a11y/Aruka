import assert from "node:assert/strict";
import { test } from "node:test";
import { buildAssessmentEvolutionExperience } from "./assessmentEvolutionExperience.js";

const baseAssessment = {
  id: "a1",
  data: "2026-01-10",
  peso: 82,
  altura: 180,
  sexo: "masculino",
  medidas: { cintura: 92, quadril: 101 },
  dobras: { peitoral: 14, abdominal: 24, coxa: 18 },
};

test("builds empty state without leaking technical metadata", () => {
  const evolution = buildAssessmentEvolutionExperience([]);

  assert.equal(evolution.status, "EMPTY");
  assert.equal(evolution.assessmentCount, 0);
  assert.equal(evolution.cards.length, 0);
  assert.match(evolution.reportLanguage, /primeira avaliação/i);
  assert.doesNotMatch(JSON.stringify(evolution), /aluno_id|user_id|uuid|rpc/i);
});

test("uses a single assessment as baseline", () => {
  const evolution = buildAssessmentEvolutionExperience([baseAssessment]);

  assert.equal(evolution.status, "BASELINE_ONLY");
  assert.equal(evolution.assessmentCount, 1);
  assert.equal(evolution.cards.find((card) => card.key === "peso").current, "82.0 kg");
  assert.equal(evolution.cards.find((card) => card.key === "peso").previousDelta, "Sem comparação");
  assert.equal(evolution.highlights[0], "Esta avaliação cria a linha de base para as próximas comparações.");
});

test("compares latest assessment with previous and first records", () => {
  const evolution = buildAssessmentEvolutionExperience([
    baseAssessment,
    {
      ...baseAssessment,
      id: "a2",
      data: "2026-03-10",
      peso: "80,5",
      medidas: { cintura: "88", quadril: 100 },
      dobras: { peitoral: 12, abdominal: 20, coxa: 16 },
    },
    {
      ...baseAssessment,
      id: "a3",
      data: "2026-05-10",
      peso: 79,
      medidas: { cintura: 86, quadril: 99 },
      dobras: { peitoral: 11, abdominal: 18, coxa: 15 },
    },
  ]);

  const peso = evolution.cards.find((card) => card.key === "peso");
  const cintura = evolution.cards.find((card) => card.key === "cintura");

  assert.equal(evolution.status, "READY");
  assert.equal(evolution.assessmentCount, 3);
  assert.equal(peso.previousDelta, "-1,5 kg");
  assert.equal(peso.totalDelta, "-3,0 kg");
  assert.equal(cintura.previousDelta, "-2,0 cm");
  assert.equal(cintura.tone, "positive");
  assert.match(evolution.reportLanguage, /Desde a avaliação anterior/);
});

test("handles partial and legacy values defensively", () => {
  const evolution = buildAssessmentEvolutionExperience([
    { id: "old", data: "2026-01-01", peso: "abc", medidas: {}, dobras: {} },
    { id: "new", data: "2026-02-01", peso: 70, medidas: {}, dobras: {} },
  ]);

  const peso = evolution.cards.find((card) => card.key === "peso");
  const cintura = evolution.cards.find((card) => card.key === "cintura");

  assert.equal(peso.current, "70.0 kg");
  assert.equal(peso.previousDelta, "Sem comparação");
  assert.equal(cintura.current, "Sem dado");
  assert.equal(evolution.summary, "Histórico disponível, mas ainda sem indicadores comparáveis suficientes.");
});
