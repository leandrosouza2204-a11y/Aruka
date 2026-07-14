import { RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { contentWithoutCode, lineOfText, modelFinding, normalizeText } from "./rule-utils.mjs";

const RULE_ID = "aqa-006";
const PROHIBITED_TERMS = Object.freeze([
  "treino insano",
  "destruir musculos",
  "explosao muscular",
  "resultado garantido",
  "falha obrigatoria",
  "melhor treino",
  "monstro",
  "aniquilar",
  "explodir peitoral",
]);

export default {
  id: RULE_ID,
  name: "AQA-006 Terminologia",
  description: "Detecta termos inadequados e linguagem promocional fora do padrao tecnico.",
  severity: SEVERITIES.WARNING,
  scope: RULE_SCOPES.DOCUMENT,
  enabled: true,
  tags: ["terminology", "language"],
  async run(context) {
    const findings = [];

    for (const document of context.documents) {
      const text = contentWithoutCode(document);
      const normalized = normalizeText(text);
      for (const term of PROHIBITED_TERMS) {
        if (normalized.includes(normalizeText(term))) {
          findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, `Termo inadequado encontrado: ${term}.`, {
            line: lineOfText(document, term),
            excerpt: term,
            suggestion: "Substituir por linguagem tecnica, precisa e verificavel.",
          }));
        }
      }
    }

    return findings;
  },
};
