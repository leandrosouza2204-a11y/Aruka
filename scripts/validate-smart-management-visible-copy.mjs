import { readFileSync } from "node:fs";

const files = [
  "src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx",
  "src/features/gestaoInteligente/utils/transferRules.js",
  "src/components/MobileBottomNavigation.jsx",
];
const source = files.map((file) => readFileSync(file, "utf8")).join("\n");
const required = ["Gestão Inteligente", "Locais de atendimento", "Configuração de repasse", "Observações", "Situação", "Arquivar", "Reativar", "Salvar alterações"];
for (const text of required) if (!source.includes(text)) throw new Error(`Missing canonical visible copy: ${text}`);
for (const marker of ["Ã", "�"]) if (source.includes(marker)) throw new Error(`Mojibake or replacement character found: ${marker}`);
if (!source.includes('"/gestao-inteligente"')) throw new Error("The internal route must remain ASCII-safe.");
console.log("SMART_MANAGEMENT_VISIBLE_COPY=PASS");
