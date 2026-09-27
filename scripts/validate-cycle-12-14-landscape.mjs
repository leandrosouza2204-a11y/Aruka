import assert from "node:assert/strict";
import { beginVisualQaEvidence } from "./lib/visual-qa-evidence.mjs";
import { runLocalValidator } from "./lib/cycle-12-14-suite-runner.mjs";

const gates = [
  ["home", "scripts/validate-cycle-12-3-student-home-visual.mjs", "reports/cycle-12-3-student-home-visual.json"],
  ["library", "scripts/validate-cycle-12-4-training-library-visual.mjs", "reports/cycle-12-4-training-library-visual.json"],
  ["player", "scripts/validate-cycle-12-5-workout-player-visual.mjs", "reports/cycle-12-5-workout-player-visual.json"],
  ["timer", "scripts/validate-cycle-12-7-rest-timer-visual.mjs", "reports/cycle-12-7-rest-timer-visual.json"],
  ["completion-feedback", "scripts/validate-cycle-12-8-workout-completion-feedback-visual.mjs", "reports/cycle-12-8-workout-completion-feedback-visual.json"],
  ["evolution", "scripts/validate-cycle-12-9-student-evolution-visual.mjs", "reports/cycle-12-9-student-evolution-visual.json"],
  ["profile", "scripts/validate-cycle-12-10-profile-secondary-flows-visual.mjs", "reports/cycle-12-10-profile-secondary-flows-visual.json"],
];
const expected = ["640x320", "812x375", "844x390", "1024x768"];
const evidence = beginVisualQaEvidence({ gate: "CYCLE_12_14_LANDSCAPE", reportPath: "reports/cycle-12-14-landscape.json", requiredScenarios: gates.map(([name]) => name) });
const results = [];

try {
  for (const [name, script, reportPath] of gates) {
    const result = await runLocalValidator({ name, script, reportPath, env: { QA_CYCLE_12_14_VIEWPORT_PROFILE: "landscape" } });
    const viewportResults = result.evidence.results?.filter((item) => (item.viewport || item.name)?.startsWith("landscape-")) || [];
    const dimensions = [...new Set(viewportResults.map((item) => (item.viewport || item.name).replace("landscape-", "")))];
    assert(dimensions.length >= expected.length, `${name}: landscape evidence incomplete (${dimensions.join(",")})`);
    for (const viewport of expected) assert(dimensions.includes(viewport), `${name}: missing ${viewport}`);
    evidence.scenario(name, "PASS", { run_id: result.runId, viewports: dimensions, elapsed_ms: result.elapsedMs });
    results.push({ surface: name, status: "PASS", run_id: result.runId, viewports: dimensions });
  }
  evidence.executionSucceeded({ classification: "SIMULATED_BROWSER_LANDSCAPE", physical_device_acceptance: false, results });
  console.log(`decision=PASS surfaces=${results.map(({ surface }) => surface).join(",")}`);
} catch (error) {
  evidence.executionFailed(error);
  throw error;
} finally {
  evidence.finalize({ cleanupAttempted: false });
}
