export function applyExclusions(evaluations) {
  return {
    candidates: evaluations.filter((item) => item.eligible),
    excluded: evaluations.filter((item) => !item.eligible).map((item) => ({
      modelCode: item.model.modelCode,
      reasonCodes: [...new Set(item.reasonCodes)],
      rules: item.rules.filter((rule) => rule.outcome === "FAIL"),
    })),
  };
}
