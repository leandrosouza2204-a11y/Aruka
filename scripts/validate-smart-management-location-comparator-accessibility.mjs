import fs from "node:fs";

const component = fs.readFileSync("src/features/gestaoInteligente/components/LocationComparatorPanel.jsx", "utf8");
const foundation = fs.readFileSync("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx", "utf8");
const mojibake = [String.fromCharCode(0xc3, 0x83), String.fromCharCode(0xc3, 0x82), String.fromCharCode(0xfffd)];
const requiredCopy = ["Gestão Inteligente", "Comparador de Locais", "Serviço", "Quantidade de alunos", "Locais", "Comparação", "Receita bruta", "Repasse", "Receita após repasse", "Valor por hora", "Valor por aluno", "Duração", "Maior valor por hora", "Menor repasse"];
const forbiddenCopy = ["Melhor academia", "Academia recomendada", "Trabalhe aqui", "Recuse alunos", "Vale mais a pena", "Troque de academia", "Aceite este aluno", "Recuse este aluno"];

const checks = [
  [foundation.includes("role=\"tablist\"") && foundation.includes("role=\"tab\""), "tab semantics"],
  [component.includes("aria-labelledby=\"location-comparator-title\""), "comparator labelled region"],
  [component.includes("<fieldset") && component.includes("<legend>Locais</legend>"), "location fieldset"],
  [component.includes("role=\"status\""), "loading status"],
  [component.includes("role=\"alert\""), "error states"],
  [component.includes("aria-hidden=\"true\""), "decorative icons hidden"],
  [requiredCopy.every((copy) => component.includes(copy) || foundation.includes(copy)), "required PT-BR copy"],
  [mojibake.every((token) => !component.includes(token) && !foundation.includes(token)), "no mojibake in touched 11.6 surface"],
  [forbiddenCopy.every((copy) => !component.includes(copy)), "no automatic recommendation copy"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`LOCATION_COMPARATOR_ACCESSIBILITY_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("LOCATION_COMPARATOR_ACCESSIBILITY_VALIDATED");
