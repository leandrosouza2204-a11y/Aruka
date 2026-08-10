import { readFile } from "node:fs/promises";

const hook = await readFile("src/features/financeiro/hooks/useFinanceiroPage.js", "utf8");
const pagamentoModal = await readFile("src/features/financeiro/components/modals/PagamentoModal.jsx", "utf8");
const encerramentoModal = await readFile("src/features/financeiro/components/modals/EncerrarAcompanhamentoModal.jsx", "utf8");
const modalBase = await readFile("src/features/financeiro/components/modals/ModalBase.jsx", "utf8");

const checks = [
  ["high risk undo payment has confirmation", /titulo: "Desfazer/.test(hook)],
  ["high risk reactivation has confirmation", /titulo: "Reativar aluno/.test(hook)],
  ["closure uses dedicated confirmation modal", /setModalEncerramento\(registro\)/.test(hook)],
  ["payment save blocks duplicate submit", /async function registrarPagamento\(\)[\s\S]*if \(atualizandoId\) return/.test(hook)],
  ["undo blocks duplicate submit", /async function desfazerPagamento\(registro\)[\s\S]*if \(atualizandoId\) return/.test(hook)],
  ["closure blocks duplicate submit", /async function confirmarEncerramentoAcompanhamento\(\)[\s\S]*if \(atualizandoId\) return/.test(hook)],
  ["reactivation blocks duplicate submit", /async function reativarAluno\(registro\)[\s\S]*if \(atualizandoId\) return/.test(hook)],
  ["payment primary button disabled pending", /disabled=\{atualizando\}/.test(pagamentoModal)],
  ["closure primary button disabled pending", /disabled=\{!podeConfirmar\}/.test(encerramentoModal)],
  ["finance modals reuse ModalBase", /AccessibleModal/.test(modalBase)],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed = true;
}

if (failed) process.exit(1);
