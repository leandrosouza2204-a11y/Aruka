import { mkdirSync, rmSync, cpSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const root = process.cwd();
const tempRoot = join(tmpdir(), `aruka-negative-${Date.now()}`);
const reportDir = join(root, "reports", "supabase-local-bootstrap");
const resultPath = join(reportDir, "negative-mutations-result.json");
const summaryPath = join(reportDir, "negative-mutations-summary.md");
const approvedDbUrl = "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]";

const copyTargets = [
  "package.json",
  "scripts/supabase-local-preflight.ps1",
  "scripts/supabase-local-bootstrap.ps1",
  "scripts/supabase-local-validate.ps1",
  "scripts/supabase-local-stop.ps1",
  "scripts/supabase-local-clean.ps1",
  "scripts/supabase-local-cli.mjs",
  "scripts/test-supabase-clean-worktree.ps1",
  "scripts/test-supabase-clean-worktree-wrapper.mjs",
  "scripts/test-supabase-local-reproducibility-negative.mjs",
  "scripts/validate-supabase-local-reproducibility.mjs",
  "supabase/config.toml",
  "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql",
  "supabase/migrations",
];

function ensureDir(file) {
  mkdirSync(join(tempRoot, file.split(/[\\/]/).slice(0, -1).join("/")), { recursive: true });
}

function mutateFile(file, fn) {
  const path = join(tempRoot, file);
  writeFileSync(path, fn(readFileSync(path, "utf8")), "utf8");
}

function runValidator() {
  return spawnSync("node", [join(root, "scripts/validate-supabase-local-reproducibility.mjs"), `--root=${tempRoot}`, "--mode=negative-fixture"], {
    cwd: root,
    encoding: "utf8",
    shell: false,
  });
}

function resetFixture() {
  rmSync(tempRoot, { recursive: true, force: true });
  for (const target of copyTargets) {
    ensureDir(target);
    cpSync(join(root, target), join(tempRoot, target), { recursive: true });
  }
}

const mutations = [
  ["baseline_missing", () => rmSync(join(tempRoot, "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql"), { force: true })],
  ["baseline_sha_changed", () => mutateFile("supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql", (text) => `${text}\n-- mutation\n`)],
  ["baseline_executable", () => writeFileSync(join(tempRoot, "supabase/migrations/20260716090000_baseline_aruka_v1.sql"), "-- baseline\n", "utf8")],
  ["historical_migration_active", () => writeFileSync(join(tempRoot, "supabase/migrations/20260705090000_hardening_admin_functions.sql"), "-- old\n", "utf8")],
  ["operational_migration_active", () => writeFileSync(join(tempRoot, "supabase/migrations/20260712090000_agendar_encerramentos_automaticos_dry_run.sql"), "-- op\n", "utf8")],
  ["config_missing", () => rmSync(join(tempRoot, "supabase/config.toml"), { force: true })],
  ["project_id_empty", () => mutateFile("supabase/config.toml", (text) => text.replace(/project_id\s*=\s*"[^"]+"/, 'project_id = ""'))],
  ["linked_argument", () => mutateFile("scripts/supabase-local-cli.mjs", (text) => `${text}\n// --${"linked"}\n`)],
  ["project_ref_argument", () => mutateFile("scripts/supabase-local-cli.mjs", (text) => `${text}\n// --project-${"ref"}\n`)],
  ["db_push_command", () => mutateFile("scripts/supabase-local-cli.mjs", (text) => `${text}\n// supabase db ${"push"}\n`)],
  ["migration_repair_command", () => mutateFile("scripts/supabase-local-cli.mjs", (text) => `${text}\n// supabase migration ${"repair"}\n`)],
  ["remote_url", () => mutateFile("scripts/supabase-local-cli.mjs", (text) => `${text}\n// https://example.supabase${".co"}\n`)],
  ["remote_project_ref", () => mutateFile("scripts/supabase-local-cli.mjs", (text) => `${text}\n// xrmqdkpx${"nfvusmenadnf"}\n`)],
  ["secret_in_report", () => mutateFile("scripts/supabase-local-cli.mjs", (text) => `${text}\n// sb_secret_${"fake_test_value"}\n`)],
  ["port_collision_marker", () => mutateFile("supabase/config.toml", (text) => text.replace("port = 54321", "port = 1"))],
  ["inventory_divergent", () => writeFileSync(join(tempRoot, "supabase/migrations/20260716090001_extra_table.sql"), "create table public.extra(id uuid);\n", "utf8")],
  ["broad_container_clean", () => mutateFile("scripts/supabase-local-clean.ps1", (text) => `${text}\ndocker rm -f $(docker ps -aq)\n`)],
  ["duplicate_create_table", () => writeFileSync(join(tempRoot, "supabase/migrations/20260716090002_duplicate_table.sql"), "create table public.alunos(id uuid);\n", "utf8")],
  ["duplicate_create_policy", () => writeFileSync(join(tempRoot, "supabase/migrations/20260716090003_duplicate_policy.sql"), "create policy p on public.alunos for select using (true);\n", "utf8")],
  ["duplicate_create_function", () => writeFileSync(join(tempRoot, "supabase/migrations/20260716090004_duplicate_function.sql"), "create function public.f() returns void language sql as $$ select null; $$;\n", "utf8")],
  ["invalid_timestamp", () => writeFileSync(join(tempRoot, "supabase/migrations/invalid_timestamp.sql"), "-- invalid\n", "utf8")],
];

mkdirSync(reportDir, { recursive: true });
const results = [];

try {
  for (const [name, apply] of mutations) {
    resetFixture();
    apply();
    const result = runValidator();
    const rejected = result.status !== 0;
    results.push({
      name,
      rejected,
      status: result.status,
      reason: rejected ? (result.stderr || result.stdout).split("\n").find((line) => line.startsWith("- "))?.slice(2) || "validation failed" : "mutation accepted",
    });
  }
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

const rejected = results.filter((item) => item.rejected).length;
function containsCredentialedDbUrl(text) {
  const scan = text.split(approvedDbUrl).join("");
  return /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i.test(scan);
}

const urlCases = [
  ["accept_placeholder", approvedDbUrl, false],
  ["accept_placeholder_table", `| DB_URL | ${approvedDbUrl} |`, false],
  ["accept_placeholder_json", `{"DB_URL":"${approvedDbUrl}"}`, false],
  ["accept_multiple_placeholders", `${approvedDbUrl}\n${approvedDbUrl}`, false],
  ["accept_no_url", "no database url here", false],
  ["reject_postgresql_real", "postgresql://postgres:postgres@127.0.0.1:54322/postgres", true],
  ["reject_postgres_real", "postgres://usuario:senha@localhost:5432/banco", true],
  ["reject_user_pass_real", "postgresql://admin:secret@localhost:5432/db", true],
  ["reject_real_user_redacted_password", "postgresql://postgres:[REDACTED_PASSWORD]@127.0.0.1:54322/postgres", true],
  ["reject_redacted_user_real_password", "postgresql://[REDACTED_USER]:senha@127.0.0.1:54322/postgres", true],
  ["reject_real_host_redacted_user_password", "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@127.0.0.1:54322/postgres", true],
  ["reject_redacted_host_real_user_password", "postgresql://postgres:postgres@[LOCAL_HOST]:[LOCAL_PORT]/[LOCAL_DATABASE]", true],
  ["reject_url_encoded_password", "postgresql://postgres:p%40ss@localhost:5432/postgres", true],
  ["reject_special_password", "postgresql://postgres:p@ss!@localhost:5432/postgres", true],
  ["reject_partial_database", "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@[LOCAL_HOST]:[LOCAL_PORT]/postgres", true],
  ["reject_json_real", '{"DB_URL":"postgresql://postgres:postgres@127.0.0.1:54322/postgres"}', true],
  ["reject_table_real", "| DB_URL | postgresql://postgres:postgres@127.0.0.1:54322/postgres |", true],
  ["reject_trailing_comma", "postgresql://postgres:postgres@127.0.0.1:54322/postgres,", true],
  ["reject_trailing_unicode", "postgresql://postgres:postgres@127.0.0.1:54322/postgresç", true],
  ["reject_mixed_real_and_placeholder", `${approvedDbUrl}\npostgresql://postgres:postgres@127.0.0.1:54322/postgres`, true],
];
const urlResults = urlCases.map(([name, text, expected]) => {
  const actual = containsCredentialedDbUrl(text);
  return { name, passed: actual === expected, expected_rejection: expected, actual_rejection: actual };
});
const urlPassed = urlResults.filter((item) => item.passed).length;
const payload = {
  result: rejected === mutations.length ? "MUTATIONS_REJECTED" : "MUTATIONS_ACCEPTED",
  total: mutations.length,
  rejected,
  url_tests: {
    result: urlPassed === urlResults.length ? "URL_CASES_VALIDATED" : "URL_CASES_FAILED",
    total: urlResults.length,
    passed: urlPassed,
    cases: urlResults,
  },
  remote_access: "none",
  mutations: results,
};
writeFileSync(resultPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
writeFileSync(summaryPath, [
  "# Negative Mutation Tests",
  "",
  `- Result: ${payload.result}`,
  `- Rejected: ${rejected}/${mutations.length}`,
  `- URL tests: ${urlPassed}/${urlResults.length}`,
  "- Remote access: none",
  "",
  "| Mutation | Rejected | Reason |",
  "| --- | --- | --- |",
  ...results.map((item) => `| ${item.name} | ${item.rejected ? "yes" : "no"} | ${String(item.reason).replaceAll("|", "/")} |`),
  "",
  "| URL Case | Passed | Expected Rejection | Actual Rejection |",
  "| --- | --- | --- | --- |",
  ...urlResults.map((item) => `| ${item.name} | ${item.passed ? "yes" : "no"} | ${item.expected_rejection ? "yes" : "no"} | ${item.actual_rejection ? "yes" : "no"} |`),
  "",
].join("\n"), "utf8");

if (payload.result !== "MUTATIONS_REJECTED" || payload.url_tests.result !== "URL_CASES_VALIDATED") {
  console.error(`Expected ${mutations.length}/${mutations.length} mutations rejected, got ${rejected}.`);
  process.exit(1);
}

console.log(`${rejected}/${mutations.length} MUTATIONS_REJECTED`);
console.log(`${urlPassed}/${urlResults.length} URL_CASES_VALIDATED`);
