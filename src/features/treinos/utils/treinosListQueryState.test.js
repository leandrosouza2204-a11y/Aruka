import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  atualizarFiltroTreinosNaUrl,
  lerFiltrosTreinosDaUrl,
  limparFiltrosTreinosDaUrl,
} from "./treinosListQueryState.js";

describe("treinosListQueryState", () => {
  it("le filtros da URL com defaults operacionais", () => {
    const filtros = lerFiltrosTreinosDaUrl("?busca=forca&objetivo=Hipertrofia");

    assert.deepEqual(filtros, {
      busca: "forca",
      objetivo: "Hipertrofia",
      nivel: "todos",
      status: "todos",
    });
  });

  it("atualiza filtros preservando contexto e retorno", () => {
    const params = atualizarFiltroTreinosNaUrl(
      "?alunoId=abc&returnTo=%2Falunos%3Fbusca%3DAna",
      "status",
      "Ativo"
    );

    assert.equal(params.get("alunoId"), "abc");
    assert.equal(params.get("returnTo"), "/alunos?busca=Ana");
    assert.equal(params.get("status"), "Ativo");
  });

  it("remove filtros vazios ou todos da URL", () => {
    const params = atualizarFiltroTreinosNaUrl(
      "?busca=Ana&objetivo=Hipertrofia",
      "objetivo",
      "todos"
    );

    assert.equal(params.get("busca"), "Ana");
    assert.equal(params.has("objetivo"), false);
  });

  it("limpa filtros sem apagar returnTo seguro", () => {
    const params = limparFiltrosTreinosDaUrl(
      "?alunoId=abc&busca=Ana&objetivo=Forca&nivel=Avancado&status=Ativo&returnTo=%2Falunos"
    );

    assert.equal(params.toString(), "returnTo=%2Falunos");
  });
});
