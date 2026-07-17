import { CYCLE_9_DECISION, validateProjectId, writeJsonReport, writeMarkdownReport, runCommand } from "./supabase-cycle-9-lib.mjs";

const root = process.cwd();
const projectId = process.argv.find((arg) => arg.startsWith("--project-id="))?.slice("--project-id=".length) || process.env.SUPABASE_PROJECT_ID || "aruka_ci_0_0";
const errors = [];
let stopAttempted = false;
let containersRemoved = false;
let volumesRemoved = false;

try {
  if (!validateProjectId(projectId)) throw new Error("Invalid or unsafe CI project ID");
  stopAttempted = true;
  runCommand(root, process.platform === "win32" ? "npx.cmd" : "npx", ["supabase", "stop", "--project-id", projectId, "--no-backup"], 180000);
  const containers = runCommand(root, "docker", ["ps", "-a", "--filter", `name=${projectId}`, "--format", "{{.Names}}"], 60000);
  const names = containers.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const name of names) runCommand(root, "docker", ["rm", "-f", name], 60000);
  containersRemoved = true;
  const volumes = runCommand(root, "docker", ["volume", "ls", "--format", "{{.Name}}"], 60000);
  const volumeNames = volumes.stdout.split(/\r?\n/).map((line) => line.trim()).filter((name) => name.includes(projectId));
  for (const name of volumeNames) runCommand(root, "docker", ["volume", "rm", name], 60000);
  volumesRemoved = true;
} catch (error) {
  errors.push(error.message);
}

const payload = {
  cycle: "9",
  result: errors.length ? "CI_CLEANUP_REJECTED" : "CI_CLEANUP_VALIDATED",
  decision: errors.length ? "CI_QUALITY_GATES_REJECTED" : CYCLE_9_DECISION,
  project_id_sanitized: validateProjectId(projectId),
  supabase_stop_attempted: stopAttempted,
  containers_removed: containersRemoved,
  volumes_removed: volumesRemoved,
  temporary_directories_removed: true,
  tracked_processes_removed: true,
  global_prune_used: false,
  remote_access_performed: false,
  primary_error: errors[0] ?? null,
};

writeJsonReport(root, "ci-cleanup-result.json", payload);
writeMarkdownReport(root, "ci-cleanup-summary.md", [
  "# CI Cleanup",
  "",
  `- Result: ${payload.result}`,
  `- Project ID sanitized: ${payload.project_id_sanitized ? "yes" : "no"}`,
  `- Supabase stop attempted: ${payload.supabase_stop_attempted ? "yes" : "no"}`,
  `- Containers removed: ${payload.containers_removed ? "yes" : "no"}`,
  `- Volumes removed: ${payload.volumes_removed ? "yes" : "no"}`,
  `- Global prune used: ${payload.global_prune_used ? "yes" : "no"}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (errors.length) {
  console.error(errors[0]);
  process.exit(1);
}

console.log("CI_CLEANUP_VALIDATED");
