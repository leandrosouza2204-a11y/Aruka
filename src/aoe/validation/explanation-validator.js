import { validateExplanation } from "../explainability/index.js";

export function validateDecisionExplanation(decision) {
  const result = validateExplanation(decision.explanation);
  return [
    { id: "EXP-001", valid: result.valid, message: result.valid ? "Explanation complete." : `Explanation missing: ${result.missing.join(", ")}` },
    { id: "EXP-002", valid: !/garante|diagn[oó]stic/i.test(decision.explanation?.summary ?? ""), message: "Explanation must not promise results or diagnose." },
  ];
}
