import { RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { contentWithoutCode, modelFinding, normalizeText, sprintNumber } from "./rule-utils.mjs";

const RULE_ID = "aqa-009";

export default {
  id: RULE_ID,
  name: "AQA-009 Regras para Intermediarios",
  description: "Audita progressao, metodos e especializacoes em modelos da Sprint 02.",
  severity: SEVERITIES.WARNING,
  scope: RULE_SCOPES.MODEL,
  enabled: true,
  tags: ["intermediate", "sprint02"],
  async run(context) {
    const findings = [];

    for (const document of context.helpers.getAllModelDocuments().filter((item) => sprintNumber(item.sprint) === 2)) {
      const text = contentWithoutCode(document);
      const normalized = normalizeText(text);
      const hasProgression = normalized.includes("progressao") || normalized.includes("periodizacao");
      const hasAdvancedMethod = normalized.includes("top set") || normalized.includes("back-off") || normalized.includes("back off") || normalized.includes("progressao dupla");
      const isSpecialization = normalized.includes("especializacao") || normalizeText(document.file).includes("esp-");

      if (!hasProgression) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, "Modelo intermediario sem progressao declarada.", {
          suggestion: "Adicionar progressao ou periodizacao compativel com nivel intermediario.",
        }));
      }
      if (!hasAdvancedMethod) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Modelo intermediario possivelmente simples demais.", {
          suggestion: "Declarar metodo esperado, como Progressao Dupla, Top Set ou Back-off, quando aplicavel.",
        }));
      }
      if (isSpecialization && !/(volume|distribuicao|prioridade|especializacao)/i.test(normalized)) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, "Especializacao sem distribuicao de volume clara.", {
          suggestion: "Explicitar prioridade, volume e distribuicao da especializacao.",
        }));
      }
    }

    return findings;
  },
};
