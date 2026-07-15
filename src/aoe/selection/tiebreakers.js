import { TECHNICAL_TIE_THRESHOLD } from "../config/thresholds.js";
import { ReasonCodes } from "../domain/enums.js";

export function detectTechnicalTie(ranked) {
  if (ranked.length < 2) return { hasTie: false, tiedModels: [] };
  const gap = Math.abs(ranked[0].finalScore - ranked[1].finalScore);
  if (gap <= TECHNICAL_TIE_THRESHOLD) {
    return {
      hasTie: true,
      gap,
      reasonCode: ReasonCodes.TIE_UNRESOLVED,
      tiedModels: ranked.slice(0, 2).map((item) => item.model.modelCode),
    };
  }
  return { hasTie: false, gap, tiedModels: [] };
}
