import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { DECISION_FINAL, DECISION_PREPARE, readJson, writeJson, writeMarkdown } from "./supabase-cycle-9-1-lib.mjs";

const root = process.cwd();
const run = readJson(root, "reports/supabase-ci-runtime/github-actions-run-result.json", {});
const errors = [];

function artifactRoot() {
  const base = join(root, "reports/supabase-ci-runtime/downloaded-artifacts");
  if (!existsSync(base)) return null;
  return readdirSync(base)
    .map((name) => ({ name, full: join(base, name) }))
    .filter((entry) => entry.name.startsWith("supabase-quality-evidence") && statSync(entry.full).isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name))[0]?.name ?? null;
}

const evidenceRoot = artifactRoot();
const artifactCleanup = evidenceRoot
  ? readJson(root, `reports/supabase-ci-runtime/downloaded-artifacts/${evidenceRoot}/reports/supabase-ci/ci-cleanup-result.json`, null)
  : null;

const cleanupStep = (run.jobs ?? []).flatMap((job) => job.steps ?? []).find((step) => step.name === "Cleanup");
if (!run.run_id || run.conclusion !== "success") errors.push("Successful real workflow run is required");
if (!cleanupStep) errors.push("Cleanup step evidence is missing");
if (cleanupStep && cleanupStep.conclusion !== "success") errors.push("Cleanup step did not finish successfully");
if (artifactCleanup?.result !== "CI_CLEANUP_VALIDATED") errors.push("Cleanup artifact is not validated");
if (artifactCleanup?.global_prune_used !== false) errors.push("Cleanup used global prune");

const payload = {
  cycle: "9.1",
  result: errors.length ? "GITHUB_ACTIONS_CLEANUP_PENDING" : "GITHUB_ACTIONS_CLEANUP_VALIDATED",
  decision: errors.length ? DECISION_PREPARE : DECISION_FINAL,
  cleanup_step_found: Boolean(cleanupStep),
  cleanup_conclusion: cleanupStep?.conclusion ?? null,
  evidence_artifact_directory: evidenceRoot,
  cleanup_artifact_result: artifactCleanup?.result ?? null,
  cleanup_always_configured: true,
  primary_error: errors[0] ?? null,
};

writeJson(root, "github-actions-check-result.json", payload);
writeMarkdown(root, "github-actions-check-summary.md", [
  "# GitHub Actions Cleanup and Check Evidence",
  "",
  `- Result: ${payload.result}`,
  `- Cleanup step: ${payload.cleanup_conclusion ?? "pending"}`,
  `- Cleanup artifact: ${payload.cleanup_artifact_result ?? "pending"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (errors.length) process.exit(1);
console.log("GITHUB_ACTIONS_CLEANUP_VALIDATED");
