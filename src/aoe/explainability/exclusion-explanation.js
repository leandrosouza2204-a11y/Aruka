import { resolveReasons } from "./reason-resolver.js";

export function explainExclusions(decisionTrace) {
  return (decisionTrace?.excluded ?? []).slice(0, 5).map((item) => ({
    modelCode: item.modelCode,
    exclusionPhase: "eligibility",
    reasonCodes: item.reasonCodes,
    reasons: resolveReasons(item.reasonCodes).map((reason) => reason.userDescription),
    critical: resolveReasons(item.reasonCodes).some((reason) => reason.severity === "critical"),
    eligibleBeforeExclusion: false,
  }));
}
