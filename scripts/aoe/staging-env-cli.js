#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const REPORT_DIR = "reports/aoe/staging-provisioning";
const CONFIRMATION_FILE = ".aoe-environment.local.json";
const REQUIRED_FLAGS = [
  "AOE_ENABLED",
  "AOE_PILOT_ENABLED",
  "AOE_DECISION_WRITE_ENABLED",
  "AOE_HUMAN_REVIEW_ENABLED",
  "AOE_TRACE_READ_ENABLED",
  "AOE_INFRA_TEST_ENV",
];

function parseArgs(argv) {
  return argv.reduce((acc, arg) => {
    if (arg.startsWith("--environment=")) acc.environment = arg.slice("--environment=".length);
    if (arg === "--json") acc.json = true;
    return acc;
  }, { environment: "staging" });
}

function maskRef(ref) {
  if (!ref) return null;
  return ref.length > 8 ? `${ref.slice(0, 4)}...${ref.slice(-4)}` : "****";
}

function run(command, args) {
  const isCmd = command.toLowerCase().endsWith(".cmd");
  const result = isCmd
    ? spawnSync(process.env.ComSpec || "cmd.exe", ["/c", command, ...args], { encoding: "utf8" })
    : spawnSync(command, args, { encoding: "utf8" });
  return {
    ok: result.status === 0,
    status: result.status,
    stdout: String(result.stdout || "").trim(),
    stderr: String(result.stderr || "").trim(),
  };
}

function readConfirmation() {
  if (!fs.existsSync(CONFIRMATION_FILE)) return { present: false };
  const raw = JSON.parse(fs.readFileSync(CONFIRMATION_FILE, "utf8"));
  const allowed = ["local", "development", "staging"];
  const valid = allowed.includes(raw.environment) && raw.confirmedNonProduction === true && Boolean(raw.supabaseProjectRef);
  return {
    present: true,
    valid,
    environment: raw.environment,
    supabaseProjectRefMasked: maskRef(raw.supabaseProjectRef),
    confirmedNonProduction: raw.confirmedNonProduction === true,
    confirmedAt: raw.confirmedAt ?? null,
    confirmedBy: raw.confirmedBy ?? null,
  };
}

function readLinkedProject() {
  const refPath = "supabase/.temp/project-ref";
  const linkedPath = "supabase/.temp/linked-project.json";
  let linked = null;
  if (fs.existsSync(linkedPath)) {
    const raw = JSON.parse(fs.readFileSync(linkedPath, "utf8"));
    linked = {
      refMasked: maskRef(raw.ref),
      name: raw.name ?? null,
      organizationMasked: maskRef(raw.organization_slug ?? raw.organization_id ?? ""),
    };
  }
  return {
    refMasked: fs.existsSync(refPath) ? maskRef(fs.readFileSync(refPath, "utf8").trim()) : null,
    linked,
  };
}

function validateEnvironment(args) {
  const confirmation = readConfirmation();
  const linkedProject = readLinkedProject();
  const npxVersion = run("npx.cmd", ["supabase", "--version"]);
  const projects = run("npx.cmd", ["supabase", "projects", "list", "--output", "json"]);
  const missingFlags = REQUIRED_FLAGS.filter((name) => !Object.prototype.hasOwnProperty.call(process.env, name));
  const configPresent = fs.existsSync("supabase/config.toml");
  const migrationPresent = fs.existsSync("supabase/migrations/20260715_aoe_infrastructure_pilot.sql");
  const functionPresent = fs.existsSync("supabase/functions/aoe/index.ts");
  const catalogPresent = fs.existsSync("supabase/functions/aoe/generated/apl-catalog.generated.ts");
  const blockers = [];

  if (args.environment === "production") blockers.push("Ambiente production bloqueado.");
  if (!confirmation.present) blockers.push(`${CONFIRMATION_FILE} ausente.`);
  if (confirmation.present && !confirmation.valid) blockers.push("Confirmacao local invalida ou nao produtiva nao comprovada.");
  if (!configPresent) blockers.push("supabase/config.toml ausente.");
  if (!npxVersion.ok) blockers.push("Supabase CLI via npx.cmd indisponivel.");
  if (!migrationPresent) blockers.push("Migration AOE local ausente.");
  if (!functionPresent) blockers.push("Edge Function AOE ausente.");
  if (!catalogPresent) blockers.push("Catalogo runtime AOE ausente.");
  if (confirmation.valid && linkedProject.refMasked && confirmation.supabaseProjectRefMasked !== linkedProject.refMasked) {
    blockers.push("Project Ref confirmado nao corresponde ao projeto linkado.");
  }

  let status = "SAFE_FOR_STAGING_VALIDATION";
  if (args.environment === "production") status = "PRODUCTION_BLOCKED";
  else if (blockers.length > 0) status = confirmation.present ? "ENVIRONMENT_INCOMPLETE" : "INDETERMINATE";

  return {
    status,
    requestedEnvironment: args.environment,
    date: new Date().toISOString(),
    confirmation,
    linkedProject,
    supabaseCli: { npxAvailable: npxVersion.ok, version: npxVersion.ok ? npxVersion.stdout : null },
    projectListAvailable: projects.ok,
    configPresent,
    migrationPresent,
    functionPresent,
    catalogPresent,
    requiredFlags: REQUIRED_FLAGS.map((name) => ({ name, present: !missingFlags.includes(name) })),
    blockers,
    productionChanged: false,
    remoteWritesExecuted: false,
  };
}

function readinessFromEnvironment(environment) {
  const blockers = [
    ...environment.blockers,
    "Schema real ainda precisa ser importado ou consultado.",
    "RLS, auth, idempotencia, persistencia, privacidade e smoke ainda precisam de evidencias runtime.",
  ];
  return {
    status: blockers.length ? "NOT_READY" : "READY_FOR_CONTROLLED_PILOT",
    environment: environment.status,
    projectRefMasked: environment.confirmation.supabaseProjectRefMasked ?? environment.linkedProject.refMasked,
    stagingConfirmed: environment.status === "SAFE_FOR_STAGING_VALIDATION",
    schemaEvidenceValidated: false,
    migrationConfirmed: false,
    edgeDeploymentExecuted: false,
    runtimeRlsValidated: false,
    runtimeAuthValidated: false,
    runtimeIdempotencyValidated: false,
    runtimePersistenceValidated: false,
    runtimePrivacyValidated: false,
    smokeValidated: false,
    cleanupPrepared: fs.existsSync("scripts/aoe/cleanup-staging-fixtures.js"),
    blockers,
    productionChanged: false,
  };
}

function writeReport(name, data, title) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, `${name}.json`), `${JSON.stringify(data, null, 2)}\n`);
  const lines = [
    `# ${title}`,
    "",
    `- Status: ${data.status}`,
    `- Project Ref: ${data.projectRefMasked ?? data.confirmation?.supabaseProjectRefMasked ?? data.linkedProject?.refMasked ?? "n/a"}`,
    `- Producao alterada: ${data.productionChanged ? "sim" : "nao"}`,
    "",
    "## Blockers",
    "",
    ...((data.blockers ?? []).length ? data.blockers.map((item) => `- ${item}`) : ["- Nenhum"]),
  ];
  fs.writeFileSync(path.join(REPORT_DIR, `${name}.md`), `${lines.join("\n")}\n`);
}

const args = parseArgs(process.argv.slice(2));
const environment = validateEnvironment(args);
const readiness = readinessFromEnvironment(environment);
const blockedRuntime = {
  status: "BLOCKED",
  projectRefMasked: readiness.projectRefMasked,
  blockers: readiness.blockers,
  productionChanged: false,
  remoteWritesExecuted: false,
};
const schemaEvidence = {
  status: "PENDING",
  projectRefMasked: readiness.projectRefMasked,
  evidenceImported: false,
  blockers: [
    "Evidencia de schema ainda nao importada.",
    "Execute scripts/aoe/sql/runtime-schema-inspection.sql em staging confirmado e importe o resultado.",
  ],
  productionChanged: false,
};

writeReport("environment-validation-report", environment, "Environment Validation Report");
writeReport("schema-evidence-report", schemaEvidence, "Schema Evidence Report");
writeReport("staging-runtime-report", blockedRuntime, "Staging Runtime Report");
writeReport("staging-privacy-report", blockedRuntime, "Staging Privacy Report");
writeReport("staging-readiness-report", readiness, "Staging Readiness Report");

if (args.json) process.stdout.write(`${JSON.stringify(readiness, null, 2)}\n`);
else process.stdout.write(`AOE staging readiness: ${readiness.status}\n`);
