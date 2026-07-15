import { riskLevel } from "./risk-level.js";

export function buildRiskScore(factors) {
  const unique = new Map();
  for (const factor of factors) {
    if (!unique.has(factor.code)) unique.set(factor.code, factor);
  }
  const score = Math.min(100, [...unique.values()].reduce((sum, factor) => sum + factor.points, 0));
  return { score, level: riskLevel(score), factors: [...unique.values()] };
}
