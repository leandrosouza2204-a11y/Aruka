import { DECISION_FINAL, DECISION_PREPARE, EXPECTED_BASELINE_SHA, BASELINE_PATH, readJson, run, sha256, writeJson, writeMarkdown } from "./supabase-cycle-9-1-lib.mjs";

const root = process.cwd();
const mode = process.argv.includes("--final") ? "final" : "prepare";
const errors = [];

function runStep(label, command, args) {
  const result = run(root, command, args, 120000);
  if (result.status !== 0) errors.push(`${label} failed: ${result.stderr || result.stdout}`);
  return result;
}

runStep("static", "node", ["scripts/validate-supabase-cycle-9-1-static.mjs"]);
runStep("repository safety", "node", ["scripts/validate-ci-repository-safety.mjs"]);
runStep("negative", "node", ["scripts/test-supabase-cycle-9-1-negative.mjs"]);

const runEvidence = readJson(root, "reports/supabase-ci-runtime/github-actions-run-result.json", {});
const artifacts = readJson(root, "reports/supabase-ci-runtime/github-actions-artifacts-result.json", {});
const cleanup = readJson(root, "reports/supabase-ci-runtime/github-actions-check-result.json", {});
const protection = readJson(root, "reports/supabase-ci-runtime/branch-protection-result.json", {});
const mergeBlock = readJson(root, "reports/supabase-ci-runtime/merge-block-negative-result.json", {});
const cycle9 = readJson(root, "reports/supabase-ci/cycle-9-result.json", {});
const cycle8 = readJson(root, "reports/supabase-local-seeds/cycle-8-result.json", {});
const wrapper = readJson(root, "reports/supabase-local-bootstrap/clean-worktree-wrapper-result.json", {});

if (sha256(root, BASELINE_PATH) !== EXPECTED_BASELINE_SHA) errors.push("Baseline SHA mismatch");
if (cycle9.result !== "CI_QUALITY_GATES_VALIDATED") errors.push("Cycle 9 regression evidence missing");
if (cycle8.result !== "LOCAL_SEEDS_AND_SAFE_RESET_VALIDATED") errors.push("Cycle 8 regression evidence missing");
if (wrapper.result !== "CLEAN_WORKTREE_WRAPPER_VALIDATED") errors.push("Cycle 7.2.1 wrapper evidence missing");

if (mode === "final") {
  if (runEvidence.result !== "GITHUB_ACTIONS_RUN_COLLECTED" || runEvidence.conclusion !== "success") errors.push("Real successful GitHub Actions run missing");
  if (artifacts.result !== "GITHUB_ACTIONS_ARTIFACTS_VALIDATED") errors.push("Artifacts not validated");
  if (cleanup.result !== "GITHUB_ACTIONS_CLEANUP_VALIDATED") errors.push("Cleanup not validated");
  if (!protection.validation || protection.validation.result !== "BRANCH_PROTECTION_VALIDATED") errors.push("Branch protection not validated");
  if (mergeBlock.result !== "MERGE_BLOCK_NEGATIVE_VALIDATED") errors.push("Merge-block negative evidence missing");
}

const finalApproved = mode === "final" && errors.length === 0;
const payload = {
  cycle: "9.1",
  mode,
  result: finalApproved ? DECISION_FINAL : DECISION_PREPARE,
  decision: finalApproved ? DECISION_FINAL : DECISION_PREPARE,
  github_actions_run_result: runEvidence.result ?? "PENDING_RUNTIME_EVIDENCE",
  artifacts_result: artifacts.result ?? "NOT_EXECUTED",
  cleanup_result: cleanup.result ?? "NOT_EXECUTED",
  branch_protection_result: protection.validation?.result ?? protection.result ?? "NOT_EXECUTED",
  merge_block_result: mergeBlock.result ?? "NOT_EXECUTED",
  baseline_sha_preserved: sha256(root, BASELINE_PATH) === EXPECTED_BASELINE_SHA,
  remote_access_performed: false,
  edge_functions_deployed: false,
  errors,
  primary_error: errors[0] ?? (finalApproved ? null : "Real GitHub Actions runtime evidence and branch protection validation are still required."),
};

writeJson(root, "cycle-9-1-result.json", payload);
writeMarkdown(root, "cycle-9-1-summary.md", [
  "# Cycle 9.1 Runtime and Branch Protection",
  "",
  `- Mode: ${mode}`,
  `- Result: ${payload.result}`,
  `- GitHub Actions run: ${payload.github_actions_run_result}`,
  `- Artifacts: ${payload.artifacts_result}`,
  `- Cleanup: ${payload.cleanup_result}`,
  `- Branch protection: ${payload.branch_protection_result}`,
  `- Merge block: ${payload.merge_block_result}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

console.log(payload.result);
if (mode === "final" && !finalApproved) process.exit(1);
