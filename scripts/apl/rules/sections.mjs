import { RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { hasSection, modelFinding, normalizeText, PREMIUM_SECTIONS } from "./rule-utils.mjs";

const RULE_ID = "aqa-003";

export default {
  id: RULE_ID,
  name: "AQA-003 Secoes Premium",
  description: "Valida presenca, duplicidade e ordem das secoes Premium obrigatorias.",
  severity: SEVERITIES.ERROR,
  scope: RULE_SCOPES.MODEL,
  enabled: true,
  tags: ["sections", "premium"],
  async run(context) {
    const findings = [];

    for (const document of context.helpers.getAllModelDocuments()) {
      const headings = document.document.headings.map((heading) => ({
        ...heading,
        normalized: normalizeText(heading.text),
      }));

      for (const section of PREMIUM_SECTIONS) {
        const matches = headings.filter((heading) => heading.normalized === normalizeText(section));
        if (!matches.length) {
          findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Secao Premium ausente: ${section}.`, {
            suggestion: `Adicionar a secao "${section}" no modelo.`,
          }));
        }
        if (matches.length > 1) {
          findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Secao Premium duplicada: ${section}.`, {
            line: matches[1].line,
            section,
            suggestion: "Consolidar secoes duplicadas em uma unica secao.",
          }));
        }
      }

      let lastIndex = -1;
      for (const section of PREMIUM_SECTIONS) {
        if (!hasSection(document, section)) continue;
        const currentIndex = headings.findIndex((heading) => heading.normalized === normalizeText(section));
        if (currentIndex < lastIndex) {
          findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, `Secao fora da ordem Premium: ${section}.`, {
            section,
            line: headings[currentIndex].line,
            suggestion: "Reordenar as secoes conforme o catalogo Premium oficial.",
          }));
        }
        lastIndex = Math.max(lastIndex, currentIndex);
      }
    }

    return findings;
  },
};
