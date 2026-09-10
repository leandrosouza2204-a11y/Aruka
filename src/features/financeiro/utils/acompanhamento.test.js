import assert from "node:assert/strict";
import { test } from "node:test";
import {
  acompanhamentoEstaEncerrado,
  acompanhamentoEstaOperacional,
  calcularSituacaoAcompanhamento,
} from "./acompanhamento.js";

test("separa vencimento pendente de encerramento explicito", () => {
  const hoje = new Date("2026-09-10T12:00:00");
  const vencido = { acompanhamentoStatus: "ativo", vencimento: "2026-09-01" };
  const naoRenovado = { acompanhamentoStatus: "nao_renovado", vencimento: "2026-09-01" };

  assert.equal(acompanhamentoEstaOperacional(vencido), true);
  assert.equal(calcularSituacaoAcompanhamento(vencido, hoje).grupo, "em_acompanhamento");
  assert.equal(acompanhamentoEstaEncerrado(naoRenovado), true);
  assert.equal(calcularSituacaoAcompanhamento(naoRenovado, hoje).grupo, "encerrados");
});

test("reativacao devolve o aluno ao contexto operacional", () => {
  assert.equal(acompanhamentoEstaOperacional({ acompanhamentoStatus: "encerrado" }), false);
  assert.equal(acompanhamentoEstaOperacional({ acompanhamentoStatus: "ativo" }), true);
});
