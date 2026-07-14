import { createFinding, RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";

export default {
  id: "apl-example-error",
  name: "Exemplo bloqueante",
  description: "Demonstra uma regra de erro desabilitada para documentar o contrato.",
  severity: SEVERITIES.ERROR,
  scope: RULE_SCOPES.MODEL,
  enabled: false,
  tags: ["example", "documentation", "error"],
  async run(context) {
    const document = context.helpers.getAllModelDocuments()[0];
    if (!document) return [];

    return [
      createFinding({
        ruleId: "apl-example-error",
        severity: SEVERITIES.ERROR,
        scope: RULE_SCOPES.MODEL,
        message: "Exemplo de ocorrencia bloqueante.",
        file: document.file,
        sprint: document.sprint,
        block: document.block,
        modelCode: document.document.metadata.modelCode,
        line: 1,
        excerpt: document.document.normalized.slice(0, 120),
        suggestion: "Use error quando o conteudo bloquear homologacao.",
        metadata: { example: true },
      }),
    ];
  },
};
