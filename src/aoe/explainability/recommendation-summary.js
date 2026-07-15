export function buildRecommendationSummary(decision, primaryReasons) {
  if (!decision.selectedModel) {
    return `Nenhum modelo foi selecionado porque ${primaryReasons.slice(0, 2).map((reason) => reason.userDescription.toLowerCase()).join(" e ") || "não houve candidato elegível"}.`;
  }
  const reasonText = primaryReasons.slice(0, 3).map((reason) => reason.userDescription.toLowerCase()).join(", ");
  const reviewText = decision.humanReview?.required || decision.humanReview?.status === "REQUIRED" || decision.humanReview?.status === "BLOCKING"
    ? " A recomendação exige revisão humana antes de uso operacional."
    : "";
  return `O modelo ${decision.selectedModel.modelCode} foi selecionado por compatibilidade operacional${reasonText ? `, com atenção para: ${reasonText}` : ""}.${reviewText}`;
}
