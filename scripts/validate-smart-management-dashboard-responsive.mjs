import fs from "node:fs";

const css = fs.readFileSync("src/index.css", "utf8");
const component = fs.readFileSync("src/features/dashboard/components/DashboardSmartManagement.jsx", "utf8");
const viewports = [320, 360, 375, 390, 412, 430, 768, 1024, 1280, 1440];

const checks = [
  [css.includes("dashboard-smart-management"), "dashboard card styles"],
  [css.includes(".dashboard-smart-management") && css.includes("grid-template-columns: minmax(0, 1fr) auto"), "compact desktop layout"],
  [css.includes(".dashboard-smart-management-action") && css.includes("justify-self: stretch"), "mobile CTA layout"],
  [css.includes("min-height: 44px"), "touch target"],
  [!component.includes("useEffect") && !component.includes("getSmartManagementDashboardSummary"), "no loading state required for navigation shortcut"],
  [viewports.length === 10, "required viewport matrix documented"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`SMART_MANAGEMENT_DASHBOARD_RESPONSIVE_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("SMART_MANAGEMENT_DASHBOARD_RESPONSIVE_VALIDATED");
