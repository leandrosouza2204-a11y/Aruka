import { readFileSync } from "node:fs";

const panel = readFileSync("src/features/gestaoInteligente/components/ProfitabilityPanel.jsx", "utf8");
for (const expected of ["<label>Serviço", "<label>Local", "<label>Quantidade de alunos", "role=\"status\"", "role=\"alert\"", "aria-live=\"polite\"", "onClick={loadInputs}"]) {
  if (!panel.includes(expected)) throw new Error(`Missing profitability accessibility contract: ${expected}`);
}
console.log("SMART_MANAGEMENT_PROFITABILITY_ACCESSIBILITY=PASS");
