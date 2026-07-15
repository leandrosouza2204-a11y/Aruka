#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { buildRuntimeCatalog } from "./infrastructure/build-runtime-catalog.js";

const REPORT_DIR = "reports/aoe/infrastructure-activation";
const EXPECTED_TABLES = [
  "aoe_decisions",
  "aoe_decision_traces",
  "aoe_human_reviews",
  "aoe_idempotency_keys",
  "aoe_audit_events",
];
const EXPECTED_FUNCTIONS = ["aoe_user_owns_student", "aoe_idempotency_get_or_create"];
const MASK = "0000";

function parseArgs(argv) {
  return argv.reduce((acc, arg) => {
    if (arg.startsWith("--environment=")) acc.environment = arg.slice("--environment=".length);
    if (arg === "--json") acc.json = true;
    if (arg === "--write-reports") acc.writeReports = true;
    return acc;
  }, { environment: process.env.AOE_INFRA_TEST_ENV || "indeterminate" });
}

function run(command, args) {
  const isWindowsCmd = command.toLowerCase().endsWith(".cmd");
  const result = isWindowsCmd
    ? spawnSync(process.env.ComSpec || "cmd.exe", ["/c", command, ...args], { encoding: "utf8" })
    : spawnSync(command, args, { encoding: "utf8" });
  return {
    command: [command, ...args].join(" "),
    status: result.status,
    ok: result.status === 0,
    stdout: String(result.stdout || "").trim(),
    stderr: String(result.stderr || "").trim(),
  };
}

function maskRef(value) {
  if (!value) return null;
  if (value.length <= 8) return `${MASK}...${MASK}`;
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

function readLinkedProject() {
  const projectRefPath = "supabase/.temp/project-ref";
  const linkedProjectPath = "supabase/.temp/linked-project.json";
  const ref = fs.existsSync(projectRefPath) ? fs.readFileSync(projectRefPath, "utf8").trim() : null;
  let linked = null;
  if (fs.existsSync(linkedProjectPath)) {
    const raw = JSON.parse(fs.readFileSync(linkedProjectPath, "utf8"));
    linked = {
      refMasked: maskRef(raw.ref),
      name: raw.name ?? null,
      organizationSlugMasked: maskRef(raw.organization_slug ?? raw.organization_id ?? ""),
    };
  }
  return { refMasked: maskRef(ref), linked };
}

function classifyEnvironment(requestedEnvironment, project) {
  const normalized = String(requestedEnvironment || "").toLowerCase();
  const explicitRuntimeAllowed = ["local", "staging", "development"].includes(normalized);
  if (normalized === "production") return { status: "PRODUCTION", explicitRuntimeAllowed: false };
  if (!explicitRuntimeAllowed) return { status: "INDETERMINATE", explicitRuntimeAllowed: false };
  if (!project.refMasked) return { status: normalized.toUpperCase(), explicitRuntimeAllowed };
  return { status: normalized.toUpperCase(), explicitRuntimeAllowed };
}

function inspectEnvironment(args) {
  const directCli = run("supabase", ["--version"]);
  const npxCli = directCli.ok ? null : run("npx.cmd", ["supabase", "--version"]);
  const project = readLinkedProject();
  const classification = classifyEnvironment(args.environment, project);
  const configPresent = fs.existsSync("supabase/config.toml");
  const catalogPresent = fs.existsSync("supabase/functions/aoe/generated/apl-catalog.generated.ts");
  const edgeFunctionPresent = fs.existsSync("supabase/functions/aoe/index.ts");
  const migrationPresent = fs.existsSync("supabase/migrations/20260715_aoe_infrastructure_pilot.sql");
  const testEnv = process.env.AOE_INFRA_TEST_ENV || null;
  const runtimeCanWrite = classification.explicitRuntimeAllowed && testEnv && testEnv !== "production";
  const dockerStatus = run("npx.cmd", ["supabase", "status"]);
  return {
    status: classification.status,
    requestedEnvironment: args.environment,
    date: new Date().toISOString(),
    nodeVersion: process.version,
    supabaseCli: {
      directAvailable: directCli.ok,
      npxAvailable: Boolean(npxCli?.ok),
      version: directCli.ok ? directCli.stdout : npxCli?.stdout || null,
    },
    supabaseConfigPresent: configPresent,
    linkedProject: project,
    edgeFunctionPresent,
    catalogPresent,
    migrationFilePresent: migrationPresent,
    runtimeWriteAuthorized: Boolean(runtimeCanWrite),
    dockerStatus: dockerStatus.ok ? "AVAILABLE" : "UNAVAILABLE",
    commandsExecuted: [
      "node --version",
      "supabase --version",
      "npx.cmd supabase --version",
      "npx.cmd supabase projects list",
      "npx.cmd supabase status",
      "npx.cmd supabase db dump --schema public --linked --file reports/aoe/infrastructure-activation/schema-dump-readonly.sql",
    ],
    commandsNotExecuted: [
      "supabase db reset",
      "supabase functions deploy aoe",
      "remote write tests",
      "test user creation",
      "production deploy",
    ],
  };
}

function baseRuntimeReport(name, environment, status = "BLOCKED", extra = {}) {
  return {
    status,
    environment: environment.status,
    projectRefMasked: environment.linkedProject.refMasked,
    validated: false,
    blockers: [
      "Ambiente remoto nao classificado como staging/desenvolvimento autorizado para escrita.",
      "Schema real nao inventariado por ausencia de Docker no Supabase CLI e ausencia de credencial Postgres segura no ambiente.",
    ],
    warnings: [],
    ...extra,
  };
}

function buildReports(environment, catalog) {
  const schema = baseRuntimeReport("schema", environment, "BLOCKED", {
    expectedTables: EXPECTED_TABLES,
    foundTables: [],
    expectedFunctions: EXPECTED_FUNCTIONS,
    foundFunctions: [],
    checks: {
      columns: "NOT_EXECUTED",
      constraints: "NOT_EXECUTED",
      indexes: "NOT_EXECUTED",
      rls: "NOT_EXECUTED",
      policies: "NOT_EXECUTED",
      grants: "NOT_EXECUTED",
    },
  });
  const reports = {
    environment: { status: environment.status, environment, blockers: environment.runtimeWriteAuthorized ? [] : ["AOE_INFRA_TEST_ENV local/staging/development nao fornecido ou ambiente nao comprovado."] },
    schema,
    database: baseRuntimeReport("database", environment),
    rls: baseRuntimeReport("rls", environment),
    edge: baseRuntimeReport("edge", environment, "BLOCKED", {
      edgeFunctionPresent: environment.edgeFunctionPresent,
      runtimeExecuted: false,
    }),
    catalog: catalog,
    idempotency: baseRuntimeReport("idempotency", environment),
    auth: baseRuntimeReport("auth", environment),
    persistence: baseRuntimeReport("persistence", environment),
    audit: baseRuntimeReport("audit", environment),
    privacy: baseRuntimeReport("privacy", environment),
    smoke: baseRuntimeReport("smoke", environment),
  };
  const blockers = [
    ...reports.environment.blockers,
    "Migration aplicada manualmente nao confirmada por consulta ao PostgreSQL real.",
    "RLS runtime nao testada.",
    "Edge Function nao executada localmente nem em staging.",
    "Idempotencia PostgreSQL nao testada em concorrencia real.",
    "Persistencia, auditoria, privacidade, smoke e carga nao validados em runtime.",
  ];
  return {
    reports,
    readiness: {
      status: "NOT_READY",
      environment,
      catalog,
      migrationConfirmed: false,
      schemaValidated: false,
      rlsValidated: false,
      edgeRuntimeValidated: false,
      authValidated: false,
      authorizationValidated: false,
      idempotencyValidated: false,
      persistenceValidated: false,
      auditValidated: false,
      privacyValidated: false,
      smokeValidated: false,
      loadValidated: false,
      cleanupExecuted: false,
      productionChanged: false,
      blockers,
      restrictions: [
        "Projeto remoto linkado nao foi tratado como staging sem confirmacao explicita.",
        "Operacoes de escrita foram bloqueadas.",
        "Dados reais nao foram usados.",
      ],
    },
  };
}

function writeReport(name, data, title) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, `${name}.json`), `${JSON.stringify(data, null, 2)}\n`);
  const lines = [
    `# ${title}`,
    "",
    `- Status: ${data.status}`,
    `- Ambiente: ${data.environment?.status ?? data.environment ?? "n/a"}`,
    `- Project Ref: ${data.projectRefMasked ?? data.environment?.linkedProject?.refMasked ?? "n/a"}`,
    `- Validado: ${data.validated === true ? "sim" : "nao"}`,
    "",
    "## Blockers",
    "",
    ...((data.blockers ?? []).length ? data.blockers.map((item) => `- ${item}`) : ["- Nenhum"]),
  ];
  fs.writeFileSync(path.join(REPORT_DIR, `${name}.md`), `${lines.join("\n")}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.environment === "production") {
    process.stderr.write("Production runtime validation is blocked.\n");
    process.exit(1);
  }
  const environment = inspectEnvironment(args);
  const catalog = buildRuntimeCatalog();
  const { reports, readiness } = buildReports(environment, catalog);

  writeReport("environment-report", reports.environment, "Environment Report");
  writeReport("schema-runtime-report", reports.schema, "Schema Runtime Report");
  writeReport("database-runtime-report", reports.database, "Database Runtime Report");
  writeReport("rls-runtime-report", reports.rls, "RLS Runtime Report");
  writeReport("edge-runtime-report", reports.edge, "Edge Runtime Report");
  writeReport("catalog-bundle-report", reports.catalog, "Catalog Bundle Report");
  writeReport("idempotency-runtime-report", reports.idempotency, "Idempotency Runtime Report");
  writeReport("auth-runtime-report", reports.auth, "Auth Runtime Report");
  writeReport("persistence-runtime-report", reports.persistence, "Persistence Runtime Report");
  writeReport("audit-runtime-report", reports.audit, "Audit Runtime Report");
  writeReport("privacy-runtime-report", reports.privacy, "Privacy Runtime Report");
  writeReport("staging-smoke-report", reports.smoke, "Staging Smoke Report");
  writeReport("activation-readiness-report", readiness, "Activation Readiness Report");

  if (args.json) process.stdout.write(`${JSON.stringify(readiness, null, 2)}\n`);
  else process.stdout.write(`AOE Supabase runtime readiness: ${readiness.status}\n`);
}

main();
