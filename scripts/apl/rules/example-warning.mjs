import { createFinding, RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";

export default {
  id: "apl-example-warning",
  name: "Exemplo de ressalva",
  description: "Demonstra uma regra de warning desabilitada para documentar o contrato.",
  severity: SEVERITIES.WARNING,
  scope: RULE_SCOPES.SPRINT,
  enabled: false,
  tags: ["example", "documentation", "warning"],
  async run(context) {
    const documents = context.helpers.findDocumentsBySprint("SPRINT_01");
    if (!documents.length) return [];

    return [
      createFinding({
        ruleId: "apl-example-warning",
        severity: SEVERITIES.WARNING,
        scope: RULE_SCOPES.SPRINT,
        message: "Exemplo de ocorrencia que aprovaria com ressalvas.",
        sprint: "SPRINT_01",
        suggestion: "Use warning para inconsistencias revisaveis que nao impedem a execucao.",
        metadata: { documents: documents.length },
      }),
    ];
  },
};
