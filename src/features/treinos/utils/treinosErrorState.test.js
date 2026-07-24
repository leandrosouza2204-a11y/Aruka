import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { criarErroTreinos, normalizarMensagemErro } from "./treinosErrorState.js";

describe("treinosErrorState", () => {
  it("cria erro recuperavel para falha de carga", () => {
    const erro = criarErroTreinos("load", new Error("Falha controlada LOCAL_QA"));

    assert.equal(erro.title, "Nao foi possivel carregar os treinos.");
    assert.equal(erro.retryable, true);
    assert.match(erro.description, /QA/);
  });

  it("nao expoe detalhes tecnicos desconhecidos", () => {
    const erro = criarErroTreinos("delete", new Error("relation treino_dias violates policy"));

    assert.equal(erro.title, "O treino nao foi excluido.");
    assert.equal(erro.description, "Tente novamente em instantes.");
    assert.equal(erro.retryable, false);
  });

  it("traduz falha de sessao", () => {
    assert.equal(
      normalizarMensagemErro(new Error("JWT expired")),
      "Sua sessao pode ter expirado. Entre novamente e tente de novo."
    );
  });

  it("traduz falha de rede", () => {
    assert.equal(
      normalizarMensagemErro(new Error("Failed to fetch")),
      "Verifique sua conexao e tente novamente."
    );
  });
});
