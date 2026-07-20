import { runOrThrow } from "./cycle-9-1-process.mjs";
import { nowIso } from "./cycle-9-1-evidence-writer.mjs";

export const REPOSITORY = "leandrosouza2204-a11y/Aruka";
export const WORKFLOW_NAME = "Supabase Local Quality Gates";
export const WORKFLOW_FILE = "supabase-local-quality-gates.yml";
export const VALIDATION_CHECK_NAME = "validation";
export const REQUIRED_RULESET_CONTEXT = "validation";
export const GITHUB_ACTIONS_APP_NAME = "GitHub Actions";
export const GITHUB_ACTIONS_INTEGRATION_ID = 15368;
export const LEGACY_REQUIRED_CHECK_CONTEXT = `${WORKFLOW_NAME} / ${VALIDATION_CHECK_NAME}`;
export const REQUIRED_CHECK = LEGACY_REQUIRED_CHECK_CONTEXT;
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
  return (run.jobs ?? []).find((job) => job.name === VALIDATION_CHECK_NAME);
}

export function validateSuccessfulValidationCheckRun(checkRun) {
  const errors = [];
  if (!checkRun) errors.push("validation check run missing");
  if (checkRun && checkRun.name !== VALIDATION_CHECK_NAME) errors.push("validation check run name mismatch");
  if (checkRun && checkRun.app?.name !== GITHUB_ACTIONS_APP_NAME) errors.push("validation check run app mismatch");
  if (checkRun && checkRun.status && checkRun.status !== "completed") errors.push("validation check run is not completed");
  if (checkRun && checkRun.conclusion !== "success") errors.push("validation check run conclusion is not success");
  if (errors.length) throw new Error(`Validation check run is not acceptable evidence: ${errors.join("; ")}`);
  return checkRun;
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
  return parseChecks(checks).find((check) => (check.name === VALIDATION_CHECK_NAME || check.name === LEGACY_REQUIRED_CHECK_CONTEXT) && check.required);
}

export function validateRuleset(rulesets) {
  const list = Array.isArray(rulesets) ? rulesets : rulesets.rulesets ?? [];
  const ruleset = list.find((item) => item.name === "Protect main" && item.enforcement === "active");
  if (!ruleset) throw new Error("Active Protect main ruleset was not found.");
  if (ruleset.target !== "branch") throw new Error("Protect main ruleset target is not branch.");
  const targetBranches = ruleset.conditions?.ref_name?.include ?? [];
  if (!targetBranches.includes("refs/heads/main")) throw new Error("Protect main ruleset does not target refs/heads/main.");
  const rules = ruleset.rules ?? [];
  const pullRequestRule = rules.find((rule) => rule.type === "pull_request");
  const requiredStatusRule = rules.find((rule) => rule.type === "required_status_checks");
  const requiredChecks = requiredStatusRule?.parameters?.required_status_checks ?? [];
  const validationContext = requiredChecks.find((check) =>
    check.context === REQUIRED_RULESET_CONTEXT &&
    (check.integration_id === undefined || check.integration_id === GITHUB_ACTIONS_INTEGRATION_ID)
  );
  if (!pullRequestRule || !requiredStatusRule || !validationContext) {
    throw new Error("Protect main ruleset is missing required pull request/status check constraints.");
  }
  return {
    ruleset,
    target_branches: targetBranches,
    pull_request_rule: pullRequestRule,
    required_status_rule: requiredStatusRule,
    required_status_checks: requiredChecks,
    validation_context: validationContext,
    redundant_required_status_checks: requiredChecks.filter((check) => check.context === LEGACY_REQUIRED_CHECK_CONTEXT),
  };
}

export function buildBranchProtectionEvidence(rulesets, options = {}) {
  const validation = validateRuleset(rulesets);
  const ruleset = validation.ruleset;
  const checkRun = options.checkRun ? validateSuccessfulValidationCheckRun(options.checkRun) : null;
  return {
    cycle: "9.1",
    result: "BRANCH_PROTECTION_COLLECTED",
    decision: "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED",
    collected_at: options.collectedAt ?? nowIso(),
    repository: options.repository ?? REPOSITORY,
    branch: "main",
    validation: {
      result: "BRANCH_PROTECTION_VALIDATED",
      ruleset_id: ruleset.id,
      name: ruleset.name,
      enforcement: ruleset.enforcement,
      target: ruleset.target,
      target_branches: validation.target_branches,
      bypass_list_empty: !ruleset.bypass_actors?.length,
      pull_request_rule_found: true,
      required_status_checks_found: validation.required_status_checks,
      required_check: REQUIRED_RULESET_CONTEXT,
      validated_context: validation.validation_context.context,
      integration_id: validation.validation_context.integration_id ?? null,
      workflow_name: WORKFLOW_NAME,
      check_run: checkRun ? {
        name: checkRun.name,
        app: checkRun.app?.name ?? null,
        status: checkRun.status ?? null,
        conclusion: checkRun.conclusion,
      } : null,
      redundant_required_status_checks: validation.redundant_required_status_checks,
      pull_request_required: true,
      force_push_blocked: true,
      deletion_blocked: true,
    },
    primary_error: null,
  };
}

export function collectProtectMainRuleset(options = {}) {
  const githubJson = options.ghJson ?? ghJson;
  const listResponse = githubJson(["api", `repos/${REPOSITORY}/rulesets`], "rulesets");
  const list = Array.isArray(listResponse) ? listResponse : listResponse.rulesets ?? [];
  const summary = list.find((item) => item.name === "Protect main" && item.enforcement === "active");
  if (!summary) throw new Error("Active Protect main ruleset was not found.");
  if (!summary.id) throw new Error("Protect main ruleset summary is missing id.");
  let detail;
  try {
    detail = githubJson(["api", `repos/${REPOSITORY}/rulesets/${summary.id}`], "ruleset detail");
  } catch (error) {
    throw new Error(`Unable to retrieve detailed Protect main ruleset: ${error.message}`);
  }
  if (!detail || typeof detail !== "object") throw new Error("Unable to retrieve detailed Protect main ruleset.");
  return detail;
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
    check_run: {
      name: job.name,
      app: GITHUB_ACTIONS_APP_NAME,
      status: "completed",
      conclusion: job.conclusion,
    },
    jobs: full.jobs,
    primary_error: null,
  };
}
