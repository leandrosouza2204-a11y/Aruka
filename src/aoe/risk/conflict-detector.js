import { RISK_FACTORS } from "./risk-factors.js";

export function detectConflicts(profile, decision) {
  const conflicts = [];
  const pref = profile?.preferences ?? {};
  const days = profile?.availableDaysPerWeek;
  const recovery = profile?.recovery?.capacity;
  const adherence = profile?.adherence?.capacity;
  if (pref.split === "ABCDE" && days < 5) {
    conflicts.push({ id: "CON-001", severity: "critical", fields: ["preferences.split", "availableDaysPerWeek"], description: "Preferência por ABCDE com frequência insuficiente.", resolutionPolicy: "Disponibilidade prevalece sobre preferência.", reasonCode: "CONFLICTING_INPUTS" });
  }
  if (pref.strategy === "PERFORMANCE" && profile?.experienceLevel === "BEGINNER") {
    conflicts.push({ id: "CON-002", severity: "moderate", fields: ["preferences.strategy", "experienceLevel"], description: "Performance para iniciante exige cautela.", resolutionPolicy: "Segurança metodológica prevalece.", reasonCode: "CONFLICTING_INPUTS" });
  }
  if (profile?.specializationInterest?.target && recovery === "LOW") {
    conflicts.push({ id: "CON-003", severity: "critical", fields: ["specializationInterest", "recovery"], description: "Especialização com baixa recuperação.", resolutionPolicy: "Recuperação prevalece sobre especialização.", reasonCode: "CONFLICTING_INPUTS" });
  }
  if (adherence === "LOW" && days >= 5) {
    conflicts.push({ id: "CON-004", severity: "moderate", fields: ["adherence", "availableDaysPerWeek"], description: "Alta frequência com baixa aderência.", resolutionPolicy: "Aderência prevalece sobre conveniência.", reasonCode: "ADHERENCE_RISK" });
  }
  if ((decision.reasonCodes ?? []).includes("EQUIPMENT_ADAPTATION_REQUIRED")) {
    conflicts.push({ id: "CON-005", severity: "moderate", fields: ["equipmentProfile"], description: "Equipamento exige adaptação.", resolutionPolicy: "Revisar equipamento antes de executar.", reasonCode: "EQUIPMENT_ADAPTATION_REQUIRED" });
  }
  return conflicts;
}

export function conflictRiskFactors(conflicts) {
  return conflicts.map((conflict) => conflict.severity === "critical" ? RISK_FACTORS.CRITICAL_CONSTRAINT : RISK_FACTORS.PREFERENCE_CONFLICT);
}
