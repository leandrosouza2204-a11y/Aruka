# Full Regression Report

- Status: PASS
- Generated at: 2026-07-15T00:00:00.000Z

```json
{
  "status": "PASS",
  "goldenScenarios": 15,
  "testsExpectedFromNpm": true,
  "inventory": [
    {
      "component": "domain",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/domain/enums.js"
      ],
      "testFiles": [
        "tests/aoe/aoe-core.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/02_DOMAIN/AOE_DOMAIN_MODEL.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "contracts",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/public/index.js"
      ],
      "testFiles": [
        "tests/aoe/application-service.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/20_APPLICATION_INTEGRATION/AOE_PUBLIC_INPUT_CONTRACT.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "rules",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/rules/index.js"
      ],
      "testFiles": [
        "tests/aoe/aoe-core.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/13_RULE_CATALOG/AOE_RULE_CATALOG_V1.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "catalog",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/catalog/apl-catalog-adapter.js"
      ],
      "testFiles": [
        "tests/aoe/catalog/catalog-adapter.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/18_APL_CATALOG_ADAPTER/README.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "scoring",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/engine/scoring-engine.js"
      ],
      "testFiles": [
        "tests/aoe/aoe-core.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/14_SCORING_SPEC/AOE_SCORING_SPEC_V1.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "selection",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/engine/selection-engine.js"
      ],
      "testFiles": [
        "tests/aoe/golden-scenarios.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/06_SELECTION/AOE_RANKING_AND_SELECTION.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "validation",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/validation/recommendation-hardening-validator.js"
      ],
      "testFiles": [
        "tests/aoe/adversarial.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/19_RECOMMENDATION_HARDENING/AOE_HARDENING_VALIDATION.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "explainability",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/explainability/explanation-engine.js"
      ],
      "testFiles": [
        "tests/aoe/explainability.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/19_RECOMMENDATION_HARDENING/AOE_EXPLAINABILITY_ENGINE.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "risk",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/risk/risk-engine.js"
      ],
      "testFiles": [
        "tests/aoe/risk.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/19_RECOMMENDATION_HARDENING/AOE_DECISION_RISK_MODEL.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "review",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/review/human-review-gate.js"
      ],
      "testFiles": [
        "tests/aoe/review.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/20_APPLICATION_INTEGRATION/AOE_HUMAN_REVIEW_WORKFLOW.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "application",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/application/aoe-application-service.js"
      ],
      "testFiles": [
        "tests/aoe/application-service.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/20_APPLICATION_INTEGRATION/AOE_APPLICATION_SERVICE.md"
      ],
      "version": "1.6.0",
      "notes": []
    },
    {
      "component": "persistence",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/persistence/index.js"
      ],
      "testFiles": [
        "tests/aoe/persistence.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/20_APPLICATION_INTEGRATION/AOE_PERSISTENCE_CONTRACTS.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "idempotency",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/idempotency/idempotency-service.js"
      ],
      "testFiles": [
        "tests/aoe/idempotency.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/20_APPLICATION_INTEGRATION/AOE_IDEMPOTENCY.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "security",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/security/authorization-policy.js"
      ],
      "testFiles": [
        "tests/aoe/authorization.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/20_APPLICATION_INTEGRATION/AOE_AUTHORIZATION_MODEL.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "observability",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/observability/index.js"
      ],
      "testFiles": [
        "tests/aoe/observability.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/20_APPLICATION_INTEGRATION/AOE_OBSERVABILITY.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "audit",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "src/aoe/audit/index.js"
      ],
      "testFiles": [
        "tests/aoe/observability.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/20_APPLICATION_INTEGRATION/AOE_AUDIT_MODEL.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "CLI",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "scripts/aoe/app-cli.js"
      ],
      "testFiles": [
        "tests/aoe/application-e2e.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/20_APPLICATION_INTEGRATION/README.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "tests",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "tests/aoe/aoe-core.test.js"
      ],
      "testFiles": [
        "tests/aoe/application-e2e.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/11_TESTING/AOE_TEST_STRATEGY.md"
      ],
      "version": "1.0.0",
      "notes": []
    },
    {
      "component": "documentation",
      "status": "IMPLEMENTED",
      "sourceFiles": [
        "docs/aoe/README.md"
      ],
      "testFiles": [
        "tests/aoe/release-candidate/implementation-inventory.test.js"
      ],
      "documentationFiles": [
        "docs/aoe/21_RELEASE_CANDIDATE/README.md"
      ],
      "version": "1.0.0",
      "notes": []
    }
  ]
}
```
