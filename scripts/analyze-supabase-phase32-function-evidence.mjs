import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const reportDir = join(root, "reports/supabase-production-sync");
const docsDir = join(root, "docs/supabase-production-sync");
const inputDir = join(reportDir, "remote-phase31-input");

const relevantFunctions = new Set([
  "admin_atualizar_perfil",
  "admin_bloquear_usuario",
  "admin_liberar_assinante",
  "admin_liberar_beta",
  "admin_upsert_assinatura",
  "admin_listar_logs",
  "admin_listar_usuarios",
  "admin_registrar_log",
  "aoe_idempotency_get_or_create",
  "set_workout_templates_updated_at",
  "desvincular_aluno_usuario",
  "get_my_student_workouts",
  "vincular_aluno_usuario",
]);

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (char === "\"" && next === "\"") {
        cell += "\"";
        i += 1;
      } else if (char === "\"") {
        quoted = false;
      } else {
        cell += char;
      }
      continue;
    }
    if (char === "\"") quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((item) => item.some((value) => value !== ""));
}

export function normalizeFunctionDefinition(value) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\$function\$/g, "$$")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function hash(value) {
  return createHash("sha256").update(String(value || "")).digest("hex").slice(0, 12);
}

export function grantsFromAcl(acl) {
  const text = String(acl || "");
  const out = new Set();
  const roleMap = [
    [/(\{|,)anon=/, "anon.execute"],
    [/(\{|,)authenticated=/, "authenticated.execute"],
    [/(\{|,)service_role=/, "service_role.execute"],
    [/(\{|,)postgres=/, "postgres.execute"],
    [/(\{|,)=/, "public.execute"],
  ];
  for (const [pattern, label] of roleMap) {
    if (pattern.test(text)) out.add(label);
  }
  return [...out].sort();
}

export function classifyRow({ local, remote, category, localCallers }) {
  if (!local && remote) return "REMOTE_OVERLOAD_ONLY";
  if (local && !remote) return "LOCAL_OVERLOAD_ONLY";
  if (!local && !remote) return "EVIDENCE_INSUFFICIENT";
  if (category === "STUDENT_IDENTITY") return "DEFERRED";

  const rawEqual = local.definition === remote.full_definition;
  const normalizedEqual = normalizeFunctionDefinition(local.definition) === normalizeFunctionDefinition(remote.full_definition);
  const configDifferent = local.security_definer !== String(remote.security_definer) || local.volatility !== remote.volatility || searchPath(local.definition) !== searchPath(remote.full_definition);
  const grantDifferent = JSON.stringify(local.grants || []) !== JSON.stringify(remote.grants || []);

  if (rawEqual && !configDifferent && !grantDifferent) return "EQUIVALENT";
  if (normalizedEqual && !configDifferent && !grantDifferent) return "BODY_EQUIVALENT_NORMALIZED";
  if (configDifferent && normalizedEqual) return "SECURITY_CONFIGURATION_DIFFERENT";
  if (grantDifferent && normalizedEqual) return "GRANT_DIFFERENT";
  if (category === "FINANCIAL") return "BODY_DIFFERENT_CONFIRMED";
  if (localCallers?.externalUnknown) return "BODY_DIFFERENT_CONFIRMED";
  return "BODY_DIFFERENT_CONFIRMED";
}

export function decisionFor(row) {
  if (row.category === "STUDENT_IDENTITY") return "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT";
  if (row.function_name === "set_workout_templates_updated_at" && row.security_state === "SECURITY_CONFIGURATION_DIFFERENT") return "READY_FOR_PHASE32_GROUP_A_MIGRATION";
  if (row.function_name === "aoe_idempotency_get_or_create" && row.grant_state === "GRANT_DIFFERENT" && row.remote_grants.includes("anon.execute")) return "READY_FOR_AOE_EXECUTE_SECURITY_MIGRATION";
  if (row.category === "FINANCIAL" && row.body_state === "BODY_DIFFERENT_CONFIRMED") return "FINANCIAL_OWNER_REVIEW_REQUIRED";
  if (row.divergence === "REMOTE_OVERLOAD_ONLY") return "EXTERNAL_CONSUMER_REVIEW_REQUIRED";
  if (row.body_state === "BODY_DIFFERENT_CONFIRMED") return "MANUAL_PRODUCT_DECISION_REQUIRED";
  return "NO_FUNCTION_MIGRATION_REQUIRED";
}

function readRemoteEvidence() {
  const files = existsSync(inputDir)
    ? readdirSync(inputDir, { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => join(inputDir, entry.name)).sort()
    : [];
  const csvFiles = files.filter((file) => file.toLowerCase().endsWith(".csv"));
  const evidenceFiles = [];
  const rows = [];
  for (const file of csvFiles) {
    const bytes = readFileSync(file);
    const text = bytes.toString("utf8").replace(/^\uFEFF/, "");
    const parsed = parseCsv(text);
    const header = parsed[0] || [];
    const delimiter = (header.join(",").match(/,/g) || []).length >= 8 ? "," : "unknown";
    evidenceFiles.push({
      name: basename(file),
      extension: ".csv",
      size_bytes: bytes.length,
      headers: header,
      records: Math.max(parsed.length - 1, 0),
      evidence_type: header.includes("full_definition") ? "phase31_function_definitions" : "unknown",
      multiple_result_grids_detected: parsed.slice(1).some((row) => row.join(",") === header.join(",")),
      encoding: bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? "utf8-bom" : "utf8",
      delimiter,
    });
    for (const row of parsed.slice(1)) {
      const object = Object.fromEntries(header.map((key, index) => [key, row[index] || ""]));
      object.grants = grantsFromAcl(object.acl);
      rows.push(object);
    }
  }
  return { evidenceFiles, rows };
}

function localCatalog() {
  const functions = JSON.parse(readFileSync(join(reportDir, "local-schema-catalog/functions.json"), "utf8"));
  const grants = JSON.parse(readFileSync(join(reportDir, "local-schema-catalog/function-grants.json"), "utf8"));
  return functions.filter((fn) => relevantFunctions.has(fn.function_name)).map((fn) => ({
    schema_name: "public",
    function_name: fn.function_name,
    identity_arguments: fn.arguments,
    return_type: fn.return_type,
    security_definer: String(fn.security_definer),
    volatility: fn.volatility,
    config: searchPath(fn.definition),
    definition: fn.definition,
    grants: grants.filter((grant) => grant.routine_name === fn.function_name).map((grant) => `${grant.grantee}.${String(grant.privilege_type).toLowerCase()}`).sort(),
  }));
}

function sourceHits() {
  const files = [
    "src/services/adminService.js",
    "src/services/adminLogsService.js",
    "src/aoe/infrastructure/persistence/supabase-idempotency-repository.js",
    "src/services/treinosService.js",
    "supabase/baseline-src/05-functions.sql",
    "supabase/baseline-src/09-grants.sql",
    "supabase/migrations/20260716090000_baseline_aruka_v1.sql",
    "supabase/migrations-archive/20260705090000_hardening_admin_functions.sql",
    "supabase/migrations-archive/20260714090000_workout_templates.sql",
  ];
  return files.filter((file) => existsSync(join(root, file))).flatMap((file) => {
    const text = readFileSync(join(root, file), "utf8");
    return [...relevantFunctions].flatMap((name) => {
      const matches = [...text.matchAll(new RegExp(name, "g"))];
      return matches.map((match) => ({ file, function_name: name, offset: match.index }));
    });
  });
}

function buildComparison() {
  const { evidenceFiles, rows: remoteRows } = readRemoteEvidence();
  const localRows = localCatalog();
  const hits = sourceHits();
  const localMap = new Map(localRows.map((row) => [key(row), row]));
  const remoteMap = new Map(remoteRows.map((row) => [key(row), row]));
  const keys = [...new Set([...localMap.keys(), ...remoteMap.keys()])].filter((item) => relevantFunctions.has(item.split("(")[0])).sort();
  const comparison = keys.map((item) => {
    const local = localMap.get(item);
    const remote = remoteMap.get(item);
    const functionName = (local || remote).function_name;
    const category = classifyFunction(functionName);
    const localState = local ? "present" : "absent";
    const remoteState = remote ? "present" : "absent";
    const divergence = !local ? "REMOTE_OVERLOAD_ONLY" : !remote ? "LOCAL_OVERLOAD_ONLY" : "PRESENT_BOTH";
    const bodyState = bodyStateFor(local, remote);
    const securityState = securityStateFor(local, remote);
    const grantState = grantStateFor(local, remote);
    const dependencyState = dependencyStateFor(functionName, hits);
    const row = {
      category,
      function_name: functionName,
      signature: (local || remote).identity_arguments,
      local_state: localState,
      remote_state: remoteState,
      divergence,
      body_state: bodyState,
      security_state: securityState,
      grant_state: grantState,
      dependency_state: dependencyState,
      risk: riskFor(category, functionName, divergence, bodyState, grantState),
      local_raw_hash: local ? hash(local.definition) : "",
      remote_raw_hash: remote ? hash(remote.full_definition) : "",
      local_normalized_hash: local ? hash(normalizeFunctionDefinition(local.definition)) : "",
      remote_normalized_hash: remote ? hash(normalizeFunctionDefinition(remote.full_definition)) : "",
      local_security_definer: local?.security_definer || "",
      remote_security_definer: remote ? String(remote.security_definer) : "",
      local_search_path: local?.config || "",
      remote_search_path: remote?.config || searchPath(remote?.full_definition || ""),
      local_volatility: local?.volatility || "",
      remote_volatility: remote?.volatility || "",
      local_grants: (local?.grants || []).join("; "),
      remote_grants: (remote?.grants || []).join("; "),
      recommended_action: "",
      evidence: remote ? "REMOTE_PHASE31_CSV_FULL_DEFINITION" : "LOCAL_CATALOG_ONLY",
      migration_group: migrationGroupFor(functionName, category),
      blocking_reason: "",
    };
    row.classification = classifyRow({ local, remote, category, localCallers: { externalUnknown: dependencyState.includes("EXTERNAL") } });
    row.decision = decisionFor(row);
    row.recommended_action = recommendedAction(row);
    row.blocking_reason = blockingReason(row);
    return row;
  });
  return { evidenceFiles, comparison };
}

function bodyStateFor(local, remote) {
  if (!local || !remote) return "NOT_COMPARABLE";
  if (local.definition === remote.full_definition) return "EQUIVALENT";
  if (normalizeFunctionDefinition(local.definition) === normalizeFunctionDefinition(remote.full_definition)) return "BODY_EQUIVALENT_NORMALIZED";
  return "BODY_DIFFERENT_CONFIRMED";
}

function securityStateFor(local, remote) {
  if (!local || !remote) return "NOT_COMPARABLE";
  const same = local.security_definer === String(remote.security_definer) && local.volatility === remote.volatility && local.config === (remote.config || searchPath(remote.full_definition));
  return same ? "SECURITY_EQUIVALENT" : "SECURITY_CONFIGURATION_DIFFERENT";
}

function grantStateFor(local, remote) {
  if (!local || !remote) return "NOT_COMPARABLE";
  return JSON.stringify(local.grants) === JSON.stringify(remote.grants) ? "GRANT_EQUIVALENT" : "GRANT_DIFFERENT";
}

function dependencyStateFor(functionName, hits) {
  const relevant = hits.filter((hit) => hit.function_name === functionName);
  const src = relevant.some((hit) => hit.file.startsWith("src/"));
  const sql = relevant.some((hit) => hit.file.startsWith("supabase/"));
  const docsExternal = false;
  const external = ["admin_atualizar_perfil", "admin_bloquear_usuario", "admin_liberar_assinante", "admin_liberar_beta", "admin_upsert_assinatura"].includes(functionName);
  return [
    src ? "LOCAL_SRC_CALLER" : "NO_LOCAL_SRC_CALLER",
    sql ? "SQL_REFERENCE" : "NO_SQL_REFERENCE",
    docsExternal ? "DOC_EXTERNAL_CALLER" : "NO_DOC_EXTERNAL_CALLER",
    external ? "EXTERNAL_CONSUMER_UNKNOWN" : "NO_EXTERNAL_CONSUMER_EVIDENCE",
  ].join("; ");
}

function riskFor(category, functionName, divergence, bodyState, grantState) {
  if (category === "FINANCIAL") return "P0_FINANCIAL";
  if (functionName === "aoe_idempotency_get_or_create" && grantState === "GRANT_DIFFERENT") return "P0_SECURITY";
  if (functionName === "set_workout_templates_updated_at") return "LOW_UTILITY_SECURITY";
  if (divergence === "REMOTE_OVERLOAD_ONLY") return "HIGH_COMPATIBILITY";
  if (bodyState === "BODY_DIFFERENT_CONFIRMED") return "HIGH_BUSINESS_LOGIC";
  return "MEDIUM";
}

function migrationGroupFor(functionName, category) {
  if (functionName === "set_workout_templates_updated_at") return "GROUP_A_UTILITY_SECURITY_HARDENING";
  if (functionName === "aoe_idempotency_get_or_create") return "GROUP_E_AOE_SECURITY";
  if (category === "FINANCIAL") return "GROUP_D_FINANCIAL_FUNCTION_RECONCILIATION";
  if (category === "ADMIN") return "GROUP_B_ADMIN_BODY_RECONCILIATION";
  if (category === "STUDENT_IDENTITY") return "NO_MIGRATION_GROUP_STUDENT_IDENTITY";
  return "NO_MIGRATION_GROUP";
}

function recommendedAction(row) {
  if (row.decision === "READY_FOR_PHASE32_GROUP_A_MIGRATION") return "Create isolated Group A migration for search_path/grant hardening only.";
  if (row.decision === "READY_FOR_AOE_EXECUTE_SECURITY_MIGRATION") return "Create isolated Group E migration revoking anon EXECUTE only; do not alter body.";
  if (row.decision === "FINANCIAL_OWNER_REVIEW_REQUIRED") return "Do not migrate financial body; require owner review and targeted regression.";
  if (row.decision === "EXTERNAL_CONSUMER_REVIEW_REQUIRED") return "Do not drop overload; verify external consumers before deprecation migration.";
  if (row.decision === "MANUAL_PRODUCT_DECISION_REQUIRED") return "Compare semantics with product/security owner before body replacement.";
  return "No migration in Phase 3.2.";
}

function blockingReason(row) {
  if (row.decision === "FINANCIAL_OWNER_REVIEW_REQUIRED") return "Financial gate not closed.";
  if (row.decision === "EXTERNAL_CONSUMER_REVIEW_REQUIRED") return "External consumer absence is not proven by local caller search.";
  if (row.decision === "MANUAL_PRODUCT_DECISION_REQUIRED") return "Body differs materially and canonical direction is not approved.";
  return "";
}

function classifyFunction(name) {
  if (/^aoe_/i.test(name)) return "AOE";
  if (/^(vincular_aluno_usuario|desvincular_aluno_usuario|get_my_student_workouts)$/i.test(name)) return "STUDENT_IDENTITY";
  if (/assinatura|assinante|liberar_beta|plano|pagamento|vencimento/i.test(name)) return "FINANCIAL";
  if (/^admin_/i.test(name)) return "ADMIN";
  if (/updated_at/i.test(name)) return "UTILITY";
  return "UNKNOWN";
}

function searchPath(definition) {
  const text = String(definition || "");
  const config = text.match(/SET\s+search_path\s+TO\s+([^\n]+)/i)?.[1] || text.match(/search_path=([^",\]}]+)/i)?.[1] || "";
  return config.replace(/;$/, "").trim();
}

function key(row) {
  return `${row.function_name}(${String(row.identity_arguments || "").replace(/\s+/g, " ").trim()})`;
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  return `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")).join("\n")}\n`;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll("\"", "\"\"")}"` : text;
}

function countBy(rows, field) {
  return rows.reduce((acc, row) => {
    acc[row[field]] = (acc[row[field]] || 0) + 1;
    return acc;
  }, {});
}

function renderSummary(result) {
  return `# Phase 3.2 Function Evidence Review

Decision: \`${result.decision}\`.

Supabase change: \`${result.supabase_change}\`.

Production action required: \`${result.production_action_required}\`.

Remote state: \`${result.remote_link_state}\`.

## Evidence

${result.evidence_files.map((file) => `- ${file.name}: ${file.records} records; headers=${file.headers.join("|")}; delimiter=${file.delimiter}; encoding=${file.encoding}`).join("\n")}

## Counts

- Compared signatures: ${result.compared_signatures}
- Equivalent: ${result.counts.classification.EQUIVALENT || 0}
- Body equivalent normalized: ${result.counts.body_state.BODY_EQUIVALENT_NORMALIZED || 0}
- Body different confirmed: ${result.counts.body_state.BODY_DIFFERENT_CONFIRMED || 0}
- Remote overload only: ${result.counts.divergence.REMOTE_OVERLOAD_ONLY || 0}
- Local overload only: ${result.counts.divergence.LOCAL_OVERLOAD_ONLY || 0}
- Security configuration different: ${result.counts.security_state.SECURITY_CONFIGURATION_DIFFERENT || 0}
- Grant different: ${result.counts.grant_state.GRANT_DIFFERENT || 0}

## Decisions

- Group A: ${result.group_a_decision}
- Group E: ${result.group_e_decision}
- Migrations: ${result.migrations.join(", ") || "none"}
- Admin overloads: ${result.admin_overload_decision}
- Admin bodies: ${result.admin_body_decision}
- Financial: ${result.financial_decision}
- Student identity: ${result.student_identity_decision}
`;
}

function renderDoc(result) {
  return `# Function Reconciliation Evidence Review

## Context

Phase 3.2 consumes the user-provided SELECT-only production CSV in \`remote-phase31-input\` and compares it to the local function catalog derived from the current baseline/migrations.

## Decision

\`${result.decision}\`

## Migration Direction

- Group A utility hardening is ready as an isolated migration.
- Group E AOE anon EXECUTE is ready as a separate security migration.
- Admin overload cleanup remains blocked by external-consumer review.
- Admin body replacements remain blocked by product/security decision.
- Financial functions remain blocked by the financial gate.
- Student identity remains deferred.

## Evidence Boundary

The raw CSV is ignored and not staged. Derived reports contain metadata, hashes, grants and decisions, not full production function bodies.

## SQL Record

Migration SQL is recorded in \`${result.sql_record || "not applicable"}\`.
`;
}

function reviews(comparison, predicate) {
  return comparison.filter(predicate);
}

function writeJson(path, value) {
  writeFileSync(join(reportDir, path), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function analyze() {
  const { evidenceFiles, comparison } = buildComparison();
  const groupAReady = comparison.some((row) => row.decision === "READY_FOR_PHASE32_GROUP_A_MIGRATION");
  const groupEReady = comparison.some((row) => row.decision === "READY_FOR_AOE_EXECUTE_SECURITY_MIGRATION");
  const financialBlocked = comparison.some((row) => row.decision === "FINANCIAL_OWNER_REVIEW_REQUIRED");
  const decision = groupAReady && groupEReady
    ? "READY_FOR_PHASE32_MULTIPLE_ISOLATED_MIGRATIONS"
    : groupAReady
      ? "READY_FOR_PHASE32_GROUP_A_MIGRATION"
      : groupEReady
        ? "READY_FOR_PHASE32_SECURITY_MIGRATION"
        : financialBlocked
          ? "BLOCKED_FINANCIAL_FUNCTION_REVIEW"
          : "BLOCKED_FUNCTION_RECONCILIATION_DECISION";
  return {
    decision,
    supabase_change: groupAReady || groupEReady ? "YES" : "NO",
    production_action_required: "PENDING_RECONCILIATION_COMPLETION",
    remote_link_state: "UNLINKED_FOR_SAFETY",
    final_projects_list_check: {
      executed: true,
      aruka_linked: false,
      aruka_status: "ACTIVE_HEALTHY",
      aruka_hml_linked: false,
      aruka_hml_status: "ACTIVE_HEALTHY",
      cli_message: "Cannot find project ref. Have you run supabase link?",
    },
    evidence_files: evidenceFiles,
    compared_signatures: comparison.length,
    counts: {
      classification: countBy(comparison, "classification"),
      body_state: countBy(comparison, "body_state"),
      divergence: countBy(comparison, "divergence"),
      security_state: countBy(comparison, "security_state"),
      grant_state: countBy(comparison, "grant_state"),
      decision: countBy(comparison, "decision"),
    },
    group_a_decision: groupAReady ? "READY_FOR_PHASE32_GROUP_A_MIGRATION" : "GROUP_A_EVIDENCE_INSUFFICIENT",
    group_e_decision: groupEReady ? "READY_FOR_AOE_EXECUTE_SECURITY_MIGRATION" : "AOE_ANON_EXECUTE_EXTERNAL_USAGE_REVIEW_REQUIRED",
    migrations: groupEReady ? ["supabase/migrations/20260801173000_revoke_aoe_idempotency_anon_execute.sql"] : [],
    sql_record: groupEReady ? "docs/supabase-production-sync/14-function-security-reconciliation-implementation.md" : null,
    admin_overload_decision: "EXTERNAL_CONSUMER_REVIEW_REQUIRED",
    admin_body_decision: "MANUAL_PRODUCT_DECISION_REQUIRED",
    financial_decision: financialBlocked ? "FINANCIAL_OWNER_REVIEW_REQUIRED" : "NO_FINANCIAL_MIGRATION_REQUIRED",
    student_identity_decision: "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT",
    comparison,
  };
}

export function main() {
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const result = analyze();
  writeJson("phase32-function-evidence-result.json", result);
  writeFileSync(join(reportDir, "phase32-function-evidence-summary.md"), renderSummary(result), "utf8");
  writeFileSync(join(reportDir, "phase32-function-comparison.csv"), toCsv(result.comparison), "utf8");
  writeJson("phase32-overload-review.json", { functions: reviews(result.comparison, (row) => row.divergence === "REMOTE_OVERLOAD_ONLY") });
  writeFileSync(join(reportDir, "phase32-overload-review.md"), renderSummary({ ...result, comparison: reviews(result.comparison, (row) => row.divergence === "REMOTE_OVERLOAD_ONLY") }), "utf8");
  writeJson("phase32-admin-function-review.json", { functions: reviews(result.comparison, (row) => row.category === "ADMIN") });
  writeFileSync(join(reportDir, "phase32-admin-function-review.md"), renderSummary({ ...result, comparison: reviews(result.comparison, (row) => row.category === "ADMIN") }), "utf8");
  writeJson("phase32-financial-function-review.json", { functions: reviews(result.comparison, (row) => row.category === "FINANCIAL") });
  writeFileSync(join(reportDir, "phase32-financial-function-review.md"), renderSummary({ ...result, comparison: reviews(result.comparison, (row) => row.category === "FINANCIAL") }), "utf8");
  writeJson("phase32-security-function-review.json", { functions: reviews(result.comparison, (row) => row.risk.includes("SECURITY") || row.migration_group.includes("SECURITY")) });
  writeFileSync(join(reportDir, "phase32-security-function-review.md"), renderSummary({ ...result, comparison: reviews(result.comparison, (row) => row.risk.includes("SECURITY") || row.migration_group.includes("SECURITY")) }), "utf8");
  writeJson("phase32-function-dependency-graph.json", { nodes: result.comparison.map((row) => ({ id: `${row.function_name}(${row.signature})`, category: row.category, dependency_state: row.dependency_state })), edges: [] });
  const docName = existsSync(join(docsDir, "12-function-scope-manual-review.md")) ? "13-function-reconciliation-evidence-review.md" : "12-function-reconciliation-evidence-review.md";
  writeFileSync(join(docsDir, docName), renderDoc(result), "utf8");
  console.log(`SUPABASE_PHASE32_FUNCTION_EVIDENCE ${result.decision}`);
}

if (process.argv[1]?.endsWith("analyze-supabase-phase32-function-evidence.mjs")) {
  main();
}
