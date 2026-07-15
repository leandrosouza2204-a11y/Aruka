export function explainAlternatives(decision) {
  const winnerScore = decision.compatibilityScore ?? 0;
  return (decision.alternatives ?? []).map((alternative) => ({
    modelCode: alternative.modelCode,
    explanation: `Alternativa abaixo do modelo selecionado por diferença de score ou desempate operacional.`,
    scoreGapFromWinner: alternative.compatibilityScore ? Number((winnerScore - alternative.compatibilityScore).toFixed(2)) : null,
  }));
}
