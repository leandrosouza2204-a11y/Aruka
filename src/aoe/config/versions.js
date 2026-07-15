export const AOE_VERSION = "1.4.0";
export const RULE_CATALOG_VERSION = "1.0.0";
export const SCORING_VERSION = "1.0.0";
export const CONFIDENCE_VERSION = "1.0.0";
export const CATALOG_ADAPTER_VERSION = "1.3.0";
export const EXPLAINABILITY_VERSION = "1.0.0";
export const RISK_MODEL_VERSION = "1.0.0";
export const HUMAN_REVIEW_POLICY_VERSION = "1.0.0";
export const VALIDATION_HARDENING_VERSION = "1.0.0";

export const APL_RELEASES = Object.freeze({
  SPRINT_01: "1.0.0",
  SPRINT_02: "2.0.0",
});

export function getVersionRegistry() {
  return Object.freeze({
    aoe: AOE_VERSION,
    ruleCatalog: RULE_CATALOG_VERSION,
    scoring: SCORING_VERSION,
    confidence: CONFIDENCE_VERSION,
    catalogAdapter: CATALOG_ADAPTER_VERSION,
    explainability: EXPLAINABILITY_VERSION,
    riskModel: RISK_MODEL_VERSION,
    humanReviewPolicy: HUMAN_REVIEW_POLICY_VERSION,
    validationHardening: VALIDATION_HARDENING_VERSION,
    aplReleases: { ...APL_RELEASES },
  });
}
