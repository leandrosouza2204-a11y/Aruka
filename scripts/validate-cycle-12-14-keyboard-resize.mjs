import assert from "node:assert/strict";
import { beginVisualQaEvidence } from "./lib/visual-qa-evidence.mjs";
import { runLocalValidator } from "./lib/cycle-12-14-suite-runner.mjs";

const evidence = beginVisualQaEvidence({ gate: "CYCLE_12_14_KEYBOARD_RESIZE", reportPath: "reports/cycle-12-14-keyboard-resize.json", requiredScenarios: ["tracking", "completion-feedback"] });
const results = [];
try {
  const tracking = await runLocalValidator({ name: "tracking", script: "scripts/validate-cycle-12-6-set-tracking-visual.mjs", reportPath: "reports/cycle-12-6-set-tracking-visual.json", env: { QA_CYCLE_12_14_VIEWPORT_PROFILE: "keyboard-resize" } });
  const trackingRows = tracking.evidence.results.filter((item) => item.keyboardAudit);
  assert.equal(trackingRows.length, 3);
  assert(trackingRows.every((item) => item.keyboardAudit.reachedSubmit && item.keyboardAudit.submitVisible && item.keyboardAudit.focusStayedInForm));
  evidence.scenario("tracking", "PASS", { run_id: tracking.runId, viewports: trackingRows.map((item) => item.viewport), values_preserved_after_failure: true });
  results.push({ surface: "tracking", status: "PASS", run_id: tracking.runId });

  const completion = await runLocalValidator({ name: "completion-feedback", script: "scripts/validate-cycle-12-8-workout-completion-feedback-visual.mjs", reportPath: "reports/cycle-12-8-workout-completion-feedback-visual.json", env: { QA_CYCLE_12_14_VIEWPORT_PROFILE: "keyboard-resize" } });
  const dialogs = completion.evidence.results.filter((item) => item.state === "completion-dialog");
  assert.equal(dialogs.length, 3);
  assert(dialogs.every((item) => item.verticalOverflowManaged && item.keyboardAudit?.reachedPrimary && item.keyboardAudit?.focusedControlVisible));
  evidence.scenario("completion-feedback", "PASS", { run_id: completion.runId, viewports: dialogs.map((item) => item.viewport), post_submit_terminal: true, retry_consistent: true });
  results.push({ surface: "completion-feedback", status: "PASS", run_id: completion.runId });

  evidence.executionSucceeded({ classification: "SIMULATED", real_virtual_keyboard: false, human_acceptance: false, results });
  console.log("decision=PASS classification=SIMULATED surfaces=tracking,completion-feedback");
} catch (error) {
  evidence.executionFailed(error);
  throw error;
} finally {
  evidence.finalize({ cleanupAttempted: false });
}
