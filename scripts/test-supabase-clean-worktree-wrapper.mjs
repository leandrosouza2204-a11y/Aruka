import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const timeoutMs = 30 * 60 * 1000;
const reportPath = "reports/supabase-local-bootstrap/clean-worktree-result.json";
const summaryPath = "reports/supabase-local-bootstrap/clean-worktree-summary.md";
const approvedDbUrl = "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]";

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run() {
  return new Promise((resolve) => {
    const child = spawn("powershell.exe", [
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
      resolve({ code, stdout, stderr, timedOut });
    });
  });
}

const result = await run();
if (result.timedOut) fail("Clean worktree wrapper timed out.");
if (result.code !== 0) fail(`Clean worktree wrapper exited with ${result.code}.\n${result.stderr}`);
if (!result.stdout.includes("CLEAN_WORKTREE_VALIDATED")) fail("Clean worktree wrapper did not print success marker.");
if (!existsSync(reportPath)) fail("Missing clean worktree result report.");
if (!existsSync(summaryPath)) fail("Missing clean worktree summary report.");

const report = JSON.parse(readFileSync(reportPath, "utf8"));
if (report.result !== "CLEAN_WORKTREE_VALIDATED") fail("Clean worktree JSON result is not validated.");
if (report.decision !== "LOCAL_REPRODUCIBILITY_VALIDATED") fail("Clean worktree JSON decision is not validated.");
if (report.remote_access !== "none") fail("Clean worktree reported remote access.");
if (!report.cleanup?.worktree_removed || !report.cleanup?.temp_dir_removed || !report.cleanup?.containers_removed || !report.cleanup?.volumes_removed) {
  fail("Clean worktree cleanup flags are not all true.");
}

const reportText = readFileSync(reportPath, "utf8") + "\n" + readFileSync(summaryPath, "utf8");
const scanText = reportText.split(approvedDbUrl).join("");
if (/postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i.test(scanText)) fail("Clean worktree reports contain credentialed DB URL.");
if (/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/.test(reportText)) fail("Clean worktree reports contain JWT-like token.");
if (/sb_secret_[A-Za-z0-9_-]+/i.test(reportText)) fail("Clean worktree reports contain secret-like token.");

console.log("Clean worktree wrapper validation passed.");
