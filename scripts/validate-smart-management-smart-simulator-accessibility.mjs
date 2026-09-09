import fs from "node:fs";

const panel = fs.readFileSync("src/features/gestaoInteligente/components/ProfitabilityPanel.jsx", "utf8");
const foundation = fs.readFileSync("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx", "utf8");
const visibleCopy = ["Gestão Inteligente", "Simulador Inteligente", "Cenário", "Comparação", "Receita bruta", "Repasse", "Receita após repasse", "Valor por hora", "Valor por aluno", "Quantidade de alunos", "Duração", "Serviço", "Local", "Maior valor por hora"];
const mojibake = [String.fromCharCode(0xc3, 0x83), String.fromCharCode(0xc3, 0x82), String.fromCharCode(0xfffd)];

const checks = [
  [foundation.includes("role=\"tablist\"") && foundation.includes("role=\"tab\""), "tab roles"],
  [panel.includes("aria-labelledby=\"profitability-title\""), "simulator labelled region"],
  [panel.includes("role=\"status\""), "loading status"],
  [panel.includes("role=\"alert\""), "error and invalid alerts"],
  [panel.includes("aria-live=\"polite\""), "calculation live region"],
  [panel.includes("aria-hidden=\"true\""), "decorative icons hidden"],
  [visibleCopy.every((copy) => panel.includes(copy) || foundation.includes(copy)), "required UTF-8 visible copy"],
  [mojibake.every((token) => !panel.includes(token) && !foundation.includes(token)), "no mojibake in 11.5 UI surface"],
  [!panel.includes("melhor opção") && !panel.includes("recomendada") && !panel.includes("você deve"), "no automatic recommendation copy"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`SMART_SIMULATOR_ACCESSIBILITY_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("SMART_SIMULATOR_ACCESSIBILITY_VALIDATED");
