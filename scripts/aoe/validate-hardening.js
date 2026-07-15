#!/usr/bin/env node
import fs from "node:fs";
import { runAOEDecision } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";
import { validateReasonCatalog } from "../../src/aoe/explainability/index.js";

const results = goldenScenarios.map((scenario) => {
  const decision = runAOEDecision({ profile: scenario.profile, options: { requestId: scenario.id } });
  return {
    id: scenario.id,
    status: decision.status,
    selectedModel: decision.selectedModel?.modelCode ?? null,
    risk: decision.risk,
    ambiguity: decision.ambiguity,
    review: decision.humanReview,
    validationValid: decision.validation.valid,
  };
});
const reasonCatalog = validateReasonCatalog();
const report = {
  version: "1.4.0",
  reasonCatalog,
  scenarios: results,
  valid: reasonCatalog.valid && results.every((item) => item.validationValid),
};
fs.mkdirSync("reports/aoe", { recursive: true });
fs.writeFileSync("reports/aoe/recommendation-hardening-report.json", JSON.stringify(report, null, 2));
fs.writeFileSync("reports/aoe/recommendation-hardening-report.md", `# AOE Recommendation Hardening Report\n\n- Version: 1.4.0\n- Reason catalog valid: ${reasonCatalog.valid}\n- Scenarios: ${results.length}\n- Valid scenarios: ${results.filter((item) => item.validationValid).length}\n\n${results.map((item) => `- ${item.id}: ${item.status}, risk ${item.risk.level}, review ${item.review.status}`).join("\n")}\n`);
fs.writeFileSync("reports/aoe/reason-catalog-report.json", JSON.stringify(reasonCatalog, null, 2));
fs.writeFileSync("reports/aoe/reason-catalog-report.md", `# AOE Reason Catalog Report\n\n- Valid: ${reasonCatalog.valid}\n- Errors: ${reasonCatalog.errors.length}\n`);
console.log(`hardening: ${report.valid ? "valid" : "invalid"} (${results.length} scenarios)`);
process.exit(report.valid ? 0 : 1);
