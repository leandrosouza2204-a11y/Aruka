import fs from "node:fs";

const page = fs.readFileSync("src/features/dashboard/components/DashboardPage.jsx", "utf8");
const component = fs.readFileSync("src/features/dashboard/components/DashboardSmartManagement.jsx", "utf8");
const service = fs.readFileSync("src/services/smartManagementService.js", "utf8");

const checks = [
  [page.includes("DashboardSmartManagement"), "dashboard card integration"],
  [component.includes("Gestão Inteligente"), "identified card title"],
  [component.includes('to="/gestao-inteligente"'), "primary CTA route"],
  [component.includes("Configurar agora") && component.includes("Acessar Gestão Inteligente"), "specific CTAs"],
  [component.includes("getSmartManagementDashboardSummary"), "real summary source"],
  [service.includes('getSmartManagementDashboardSummary') && service.includes('eq("status", "active")'), "active filtering"],
  [service.includes('eq("professional_id", user.id)'), "ownership filter"],
  [!component.includes("calculateProfitability"), "no profitability calculation"],
  [!component.match(/melhor local|ranking|score|recomendação automática/i), "no invented recommendation"],
  [!component.match(/financeiro|faturamento|inadimplência|cobrança/i), "finance separation"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`SMART_MANAGEMENT_DASHBOARD_INTEGRATION_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("SMART_MANAGEMENT_DASHBOARD_INTEGRATION_VALIDATED");
