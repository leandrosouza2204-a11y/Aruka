import fs from "node:fs";

const css = fs.readFileSync("src/index.css", "utf8");
const viteConfig = fs.readFileSync("vite.config.js", "utf8");
const pwaManager = fs.readFileSync("src/features/pwa/PwaExperienceManager.jsx", "utf8");
const dashboard = fs.readFileSync("src/features/dashboard/components/DashboardSmartManagement.jsx", "utf8");

const checks = [
  [css.includes("@media (max-width: 900px)") && css.includes(".smart-management-scenario-grid { grid-template-columns: minmax(0, 1fr); }"), "scenario cards collapse before mobile"],
  [css.includes(".smart-management-comparison-list { grid-template-columns: minmax(0, 1fr); }"), "comparison summary collapses before mobile"],
  [css.includes(".smart-management-location-selector > div { grid-template-columns: minmax(0, 1fr); }"), "location selection is touch-friendly"],
  [css.includes("padding-bottom: calc(110px + env(safe-area-inset-bottom, 0px))"), "safe area padding"],
  [css.includes("min-height: 44px"), "touch target baseline"],
  [viteConfig.includes('display: "standalone"') && viteConfig.includes("runtimeCaching: []"), "standalone PWA with no authenticated runtime cache"],
  [pwaManager.includes("useRegisterSW") && pwaManager.includes("updateServiceWorker(true)"), "controlled service-worker updates"],
  [pwaManager.includes("isStandaloneMode") && pwaManager.includes("getInstallPlatform"), "standalone and install detection"],
  [dashboard.includes("getSmartManagementDashboardSummary") && dashboard.includes('to="/gestao-inteligente"'), "dashboard integration remains factual and internal"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`SMART_MANAGEMENT_MOBILE_PWA_STABILIZATION_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("SMART_MANAGEMENT_MOBILE_PWA_STABILIZATION_VALIDATED");
