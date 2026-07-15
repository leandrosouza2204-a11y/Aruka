export const SCORE_WEIGHTS = Object.freeze({
  goalFit: 20,
  levelFit: 15,
  frequencyFit: 15,
  durationFit: 10,
  equipmentFit: 10,
  recoveryFit: 10,
  adherenceFit: 10,
  splitPreference: 4,
  strategyPreference: 3,
  specializationFit: 2,
  operationalSimplicity: 1,
});

export function validateWeights(weights = SCORE_WEIGHTS) {
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (total !== 100) {
    throw new Error(`AOE weights must sum 100. Current sum: ${total}`);
  }
  return true;
}
