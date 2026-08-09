import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CYCLE_9_DECISION,
  EXPECTED_BASELINE_SHA,
  assertNoForbiddenContent,
  listFiles,
  writeJsonReport,
  writeMarkdownReport,
} from "./supabase-cycle-9-lib.mjs";

const root = process.cwd();
const errors = [];
function readJson(file) {
  try {
    return JSON.parse(readFileSync(join(root, file), "utf8"));
  } catch (error) {
    errors.push(`${file} missing or invalid JSON: ${error.message}`);
    return null;
  }
}

const safety = readJson("reports/supabase-ci/repository-safety-result.json");
const cycle8 = readJson("reports/supabase-local-seeds/cycle-8-result.json");
const negativeSeeds = readJson("reports/supabase-local-seeds/negative-seeds-result.json");
const localNegative = readJson("reports/supabase-local-bootstrap/negative-mutations-result.json");
const wrapper = readJson("reports/supabase-local-bootstrap/clean-worktree-wrapper-result.json");

if (safety?.result !== "REPOSITORY_SAFETY_VALIDATED") errors.push("Repository safety report is not validated");
if (cycle8?.result !== "LOCAL_SEEDS_AND_SAFE_RESET_VALIDATED") errors.push("Cycle 8 report is not validated");
if (cycle8?.baseline_sha !== EXPECTED_BASELINE_SHA) errors.push("Cycle 8 baseline SHA mismatch");
if (cycle8?.migration_history?.[0] !== "20260716090000") errors.push("Cycle 8 migration history mismatch");
if (negativeSeeds?.rejected !== 30 || negativeSeeds?.total !== 30) errors.push("Expected 30/30 seed negative tests");
if (localNegative?.rejected !== 21 || localNegative?.total !== 21) errors.push("Expected 21/21 local negative tests");
if (localNegative?.url_tests?.passed !== 20 || localNegative?.url_tests?.total !== 20) errors.push("Expected 20/20 URL tests");
if (wrapper?.result !== "CLEAN_WORKTREE_WRAPPER_VALIDATED") errors.push("Clean worktree wrapper report is not validated");

try {
  assertNoForbiddenContent(root, [
    "reports/supabase-ci/repository-safety-result.json",
    "reports/supabase-ci/ci-static-result.json",
    "reports/supabase-ci/ci-evidence-result.json",
    "reports/supabase-ci/ci-cleanup-result.json",
    "reports/supabase-ci/cycle-9-result.json",
    "reports/supabase-local-seeds/cycle-8-result.json",
    "reports/supabase-local-seeds/fixtures-result.json",
    "reports/supabase-local-seeds/safe-reset-result.json",
    "reports/supabase-local-bootstrap/clean-worktree-wrapper-result.json",
    ...listFiles(root, "docs/supabase-infrastructure-refactor").filter((file) => /4[5-8]-/.test(file)),
  ]);
} catch (error) {
  errors.push(error.message);
}

const payload = {
  cycle: "9",
  result: errors.length ? "CI_EVIDENCE_REJECTED" : "CI_EVIDENCE_VALIDATED",
  decision: errors.length ? "CI_QUALITY_GATES_REJECTED" : CYCLE_9_DECISION,
  baseline_sha_preserved: !errors.some((error) => /baseline/i.test(error)),
  migration_history_validated: !errors.some((error) => /migration history/i.test(error)),
  negative_tests_complete: !errors.some((error) => /negative|URL/.test(error)),
  regressions_validated: !errors.some((error) => /wrapper|Cycle 8/.test(error)),
  credential_scan_passed: !errors.some((error) => /Forbidden content/.test(error)),
  remote_access_performed: false,
  edge_functions_deployed: false,
  errors,
  primary_error: errors[0] ?? null,
};

writeJsonReport(root, "ci-evidence-result.json", payload);
writeMarkdownReport(root, "ci-evidence-summary.md", [
  "# CI Evidence Validation",
  "",
  `- Result: ${payload.result}`,
  `- Decision: ${payload.decision}`,
  `- Baseline SHA preserved: ${payload.baseline_sha_preserved ? "yes" : "no"}`,
  `- Negative tests complete: ${payload.negative_tests_complete ? "yes" : "no"}`,
  `- Credential scan passed: ${payload.credential_scan_passed ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("CI_EVIDENCE_VALIDATED");
