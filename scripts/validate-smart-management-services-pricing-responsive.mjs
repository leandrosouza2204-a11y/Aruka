import { readFileSync } from "node:fs";

const css = readFileSync("src/index.css", "utf8");
const page = readFileSync("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx", "utf8");

for (const expected of ["@media (max-width: 900px)", "@media (max-width: 560px)", "min-height: 44px", "smart-management-form-grid", "grid-template-columns: minmax(0, 1fr)", "smart-management-area-tabs"]) {
  if (!css.includes(expected)) throw new Error(`Missing responsive contract: ${expected}`);
}
for (const expected of ["aria-label=\"Áreas da Gestão Inteligente\"", "aria-label=\"Tabela de preços\"", "role=\"tablist\"", "role=\"status\"", "role=\"alert\""]) {
  if (!page.includes(expected)) throw new Error(`Missing accessibility/responsive state: ${expected}`);
}

console.log("SMART_MANAGEMENT_SERVICES_PRICING_RESPONSIVE=PASS");
