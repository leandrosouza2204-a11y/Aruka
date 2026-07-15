export const AOE_VERSION = "1.7.0";
export const RULE_CATALOG_VERSION = "1.0.0";
export const SCORING_VERSION = "1.0.0";
export const CONFIDENCE_VERSION = "1.0.0";
export const CATALOG_ADAPTER_VERSION = "1.3.0";
export const EXPLAINABILITY_VERSION = "1.0.0";
export const RISK_MODEL_VERSION = "1.0.0";
export const HUMAN_REVIEW_POLICY_VERSION = "1.0.0";
export const VALIDATION_HARDENING_VERSION = "1.0.0";
export const INFRASTRUCTURE_ADAPTERS_VERSION = "1.0.0";
export const PERSISTENCE_ADAPTER_VERSION = "1.0.0";
export const HTTP_BOUNDARY_VERSION = "1.0.0";
export const PILOT_VERSION = "1.0.0";
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
    publicContract: "1.0.0-rc.1",
    applicationService: "1.7.0",
    infrastructureAdapters: INFRASTRUCTURE_ADAPTERS_VERSION,
    persistenceAdapter: PERSISTENCE_ADAPTER_VERSION,
    httpBoundary: HTTP_BOUNDARY_VERSION,
    pilot: PILOT_VERSION,
    persistenceContract: "1.0.0",
    auditContract: "1.0.0",
    observabilityContract: "1.0.0",
    humanReviewContract: "1.0.0",
    aplReleases: { ...APL_RELEASES },
  });
}
