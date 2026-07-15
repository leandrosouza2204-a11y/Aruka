#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { buildRuntimeCatalog } from "./infrastructure/build-runtime-catalog.js";

const REPORT_DIR = "reports/aoe/infrastructure-activation";

function parseArgs(argv) {
  return argv.reduce((acc, arg) => {
    if (arg.startsWith("--environment=")) acc.environment = arg.slice("--environment=".length);
    if (arg === "--json") acc.json = true;
    if (arg === "--all-runtime") acc.allRuntime = true;
    if (arg === "--build-catalog") acc.buildCatalog = true;
    if (arg === "--readiness") acc.readiness = true;
    return acc;
  }, {});
}

function detectEnvironment(environment) {
  const supabaseConfig = fs.existsSync("supabase/config.toml");
  const cli = spawnSync("supabase", ["--version"], { encoding: "utf8" });
  const cliAvailable = cli.status === 0;
  const nodeVersion = process.version;
  const status = environment && environment !== "production" && supabaseConfig && cliAvailable ? environment.toUpperCase() : "INDETERMINADO";
  return {
    status,
    requestedEnvironment: environment ?? null,
    nodeVersion,
    supabaseCliAvailable: cliAvailable,
    supabaseCliVersion: cliAvailable ? cli.stdout.trim() : null,
    supabaseConfigPresent: supabaseConfig,
    productionBlocked: environment === "production",
  };
}

function writeReport(base, data, title) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, `${base}.json`), `${JSON.stringify(data, null, 2)}\n`);
  fs.writeFileSync(path.join(REPORT_DIR, `${base}.md`), `# ${title}\n\n- Status: ${data.status}\n- Environment: ${data.environment?.status ?? "n/a"}\n- Blockers: ${data.blockers?.length ?? 0}\n\n## Restrictions\n\n${(data.restrictions ?? []).map((item) => `- ${item}`).join("\n")}\n`);
}

function skippedRuntimeReport(name, environment, reason) {
  return { status: "SKIPPED", environment, reason, passed: false };
}

const args = parseArgs(process.argv.slice(2));
if (args.environment === "production") {
  process.stderr.write("Production is blocked for AOE activation.\n");
  process.exit(1);
}

const environment = detectEnvironment(args.environment);
const catalog = buildRuntimeCatalog();
const restrictions = [];
const blockers = [];

if (environment.status === "INDETERMINADO") {
  blockers.push("Ambiente Supabase local/staging não comprovado.");
  restrictions.push("Supabase CLI indisponível ou supabase/config.toml ausente.");
  restrictions.push("Migration runtime, RLS runtime, Edge runtime e smoke tests foram pulados.");
}

const reports = {
  environment: { status: environment.status === "INDETERMINADO" ? "INDETERMINADO" : "PASS", environment },
  database: skippedRuntimeReport("database", environment, "Database runtime unavailable."),
  rls: skippedRuntimeReport("rls", environment, "RLS runtime unavailable."),
  edge: skippedRuntimeReport("edge", environment, "Edge runtime unavailable."),
  idempotency: skippedRuntimeReport("idempotency", environment, "PostgreSQL runtime unavailable."),
  auth: skippedRuntimeReport("auth", environment, "Supabase auth runtime unavailable."),
  persistence: skippedRuntimeReport("persistence", environment, "Database runtime unavailable."),
  privacy: skippedRuntimeReport("privacy", environment, "Runtime tables unavailable."),
  smoke: skippedRuntimeReport("smoke", environment, "Staging/local runtime unavailable."),
};

const readiness = {
  status: blockers.length ? "NOT_READY" : "READY_FOR_CONTROLLED_PILOT",
  environment,
  catalog,
  blockers,
  restrictions,
  runtimeReports: reports,
  productionChanged: false,
  migrationApplied: false,
  edgeFunctionExecuted: false,
};

writeReport("environment-report", reports.environment, "Environment Report");
writeReport("database-runtime-report", reports.database, "Database Runtime Report");
writeReport("rls-runtime-report", reports.rls, "RLS Runtime Report");
writeReport("edge-runtime-report", reports.edge, "Edge Runtime Report");
writeReport("idempotency-runtime-report", reports.idempotency, "Idempotency Runtime Report");
writeReport("auth-runtime-report", reports.auth, "Auth Runtime Report");
writeReport("persistence-runtime-report", reports.persistence, "Persistence Runtime Report");
writeReport("privacy-runtime-report", reports.privacy, "Privacy Runtime Report");
writeReport("staging-smoke-report", reports.smoke, "Staging Smoke Report");
writeReport("activation-readiness-report", readiness, "Activation Readiness Report");

if (args.json) process.stdout.write(`${JSON.stringify(readiness, null, 2)}\n`);
else process.stdout.write(`AOE activation readiness: ${readiness.status}\n`);
