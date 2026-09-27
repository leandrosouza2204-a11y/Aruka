import { spawnSync } from "node:child_process";
import { beginVisualQaEvidence } from "./lib/visual-qa-evidence.mjs";

const suites = [
  "scripts/lib/visual-qa-evidence.test.mjs",
  "scripts/lib/browser-qa-runtime.test.mjs",
  "scripts/lib/cycle-12-14-viewport-matrix.test.mjs",
  "scripts/lib/cycle-12-14-suite-runner.test.mjs",
  "scripts/lib/cycle-12-14-network-matrix.test.mjs",
];
const evidence = beginVisualQaEvidence({ gate: "CYCLE_12_14_HARNESS_INTEGRITY", reportPath: "reports/cycle-12-14-harness-integrity.json", requiredScenarios: ["fault-injection", "fail-closed", "concurrency-isolation"] });
try {
  const run = spawnSync(process.execPath, ["--test", ...suites], { cwd: process.cwd(), encoding: "utf8", shell: false });
  process.stdout.write(run.stdout || "");
  process.stderr.write(run.stderr || "");
  if (run.status !== 0) throw new Error(`Harness integrity tests exited ${run.status}.`);
  evidence.scenario("fault-injection", "PASS", { transient_recovery: true, persistent_failure: true, functional_assertion_not_retried: true, product_error_remains_fail: true });
  evidence.scenario("fail-closed", "PASS", { stale_pass_rejected: true, current_run_id: true, current_head: true, timestamps: true, evidence_write_failure: true, non_pass_exit: true });
  evidence.scenario("concurrency-isolation", "PASS", { per_gate_lock: true, unique_temp_files: true, concurrent_evidence_not_mixed: true });
  evidence.executionSucceeded({ suites, test_output: (run.stdout || "").trim().split(/\r?\n/).slice(-8) });
  console.log("decision=PASS harness_integrity=PASS");
} catch (error) {
  evidence.executionFailed(error);
  throw error;
} finally {
  evidence.finalize({ cleanupAttempted: false });
}
