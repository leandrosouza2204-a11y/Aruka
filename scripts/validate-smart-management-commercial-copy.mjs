import fs from "node:fs";

const component = fs.readFileSync("src/features/gestaoInteligente/components/CommercialPresentationPanel.jsx", "utf8");
const clipboard = fs.readFileSync("src/utils/clipboard.js", "utf8");

const checks = [
  [clipboard.includes("navigator.clipboard.writeText"), "Clipboard API writeText"],
  [clipboard.includes("document.execCommand(\"copy\")"), "fallback copy command"],
  [clipboard.includes("textarea.select()"), "programmatic selection fallback"],
  [component.includes("Mensagem copiada!"), "success feedback"],
  [component.includes("Não foi possível copiar a mensagem. Tente novamente."), "error feedback"],
  [component.includes("disabled={!canCopy}"), "copy disabled when invalid"],
  [!component.includes("Enviar WhatsApp") && !component.includes("wa.me") && !component.includes("window.open"), "no direct WhatsApp send"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`COMMERCIAL_COPY_VALIDATION_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("COMMERCIAL_COPY_VALIDATED");
