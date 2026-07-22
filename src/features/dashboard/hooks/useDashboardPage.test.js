import assert from "node:assert/strict";
import test from "node:test";
import {
  gerarResumoReceitaMensal,
  montarAlertasConsultoria,
  montarSinaisFitness,
} from "../utils/dashboardInsights.js";

test("montarAlertasConsultoria usa destinos com filtros reais", () => {
  const alertas = montarAlertasConsultoria({
    alunosVencidos: 2,
    alunosVencendo: 1,
    receitaPendente: 300,
  });

  assert.deepEqual(
    alertas.map((alerta) => alerta.acao.to),
    ["/alunos?status=Vencido", "/alunos?status=Vencendo", "/financeiro?pagamento=pendentes"]
  );
});

test("gerarResumoReceitaMensal cria alternativa textual completa", () => {
  const resumo = gerarResumoReceitaMensal([
    { chave: "2026-02", rotulo: "fev 26", total: 0 },
    { chave: "2026-03", rotulo: "mar 26", total: 250 },
    { chave: "2026-04", rotulo: "abr 26", total: 100 },
  ]);

  assert.equal(resumo.periodo, "fev 26 a abr 26");
  assert.equal(resumo.total, 350);
  assert.equal(resumo.melhorMes.rotulo, "mar 26");
  assert.equal(resumo.mesesSemReceita, 1);
  assert.equal(resumo.linhas.length, 3);
  assert.match(resumo.linhas[1].valorFormatado, /250/);
});

test("montarSinaisFitness ignora alunos vencidos e calcula sinais operacionais", () => {
  const sinais = montarSinaisFitness({
    alunos: [
      { id: "aluno-1" },
      { id: "aluno-2" },
      { id: "aluno-3" },
    ],
    statusPorAluno: new Map([
      ["aluno-1", "Ativo"],
      ["aluno-2", "Vencido"],
      ["aluno-3", "Ativo"],
    ]),
    treinos: [
      { alunoId: "aluno-1", status: "Ativo", dataRevisao: "2020-01-01" },
      { alunoId: "aluno-2", status: "Ativo", dataRevisao: "2020-01-01" },
    ],
    avaliacoes: [{ alunoId: "aluno-1" }],
  });

  assert.equal(sinais.find((sinal) => sinal.titulo === "Sem treino ativo").valor, 1);
  assert.equal(sinais.find((sinal) => sinal.titulo === "Treinos a revisar").valor, 2);
  assert.equal(sinais.find((sinal) => sinal.titulo === "Sem avaliacao").valor, 1);
});
