import { mkdirSync, rmSync, cpSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

const root = process.cwd();
const tempRoot = join(tmpdir(), `aruka-negative-${Date.now()}`);
const reportDir = join(root, "reports", "supabase-local-bootstrap");
const resultPath = join(reportDir, "negative-mutations-result.json");
const summaryPath = join(reportDir, "negative-mutations-summary.md");

const copyTargets = [
  "package.json",
  "scripts/supabase-local-preflight.ps1",
  "scripts/supabase-local-bootstrap.ps1",
  "scripts/supabase-local-validate.ps1",
  "scripts/supabase-local-stop.ps1",
  "scripts/supabase-local-clean.ps1",
  "scripts/supabase-local-cli.mjs",
  "scripts/test-supabase-clean-worktree.ps1",
  "scripts/test-supabase-local-reproducibility-negative.mjs",
  "scripts/validate-supabase-local-reproducibility.mjs",
  "supabase/config.toml",
  "supabase/migrations/20260716090000_baseline_aruka_v1.sql",
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
  ["baseline_missing", () => rmSync(join(tempRoot, "supabase/migrations/20260716090000_baseline_aruka_v1.sql"), { force: true })],
  ["baseline_sha_changed", () => mutateFile("supabase/migrations/20260716090000_baseline_aruka_v1.sql", (text) => `${text}\n-- mutation\n`)],
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
const payload = {
  result: rejected === mutations.length ? "MUTATIONS_REJECTED" : "MUTATIONS_ACCEPTED",
  total: mutations.length,
  rejected,
  remote_access: "none",
  mutations: results,
};
writeFileSync(resultPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
writeFileSync(summaryPath, [
  "# Negative Mutation Tests",
  "",
  `- Result: ${payload.result}`,
  `- Rejected: ${rejected}/${mutations.length}`,
  "- Remote access: none",
  "",
  "| Mutation | Rejected | Reason |",
  "| --- | --- | --- |",
  ...results.map((item) => `| ${item.name} | ${item.rejected ? "yes" : "no"} | ${String(item.reason).replaceAll("|", "/")} |`),
  "",
].join("\n"), "utf8");

if (payload.result !== "MUTATIONS_REJECTED") {
  console.error(`Expected ${mutations.length}/${mutations.length} mutations rejected, got ${rejected}.`);
  process.exit(1);
}

console.log(`${rejected}/${mutations.length} MUTATIONS_REJECTED`);
