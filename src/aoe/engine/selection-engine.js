export function selectRecommendation(ranked) {
  const selected = ranked[0] ?? null;
  return {
    selected,
    alternatives: ranked.slice(1, 3),
  };
}
