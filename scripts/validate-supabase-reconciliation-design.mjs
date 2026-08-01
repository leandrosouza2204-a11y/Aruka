import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { parseCsv } from "./analyze-supabase-reconciliation-evidence.mjs";

const root = process.cwd();
const reportDir = join(root, "reports/supabase-production-sync");
const docDir = join(root, "docs/supabase-production-sync");
const allowedStagedMigrations = new Set(["supabase/migrations/20260730090000_student_identity_contract.sql"]);

export async function main() {
  const result = readJson("reconciliation-design-result.json");
  const evidence = readJson("reconciliation-evidence-result.json");
  const futurePlan = readJson("future-migration-plan.json");
  const matrix = readCsv("reconciliation-design-matrix.csv");
  const docs = [
    readText(join(docDir, "05-reconciliation-design.md")),
    readText(join(reportDir, "future-migration-plan.md")),
    readText(join(reportDir, "reconciliation-design-summary.md")),
  ].join("\n");

  const stagedMigrations = git(["diff", "--cached", "--name-only", "--", "supabase/migrations"]).split(/\r?\n/).filter(Boolean);
  const findings = validateDesign({ result, evidence, futurePlan, matrix, docs, stagedMigrations });
  if (findings.length) {
    console.error(`SUPABASE_RECONCILIATION_DESIGN_INVALID ${JSON.stringify(findings, null, 2)}`);
    process.exit(1);
  }
  console.log("SUPABASE_RECONCILIATION_DESIGN_VALIDATED READY_FOR_RECONCILIATION_DESIGN");
}

export function validateDesign({ result, evidence, futurePlan, matrix, docs = "", stagedMigrations = [] }) {
  return [
    ...validateRequiredFiles({ result, evidence, futurePlan, matrix }),
    ...validateNullabilityComplete(evidence?.nullability || result?.nullability),
    ...validatePhaseOrder(matrix),
    ...validateExecutionBoundary({ result, evidence, futurePlan, docs, stagedMigrations }),
    ...validateMatrixRows(matrix),
  ];
}

export function validateRequiredFiles({ result, evidence, futurePlan, matrix }) {
  const findings = [];
  if (result?.decision !== "READY_FOR_RECONCILIATION_DESIGN") findings.push("design decision must be READY_FOR_RECONCILIATION_DESIGN");
  if (evidence?.decision !== "READY_FOR_RECONCILIATION_DESIGN") findings.push("evidence decision must be READY_FOR_RECONCILIATION_DESIGN");
  if (!futurePlan?.phases?.length) findings.push("future migration plan phases are missing");
  if (!matrix?.length) findings.push("reconciliation design matrix is missing");
  return findings;
}

export function validateNullabilityComplete(nullability) {
  const findings = [];
  if (!nullability) return ["nullability review is missing"];
  if (nullability.expected?.length !== 10) findings.push("nullability expected columns must be 10");
  if (nullability.missing?.length) findings.push("nullability profile still has missing columns");
  for (const profile of nullability.profiles || []) {
    if (Number(profile.total_rows) !== 26) findings.push(`unexpected total_rows for ${profile.table_name}.${profile.column_name}`);
    if (Number(profile.null_rows) !== 0) findings.push(`null rows remain for ${profile.table_name}.${profile.column_name}`);
    if (profile.current_data_classification !== "CURRENT_DATA_COMPATIBLE_WITH_NOT_NULL") findings.push(`unexpected nullability classification for ${profile.table_name}.${profile.column_name}`);
  }
  return findings;
}

export function validatePhaseOrder(matrix) {
  const findings = [];
  const phases = matrix.map((row) => Number(row.phase));
  for (let index = 1; index < phases.length; index += 1) {
    if (phases[index] <= phases[index - 1]) findings.push("phases must be strictly increasing");
  }
  const phaseByName = new Map(matrix.map((row) => [row.phase_name, Number(row.phase)]));
  if (phaseByName.get("student_identity_contract") <= Math.max(phaseByName.get("security_policies") || -1, phaseByName.get("function_and_table_grants") || -1, phaseByName.get("constraints_and_nullability") || -1, phaseByName.get("function_definitions") || -1, phaseByName.get("workout_delivery_contract") || -1)) findings.push("student identity must run after prerequisite reconciliation phases");
  if (phaseByName.get("migration_history_and_baseline") !== Math.max(...phases)) findings.push("migration history and baseline must be the final phase");
  return findings;
}

export function validateExecutionBoundary({ result, evidence, futurePlan, docs, stagedMigrations }) {
  const findings = [];
  const blob = JSON.stringify({ result, evidence, futurePlan }) + "\n" + docs;
  if (/\bREADY_TO_APPLY\b/.test(blob)) findings.push("READY_TO_APPLY must not appear in design artifacts");
  if (/^\s*(create|alter|drop|grant|revoke|insert|update|delete|merge|call|do)\b/im.test(docs)) findings.push("design docs contain executable write SQL");
  for (const migration of stagedMigrations) {
    if (!allowedStagedMigrations.has(migration.replace(/\\/g, "/"))) findings.push(`unexpected staged migration: ${migration}`);
  }
  return findings;
}

export function validateMatrixRows(matrix) {
  const findings = [];
  for (const row of matrix) {
    if (!row.rollback_concept) findings.push(`missing rollback concept in phase ${row.phase}`);
    if (!row.financial_impact) findings.push(`missing financial impact in phase ${row.phase}`);
    if (!row.approval_required) findings.push(`missing approval in phase ${row.phase}`);
    if (row.executable_sql_present !== "false") findings.push(`executable SQL marker must be false in phase ${row.phase}`);
  }
  return findings;
}

function readJson(name) { return JSON.parse(readText(join(reportDir, name))); }
function readCsv(name) {
  const rows = parseCsv(readText(join(reportDir, name)));
  const header = rows.shift() || [];
  return rows.filter((row) => row.some(Boolean)).map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? ""])));
}
function readText(path) {
  if (!existsSync(path)) throw new Error(`Missing required file: ${path}`);
  return readFileSync(path, "utf8");
}
function git(args) {
  try { return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
