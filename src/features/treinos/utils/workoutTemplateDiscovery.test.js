import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildTemplateDiscoveryOptions,
  deriveTemplateMuscleGroups,
  filterWorkoutTemplates,
  normalizeDiscoveryText,
  normalizeTemplateForDiscovery,
  paginateWorkoutTemplates,
  sortWorkoutTemplates,
} from "./workoutTemplateDiscovery.js";

const official = {
  id: "official-abc",
  nome: "Gluteos e Forca",
  descricao: "Modelo para hipertrofia feminina",
  genero: "Feminino",
  divisao: "ABC",
  objetivo: "Forca e hipertrofia",
  nivel: "Intermediario",
  isSystem: true,
  dias: [
    { nome: "Treino A", descricao: "Gluteos e posteriores", exercicios: [] },
    { nome: "Treino B", descricao: "Costas e biceps", exercicios: [] },
  ],
};

const personal = {
  id: "personal-upper",
  nome: "Upper iniciante",
  descricao: "Treino pessoal com foco em postura",
  genero: "Unissex",
  divisao: "Upper/Lower",
  objetivo: "Condicionamento geral",
  nivel: "Iniciante",
  isSystem: false,
  updatedAt: "2026-07-20T12:00:00Z",
  dias: [{ nome: "Upper A", descricao: "Peitoral e deltoides", exercicios: [] }],
};

function discoveryItems() {
  return [official, personal].map(normalizeTemplateForDiscovery);
}

describe("workoutTemplateDiscovery", () => {
  it("normaliza texto com case-insensitive, acentos e espacos extras", () => {
    assert.equal(normalizeDiscoveryText("  Glúteos   E  PEITORAL "), "gluteos e peitoral");
    assert.equal(normalizeDiscoveryText(null), "");
  });

  it("normaliza modelos sem mutar e preserva referencia original", () => {
    const item = normalizeTemplateForDiscovery(official, 3);

    assert.equal(item.id, "official-abc");
    assert.equal(item.origin, "official");
    assert.equal(item.original, official);
    assert.equal(item.originalIndex, 3);
    assert.deepEqual(official.dias[0].exercicios, []);
  });

  it("deriva grupos musculares de nome e descricao dos dias", () => {
    assert.deepEqual(deriveTemplateMuscleGroups(official), [
      "biceps",
      "Costas",
      "Gluteos",
      "posteriores",
    ]);
  });

  it("busca por nome e descricao", () => {
    const items = discoveryItems();

    assert.deepEqual(filterWorkoutTemplates(items, { query: "gluteos" }).map((item) => item.id), [
      "official-abc",
    ]);
    assert.deepEqual(filterWorkoutTemplates(items, { query: "postura" }).map((item) => item.id), [
      "personal-upper",
    ]);
  });

  it("filtra por origem, divisao, objetivo, nivel e grupo muscular", () => {
    const items = discoveryItems();

    assert.deepEqual(filterWorkoutTemplates(items, { origin: "personal" }).map((item) => item.id), [
      "personal-upper",
    ]);
    assert.deepEqual(filterWorkoutTemplates(items, { split: "ABC" }).map((item) => item.id), [
      "official-abc",
    ]);
    assert.deepEqual(
      filterWorkoutTemplates(items, { objective: "Condicionamento geral", level: "Iniciante" }).map(
        (item) => item.id
      ),
      ["personal-upper"]
    );
    assert.deepEqual(
      filterWorkoutTemplates(items, { muscleGroup: "glúteos" }).map((item) => item.id),
      ["official-abc"]
    );
  });

  it("combina multiplos filtros", () => {
    const items = discoveryItems();

    assert.deepEqual(
      filterWorkoutTemplates(items, {
        query: "modelo",
        origin: "official",
        split: "ABC",
        objective: "Forca e hipertrofia",
        level: "Intermediario",
        muscleGroup: "Costas",
      }).map((item) => item.id),
      ["official-abc"]
    );
  });

  it("cria opcoes derivadas do conjunto combinado", () => {
    const options = buildTemplateDiscoveryOptions(discoveryItems());

    assert.deepEqual(options.splits, ["ABC", "Upper/Lower"]);
    assert.deepEqual(options.levels, ["Iniciante", "Intermediario"]);
    assert.ok(options.muscleGroups.includes("Gluteos"));
  });

  it("ordena por nome sem mutar array de entrada", () => {
    const items = discoveryItems();
    const sorted = sortWorkoutTemplates(items, "nameAsc");

    assert.deepEqual(sorted.map((item) => item.id), ["official-abc", "personal-upper"]);
    assert.notEqual(sorted, items);
    assert.deepEqual(items.map((item) => item.id), ["official-abc", "personal-upper"]);

    assert.deepEqual(sortWorkoutTemplates(items, "nameDesc").map((item) => item.id), [
      "personal-upper",
      "official-abc",
    ]);
  });

  it("pagina resultados e corrige pagina fora do intervalo", () => {
    const items = Array.from({ length: 14 }, (_, index) =>
      normalizeTemplateForDiscovery({ ...official, id: `item-${index}` }, index)
    );

    const secondPage = paginateWorkoutTemplates(items, 2, 12);
    assert.equal(secondPage.currentPage, 2);
    assert.equal(secondPage.totalPages, 2);
    assert.equal(secondPage.items.length, 2);
    assert.equal(secondPage.hasPrevious, true);
    assert.equal(secondPage.hasNext, false);

    const clamped = paginateWorkoutTemplates(items, 99, 12);
    assert.equal(clamped.currentPage, 2);
  });

  it("trata valores null e undefined defensivamente", () => {
    const item = normalizeTemplateForDiscovery(null);
    assert.equal(item.name, "");
    assert.deepEqual(filterWorkoutTemplates([item], { query: undefined }), [item]);
  });
});
