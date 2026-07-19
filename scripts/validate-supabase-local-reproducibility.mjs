import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";

const args = process.argv.slice(2);
const rootArg = args.find((arg) => arg.startsWith("--root="));
const modeArg = args.find((arg) => arg.startsWith("--mode="));
const root = rootArg ? rootArg.slice("--root=".length) : process.cwd();
const mode = modeArg ? modeArg.slice("--mode=".length) : "normal";
const requireCycle71Reports = mode !== "negative-fixture";
const errors = [];

const expectedSha = "F7C580FD9677D4E2C6F28E2944CBA75BC17D0F88528F1372BFD3F1C0DC04000A";
const baseline = "supabase/migrations/20260716090000_baseline_aruka_v1.sql";
const forbiddenProjectRef = "xrmqdkpx" + "nfvusmenadnf";
const APPROVED_REDACTED_DB_URL =
  "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]";
const requiredScripts = [
  "scripts/supabase-local-preflight.ps1",
  "scripts/supabase-local-bootstrap.ps1",
  "scripts/supabase-local-validate.ps1",
  "scripts/supabase-local-stop.ps1",
  "scripts/supabase-local-clean.ps1",
  "scripts/supabase-local-cli.mjs",
  "scripts/test-supabase-clean-worktree.ps1",
  "scripts/test-supabase-clean-worktree-wrapper.mjs",
  "scripts/test-supabase-local-reproducibility-negative.mjs",
];
const requiredReports = [
  "reports/supabase-local-bootstrap/clean-worktree-summary.md",
  "reports/supabase-local-bootstrap/clean-worktree-result.json",
  "reports/supabase-local-bootstrap/clean-worktree-wrapper-summary.md",
  "reports/supabase-local-bootstrap/clean-worktree-wrapper-result.json",
  "reports/supabase-local-bootstrap/negative-mutations-summary.md",
  "reports/supabase-local-bootstrap/negative-mutations-result.json",
];

function pathOf(file) {
  return join(root, file);
}

function read(file) {
  return readFileSync(pathOf(file), "utf8");
}

function fail(message) {
  errors.push(message);
}

function listFiles(dir) {
  const absolute = pathOf(dir);
  if (!existsSync(absolute)) return [];
  const out = [];
  for (const entry of readdirSync(absolute)) {
    const full = join(absolute, entry);
    const rel = relative(root, full).replaceAll("\\", "/");
    if (statSync(full).isDirectory()) out.push(...listFiles(rel));
    else out.push(rel);
  }
  return out;
}

function readJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`${file} is not valid JSON: ${error.message}`);
    return null;
  }
}

function sha256(file) {
  return createHash("sha256").update(readFileSync(pathOf(file))).digest("hex").toUpperCase();
}

function sha256CanonicalText(file) {
  let bytes = readFileSync(pathOf(file));
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    bytes = bytes.subarray(3);
  }
  const text = bytes.toString("utf8").replace(/\r\n?/g, "\n");
  return createHash("sha256").update(Buffer.from(text, "utf8")).digest("hex").toUpperCase();
}

for (const script of requiredScripts) {
  if (!existsSync(pathOf(script))) fail(`Missing ${script}`);
}

if (!existsSync(pathOf("package.json"))) {
  fail("Missing package.json");
} else {
  const pkg = readJson("package.json");
  const expected = [
    "supabase:preflight",
    "supabase:bootstrap",
    "supabase:validate",
    "supabase:status",
    "supabase:stop",
    "supabase:clean",
    "qa:supabase-local-reproducibility",
    "qa:supabase-clean-worktree",
    "qa:supabase-clean-worktree-wrapper",
    "qa:supabase-local-negative",
  ];
  for (const name of expected) {
    if (!pkg?.scripts?.[name]) fail(`Missing package script ${name}`);
  }
}

const scanFiles = [...requiredScripts, "package.json"].filter((file) => existsSync(pathOf(file)));
for (const file of scanFiles) {
  const text = read(file);
  const forbidden = [
    [new RegExp("--" + "linked", "i"), "linked flag"],
    [new RegExp("--project" + "-ref", "i"), "project ref flag"],
    [new RegExp("--db" + "-url", "i"), "db url flag"],
    [new RegExp("supabase" + "\\.co", "i"), "remote Supabase URL"],
    [new RegExp(forbiddenProjectRef, "i"), "HML project ref"],
    [new RegExp("\\bdb\\s+" + "push\\b", "i"), "db push command"],
    [new RegExp("migration\\s+" + "repair", "i"), "migration repair command"],
    [/\bSERVICE_ROLE_KEY\b|\bANON_KEY\b|\bSECRET_KEY\b|sb_secret_[A-Za-z0-9_-]+/i, "secret-like token"],
  ];
  for (const [pattern, label] of forbidden) {
    if (pattern.test(text)) fail(`${file} contains forbidden pattern: ${label}`);
  }
}

if (!existsSync(pathOf("supabase/config.toml"))) {
  fail("Missing supabase/config.toml");
} else {
  const config = read("supabase/config.toml");
  const projectMatch = config.match(/^project_id\s*=\s*"([^"]*)"/m);
  if (!projectMatch) fail("Missing project_id in supabase/config.toml");
  if (projectMatch && projectMatch[1].trim() === "") fail("Empty project_id in supabase/config.toml");
  const ports = [...config.matchAll(/(?:^|\n)\s*(?:port|shadow_port)\s*=\s*(\d+)/g)].map((match) => Number(match[1]));
  for (const port of ports) {
    if (!Number.isInteger(port) || port < 1024 || port > 65535) fail(`Invalid local port in supabase/config.toml: ${port}`);
  }
  if (new Set(ports).size !== ports.length) fail("Duplicate local ports in supabase/config.toml");
}

if (!existsSync(pathOf(baseline))) {
  fail("Missing official baseline");
} else if (sha256CanonicalText(baseline) !== expectedSha) {
  fail("Official baseline SHA mismatch");
}

const migrationFiles = listFiles("supabase/migrations").filter((file) => file.endsWith(".sql"));
if (migrationFiles.length !== 1 || migrationFiles[0] !== baseline) {
  fail("Active migrations folder must contain only the official baseline SQL");
}

for (const file of migrationFiles) {
  const name = file.split("/").pop();
  if (!/^\d{14}_[a-z0-9_]+\.sql$/.test(name)) fail(`Invalid migration timestamp/name: ${name}`);
  if (/agendar_encerramentos_automaticos_dry_run/i.test(name)) fail("Operational migration returned to active folder");
}

const allMigrationText = migrationFiles.map((file) => read(file)).join("\n");
for (const [pattern, label] of [
  [/\bcreate\s+table\b/gi, "CREATE TABLE"],
  [/\bcreate\s+policy\b/gi, "CREATE POLICY"],
  [/\bcreate\s+(?:or\s+replace\s+)?function\b/gi, "CREATE FUNCTION"],
]) {
  const count = [...allMigrationText.matchAll(pattern)].length;
  if (migrationFiles.length > 1 && count > 0) fail(`Active migrations duplicate baseline structural ${label}`);
}

const clean = existsSync(pathOf("scripts/supabase-local-clean.ps1")) ? read("scripts/supabase-local-clean.ps1") : "";
if (/docker\s+rm\s+-f\s+\$\(docker\s+ps/i.test(clean) || /docker\s+system\s+prune/i.test(clean)) {
  fail("Clean script contains broad Docker removal");
}
if (!/\$ProjectId/.test(clean)) fail("Clean script must use an explicit project_id filter");
if (/docker\s+volume\s+rm\s+\$\(docker\s+volume\s+ls/i.test(clean)) fail("Clean script contains broad Docker volume removal");

if (requireCycle71Reports) {
  for (const report of requiredReports) {
    if (!existsSync(pathOf(report))) fail(`Missing ${report}`);
  }
  const worktreeResult = existsSync(pathOf(requiredReports[1])) ? readJson(requiredReports[1]) : null;
  if (worktreeResult?.result !== "CLEAN_WORKTREE_VALIDATED") fail("Clean worktree result is not validated");
  if (worktreeResult?.cleanup?.worktree_removed !== true) fail("Clean worktree cleanup did not remove worktree");
  if (worktreeResult?.cleanup?.temp_dir_removed !== true) fail("Clean worktree cleanup did not remove temp directory");
  if (worktreeResult?.remote_access !== "none") fail("Clean worktree reported remote access");

  const wrapperResult = existsSync(pathOf(requiredReports[3])) ? readJson(requiredReports[3]) : null;
  if (wrapperResult?.result !== "CLEAN_WORKTREE_WRAPPER_VALIDATED") fail("Clean worktree wrapper result is not validated");
  if (wrapperResult?.decision !== "LOCAL_REPRODUCIBILITY_VALIDATED") fail("Clean worktree wrapper decision is not validated");
  if (wrapperResult?.powershell_exit_code !== 0) fail("Clean worktree wrapper PowerShell exit code is not zero");
  if (wrapperResult?.powershell_timed_out !== false) fail("Clean worktree wrapper timed out");
  if (wrapperResult?.close_event_received !== true) fail("Clean worktree wrapper close event was not received");
  if (wrapperResult?.success_marker_found !== true) fail("Clean worktree wrapper success marker was not found");
  if (wrapperResult?.powershell_report_found !== true) fail("Clean worktree wrapper did not find PowerShell report");
  if (wrapperResult?.powershell_summary_found !== true) fail("Clean worktree wrapper did not find PowerShell summary");
  if (wrapperResult?.powershell_result_validated !== true) fail("Clean worktree wrapper did not validate PowerShell result");
  if (wrapperResult?.powershell_decision_validated !== true) fail("Clean worktree wrapper did not validate PowerShell decision");
  if (wrapperResult?.powershell_process_exited !== true) fail("Clean worktree wrapper PowerShell process did not exit");
  if (wrapperResult?.credential_scan_passed !== true) fail("Clean worktree wrapper credential scan did not pass");
  if (wrapperResult?.jwt_scan_passed !== true) fail("Clean worktree wrapper JWT scan did not pass");
  if (wrapperResult?.secret_scan_passed !== true) fail("Clean worktree wrapper secret scan did not pass");
  if (wrapperResult?.cleanup?.worktree_removed !== true) fail("Clean worktree wrapper cleanup did not remove worktree");
  if (wrapperResult?.cleanup?.temp_directory_removed !== true) fail("Clean worktree wrapper cleanup did not remove temp directory");
  if (wrapperResult?.cleanup?.containers_removed !== true) fail("Clean worktree wrapper cleanup did not remove containers");
  if (wrapperResult?.cleanup?.volumes_removed !== true) fail("Clean worktree wrapper cleanup did not remove volumes");
  if (wrapperResult?.manual_intervention_required !== false) fail("Clean worktree wrapper required manual intervention");
  if (wrapperResult?.remote_access_performed !== false) fail("Clean worktree wrapper reported remote access");
  if (wrapperResult?.edge_functions_deployed !== false) fail("Clean worktree wrapper reported Edge Function deploy");
  if (wrapperResult?.primary_error !== null) fail("Clean worktree wrapper reported primary error");

  const negativeResult = existsSync(pathOf(requiredReports[5])) ? readJson(requiredReports[5]) : null;
  if (negativeResult?.result !== "MUTATIONS_REJECTED") fail("Negative mutation result is not rejected");
  if (negativeResult?.rejected !== 20 || negativeResult?.total !== 20) fail("Expected 20/20 negative mutations rejected");

  const reports = listFiles("reports/supabase-local-bootstrap");
  for (const report of reports) {
    const text = read(report);
    const textWithoutApprovedDbUrl = text.split(APPROVED_REDACTED_DB_URL).join("");
    if (/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/.test(text)) fail(`${report} contains JWT-like token`);
    if (/postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i.test(textWithoutApprovedDbUrl)) fail(`${report} contains credentialed DB URL`);
    if (/sb_secret_[A-Za-z0-9_-]+/i.test(text)) fail(`${report} contains secret-like token`);
  }

  const tempDirs = listFiles("reports/supabase-local-bootstrap").filter((file) => /(^|\/)tmp[^/]*\//.test(file));
  if (tempDirs.length > 0) fail("Temporary report directories remain under reports/supabase-local-bootstrap");
}

if (mode === "normal") {
  try {
    const worktrees = execFileSync("git", ["worktree", "list", "--porcelain"], { cwd: root, encoding: "utf8" });
    if (/aruka_clean_worktree_validation/i.test(worktrees)) fail("Temporary clean worktree is still registered");
  } catch {
    fail("Unable to inspect git worktrees");
  }
  try {
    const containers = execFileSync("docker", ["ps", "-a", "--filter", "name=aruka_clean_worktree_validation", "--format", "{{.Names}}"], { encoding: "utf8" }).trim();
    if (containers) fail("Temporary clean worktree containers remain");
    const volumes = execFileSync("docker", ["volume", "ls", "--format", "{{.Name}}"], { encoding: "utf8" }).trim();
    if (/aruka_clean_worktree_validation/i.test(volumes)) fail("Temporary clean worktree volumes remain");
  } catch {
    fail("Unable to inspect Docker cleanup state");
  }
}

if (errors.length) {
  console.error("Supabase local reproducibility validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Supabase local reproducibility validation passed.");
