import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

export const EXPECTED_BASELINE_SHA = "745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE";
export const BASELINE_PATH = "supabase/migrations/20260716090000_baseline_aruka_v1.sql";
export const PROTECTED_PROJECT_REF = "xrmqdkpx" + "nfvusmenadnf";
export const DECISION = "LOCAL_SEEDS_AND_SAFE_RESET_VALIDATED";
export const REPORT_DIR = "reports/supabase-local-seeds";
export const RESERVED_UUIDS = {
  adminUser: "00000000-0000-4000-8000-000000000801",
  personalUser: "00000000-0000-4000-8000-000000000802",
  planMonthly: "00000000-0000-4000-8000-000000000811",
  planQuarterly: "00000000-0000-4000-8000-000000000812",
  planArchived: "00000000-0000-4000-8000-000000000813",
  studentActive: "00000000-0000-4000-8000-000000000821",
  studentClosed: "00000000-0000-4000-8000-000000000822",
  studentPending: "00000000-0000-4000-8000-000000000823",
};

export function nowIso() {
  return new Date().toISOString();
}

export function ensureReportDir(root = process.cwd()) {
  mkdirSync(join(root, REPORT_DIR), { recursive: true });
}

export function writeJsonReport(root, file, payload) {
  ensureReportDir(root);
  writeFileSync(join(root, REPORT_DIR, file), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export function writeMarkdownReport(root, file, lines) {
  ensureReportDir(root);
  writeFileSync(join(root, REPORT_DIR, file), `${lines.join("\n")}\n`, "utf8");
}

export function sha256(root, file) {
  return createHash("sha256").update(readFileSync(join(root, file))).digest("hex").toUpperCase();
}

export function readText(root, file) {
  return readFileSync(join(root, file), "utf8");
}

export function listFiles(root, dir) {
  const absolute = join(root, dir);
  if (!existsSync(absolute)) return [];
  const out = [];
  for (const entry of readdirSync(absolute)) {
    const full = join(absolute, entry);
    const rel = relative(root, full).replaceAll("\\", "/");
    if (statSync(full).isDirectory()) out.push(...listFiles(root, rel));
    else out.push(rel);
  }
  return out.sort();
}

export function getProjectId(root = process.cwd()) {
  const config = readText(root, "supabase/config.toml");
  const match = config.match(/^project_id\s*=\s*"([^"]+)"/m);
  if (!match) throw new Error("Missing project_id in supabase/config.toml");
  if (match[1] === PROTECTED_PROJECT_REF) throw new Error("Protected HML project ref cannot be used as local project_id");
  return match[1];
}

export function getDbContainer(root = process.cwd()) {
  const projectId = getProjectId(root);
  const candidates = [`supabase_db_${projectId}`, `${projectId}_db`, `supabase-db-${projectId}`];
  for (const name of candidates) {
    const inspected = spawnSync("docker", ["inspect", "-f", "{{.State.Running}}", name], {
      cwd: root,
      encoding: "utf8",
      shell: false,
    });
    if (inspected.status === 0 && inspected.stdout.trim() === "true") return name;
  }
  const listed = spawnSync("docker", ["ps", "--format", "{{.Names}}"], { cwd: root, encoding: "utf8", shell: false });
  if (listed.status === 0) {
    const found = listed.stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((name) => name.toLowerCase().includes(projectId.toLowerCase()) && name.toLowerCase().includes("db"));
    if (found) return found;
  }
  throw new Error(`Local Supabase database container is not running for project_id ${projectId}`);
}

export function runCommand(root, command, args, options = {}) {
  const started = Date.now();
  const isWindowsCmd = process.platform === "win32" && /\.cmd$/i.test(command);
  const executable = isWindowsCmd ? "cmd.exe" : command;
  const finalArgs = isWindowsCmd ? ["/d", "/s", "/c", command, ...args] : args;
  const result = spawnSync(executable, finalArgs, {
    cwd: root,
    encoding: "utf8",
    shell: false,
    timeout: options.timeoutMs ?? 120000,
    input: options.input,
    maxBuffer: 1024 * 1024 * 20,
  });
  return {
    command,
    args,
    status: result.status ?? 1,
    timed_out: Boolean(result.error && result.error.code === "ETIMEDOUT"),
    duration_seconds: Number(((Date.now() - started) / 1000).toFixed(3)),
    stdout: sanitizeText(result.stdout || ""),
    stderr: sanitizeText(result.stderr || result.error?.message || ""),
  };
}

export function runPsql(root, sql, options = {}) {
  const container = getDbContainer(root);
  const result = runCommand(root, "docker", ["exec", "-i", container, "psql", "-v", "ON_ERROR_STOP=1", "-U", "postgres", "-d", "postgres", "-q"], {
    input: sql,
    timeoutMs: options.timeoutMs ?? 120000,
  });
  if (options.throwOnError !== false && result.status !== 0) {
    throw new Error(`psql failed with exit code ${result.status}: ${result.stderr || result.stdout}`);
  }
  return result;
}

export function queryJson(root, sql) {
  const wrapped = `\\pset tuples_only on\n\\pset format unaligned\nselect coalesce(json_agg(row_to_json(q)), '[]'::json)::text from (${sql}) q;\n`;
  const result = runPsql(root, wrapped);
  const text = result.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "[]";
  return JSON.parse(text);
}

export function validateLocalGuard(root = process.cwd(), args = process.argv.slice(2)) {
  const joinedArgs = args.join(" ");
  const envText = Object.entries(process.env)
    .filter(([key]) => /SUPABASE|DATABASE|POSTGRES|PROJECT|TOKEN|SECRET|KEY|URL/i.test(key))
    .map(([key, value]) => `${key}=${value ?? ""}`)
    .join("\n");
  const scan = `${joinedArgs}\n${envText}`;
  const blocked = [
    [/--linked/i, "linked flag"],
    [/--project-ref/i, "project ref flag"],
    [/--db-url/i, "db url flag"],
    [/supabase\.co/i, "remote Supabase host"],
    [/pooler\.supabase\.com/i, "remote Supabase pooler"],
    [/\bdb\s+push\b/i, "db push"],
    [/\bdb\s+pull\b/i, "db pull"],
    [/migration\s+repair/i, "migration repair"],
    [new RegExp(PROTECTED_PROJECT_REF, "i"), "protected HML project ref"],
    [/postgres(?:ql)?:\/\/[^@\s]+@(?!(?:localhost|127\.0\.0\.1|\[?::1\]?))/i, "remote PostgreSQL URL"],
    [/eyJ[A-Za-z0-9_-]{20,}\./, "JWT-like token"],
    [/sb_secret_[A-Za-z0-9_-]+/i, "secret-like token"],
  ];
  const errors = [];
  for (const [pattern, label] of blocked) {
    if (pattern.test(scan)) errors.push(`Rejected unsafe local seed context: ${label}`);
  }
  const baselineSha = sha256(root, BASELINE_PATH);
  if (baselineSha !== EXPECTED_BASELINE_SHA) errors.push("Official baseline SHA mismatch");
  const projectId = getProjectId(root);
  if (projectId === PROTECTED_PROJECT_REF) errors.push("Local project_id matches protected HML project ref");
  return { ok: errors.length === 0, errors, project_id: projectId, baseline_sha: baselineSha };
}

export function collectInventory(root = process.cwd()) {
  const migrationHistory = queryJson(root, "select version from supabase_migrations.schema_migrations order by version");
  const structure = queryJson(
    root,
    `select
      (select count(*)::int from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE') as public_tables,
      (select count(*)::int from pg_proc p join pg_namespace n on n.oid = p.pronamespace where n.nspname = 'public') as public_functions,
      (select count(*)::int from pg_trigger t join pg_class c on c.oid = t.tgrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and not t.tgisinternal) as public_triggers,
      (select count(*)::int from pg_indexes where schemaname = 'public') as public_indexes,
      (select count(*)::int from pg_policies where schemaname = 'public') as public_policies,
      (select count(*)::int from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity) as rls_enabled_tables,
      (select coalesce(bool_or(id = 'avaliacoes-fotos' and public = false), false) from storage.buckets) as private_assessment_bucket`
  )[0];
  return { migration_history: migrationHistory.map((row) => row.version), structure };
}

export function collectFixtureCounts(root = process.cwd()) {
  const rows = queryJson(
    root,
    `select * from (
      select 'auth_users' as domain, count(*)::int as total from auth.users where id in ('${RESERVED_UUIDS.adminUser}','${RESERVED_UUIDS.personalUser}')
      union all select 'profiles', count(*)::int from public.perfis where id in ('${RESERVED_UUIDS.adminUser}','${RESERVED_UUIDS.personalUser}')
      union all select 'plans', count(*)::int from public.planos where id in ('${RESERVED_UUIDS.planMonthly}','${RESERVED_UUIDS.planQuarterly}','${RESERVED_UUIDS.planArchived}')
      union all select 'students', count(*)::int from public.alunos where id in ('${RESERVED_UUIDS.studentActive}','${RESERVED_UUIDS.studentClosed}','${RESERVED_UUIDS.studentPending}')
      union all select 'subscriptions', count(*)::int from public.assinaturas where id = '00000000-0000-4000-8000-000000000812'
      union all select 'payments', count(*)::int from public.pagamentos where id in ('00000000-0000-4000-8000-000000000881','00000000-0000-4000-8000-000000000882')
      union all select 'workouts', count(*)::int from public.treinos where id = '00000000-0000-4000-8000-000000000821'
      union all select 'workout_days', count(*)::int from public.treino_dias where id = '00000000-0000-4000-8000-000000000831'
      union all select 'workout_exercises', count(*)::int from public.treino_exercicios where id in ('00000000-0000-4000-8000-000000000841','00000000-0000-4000-8000-000000000842')
      union all select 'workout_templates', count(*)::int from public.workout_templates where id = '00000000-0000-4000-8000-000000000851'
      union all select 'assessments', count(*)::int from public.avaliacoes where id = '00000000-0000-4000-8000-000000000861'
      union all select 'anamneses', count(*)::int from public.anamneses where id = '00000000-0000-4000-8000-000000000871'
      union all select 'admin_logs', count(*)::int from public.admin_logs where id = '00000000-0000-4000-8000-000000000815'
      union all select 'legal_acceptances', count(*)::int from public.aceites_legais where id in ('00000000-0000-4000-8000-000000000813','00000000-0000-4000-8000-000000000814')
      union all select 'followup_events', count(*)::int from public.acompanhamento_eventos where id in ('00000000-0000-4000-8000-000000000891','00000000-0000-4000-8000-000000000892')
      union all select 'aoe_decisions', count(*)::int from public.aoe_decisions where id like 'cycle8-%'
      union all select 'aoe_traces', count(*)::int from public.aoe_decision_traces where id like 'cycle8-%'
      union all select 'aoe_reviews', count(*)::int from public.aoe_human_reviews where id like 'cycle8-%'
      union all select 'aoe_idempotency', count(*)::int from public.aoe_idempotency_keys where id like 'cycle8-%'
      union all select 'aoe_audit', count(*)::int from public.aoe_audit_events where id like 'cycle8-%'
    ) domains order by domain`
  );
  return Object.fromEntries(rows.map((row) => [row.domain, row.total]));
}

export function sanitizeText(text) {
  return String(text)
    .replace(/postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/gi, "postgresql://[REDACTED_USER]:[REDACTED_PASSWORD]@")
    .replace(/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/g, "[REDACTED_JWT]")
    .replace(/sb_secret_[A-Za-z0-9_-]+/gi, "[REDACTED_SECRET]")
    .replaceAll(process.cwd().replaceAll("\\", "/"), "[WORKSPACE]")
    .replaceAll(process.cwd(), "[WORKSPACE]");
}

export function scanFilesForUnsafeContent(root, files) {
  const findings = [];
  const allowedProjectRefDocs = new Set([
    "docs/supabase-infrastructure-refactor/42-local-seeds-and-deterministic-fixtures.md",
    "docs/supabase-infrastructure-refactor/43-safe-local-reset-validation.md",
    "docs/supabase-infrastructure-refactor/44-cycle-8-final-evidence.md",
    "scripts/test-supabase-local-seeds-negative.mjs",
  ]);
  const guardrailScripts = new Set([
    "scripts/supabase-cycle-8-lib.mjs",
    "scripts/validate-supabase-local-fixtures.mjs",
    "scripts/test-supabase-local-seeds-negative.mjs",
  ]);
  for (const file of files) {
    if (!existsSync(join(root, file))) continue;
    let text = readText(root, file);
    if (guardrailScripts.has(file)) {
      text = text
        .replace(/\/postgres[\s\S]*?\/[gimsuy]*/g, "[REGEX_REDACTED]")
        .replace(/\/eyJ[\s\S]*?\/[gimsuy]*/g, "[REGEX_REDACTED]")
        .replace(/\/sb_secret_[\s\S]*?\/[gimsuy]*/gi, "[REGEX_REDACTED]")
        .replace(/\/\\\+55[\s\S]*?\/[gimsuy]*/g, "[REGEX_REDACTED]");
    }
    text = text.replace(/\+550000000000[0-9]/g, "[RESERVED_LOCAL_PHONE]");
    const checks = [
      [/postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i, "credentialed PostgreSQL URL"],
      [/eyJ[A-Za-z0-9_-]{20,}\./, "JWT-like token"],
      [/sb_secret_[A-Za-z0-9_-]+/i, "secret-like token"],
      [/\bservice_role\b/i, "service role literal"],
      [/\baccess_token\b|\brefresh_token\b/i, "token literal"],
      [/\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/, "CPF-like value"],
      [/\+55\s?\(?\d{2}\)?\s?9?\d{4}-?\d{4}/, "real-looking phone"],
    ];
    if (!allowedProjectRefDocs.has(file) && new RegExp(PROTECTED_PROJECT_REF, "i").test(text)) {
      findings.push({ file, reason: "protected HML project ref" });
    }
    for (const [pattern, reason] of checks) {
      if (pattern.test(text)) findings.push({ file, reason });
    }
  }
  return findings;
}

export function assertNoUnsafeContent(root, files) {
  const findings = scanFilesForUnsafeContent(root, files);
  if (findings.length) {
    throw new Error(`Unsafe content found: ${findings.map((item) => `${item.file} (${item.reason})`).join("; ")}`);
  }
  return true;
}

export function stableSnapshot(root = process.cwd()) {
  return {
    inventory: collectInventory(root),
    fixtures: collectFixtureCounts(root),
  };
}

export function runSupabaseDbReset(root = process.cwd()) {
  return runCommand(root, process.platform === "win32" ? "npx.cmd" : "npx", ["-y", "supabase@2.109.1", "db", "reset"], { timeoutMs: 240000 });
}

export function stringifyStable(value) {
  if (Array.isArray(value)) return `[${value.map(stringifyStable).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stringifyStable(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function commandOutputOrThrow(result, label) {
  if (result.status !== 0) throw new Error(`${label} failed with exit code ${result.status}: ${result.stderr || result.stdout}`);
  return result;
}

export function gitTrackedChangedFiles(root = process.cwd()) {
  const output = execFileSync("git", ["diff", "--name-only"], { cwd: root, encoding: "utf8" });
  return output.split(/\r?\n/).filter(Boolean);
}
