import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export const TARGET_FUNCTION = "set_workout_templates_updated_at";
export const TARGET_SIGNATURE = "public.set_workout_templates_updated_at()";
export const MIGRATION = "supabase/migrations/20260801180000_harden_workout_templates_updated_at.sql";
export const INPUT_DIR = "reports/supabase-production-sync/remote-phase33-input";
export const REPORT_DIR = "reports/supabase-production-sync";

const expectedCsvKinds = new Set([
  "FUNCTION_DEFINITION_EVIDENCE",
  "TRIGGER_DEPENDENCY_EVIDENCE",
  "FUNCTION_GRANT_EVIDENCE",
  "DEPENDENCY_METADATA_EVIDENCE"
]);

const expectedRemoteGrants = ["PUBLIC", "anon", "authenticated", "postgres", "service_role"];
const expectedLocalGrants = ["postgres", "service_role"];

export function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers = [], ...body] = rows.filter((csvRow) => csvRow.some((value) => value !== ""));
  return body.map((csvRow) => Object.fromEntries(headers.map((header, index) => [header, csvRow[index] ?? ""])));
}

export function classifyHeaders(headers) {
  const set = new Set(headers);
  if (set.has("full_definition") && set.has("function_config") && set.has("owner_name")) return "FUNCTION_DEFINITION_EVIDENCE";
  if (set.has("trigger_definition") && set.has("trigger_enabled") && set.has("table_name")) return "TRIGGER_DEPENDENCY_EVIDENCE";
  if (set.has("grantee") && set.has("privilege_type") && set.has("is_grantable")) return "FUNCTION_GRANT_EVIDENCE";
  if (set.has("dependency_catalog") && set.has("referenced_catalog") && set.has("referenced_object")) return "DEPENDENCY_METADATA_EVIDENCE";
  return "UNKNOWN_EVIDENCE";
}

export function loadRemoteEvidence(root = process.cwd()) {
  const dir = join(root, INPUT_DIR);
  if (!existsSync(dir)) throw new Error("PHASE34_REMOTE_PHASE33_INPUT_MISSING");
  const files = readdirSync(dir).filter((file) => file.toLowerCase().endsWith(".csv"));
  const evidence = {};
  for (const file of files) {
    const text = readFileSync(join(dir, file), "utf8");
    const headers = text.split(/\r?\n/, 1)[0].split(",");
    const kind = classifyHeaders(headers);
    if (kind === "UNKNOWN_EVIDENCE") throw new Error(`PHASE34_UNKNOWN_CSV_HEADERS:${file}`);
    if (evidence[kind]) throw new Error(`PHASE34_DUPLICATE_EVIDENCE:${kind}`);
    evidence[kind] = { file, rows: parseCsv(text) };
  }
  for (const kind of expectedCsvKinds) {
    if (!evidence[kind]) throw new Error(`PHASE34_REQUIRED_EVIDENCE_MISSING:${kind}`);
  }
  return evidence;
}

export function normalizeBody(definition) {
  const body = definition
    .replace(/\r\n?/g, "\n")
    .replace(/^[\s\S]*?\bas\s+\$[^$]*\$/i, "")
    .replace(/\$[^$]*\$\s*;?\s*$/i, "")
    .replace(/\bbegin\b/i, "")
    .replace(/\bend\s*;?\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return body;
}

export function bodyHash(body) {
  return createHash("sha256").update(body).digest("hex").slice(0, 12);
}

function canonicalSignature(row) {
  const schema = row.schema_name || row.function_schema || "public";
  const name = row.function_name;
  const args = row.identity_arguments || "";
  return `${schema}.${name}(${args})`;
}

export function validateEvidence(evidence, localDefinition) {
  const definitionRows = evidence.FUNCTION_DEFINITION_EVIDENCE.rows;
  if (definitionRows.length !== 1) throw new Error("PHASE34_FUNCTION_DEFINITION_ROW_COUNT");
  const remote = definitionRows[0];
  if (canonicalSignature(remote) !== TARGET_SIGNATURE) throw new Error("PHASE34_FUNCTION_SIGNATURE_MISMATCH");
  if (remote.result_type !== "trigger") throw new Error("PHASE34_RETURN_TYPE_MISMATCH");
  if (remote.language_name !== "plpgsql") throw new Error("PHASE34_LANGUAGE_MISMATCH");
  if (remote.volatility !== "VOLATILE") throw new Error("PHASE34_VOLATILITY_MISMATCH");
  if (remote.security_definer !== "false") throw new Error("PHASE34_SECURITY_DEFINER_MISMATCH");
  if (remote.leakproof !== "false") throw new Error("PHASE34_LEAKPROOF_MISMATCH");
  if (remote.strict !== "false") throw new Error("PHASE34_STRICT_MISMATCH");
  if (remote.parallel_mode !== "u") throw new Error("PHASE34_PARALLEL_MISMATCH");
  if (remote.owner_name !== "postgres") throw new Error("PHASE34_OWNER_MISMATCH");
  if (!["", "null", "NULL"].includes(remote.function_config)) throw new Error("PHASE34_REMOTE_SEARCH_PATH_ALREADY_SET");

  const remoteBody = normalizeBody(remote.full_definition);
  const localBody = normalizeBody(localDefinition);
  if (remoteBody !== localBody) throw new Error("BLOCKED_GROUP_A_BODY_DIFFERENCE");

  const triggerRows = evidence.TRIGGER_DEPENDENCY_EVIDENCE.rows;
  if (triggerRows.length !== 1) throw new Error("PHASE34_TRIGGER_ROW_COUNT");
  const trigger = triggerRows[0];
  const triggerDefinition = trigger.trigger_definition.toLowerCase();
  if (trigger.table_schema !== "public" || trigger.table_name !== "workout_templates") throw new Error("BLOCKED_GROUP_A_TRIGGER_DIFFERENCE");
  if (trigger.trigger_name !== TARGET_FUNCTION || trigger.trigger_enabled !== "enabled") throw new Error("BLOCKED_GROUP_A_TRIGGER_DIFFERENCE");
  if (!triggerDefinition.includes("before update") || !triggerDefinition.includes("for each row")) throw new Error("BLOCKED_GROUP_A_TRIGGER_DIFFERENCE");
  if (canonicalSignature(trigger) !== TARGET_SIGNATURE) throw new Error("BLOCKED_GROUP_A_TRIGGER_DIFFERENCE");

  const dependencyRows = evidence.DEPENDENCY_METADATA_EVIDENCE.rows;
  const dependencyCatalogs = dependencyRows.map((row) => `${row.referenced_catalog}:${row.dependency_type}`).sort();
  if (dependencyCatalogs.join("|") !== "pg_language:n|pg_namespace:n") throw new Error("PHASE34_UNEXPECTED_FUNCTION_DEPENDENCY");

  const grantRows = evidence.FUNCTION_GRANT_EVIDENCE.rows;
  const remoteGrants = grantRows
    .filter((row) => canonicalSignature(row) === TARGET_SIGNATURE && row.privilege_type === "EXECUTE")
    .map((row) => row.grantee)
    .sort();
  if (remoteGrants.join("|") !== [...expectedRemoteGrants].sort().join("|")) throw new Error("PHASE34_REMOTE_GRANTS_MISMATCH");

  return {
    decision: "SECURITY_HARDENING_CONFIRMED",
    body_comparison: "BODY_EQUIVALENT_NORMALIZED",
    trigger_comparison: "TRIGGER_EQUIVALENT",
    dependency_decision: "NO_UNEXPECTED_FUNCTION_DEPENDENCY_FOUND",
    remote_search_path: "REMOTE_SEARCH_PATH_NOT_EXPLICITLY_SET",
    local_search_path: "public",
    remote_body_hash: bodyHash(remoteBody),
    local_body_hash: bodyHash(localBody),
    remote_grants: remoteGrants,
    local_expected_grants: expectedLocalGrants,
    grant_decisions: {
      PUBLIC: "EXCESS",
      anon: "EXCESS",
      authenticated: "EXCESS",
      postgres: "KEEP",
      service_role: "KEEP"
    },
    application_execute_required: "NO"
  };
}

export function validateMigrationSql(sql) {
  const normalized = sql.replace(/\s+/g, " ").trim().toLowerCase();
  const failures = [];
  const target = "public.set_workout_templates_updated_at()";
  if (!normalized.includes(`alter function ${target} set search_path = public`)) failures.push("PHASE34_SEARCH_PATH_ALTER_MISSING");
  for (const role of ["public", "anon", "authenticated"]) {
    if (!normalized.includes(`revoke execute on function ${target} from ${role}`)) failures.push(`PHASE34_REVOKE_${role.toUpperCase()}_MISSING`);
  }
  const banned = [
    [/create\s+or\s+replace\s+function/i, "PHASE34_CREATE_OR_REPLACE_FORBIDDEN"],
    [/drop\s+function/i, "PHASE34_DROP_FUNCTION_FORBIDDEN"],
    [/alter\s+table/i, "PHASE34_ALTER_TABLE_FORBIDDEN"],
    [/create\s+(?:or\s+replace\s+)?trigger|alter\s+trigger|drop\s+trigger/i, "PHASE34_TRIGGER_CHANGE_FORBIDDEN"],
    [/\bgrant\b/i, "PHASE34_GRANT_FORBIDDEN"],
    [/\b(insert|update|delete|merge|truncate)\b/i, "PHASE34_DATA_WRITE_FORBIDDEN"],
    [/aoe_|student_identity|student_user_id|admin_|salvar_treino|vincular_aluno|desvincular_aluno|get_my_student/i, "PHASE34_OUT_OF_SCOPE_OBJECT_FORBIDDEN"],
    [/revoke\s+execute\s+on\s+function\s+public\.set_workout_templates_updated_at\(\)\s+from\s+(postgres|service_role)/i, "PHASE34_PLATFORM_REVOKE_FORBIDDEN"]
  ];
  for (const [pattern, error] of banned) {
    if (pattern.test(sql)) failures.push(error);
  }
  const occurrences = [...sql.matchAll(/set_workout_templates_updated_at/g)].length;
  if (occurrences !== 4) failures.push("PHASE34_TARGET_FUNCTION_OCCURRENCE_MISMATCH");
  if (failures.length) throw new Error(failures.join(";"));
}

export function validateCsvIgnoredAndUnstaged(root = process.cwd()) {
  const ignored = execFileSync("git", ["check-ignore", "-v", `${INPUT_DIR}/phase33-group-a-function-definition.csv`], { cwd: root, encoding: "utf8" });
  if (!ignored.includes("remote-phase33-input/*.csv")) throw new Error("PHASE34_CSV_IGNORE_MISSING");
  const staged = execFileSync("git", ["diff", "--cached", "--name-only", "--", `${INPUT_DIR}/**/*.csv`, `${INPUT_DIR}/*.csv`], { cwd: root, encoding: "utf8" });
  if (staged.trim()) throw new Error("PHASE34_RAW_CSV_STAGED");
}

function writeReports(result, evidence, root = process.cwd()) {
  mkdirSync(join(root, REPORT_DIR), { recursive: true });
  const evidenceResult = {
    phase: "3.4",
    decision: "SECURITY_HARDENING_CONFIRMED",
    target: TARGET_SIGNATURE,
    evidence_files: Object.fromEntries(Object.entries(evidence).map(([kind, value]) => [kind, value.file])),
    ...result
  };
  const securityResult = {
    phase: "3.4",
    decision: "READY_FOR_PHASE34_GROUP_A_COMMIT",
    supabase_change: "YES",
    production_action_required: "PENDING_RECONCILIATION_COMPLETION",
    target: TARGET_SIGNATURE,
    migration: MIGRATION,
    search_path_hardening_required: true,
    public_execute_revoke_required: true,
    anon_execute_revoke_required: true,
    authenticated_execute_revoke_required: true,
    body_replacement_required: "NO",
    trigger_change_required: "NO",
    remote_link_state: "UNLINKED_FOR_SAFETY"
  };
  writeFileSync(join(root, REPORT_DIR, "phase34-group-a-evidence-result.json"), `${JSON.stringify(evidenceResult, null, 2)}\n`);
  writeFileSync(join(root, REPORT_DIR, "phase34-group-a-security-result.json"), `${JSON.stringify(securityResult, null, 2)}\n`);
  writeFileSync(join(root, REPORT_DIR, "phase34-group-a-evidence-summary.md"), `# Phase 3.4 Group A Evidence Summary

Decision: \`SECURITY_HARDENING_CONFIRMED\`.

- Target: \`${TARGET_SIGNATURE}\`
- Body comparison: \`${result.body_comparison}\`
- Trigger comparison: \`${result.trigger_comparison}\`
- Remote search_path: \`${result.remote_search_path}\`
- Dependencies: \`${result.dependency_decision}\`
- Remote grants: \`${result.remote_grants.join(", ")}\`
- Local expected grants: \`${result.local_expected_grants.join(", ")}\`
- Application execute required: \`${result.application_execute_required}\`
- Local body hash: \`${result.local_body_hash}\`
- Remote body hash: \`${result.remote_body_hash}\`
`);
  writeFileSync(join(root, REPORT_DIR, "phase34-group-a-security-summary.md"), `# Phase 3.4 Group A Security Summary

Decision: \`READY_FOR_PHASE34_GROUP_A_COMMIT\`.

Supabase change: \`YES\`.

Production action required: \`PENDING_RECONCILIATION_COMPLETION\`.

Migration: \`${MIGRATION}\`.

Actions authorized by the migration:

- Set \`search_path = public\` on \`${TARGET_SIGNATURE}\`.
- Revoke direct EXECUTE from \`PUBLIC\`.
- Revoke direct EXECUTE from \`anon\`.
- Revoke direct EXECUTE from \`authenticated\`.

Body replacement required: \`NO\`.

Trigger change required: \`NO\`.
`);
}

export function runValidation({ write = true } = {}) {
  const root = process.cwd();
  const evidence = loadRemoteEvidence(root);
  const localCatalog = JSON.parse(readFileSync(join(root, "reports/supabase-production-sync/local-schema-catalog/functions.json"), "utf8"));
  const local = localCatalog.find((row) => row.function_name === TARGET_FUNCTION && row.arguments === "");
  if (!local) throw new Error("PHASE34_LOCAL_FUNCTION_MISSING");
  const result = validateEvidence(evidence, local.definition);
  const migrationSql = readFileSync(join(root, MIGRATION), "utf8");
  validateMigrationSql(migrationSql);
  validateCsvIgnoredAndUnstaged(root);
  if (write) writeReports(result, evidence, root);
  console.log("GROUP_A_DECISION=SECURITY_HARDENING_CONFIRMED");
  console.log("SUPABASE_PHASE34_GROUP_A_SECURITY_READY");
  return result;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    runValidation();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
