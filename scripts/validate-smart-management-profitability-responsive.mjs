import { readFileSync } from "node:fs";

const css = readFileSync("src/index.css", "utf8");
for (const expected of ["smart-management-profitability-form", "smart-management-profitability-metrics", "@media (max-width: 900px)", "@media (max-width: 560px)", "grid-template-columns: minmax(0, 1fr)", "min-height: 44px"]) {
  if (!css.includes(expected)) throw new Error(`Missing profitability responsive contract: ${expected}`);
}
console.log("SMART_MANAGEMENT_PROFITABILITY_RESPONSIVE=PASS");
