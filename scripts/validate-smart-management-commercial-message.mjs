import fs from "node:fs";

const generator = fs.readFileSync("src/features/gestaoInteligente/utils/commercialPresentation.js", "utf8");
const tests = fs.readFileSync("src/features/gestaoInteligente/utils/commercialPresentation.test.js", "utf8");

const forbidden = ["innerHTML", "dangerouslySetInnerHTML", "JSON.stringify", "rentabilidade", "repasse", "receita líquida", "owner_id", "professional_id"];
const checks = [
  [generator.includes("Olá! Tudo bem?"), "intro"],
  [generator.includes("Se alguma opção fizer sentido"), "closing"],
  [generator.includes("PER_SESSION"), "PER_SESSION"],
  [generator.includes("PER_STUDENT_SESSION"), "PER_STUDENT_SESSION"],
  [generator.includes("MONTHLY_PACKAGE") || generator.includes("/mês"), "MONTHLY_PACKAGE"],
  [generator.includes("FIXED_PACKAGE"), "FIXED_PACKAGE"],
  [generator.includes("Sessões de"), "duration"],
  [generator.includes("treinos por semana"), "frequency"],
  [generator.includes("formatCommercialCapacity"), "capacity"],
  [generator.includes("description"), "description"],
  [forbidden.every((token) => !generator.includes(token)), "no internal data in generator"],
  [tests.includes("não vaza dados internos"), "privacy test"],
  [tests.includes("plain text amigável para WhatsApp"), "whatsapp-friendly test"],
];

const missing = checks.filter(([ok]) => !ok).map(([, label]) => label);
if (missing.length) {
  console.error(`COMMERCIAL_MESSAGE_VALIDATION_FAILED: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("COMMERCIAL_MESSAGE_VALIDATED");
