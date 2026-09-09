import fs from "node:fs";

const component = fs.readFileSync("src/features/gestaoInteligente/components/LocationComparatorPanel.jsx", "utf8");
const util = fs.readFileSync("src/features/gestaoInteligente/utils/locationComparator.js", "utf8");
const foundation = fs.readFileSync("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx", "utf8");

const checks = [
  [component.includes("Comparador de Locais"), "visible comparator title"],
  [component.includes("Fixe o mesmo atendimento"), "normalization copy"],
  [component.includes("MAX_LOCATION_COMPARISON_LOCATIONS"), "explicit location limit"],
  [component.includes("type=\"checkbox\""), "location selection"],
  [component.includes("Cadastre pelo menos dois locais para comparar."), "minimum locations empty state"],
  [component.includes("Duração") && component.includes("Quantidade de alunos"), "fixed inputs visible"],
  [component.includes("Maior valor por hora") && component.includes("Menor repasse"), "objective highlights"],
  [component.includes("Receita após repasse") && !component.includes("Lucro"), "operational revenue copy"],
  [util.includes("calculateProfitability"), "11.4 engine reuse"],
  [util.includes("compareProfitabilityScenarios"), "11.5 comparison reuse"],
  [util.includes("sameGrossRevenue"), "gross invariant"],
  [util.includes("status !== \"archived\""), "archived filtering"],
  [foundation.includes(">Comparador</button>"), "internal comparator tab"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`LOCATION_COMPARATOR_VALIDATION_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("LOCATION_COMPARATOR_VALIDATED");
