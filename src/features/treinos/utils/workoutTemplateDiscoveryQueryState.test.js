import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  clearTemplateDiscoveryStateFromUrl,
  countActiveTemplateDiscoveryFilters,
  hasActiveTemplateDiscoveryFilters,
  readTemplateDiscoveryStateFromUrl,
  updateTemplateDiscoveryStateInUrl,
} from "./workoutTemplateDiscoveryQueryState.js";

describe("workoutTemplateDiscoveryQueryState", () => {
  it("le parametros validos", () => {
    const state = readTemplateDiscoveryStateFromUrl(
      "?templateQ=abc&templateSplit=ABC&templateObjective=Forca&templateLevel=Iniciante&templateMuscleGroup=Costas&templateOrigin=official&templateSort=nameAsc&templatePage=2"
    );

    assert.deepEqual(state, {
      query: "abc",
      split: "ABC",
      objective: "Forca",
      level: "Iniciante",
      muscleGroup: "Costas",
      origin: "official",
      sort: "nameAsc",
      page: 2,
    });
  });

  it("aplica fallback para parametros invalidos", () => {
    const state = readTemplateDiscoveryStateFromUrl(
      "?templateOrigin=unknown&templateSort=equipment&templatePage=-5"
    );

    assert.equal(state.origin, "all");
    assert.equal(state.sort, "recommended");
    assert.equal(state.page, 1);
  });

  it("remove parametros default e preserva parametros externos", () => {
    const params = updateTemplateDiscoveryStateInUrl(
      "?busca=Ana&templateQ=abc&templateOrigin=official&templatePage=4",
      { query: "", origin: "all", page: 1 }
    );

    assert.equal(params.get("busca"), "Ana");
    assert.equal(params.has("templateQ"), false);
    assert.equal(params.has("templateOrigin"), false);
    assert.equal(params.has("templatePage"), false);
  });

  it("reseta templatePage ao alterar filtros", () => {
    const params = updateTemplateDiscoveryStateInUrl("?templatePage=3&templateLevel=Iniciante", {
      split: "ABC",
    });

    assert.equal(params.get("templateSplit"), "ABC");
    assert.equal(params.has("templatePage"), false);
  });

  it("nao serializa origem, sort ou pagina invalidos em updates", () => {
    const params = updateTemplateDiscoveryStateInUrl("", {
      origin: "invalid",
      sort: "recent",
      page: -3,
    });

    assert.equal(params.has("templateOrigin"), false);
    assert.equal(params.has("templateSort"), false);
    assert.equal(params.has("templatePage"), false);
  });

  it("serializa pagina sem reset quando apenas page muda", () => {
    const params = updateTemplateDiscoveryStateInUrl("?templateQ=abc", { page: 2 });

    assert.equal(params.get("templateQ"), "abc");
    assert.equal(params.get("templatePage"), "2");
  });

  it("limpa apenas parametros de descoberta", () => {
    const params = clearTemplateDiscoveryStateFromUrl(
      "?busca=Ana&objetivo=Forca&templateQ=abc&templateSplit=ABC"
    );

    assert.equal(params.toString(), "busca=Ana&objetivo=Forca");
  });

  it("conta filtros ativos e evita conflito com filtros principais", () => {
    const state = readTemplateDiscoveryStateFromUrl("?busca=Ana&templateQ=abc&templateSort=nameDesc");

    assert.equal(hasActiveTemplateDiscoveryFilters(state), true);
    assert.equal(countActiveTemplateDiscoveryFilters(state), 2);
    assert.equal(state.query, "abc");
  });
});
