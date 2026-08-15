import { readFileSync } from "node:fs";

const table = read("src/features/financeiro/components/FinanceiroTable.jsx");
const mobile = read("src/features/financeiro/components/FinanceiroMobileCards.jsx");
const hook = read("src/features/financeiro/hooks/useFinanceiroPage.js");
const modals = read("src/features/financeiro/components/FinanceiroModals.jsx");
const paymentModal = read("src/features/financeiro/components/modals/PagamentoModal.jsx");
const service = read("src/services/pagamentosService.js");

const checks = [
  ["PAYMENT_MODAL_EXISTS", paymentModal.includes("function PagamentoModal")],
  ["PAYMENT_ACTION_IMPLEMENTATION_EXISTS", hook.includes("function abrirRegistroPagamento") && hook.includes("function registrarPagamento")],
  ["PAYMENT_ACTION_MENU_ENTRY_EXISTS", table.includes("Registrar pagamento") && mobile.includes("Registrar pagamento")],
  ["PAYMENT_ACTION_HANDLER_EXISTS", table.includes("onReceber(registro)") && mobile.includes("onReceber(registro)")],
  ["PAYMENT_MODAL_WIRED", modals.includes("modalPagamento") && modals.includes("onSave={page.registrarPagamento}")],
  ["PAYMENT_INSTALLMENT_VALUE_USES_CURRENT_INSTALLMENT", hook.includes("valor: registro.valorParcela.toFixed(2)")],
  ["PAYMENT_INSTALLMENT_NUMBER_USES_NEXT_INSTALLMENT", hook.includes("parcela: proximaParcela(registro)")],
  ["PAYMENT_INSTALLMENT_DUE_DATE_PRESERVED", hook.includes("vencimentoParcela: registro.vencimentoParcelaAtual")],
  ["PAYMENT_SERVICE_USES_CANONICAL_PAYMENT", service.includes("export async function registrarPagamento(")],
  ["PAYMENT_REGISTRATION_DOES_NOT_RENEW_CONTRACT", !extractFunction(hook, "registrarPagamento").includes("renovarAlunoContratoSupabase")],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${label}=${ok ? "YES" : "NO"}`);
  if (!ok) failed = true;
}

if (failed) {
  console.error("PAYMENT_REGISTRATION_RUNTIME=FAIL");
  process.exit(1);
}

console.log("PAYMENT_REGISTRATION_RUNTIME=PASS");

function read(path) {
  return readFileSync(path, "utf8");
}

function extractFunction(source, name) {
  const start = source.indexOf(`function ${name}`);
  if (start < 0) return "";
  const next = source.indexOf("\n  async function ", start + 1);
  const nextSync = source.indexOf("\n  function ", start + 1);
  const candidates = [next, nextSync].filter((index) => index > start);
  const end = candidates.length ? Math.min(...candidates) : source.length;
  return source.slice(start, end);
}
