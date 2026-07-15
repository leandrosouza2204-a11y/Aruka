import { CONFIDENCE_THRESHOLDS } from "../config/thresholds.js";
import { ConfidenceLevel, ReasonCodes } from "../domain/enums.js";
import { clamp, roundTo } from "../utils/number.js";

function level(score) {
  if (score >= CONFIDENCE_THRESHOLDS.HIGH) return ConfidenceLevel.HIGH;
  if (score >= CONFIDENCE_THRESHOLDS.MEDIUM) return ConfidenceLevel.MEDIUM;
  return ConfidenceLevel.LOW;
}

export function evaluateConfidence({ profile, catalog, ranked, excluded, technicalTie }) {
  const selected = ranked[0];
  const second = ranked[1];
  const scoreGap = selected && second ? selected.finalScore - second.finalScore : 25;
  const dimensions = {
    inputCompleteness: profile.completeness.criticalComplete ? 30 : 0,
    constraintClarity: profile.constraints.length <= 3 ? 20 : 12,
    catalogConfidence: catalog.length >= 30 ? 15 : 10,
    scoreSeparation: technicalTie.hasTie ? 5 : scoreGap >= 5 ? 15 : 10,
    conflictAbsence: excluded.length === 0 ? 10 : excluded.length <= 10 ? 7 : 4,
    inputConsistency: profile.warnings.length === 0 ? 10 : 5,
  };
  const score = roundTo(clamp(Object.values(dimensions).reduce((sum, value) => sum + value, 0), 0, 100), 2);
  const reasonCodes = [];
  if (score < CONFIDENCE_THRESHOLDS.MEDIUM) reasonCodes.push(ReasonCodes.LOW_CONFIDENCE);
  if (technicalTie.hasTie) reasonCodes.push(ReasonCodes.TIE_UNRESOLVED);
  if (!profile.completeness.criticalComplete) reasonCodes.push(ReasonCodes.MISSING_DATA);
  return { score, level: level(score), dimensions, reasonCodes };
}
