#!/usr/bin/env node
import { runAOEDecision, activeAplCatalog } from "../../src/aoe/index.js";
import { goldenScenarios } from "../../src/aoe/fixtures/profiles/golden-scenarios.js";

const scenarioId = process.argv[2] ?? "beginner-3d-60-full-gym";
const scenario = goldenScenarios.find((item) => item.id === scenarioId);

if (!scenario) {
  console.error(`Unknown scenario: ${scenarioId}`);
  process.exit(1);
}

const result = runAOEDecision({
  profile: scenario.profile,
  catalog: activeAplCatalog,
  options: { requestId: `inspect-${scenarioId}`, now: "2026-07-15T00:00:00.000Z" },
});

console.log(JSON.stringify(result.decisionTrace, null, 2));
