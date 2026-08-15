import { readFileSync } from "node:fs";

const css = read("src/index.css");
const modalBase = read("src/features/financeiro/components/modals/ModalBase.jsx");
const relatorio = read("src/features/financeiro/components/modals/RelatorioAlunoModal.jsx");
const historico = read("src/features/financeiro/components/modals/HistoricoFinanceiroModal.jsx");

const modalFiles = [
  "src/features/financeiro/components/modals/PagamentoModal.jsx",
  "src/features/financeiro/components/modals/RenovacaoPlanoModal.jsx",
  "src/features/financeiro/components/modals/RelatorioAlunoModal.jsx",
  "src/features/financeiro/components/modals/HistoricoFinanceiroModal.jsx",
  "src/features/financeiro/components/modals/RelatorioGeralModal.jsx",
  "src/features/financeiro/components/modals/EncerrarAcompanhamentoModal.jsx",
];

const checks = [
  ["MODAL_BASE_CHANGED", modalBase.includes("larguraPorTamanho") && modalBase.includes("--financeiro-modal-width")],
  ["MODAL_SIZING_CONTRACT", ["sm", "md", "lg", "xl", "content"].every((size) => modalBase.includes(`${size}:`))],
  ["RELATORIO_ALUNO_CONTENT_WIDTH", relatorio.includes('contentClassName="relatorio-aluno-modal"') && css.includes("grid-template-columns: repeat(3, minmax(0, 1fr))")],
  ["RELATORIO_ALUNO_MOBILE", css.includes("@media (max-width: 900px)") && css.includes("@media (max-width: 640px)")],
  ["HISTORICO_FINANCEIRO_TABLE_USES_AVAILABLE_WIDTH", historico.includes('contentClassName="historico-financeiro-modal"') && css.includes("width: max(100%, 1260px)")],
  ["HISTORICO_FINANCEIRO_INTERNAL_SCROLL", css.includes(".financeiro-history-table") && css.includes("overflow-x: auto")],
  ["DOCUMENT_HORIZONTAL_OVERFLOW", css.includes("overflow-x: clip")],
  ["MODAL_HEIGHT_CONTRACT", css.includes("max-height: calc(100dvh - 48px)") && css.includes("height: 100dvh")],
  ["FINANCIAL_MODALS_USE_SIZE_CONTRACT", modalFiles.every((path) => /<ModalBase[\s\S]*size=/.test(read(path)))],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${label}=${ok ? "PASS" : "FAIL"}`);
  if (!ok) failed = true;
}

console.log(`MODAL_AUDIT_COUNT=${modalFiles.length}`);

if (failed) {
  console.error("MODAL_LAYOUT_RUNTIME=FAIL");
  process.exit(1);
}

console.log("MODAL_LAYOUT_RUNTIME=PASS");

function read(path) {
  return readFileSync(path, "utf8");
}
