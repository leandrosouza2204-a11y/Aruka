import { readFileSync } from "node:fs";

const css = readFileSync("src/index.css", "utf8");
const page = readFileSync("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx", "utf8");
for (const expected of ["safe-area-inset-bottom", "@media (max-width: 900px)", "@media (max-width: 560px)", "min-height: 44px", "grid-template-columns: minmax(0, 1fr)"]) if (!css.includes(expected)) throw new Error(`Responsive contract missing: ${expected}`);
for (const expected of ["smart-management-tier-row", "AccessibleModal"]) if (!page.includes(expected) && !css.includes(expected)) throw new Error(`Responsive UI contract missing: ${expected}`);
console.log("SMART_MANAGEMENT_RESPONSIVE=PASS");
