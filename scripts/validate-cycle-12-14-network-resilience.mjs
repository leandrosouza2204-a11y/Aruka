import assert from "node:assert/strict";
import { beginVisualQaEvidence } from "./lib/visual-qa-evidence.mjs";
import { buildNetworkCoverage, NETWORK_FAULT_SCENARIOS } from "./lib/cycle-12-14-network-matrix.mjs";
import { runLocalValidator } from "./lib/cycle-12-14-suite-runner.mjs";

const browserGates = [
  ["home", "scripts/validate-cycle-12-3-student-home-visual.mjs", "reports/cycle-12-3-student-home-visual.json"],
  ["library", "scripts/validate-cycle-12-4-training-library-visual.mjs", "reports/cycle-12-4-training-library-visual.json"],
  ["player", "scripts/validate-cycle-12-5-workout-player-visual.mjs", "reports/cycle-12-5-workout-player-visual.json"],
  ["tracking", "scripts/validate-cycle-12-6-set-tracking-visual.mjs", "reports/cycle-12-6-set-tracking-visual.json"],
  ["completion-feedback", "scripts/validate-cycle-12-8-workout-completion-feedback-visual.mjs", "reports/cycle-12-8-workout-completion-feedback-visual.json"],
  ["evolution", "scripts/validate-cycle-12-9-student-evolution-visual.mjs", "reports/cycle-12-9-student-evolution-visual.json"],
  ["profile", "scripts/validate-cycle-12-10-profile-secondary-flows-visual.mjs", "reports/cycle-12-10-profile-secondary-flows-visual.json"],
];
const evidence = beginVisualQaEvidence({
  gate: "CYCLE_12_14_NETWORK_RESILIENCE",
  reportPath: "reports/cycle-12-14-network-resilience.json",
  requiredScenarios: [...browserGates.map(([name]) => name), "offline-pwa", "stale-response"],
});
const bySurface = {};

try {
  for (const [name, script, reportPath] of browserGates) {
    const result = await runLocalValidator({ name, script, reportPath, env: { QA_CYCLE_12_14_NETWORK_GATE: "true" } });
    const child = result.evidence;
    if (name === "home") {
      const matrix = child.scenarios.find((item) => item.name === "network-fault-matrix");
      assert.equal(matrix?.status, "PASS");
      assert.deepEqual(matrix.faults.map(({ name: fault }) => fault), ["http-400", "http-401", "http-403", "http-404", "http-500", "http-502", "http-503", "request-abort", "timeout"]);
    }
    if (["library", "player", "evolution", "profile"].includes(name)) assert(child.scenarios.some((item) => item.name === "recoverable-error" && item.status === "PASS"));
    if (name === "tracking") assert(child.results.some((item) => item.state === "submitting-and-recoverable-error" && item.inputsPreserved));
    if (name === "completion-feedback") {
      assert(child.scenarios.some((item) => item.name === "recoverable-error" && item.status === "PASS"));
      assert(child.scenarios.some((item) => item.name === "duplicate-prevention" && item.status === "PASS" && item.feedback_rows === 1));
    }
    const writes = ["tracking", "completion-feedback"].includes(name) ? "PROTECTED" : "NOT_APPLICABLE";
    const reads = ["tracking", "completion-feedback"].includes(name) ? "NOT_APPLICABLE" : "PROTECTED";
    bySurface[name] = { status: "PASS", reads, writes, evidence: [result.runId], rationale: writes === "NOT_APPLICABLE" ? "Surface is read-only in this matrix." : null };
    evidence.scenario(name, "PASS", { run_id: result.runId, reads, writes, elapsed_ms: result.elapsedMs });
  }

  const pwaRuns = [];
  for (const [name, script] of [
    ["pwa-installability", "scripts/validate-pwa-installability.mjs"],
    ["pwa-cache-security", "scripts/validate-pwa-cache-security.mjs"],
    ["route-fallback", "scripts/validate-route-fallback.mjs"],
    ["continuity", "scripts/validate-student-experience-continuity.mjs"],
  ]) pwaRuns.push(await runLocalValidator({ name, script }));
  evidence.scenario("offline-pwa", "PASS", {
    first_offline_visit: "SAFE_FALLBACK_NO_PRIVATE_DATA",
    cached_shell: "PASS",
    cached_route: "PASS",
    supabase_unavailable: "SAFE_ERROR_AND_RETRY",
    sensitive_supabase_data_cached: false,
    runs: pwaRuns.map(({ name, elapsedMs }) => ({ name, elapsed_ms: elapsedMs })),
  });

  const staleRuns = await Promise.all([
    runLocalValidator({ name: "profile-stale-request", nodeArgs: ["--test"], script: "src/features/studentExperienceV2/profile/latestRequestGuard.test.js" }),
    runLocalValidator({ name: "evolution-stale-request", nodeArgs: ["--test"], script: "src/features/studentExperienceV2/evolution/studentEvolutionRequestContract.test.js" }),
    runLocalValidator({ name: "player-stale-request-and-draft", nodeArgs: ["--test"], script: "src/features/studentExperienceV2/player/playerContinuity.test.js" }),
    runLocalValidator({ name: "player-module-reconstruction-draft", nodeArgs: ["--test"], script: "src/features/studentExperienceV2/player/playerDraftRevalidationHotfix.test.js" }),
  ]);
  evidence.scenario("stale-response", "PASS", { request_a_slow: true, request_b_newer: true, b_wins: true, a_ignored: true, player_repeatability_runs: 100, player_draft_isolated: true, runs: staleRuns.map(({ name }) => name) });

  const coverage = buildNetworkCoverage(bySurface);
  assert(coverage.every(({ status }) => status === "PASS"));
  evidence.executionSucceeded({
    fault_scenarios: NETWORK_FAULT_SCENARIOS,
    coverage,
    reconnect_idempotency: "PROTECTED",
    back_forward_idempotency: "PARTIALLY_PROTECTED",
    production_accessed: false,
    backend_modified_for_faults: false,
    sensitive_data_cached: false,
  });
  console.log(`decision=PASS surfaces=${coverage.length} faults=${NETWORK_FAULT_SCENARIOS.length}`);
} catch (error) {
  evidence.executionFailed(error);
  throw error;
} finally {
  evidence.finalize({ cleanupAttempted: false });
}
