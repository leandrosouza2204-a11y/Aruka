import assert from "node:assert/strict";
import test from "node:test";
import {
  montarReturnToAlunos,
  montarUrlContextualAluno,
  normalizarAlunoIdDaUrl,
  normalizarReturnToDaUrl,
} from "./alunosContextNavigation.js";

test("monta URLs contextuais com alunoId e returnTo preservando filtros", () => {
  const url = montarUrlContextualAluno(
    "treinos",
    "aluno-123",
    "busca=Ana&status=Ativo&origem=dashboard"
  );
  const parsed = new URL(`http://local.test${url}`);

  assert.equal(parsed.pathname, "/treinos");
  assert.equal(parsed.searchParams.get("alunoId"), "aluno-123");
  assert.equal(
    parsed.searchParams.get("returnTo"),
    "/alunos?busca=Ana&status=Ativo&origem=dashboard"
  );
});

test("monta URLs para avaliacoes e financeiro", () => {
  assert.match(montarUrlContextualAluno("avaliacoes", "id-1"), /^\/avaliacoes\?/);
  assert.match(montarUrlContextualAluno("financeiro", "id-1"), /^\/financeiro\?/);
});

test("retorna vazio quando alunoId ou destino sao invalidos", () => {
  assert.equal(montarUrlContextualAluno("treinos", ""), "");
  assert.equal(montarUrlContextualAluno("desconhecido", "id-1"), "");
});

test("preserva encoding e parametros desconhecidos sem dados sensiveis extras", () => {
  const returnTo = montarReturnToAlunos("busca=Jo%C3%A3o%20Souza&x=1");
  assert.equal(returnTo, "/alunos?busca=Jo%C3%A3o+Souza&x=1");
});

test("normaliza alunoId e returnTo seguros da URL", () => {
  assert.equal(normalizarAlunoIdDaUrl("alunoId=abc&returnTo=%2Falunos%3Fbusca%3DAna"), "abc");
  assert.equal(normalizarReturnToDaUrl("returnTo=%2Falunos%3Fbusca%3DAna"), "/alunos?busca=Ana");
  assert.equal(normalizarReturnToDaUrl("returnTo=https%3A%2F%2Fevil.test"), "");
});
