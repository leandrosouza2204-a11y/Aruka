import { RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { errorFinding, hasSection, isModelDocument, lineOfText, modelFinding, normalizeText, sectionByName, warningFinding } from "./rule-utils.mjs";

const RULE_ID = "aqa-002";

const REQUIRED_SECTIONS = Object.freeze([
  "Resumo Executivo",
  "Objetivo principal",
  "Metadados",
  "Assinatura Tecnica",
  "Tags",
]);

function hasVersion(documentRef) {
  return /(?:vers[aã]o|version)\s*[:|-]\s*\d+\.\d+/i.test(documentRef.document.normalized);
}

function hasStatus(documentRef) {
  return /status\s*[:|-]\s*\S+/i.test(documentRef.document.normalized);
}

export default {
  id: RULE_ID,
  name: "AQA-002 Metadados",
  description: "Valida titulo, codigo, versao, status e secoes de metadados dos modelos.",
  severity: SEVERITIES.ERROR,
  scope: RULE_SCOPES.MODEL,
  enabled: true,
  tags: ["metadata", "model"],
  async run(context) {
    const findings = [];
    const codes = new Set();

    for (const document of context.helpers.getAllModelDocuments()) {
      const code = document.document.metadata.modelCode;
      if (!document.document.headings.some((heading) => heading.level === 1)) {
        findings.push(errorFinding(document, RULE_ID, "Titulo principal ausente.", {
          suggestion: "Adicionar um heading H1 com o nome oficial do modelo.",
        }));
      }
      if (!document.document.normalized.includes(code)) {
        findings.push(errorFinding(document, RULE_ID, "Codigo do modelo ausente ou incompatível no conteudo.", {
          suggestion: "Registrar o codigo oficial do modelo no documento.",
          metadata: { code },
        }));
      }
      if (codes.has(code)) {
        findings.push(errorFinding(document, RULE_ID, "Codigo de modelo duplicado.", {
          suggestion: "Garantir codigo unico para cada modelo.",
          metadata: { code },
        }));
      }
      codes.add(code);
      if (!hasVersion(document)) {
        findings.push(errorFinding(document, RULE_ID, "Versao ausente.", {
          suggestion: "Adicionar campo de versao nos metadados.",
        }));
      }
      if (!hasStatus(document)) {
        findings.push(warningFinding(document, RULE_ID, "Status ausente.", {
          suggestion: "Informar o status do modelo nos metadados.",
        }));
      }
      for (const section of REQUIRED_SECTIONS) {
        if (!hasSection(document, section)) {
          findings.push(modelFinding(document, RULE_ID, section === "Tags" ? SEVERITIES.WARNING : SEVERITIES.ERROR, `Secao obrigatoria ausente: ${section}.`, {
            suggestion: `Adicionar a secao "${section}".`,
          }));
        } else if (!sectionByName(document, section).content.trim()) {
          findings.push(warningFinding(document, RULE_ID, `Secao sem conteudo: ${section}.`, {
            section,
            line: lineOfText(document, section),
            suggestion: "Preencher a secao com informacao objetiva.",
          }));
        }
      }

      const tagSection = sectionByName(document, "Tags");
      if (tagSection) {
        const tagCount = (tagSection.content.match(/[#\w-]+/g) ?? []).filter((tag) => normalizeText(tag).length > 2).length;
        if (tagCount < 3) {
          findings.push(warningFinding(document, RULE_ID, "Tags insuficientes.", {
            section: "Tags",
            line: tagSection.line,
            suggestion: "Adicionar ao menos tres tags tecnicas.",
            metadata: { tagCount },
          }));
        }
      }
    }

    return findings.filter((finding) => isModelDocument(context.helpers.findDocumentByFile(finding.file) ?? { document: { metadata: {} } }) || finding.file);
  },
};
