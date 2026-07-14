import { RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { containsMethod, contentWithoutCode, countOccurrences, modelFinding, normalizeText } from "./rule-utils.mjs";

const RULE_ID = "aqa-005";
const KNOWN_METHODS = Object.freeze(["Progressao Dupla", "Top Set", "Back-off", "Drop Set", "Rest Pause", "Superserie", "Biset", "Triset"]);

export default {
  id: RULE_ID,
  name: "AQA-005 Metodos",
  description: "Valida coerencia de metodos reconhecidos e combinacoes criticas.",
  severity: SEVERITIES.WARNING,
  scope: RULE_SCOPES.MODEL,
  enabled: true,
  tags: ["methods", "prescription"],
  async run(context) {
    const findings = [];

    for (const document of context.helpers.getAllModelDocuments()) {
      const text = contentWithoutCode(document);
      const normalized = normalizeText(text);
      const hasTopSet = containsMethod(text, "Top Set");
      const hasBackOff = containsMethod(text, "Back-off") || containsMethod(text, "Back off");
      const dropSets = countOccurrences(text, "Drop Set");
      const restPause = countOccurrences(text, "Rest Pause");
      const knownCount = KNOWN_METHODS.filter((method) => containsMethod(text, method)).length;

      if (hasTopSet && !hasBackOff) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, "Top Set sem Back-off associado.", {
          suggestion: "Adicionar Back-off quando Top Set for usado ou justificar a excecao.",
        }));
      }
      if (hasBackOff && !hasTopSet) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Back-off sem Top Set associado.", {
          suggestion: "Revisar se o Back-off esta contextualizado por um Top Set.",
        }));
      }
      if (dropSets > 1) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Drop Set duplicado no modelo.", {
          suggestion: "Limitar Drop Set a usos pontuais e justificados.",
          metadata: { count: dropSets },
        }));
      }
      if (restPause > 1) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Rest Pause excessivo no modelo.", {
          suggestion: "Reduzir Rest Pause ou justificar o volume de tecnicas intensivas.",
          metadata: { count: restPause },
        }));
      }
      if (knownCount === 0 && !normalized.includes("metodo")) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Nenhum metodo reconhecido encontrado.", {
          suggestion: "Declarar o metodo principal ou informar metodo convencional.",
        }));
      }
    }

    return findings;
  },
};
