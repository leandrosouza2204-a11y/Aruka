import { DECISION_PREPARE, WORKFLOW_FILE, WORKFLOW_NAME, EXPECTED_JOB, gh, ghAvailable, git, pendingReport, repoSlug, writeJson, writeMarkdown } from "./supabase-cycle-9-1-lib.mjs";

const root = process.cwd();
const branch = git(root, ["branch", "--show-current"]).stdout.trim();
const head = git(root, ["rev-parse", "HEAD"]).stdout.trim();
const repository = repoSlug(root);
const ghState = ghAvailable(root);
let payload;

if (!ghState.available || !ghState.authenticated || !repository) {
  payload = {
    ...pendingReport("MANUAL_COLLECTION_REQUIRED"),
    repository,
    workflow_name: WORKFLOW_NAME,
    workflow_file: WORKFLOW_FILE,
    branch,
    head_sha: head,
    gh_available: ghState.available,
    gh_authenticated: ghState.authenticated,
    manual_commands: [
      "gh run list --workflow supabase-local-quality-gates.yml --limit 10",
      "gh run view <RUN_ID> --json databaseId,number,name,event,status,conclusion,headBranch,headSha,url,jobs,createdAt,updatedAt",
      "gh pr checks <PR_NUMBER>",
    ],
    primary_error: "GitHub CLI is unavailable, unauthenticated, or repository slug could not be resolved.",
  };
} else {
  const runs = gh(root, ["run", "list", "--workflow", "supabase-local-quality-gates.yml", "--limit", "10", "--json", "databaseId,number,name,event,status,conclusion,headBranch,headSha,createdAt,updatedAt,url,attempt"]);
  if (runs.status !== 0) {
    payload = { ...pendingReport("MANUAL_COLLECTION_REQUIRED"), repository, branch, head_sha: head, primary_error: runs.stderr || runs.stdout };
  } else {
    const parsed = JSON.parse(runs.stdout || "[]");
    const selected = parsed.find((run) => run.headSha === head) ?? parsed[0] ?? null;
    if (!selected) {
      payload = { ...pendingReport("PENDING_RUNTIME_EVIDENCE"), repository, branch, head_sha: head, primary_error: "No workflow run found." };
    } else {
      const details = gh(root, ["run", "view", String(selected.databaseId), "--json", "databaseId,number,name,event,status,conclusion,headBranch,headSha,url,jobs,createdAt,updatedAt,attempt"]);
      const detail = details.status === 0 ? JSON.parse(details.stdout) : selected;
      const jobs = detail.jobs ?? [];
      const validationJob = jobs.find((job) => job.name === EXPECTED_JOB) ?? null;
      const artifacts = gh(root, ["api", `repos/${repository}/actions/runs/${selected.databaseId}/artifacts`]);
      const artifactPayload = artifacts.status === 0 ? JSON.parse(artifacts.stdout) : { total_count: null, artifacts: [] };
      payload = {
        cycle: "9.1",
        result: detail.conclusion === "success" ? "GITHUB_ACTIONS_RUN_COLLECTED" : "PENDING_RUNTIME_EVIDENCE",
        decision: DECISION_PREPARE,
        repository,
        workflow_name: detail.name ?? WORKFLOW_NAME,
        workflow_file: WORKFLOW_FILE,
        run_id: detail.databaseId,
        run_number: detail.number,
        event: detail.event,
        head_branch: detail.headBranch,
        head_sha: detail.headSha,
        status: detail.status,
        conclusion: detail.conclusion,
        created_at: detail.createdAt,
        updated_at: detail.updatedAt,
        html_url: detail.url,
        expected_runner: "ubuntu-latest",
        jobs,
        job_names: jobs.map((job) => job.name),
        check_name_real: validationJob ? `${detail.name} / ${validationJob.name}` : null,
        cleanup_conclusion: validationJob?.steps?.find((step) => step.name === "Cleanup")?.conclusion ?? null,
        artifact_names: (artifactPayload.artifacts ?? []).map((artifact) => artifact.name),
        artifact_count: artifactPayload.total_count,
        run_attempt: detail.attempt,
        remote_access_performed: false,
        secrets_collected: false,
        primary_error: detail.conclusion === "success" ? null : "Workflow run is not successful yet.",
      };
    }
  }
}

writeJson(root, "github-actions-run-result.json", payload);
writeMarkdown(root, "github-actions-run-summary.md", [
  "# GitHub Actions Runtime Evidence",
  "",
  `- Result: ${payload.result}`,
  `- Repository: ${payload.repository ?? "unknown"}`,
  `- Workflow: ${payload.workflow_name}`,
  `- Run ID: ${payload.run_id ?? "pending"}`,
  `- Check name: ${payload.check_name_real ?? "pending"}`,
  `- Conclusion: ${payload.conclusion ?? "pending"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

console.log(payload.result);
