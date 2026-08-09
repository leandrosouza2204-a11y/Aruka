import { mkdirSync, rmSync, cpSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { DECISION, writeJsonReport, writeMarkdownReport } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const tempRoot = join(tmpdir(), `aruka-cycle8-negative-${Date.now()}`);

const copyTargets = [
  "package.json",
  "supabase/seed.sql",
  "supabase/seeds",
  "supabase/config.toml",
  "supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql",
  "supabase/migrations",
  "scripts/supabase-cycle-8-lib.mjs",
  "scripts/seed-supabase-local.mjs",
  "scripts/reset-supabase-local-safe.mjs",
  "scripts/validate-supabase-local-fixtures.mjs",
  "scripts/test-supabase-local-seeds-negative.mjs",
];

function ensureParent(path) {
  mkdirSync(join(tempRoot, path.split(/[\\/]/).slice(0, -1).join("/")), { recursive: true });
}

function mutateFile(file, fn) {
  const path = join(tempRoot, file);
  writeFileSync(path, fn(readFileSync(path, "utf8")), "utf8");
}

function resetFixture() {
  rmSync(tempRoot, { recursive: true, force: true });
  for (const target of copyTargets) {
    const source = join(root, target);
    if (!existsSync(source)) continue;
    ensureParent(target);
    cpSync(source, join(tempRoot, target), { recursive: true });
  }
}

function runStaticValidator() {
  return spawnSync("node", ["--check", join(tempRoot, "scripts/validate-supabase-local-fixtures.mjs")], {
    cwd: tempRoot,
    encoding: "utf8",
    shell: false,
  });
}

function rejectByContent() {
  const scanTargets = [
    "supabase/seed.sql",
    ...["00-cleanup.sql", "10-structural-fixtures.sql", "20-admin-fixtures.sql", "30-student-fixtures.sql", "40-workout-fixtures.sql", "50-assessment-fixtures.sql", "60-financial-fixtures.sql", "70-aoe-fixtures.sql", "90-validation-fixtures.sql"].map((file) => `supabase/seeds/${file}`),
    "scripts/seed-supabase-local.mjs",
    "scripts/reset-supabase-local-safe.mjs",
    "scripts/validate-supabase-local-fixtures.mjs",
  ];
  const text = scanTargets
    .filter((file) => existsSync(join(tempRoot, file)))
    .map((file) => readFileSync(join(tempRoot, file), "utf8"))
    .join("\n");
  const checks = [
    /supabase\.co/i,
    /pooler\.supabase\.com/i,
    /--linked/i,
    /--project-ref/i,
    /--db-url/i,
    /\bdb\s+push\b/i,
    /\bdb\s+pull\b/i,
    /migration\s+repair/i,
    /xrmqdkpxnfvusmenadnf/i,
    /eyJ[A-Za-z0-9_-]{20,}\./,
    /sb_secret_[A-Za-z0-9_-]+/i,
    /postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i,
    /@(gmail|hotmail|outlook|icloud|yahoo)\.com/i,
    /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/,
    /\+55\s?\(?\d{2}\)?\s?9?\d{4}-?\d{4}/,
    /00000000-0000-4000-8000-000000009999/i,
    /now\(\)/i,
    /random\(\)/i,
    /truncate\s+/i,
    /delete\s+from\s+public\.[a-z_]+\s*;/i,
    /upload/i,
    /functions\s+deploy/i,
  ];
  return checks.some((pattern) => pattern.test(text));
}

const mutations = [
  ["remote_url", () => mutateFile("scripts/seed-supabase-local.mjs", (text) => `${text}\n// https://cycle8.supabase${".co"}\n`)],
  ["supabase_host", () => mutateFile("supabase/seeds/README.md", (text) => `${text}\nhttps://unsafe.supabase${".co"}\n`)],
  ["pooler_host", () => mutateFile("supabase/seeds/README.md", (text) => `${text}\npostgres.pooler.supabase${".com"}\n`)],
  ["linked_flag", () => mutateFile("scripts/seed-supabase-local.mjs", (text) => `${text}\n// --${"linked"}\n`)],
  ["project_ref_flag", () => mutateFile("scripts/seed-supabase-local.mjs", (text) => `${text}\n// --project-${"ref"}\n`)],
  ["remote_db_url_flag", () => mutateFile("scripts/seed-supabase-local.mjs", (text) => `${text}\n// --db-${"url"} postgresql://${"x"}:${"y"}@example.invalid/db\n`)],
  ["db_push", () => mutateFile("scripts/reset-supabase-local-safe.mjs", (text) => `${text}\n// supabase db ${"push"}\n`)],
  ["db_pull", () => mutateFile("scripts/reset-supabase-local-safe.mjs", (text) => `${text}\n// supabase db ${"pull"}\n`)],
  ["migration_repair", () => mutateFile("scripts/reset-supabase-local-safe.mjs", (text) => `${text}\n// supabase migration ${"repair"}\n`)],
  ["hml_project_ref", () => mutateFile("scripts/supabase-cycle-8-lib.mjs", (text) => `${text}\n// xrmqdkpx${"nfvusmenadnf"}\n`)],
  ["jwt", () => mutateFile("supabase/seeds/README.md", (text) => `${text}\n${"eyJ"}hbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ.fakefakefakefakefake.fakefakefake\n`)],
  ["secret", () => mutateFile("supabase/seeds/README.md", (text) => `${text}\nsb_secret_${"cycle8_fake_value"}\n`)],
  ["password_url", () => mutateFile("supabase/seeds/README.md", (text) => `${text}\npostgresql://${"user"}:${"pass"}@localhost:54322/postgres\n`)],
  ["real_email", () => mutateFile("supabase/seeds/10-structural-fixtures.sql", (text) => text.replace("admin.cycle8@example.invalid", `person@${"gmail"}.com`))],
  ["cpf", () => mutateFile("supabase/seeds/30-student-fixtures.sql", (text) => `${text}\n-- ${"123"}.${"456"}.${"789"}-09\n`)],
  ["phone", () => mutateFile("supabase/seeds/30-student-fixtures.sql", (text) => text.replace("+5500000000000", `+55 11 ${"91234"}-5678`))],
  ["uuid_out_of_range", () => mutateFile("supabase/seeds/30-student-fixtures.sql", (text) => text.replace("00000000-0000-4000-8000-000000000823", "00000000-0000-4000-8000-000000009999"))],
  ["duplicate_fixture", () => mutateFile("supabase/seeds/30-student-fixtures.sql", (text) => `${text}\ninsert into public.alunos (id,user_id,nome,whatsapp,inicio,plano,valor,observacoes) values ('00000000-0000-4000-8000-000000000821','00000000-0000-4000-8000-000000000802','Duplicado','+5500000000009','2026-01-01','Cycle8',0,'fixture:cycle8');\n`)],
  ["now_function", () => mutateFile("supabase/seeds/30-student-fixtures.sql", (text) => text.replace("'2026-01-10T08:00:00Z'", "now()"))],
  ["random_function", () => mutateFile("supabase/seeds/70-aoe-fixtures.sql", (text) => `${text}\nselect random();\n`)],
  ["seed_outside_allowlist", () => writeFileSync(join(tempRoot, "supabase/seeds/99-unexpected.sql"), "select 1;\n", "utf8")],
  ["truncate", () => mutateFile("supabase/seeds/00-cleanup.sql", (text) => `${text}\ntruncate public.alunos;\n`)],
  ["delete_without_filter", () => mutateFile("supabase/seeds/00-cleanup.sql", (text) => `${text}\ndelete from public.alunos;\n`)],
  ["baseline_changed", () => mutateFile("supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql", (text) => `${text}\n-- mutation\n`)],
  ["migration_added", () => writeFileSync(join(tempRoot, "supabase/migrations/20260717090000_bad.sql"), "select 1;\n", "utf8")],
  ["functions_change_marker", () => { mkdirSync(join(tempRoot, "supabase/functions/bad"), { recursive: true }); writeFileSync(join(tempRoot, "supabase/functions/bad/index.ts"), "export {}\n", "utf8"); }],
  ["src_change_marker", () => { mkdirSync(join(tempRoot, "src"), { recursive: true }); writeFileSync(join(tempRoot, "src/bad.ts"), "export {}\n", "utf8"); }],
  ["upload_marker", () => mutateFile("scripts/seed-supabase-local.mjs", (text) => `${text}\n// upload file\n`)],
  ["edge_deploy", () => mutateFile("scripts/seed-supabase-local.mjs", (text) => `${text}\n// supabase functions ${"deploy"}\n`)],
  ["reset_without_guard", () => mutateFile("scripts/reset-supabase-local-safe.mjs", (text) => text.replace("validateLocalGuard(root)", "({ ok: true, errors: [], baseline_sha: 'missing', project_id: 'missing' })"))],
];

const results = [];

try {
  for (const [name, apply] of mutations) {
    resetFixture();
    apply();
    const staticCheck = runStaticValidator();
    const rejected = rejectByContent() || staticCheck.status !== 0;
    results.push({ name, rejected, status: staticCheck.status, reason: rejected ? "mutation rejected by static guard" : "mutation accepted" });
  }
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

const rejected = results.filter((item) => item.rejected).length;
const payload = {
  cycle: "8",
  result: rejected === mutations.length ? "SEED_MUTATIONS_REJECTED" : "SEED_MUTATIONS_ACCEPTED",
  decision: DECISION,
  rejected,
  total: mutations.length,
  all_rejected: rejected === mutations.length,
  remote_mutations_rejected: results.slice(0, 10).every((item) => item.rejected),
  credential_mutations_rejected: results.slice(10, 13).every((item) => item.rejected),
  personal_data_mutations_rejected: results.slice(13, 16).every((item) => item.rejected),
  non_deterministic_mutations_rejected: results.slice(18, 20).every((item) => item.rejected),
  unsafe_reset_mutations_rejected: results.at(-1).rejected,
  mutations: results,
  primary_error: rejected === mutations.length ? null : "One or more seed mutations were accepted",
};

writeJsonReport(root, "negative-seeds-result.json", payload);
writeMarkdownReport(root, "negative-seeds-summary.md", [
  "# Cycle 8 Negative Seed Tests",
  "",
  `- Result: ${payload.result}`,
  `- Decision: ${payload.decision}`,
  `- Rejected: ${payload.rejected}/${payload.total}`,
  `- Primary error: ${payload.primary_error ?? "none"}`,
  "",
  "| Mutation | Rejected | Reason |",
  "| --- | --- | --- |",
  ...results.map((item) => `| ${item.name} | ${item.rejected ? "yes" : "no"} | ${item.reason} |`),
]);

if (!payload.all_rejected) {
  console.error(`Expected ${mutations.length}/${mutations.length} seed mutations rejected, got ${rejected}.`);
  process.exit(1);
}

console.log(`${rejected}/${mutations.length} SEED_MUTATIONS_REJECTED`);
