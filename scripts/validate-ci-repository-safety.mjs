import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import {
  BASELINE_PATH,
  CYCLE_9_DECISION,
  EXPECTED_BASELINE_SHA,
  PROTECTED_PROJECT_REF,
  WORKFLOW_PATH,
  assertNoForbiddenContent,
  listFiles,
  sha256CanonicalText,
  writeJsonReport,
  writeMarkdownReport,
} from "./supabase-cycle-9-lib.mjs";

const root = process.cwd();
const errors = [];
const fail = (message) => errors.push(message);
const baselineExists = existsSync(join(root, BASELINE_PATH));
const actualBaselineSha = baselineExists ? sha256CanonicalText(root, BASELINE_PATH) : null;

if (!baselineExists) fail("Official baseline missing");
else if (actualBaselineSha !== EXPECTED_BASELINE_SHA) fail("Official baseline SHA mismatch");

const activeMigrations = listFiles(root, "supabase/migrations").filter((file) => file.endsWith(".sql"));
if (activeMigrations.length !== 1 || activeMigrations[0] !== BASELINE_PATH) fail("Active migrations must contain only the official baseline SQL");
if (listFiles(root, "supabase/migrations").some((file) => /archive|agendar_encerramentos/i.test(file))) fail("Archived or operational migration appears in active chain");

const trackedEnv = execFileSync("git", ["ls-files", ".env", ".env.*"], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);
if (trackedEnv.length) fail(`Tracked env files are not allowed: ${trackedEnv.join(", ")}`);

const files = [
  WORKFLOW_PATH,
  "package.json",
  "package-lock.json",
  "scripts/supabase-cycle-9-lib.mjs",
  "scripts/validate-ci-repository-safety.mjs",
  "scripts/validate-supabase-ci-static.mjs",
  "scripts/configure-supabase-ci-project.mjs",
  "scripts/test-supabase-ci-negative.mjs",
  "scripts/validate-supabase-ci-evidence.mjs",
  "scripts/cleanup-supabase-ci.mjs",
  "scripts/validate-supabase-cycle-9.mjs",
  "scripts/test-supabase-cycle-9-local-runner.mjs",
  ...listFiles(root, "reports/supabase-ci").filter((file) => !/ci-negative/.test(file)),
];
try {
  assertNoForbiddenContent(root, files);
} catch (error) {
  fail(error.message);
}

const executableFiles = files.filter((file) => /^(scripts|\.github\/workflows|package\.json)/.test(file));
for (const file of executableFiles) {
  if (!existsSync(join(root, file))) continue;
  const text = readFileSync(join(root, file), "utf8");
  const forbidden = [
    [/supabase\s+link/i, "supabase link"],
    [/\bdb\s+push\b/i, "db push"],
    [/\bdb\s+pull\b/i, "db pull"],
    [/migration\s+repair/i, "migration repair"],
    [/functions\s+deploy/i, "functions deploy"],
    [/--linked/i, "linked flag"],
    [/--project-ref/i, "project ref flag"],
    [/--db-url/i, "db url flag"],
    [new RegExp(PROTECTED_PROJECT_REF, "i"), "protected HML project ref in executable context"],
  ];
  const allowedNegative =
    /test-supabase-(?:ci|local).*negative\.mjs$/.test(file) ||
    /supabase-cycle-9-lib\.mjs$/.test(file) ||
    /validate-ci-repository-safety\.mjs$/.test(file) ||
    /validate-supabase-cycle-9\.mjs$/.test(file);
  for (const [pattern, label] of forbidden) {
    if (pattern.test(text) && !allowedNegative) fail(`${file} contains forbidden operational pattern: ${label}`);
  }
}

if (!existsSync(join(root, WORKFLOW_PATH))) fail("Supabase CI workflow is missing");

const payload = {
  cycle: "9",
  result: errors.length ? "REPOSITORY_SAFETY_REJECTED" : "REPOSITORY_SAFETY_VALIDATED",
  decision: errors.length ? "CI_QUALITY_GATES_REJECTED" : CYCLE_9_DECISION,
  baseline_sha: actualBaselineSha,
  expected_baseline_sha: EXPECTED_BASELINE_SHA,
  baseline_sha_preserved: actualBaselineSha === EXPECTED_BASELINE_SHA,
  active_migrations: activeMigrations,
  forbidden_changes_found: false,
  remote_access_performed: false,
  edge_functions_deployed: false,
  errors,
  primary_error: errors[0] ?? null,
};

writeJsonReport(root, "repository-safety-result.json", payload);
writeMarkdownReport(root, "repository-safety-summary.md", [
  "# CI Repository Safety",
  "",
  `- Result: ${payload.result}`,
  `- Decision: ${payload.decision}`,
  `- Baseline SHA: ${payload.baseline_sha ?? "missing"}`,
  `- Expected baseline SHA: ${payload.expected_baseline_sha}`,
  `- Baseline preserved: ${payload.baseline_sha_preserved ? "yes" : "no"}`,
  `- Active migrations: ${activeMigrations.join(", ")}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
]);

if (errors.length) {
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("REPOSITORY_SAFETY_VALIDATED");
