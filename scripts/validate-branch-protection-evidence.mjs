import { DECISION_FINAL, DECISION_PREPARE, readJson, writeJson, writeMarkdown } from "./supabase-cycle-9-1-lib.mjs";

const root = process.cwd();
const protection = readJson(root, "reports/supabase-ci-runtime/branch-protection-result.json", {});
const mergeBlock = readJson(root, "reports/supabase-ci-runtime/merge-block-negative-result.json", {});
const run = readJson(root, "reports/supabase-ci-runtime/github-actions-run-result.json", {});
const checkName = run.check_name_real;
const errors = [];

if (protection.branch !== "main") errors.push("Branch protection evidence must target main");
if (protection.protection_enabled !== true) errors.push("Branch protection is not enabled");
if (!protection.required_pull_request_reviews && !protection.required_pull_request_reviews_url) errors.push("Pull request requirement is not evidenced");
const requiredChecks = [...(protection.contexts ?? []), ...(protection.checks ?? []).map((check) => check.context ?? check.name)].filter(Boolean);
if (!checkName || !requiredChecks.includes(checkName)) errors.push("Real workflow check is not configured as required");
if (protection.strict !== true) errors.push("Required checks must require up-to-date branches when supported");
if (protection.allow_force_pushes?.enabled === true) errors.push("Force pushes are allowed");
if (protection.allow_deletions?.enabled === true) errors.push("Branch deletion is allowed");
if (mergeBlock.result !== "MERGE_BLOCK_NEGATIVE_VALIDATED") errors.push("Merge-block negative evidence is missing");

const payload = {
  cycle: "9.1",
  result: errors.length ? "BRANCH_PROTECTION_PENDING" : "BRANCH_PROTECTION_VALIDATED",
  decision: errors.length ? DECISION_PREPARE : DECISION_FINAL,
  check_name: checkName ?? null,
  required_checks: requiredChecks,
  merge_block_validated: mergeBlock.result === "MERGE_BLOCK_NEGATIVE_VALIDATED",
  errors,
  primary_error: errors[0] ?? null,
};

writeJson(root, "branch-protection-result.json", { ...protection, validation: payload });
writeMarkdown(root, "branch-protection-summary.md", [
  "# Branch Protection Validation",
  "",
  `- Result: ${payload.result}`,
  `- Check name: ${payload.check_name ?? "pending"}`,
  `- Merge block validated: ${payload.merge_block_validated ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (errors.length) process.exit(1);
console.log("BRANCH_PROTECTION_VALIDATED");
