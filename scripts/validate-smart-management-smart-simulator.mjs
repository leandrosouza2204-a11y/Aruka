import fs from "node:fs";

const panel = fs.readFileSync("src/features/gestaoInteligente/components/ProfitabilityPanel.jsx", "utf8");
const comparison = fs.readFileSync("src/features/gestaoInteligente/utils/profitabilityComparison.js", "utf8");
const foundation = fs.readFileSync("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx", "utf8");

const required = [
  [panel.includes("MAX_SCENARIOS = 4"), "explicit maximum scenarios"],
  [panel.includes("useState([emptyScenario(1), emptyScenario(2)])"), "two initial scenarios"],
  [panel.includes("Duplicar cenário"), "duplicate scenario action"],
  [panel.includes("Remover cenário"), "remove scenario action"],
  [panel.includes("Limpar simulação"), "clear simulation action"],
  [panel.includes("calculateProfitability"), "11.4 profitability engine reused"],
  [panel.includes("compareProfitabilityScenarios"), "comparison layer consumed by UI"],
  [panel.includes("Receita após repasse negativa"), "negative net factual state"],
  [panel.includes("Duração não informada"), "null hourly state"],
  [foundation.includes(">Simulador</button>"), "internal simulator tab"],
  [comparison.includes("findWinners"), "pure winner comparison"],
  [comparison.includes("tie:"), "tie handling"],
];

const missing = required.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`SMART_SIMULATOR_VALIDATION_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("SMART_SIMULATOR_VALIDATED");
