import { createFinding, RULE_SCOPES, SEVERITIES } from "./rule-contract.mjs";

export default {
  id: "apl-example-info",
  name: "Exemplo informativo",
  description: "Demonstra uma regra informativa desabilitada para documentar o contrato.",
  severity: SEVERITIES.INFO,
  scope: RULE_SCOPES.DOCUMENT,
  enabled: false,
  tags: ["example", "documentation", "info"],
  async run(context) {
    const document = context.helpers.getAllReadmes()[0];
    if (!document) return [];

    return [
      createFinding({
        ruleId: "apl-example-info",
        severity: SEVERITIES.INFO,
        scope: RULE_SCOPES.DOCUMENT,
        message: "Exemplo de ocorrencia informativa.",
        file: document.file,
        sprint: document.sprint,
        block: document.block,
        section: document.document.title,
        suggestion: "Use findings informativos para sinalizar contexto sem bloquear homologacao.",
        metadata: { example: true },
      }),
    ];
  },
};
