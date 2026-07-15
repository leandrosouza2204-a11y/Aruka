const labels = {
  LOW_CONFIDENCE: "Confirmar dados usados na decisão",
  HIGH_DECISION_RISK: "Revisar risco decisório",
  HUMAN_REVIEW_REQUIRED: "Confirmar modelo selecionado",
  TIE_UNRESOLVED: "Comparar alternativas empatadas",
  AMBIGUOUS_SELECTION: "Resolver ambiguidade da seleção",
  MISSING_DATA: "Solicitar informação adicional",
  CRITICAL_CONSTRAINT: "Revisar constraints",
  EQUIPMENT_ADAPTATION_REQUIRED: "Revisar equipamentos",
  TIME_AT_LIMIT: "Revisar duração disponível",
  RECOVERY_AT_LIMIT: "Revisar recuperação",
  SPECIALIZATION_PREREQUISITE_MISSING: "Validar interesse e prontidão de especialização",
};

export function buildReviewChecklist(reasonCodes) {
  return [...new Set(reasonCodes)].map((code, index) => ({
    id: `HR-${String(index + 1).padStart(3, "0")}`,
    label: labels[code] ?? "Revisar motivo da recomendação",
    reasonCode: code,
    required: true,
    completed: false,
  }));
}
