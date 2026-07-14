import { getPrescriptionTables, getSessionSubsection, getTrainingSessions } from "../document-context.mjs";
import { RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { modelFinding, normalizeText } from "./rule-utils.mjs";

const RULE_ID = "aqa-004";
export const REQUIRED_PRESCRIPTION_COLUMNS = Object.freeze([
  "ordem",
  "exercicio",
  "series",
  "repeticoes",
  "rir",
  "descanso",
  "metodo",
  "observacoes",
]);

function normalizedHeader(header) {
  return normalizeText(header).replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
}

function columnIndex(headers, expected) {
  return headers.findIndex((header) => normalizedHeader(header) === expected);
}

function auditTable(document, session, table, findings) {
  if (!table.headers.length || table.rows.length === 0) {
    findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Tabela de prescricao vazia na sessao "${session.title}".`, {
      line: table.startLine,
      section: "Prescrição",
      session: session.title,
      contextType: table.contextType,
      suggestion: "Adicionar linhas de exercicio abaixo do cabecalho oficial.",
    }));
    return;
  }

  const indices = Object.fromEntries(REQUIRED_PRESCRIPTION_COLUMNS.map((column) => [column, columnIndex(table.headers, column)]));
  for (const [column, index] of Object.entries(indices)) {
    if (index === -1) {
      findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Coluna obrigatoria ausente na tabela: ${column}.`, {
        line: table.startLine,
        section: "Prescrição",
        session: session.title,
        contextType: table.contextType,
        expected: REQUIRED_PRESCRIPTION_COLUMNS,
        actual: table.headers,
        suggestion: "Padronizar tabela de prescricao com todas as oito colunas oficiais.",
      }));
    }
  }

  table.rows.forEach((row, rowIndex) => {
    for (const [column, index] of Object.entries(indices)) {
      if (index >= 0 && !row[index]) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Campo obrigatorio ausente: ${column}.`, {
          line: table.startLine + rowIndex + 2,
          section: "Prescrição",
          session: session.title,
          contextType: table.contextType,
          suggestion: `Preencher ${column} para cada exercicio.`,
        }));
      }
    }
    if (row.length !== table.headers.length) {
      findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Linha de tabela com quantidade de colunas inconsistente.", {
        line: table.startLine + rowIndex + 2,
        section: "Prescrição",
        session: session.title,
        contextType: table.contextType,
        suggestion: "Ajustar pipes da tabela para manter o mesmo numero de colunas.",
        metadata: { expectedColumns: table.headers.length, actualColumns: row.length },
      }));
    }
  });
}

export default {
  id: RULE_ID,
  name: "AQA-004 Prescricao",
  description: "Audita somente tabelas contextualmente classificadas como prescricao.",
  severity: SEVERITIES.ERROR,
  scope: RULE_SCOPES.PRESCRIPTION,
  enabled: true,
  tags: ["prescription", "tables", "context"],
  async run(context) {
    const findings = [];

    for (const document of context.helpers.getAllModelDocuments()) {
      const sessions = getTrainingSessions(document.document.context);
      if (!sessions.length) continue;

      for (const session of sessions) {
        const prescription = getSessionSubsection(session, "Prescrição");
        if (!prescription) {
          findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Sessao "${session.title}" sem subsecao Prescricao.`, {
            line: session.line,
            section: "Prescrição",
            session: session.title,
            suggestion: "Adicionar subsecao de prescricao com tabela oficial.",
          }));
          continue;
        }

        const tables = getPrescriptionTables(session);
        if (!tables.length) {
          findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Sessao "${session.title}" sem tabela de prescricao.`, {
            line: prescription.line,
            section: "Prescrição",
            session: session.title,
            suggestion: "Adicionar uma tabela de prescricao dentro da subsecao.",
          }));
          continue;
        }

        for (const table of tables) auditTable(document, session, table, findings);
      }
    }

    return findings;
  },
};
