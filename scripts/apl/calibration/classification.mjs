function categoryForRule(ruleId) {
  const categories = {
    "aqa-001": "Estrutura",
    "aqa-002": "Documentacao",
    "aqa-003": "Documentacao",
    "aqa-004": "Prescricao",
    "aqa-005": "Metodos",
    "aqa-006": "Terminologia",
    "aqa-007": "Status",
    "aqa-008": "Iniciante",
    "aqa-009": "Intermediario",
  };
  return categories[ruleId] ?? "Documentacao";
}

function calibratedSeverity(finding) {
  const message = finding.message ?? "";
  if (finding.isCascadeChild || finding.suppressed) return finding.severity === "error" ? "warning" : finding.severity;
  if (/readme .*ausente|arquivo vazio|diretorio esperado ausente|titulo principal ausente|codigo .*incompat|rir ausente/i.test(message)) {
    return "blocker";
  }
  if (/tags insuficientes|secao obrigatoria ausente: tags|simples demais|nenhum metodo reconhecido/i.test(message)) {
    return "suggestion";
  }
  if (/rir menor|sessao longa|referencia a falha|termo inadequado|drop set duplicado|rest pause excessivo/i.test(message)) {
    return "warning";
  }
  if (/top set sem|rest pause encontrado|drop set encontrado|modelo intermediario sem|coluna obrigatoria|campo obrigatorio|secao premium ausente|secao obrigatoria ausente/i.test(message)) {
    return "error";
  }
  return finding.severity;
}

export function classifyFindings(findings) {
  return {
    findings: findings.map((finding) => ({
      ...finding,
      originalSeverity: finding.originalSeverity ?? finding.severity,
      severity: calibratedSeverity(finding),
      category: categoryForRule(finding.ruleId),
      criticality: finding.isCascadeChild ? "CHILD" : calibratedSeverity(finding).toUpperCase(),
    })),
    metrics: {},
  };
}
