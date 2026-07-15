import { Strategy } from "../domain/enums.js";
import { detectAmbiguity, ambiguityRiskFactors } from "./ambiguity-detector.js";
import { detectConflicts, conflictRiskFactors } from "./conflict-detector.js";
import { RISK_FACTORS } from "./risk-factors.js";
import { buildRiskScore } from "./risk-score.js";

export function evaluateDecisionRisk({ profile, decision }) {
  const factors = [];
  const codes = new Set(decision.reasonCodes ?? []);
  if (decision.status === "INVALID_INPUT" || codes.has("MISSING_DATA")) factors.push(RISK_FACTORS.MISSING_DATA);
  if (codes.has("CRITICAL_CONSTRAINT")) factors.push(RISK_FACTORS.CRITICAL_CONSTRAINT);
  if (decision.confidenceLevel === "LOW") factors.push(RISK_FACTORS.LOW_CONFIDENCE);
  if (codes.has("TIE_UNRESOLVED")) factors.push(RISK_FACTORS.TECHNICAL_TIE);
  if (decision.selectedModel?.strategy === Strategy.SPECIALIZATION) factors.push(RISK_FACTORS.SPECIALIZATION);
  if ((profile?.constraints ?? []).some((item) => /dor|les|cirurg|limita/i.test(String(item)))) factors.push(RISK_FACTORS.PHYSICAL_CONSTRAINT);
  if (codes.has("RECOVERY_AT_LIMIT")) factors.push(RISK_FACTORS.RECOVERY_UNCERTAIN);
  if (codes.has("TIME_AT_LIMIT")) factors.push(RISK_FACTORS.TIME_AT_LIMIT);
  if (codes.has("EQUIPMENT_ADAPTATION_REQUIRED")) factors.push(RISK_FACTORS.EQUIPMENT_ADAPTATION);
  if (codes.has("MULTIPLE_WARNINGS")) factors.push(RISK_FACTORS.MULTIPLE_WARNINGS);
  if (codes.has("ADHERENCE_RISK")) factors.push(RISK_FACTORS.ADHERENCE_RISK);
  if ((decision.decisionTrace?.catalogWarnings ?? []).length) factors.push(RISK_FACTORS.CATALOG_WARNINGS);
  if (codes.has("PREFERENCE_MISMATCH")) factors.push(RISK_FACTORS.PREFERENCE_CONFLICT);
  const ambiguity = detectAmbiguity(decision);
  const conflicts = detectConflicts(profile, decision);
  factors.push(...ambiguityRiskFactors(ambiguity), ...conflictRiskFactors(conflicts));
  return { risk: buildRiskScore(factors), ambiguity, conflicts };
}
