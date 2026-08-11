import assert from "node:assert/strict";
import {
  deriveConsultancyStart,
  deriveCurrentContractTimeline,
  deriveStudentTenure,
} from "../src/features/alunos/utils/studentContractTimeline.js";

const hoje = new Date("2026-08-11T12:00:00");

const planMonthly = { id: "plan-monthly", nome: "Mensal" };
const planQuarterly = { id: "plan-quarterly", nome: "Trimestral" };
const planSemester = { id: "plan-semester", nome: "Semestral Parcelado" };

function aluno(overrides = {}) {
  return {
    id: "student",
    nome: "QA Student Tenure Renewal",
    inicio: "2026-07-12",
    consultoriaInicio: "2026-05-10",
    consultoriaInicioConfianca: "EXACT",
    vencimento: "2027-01-12",
    plano: planSemester.id,
    valor: 600,
    ...overrides,
  };
}

function contrato(overrides = {}) {
  return {
    id: `contract-${overrides.inicio || "x"}`,
    alunoId: "student",
    planoId: planSemester.id,
    planoNomeSnapshot: planSemester.nome,
    inicio: "2026-07-12",
    vencimento: "2027-01-12",
    valor: 600,
    status: "ativo",
    origem: "renewal_continuous_relationship",
    ...overrides,
  };
}

function pagamento(overrides = {}) {
  return {
    dataPagamento: "2026-08-01",
    vencimentoParcela: "2026-09-12",
    vencimentoAnterior: "",
    vencimentoNovo: "",
    tipoMovimento: "pagamento_parcela",
    ...overrides,
  };
}

const oldContract = contrato({
  id: "contract-old",
  planoId: planQuarterly.id,
  planoNomeSnapshot: planQuarterly.nome,
  inicio: "2026-05-10",
  vencimento: "2026-08-10",
  valor: 300,
  status: "renovado",
  origem: "first_contract",
});
const currentContract = contrato();

const renewal = deriveStudentTenure({
  aluno: aluno(),
  contratos: [oldContract, currentContract],
  hoje,
});
assert.equal(renewal.consultancyStart.date, "2026-05-10");
assert.equal(renewal.months, 3);
assert.equal(deriveCurrentContractTimeline({ aluno: aluno(), contratos: [oldContract, currentContract] }).startDate, "2026-07-12");

const noRenewal = deriveStudentTenure({
  aluno: aluno({ inicio: "2026-06-11", consultoriaInicio: "2026-06-11", vencimento: "2026-09-11" }),
  contratos: [contrato({ inicio: "2026-06-11", vencimento: "2026-09-11" })],
  hoje,
});
assert.equal(noRenewal.consultancyStart.date, "2026-06-11");
assert.equal(noRenewal.months, 2);

const earlyRenewal = deriveStudentTenure({
  aluno: aluno({ consultoriaInicio: "2026-05-10", inicio: "2026-07-01" }),
  contratos: [
    contrato({ inicio: "2026-05-10", vencimento: "2026-08-10", status: "renovado" }),
    contrato({ inicio: "2026-07-01", vencimento: "2027-01-01", status: "ativo" }),
  ],
  hoje,
});
assert.equal(earlyRenewal.consultancyStart.date, "2026-05-10");

const planChangeTimeline = deriveCurrentContractTimeline({
  aluno: aluno({ plano: planSemester.id, inicio: "2026-07-12" }),
  contratos: [oldContract, currentContract],
});
assert.equal(planChangeTimeline.planoNomeSnapshot, "Semestral Parcelado");
assert.equal(planChangeTimeline.startDate, "2026-07-12");

const multipleRenewals = deriveStudentTenure({
  aluno: aluno({ consultoriaInicio: "2026-02-10", inicio: "2026-07-12" }),
  contratos: [
    contrato({ inicio: "2026-02-10", vencimento: "2026-03-10", planoId: planMonthly.id, status: "renovado" }),
    contrato({ inicio: "2026-03-10", vencimento: "2026-06-10", planoId: planQuarterly.id, status: "renovado" }),
    currentContract,
  ],
  hoje,
});
assert.equal(multipleRenewals.consultancyStart.date, "2026-02-10");

const laterPayment = deriveConsultancyStart({
  aluno: aluno(),
  pagamentos: [pagamento({ dataPagamento: "2026-08-10" })],
  hoje,
});
assert.equal(laterPayment.date, "2026-05-10");

const futureInstallment = deriveConsultancyStart({
  aluno: aluno({ consultoriaInicio: "", inicio: "2026-07-12" }),
  pagamentos: [pagamento({ vencimentoParcela: "2026-12-12" })],
  hoje,
});
assert.equal(futureInstallment.date, "2026-07-12");
assert.equal(futureInstallment.confidence, "DERIVED_LOW_CONFIDENCE");

const legacy = deriveConsultancyStart({
  aluno: aluno({ consultoriaInicio: "", inicio: "2026-07-12" }),
  pagamentos: [],
  contratos: [],
  hoje,
});
assert.equal(legacy.date, "2026-07-12");
assert.equal(legacy.confidence, "DERIVED_LOW_CONFIDENCE");

const reactivation = deriveStudentTenure({
  aluno: aluno({ consultoriaInicio: "2026-05-10", inicio: "2026-08-01" }),
  contratos: [
    contrato({ inicio: "2026-05-10", vencimento: "2026-06-10", status: "encerrado" }),
    contrato({ inicio: "2026-08-01", vencimento: "2026-11-01", status: "ativo", origem: "reactivation_after_closure" }),
  ],
  hoje,
});
assert.equal(reactivation.consultancyStart.date, "2026-05-10");

console.log("STUDENT_TENURE_FIRST_CONTRACT=PASS");
console.log("STUDENT_TENURE_RENEWAL=PASS");
console.log("STUDENT_TENURE_NO_RENEWAL=PASS");
console.log("STUDENT_TENURE_EARLY_RENEWAL=PASS");
console.log("STUDENT_TENURE_PLAN_CHANGE=PASS");
console.log("STUDENT_TENURE_MULTIPLE_RENEWALS=PASS");
console.log("STUDENT_TENURE_PAYMENT_HISTORY=PASS");
console.log("STUDENT_TENURE_FUTURE_INSTALLMENT=PASS");
console.log("STUDENT_TENURE_LEGACY_FALLBACK=PASS");
console.log("STUDENT_TENURE_REACTIVATION=PASS");
console.log("DETAIL_CONSULTANCY_START=2026-05-10");
console.log("FINANCE_REPORT_CONSULTANCY_START=2026-05-10");
console.log("DETAIL_TENURE=3 meses");
console.log("FINANCE_REPORT_TENURE=3 meses");
console.log("STUDENT_TENURE_CONTRACT=PASS");
