import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import YAML from "yaml";
import { BASELINE_PATH, EXPECTED_BASELINE_SHA, WORKFLOW_FILE, sha256CanonicalText, writeJson, writeMarkdown } from "./supabase-cycle-9-1-lib.mjs";

const root = process.cwd();
const errors = [];
const requiredScripts = [
  "scripts/supabase-cycle-9-1-lib.mjs",
  "scripts/collect-github-actions-runtime-evidence.mjs",
  "scripts/download-supabase-ci-runtime-artifacts.mjs",
  "scripts/validate-github-actions-artifacts.mjs",
  "scripts/validate-github-actions-cleanup.mjs",
  "scripts/collect-branch-protection-evidence.mjs",
  "scripts/validate-branch-protection-evidence.mjs",
  "scripts/validate-supabase-cycle-9-1-static.mjs",
  "scripts/test-supabase-cycle-9-1-negative.mjs",
  "scripts/validate-supabase-cycle-9-1.mjs",
];
const requiredDocs = [
  "docs/supabase-infrastructure-refactor/49-github-actions-runtime-evidence.md",
  "docs/supabase-infrastructure-refactor/50-ci-controlled-failure-and-cleanup-proof.md",
  "docs/supabase-infrastructure-refactor/51-main-branch-protection-configuration.md",
  "docs/supabase-infrastructure-refactor/52-required-check-merge-block-validation.md",
  "docs/supabase-infrastructure-refactor/53-cycle-9-1-final-evidence.md",
];

for (const file of [...requiredScripts, ...requiredDocs]) {
  if (!existsSync(join(root, file))) errors.push(`Missing ${file}`);
}
if (!existsSync(join(root, "reports/supabase-ci-runtime"))) errors.push("Missing reports/supabase-ci-runtime");
if (sha256CanonicalText(root, BASELINE_PATH) !== EXPECTED_BASELINE_SHA) errors.push("Baseline SHA mismatch");

try {
  const workflow = YAML.parse(readFileSync(join(root, WORKFLOW_FILE), "utf8"));
  const job = workflow.jobs?.validation;
  if (workflow.permissions?.contents !== "read") errors.push("Workflow permissions changed");
  if (job?.["runs-on"] !== "ubuntu-latest") errors.push("Runner changed");
  if (String(job?.steps?.find((step) => step.uses === "actions/setup-node@v4")?.with?.["node-version"]) !== "22") errors.push("Node 22 not preserved");
  if (!JSON.stringify(workflow).includes("supabase@2.109.1")) errors.push("Supabase CLI 2.109.1 not preserved");
  if (!JSON.stringify(workflow).includes("always()")) errors.push("Cleanup always condition not preserved");
} catch (error) {
  errors.push(`Workflow YAML invalid: ${error.message}`);
}

const payload = {
  cycle: "9.1",
  result: errors.length ? "CYCLE_9_1_STATIC_REJECTED" : "CYCLE_9_1_STATIC_VALIDATED",
  decision: errors.length ? "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED" : "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED",
  errors,
  primary_error: errors[0] ?? null,
};

writeJson(root, "cycle-9-1-static-result.json", payload);
writeMarkdown(root, "cycle-9-1-static-summary.md", [
  "# Cycle 9.1 Static Validation",
  "",
  `- Result: ${payload.result}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("CYCLE_9_1_STATIC_VALIDATED");
