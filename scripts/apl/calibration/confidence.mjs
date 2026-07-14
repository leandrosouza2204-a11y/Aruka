const confidenceRules = [
  [/arquivo (inexistente|vazio)/i, 100],
  [/readme .*ausente/i, 100],
  [/titulo .*ausente/i, 100],
  [/codigo .*incompat/i, 100],
  [/rir ausente|campo obrigatorio ausente: rir/i, 100],
  [/sessao longa|tempo de sessao/i, 70],
  [/volume .*alto|volume exagerado/i, 60],
  [/complexidade baixa|simples demais/i, 55],
  [/termo inadequado|terminologia/i, 90],
  [/tags insuficientes|secao obrigatoria ausente: tags/i, 80],
];

export function confidenceForFinding(finding) {
  const text = `${finding.message ?? ""} ${finding.suggestion ?? ""}`;
  const match = confidenceRules.find(([pattern]) => pattern.test(text));
  if (match) return match[1];
  if (finding.severity === "blocker") return 95;
  if (finding.severity === "error") return 90;
  if (finding.severity === "warning") return 70;
  if (finding.severity === "suggestion") return 60;
  return 80;
}

export function applyConfidence(findings) {
  const calibrated = findings.map((finding) => ({
    ...finding,
    confidence: confidenceForFinding(finding),
  }));
  const average = calibrated.length
    ? Math.round(calibrated.reduce((sum, finding) => sum + finding.confidence, 0) / calibrated.length)
    : 0;

  return {
    findings: calibrated,
    metrics: { averageConfidence: average },
  };
}
