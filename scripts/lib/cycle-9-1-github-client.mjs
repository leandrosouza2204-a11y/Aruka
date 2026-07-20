import { runOrThrow } from "./cycle-9-1-process.mjs";
import { nowIso } from "./cycle-9-1-evidence-writer.mjs";

export const REPOSITORY = "leandrosouza2204-a11y/Aruka";
export const WORKFLOW_NAME = "Supabase Local Quality Gates";
export const WORKFLOW_FILE = "supabase-local-quality-gates.yml";
export const REQUIRED_CHECK = "Supabase Local Quality Gates / validation";
export const MARKER_PATH = ".ci/force-supabase-cycle-9-1-failure";
export const MARKER_OUTPUT = "CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED";

export function parseJson(text, label = "JSON") {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid ${label}: ${error.message}`);
  }
}

export function validationJob(run) {
  return (run.jobs ?? []).find((job) => job.name === "validation" || /\/ validation$/.test(job.name));
}

export function validateSuccessfulRun(run, options = {}) {
  const job = validationJob(run);
  const errors = [];
  if (run.name !== WORKFLOW_NAME) errors.push("workflow name mismatch");
  if (run.event !== "pull_request") errors.push("run event is not pull_request");
  if (run.conclusion !== "success") errors.push("run conclusion is not success");
  if (!job) errors.push("validation job missing");
  if (job && job.conclusion !== "success") errors.push("validation job conclusion is not success");
  if (options.branch && run.headBranch !== options.branch) errors.push("head branch mismatch");
  if (options.sha && run.headSha !== options.sha) errors.push("head SHA mismatch");
  if (errors.length) throw new Error(`Run is not acceptable evidence: ${errors.join("; ")}`);
  return job;
}

export function validateArtifacts(artifacts) {
  const list = Array.isArray(artifacts) ? artifacts : artifacts.artifacts ?? [];
  const evidence = list.filter((artifact) => /supabase-quality-evidence/i.test(artifact.name ?? ""));
  if (!evidence.length) throw new Error("No Supabase quality evidence artifact found.");
  return evidence;
}

export function parseChecks(checks) {
  const list = Array.isArray(checks) ? checks : checks.checks ?? [];
  return list.map((check) => ({
    name: check.name,
    state: check.state ?? check.conclusion,
    required: Boolean(check.required ?? /required/i.test(check.bucket ?? "")),
  }));
}

export function requiredValidationCheck(checks) {
  return parseChecks(checks).find((check) => /validation/i.test(check.name ?? "") && check.required);
}

export function validateRuleset(rulesets) {
  const list = Array.isArray(rulesets) ? rulesets : rulesets.rulesets ?? [];
  const ruleset = list.find((item) => item.name === "Protect main" && item.enforcement === "active");
  if (!ruleset) throw new Error("Active Protect main ruleset was not found.");
  const rules = ruleset.rules ?? [];
  const hasPullRequest = rules.some((rule) => rule.type === "pull_request");
  const hasRequiredStatus = rules.some((rule) => rule.type === "required_status_checks");
  const hasValidation = JSON.stringify(rules).includes("validation");
  const hasNoBypass = !ruleset.bypass_actors || ruleset.bypass_actors.length === 0;
  if (!hasPullRequest || !hasRequiredStatus || !hasValidation || !hasNoBypass) {
    throw new Error("Protect main ruleset is missing required pull request/status check constraints.");
  }
  return ruleset;
}

export function validateMergeBlocked({ pr, checks, run, logText = "" }) {
  const required = requiredValidationCheck(checks);
  const requiredFailed = required && /fail|failure|failed|unsuccessful/i.test(required.state ?? "");
  const mergeBlocked = pr.mergeStateStatus ? !/clean|has_hooks/i.test(pr.mergeStateStatus) : pr.mergeable === "MERGEABLE" ? false : true;
  const conflict = /dirty|conflict/i.test(`${pr.mergeStateStatus ?? ""} ${pr.mergeable ?? ""}`);
  const controlled = logText.includes(MARKER_OUTPUT) || run?.controlled_failure === true;
  if (!requiredFailed) throw new Error("Required validation check is not failed.");
  if (!mergeBlocked) throw new Error("PR is not merge-blocked.");
  if (conflict) throw new Error("PR appears blocked by conflict, not required check.");
  if (!controlled) throw new Error("Controlled failure marker was not observed.");
  return {
    required_check_failed: true,
    merge_blocked: true,
    blocked_by_required_check: true,
  };
}

export function ghJson(args, label, options = {}) {
  return parseJson(runOrThrow("gh", args, options), label);
}

export function collectRunEvidence({ runId, pr, branch, sha } = {}) {
  const run = runId
    ? ghJson(["run", "view", String(runId), "--json", "databaseId,number,name,event,status,conclusion,headBranch,headSha,url,jobs,createdAt,updatedAt"], "run")
    : ghJson(["run", "list", "--workflow", WORKFLOW_FILE, "--branch", branch ?? "chore/supabase-ci-runtime-validation", "--event", "pull_request", "--limit", "1", "--json", "databaseId,number,name,event,status,conclusion,headBranch,headSha,url,createdAt,updatedAt"], "run list")[0];
  const full = run.jobs ? run : ghJson(["run", "view", String(run.databaseId), "--json", "databaseId,number,name,event,status,conclusion,headBranch,headSha,url,jobs,createdAt,updatedAt"], "run");
  const job = validateSuccessfulRun(full, { branch, sha });
  return {
    cycle: "9.1",
    result: "GITHUB_ACTIONS_RUN_COLLECTED",
    decision: "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED",
    collected_at: nowIso(),
    repository: REPOSITORY,
    pull_request: pr ?? null,
    workflow_name: WORKFLOW_NAME,
    run_id: full.databaseId,
    run_number: full.number,
    event: full.event,
    status: full.status,
    conclusion: full.conclusion,
    head_branch: full.headBranch,
    head_sha: full.headSha,
    url: full.url,
    check_name_real: `${WORKFLOW_NAME} / ${job.name}`,
    jobs: full.jobs,
    primary_error: null,
  };
}
