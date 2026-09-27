import assert from "node:assert/strict";
import { beginVisualQaEvidence } from "./lib/visual-qa-evidence.mjs";
import { runLocalValidator } from "./lib/cycle-12-14-suite-runner.mjs";

const gates = [
  ["home-library-detail", "scripts/validate-cycle-12-4-training-library-visual.mjs", "reports/cycle-12-4-training-library-visual.json"],
  ["player", "scripts/validate-cycle-12-5-workout-player-visual.mjs", "reports/cycle-12-5-workout-player-visual.json"],
  ["tracking", "scripts/validate-cycle-12-6-set-tracking-visual.mjs", "reports/cycle-12-6-set-tracking-visual.json"],
  ["completion-feedback", "scripts/validate-cycle-12-8-workout-completion-feedback-visual.mjs", "reports/cycle-12-8-workout-completion-feedback-visual.json"],
  ["evolution", "scripts/validate-cycle-12-9-student-evolution-visual.mjs", "reports/cycle-12-9-student-evolution-visual.json"],
  ["profile", "scripts/validate-cycle-12-10-profile-secondary-flows-visual.mjs", "reports/cycle-12-10-profile-secondary-flows-visual.json"],
];
const evidence = beginVisualQaEvidence({ gate: "CYCLE_12_14_KEYBOARD_FOCUS", reportPath: "reports/cycle-12-14-keyboard-focus.json", requiredScenarios: gates.map(([name]) => name) });
const results = [];
try {
  for (const [name, script, reportPath] of gates) {
    const result = await runLocalValidator({ name, script, reportPath });
    const payload = result.evidence;
    if (name === "home-library-detail") assert(payload.results.some((item) => item.state === "home-to-training-keyboard") && payload.results.some((item) => item.focus === "heading"));
    if (name === "player") assert(payload.results.some((item) => item.state === "switch-dialog-keyboard" && item.escape === "PASS" && item.focusReturn === "PASS"));
    if (name === "tracking") assert(payload.results.some((item) => item.keyboardAudit?.reachedSubmit && item.keyboardAudit?.focusVisible));
    if (name === "completion-feedback") assert(payload.scenarios.some((item) => item.name === "completion-dialog-keyboard" && item.status === "PASS"));
    if (name === "evolution") assert(payload.results.some((item) => item.keyboardFocus));
    if (name === "profile") assert(payload.scenarios.some((item) => item.name === "keyboard-focus" && item.status === "PASS"));
    evidence.scenario(name, "PASS", { run_id: result.runId, elapsed_ms: result.elapsedMs });
    results.push({ segment: name, status: "PASS", run_id: result.runId });
  }
  evidence.executionSucceeded({ classification: "AUTOMATED_KEYBOARD_PASS", human_keyboard_acceptance: false, journey: ["Home", "Library", "detail", "Player", "tracking", "completion-feedback", "Evolution", "Profile"], results });
  console.log("decision=PASS classification=AUTOMATED_KEYBOARD_PASS human_acceptance=false");
} catch (error) {
  evidence.executionFailed(error);
  throw error;
} finally {
  evidence.finalize({ cleanupAttempted: false });
}
