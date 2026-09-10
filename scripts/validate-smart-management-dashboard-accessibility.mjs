import fs from "node:fs";

const component = fs.readFileSync("src/features/dashboard/components/DashboardSmartManagement.jsx", "utf8");
const mojibake = [String.fromCharCode(0xc3, 0x83), String.fromCharCode(0xc3, 0x82), String.fromCharCode(0xfffd)];
const checks = [
  [component.includes('aria-labelledby="dashboard-smart-management-title"'), "section label"],
  [component.includes('id="dashboard-smart-management-title"'), "heading id"],
  [component.includes('aria-label="Resumo de configuração"'), "summary label"],
  [component.includes('role="status"') && component.includes('aria-live="polite"'), "loading announcement"],
  [component.includes('role="alert"'), "error announcement"],
  [component.includes('aria-hidden="true"'), "decorative icons hidden"],
  [component.includes("Tentar novamente"), "working retry action"],
  [mojibake.every((token) => !component.includes(token)), "no mojibake"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`SMART_MANAGEMENT_DASHBOARD_ACCESSIBILITY_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("SMART_MANAGEMENT_DASHBOARD_ACCESSIBILITY_VALIDATED");
