import { CYCLE_9_DECISION, runCommand, writeJsonReport, writeMarkdownReport } from "./supabase-cycle-9-lib.mjs";

const root = process.cwd();
const steps = [
  ["repository_safety", "node", ["scripts/validate-ci-repository-safety.mjs", "--write-report"]],
  ["ci_negative", "node", ["scripts/test-supabase-ci-negative.mjs"]],
  ["ci_evidence", "node", ["scripts/validate-supabase-ci-evidence.mjs"]],
  ["cycle_9", "node", ["scripts/validate-supabase-cycle-9.mjs"]],
];

const results = [];
for (const [name, command, args] of steps) {
  const result = runCommand(root, command, args, 120000);
  results.push({ name, exit_code: result.status, timed_out: result.timed_out });
  if (result.status !== 0) break;
}

const ok = results.length === steps.length && results.every((item) => item.exit_code === 0 && !item.timed_out);
const payload = {
  cycle: "9",
  result: ok ? "CI_LOCAL_RUNNER_VALIDATED" : "CI_LOCAL_RUNNER_REJECTED",
  decision: ok ? CYCLE_9_DECISION : "CI_QUALITY_GATES_REJECTED",
  steps: results,
  remote_access_performed: false,
  edge_functions_deployed: false,
  primary_error: ok ? null : "Local CI equivalent runner failed",
};

writeJsonReport(root, "ci-local-runner-result.json", payload);
writeMarkdownReport(root, "ci-local-runner-summary.md", [
  "# CI Local Equivalent Runner",
  "",
  `- Result: ${payload.result}`,
  `- Decision: ${payload.decision}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
  "",
  "| Step | Exit Code | Timed Out |",
  "| --- | ---: | --- |",
  ...results.map((item) => `| ${item.name} | ${item.exit_code} | ${item.timed_out ? "yes" : "no"} |`),
]);

if (!ok) process.exit(1);
console.log("CI_LOCAL_RUNNER_VALIDATED");
