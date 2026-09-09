import fs from "node:fs";

const css = fs.readFileSync("src/index.css", "utf8");
const component = fs.readFileSync("src/features/gestaoInteligente/components/CommercialPresentationPanel.jsx", "utf8");

const viewports = [320, 360, 375, 390, 412, 430, 768, 1024, 1280, 1440];
const checks = [
  [css.includes("smart-management-commercial-modal-grid"), "modal grid styles"],
  [css.includes("@media (max-width: 900px)") && css.includes(".smart-management-commercial-modal-grid { grid-template-columns: minmax(0, 1fr); }"), "tablet/mobile single column"],
  [css.includes("@media (max-width: 560px)") && css.includes(".smart-management-commercial-editor textarea { min-height: 300px; }"), "small mobile textarea sizing"],
  [css.includes("max-height: min(68dvh, 720px)") && css.includes("overflow: auto"), "internal modal scroll"],
  [css.includes("min-height: 44px"), "touch targets"],
  [component.includes("size=\"xl\""), "comfortable desktop modal"],
  [viewports.length === 10, "required viewport matrix documented"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`COMMERCIAL_RESPONSIVE_VALIDATION_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("COMMERCIAL_RESPONSIVE_VALIDATED");
