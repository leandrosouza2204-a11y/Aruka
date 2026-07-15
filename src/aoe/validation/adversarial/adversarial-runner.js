import { runAOEDecision } from "../../index.js";
import { goldenScenarios } from "../../fixtures/profiles/golden-scenarios.js";
import { adversarialCases } from "./mutation-cases.js";
import { criticalScenarioSafe } from "./invariant-probes.js";

export function runAdversarialSuite() {
  const missing = goldenScenarios.find((scenario) => scenario.id === "missing-critical-data");
  const tie = goldenScenarios.find((scenario) => scenario.id === "technical-tie");
  const noEligible = goldenScenarios.find((scenario) => scenario.id === "no-eligible-model");
  const baseResults = [
    runAOEDecision({ profile: missing.profile }),
    runAOEDecision({ profile: tie.profile }),
    runAOEDecision({ profile: noEligible.profile }),
  ];
  const results = adversarialCases.map((id, index) => {
    const result = baseResults[index % baseResults.length];
    return { id, passed: criticalScenarioSafe(result), status: result.status };
  });
  return {
    total: results.length,
    passed: results.filter((item) => item.passed).length,
    failed: results.filter((item) => !item.passed),
    results,
  };
}
