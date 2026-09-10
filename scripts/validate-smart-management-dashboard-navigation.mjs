import fs from "node:fs";

const component = fs.readFileSync("src/features/dashboard/components/DashboardSmartManagement.jsx", "utf8");
const app = fs.readFileSync("src/App.jsx", "utf8");
const checks = [
  [component.includes('to="/gestao-inteligente"'), "dashboard CTA"],
  [app.includes('path="/gestao-inteligente"'), "protected destination route"],
  [!component.includes("window.open") && !component.includes("wa.me"), "internal navigation only"],
];
const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`SMART_MANAGEMENT_DASHBOARD_NAVIGATION_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}
console.log("SMART_MANAGEMENT_DASHBOARD_NAVIGATION_VALIDATED");
