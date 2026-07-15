export function explainScore(decisionTrace) {
  const ranking = decisionTrace?.ranking ?? [];
  const winner = ranking[0];
  return ranking.slice(0, 5).map((item) => ({
    modelCode: item.modelCode,
    rawScore: item.rawScore,
    finalScore: item.finalScore,
    dimensions: item.dimensions ?? {},
    penalties: item.penalties ?? { items: [], total: 0 },
    rank: item.rank,
    scoreGapFromWinner: winner ? Number((winner.finalScore - item.finalScore).toFixed(2)) : 0,
  }));
}
