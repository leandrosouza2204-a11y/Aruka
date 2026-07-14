import { RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { contentWithoutCode, modelFinding, normalizeText, sprintNumber } from "./rule-utils.mjs";

const RULE_ID = "aqa-008";

export default {
  id: RULE_ID,
  name: "AQA-008 Regras para Iniciantes",
  description: "Audita restricoes de complexidade e intensidade para modelos da Sprint 01.",
  severity: SEVERITIES.ERROR,
  scope: RULE_SCOPES.MODEL,
  enabled: true,
  tags: ["beginner", "sprint01"],
  async run(context) {
    const findings = [];

    for (const document of context.helpers.getAllModelDocuments().filter((item) => sprintNumber(item.sprint) === 1)) {
      const text = contentWithoutCode(document);
      const normalized = normalizeText(text);
      if (normalized.includes("drop set")) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, "Drop Set encontrado em modelo iniciante.", {
          suggestion: "Remover tecnica intensiva ou mover para modelo de nivel adequado.",
        }));
      }
      if (normalized.includes("rest pause")) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, "Rest Pause encontrado em modelo iniciante.", {
          suggestion: "Substituir por progressao simples e controle de RIR.",
        }));
      }
      if (/\brir\s*[01]\b/i.test(text) || /\brir\s*0\s*-\s*1\b/i.test(text)) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "RIR menor que 2 em modelo iniciante.", {
          suggestion: "Preferir RIR 2 ou superior para iniciantes.",
        }));
      }
      if (/(falha|ate a falha)/i.test(normalized)) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Referencia a falha em modelo iniciante.", {
          suggestion: "Usar linguagem de proximidade da falha com margem tecnica.",
        }));
      }
      if (/(9[1-9]|1[0-9]{2})\s*min/i.test(text)) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Tempo de sessao acima do recomendado para iniciante.", {
          suggestion: "Revisar volume e duracao estimada da sessao.",
        }));
      }
    }

    return findings;
  },
};
