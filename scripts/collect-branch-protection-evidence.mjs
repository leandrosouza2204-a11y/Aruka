import { DECISION_PREPARE, gh, ghAvailable, pendingReport, repoSlug, writeJson, writeMarkdown } from "./supabase-cycle-9-1-lib.mjs";

const root = process.cwd();
const repository = repoSlug(root);
const ghState = ghAvailable(root);
let payload;

if (!ghState.available || !ghState.authenticated || !repository) {
  payload = {
    ...pendingReport("BRANCH_PROTECTION_MANUAL_VALIDATION_REQUIRED"),
    repository,
    branch: "main",
    protection_enabled: false,
    primary_error: "GitHub CLI unavailable, unauthenticated, or repository slug unavailable.",
  };
} else {
  const response = gh(root, ["api", `repos/${repository}/branches/main/protection`]);
  if (response.status !== 0) {
    payload = {
      ...pendingReport(response.stderr.includes("404") ? "BRANCH_PROTECTION_NOT_CONFIGURED" : "BRANCH_PROTECTION_INSUFFICIENT_PERMISSIONS"),
      repository,
      branch: "main",
      protection_enabled: false,
      primary_error: response.stderr || response.stdout,
    };
  } else {
    const protection = JSON.parse(response.stdout);
    payload = {
      cycle: "9.1",
      result: "BRANCH_PROTECTION_COLLECTED",
      decision: DECISION_PREPARE,
      repository,
      branch: "main",
      protection_enabled: true,
      required_status_checks: protection.required_status_checks ?? null,
      strict: protection.required_status_checks?.strict ?? null,
      contexts: protection.required_status_checks?.contexts ?? [],
      checks: protection.required_status_checks?.checks ?? [],
      required_pull_request_reviews: protection.required_pull_request_reviews ?? null,
      required_conversation_resolution: protection.required_conversation_resolution ?? null,
      required_linear_history: protection.required_linear_history ?? null,
      allow_force_pushes: protection.allow_force_pushes ?? null,
      allow_deletions: protection.allow_deletions ?? null,
      enforce_admins: protection.enforce_admins ?? null,
      primary_error: null,
    };
  }
}

writeJson(root, "branch-protection-result.json", payload);
writeMarkdown(root, "branch-protection-summary.md", [
  "# Branch Protection Evidence",
  "",
  `- Result: ${payload.result}`,
  `- Branch: main`,
  `- Protection enabled: ${payload.protection_enabled ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);
console.log(payload.result);
