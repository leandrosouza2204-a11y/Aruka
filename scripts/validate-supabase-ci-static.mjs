import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { CYCLE_9_DECISION, writeJsonReport, writeMarkdownReport } from "./supabase-cycle-9-lib.mjs";

const root = process.cwd();
const errors = [];

function list(dir) {
  const absolute = join(root, dir);
  if (!existsSync(absolute)) return [];
  const out = [];
  for (const entry of readdirSync(absolute)) {
    const full = join(absolute, entry);
    const rel = relative(root, full).replaceAll("\\", "/");
    if (statSync(full).isDirectory()) out.push(...list(rel));
    else out.push(rel);
  }
  return out;
}

function run(label, command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", shell: false, timeout: 120000 });
  if (result.status !== 0) errors.push(`${label} failed: ${result.stderr || result.stdout || result.error?.message}`);
}

const nodeFiles = list("scripts").filter((file) => file.endsWith(".mjs"));
for (const file of nodeFiles) run(`node --check ${file}`, "node", ["--check", file]);

const psFiles = list("scripts").filter((file) => file.endsWith(".ps1"));
const pwsh = process.platform === "win32" ? "powershell.exe" : "pwsh";
for (const file of psFiles) {
  if (process.platform === "win32") {
    run(`PowerShell parse ${file}`, pwsh, ["-NoProfile", "-NonInteractive", "-Command", `$null = [System.Management.Automation.Language.Parser]::ParseFile('${file.replaceAll("'", "''")}', [ref]$null, [ref]$null)`]);
  } else {
    run(`PowerShell parse ${file}`, pwsh, ["-NoProfile", "-NonInteractive", "-Command", `$null = [System.Management.Automation.Language.Parser]::ParseFile('${file.replaceAll("'", "''")}', [ref]$null, [ref]$null)`]);
  }
}

for (const file of [...list("reports/supabase-ci"), ...list("reports/supabase-local-bootstrap"), ...list("reports/supabase-local-seeds")].filter((item) => item.endsWith(".json"))) {
  try {
    JSON.parse(readFileSync(join(root, file), "utf8").replace(/^\uFEFF/, ""));
  } catch (error) {
    errors.push(`${file} invalid JSON: ${error.message}`);
  }
}

run("git diff --check", "git", ["diff", "--check"]);

const payload = {
  cycle: "9",
  result: errors.length ? "CI_STATIC_REJECTED" : "CI_STATIC_VALIDATED",
  decision: errors.length ? "CI_QUALITY_GATES_REJECTED" : CYCLE_9_DECISION,
  node_files_checked: nodeFiles.length,
  powershell_files_checked: psFiles.length,
  json_reports_checked: [...list("reports/supabase-ci"), ...list("reports/supabase-local-bootstrap"), ...list("reports/supabase-local-seeds")].filter((item) => item.endsWith(".json")).length,
  errors,
  primary_error: errors[0] ?? null,
};

writeJsonReport(root, "ci-static-result.json", payload);
writeMarkdownReport(root, "ci-static-summary.md", [
  "# CI Static Validation",
  "",
  `- Result: ${payload.result}`,
  `- Node files checked: ${payload.node_files_checked}`,
  `- PowerShell files checked: ${payload.powershell_files_checked}`,
  `- JSON reports checked: ${payload.json_reports_checked}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("CI_STATIC_VALIDATED");
