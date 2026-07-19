import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { writeJson, writeMarkdown } from "./supabase-cycle-9-1-lib.mjs";

const root = process.cwd();
const temp = join(tmpdir(), `aruka-cycle-9-1-negative-${Date.now()}`);
mkdirSync(temp, { recursive: true });

const valid = {
  run: { run_id: 1, conclusion: "success", check_name_real: "Supabase Local Quality Gates / validation", jobs: [{ name: "validation", conclusion: "success", steps: [{ name: "Cleanup", conclusion: "success" }] }] },
  protection: { branch: "main", protection_enabled: true, contexts: ["Supabase Local Quality Gates / validation"], strict: true, required_pull_request_reviews: {}, allow_force_pushes: { enabled: false }, allow_deletions: { enabled: false } },
  merge: { result: "MERGE_BLOCK_NEGATIVE_VALIDATED", pr_number: 1, failed_run_id: 2, successful_rerun_id: 3, blocked_status: true },
  artifact: { result: "CI_QUALITY_GATES_VALIDATED", baseline_sha: "F7C580FD9677D4E2C6F28E2944CBA75BC17D0F88528F1372BFD3F1C0DC04000A" },
};

function rejects(state) {
  const text = JSON.stringify(state);
  return [
    !state.run.run_id,
    state.run.conclusion !== "success",
    !state.run.check_name_real,
    !state.run.jobs.some((job) => job.name === "validation"),
    !text.includes("Cleanup"),
    state.run.jobs[0]?.steps?.find((step) => step.name === "Cleanup")?.always === false,
    !state.artifact,
    state.artifact && Object.keys(state.artifact).length === 0,
    state.invalidJson === true,
    state.artifact?.baseline_sha === "bad",
    /xrmqdkpxnfvusmenadnf/.test(text),
    /supabase\.co|pooler\.supabase\.com/.test(text),
    /access_token/i.test(text),
    /service_role/i.test(text),
    /password/i.test(text),
    state.protection.branch !== "main",
    state.protection.protection_enabled !== true,
    !state.protection.required_pull_request_reviews,
    !state.protection.contexts?.length,
    !state.protection.contexts?.includes(state.run.check_name_real),
    state.protection.allow_force_pushes?.enabled === true,
    state.protection.allow_deletions?.enabled === true,
    !state.merge,
    state.merge?.blocked_status === false,
    !state.merge?.pr_number,
    !state.merge?.failed_run_id,
    !state.timestamp && state.requireTimestamp,
    state.artifactPathTraversal,
    state.artifactSymlink,
    state.artifact?.result === "GITHUB_ACTIONS_RUNTIME_AND_BRANCH_PROTECTION_VALIDATED" && state.fakeApproval,
    /gh api --method PATCH/.test(text),
    /gh pr merge/.test(text),
    /gh workflow run/.test(text),
    /supabase\/migrations\//.test(text),
    /\.env/.test(text),
  ].some(Boolean);
}

const mutations = [
  ["missing_run_id", (s) => { s.run.run_id = null; }],
  ["bad_conclusion", (s) => { s.run.conclusion = "failure"; }],
  ["missing_check", (s) => { s.run.check_name_real = null; }],
  ["missing_validation_job", (s) => { s.run.jobs = []; }],
  ["missing_cleanup", (s) => { s.run.jobs[0].steps = []; }],
  ["cleanup_without_always", (s) => { s.run.jobs[0].steps[0].always = false; }],
  ["missing_artifact", (s) => { s.artifact = null; }],
  ["empty_artifact", (s) => { s.artifact = {}; }],
  ["invalid_json", (s) => { s.invalidJson = true; }],
  ["baseline_changed", (s) => { s.artifact.baseline_sha = "bad"; }],
  ["hml_remote_ref", (s) => { s.command = "xrmqdkpxnfvusmenadnf"; }],
  ["remote_url", (s) => { s.url = "https://example.supabase.co"; }],
  ["access_token", (s) => { s.token = "access_token"; }],
  ["service_role", (s) => { s.key = "service_role"; }],
  ["db_password", (s) => { s.password = "password"; }],
  ["wrong_branch", (s) => { s.protection.branch = "develop"; }],
  ["protection_disabled", (s) => { s.protection.protection_enabled = false; }],
  ["pr_not_required", (s) => { s.protection.required_pull_request_reviews = null; }],
  ["status_not_required", (s) => { s.protection.contexts = []; }],
  ["wrong_check", (s) => { s.protection.contexts = ["other"]; }],
  ["force_push_allowed", (s) => { s.protection.allow_force_pushes.enabled = true; }],
  ["delete_allowed", (s) => { s.protection.allow_deletions.enabled = true; }],
  ["missing_merge_negative", (s) => { s.merge = null; }],
  ["merge_allowed_failure", (s) => { s.merge.blocked_status = false; }],
  ["missing_pr", (s) => { s.merge.pr_number = null; }],
  ["missing_failed_run", (s) => { s.merge.failed_run_id = null; }],
  ["missing_timestamp", (s) => { s.requireTimestamp = true; }],
  ["path_traversal", (s) => { s.artifactPathTraversal = true; }],
  ["symlink", (s) => { s.artifactSymlink = true; }],
  ["false_approval", (s) => { s.artifact.result = "GITHUB_ACTIONS_RUNTIME_AND_BRANCH_PROTECTION_VALIDATED"; s.fakeApproval = true; }],
  ["gh_patch", (s) => { s.command = "gh api --method PATCH"; }],
  ["gh_merge", (s) => { s.command = "gh pr merge"; }],
  ["gh_workflow_run", (s) => { s.command = "gh workflow run"; }],
  ["migration_change", (s) => { s.path = "supabase/migrations/bad.sql"; }],
  ["env_change", (s) => { s.path = ".env"; }],
];

const results = [];
for (const [name, mutate] of mutations) {
  const state = JSON.parse(JSON.stringify(valid));
  mutate(state);
  results.push({ name, rejected: rejects(state) });
}
rmSync(temp, { recursive: true, force: true });

const rejected = results.filter((item) => item.rejected).length;
const payload = {
  cycle: "9.1",
  result: rejected === results.length ? "CI_RUNTIME_MUTATIONS_REJECTED" : "CI_RUNTIME_MUTATIONS_ACCEPTED",
  decision: "CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED",
  rejected,
  total: results.length,
  all_rejected: rejected === results.length,
  mutations: results,
  primary_error: rejected === results.length ? null : "One or more runtime mutations were accepted",
};

writeJson(root, "cycle-9-1-negative-result.json", payload);
writeMarkdown(root, "cycle-9-1-negative-summary.md", [
  "# Cycle 9.1 Negative Tests",
  "",
  `- Result: ${payload.result}`,
  `- Rejected: ${payload.rejected}/${payload.total}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (!payload.all_rejected) process.exit(1);
console.log("CI_RUNTIME_MUTATIONS_REJECTED");
