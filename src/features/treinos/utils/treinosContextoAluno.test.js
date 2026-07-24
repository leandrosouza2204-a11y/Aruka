import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  criarTreinoBaseContextual,
  removerAlunoIdDoContexto,
  resolverContextoAlunoTreinos,
} from "./treinosContextoAluno.js";

const aluno = {
  id: "11111111-1111-4111-8111-111111111111",
  nome: "Ana Teste",
};

describe("treinosContextoAluno", () => {
  it("resolve alunoId valido e returnTo seguro", () => {
    const contexto = resolverContextoAlunoTreinos({
      searchParams: new URLSearchParams(
        `alunoId=${aluno.id}&returnTo=${encodeURIComponent("/alunos?busca=Ana&status=Ativo")}`
      ),
      alunos: [aluno],
    });

    assert.equal(contexto.temContexto, true);
    assert.equal(contexto.aluno.id, aluno.id);
    assert.equal(contexto.returnTo, "/alunos?busca=Ana&status=Ativo");
  });

  it("nao seleciona aluno sem contexto", () => {
    const contexto = resolverContextoAlunoTreinos({
      searchParams: "",
      alunos: [aluno],
    });

    assert.equal(contexto.temContexto, false);
    assert.equal(contexto.aluno, null);
    assert.equal(contexto.alunoId, "");
  });

  it("marca alunoId malformado como invalido", () => {
    const contexto = resolverContextoAlunoTreinos({
      searchParams: "alunoId=javascript:alert(1)",
      alunos: [aluno],
    });

    assert.equal(contexto.temContexto, false);
    assert.equal(contexto.invalido, true);
    assert.equal(contexto.aluno, null);
  });

  it("marca aluno inexistente como invalido sem fallback", () => {
    const contexto = resolverContextoAlunoTreinos({
      searchParams: "alunoId=22222222-2222-4222-8222-222222222222",
      alunos: [aluno],
    });

    assert.equal(contexto.temContexto, false);
    assert.equal(contexto.invalido, true);
    assert.equal(contexto.aluno, null);
  });

  it("rejeita returnTo externo", () => {
    const contexto = resolverContextoAlunoTreinos({
      searchParams: `alunoId=${aluno.id}&returnTo=${encodeURIComponent("https://example.com/alunos")}`,
      alunos: [aluno],
    });

    assert.equal(contexto.returnTo, "");
  });

  it("preserva query params ao remover alunoId", () => {
    const params = removerAlunoIdDoContexto(
      `alunoId=${aluno.id}&returnTo=${encodeURIComponent("/alunos?busca=Ana")}&origem=qa`
    );

    assert.equal(params.get("alunoId"), null);
    assert.equal(params.get("returnTo"), "/alunos?busca=Ana");
    assert.equal(params.get("origem"), "qa");
  });

  it("cria base de treino apenas para aluno valido", () => {
    assert.deepEqual(criarTreinoBaseContextual(aluno), {
      alunoId: aluno.id,
      aluno: aluno.nome,
      nomeAluno: aluno.nome,
    });
    assert.equal(criarTreinoBaseContextual(null), null);
  });
});
