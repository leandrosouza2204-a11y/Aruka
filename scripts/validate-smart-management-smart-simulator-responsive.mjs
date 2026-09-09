import fs from "node:fs";

const css = fs.readFileSync("src/index.css", "utf8");
const checks = [
  [css.includes(".smart-management-scenario-grid"), "scenario grid styles"],
  [css.includes("@media (max-width: 900px)") && css.includes(".smart-management-scenario-grid { grid-template-columns: minmax(0, 1fr); }"), "mobile single-column scenarios"],
  [css.includes(".smart-management-comparison-list { grid-template-columns: minmax(0, 1fr); }"), "mobile comparison summary"],
  [css.includes("min-height: 44px"), "touch target baseline"],
  [css.includes("padding-bottom: calc(110px + env(safe-area-inset-bottom, 0px))"), "safe area preserved"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`SMART_SIMULATOR_RESPONSIVE_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("SMART_SIMULATOR_RESPONSIVE_VALIDATED");
