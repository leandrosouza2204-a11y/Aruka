import { Strategy } from "../domain/enums.js";

function strategyUncertaintyRank(strategy) {
  if (strategy === Strategy.BASE) return 0;
  if (strategy === Strategy.PERFORMANCE) return 1;
  if (strategy === Strategy.EFFICIENCY) return 2;
  return 3;
}

export function rankCandidates(scored) {
  return [...scored].sort((a, b) => {
    const comparisons = [
      b.finalScore - a.finalScore,
      a.warnings.length - b.warnings.length,
      b.dimensions.adherenceFit - a.dimensions.adherenceFit,
      b.dimensions.recoveryFit - a.dimensions.recoveryFit,
      b.dimensions.operationalSimplicity - a.dimensions.operationalSimplicity,
      a.model.complexity - b.model.complexity,
      a.model.minimumSessionDuration - b.model.minimumSessionDuration,
      strategyUncertaintyRank(a.model.strategy) - strategyUncertaintyRank(b.model.strategy),
      a.model.modelCode.localeCompare(b.model.modelCode),
    ];
    return comparisons.find((value) => value !== 0) ?? 0;
  });
}
