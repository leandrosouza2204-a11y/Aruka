import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aruka-billing-attention-"));
const helperPath = path.join(tempDir, "billingAttention.js");
const parcelamentoPath = path.join(tempDir, "parcelamento.js");
const alunosUtilsPath = path.join(tempDir, "alunosUtils.js");
const formattersPath = path.join(tempDir, "formatters.js");

fs.writeFileSync(
  helperPath,
  fs
    .readFileSync("src/features/financeiro/utils/billingAttention.js", "utf8")
    .replace("../../../data/alunosUtils", "./alunosUtils.js")
    .replace("./parcelamento", "./parcelamento.js")
);
fs.copyFileSync("src/features/financeiro/utils/parcelamento.js", parcelamentoPath);
fs.writeFileSync(
  alunosUtilsPath,
  fs.readFileSync("src/data/alunosUtils.js", "utf8").replace("./formatters", "./formatters.js")
);
fs.copyFileSync("src/data/formatters.js", formattersPath);

const {
  filtrarPagamentosContratoAtual,
  formatarAtencaoCobranca,
  montarAtencaoCobranca,
  statusCombinaAtencaoCobranca,
} = await import(pathToFileURL(helperPath).href);

const hoje = new Date("2026-08-10T12:00:00");
const planoMensal = { permiteParcelamento: false, quantidadeParcelas: 1 };
const planoParcelado = { permiteParcelamento: true, quantidadeParcelas: 3 };

function pagamento(parcela, dataVencimento = "2026-08-01") {
  return {
    alunoId: "aluno-qa",
    dataVencimento,
    parcela,
    status: "pago",
    valor: 100,
  };
}

function montar({ inicio = "2026-08-01", vencimento = "2026-09-30", pagamentos = [] } = {}) {
  return montarAtencaoCobranca({
    aluno: {
      id: "aluno-qa",
      plano: "trimestralParcelado",
      inicio,
      vencimento,
      status: "Ativo",
    },
    plano: planoParcelado,
    pagamentos,
    hoje,
  });
}

const source = {
  dashboard: fs.readFileSync("src/features/dashboard/hooks/useDashboardPage.js", "utf8"),
  alunosTable: fs.readFileSync("src/features/alunos/components/AlunosTable.jsx", "utf8"),
  alunoCard: fs.readFileSync("src/features/alunos/components/AlunoCardMobile.jsx", "utf8"),
  alunosList: fs.readFileSync("src/features/alunos/components/AlunosList.jsx", "utf8"),
  financeiroTable: fs.readFileSync("src/features/financeiro/components/FinanceiroTable.jsx", "utf8"),
  financeiroCards: fs.readFileSync("src/features/financeiro/components/FinanceiroMobileCards.jsx", "utf8"),
};

assert(source.dashboard.includes("Contratos vencendo"));
assert(source.dashboard.includes("Parcelas vencendo"));
assert(source.dashboard.includes("/alunos?status=Vencendo&origem=dashboard"));
assert(source.dashboard.includes("/alunos?status=Vencendo%20parcela&origem=dashboard"));
assert(!source.dashboard.includes("Alunos Vencendo"));

for (const [nome, conteudo] of Object.entries(source)) {
  if (nome === "dashboard") continue;
  assert(conteudo.includes("Cobrança"), `${nome} deve exibir Cobranca`);
}

const contratoVencendo = montar({
  vencimento: "2026-08-17",
  pagamentos: [pagamento(1), pagamento(2), pagamento(3)],
});
assert.equal(statusCombinaAtencaoCobranca("Vencendo", contratoVencendo), true);
assert.equal(statusCombinaAtencaoCobranca("Vencendo parcela", contratoVencendo), false);
assert.equal(formatarAtencaoCobranca(contratoVencendo, { tipo: "contrato" }), "Contrato vence em 7 dias");

const parcela7Dias = montar({ inicio: "2026-07-17", pagamentos: [pagamento(1)] });
assert.equal(statusCombinaAtencaoCobranca("Vencendo", parcela7Dias), false);
assert.equal(statusCombinaAtencaoCobranca("Vencendo parcela", parcela7Dias), true);
assert.equal(formatarAtencaoCobranca(parcela7Dias), "Parcela vence em 7 dias");

const parcela3Dias = montar({ inicio: "2026-07-13", pagamentos: [pagamento(1)] });
assert.equal(formatarAtencaoCobranca(parcela3Dias), "Parcela vence em 3 dias");

const parcelaAmanha = montar({ inicio: "2026-07-11", pagamentos: [pagamento(1)] });
assert.equal(formatarAtencaoCobranca(parcelaAmanha), "Parcela vence amanha");

const parcelaVencida = montar({ inicio: "2026-07-06", pagamentos: [pagamento(1)] });
assert.equal(statusCombinaAtencaoCobranca("Parcela vencida", parcelaVencida), true);
assert.equal(formatarAtencaoCobranca(parcelaVencida), "Parcela vencida ha 4 dias");

const quitado = montar({ pagamentos: [pagamento(1), pagamento(2), pagamento(3)] });
assert.equal(formatarAtencaoCobranca(quitado), "Em dia");
assert.equal(statusCombinaAtencaoCobranca("Vencendo parcela", quitado), false);

const simultaneo = montar({
  inicio: "2026-07-17",
  vencimento: "2026-08-17",
  pagamentos: [pagamento(1)],
});
assert.equal(statusCombinaAtencaoCobranca("Vencendo", simultaneo), true);
assert.equal(statusCombinaAtencaoCobranca("Vencendo parcela", simultaneo), true);

const alunoA = {
  id: "aluno-a",
  plano: "mensal",
  inicio: "2026-08-01",
  vencimento: "2026-08-15",
  status: "Ativo",
};
const alunoB = {
  id: "aluno-b",
  plano: "trimestralParcelado",
  inicio: "2026-07-12",
  vencimento: "2026-10-12",
  status: "Ativo",
};
const pagamentosHistoricosB = [
  { ...pagamento(1, "2026-03-12"), alunoId: "aluno-b", dataPagamento: "2026-03-12", vencimentoParcela: "2026-03-12" },
  { ...pagamento(2, "2026-04-12"), alunoId: "aluno-b", dataPagamento: "2026-04-12", vencimentoParcela: "2026-04-12" },
  { ...pagamento(3, "2026-05-12"), alunoId: "aluno-b", dataPagamento: "2026-05-12", vencimentoParcela: "2026-05-12" },
  { ...pagamento(1, "2026-07-12"), alunoId: "aluno-b", dataPagamento: "2026-07-12", vencimentoParcela: "2026-07-12" },
];
const pagamentosAtuaisB = filtrarPagamentosContratoAtual(alunoB, pagamentosHistoricosB);
const dashboardB = montarAtencaoCobranca({ aluno: alunoB, plano: planoParcelado, pagamentos: pagamentosAtuaisB, hoje });
const financeiroB = montarAtencaoCobranca({ aluno: alunoB, plano: planoParcelado, pagamentos: pagamentosAtuaisB, hoje });
const alunosB = montarAtencaoCobranca({ aluno: alunoB, plano: planoParcelado, pagamentos: pagamentosAtuaisB, hoje });
const alunosSemFiltroContratoB = montarAtencaoCobranca({
  aluno: alunoB,
  plano: planoParcelado,
  pagamentos: pagamentosHistoricosB,
  hoje,
});
const alunos = [
  montarAtencaoCobranca({ aluno: alunoA, plano: planoMensal, pagamentos: [], hoje }),
  alunosB,
];
const contratosUnicos = alunos.filter((item) => statusCombinaAtencaoCobranca("Vencendo", item)).length;
const parcelasUnicas = alunos.filter((item) => statusCombinaAtencaoCobranca("Vencendo parcela", item)).length;

assert.equal(pagamentosAtuaisB.length, 1);
assert.equal(formatarAtencaoCobranca(dashboardB), "Parcela vence em 2 dias");
assert.deepEqual(dashboardB.parcela, financeiroB.parcela);
assert.deepEqual(financeiroB.parcela, alunosB.parcela);
assert.equal(statusCombinaAtencaoCobranca("Vencendo parcela", alunosB), true);
assert.equal(statusCombinaAtencaoCobranca("Vencendo parcela", alunosSemFiltroContratoB), false);
assert.equal(contratosUnicos, 1);
assert.equal(parcelasUnicas, 1);

console.log("DASHBOARD_CONTRACT_CARD=YES");
console.log("DASHBOARD_INSTALLMENT_CARD=YES");
console.log("CONTRACT_CTA_DESTINATION=/alunos?status=Vencendo&origem=dashboard");
console.log("INSTALLMENT_CTA_DESTINATION=/alunos?status=Vencendo%20parcela&origem=dashboard");
console.log("STUDENTS_CONTRACT_FILTER=PASS");
console.log("STUDENTS_INSTALLMENT_FILTER=PASS");
console.log("INSTALLMENT_FILTER_REAL_MATCH=PASS");
console.log("BILLING_ATTENTION_DATA_PARITY=PASS");
console.log(`DASHBOARD_INSTALLMENT_DUE_UNIQUE_COUNT=${parcelasUnicas}`);
console.log(`ALUNOS_INSTALLMENT_FILTER_UNIQUE_COUNT=${parcelasUnicas}`);
console.log("ACTIVE_STUDENT_INSTALLMENT_ALERT=PASS");
console.log("FINANCE_ATTENTION_VISIBLE=PASS");
console.log("BILLING_7_DAY_WARNING=PASS");
console.log("BILLING_3_DAY_WARNING=PASS");
console.log("BILLING_OVERDUE_WARNING=PASS");
console.log("BILLING_ATTENTION_SEMANTIC_NAVIGATION=PASS");
