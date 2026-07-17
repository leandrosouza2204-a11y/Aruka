import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { DECISION, writeJsonReport, writeMarkdownReport } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const reset = spawnSync("node", ["scripts/reset-supabase-local-safe.mjs"], {
  cwd: root,
  encoding: "utf8",
  shell: false,
  timeout: 600000,
});
const result = JSON.parse(readFileSync("reports/supabase-local-seeds/safe-reset-result.json", "utf8"));
const ok = reset.status === 0 && result.result === "SAFE_RESET_VALIDATED";

writeJsonReport(root, "safe-reset-test-result.json", {
  cycle: "8",
  result: ok ? "SAFE_RESET_TEST_VALIDATED" : "SAFE_RESET_TEST_REJECTED",
  decision: ok ? DECISION : "LOCAL_SEEDS_AND_SAFE_RESET_REJECTED",
  reset_exit_code: reset.status,
  reset_timed_out: Boolean(reset.error && reset.error.code === "ETIMEDOUT"),
  safe_reset_result: result.result,
  primary_error: ok ? null : result.primary_error ?? reset.stderr ?? reset.stdout,
});
writeMarkdownReport(root, "safe-reset-test-summary.md", [
  "# Cycle 8 Safe Reset Test",
  "",
  `- Result: ${ok ? "SAFE_RESET_TEST_VALIDATED" : "SAFE_RESET_TEST_REJECTED"}`,
  `- Decision: ${ok ? DECISION : "LOCAL_SEEDS_AND_SAFE_RESET_REJECTED"}`,
  `- Reset exit code: ${reset.status}`,
  `- Primary error: ${ok ? "none" : result.primary_error ?? "reset failed"}`,
]);

if (!ok) process.exit(1);
console.log("SAFE_RESET_TEST_VALIDATED");
