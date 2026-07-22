import assert from "node:assert/strict";
import test from "node:test";
import {
  montarIndicadorAvaliacao,
  montarIndicadorFinanceiro,
  montarIndicadorTreino,
} from "./alunosResumoOperacional.js";

test("indicador de treino diferencia ativo e vazio", () => {
  assert.equal(montarIndicadorTreino({ status: "success", data: [] }).estado, "Sem treino ativo");
  assert.equal(
    montarIndicadorTreino({ status: "success", data: [{ status: "Ativo", rotina: "Hipertrofia" }] }).estado,
    "Treino ativo"
  );
});

test("indicador de avaliacao diferencia ultima avaliacao e vazio", () => {
  assert.equal(montarIndicadorAvaliacao({ status: "success", data: [] }).estado, "Sem avaliacao");
  assert.match(
    montarIndicadorAvaliacao({ status: "success", data: [{ data: "2026-07-22" }] }).estado,
    /Ultima/
  );
});

test("indicador financeiro diferencia regular, vazio, erro e loading", () => {
  assert.equal(montarIndicadorFinanceiro({ status: "loading" }).estado, "Carregando...");
  assert.equal(montarIndicadorFinanceiro({ status: "error" }).estado, "Erro ao carregar");
  assert.equal(montarIndicadorFinanceiro({ status: "success", data: { quantidadePagamentos: 0 } }).estado, "Sem registros");
  assert.equal(
    montarIndicadorFinanceiro({
      status: "success",
      data: { quantidadePagamentos: 2, totalPago: 300, proximoVencimento: "2026-08-01", recorrenteEmDia: true },
    }).estado,
    "2 pagamento(s)"
  );
});
