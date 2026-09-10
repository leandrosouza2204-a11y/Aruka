import fs from "node:fs";

const service = fs.readFileSync("src/services/smartManagementService.js", "utf8");
const summary = fs.readFileSync("src/features/gestaoInteligente/utils/dashboardSummary.js", "utf8");
const tests = fs.readFileSync("src/features/gestaoInteligente/utils/dashboardSummary.test.js", "utf8");

const checks = [
  [service.includes('select("id", { count: "exact", head: true })'), "minimal count query"],
  [service.includes('from("smart_management_locations")') && service.includes('from("smart_management_services")'), "real locations and services sources"],
  [service.includes('eq("professional_id", user.id)'), "ownership preserved"],
  [service.includes('eq("status", "active")'), "archived records excluded"],
  [summary.includes("EMPTY") && summary.includes("LOCATIONS_ONLY") && summary.includes("SERVICES_ONLY") && summary.includes("READY"), "all configuration states"],
  [tests.includes("configuração vazia") && tests.includes("apenas locais ativos") && tests.includes("apenas serviços ativos") && tests.includes("fica pronto"), "summary state tests"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`SMART_MANAGEMENT_DASHBOARD_SUMMARY_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("SMART_MANAGEMENT_DASHBOARD_SUMMARY_VALIDATED");
