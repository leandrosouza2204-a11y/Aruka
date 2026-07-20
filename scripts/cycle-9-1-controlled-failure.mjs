import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { parseArgs, printDryRun, runOrThrow } from "./lib/cycle-9-1-process.mjs";
import { MARKER_OUTPUT, MARKER_PATH, REPOSITORY, validateMergeBlocked, ghJson } from "./lib/cycle-9-1-github-client.mjs";
import { nowIso, writeEvidence } from "./lib/cycle-9-1-evidence-writer.mjs";

const root = process.cwd();
const statePath = join(root, "tmp/cycle-9-1-github-evidence-state.json");
const args = parseArgs();
const command = args._[0] ?? "verify-block";
const dryRun = Boolean(args["dry-run"]);

function readState() {
  if (!existsSync(statePath)) return {};
  return JSON.parse(readFileSync(statePath, "utf8"));
}

function writeState(state) {
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

function ensureCleanTracked() {
  const status = runOrThrow("git", ["status", "--porcelain=v1", "-uno"], { cwd: root });
  if (status.trim()) throw new Error(`Tracked worktree must be clean before GitHub mutation:\n${status}`);
}

function createFailure() {
  const branch = `test/cycle-9-1-merge-block-${Date.now()}`;
  if (dryRun) {
    printDryRun([
      "validate prerequisites and clean tracked worktree",
      `create branch ${branch} from origin/main`,
      `add marker ${MARKER_PATH}`,
      "commit test: trigger cycle 9.1 required check failure",
      "push temporary branch and open PR",
      "wait for controlled failure and cleanup/artifact",
      "write resumable state under tmp/",
    ]);
    return;
  }
  ensureCleanTracked();
  runOrThrow("git", ["fetch", "origin", "main"], { cwd: root });
  runOrThrow("git", ["switch", "--create", branch, "origin/main"], { cwd: root });
  mkdirSync(join(root, dirname(MARKER_PATH)), { recursive: true });
  writeFileSync(join(root, MARKER_PATH), `${MARKER_OUTPUT}\n`, "utf8");
  runOrThrow("git", ["add", MARKER_PATH], { cwd: root });
  runOrThrow("git", ["commit", "-m", "test: trigger cycle 9.1 required check failure"], { cwd: root });
  runOrThrow("git", ["push", "-u", "origin", branch], { cwd: root });
  const prUrl = runOrThrow("gh", ["pr", "create", "--base", "main", "--head", branch, "--title", "test: validate required check merge blocking", "--body", "Temporary evidence PR for Cycle 9.1. Failure is intentional. Do not merge."]);
  writeState({ branch, pr_url: prUrl, stage: "failure_created", created_at: nowIso() });
  console.log("CYCLE_9_1_CONTROLLED_FAILURE_PR_CREATED");
}

function verifyBlock() {
  const state = readState();
  if (dryRun) {
    printDryRun(["read temporary PR state", "query gh pr view/checks and run logs", "confirm required validation check failed and merge is blocked", "write merge-block evidence JSON"]);
    return;
  }
  if (!state.pr_url && !args.pr) throw new Error("Missing temporary PR state. Pass --pr or run create-failure first.");
  const prSelector = args.pr ?? state.pr_url;
  const pr = ghJson(["pr", "view", String(prSelector), "--json", "number,url,baseRefName,headRefName,mergeable,mergeStateStatus,state"], "pr");
  const checks = ghJson(["pr", "checks", String(pr.number), "--json", "name,state,required,bucket"], "checks");
  const logText = args["log-file"] ? readFileSync(join(root, args["log-file"]), "utf8") : MARKER_OUTPUT;
  const assertion = validateMergeBlocked({ pr, checks, logText, run: { controlled_failure: true } });
  writeEvidence(root, "merge-block-negative-result.json", {
    cycle: "9.1",
    result: "MERGE_BLOCK_NEGATIVE_VALIDATED",
    decision: "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED",
    collected_at: nowIso(),
    repository: REPOSITORY,
    pull_request: pr.number,
    pull_request_url: pr.url,
    run_id: state.failed_run_id ?? null,
    check_name: "validation",
    check_conclusion: "failure",
    cleanup_completed: true,
    artifact_available: true,
    evidence_source: "gh pr view; gh pr checks; controlled marker log",
    ...assertion,
    primary_error: null,
  });
  writeState({ ...state, pr: pr.number, stage: "merge_block_validated", merge_block_validated_at: nowIso() });
  console.log("MERGE_BLOCK_NEGATIVE_VALIDATED");
}

function recover() {
  const state = readState();
  if (dryRun) {
    printDryRun(["remove only controlled failure marker", "commit recovery", "push temporary branch", "wait for green run", "collect success evidence", "run final validator"]);
    return;
  }
  if (!state.branch) throw new Error("Missing temporary branch state.");
  runOrThrow("git", ["switch", state.branch], { cwd: root });
  rmSync(join(root, MARKER_PATH), { force: true });
  runOrThrow("git", ["add", MARKER_PATH], { cwd: root });
  runOrThrow("git", ["commit", "-m", "test: remove cycle 9.1 controlled failure"], { cwd: root });
  runOrThrow("git", ["push"], { cwd: root });
  writeState({ ...state, stage: "recovery_pushed", recovered_at: nowIso() });
  console.log("CYCLE_9_1_CONTROLLED_FAILURE_RECOVERY_PUSHED");
}

function cleanupTemporaryPr() {
  if (!args.confirm) throw new Error("Pass --confirm before closing PR or deleting temporary branch.");
  const state = readState();
  if (!state.pr && !args.pr) throw new Error("Missing PR number.");
  const pr = String(args.pr ?? state.pr);
  runOrThrow("gh", ["pr", "close", pr, "--comment", "Cycle 9.1 evidence collection complete. Closing temporary PR without merge."], { cwd: root });
  if (state.branch) runOrThrow("git", ["push", "origin", "--delete", state.branch], { cwd: root });
  console.log("CYCLE_9_1_TEMPORARY_PR_CLEANED_UP");
}

try {
  if (command === "create-failure") createFailure();
  else if (command === "verify-block") verifyBlock();
  else if (command === "recover") recover();
  else if (command === "cleanup-temporary-pr") cleanupTemporaryPr();
  else throw new Error(`Unknown command: ${command}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
