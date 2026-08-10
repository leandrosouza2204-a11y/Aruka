import fs from "node:fs";

const files = {
  pagamentos: fs.readFileSync("src/services/pagamentosService.js", "utf8"),
  financeiro: fs.readFileSync("src/features/financeiro/hooks/useFinanceiroPage.js", "utf8"),
  relatorio: fs.readFileSync("src/features/financeiro/components/modals/RelatorioAlunoModal.jsx", "utf8"),
};

const checks = [
  [
    "TENURE_DERIVES_ORIGINAL_CONSULTANCY_START=YES",
    files.pagamentos.includes("obterInicioConsultoria") &&
      files.pagamentos.includes("vencimentoAnterior") &&
      files.pagamentos.includes("vencimentoParcela"),
  ],
  [
    "CURRENT_CONTRACT_START_VISIBLE=YES",
    files.pagamentos.includes("dataInicioContratoAtual") &&
      files.relatorio.includes("Contrato atual"),
  ],
  [
    "RENEWAL_DOES_NOT_REUSE_INSTALLMENT_DUE_DATE_FOR_CONTRACT_START=YES",
    !files.financeiro.includes("dataInicioContrato") &&
      !files.pagamentos.includes("dadosPagamento.dataInicioContrato"),
  ],
  [
    "FUTURE_DUE_DATE_EXCLUDED_FROM_TENURE=YES",
    files.pagamentos.includes("data && data <= hoje"),
  ],
];

let failed = false;

for (const [label, pass] of checks) {
  console.log(label.replace("=YES", pass ? "=YES" : "=NO"));
  if (!pass) failed = true;
}

console.log(`STUDENT_TENURE_RENEWAL_HISTORY=${failed ? "FAIL" : "PASS"}`);

if (failed) process.exit(1);
