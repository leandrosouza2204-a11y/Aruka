import fs from "node:fs";

const component = fs.readFileSync("src/features/gestaoInteligente/components/CommercialPresentationPanel.jsx", "utf8");
const modal = fs.readFileSync("src/components/AccessibleModal.jsx", "utf8");
const mojibake = [String.fromCharCode(0xc3, 0x83), String.fromCharCode(0xc3, 0x82), String.fromCharCode(0xfffd)];
const generator = fs.readFileSync("src/features/gestaoInteligente/utils/commercialPresentation.js", "utf8");
const requiredCopy = ["Apresentação Comercial", "Serviços & Precificação", "Mensagem da apresentação", "Copiar mensagem", "Mensagem copiada!", "Sessões", "opções", "acompanhamento"];
const forbiddenCopy = ["Apresentacao", "Servicos", "Precificacao", "Sessao", "Duracao", "Frequencia", "Avaliacao", "Descricao"];

const checks = [
  [modal.includes("role={role}") && modal.includes("aria-modal=\"true\""), "dialog semantics from AccessibleModal"],
  [modal.includes("trapModalFocus") && modal.includes("previouslyFocusedRef"), "focus trap and restore"],
  [component.includes("initialFocusRef={textareaRef}"), "initial focus"],
  [component.includes("<fieldset") && component.includes("<legend>Selecionar serviços</legend>"), "service fieldset"],
  [component.includes("htmlFor=\"commercial-presentation-message\""), "textarea label"],
  [component.includes("role=\"status\""), "status feedback"],
  [component.includes("role=\"alert\""), "error feedback"],
  [component.includes("aria-hidden=\"true\""), "decorative icons hidden"],
  [requiredCopy.every((copy) => component.includes(copy) || generator.includes(copy)), "required PT-BR copy"],
  [forbiddenCopy.every((copy) => !component.includes(copy)), "no unaccented visible copy"],
  [mojibake.every((token) => !component.includes(token)), "no mojibake in 11.7 component"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`COMMERCIAL_ACCESSIBILITY_VALIDATION_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("COMMERCIAL_ACCESSIBILITY_VALIDATED");
