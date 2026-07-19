import { spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";

const timeoutMs = 30 * 60 * 1000;
const reportPath = "reports/supabase-local-bootstrap/clean-worktree-result.json";
const summaryPath = "reports/supabase-local-bootstrap/clean-worktree-summary.md";
const wrapperReportPath = "reports/supabase-local-bootstrap/clean-worktree-wrapper-result.json";
const wrapperSummaryPath = "reports/supabase-local-bootstrap/clean-worktree-wrapper-summary.md";
const approvedDbUrl = "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]";
const startedAt = new Date();

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run() {
  return new Promise((resolve) => {
    const powershellCommand = process.platform === "win32" ? "powershell.exe" : "pwsh";
    const child = spawn(powershellCommand, [
      "-NoProfile",
      "-NonInteractive",
      "-ExecutionPolicy",
      "Bypass",
      "-File",
      "./scripts/test-supabase-clean-worktree.ps1",
    ], { stdio: ["ignore", "pipe", "pipe"], shell: false });

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
      setTimeout(() => {
        if (!child.killed) child.kill("SIGKILL");
      }, 5000).unref();
    }, timeoutMs);

    child.stdout.on("data", (chunk) => { stdout += chunk.toString("utf8"); });
    child.stderr.on("data", (chunk) => { stderr += chunk.toString("utf8"); });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut, closeEventReceived: true });
    });
  });
}

const result = await run();
const finishedAt = new Date();
const durationSeconds = Math.round((finishedAt.getTime() - startedAt.getTime()) / 1000);
if (result.timedOut) fail("Clean worktree wrapper timed out.");
if (result.code !== 0) fail(`Clean worktree wrapper exited with ${result.code}.\n${result.stdout}\n${result.stderr}`);
if (!result.stdout.includes("CLEAN_WORKTREE_VALIDATED")) fail("Clean worktree wrapper did not print success marker.");
if (!existsSync(reportPath)) fail("Missing clean worktree result report.");
if (!existsSync(summaryPath)) fail("Missing clean worktree summary report.");

const report = JSON.parse(readFileSync(reportPath, "utf8"));
const powershellResultValidated = report.result === "CLEAN_WORKTREE_VALIDATED";
const powershellDecisionValidated = report.decision === "LOCAL_REPRODUCIBILITY_VALIDATED";
if (!powershellResultValidated) fail("Clean worktree JSON result is not validated.");
if (!powershellDecisionValidated) fail("Clean worktree JSON decision is not validated.");
if (!["LOCAL", "ISOLATED_CI"].includes(report.mode)) fail("Clean worktree report mode is invalid.");
if (typeof report.expected_hml_preservation !== "boolean") fail("Clean worktree report is missing expected_hml_preservation.");
if (typeof report.actual_hml_preservation !== "boolean") fail("Clean worktree report is missing actual_hml_preservation.");
if (report.assertion_passed !== true) fail("Clean worktree HML preservation assertion did not pass.");
if (report.remote_access !== "none") fail("Clean worktree reported remote access.");
if (!report.cleanup?.worktree_removed || !report.cleanup?.temp_dir_removed || !report.cleanup?.containers_removed || !report.cleanup?.volumes_removed) {
  fail("Clean worktree cleanup flags are not all true.");
}

const reportText = readFileSync(reportPath, "utf8") + "\n" + readFileSync(summaryPath, "utf8");
const scanText = reportText.split(approvedDbUrl).join("");
if (/postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i.test(scanText)) fail("Clean worktree reports contain credentialed DB URL.");
if (/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/.test(reportText)) fail("Clean worktree reports contain JWT-like token.");
if (/sb_secret_[A-Za-z0-9_-]+/i.test(reportText)) fail("Clean worktree reports contain secret-like token.");

const worktrees = execFileSync("git", ["worktree", "list", "--porcelain"], { encoding: "utf8" });
const tempContainers = execFileSync("docker", ["ps", "-a", "--filter", "name=aruka_clean_worktree_validation", "--format", "{{.Names}}"], { encoding: "utf8" }).trim();
const volumes = execFileSync("docker", ["volume", "ls", "--format", "{{.Name}}"], { encoding: "utf8" });
const tempDirectoryRemoved = !readdirSync(tmpdir(), { withFileTypes: true })
  .some((entry) => entry.isDirectory() && entry.name.startsWith("aruka-clean-worktree-"));
const cleanup = {
  worktree_removed: !/aruka_clean_worktree_validation/i.test(worktrees),
  temp_directory_removed: tempDirectoryRemoved,
  containers_removed: tempContainers.length === 0,
  volumes_removed: !/aruka_clean_worktree_validation/i.test(volumes),
};
if (!cleanup.worktree_removed || !cleanup.temp_directory_removed || !cleanup.containers_removed || !cleanup.volumes_removed) fail("Wrapper cleanup verification failed.");

const wrapperReport = {
  cycle: "7.2.1",
  result: "CLEAN_WORKTREE_WRAPPER_VALIDATED",
  decision: "LOCAL_REPRODUCIBILITY_VALIDATED",
  started_at: startedAt.toISOString(),
  finished_at: finishedAt.toISOString(),
  duration_seconds: durationSeconds,
  powershell_exit_code: result.code,
  powershell_timed_out: result.timedOut,
  close_event_received: result.closeEventReceived,
  success_marker_found: result.stdout.includes("CLEAN_WORKTREE_VALIDATED"),
  success_marker_seen: result.stdout.includes("CLEAN_WORKTREE_VALIDATED"),
  powershell_report_found: existsSync(reportPath),
  powershell_summary_found: existsSync(summaryPath),
  powershell_result_validated: powershellResultValidated,
  powershell_decision_validated: powershellDecisionValidated,
  powershell_process_exited: true,
  powershell_process_finished: true,
  credential_scan_passed: true,
  jwt_scan_passed: true,
  secret_scan_passed: true,
  cleanup,
  manual_intervention_required: false,
  remote_access_performed: false,
  edge_functions_deployed: false,
  primary_error: null,
  residual_risks: [],
};
writeFileSync(wrapperReportPath, `${JSON.stringify(wrapperReport, null, 2)}\n`, "utf8");
writeFileSync(wrapperSummaryPath, [
  "# Clean Worktree Wrapper Validation",
  "",
  "- Cycle: 7.2.1",
  "- Result: CLEAN_WORKTREE_WRAPPER_VALIDATED",
  "- Decision: LOCAL_REPRODUCIBILITY_VALIDATED",
  `- Started at: ${wrapperReport.started_at}`,
  `- Finished at: ${wrapperReport.finished_at}`,
  `- Duration seconds: ${durationSeconds}`,
  `- PowerShell exit code: ${result.code}`,
  `- PowerShell timed out: ${result.timedOut}`,
  `- Close event received: ${result.closeEventReceived}`,
  `- Success marker found: ${wrapperReport.success_marker_found}`,
  `- PowerShell result validated: ${powershellResultValidated}`,
  `- PowerShell decision validated: ${powershellDecisionValidated}`,
  "- Manual intervention required: false",
  "- Credential scan passed: true",
  "- JWT scan passed: true",
  "- Secret scan passed: true",
  `- Worktree removed: ${cleanup.worktree_removed}`,
  `- Temp directory removed: ${cleanup.temp_directory_removed}`,
  `- Containers removed: ${cleanup.containers_removed}`,
  `- Volumes removed: ${cleanup.volumes_removed}`,
  "- Remote access performed: false",
  "- Edge Functions deployed: false",
  "",
].join("\n"), "utf8");

console.log("Clean worktree wrapper validation passed.");
