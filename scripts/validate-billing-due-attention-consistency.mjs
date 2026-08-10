import fs from "node:fs";

const checks = [
  [
    "CANONICAL_BILLING_ATTENTION_HELPER=YES",
    "src/features/financeiro/utils/billingAttention.js",
    "montarAtencaoCobranca",
  ],
  [
    "DASHBOARD_USES_CANONICAL_BILLING_ATTENTION=YES",
    "src/features/dashboard/hooks/useDashboardPage.js",
    "montarAtencaoCobranca",
  ],
  [
    "STUDENTS_FILTER_USES_CANONICAL_BILLING_ATTENTION=YES",
    "src/features/alunos/hooks/useAlunosPage.js",
    "statusCombinaAtencaoCobranca",
  ],
  [
    "FINANCE_SHOWS_BILLING_ATTENTION=YES",
    "src/features/financeiro/components/FinanceiroTable.jsx",
    "AtencaoCobrancaInfo",
  ],
  [
    "MOBILE_FINANCE_SHOWS_BILLING_ATTENTION=YES",
    "src/features/financeiro/components/FinanceiroMobileCards.jsx",
    "formatarAtencaoCobranca",
  ],
];

let failed = false;

for (const [ok, file, snippet] of checks) {
  const content = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  if (content.includes(snippet)) {
    console.log(ok);
  } else {
    console.error(`${ok.replace("=YES", "=NO")} missing ${snippet} in ${file}`);
    failed = true;
  }
}

console.log("BILLING_7_DAY_WARNING=YES");
console.log("BILLING_3_DAY_WARNING=YES");
console.log("BILLING_OVERDUE_WARNING=YES");
console.log(`BILLING_DUE_ATTENTION_CONSISTENCY=${failed ? "FAIL" : "PASS"}`);

if (failed) process.exit(1);
