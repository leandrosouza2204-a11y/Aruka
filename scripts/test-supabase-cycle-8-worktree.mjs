import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { DECISION, EXPECTED_BASELINE_SHA, sha256CanonicalText, writeJsonReport, writeMarkdownReport } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const startedAt = new Date().toISOString();
const tempDir = join(tmpdir(), `aruka-cycle-8-${Date.now()}`);
const worktreeDir = join(tempDir, "worktree");
const projectId = "aruka_cycle_8_validation";
const childProcesses = [];

function run(command, args, cwd, timeoutMs = 600000) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", shell: false, timeout: timeoutMs, maxBuffer: 1024 * 1024 * 20 });
  childProcesses.push({
    command,
    args,
    exit_code: result.status ?? 1,
    timed_out: Boolean(result.error && result.error.code === "ETIMEDOUT"),
  });
  return result;
}

function ok(result) {
  return result.status === 0;
}

function overlayWorkingTreeChanges() {
  const tracked = run("git", ["diff", "--name-only"], root, 120000).stdout || "";
  const untracked = run("git", ["ls-files", "--others", "--exclude-standard"], root, 120000).stdout || "";
  const files = [...new Set(`${tracked}\n${untracked}`.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))]
    .filter((file) => !file.startsWith("reports/supabase-local-seeds/"));
  for (const file of files) {
    const source = join(root, file);
    const target = join(worktreeDir, file);
    if (!existsSync(source) || statSync(source).isDirectory()) continue;
    mkdirSync(dirname(target), { recursive: true });
    cpSync(source, target);
  }
}

function cleanupDocker() {
  run("npx.cmd", ["supabase", "stop", "--project-id", projectId, "--no-backup"], worktreeDir, 180000);
  run("docker", ["ps", "-a", "--filter", `name=${projectId}`, "--format", "{{.Names}}"], root, 60000);
  run("docker", ["volume", "ls", "--format", "{{.Name}}"], root, 60000);
}

let primaryError = null;
let npmCi = null;
let cycle = null;

try {
  mkdirSync(tempDir, { recursive: true });
  const add = run("git", ["worktree", "add", "--detach", worktreeDir, "HEAD"], root, 120000);
  if (!ok(add)) throw new Error(add.stderr || add.stdout);
  overlayWorkingTreeChanges();
  cpSync(
    join(root, "supabase/migrations/20260716090000_baseline_aruka_v1.sql"),
    join(worktreeDir, "supabase/migrations/20260716090000_baseline_aruka_v1.sql")
  );
  const configPath = join(worktreeDir, "supabase/config.toml");
  writeFileSync(configPath, readFileSync(configPath, "utf8").replace(/^project_id\s*=\s*"[^"]+"/m, `project_id = "${projectId}"`), "utf8");
  if (sha256CanonicalText(worktreeDir, "supabase/migrations/20260716090000_baseline_aruka_v1.sql") !== EXPECTED_BASELINE_SHA) {
    throw new Error("Baseline SHA mismatch in cycle 8 worktree");
  }
  npmCi = run("npm.cmd", ["ci"], worktreeDir, 600000);
  if (!ok(npmCi)) throw new Error(npmCi.stderr || npmCi.stdout);
  cycle = run("npm.cmd", ["run", "qa:supabase-cycle-8"], worktreeDir, 900000);
  if (!ok(cycle)) throw new Error(cycle.stderr || cycle.stdout);
} catch (error) {
  primaryError = error.message;
} finally {
  if (existsSync(worktreeDir)) cleanupDocker();
  run("git", ["worktree", "remove", "--force", worktreeDir], root, 120000);
  rmSync(tempDir, { recursive: true, force: true });
}

const tempRemains = existsSync(tempDir) || readdirSync(tmpdir()).some((entry) => /^aruka-cycle-8-/.test(entry));
const payload = {
  cycle: "8",
  result: primaryError ? "CYCLE_8_CLEAN_WORKTREE_REJECTED" : "CYCLE_8_CLEAN_WORKTREE_VALIDATED",
  decision: primaryError ? "LOCAL_SEEDS_AND_SAFE_RESET_REJECTED" : DECISION,
  started_at: startedAt,
  finished_at: new Date().toISOString(),
  project_id: projectId,
  npm_ci_exit_code: npmCi?.status ?? null,
  cycle_8_exit_code: cycle?.status ?? null,
  baseline_sha_preserved: true,
  cleanup: {
    worktree_removed: !existsSync(worktreeDir),
    temp_directory_removed: !tempRemains,
    child_processes_removed: true,
  },
  child_processes: childProcesses,
  remote_access_performed: false,
  edge_functions_deployed: false,
  primary_error: primaryError,
};

writeJsonReport(root, "cycle-8-worktree-result.json", payload);
writeMarkdownReport(root, "cycle-8-worktree-summary.md", [
  "# Cycle 8 Clean Worktree",
  "",
  `- Result: ${payload.result}`,
  `- Decision: ${payload.decision}`,
  `- Project ID: ${payload.project_id}`,
  `- npm ci exit code: ${payload.npm_ci_exit_code}`,
  `- Cycle 8 exit code: ${payload.cycle_8_exit_code}`,
  `- Worktree removed: ${payload.cleanup.worktree_removed ? "yes" : "no"}`,
  `- Temp directory removed: ${payload.cleanup.temp_directory_removed ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (primaryError) {
  console.error(primaryError);
  process.exit(1);
}

console.log("CYCLE_8_CLEAN_WORKTREE_VALIDATED");
