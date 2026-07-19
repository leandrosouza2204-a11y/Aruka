import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { DECISION_FINAL, DECISION_PREPARE, EXPECTED_BASELINE_SHA, readJson, scanUnsafeText, writeJson, writeMarkdown } from "./supabase-cycle-9-1-lib.mjs";

const root = process.cwd();
const base = "reports/supabase-ci-runtime/downloaded-artifacts";
const errors = [];

function artifactRoot() {
  const fullBase = join(root, base);
  if (!existsSync(fullBase)) {
    errors.push(`Missing artifact directory ${base}`);
    return null;
  }
  const candidates = readdirSync(fullBase)
    .map((name) => ({ name, full: join(fullBase, name) }))
    .filter((entry) => entry.name.startsWith("supabase-quality-evidence") && statSync(entry.full).isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));
  if (!candidates.length) {
    errors.push("Missing supabase-quality-evidence artifact directory");
    return null;
  }
  return candidates[0].name;
}

function artifactJson(path) {
  const full = join(root, base, path);
  if (!existsSync(full)) {
    errors.push(`Missing artifact file ${path}`);
    return null;
  }
  try {
    const text = readFileSync(full, "utf8").replace(/^\uFEFF/, "");
    const findings = scanUnsafeText(text);
    if (findings.length) errors.push(`${path} contains unsafe content: ${findings.join(", ")}`);
    return JSON.parse(text);
  } catch (error) {
    errors.push(`${path} invalid JSON: ${error.message}`);
    return null;
  }
}

const run = readJson(root, "reports/supabase-ci-runtime/github-actions-run-result.json", {});
if (!run?.run_id || run?.conclusion !== "success") errors.push("Real successful GitHub Actions run evidence is missing");

const evidenceRoot = artifactRoot();
const cycle9 = evidenceRoot ? artifactJson(`${evidenceRoot}/reports/supabase-ci/cycle-9-result.json`) : null;
const staticResult = evidenceRoot ? artifactJson(`${evidenceRoot}/reports/supabase-ci/ci-static-result.json`) : null;
const cleanup = evidenceRoot ? artifactJson(`${evidenceRoot}/reports/supabase-ci/ci-cleanup-result.json`) : null;
const cycle8 = evidenceRoot ? artifactJson(`${evidenceRoot}/reports/supabase-local-seeds/cycle-8-result.json`) : null;
const safeReset = evidenceRoot ? artifactJson(`${evidenceRoot}/reports/supabase-local-seeds/safe-reset-test-result.json`) : null;
const localRepro = evidenceRoot ? artifactJson(`${evidenceRoot}/reports/supabase-local-bootstrap/reproducibility-result.json`) : null;

if (cycle9?.result !== "CI_QUALITY_GATES_VALIDATED") errors.push("Cycle 9 artifact is not validated");
if (staticResult?.result !== "CI_STATIC_VALIDATED") errors.push("CI static artifact is not validated");
if (cleanup?.result !== "CI_CLEANUP_VALIDATED") errors.push("Cleanup artifact is not validated");
if (cycle8?.result !== "LOCAL_SEEDS_AND_SAFE_RESET_VALIDATED") errors.push("Cycle 8 artifact is not validated");
if (safeReset?.result !== "SAFE_RESET_TEST_VALIDATED") errors.push("Safe reset test artifact is not validated");
if (cycle8?.baseline_sha !== EXPECTED_BASELINE_SHA) errors.push("Baseline SHA mismatch in artifacts");

const payload = {
  cycle: "9.1",
  result: errors.length ? "GITHUB_ACTIONS_ARTIFACTS_PENDING" : "GITHUB_ACTIONS_ARTIFACTS_VALIDATED",
  decision: errors.length ? DECISION_PREPARE : DECISION_FINAL,
  artifacts_validated: errors.length === 0,
  evidence_artifact_directory: evidenceRoot,
  baseline_sha_preserved: !errors.some((error) => /Baseline SHA/.test(error)),
  unsafe_content_found: errors.some((error) => /unsafe content/.test(error)),
  errors,
  primary_error: errors[0] ?? null,
};

writeJson(root, "github-actions-artifacts-result.json", payload);
writeMarkdown(root, "github-actions-artifacts-summary.md", [
  "# GitHub Actions Artifact Validation",
  "",
  `- Result: ${payload.result}`,
  `- Artifacts validated: ${payload.artifacts_validated ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (errors.length) process.exit(1);
console.log("GITHUB_ACTIONS_ARTIFACTS_VALIDATED");
