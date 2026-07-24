import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  EMPTY_CONTEXTUAL,
  EMPTY_FILTER,
  EMPTY_GENERAL,
  EMPTY_SEARCH,
  classifyAvaliacoesEmptyState,
  resolveContextStudentId,
  resolveInitialStudentId,
  sanitizeReturnTo,
  updateSearchParamsPreservingContext,
} from "./avaliacoesContext.js";

const aluno = {
  id: "11111111-1111-4111-8111-111111111111",
  nome: "Ana",
};
const outroAluno = {
  id: "22222222-2222-4222-8222-222222222222",
  nome: "Bruno",
};

describe("avaliacoesContext", () => {
  it("aceita /alunos", () => {
    assert.equal(sanitizeReturnTo("/alunos"), "/alunos");
  });

  it("aceita /alunos?busca=Ana", () => {
    assert.equal(sanitizeReturnTo("/alunos?busca=Ana"), "/alunos?busca=Ana");
  });

  it("rejeita https externo", () => {
    assert.equal(sanitizeReturnTo("https://dominio.com"), null);
  });

  it("rejeita URL protocol-relative", () => {
    assert.equal(sanitizeReturnTo("//dominio.com"), null);
  });

  it("rejeita javascript", () => {
    assert.equal(sanitizeReturnTo("javascript:alert(1)"), null);
  });

  it("rejeita valor sem barra inicial", () => {
    assert.equal(sanitizeReturnTo("alunos"), null);
  });

  it("preserva query string interna", () => {
    assert.equal(
      sanitizeReturnTo("/alunos?busca=Ana&status=Ativo"),
      "/alunos?busca=Ana&status=Ativo"
    );
  });

  it("aluno da edicao tem prioridade", () => {
    assert.equal(
      resolveInitialStudentId({
        editingStudentId: outroAluno.id,
        contextualStudentId: aluno.id,
        alunos: [aluno, outroAluno],
      }),
      outroAluno.id
    );
  });

  it("contexto valido e usado em criacao", () => {
    assert.equal(
      resolveInitialStudentId({
        contextualStudentId: aluno.id,
        alunos: [aluno],
      }),
      aluno.id
    );
  });

  it("contexto invalido resulta em vazio", () => {
    assert.equal(
      resolveContextStudentId({
        alunoIdParam: outroAluno.id,
        alunos: [aluno],
      }),
      ""
    );
  });

  it("criacao sem contexto resulta em vazio", () => {
    assert.equal(resolveInitialStudentId({ alunos: [aluno] }), "");
  });

  it("remocao de alunoId preserva returnTo", () => {
    const params = updateSearchParamsPreservingContext({
      currentParams: `alunoId=${aluno.id}&returnTo=${encodeURIComponent("/alunos?busca=Ana")}`,
      removals: ["alunoId"],
    });
    assert.equal(params.get("alunoId"), null);
    assert.equal(params.get("returnTo"), "/alunos?busca=Ana");
  });

  it("atualizacao da busca preserva alunoId", () => {
    const params = updateSearchParamsPreservingContext({
      currentParams: `alunoId=${aluno.id}&returnTo=${encodeURIComponent("/alunos")}`,
      updates: { busca: "Maria" },
    });
    assert.equal(params.get("alunoId"), aluno.id);
    assert.equal(params.get("busca"), "Maria");
    assert.equal(params.get("returnTo"), "/alunos");
  });

  it("vazio geral e classificado corretamente", () => {
    assert.equal(
      classifyAvaliacoesEmptyState({ totalRecords: 0, filteredRecords: 0 }),
      EMPTY_GENERAL
    );
  });

  it("vazio contextual e classificado corretamente", () => {
    assert.equal(
      classifyAvaliacoesEmptyState({
        totalRecords: 2,
        filteredRecords: 0,
        contextualStudent: aluno,
      }),
      EMPTY_CONTEXTUAL
    );
  });

  it("vazio de busca e classificado corretamente", () => {
    assert.equal(
      classifyAvaliacoesEmptyState({
        totalRecords: 2,
        filteredRecords: 0,
        searchTerm: "zzz",
      }),
      EMPTY_SEARCH
    );
  });

  it("vazio de filtro e classificado corretamente", () => {
    assert.equal(
      classifyAvaliacoesEmptyState({
        totalRecords: 2,
        filteredRecords: 0,
        hasStudentFilter: true,
      }),
      EMPTY_FILTER
    );
  });
});
