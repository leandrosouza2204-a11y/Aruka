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

try {
  const manifest = JSON.parse(readFileSync(join(root, "supabase/baseline-candidate/manifest.json"), "utf8"));
  if (manifest.expected_functions !== 15) errors.push(`manifest.expected_functions must be 15, got ${manifest.expected_functions}`);
  const baselineRuntimeValidator = "scripts/validate-supabase-baseline-local.ps1";
  const baselineRuntimeText = readFileSync(join(root, baselineRuntimeValidator), "utf8");
  if (/Assert-?Count\s+"public_functions"\s+14\b/i.test(baselineRuntimeText)) {
    errors.push(`${baselineRuntimeValidator} still hardcodes public_functions expected 14`);
  }
  if (!/expected_functions/i.test(baselineRuntimeText)) {
    errors.push(`${baselineRuntimeValidator} must derive public_functions from baseline-candidate manifest expected_functions`);
  }
  if (/Assert-?Count\s+"public_policies"\s+\$[Ee]xpectedPolicies\b/i.test(baselineRuntimeText)) {
    errors.push(`${baselineRuntimeValidator} must not compare manifest expected_policies with public-only pg_policies`);
  }
  if (!/Assert-?Count\s+"total_policies"\s+\$[Ee]xpectedPolicies\b/i.test(baselineRuntimeText)) {
    errors.push(`${baselineRuntimeValidator} must compare manifest expected_policies with total pg_policies`);
  }

  const localRuntimeValidator = "scripts/supabase-local-validate.ps1";
  const localRuntimeText = readFileSync(join(root, localRuntimeValidator), "utf8");
  for (const [name, value] of [
    ["ExpectedTables", "24"],
    ["ExpectedFunctions", "35"],
    ["ExpectedIndexes", "82"],
    ["ExpectedPolicies", "68"],
    ["ExpectedPublicPolicies", "64"],
    ["ExpectedStoragePolicies", "4"],
    ["ExpectedPublicRlsEnabledTables", "24"],
  ]) {
    if (!new RegExp(`\\$${name}\\s*=\\s*${value}\\b`).test(localRuntimeText)) {
      errors.push(`${localRuntimeValidator} must validate current local runtime ${name}=${value}`);
    }
  }
  for (const version of ["20260728030000", "20260730090000", "20260731190000", "20260801143335", "20260801173000", "20260801180000", "20260811090000", "20260815120000", "20260816120000", "20260819090000", "20260821120000", "20260822120000", "20260824120000", "20260829120000", "20260829173000", "20260830203000", "20260831090000"]) {
    if (!localRuntimeText.includes(`"${version}"`)) {
      errors.push(`${localRuntimeValidator} must validate executable migration version ${version}`);
    }
  }
  if (!/AssertExecutableMigrationHistory/i.test(localRuntimeText)) {
    errors.push(`${localRuntimeValidator} must validate executable migration history`);
  }
  for (const file of [baselineRuntimeValidator, localRuntimeValidator]) {
    const text = readFileSync(join(root, file), "utf8");
    if (/Assert-?Count\s+"public_functions"\s+14\b/i.test(text)) {
      errors.push(`${file} still hardcodes public_functions expected 14`);
    }
    if (/Assert-?Count\s+"public_policies"\s+\$[Ee]xpectedPolicies\b/i.test(text)) {
      errors.push(`${file} must not compare manifest expected_policies with public-only pg_policies`);
    }
    if (!/Assert-?Count\s+"total_policies"\s+\$[Ee]xpectedPolicies\b/i.test(text)) {
      errors.push(`${file} must compare manifest expected_policies with total pg_policies`);
    }
  }
} catch (error) {
  errors.push(`Unable to validate runtime function count expectation: ${error.message}`);
}

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
