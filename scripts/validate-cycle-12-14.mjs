import { beginVisualQaEvidence } from "./lib/visual-qa-evidence.mjs";
import { runLocalValidator } from "./lib/cycle-12-14-suite-runner.mjs";

const gates = [
  ["harness-integrity", "scripts/validate-cycle-12-14-harness-integrity.mjs", "reports/cycle-12-14-harness-integrity.json"],
  ["landscape", "scripts/validate-cycle-12-14-landscape.mjs", "reports/cycle-12-14-landscape.json"],
  ["keyboard-resize", "scripts/validate-cycle-12-14-keyboard-resize.mjs", "reports/cycle-12-14-keyboard-resize.json"],
  ["keyboard-focus", "scripts/validate-cycle-12-14-keyboard-focus.mjs", "reports/cycle-12-14-keyboard-focus.json"],
  ["network-resilience", "scripts/validate-cycle-12-14-network-resilience.mjs", "reports/cycle-12-14-network-resilience.json"],
];
const evidence = beginVisualQaEvidence({ gate: "CYCLE_12_14", reportPath: "reports/cycle-12-14.json", requiredScenarios: gates.map(([name]) => name) });
const results = [];
try {
  for (const [name, script, reportPath] of gates) {
    const result = await runLocalValidator({ name, script, reportPath });
    evidence.scenario(name, "PASS", { run_id: result.runId, elapsed_ms: result.elapsedMs });
    results.push({ gate: name, run_id: result.runId, status: "PASS" });
  }
  evidence.executionSucceeded({ results, rollout_state: "OFF", environment: "LOCAL", production_accessed: false });
  console.log(`decision=PASS gates=${results.length} rollout=OFF`);
} catch (error) {
  evidence.executionFailed(error);
  throw error;
} finally {
  evidence.finalize({ cleanupAttempted: false });
}
