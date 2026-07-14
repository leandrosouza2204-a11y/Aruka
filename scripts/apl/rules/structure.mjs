import path from "node:path";
import { createFinding, RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { basename, EXPECTED_BLOCKS, isModelDocument, modelFinding } from "./rule-utils.mjs";

const RULE_ID = "aqa-001";

function expectedModelCount(block) {
  return block === "_ROOT" ? 0 : 3;
}

export default {
  id: RULE_ID,
  name: "AQA-001 Estrutura",
  description: "Valida estrutura de Sprints, blocos, nomes de arquivos e documentos vazios.",
  severity: SEVERITIES.ERROR,
  scope: RULE_SCOPES.GLOBAL,
  enabled: true,
  tags: ["structure", "filesystem"],
  async run(context) {
    const findings = [];

    for (const sprint of context.scanResult.sprints) {
      const blocks = new Map(sprint.blocks.map((block) => [block.name, block]));
      for (const expectedBlock of EXPECTED_BLOCKS) {
        if (!blocks.has(expectedBlock)) {
          findings.push(createFinding({
            ruleId: RULE_ID,
            severity: SEVERITIES.ERROR,
            scope: RULE_SCOPES.BLOCK,
            message: `Diretorio esperado ausente: ${expectedBlock}`,
            sprint: sprint.sprint,
            block: expectedBlock,
            suggestion: "Criar o bloco esperado ou ajustar a configuracao oficial da Sprint.",
          }));
        }
      }

      for (const block of sprint.blocks) {
        if (block.name !== "_ROOT" && !EXPECTED_BLOCKS.includes(block.name)) {
          findings.push(createFinding({
            ruleId: RULE_ID,
            severity: SEVERITIES.ERROR,
            scope: RULE_SCOPES.BLOCK,
            message: `Diretorio inesperado: ${block.name}`,
            sprint: sprint.sprint,
            block: block.name,
            suggestion: "Manter apenas blocos oficiais da APL.",
          }));
        }

        const readme = block.files.find((file) => basename(file).toLowerCase() === "readme.md");
        if (block.name !== "_ROOT" && !readme) {
          findings.push(createFinding({
            ruleId: RULE_ID,
            severity: SEVERITIES.ERROR,
            scope: RULE_SCOPES.BLOCK,
            message: "README obrigatorio ausente no bloco.",
            sprint: sprint.sprint,
            block: block.name,
            suggestion: "Adicionar README.md com resumo do bloco.",
          }));
        }

        const models = context.documents.filter((document) => document.sprint === sprint.sprint && document.block === block.name && isModelDocument(document));
        if (models.length < expectedModelCount(block.name)) {
          findings.push(createFinding({
            ruleId: RULE_ID,
            severity: SEVERITIES.ERROR,
            scope: RULE_SCOPES.BLOCK,
            message: `Quantidade minima de modelos nao atendida em ${block.name}.`,
            sprint: sprint.sprint,
            block: block.name,
            suggestion: "Cada bloco oficial deve possuir ao menos tres modelos.",
            metadata: { found: models.length, expected: expectedModelCount(block.name) },
          }));
        }
      }
    }

    const names = new Map();
    for (const document of context.documents) {
      const fileName = basename(document.file);
      names.set(fileName, (names.get(fileName) ?? 0) + 1);

      if (path.extname(document.file) !== ".md") {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, "Extensao invalida.", {
          suggestion: "Utilizar apenas arquivos .md.",
        }));
      }
      if (!document.document.normalized.trim()) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, "Arquivo vazio.", {
          suggestion: "Preencher o documento ou remover o arquivo do escopo auditado.",
        }));
      }
      if (isModelDocument(document) && `${document.document.metadata.modelCode}.md` !== fileName) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.ERROR, "Codigo interno incompatível com o nome do arquivo.", {
          suggestion: "Alinhar codigo do modelo e nome do arquivo.",
          metadata: { expectedFile: `${document.document.metadata.modelCode}.md`, actualFile: fileName },
        }));
      }
      if (!/^(README|SPRINT_\d+_.+|QA|CHANGELOG|[A-Z0-9-]+)\.md$/.test(fileName)) {
        findings.push(modelFinding(document, RULE_ID, SEVERITIES.WARNING, "Arquivo adicional desconhecido ou nome fora do padrao.", {
          suggestion: "Revisar se o arquivo faz parte da estrutura oficial da APL.",
        }));
      }
    }

    for (const [name, count] of names.entries()) {
      if (count > 1 && name !== "README.md") {
        findings.push(createFinding({
          ruleId: RULE_ID,
          severity: SEVERITIES.WARNING,
          scope: RULE_SCOPES.GLOBAL,
          message: `Nome de arquivo duplicado: ${name}`,
          suggestion: "Usar nomes unicos para reduzir ambiguidade nos relatorios.",
          metadata: { count },
        }));
      }
    }

    return findings;
  },
};
