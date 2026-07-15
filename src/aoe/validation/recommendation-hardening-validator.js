import { REASON_BY_CODE } from "../explainability/index.js";
import { validateOutputConsistency } from "./output-consistency-validator.js";
import { validateDecisionExplanation } from "./explanation-validator.js";
import { validateDecisionRisk } from "./risk-validator.js";
import { validateTraceIntegrity } from "./trace-integrity-validator.js";

export function validateHardenedRecommendation(decision) {
  const checks = [
    ...validateOutputConsistency(decision),
    ...validateDecisionExplanation(decision),
    ...validateDecisionRisk(decision),
    ...validateTraceIntegrity(decision),
  ];
  for (const code of decision.reasonCodes ?? []) {
    checks.push({ id: `RSN-${code}`, valid: Boolean(REASON_BY_CODE[code]), message: `Reason code registered: ${code}` });
  }
  if (decision.selectedModel) {
    const excludedCodes = new Set((decision.decisionTrace?.excluded ?? []).map((item) => item.modelCode));
    checks.push({ id: "SEL-001", valid: !excludedCodes.has(decision.selectedModel.modelCode), message: "Selected model must not be excluded." });
    checks.push({ id: "SEL-002", valid: decision.decisionTrace?.ranking?.[0]?.modelCode === decision.selectedModel.modelCode, message: "Selected model must match ranking leader." });
  }
  const blockingErrors = checks.filter((check) => !check.valid);
  return {
    valid: blockingErrors.length === 0,
    blockingErrors,
    warnings: [],
    checks,
  };
}
