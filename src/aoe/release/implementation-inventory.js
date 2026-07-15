import fs from "node:fs";

const ITEMS = [
  ["domain", ["src/aoe/domain/enums.js"], ["tests/aoe/aoe-core.test.js"], ["docs/aoe/02_DOMAIN/AOE_DOMAIN_MODEL.md"]],
  ["contracts", ["src/aoe/public/index.js"], ["tests/aoe/application-service.test.js"], ["docs/aoe/20_APPLICATION_INTEGRATION/AOE_PUBLIC_INPUT_CONTRACT.md"]],
  ["rules", ["src/aoe/rules/index.js"], ["tests/aoe/aoe-core.test.js"], ["docs/aoe/13_RULE_CATALOG/AOE_RULE_CATALOG_V1.md"]],
  ["catalog", ["src/aoe/catalog/apl-catalog-adapter.js"], ["tests/aoe/catalog/catalog-adapter.test.js"], ["docs/aoe/18_APL_CATALOG_ADAPTER/README.md"]],
  ["scoring", ["src/aoe/engine/scoring-engine.js"], ["tests/aoe/aoe-core.test.js"], ["docs/aoe/14_SCORING_SPEC/AOE_SCORING_SPEC_V1.md"]],
  ["selection", ["src/aoe/engine/selection-engine.js"], ["tests/aoe/golden-scenarios.test.js"], ["docs/aoe/06_SELECTION/AOE_RANKING_AND_SELECTION.md"]],
  ["validation", ["src/aoe/validation/recommendation-hardening-validator.js"], ["tests/aoe/adversarial.test.js"], ["docs/aoe/19_RECOMMENDATION_HARDENING/AOE_HARDENING_VALIDATION.md"]],
  ["explainability", ["src/aoe/explainability/explanation-engine.js"], ["tests/aoe/explainability.test.js"], ["docs/aoe/19_RECOMMENDATION_HARDENING/AOE_EXPLAINABILITY_ENGINE.md"]],
  ["risk", ["src/aoe/risk/risk-engine.js"], ["tests/aoe/risk.test.js"], ["docs/aoe/19_RECOMMENDATION_HARDENING/AOE_DECISION_RISK_MODEL.md"]],
  ["review", ["src/aoe/review/human-review-gate.js"], ["tests/aoe/review.test.js"], ["docs/aoe/20_APPLICATION_INTEGRATION/AOE_HUMAN_REVIEW_WORKFLOW.md"]],
  ["application", ["src/aoe/application/aoe-application-service.js"], ["tests/aoe/application-service.test.js"], ["docs/aoe/20_APPLICATION_INTEGRATION/AOE_APPLICATION_SERVICE.md"]],
  ["persistence", ["src/aoe/persistence/index.js"], ["tests/aoe/persistence.test.js"], ["docs/aoe/20_APPLICATION_INTEGRATION/AOE_PERSISTENCE_CONTRACTS.md"]],
  ["idempotency", ["src/aoe/idempotency/idempotency-service.js"], ["tests/aoe/idempotency.test.js"], ["docs/aoe/20_APPLICATION_INTEGRATION/AOE_IDEMPOTENCY.md"]],
  ["security", ["src/aoe/security/authorization-policy.js"], ["tests/aoe/authorization.test.js"], ["docs/aoe/20_APPLICATION_INTEGRATION/AOE_AUTHORIZATION_MODEL.md"]],
  ["observability", ["src/aoe/observability/index.js"], ["tests/aoe/observability.test.js"], ["docs/aoe/20_APPLICATION_INTEGRATION/AOE_OBSERVABILITY.md"]],
  ["audit", ["src/aoe/audit/index.js"], ["tests/aoe/observability.test.js"], ["docs/aoe/20_APPLICATION_INTEGRATION/AOE_AUDIT_MODEL.md"]],
  ["CLI", ["scripts/aoe/app-cli.js"], ["tests/aoe/application-e2e.test.js"], ["docs/aoe/20_APPLICATION_INTEGRATION/README.md"]],
  ["tests", ["tests/aoe/aoe-core.test.js"], ["tests/aoe/application-e2e.test.js"], ["docs/aoe/11_TESTING/AOE_TEST_STRATEGY.md"]],
  ["documentation", ["docs/aoe/README.md"], ["tests/aoe/release-candidate/implementation-inventory.test.js"], ["docs/aoe/21_RELEASE_CANDIDATE/README.md"]],
];

function statusFor(files) {
  return files.every((file) => fs.existsSync(file)) ? "IMPLEMENTED" : "MISSING";
}

export function buildImplementationInventory() {
  return ITEMS.map(([component, sourceFiles, testFiles, documentationFiles]) => ({
    component,
    status: statusFor([...sourceFiles, ...testFiles, ...documentationFiles]),
    sourceFiles,
    testFiles,
    documentationFiles,
    version: component === "application" ? "1.6.0" : "1.0.0",
    notes: [],
  }));
}
