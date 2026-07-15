import { REASON_BY_CODE } from "./reason-catalog.js";

export function resolveReason(code) {
  return REASON_BY_CODE[code] ?? {
    code,
    category: "validation",
    severity: "critical",
    title: "Reason code não registrado",
    technicalDescription: `Reason code sem cadastro: ${code}`,
    userDescription: "A decisão contém um motivo não registrado.",
    defaultAction: "Bloquear recomendação automática.",
    blocksAutomaticRecommendation: true,
    requiresHumanReview: true,
  };
}

export function resolveReasons(codes = []) {
  return [...new Set(codes)].map(resolveReason);
}
