#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const REPORT_DIR = "reports/aoe/staging-provisioning";
const REQUIRED_TABLES = ["aoe_decisions", "aoe_decision_traces", "aoe_human_reviews", "aoe_idempotency_keys", "aoe_audit_events"];
const REQUIRED_FUNCTIONS = ["aoe_user_owns_student", "aoe_idempotency_get_or_create"];

function parseArgs(argv) {
  return argv.reduce((acc, arg) => {
    if (arg.startsWith("--schema=")) acc.schema = arg.slice("--schema=".length);
    if (arg.startsWith("--environment=")) acc.environment = arg.slice("--environment=".length);
    if (arg === "--json") acc.json = true;
    return acc;
  }, {});
}

function readConfirmation(environment) {
  if (!fs.existsSync(".aoe-environment.local.json")) return { valid: false, reason: "confirmacao local ausente" };
  const raw = JSON.parse(fs.readFileSync(".aoe-environment.local.json", "utf8"));
  const valid = raw.environment === environment && raw.confirmedNonProduction === true && ["local", "development", "staging"].includes(raw.environment);
  return { valid, reason: valid ? null : "confirmacao local invalida" };
}

function parseEvidence(file) {
  const content = fs.readFileSync(file, "utf8").trim();
  if (!content) throw new Error("Arquivo de evidencia vazio.");
  if (file.toLowerCase().endsWith(".json")) return JSON.parse(content);
  const lines = content.split(/\r?\n/);
  const headers = lines.shift().split(",").map((item) => item.trim());
  return lines.filter(Boolean).map((line) => Object.fromEntries(line.split(",").map((value, index) => [headers[index], value.trim()])));
}

function collectNames(evidence, key) {
  const rows = Array.isArray(evidence) ? evidence : Object.values(evidence).flat().filter((item) => typeof item === "object");
  return new Set(rows.map((row) => row[key] || row.table_name || row.routine_name || row.relname || row.object_name).filter(Boolean));
}

function writeReport(report) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "schema-evidence-report.json"), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(REPORT_DIR, "schema-evidence-report.md"), [
    "# Schema Evidence Report",
    "",
    `- Status: ${report.status}`,
    `- Ambiente: ${report.environment}`,
    "",
    "## Blockers",
    "",
    ...(report.blockers.length ? report.blockers.map((item) => `- ${item}`) : ["- Nenhum"]),
  ].join("\n") + "\n");
}

const args = parseArgs(process.argv.slice(2));
const blockers = [];
if (!args.schema) blockers.push("Parametro --schema ausente.");
if (!["local", "development", "staging"].includes(args.environment)) blockers.push("Ambiente invalido.");
const confirmation = readConfirmation(args.environment);
if (!confirmation.valid) blockers.push(confirmation.reason);

let evidence = null;
if (blockers.length === 0) {
  try {
    evidence = parseEvidence(args.schema);
  } catch (error) {
    blockers.push(error.message);
  }
}

const names = evidence ? collectNames(evidence, "table_name") : new Set();
const missingTables = REQUIRED_TABLES.filter((name) => !names.has(name));
const missingFunctions = REQUIRED_FUNCTIONS.filter((name) => !names.has(name));
if (evidence && missingTables.length) blockers.push(`Tabelas ausentes: ${missingTables.join(", ")}`);
if (evidence && missingFunctions.length) blockers.push(`RPCs ausentes: ${missingFunctions.join(", ")}`);

const report = {
  status: blockers.length ? "NOT_READY" : "SCHEMA_EVIDENCE_VALIDATED",
  environment: args.environment ?? null,
  evidenceFile: args.schema ? path.basename(args.schema) : null,
  requiredTables: REQUIRED_TABLES,
  missingTables,
  requiredFunctions: REQUIRED_FUNCTIONS,
  missingFunctions,
  blockers,
  sqlExecuted: false,
  databaseModified: false,
};

writeReport(report);
if (args.json) process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
else process.stdout.write(`AOE schema evidence: ${report.status}\n`);
process.exit(blockers.length ? 1 : 0);
