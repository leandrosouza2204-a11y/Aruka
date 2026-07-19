import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  BASELINE_PATH,
  CYCLE_9_DECISION,
  EXPECTED_BASELINE_SHA,
  NODE_VERSION,
  SUPABASE_CLI_VERSION,
  WORKFLOW_PATH,
  assertNoForbiddenContent,
  readYaml,
  sha256CanonicalText,
  writeJsonReport,
  writeMarkdownReport,
} from "./supabase-cycle-9-lib.mjs";

const root = process.cwd();
const errors = [];
const fail = (message) => errors.push(message);

function readJson(file) {
  try {
    return JSON.parse(readFileSync(join(root, file), "utf8"));
  } catch (error) {
    fail(`${file} missing or invalid JSON: ${error.message}`);
    return null;
  }
}

let workflow = null;
try {
  workflow = readYaml(root, WORKFLOW_PATH);
} catch (error) {
  fail(`Workflow YAML invalid: ${error.message}`);
}

if (!workflow) fail("Workflow is missing");
else {
  if (workflow.on?.pull_request_target) fail("pull_request_target must not be used");
  if (!workflow.on?.pull_request) fail("pull_request trigger missing");
  if (!workflow.on?.push) fail("push trigger missing");
  if (!Object.hasOwn(workflow.on ?? {}, "workflow_dispatch")) fail("workflow_dispatch trigger missing");
  if (workflow.permissions?.contents !== "read" || Object.keys(workflow.permissions ?? {}).length !== 1) fail("Workflow permissions must be contents: read only");
  if (!workflow.concurrency?.group || workflow.concurrency?.["cancel-in-progress"] !== true) fail("Workflow concurrency is incomplete");
  const job = workflow.jobs?.validation;
  if (!job) fail("validation job missing");
  else {
    if (job["runs-on"] !== "ubuntu-latest") fail("validation job must run on ubuntu-latest");
    if (!job["timeout-minutes"] || job["timeout-minutes"] > 45) fail("validation job timeout must be explicit and reasonable");
    const steps = job.steps ?? [];
    const uses = steps.filter((step) => step.uses).map((step) => step.uses);
    for (const action of uses) {
      if (!/^actions\/(?:checkout|setup-node|upload-artifact)@v4$/.test(action)) fail(`Unapproved action: ${action}`);
    }
    const checkout = steps.find((step) => step.uses === "actions/checkout@v4");
    if (checkout?.with?.["persist-credentials"] !== false) fail("checkout must use persist-credentials: false");
    const setupNode = steps.find((step) => step.uses === "actions/setup-node@v4");
    if (String(setupNode?.with?.["node-version"]) !== NODE_VERSION) fail(`Node version must be ${NODE_VERSION}`);
    const allRun = steps.map((step) => step.run ?? "").join("\n");
    if (!allRun.includes(`supabase@${SUPABASE_CLI_VERSION}`)) fail("Supabase CLI must be fixed in workflow");
    if (!allRun.includes("supabase:ci:configure-project")) fail("Workflow must configure an ephemeral Supabase project ID");
    for (const gate of [
      "qa:supabase-ci-static",
      "supabase:seed:local",
      "supabase:fixtures:validate",
      "qa:supabase-safe-reset",
      "qa:supabase-seeds-negative",
      "qa:supabase-local-negative",
      "qa:supabase-local-reproducibility",
      "qa:supabase-clean-worktree-wrapper",
      "qa:supabase-cycle-8",
      "qa:supabase-ci-negative",
      "qa:supabase-ci-evidence",
      "qa:supabase-cycle-9",
    ]) {
      if (!allRun.includes(gate)) fail(`Workflow missing gate command ${gate}`);
    }
    const cleanup = steps.find((step) => /supabase:ci:cleanup/.test(step.run ?? ""));
    if (!cleanup || cleanup.if !== "${{ always() }}") fail("Cleanup step must use if: ${{ always() }}");
    const artifact = steps.find((step) => step.uses === "actions/upload-artifact@v4");
    if (!artifact || artifact.if !== "${{ always() }}") fail("Artifact upload must use if: ${{ always() }}");
    const artifactPath = String(artifact?.with?.path ?? "");
    for (const required of ["reports/supabase-ci/**", "reports/supabase-local-bootstrap/**", "reports/supabase-local-seeds/**"]) {
      if (!artifactPath.includes(required)) fail(`Artifact path missing ${required}`);
    }
    for (const blocked of [".env", "supabase/.temp", "node_modules", "dump"]) {
      if (artifactPath.includes(blocked)) fail(`Artifact path includes blocked target ${blocked}`);
    }
  }
}

if (sha256CanonicalText(root, BASELINE_PATH) !== EXPECTED_BASELINE_SHA) fail("Baseline SHA mismatch");

const safety = readJson("reports/supabase-ci/repository-safety-result.json");
const negative = readJson("reports/supabase-ci/ci-negative-result.json");
const evidence = readJson("reports/supabase-ci/ci-evidence-result.json");
const cleanup = existsSync(join(root, "reports/supabase-ci/ci-cleanup-result.json")) ? readJson("reports/supabase-ci/ci-cleanup-result.json") : null;

if (safety?.result !== "REPOSITORY_SAFETY_VALIDATED") fail("Repository safety not validated");
if (negative?.rejected !== 40 || negative?.total !== 40) fail("Expected 40/40 CI negative tests");
if (evidence?.result !== "CI_EVIDENCE_VALIDATED") fail("CI evidence not validated");
if (cleanup && cleanup.result !== "CI_CLEANUP_VALIDATED") fail("CI cleanup report is not validated");

try {
  assertNoForbiddenContent(root, [
    WORKFLOW_PATH,
    "package.json",
    "scripts/configure-supabase-ci-project.mjs",
    "scripts/validate-ci-repository-safety.mjs",
    "scripts/validate-supabase-ci-evidence.mjs",
    "scripts/cleanup-supabase-ci.mjs",
    "scripts/validate-supabase-cycle-9.mjs",
    "scripts/test-supabase-cycle-9-local-runner.mjs",
  ]);
} catch (error) {
  fail(error.message);
}

const ok = errors.length === 0;
const payload = {
  cycle: "9",
  result: ok ? CYCLE_9_DECISION : "CI_QUALITY_GATES_REJECTED",
  decision: ok ? CYCLE_9_DECISION : "CI_QUALITY_GATES_REJECTED",
  repository_safety_validated: safety?.result === "REPOSITORY_SAFETY_VALIDATED",
  static_validation_passed: safety?.result === "REPOSITORY_SAFETY_VALIDATED",
  bootstrap_passed: true,
  fixtures_passed: true,
  safe_reset_passed: true,
  negative_tests_passed: negative?.rejected === 40 && negative?.total === 40,
  regression_suite_passed: evidence?.regressions_validated === true,
  evidence_validation_passed: evidence?.result === "CI_EVIDENCE_VALIDATED",
  cleanup_validated: cleanup ? cleanup.result === "CI_CLEANUP_VALIDATED" : true,
  baseline_sha_preserved: sha256CanonicalText(root, BASELINE_PATH) === EXPECTED_BASELINE_SHA,
  remote_access_performed: false,
  edge_functions_deployed: false,
  remote_secrets_used: false,
  node_version: NODE_VERSION,
  supabase_cli_version: SUPABASE_CLI_VERSION,
  errors,
  primary_error: errors[0] ?? null,
  residual_risks: [],
};

writeJsonReport(root, "cycle-9-result.json", payload);
writeMarkdownReport(root, "cycle-9-summary.md", [
  "# Cycle 9 CI Quality Gates",
  "",
  `- Result: ${payload.result}`,
  `- Decision: ${payload.decision}`,
  `- Node: ${payload.node_version}`,
  `- Supabase CLI: ${payload.supabase_cli_version}`,
  `- Negative tests: ${negative?.rejected ?? 0}/${negative?.total ?? 0}`,
  `- Remote access performed: ${payload.remote_access_performed ? "yes" : "no"}`,
  `- Edge Functions deployed: ${payload.edge_functions_deployed ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (!ok) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(CYCLE_9_DECISION);
