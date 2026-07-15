import { ReasonCodes } from "../domain/enums.js";
import { AOEInvariantError } from "../domain/errors.js";

export function validateDecisionState({ ranked, selected, versions }) {
  if (!versions?.aoe || !versions?.ruleCatalog || !versions?.scoring || !versions?.confidence) {
    throw new AOEInvariantError("Version registry incomplete", { reasonCode: ReasonCodes.VERSION_REGISTRY_INCOMPLETE });
  }
  if (selected && ranked[0]?.model.modelCode !== selected.model.modelCode) {
    throw new AOEInvariantError("Selected model does not match ranking leader", { reasonCode: ReasonCodes.SELECTION_RANKING_MISMATCH });
  }
  for (const item of ranked) {
    if (item.finalScore < 0 || item.finalScore > 100 || item.rawScore < 0 || item.rawScore > 100) {
      throw new AOEInvariantError("Score outside accepted bounds", { reasonCode: ReasonCodes.INVALID_SCORE });
    }
  }
  return true;
}
