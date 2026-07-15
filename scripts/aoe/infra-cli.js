#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const REPORT_DIR = "reports/aoe/infrastructure-pilot";
const MIGRATION = "supabase/migrations/20260715_aoe_infrastructure_pilot.sql";

function parseArgs(argv) {
  return argv.reduce((acc, arg) => {
    if (arg.startsWith("--environment=")) acc.environment = arg.slice("--environment=".length);
    if (arg === "--json") acc.json = true;
    if (arg === "--all") acc.all = true;
    if (arg === "--validate") acc.validate = true;
    if (arg === "--migrations") acc.migrations = true;
    if (arg === "--rls") acc.rls = true;
    if (arg === "--idempotency") acc.idempotency = true;
    if (arg === "--security") acc.security = true;
    if (arg === "--health") acc.health = true;
    if (arg === "--pilot-readiness") acc.pilot = true;
    return acc;
  }, { environment: null });
}

function checkMigration(sql) {
  const required = ["aoe_decisions", "aoe_decision_traces", "aoe_human_reviews", "aoe_idempotency_keys", "aoe_audit_events"];
  const checks = [
    ...required.map((table) => ({ name: `table ${table}`, passed: sql.includes(`public.${table}`), blocking: true })),
    { name: "rls enabled", passed: (sql.match(/enable row level security/g) ?? []).length >= 5, blocking: true },
    { name: "idempotency unique index", passed: sql.includes("aoe_idempotency_unique_key"), blocking: true },
    { name: "transactional idempotency function", passed: sql.includes("aoe_idempotency_get_or_create"), blocking: true },
    { name: "no permissive using true policy", passed: !/using\s*\(\s*true\s*\)/i.test(sql), blocking: true },
    { name: "no permissive with check true policy", passed: !/with check\s*\(\s*true\s*\)/i.test(sql), blocking: true },
  ];
  return { status: checks.every((item) => item.passed) ? "PASS" : "FAIL", checks };
}

function checkBoundary() {
  const file = "supabase/functions/aoe/index.ts";
  const source = fs.readFileSync(file, "utf8");
  const checks = [
    { name: "single aoe edge boundary exists", passed: fs.existsSync(file), blocking: true },
    { name: "requires authorization bearer", passed: source.includes("bearer "), blocking: true },
    { name: "uses service role only server-side", passed: source.includes("SUPABASE_SERVICE_ROLE_KEY") && !source.includes("VITE_"), blocking: true },
    { name: "feature flags checked", passed: source.includes("AOE_ENABLED") && source.includes("AOE_PILOT_ENABLED"), blocking: true },
    { name: "safe public errors", passed: !source.includes("console.error(error)") && !source.includes("error.message :"), blocking: true },
    { name: "core bundle not deployed in this task", passed: false, blocking: false },
  ];
  return { status: checks.filter((item) => item.blocking).every((item) => item.passed) ? "PASS_WITH_RESTRICTIONS" : "FAIL", checks };
}

function checkReports() {
  const sql = fs.readFileSync(MIGRATION, "utf8");
  const migration = checkMigration(sql);
  const boundary = checkBoundary();
  const restrictions = [
    "Migrations criadas, mas não aplicadas em banco local/staging nesta tarefa.",
    "Edge Function criada, mas não deployada.",
    "Execução do core AOE dentro da Edge Function exige etapa de bundle ou runtime server-side no piloto.",
    "RLS validada estaticamente; não houve teste contra instância Supabase local.",
  ];
  const blockingChecks = [...migration.checks, ...boundary.checks].filter((item) => item.blocking);
  const blockers = blockingChecks.filter((item) => !item.passed);
  const status = blockers.length ? "NOT_READY" : "READY_WITH_INFRASTRUCTURE_RESTRICTIONS";
  return { status, blockers, restrictions, migration, boundary, generatedAt: "2026-07-15T00:00:00.000Z" };
}

function writeReport(base, data, title) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, `${base}.json`), `${JSON.stringify(data, null, 2)}\n`);
  fs.writeFileSync(path.join(REPORT_DIR, `${base}.md`), `# ${title}\n\n- Status: ${data.status}\n- Blockers: ${data.blockers?.length ?? 0}\n\n## Restrições\n\n${(data.restrictions ?? []).map((item) => `- ${item}`).join("\n")}\n`);
}

const args = parseArgs(process.argv.slice(2));
if (!args.environment) {
  process.stderr.write("Informe --environment=local ou --environment=staging.\n");
  process.exit(1);
}
if (args.environment === "production") {
  process.stderr.write("Produção bloqueada por padrão nesta tarefa.\n");
  process.exit(1);
}

const result = checkReports();
writeReport("infrastructure-validation-report", result, "Infrastructure Validation Report");
writeReport("migration-validation-report", { ...result, status: result.migration.status }, "Migration Validation Report");
writeReport("rls-validation-report", { ...result, status: result.migration.status }, "RLS Validation Report");
writeReport("idempotency-infrastructure-report", { ...result, status: result.migration.status }, "Idempotency Infrastructure Report");
writeReport("boundary-security-report", { ...result, status: result.boundary.status }, "Boundary Security Report");
writeReport("pilot-readiness-report", result, "Pilot Readiness Report");

if (args.json) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
else process.stdout.write(`AOE infrastructure readiness: ${result.status}\n`);
if (result.status === "NOT_READY") process.exitCode = 2;
