import {
  findSectionOccurrences,
  getSessionSubsection,
  getTopLevelSections,
  getTrainingSessions,
  normalizeHeadingTitle,
  resolveOfficialSectionName,
  SESSION_SUBSECTIONS,
} from "../document-context.mjs";
import { RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { modelFinding, normalizeText, PREMIUM_SECTIONS } from "./rule-utils.mjs";

const RULE_ID = "aqa-003";

function canonicalSectionName(section) {
  return resolveOfficialSectionName(section) ?? section;
}

function sectionOrderIndex(section) {
  const normalized = normalizeText(canonicalSectionName(section));
  return PREMIUM_SECTIONS.findIndex((expected) => normalizeText(expected) === normalized);
}

function subsectionOccurrences(session, title) {
  const expected = normalizeHeadingTitle(title);
  return session.children.filter((child) => child.level === 4 && child.normalizedTitle === expected);
}

function validateGlobalSections(document, findings) {
  const context = document.document.context;
  const h2Sections = getTopLevelSections(context);

  for (const section of PREMIUM_SECTIONS) {
    const matches = h2Sections.filter((heading) => canonicalSectionName(heading.title) === canonicalSectionName(section));
    if (!matches.length) {
      findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Secao Premium ausente: ${section}.`, {
        section,
        suggestion: `Adicionar a secao "${section}" no modelo.`,
      }));
    }
    if (matches.length > 1) {
      findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Secao Premium duplicada: ${section}.`, {
        line: matches[1].line,
        section,
        suggestion: "Consolidar secoes H2 duplicadas no escopo global.",
      }));
    }
  }

  let lastOrder = -1;
  for (const section of h2Sections) {
    const currentOrder = sectionOrderIndex(section.title);
    if (currentOrder === -1) continue;
    if (currentOrder < lastOrder) {
      findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, `Secao fora da ordem Premium: ${canonicalSectionName(section.title)}.`, {
        line: section.line,
        section: canonicalSectionName(section.title),
        suggestion: "Reordenar as secoes H2 conforme o catalogo Premium oficial.",
      }));
      continue;
    }
    lastOrder = currentOrder;
  }

  const legacyCoaching = findSectionOccurrences(context, "Coaching Notes", { level: 2 })
    .filter((heading) => normalizeHeadingTitle(heading.title) === "coaching notes");
  for (const heading of legacyCoaching) {
    findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Alias legado utilizado: Coaching Notes.", {
      line: heading.line,
      section: "Aruka Coaching Notes",
      suggestion: "Preferir o titulo oficial \"Aruka Coaching Notes\" quando o modelo for revisado.",
    }));
  }
}

function validateTrainingSessions(document, findings) {
  const sessions = getTrainingSessions(document.document.context);
  for (const session of sessions) {
    let lastIndex = -1;
    for (const subsection of SESSION_SUBSECTIONS) {
      const matches = subsectionOccurrences(session, subsection);
      if (!matches.length) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Sessao "${session.title}" sem subsecao "${subsection}".`, {
          line: session.line,
          section: subsection,
          session: session.title,
          suggestion: `Adicionar "#### ${subsection}" dentro da sessao "${session.title}".`,
        }));
        continue;
      }
      if (matches.length > 1) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Subsecao duplicada na sessao "${session.title}": ${subsection}.`, {
          line: matches[1].line,
          section: subsection,
          session: session.title,
          suggestion: "Manter apenas uma subsecao deste tipo dentro da mesma sessao.",
        }));
      }
      const currentIndex = session.children.indexOf(matches[0]);
      if (currentIndex < lastIndex) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, `Subsecao fora da ordem na sessao "${session.title}": ${subsection}.`, {
          line: matches[0].line,
          section: subsection,
          session: session.title,
          suggestion: "Usar a ordem: Objetivo da sessao, Prescricao, Justificativa.",
        }));
      }
      lastIndex = Math.max(lastIndex, currentIndex);
    }

    const prescription = getSessionSubsection(session, "Prescrição");
    if (prescription && !prescription.tables.some((table) => table.contextType === "prescription")) {
      findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, `Sessao "${session.title}" possui Prescricao sem tabela.`, {
        line: prescription.line,
        section: "Prescrição",
        session: session.title,
        suggestion: "Adicionar uma tabela oficial de prescricao dentro da subsecao.",
      }));
    }
  }
}

export default {
  id: RULE_ID,
  name: "AQA-003 Secoes Premium",
  description: "Valida presenca, duplicidade e ordem das secoes Premium obrigatorias com escopo contextual.",
  severity: SEVERITIES.ERROR,
  scope: RULE_SCOPES.MODEL,
  enabled: true,
  tags: ["sections", "premium", "context"],
  async run(context) {
    const findings = [];

    for (const document of context.helpers.getAllModelDocuments()) {
      validateGlobalSections(document, findings);
      validateTrainingSessions(document, findings);
    }

    return findings;
  },
};
