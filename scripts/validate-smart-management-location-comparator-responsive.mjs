import fs from "node:fs";

const css = fs.readFileSync("src/index.css", "utf8");
const checks = [
  [css.includes(".smart-management-location-comparator"), "comparator styles"],
  [css.includes(".smart-management-location-selector > div"), "location selector grid"],
  [css.includes(".smart-management-location-selector > div { grid-template-columns: minmax(0, 1fr); }"), "mobile selector single column"],
  [css.includes(".smart-management-scenario-grid { grid-template-columns: minmax(0, 1fr); }"), "mobile result cards single column"],
  [css.includes("min-height: 44px"), "touch target baseline"],
  [css.includes("env(safe-area-inset-bottom"), "PWA safe area preserved"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`LOCATION_COMPARATOR_RESPONSIVE_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("LOCATION_COMPARATOR_RESPONSIVE_VALIDATED");
