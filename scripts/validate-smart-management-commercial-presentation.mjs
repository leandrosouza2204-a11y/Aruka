import fs from "node:fs";

const foundation = fs.readFileSync("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx", "utf8");
const component = fs.readFileSync("src/features/gestaoInteligente/components/CommercialPresentationPanel.jsx", "utf8");
const generator = fs.readFileSync("src/features/gestaoInteligente/utils/commercialPresentation.js", "utf8");

const checks = [
  [foundation.includes("CommercialPresentationPanel"), "internal commercial panel"],
  [foundation.includes(">Apresentação</button>"), "commercial tab"],
  [component.includes("listSmartManagementServices(\"active\")"), "active services source"],
  [component.includes("AccessibleModal"), "existing modal component"],
  [component.includes("Montar apresentação"), "clear presentation action"],
  [component.includes("type=\"checkbox\""), "service selection"],
  [component.includes("Você ainda não possui serviços ativos para apresentar."), "empty state"],
  [component.includes("Ir para Serviços & Precificação"), "empty CTA"],
  [component.includes("Atualizar mensagem"), "explicit regeneration"],
  [component.includes("Copiar mensagem"), "copy button"],
  [component.includes("copyTextToClipboard"), "clipboard helper"],
  [generator.includes("buildCommercialPresentation"), "pure generator"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`COMMERCIAL_PRESENTATION_VALIDATION_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("COMMERCIAL_PRESENTATION_VALIDATED");
