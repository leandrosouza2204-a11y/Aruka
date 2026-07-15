import { RISK_FACTORS } from "./risk-factors.js";

export function detectAmbiguity(decision) {
  const tie = decision.decisionTrace?.technicalTie;
  const ranking = decision.decisionTrace?.ranking ?? [];
  const gap = ranking.length > 1 ? Number((ranking[0].finalScore - ranking[1].finalScore).toFixed(2)) : null;
  const reasons = [];
  if (tie?.hasTie) reasons.push("Empate técnico detectado.");
  if (gap !== null && gap <= 1) reasons.push("Diferença de score menor ou igual a 1.");
  if ((decision.reasonCodes ?? []).includes("MISSING_DATA")) reasons.push("Dados críticos ausentes.");
  if ((decision.reasonCodes ?? []).includes("PREFERENCE_MISMATCH")) reasons.push("Preferência conflitante com a seleção.");
  const ambiguous = reasons.length > 0;
  const level = reasons.length >= 3 ? "HIGH" : reasons.length === 2 ? "MODERATE" : reasons.length === 1 ? "LOW" : "NONE";
  return {
    ambiguous,
    level,
    reasons,
    candidates: ranking.slice(0, 3).map((item) => item.modelCode),
    sensitivity: { winnerChanged: false, changedCount: 0, alternatives: [], level: "NOT_RUN" },
  };
}

export function ambiguityRiskFactors(ambiguity) {
  if (!ambiguity.ambiguous) return [];
  return ambiguity.level === "HIGH" || ambiguity.level === "MODERATE" ? [RISK_FACTORS.SMALL_SCORE_GAP] : [];
}
