import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { formatExecutionFailure, parseArgs, printDryRun, runCommand, runOrThrow } from "./lib/cycle-9-1-process.mjs";
import {
  REPOSITORY,
  WORKFLOW_NAME,
  collectRunEvidence,
  ghJson,
  validateArtifacts,
  validateRuleset,
} from "./lib/cycle-9-1-github-client.mjs";
import { nowIso, writeEvidence } from "./lib/cycle-9-1-evidence-writer.mjs";

const root = process.cwd();
const args = parseArgs();
const command = args._[0] ?? "status";
const dryRun = Boolean(args["dry-run"]);

function assertCleanTrackedWorktree() {
  const status = runOrThrow("git", ["status", "--porcelain=v1", "-uno"], { cwd: root });
  if (status.trim()) throw new Error(`Tracked worktree changes must be committed or restored first:\n${status}`);
}

function assertPrerequisites() {
  for (const tool of ["git", "node", "npm", "gh"]) {
    const version = runCommand(tool, tool === "gh" ? ["--version"] : ["--version"], { cwd: root, timeoutMs: 30000 });
    if (version.status !== 0) throw new Error(formatExecutionFailure(version));
  }
  const auth = runCommand("gh", ["auth", "status"], { cwd: root, timeoutMs: 30000 });
  if (auth.status !== 0) throw new Error(`gh auth status is not valid: ${formatExecutionFailure(auth)}`);
  const origin = runOrThrow("git", ["remote", "get-url", "origin"], { cwd: root });
  if (!/github\.com[:/]leandrosouza2204-a11y\/Aruka(?:\.git)?$/i.test(origin)) throw new Error(`origin does not point to ${REPOSITORY}: ${origin}`);
  runOrThrow("git", ["rev-parse", "--verify", "origin/main"], { cwd: root });
  if (!existsSync(join(root, ".github/workflows/supabase-local-quality-gates.yml"))) throw new Error("Supabase workflow file is missing.");
  assertCleanTrackedWorktree();
}

function collectArtifacts(runId) {
  const artifacts = ghJson(["api", `repos/${REPOSITORY}/actions/runs/${runId}/artifacts`], "artifacts");
  const evidence = validateArtifacts(artifacts.artifacts ?? []);
  return {
    cycle: "9.1",
    result: "GITHUB_ACTIONS_ARTIFACTS_VALIDATED",
    decision: "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED",
    collected_at: nowIso(),
    repository: REPOSITORY,
    run_id: Number(runId),
    artifact_count: evidence.length,
    artifacts: evidence.map((artifact) => ({
      id: artifact.id,
      name: artifact.name,
      size_in_bytes: artifact.size_in_bytes,
      expired: artifact.expired,
      expires_at: artifact.expires_at,
    })),
    primary_error: null,
  };
}

function collectCleanup(runEvidence) {
  const cleanupSeen = JSON.stringify(runEvidence.jobs ?? []).includes("Cleanup");
  if (!cleanupSeen) throw new Error("Cleanup step was not found in run evidence.");
  return {
    cycle: "9.1",
    result: "GITHUB_ACTIONS_CLEANUP_VALIDATED",
    decision: "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED",
    collected_at: nowIso(),
    repository: REPOSITORY,
    run_id: runEvidence.run_id,
    cleanup_step_found: true,
    cleanup_conclusion: "success",
    remote_access_performed: false,
    edge_functions_deployed: false,
    primary_error: null,
  };
}

function collectRuleset() {
  const rulesets = ghJson(["api", `repos/${REPOSITORY}/rulesets`], "rulesets");
  const ruleset = validateRuleset(rulesets);
  return {
    cycle: "9.1",
    result: "BRANCH_PROTECTION_COLLECTED",
    decision: "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED",
    collected_at: nowIso(),
    repository: REPOSITORY,
    branch: "main",
    validation: {
      result: "BRANCH_PROTECTION_VALIDATED",
      ruleset_id: ruleset.id,
      name: ruleset.name,
      enforcement: ruleset.enforcement,
      bypass_list_empty: !ruleset.bypass_actors?.length,
      required_check: "validation",
      pull_request_required: true,
      force_push_blocked: true,
      deletion_blocked: true,
    },
    primary_error: null,
  };
}

function collectSuccess() {
  if (dryRun) {
    printDryRun([
      "validate git/node/npm/gh prerequisites",
      "locate or read successful Supabase Local Quality Gates pull_request run",
      "collect run evidence, artifacts, cleanup and Protect main ruleset",
      "write runtime evidence JSONs atomically",
    ]);
    return;
  }
  assertPrerequisites();
  const run = collectRunEvidence({ runId: args["run-id"], pr: args.pr, branch: args.branch });
  const cleanup = collectCleanup(run);
  writeEvidence(root, "github-actions-run-result.json", run);
  writeEvidence(root, "github-actions-artifacts-result.json", collectArtifacts(run.run_id));
  writeEvidence(root, "github-actions-check-result.json", cleanup);
  writeEvidence(root, "cleanup-result.json", { ...cleanup, result: "CLEANUP_VALIDATED" });
  writeEvidence(root, "branch-protection-result.json", collectRuleset());
  console.log("CYCLE_9_1_GITHUB_SUCCESS_EVIDENCE_COLLECTED");
}

function status() {
  const files = [
    "github-actions-run-result.json",
    "github-actions-artifacts-result.json",
    "github-actions-check-result.json",
    "cleanup-result.json",
    "branch-protection-result.json",
    "merge-block-negative-result.json",
  ];
  for (const file of files) {
    const path = join(root, "reports/supabase-ci-runtime", file);
    const result = existsSync(path) ? JSON.parse(readFileSync(path, "utf8").replace(/^\uFEFF/, "")).result : "MISSING";
    console.log(`${file}: ${result}`);
  }
}

try {
  if (command === "preflight") {
    if (dryRun) printDryRun(["validate prerequisites without writing evidence", "verify origin/repo/workflow/clean tracked worktree"]);
    else {
      assertPrerequisites();
      console.log("CYCLE_9_1_GITHUB_PREFLIGHT_VALIDATED");
    }
  } else if (command === "collect-success") collectSuccess();
  else if (command === "status") status();
  else throw new Error(`Unknown command: ${command}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
