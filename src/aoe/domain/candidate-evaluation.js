export function createCandidateEvaluation(model) {
  return {
    modelCode: model.modelCode,
    model,
    eligibilityResults: [],
    exclusionResults: [],
    scoringResults: [],
    penalties: [],
    warnings: [],
    reasonCodes: [],
    excluded: false,
  };
}
