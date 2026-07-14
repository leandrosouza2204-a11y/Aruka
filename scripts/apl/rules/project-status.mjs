import { createFinding, RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";
import { EXPECTED_BLOCKS, normalizeText } from "./rule-utils.mjs";

const RULE_ID = "aqa-007";

function declaredCompletedCount(text) {
  const match = /Modelos concluidos\s+(\d+)\s*\/\s*(\d+)/i.exec(text);
  return match ? { completed: Number(match[1]), total: Number(match[2]) } : null;
}

export default {
  id: RULE_ID,
  name: "AQA-007 PROJECT_STATUS",
  description: "Compara PROJECT_STATUS com Sprints, blocos, modelos existentes e contadores.",
  severity: SEVERITIES.ERROR,
  scope: RULE_SCOPES.GLOBAL,
  enabled: true,
  tags: ["project-status", "metadata"],
  async run(context) {
    const findings = [];
    const projectStatus = context.helpers.getProjectStatusDocument();

    if (!projectStatus) {
      return [createFinding({
        ruleId: RULE_ID,
        severity: SEVERITIES.ERROR,
        scope: RULE_SCOPES.GLOBAL,
        message: "PROJECT_STATUS.md ausente ou ilegivel.",
        suggestion: "Restaurar PROJECT_STATUS.md como fonte oficial de acompanhamento.",
      })];
    }

    const statusText = projectStatus.document.normalized;
    const normalized = normalizeText(statusText);

    for (const sprint of context.scanResult.sprints) {
      if (!normalized.includes(normalizeText(sprint.sprint.replace("_", " ")))) {
        findings.push(createFinding({
          ruleId: RULE_ID,
          severity: SEVERITIES.ERROR,
          scope: RULE_SCOPES.SPRINT,
          message: `Sprint existente nao declarada no PROJECT_STATUS: ${sprint.sprint}.`,
          sprint: sprint.sprint,
          suggestion: "Atualizar acompanhamento oficial da APL.",
        }));
      }

      for (const block of EXPECTED_BLOCKS) {
        if (!sprint.blocks.some((item) => item.name === block)) continue;
        if (!normalized.includes(normalizeText(block.replace("_", " "))) && !normalized.includes(normalizeText(block))) {
          findings.push(createFinding({
            ruleId: RULE_ID,
            severity: SEVERITIES.WARNING,
            scope: RULE_SCOPES.BLOCK,
            message: `Bloco existente possivelmente ausente do PROJECT_STATUS: ${block}.`,
            sprint: sprint.sprint,
            block,
            suggestion: "Conferir se o bloco esta declarado no status oficial.",
          }));
        }
      }
    }

    const counter = declaredCompletedCount(statusText);
    const modelCount = context.helpers.getAllModelDocuments().length;
    if (counter && counter.completed !== modelCount) {
      findings.push(createFinding({
        ruleId: RULE_ID,
        severity: SEVERITIES.ERROR,
        scope: RULE_SCOPES.GLOBAL,
        message: "Contador de modelos concluidos diverge dos modelos existentes.",
        suggestion: "Revisar contador de modelos concluidos no PROJECT_STATUS.",
        metadata: { declared: counter.completed, existing: modelCount },
      }));
    }

    return findings;
  },
};
