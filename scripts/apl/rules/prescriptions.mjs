import { RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { modelFinding, normalizeText, parseTable, tableBlocks } from "./rule-utils.mjs";

const RULE_ID = "aqa-004";
const REQUIRED_COLUMNS = Object.freeze(["exercicio", "series", "repeticoes", "rir", "descanso", "metodo"]);

function columnIndex(headers, expected) {
  return headers.findIndex((header) => normalizeText(header).includes(expected));
}

export default {
  id: RULE_ID,
  name: "AQA-004 Prescricao",
  description: "Audita tabelas de prescricao para exercicio, series, repeticoes, RIR, descanso e metodo.",
  severity: SEVERITIES.ERROR,
  scope: RULE_SCOPES.PRESCRIPTION,
  enabled: true,
  tags: ["prescription", "tables"],
  async run(context) {
    const findings = [];

    for (const document of context.helpers.getAllModelDocuments()) {
      const tables = tableBlocks(document.document.normalized).map(parseTable);
      if (!tables.length) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, "Nenhuma tabela de prescricao encontrada.", {
          suggestion: "Adicionar tabelas com exercicio, series, repeticoes, RIR, descanso e metodo.",
        }));
        continue;
      }

      for (const table of tables) {
        if (!table.headers.length || table.body.length === 0) {
          findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Tabela quebrada ou sem linhas de exercicio.", {
            line: table.startLine,
            suggestion: "Revisar cabecalho, separador e linhas da tabela.",
          }));
          continue;
        }

        const indices = Object.fromEntries(REQUIRED_COLUMNS.map((column) => [column, columnIndex(table.headers, column)]));
        for (const [column, index] of Object.entries(indices)) {
          if (index === -1) {
            findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Coluna obrigatoria ausente na tabela: ${column}.`, {
              line: table.startLine,
              suggestion: "Padronizar tabela de prescricao com todas as colunas obrigatorias.",
            }));
          }
        }

        table.body.forEach((row, rowIndex) => {
          for (const [column, index] of Object.entries(indices)) {
            if (index >= 0 && !row[index]) {
              findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, `Campo obrigatorio ausente: ${column}.`, {
                line: table.startLine + rowIndex + 2,
                suggestion: `Preencher ${column} para cada exercicio.`,
              }));
            }
          }
          if (row.length !== table.headers.length) {
            findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Linha de tabela com quantidade de colunas inconsistente.", {
              line: table.startLine + rowIndex + 2,
              suggestion: "Ajustar pipes da tabela para manter o mesmo numero de colunas.",
              metadata: { expected: table.headers.length, found: row.length },
            }));
          }
        });
      }
    }

    return findings;
  },
};
