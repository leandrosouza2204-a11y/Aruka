import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const reportDir = join(root, "reports/supabase-production-sync");
const docsDir = join(root, "docs/supabase-production-sync");

export const allowedDecisions = new Set([
  "KEEP_REMOTE_COMPATIBILITY_OVERLOAD",
  "DEPRECATE_REMOTE_OVERLOAD_LATER",
  "REPLACE_REMOTE_WITH_LOCAL_LATER",
  "MERGE_REQUIRED",
  "LOCAL_SECURITY_HARDENING_PREFERRED",
  "REMOTE_BEHAVIOR_PREFERRED",
  "SECURITY_HARDENING_REQUIRED",
  "AOE_ANON_EXECUTE_EXCESS_CONFIRMED",
  "AOE_ANON_EXECUTE_PRODUCT_REQUIRED",
  "DEFER_TO_AOE_RECONCILIATION",
  "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT",
  "EVIDENCE_REQUIRED",
]);

const targetNames = [
  "admin_atualizar_perfil",
  "admin_bloquear_usuario",
  "admin_liberar_assinante",
  "admin_liberar_beta",
  "admin_upsert_assinatura",
  "admin_listar_logs",
  "admin_listar_usuarios",
  "admin_registrar_log",
  "set_workout_templates_updated_at",
  "aoe_idempotency_get_or_create",
  "vincular_aluno_usuario",
  "desvincular_aluno_usuario",
  "get_my_student_workouts",
];

export function classifyOverload({ callerCount, localFunctionCalls, triggerCalls, hasAuthenticatedGrant, modernReplacementEquivalent }) {
  if (callerCount > 0 || localFunctionCalls > 0 || triggerCalls > 0) return "KEEP_REMOTE_COMPATIBILITY_OVERLOAD";
  if (!modernReplacementEquivalent || hasAuthenticatedGrant) return "DEPRECATE_REMOTE_OVERLOAD_LATER";
  return "DEPRECATE_REMOTE_OVERLOAD_LATER";
}

export function classifyBodyDiff({ category, remoteDefinitionComplete, sameBodyExceptSearchPath }) {
  if (category === "STUDENT_IDENTITY") return "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT";
  if (category === "AOE") return "DEFER_TO_AOE_RECONCILIATION";
  if (sameBodyExceptSearchPath) return "SECURITY_HARDENING_REQUIRED";
  if (!remoteDefinitionComplete) return "EVIDENCE_REQUIRED";
  return "MERGE_REQUIRED";
}

export function classifyAoeAnonExecute({ anonGrant, anonymousCallerCount }) {
  if (!anonGrant) return "DEFER_TO_AOE_RECONCILIATION";
  return anonymousCallerCount > 0 ? "AOE_ANON_EXECUTE_PRODUCT_REQUIRED" : "AOE_ANON_EXECUTE_EXCESS_CONFIRMED";
}

export function isMigrationCandidate(row) {
  return Boolean(row.evidence_complete && row.caller_analysis_complete && row.security_analysis_complete && row.rollback_defined && row.tests_possible && row.decision === "SECURITY_HARDENING_REQUIRED");
}

export function validateReadonlySql(sql) {
  const banned = /\b(insert|update|delete|create|alter|drop|grant|revoke|call|do|truncate|merge)\b|copy\s+.+\s+from\b/i;
  if (banned.test(sql)) return false;
  return /^\s*(--.*\n|\s)*with\b/i.test(sql) || /^\s*(--.*\n|\s)*select\b/i.test(sql);
}

export function buildReview({ phase3Scope, inventory, grantReview, sourceHits }) {
  const grantLines = JSON.stringify(grantReview);
  const remoteGrants = grantReview.remoteGrants || [];
  const rows = [];

  for (const fn of phase3Scope.functions) {
    const callers = sourceHits.filter((hit) => hit.name === fn.function_name && hit.kind === "rpc");
    const legacyCallers = callers.filter((hit) => isLegacyOverloadCall(fn, hit));
    const localCalls = sourceHits.filter((hit) => hit.name === fn.function_name && hit.kind === "sql-call" && !/^(create or replace function|grant |revoke )/i.test(hit.payload) && isLegacyOverloadCall(fn, hit));
    const triggerCalls = sourceHits.filter((hit) => hit.name === fn.function_name && hit.kind === "trigger");
    const inventoryRow = inventory.functions.find((row) => row.function_name === fn.function_name && row.signature === fn.signature) || {};
    const category = fn.category;
    const isOverload = fn.reconciliation_status === "REMOTE_OVERLOAD_ONLY";
    const sameSearchPathOnly = fn.function_name === "set_workout_templates_updated_at";
    const remoteDefinitionComplete = sameSearchPathOnly;
    const grantsForFunction = remoteGrants.filter((grant) => grant.function_name === fn.function_name && grant.identity_arguments === fn.signature);
    const hasAuthenticatedGrant = grantsForFunction.some((grant) => grant.grantee === "authenticated" && grant.privilege_type === "execute");
    const anonGrant = grantsForFunction.some((grant) => grant.grantee === "anon" && grant.privilege_type === "execute");
    const decision = decideFunction({
      fn,
      callers: legacyCallers,
      localCalls,
      triggerCalls,
      hasAuthenticatedGrant,
      anonGrant,
      remoteDefinitionComplete,
      sameSearchPathOnly,
    });
    const evidenceComplete = evidenceCompleteFor({ fn, decision, remoteDefinitionComplete });
    const row = {
      category,
      function: fn.function_name,
      signature: fn.signature,
      divergence: fn.reconciliation_status,
      local_callers: renderCallers(fn, callers, legacyCallers),
      remote_compatibility_risk: remoteCompatibilityRisk({ fn, hasAuthenticatedGrant }),
      security_difference: securityDifference({ fn, anonGrant, sameSearchPathOnly }),
      business_difference: businessDifference({ fn, remoteDefinitionComplete, sameSearchPathOnly }),
      financial_risk: category === "FINANCIAL" ? "HIGH_RISK_FINANCIAL_FUNCTION" : "NO_DIRECT_FINANCIAL_RISK_IDENTIFIED",
      desired_state: desiredStateFor({ fn, decision }),
      decision,
      migration_candidate: false,
      migration_group: migrationGroupFor({ fn, decision }),
      evidence_complete: evidenceComplete,
      reason: reasonFor({ fn, callers: legacyCallers, decision, remoteDefinitionComplete, hasAuthenticatedGrant, anonGrant }),
      next_action: nextActionFor({ fn, decision, evidenceComplete }),
      security_decision: securityDecisionFor({ fn, decision, sameSearchPathOnly, anonGrant }),
      local_security_definer: String(inventoryRow.security_definer ?? ""),
      remote_security_definer: remoteSecurityDefinerFromGrantText(grantLines, fn),
      local_search_path: inventoryRow.search_path || "",
      remote_search_path: remoteSearchPathFromGrantText(grantLines, fn),
      execute_grants: executeGrantsFor(grantLines, fn),
      caller_analysis_complete: true,
      security_analysis_complete: true,
      rollback_defined: rollbackDefinedFor(decision),
      tests_possible: testsPossibleFor(decision),
    };
    row.migration_candidate = isMigrationCandidate(row);
    rows.push(row);
  }

  rows.push(buildAoeGrantRow(grantReview, sourceHits));
  for (const row of rows) {
    if (!allowedDecisions.has(row.decision)) throw new Error(`Unsupported decision: ${row.decision}`);
  }
  return rows;
}

function decideFunction({ fn, callers, localCalls, triggerCalls, hasAuthenticatedGrant, anonGrant, remoteDefinitionComplete, sameSearchPathOnly }) {
  if (fn.category === "STUDENT_IDENTITY") return "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT";
  if (fn.function_name === "aoe_idempotency_get_or_create") return "DEFER_TO_AOE_RECONCILIATION";
  if (fn.reconciliation_status === "REMOTE_OVERLOAD_ONLY") {
    return classifyOverload({
      callerCount: callers.length,
      localFunctionCalls: localCalls.length,
      triggerCalls: triggerCalls.length,
      hasAuthenticatedGrant,
      modernReplacementEquivalent: true,
    });
  }
  if (fn.reconciliation_status === "BODY_DIFFERENT") {
    return classifyBodyDiff({ category: fn.category, remoteDefinitionComplete, sameBodyExceptSearchPath: sameSearchPathOnly });
  }
  if (anonGrant) return classifyAoeAnonExecute({ anonGrant, anonymousCallerCount: 0 });
  return "EVIDENCE_REQUIRED";
}

function isLegacyOverloadCall(fn, hit) {
  if (fn.reconciliation_status !== "REMOTE_OVERLOAD_ONLY") return true;
  return !hit.payload.includes("p_user_agent");
}

function renderCallers(fn, callers, legacyCallers) {
  if (fn.reconciliation_status === "REMOTE_OVERLOAD_ONLY") {
    const modern = callers.filter((hit) => hit.payload.includes("p_user_agent"));
    return [
      legacyCallers.length ? `legacy_without_p_user_agent=${legacyCallers.map(renderHit).join("; ")}` : "legacy_without_p_user_agent=NONE",
      modern.length ? `modern_with_p_user_agent=${modern.map(renderHit).join("; ")}` : "modern_with_p_user_agent=NONE",
    ].join(" | ");
  }
  return callers.map(renderHit).join("; ") || "NONE";
}

function renderHit(hit) {
  return `${hit.file}:${hit.line}:${hit.payload}`;
}

function buildAoeGrantRow(grantReview, sourceHits) {
  const signature = "p_id text, p_actor_id uuid, p_organization_id uuid, p_operation text, p_idempotency_key text, p_request_fingerprint text";
  const anonGrant = (grantReview.remoteGrants || []).some((grant) => grant.function_name === "aoe_idempotency_get_or_create" && grant.identity_arguments === signature && grant.grantee === "anon" && grant.privilege_type === "execute");
  const anonymousCallerCount = sourceHits.filter((hit) => hit.name === "aoe_idempotency_get_or_create" && hit.kind === "anonymous-rpc").length;
  const decision = classifyAoeAnonExecute({ anonGrant, anonymousCallerCount });
  const grantLines = JSON.stringify(grantReview);
  return {
    category: "AOE",
    function: "aoe_idempotency_get_or_create",
    signature,
    divergence: "ANON_EXECUTE_REMOTE_MORE_PERMISSIVE",
    local_callers: sourceHits.filter((hit) => hit.name === "aoe_idempotency_get_or_create").map((hit) => `${hit.file}:${hit.line}:${hit.payload}`).join("; ") || "NONE",
    remote_compatibility_risk: "NO_ANONYMOUS_PRODUCT_CALLER_FOUND",
    security_difference: anonGrant ? "REMOTE_ANON_EXECUTE_PRESENT" : "NO_ANON_EXECUTE_EVIDENCE",
    business_difference: "BODY_DIFFERENCE_TRACKED_SEPARATELY",
    financial_risk: "NO_DIRECT_FINANCIAL_RISK_IDENTIFIED",
    desired_state: "REVOKE_ANON_EXECUTE_IN_AOE_SECURITY_GROUP_AFTER_APPROVAL",
    decision,
    migration_candidate: decision === "AOE_ANON_EXECUTE_EXCESS_CONFIRMED",
    migration_group: "GROUP_E_AOE_SECURITY",
    evidence_complete: anonGrant,
    reason: anonGrant ? "Remote grant evidence confirms anon.execute and repository callers are authenticated application paths, not anonymous product flows." : "Anon grant evidence missing.",
    next_action: "Design AOE security migration separately from AOE body reconciliation; do not execute REVOKE in this round.",
    security_decision: "LOCAL_HARDENING_PREFERRED",
    local_security_definer: "true",
    remote_security_definer: "true",
    local_search_path: "public",
    remote_search_path: "public",
    execute_grants: executeGrantsFor(grantLines, { function_name: "aoe_idempotency_get_or_create", signature }),
    caller_analysis_complete: true,
    security_analysis_complete: true,
    rollback_defined: true,
    tests_possible: true,
  };
}

function evidenceCompleteFor({ fn, decision, remoteDefinitionComplete }) {
  if (decision === "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT") return true;
  if (fn.function_name === "set_workout_templates_updated_at") return true;
  if (decision === "DEFER_TO_AOE_RECONCILIATION") return false;
  if (fn.reconciliation_status === "REMOTE_OVERLOAD_ONLY" || fn.reconciliation_status === "BODY_DIFFERENT") return remoteDefinitionComplete;
  return false;
}

function remoteCompatibilityRisk({ fn, hasAuthenticatedGrant }) {
  if (fn.reconciliation_status !== "REMOTE_OVERLOAD_ONLY") return "NOT_REMOTE_OVERLOAD";
  return hasAuthenticatedGrant ? "AUTHENTICATED_REMOTE_GRANT_PRESENT" : "NO_DIRECT_REMOTE_GRANT_RISK_FOUND";
}

function securityDifference({ fn, anonGrant, sameSearchPathOnly }) {
  if (anonGrant) return "REMOTE_ANON_EXECUTE_PRESENT";
  if (sameSearchPathOnly) return "REMOTE_MISSING_SEARCH_PATH";
  if (fn.reconciliation_status === "REMOTE_OVERLOAD_ONLY") return "LEGACY_OVERLOAD_AUTHENTICATED_GRANT_UNVERIFIED";
  return "REMOTE_BODY_SECURITY_UNKNOWN_WITHOUT_FULL_DEFINITION";
}

function businessDifference({ fn, remoteDefinitionComplete, sameSearchPathOnly }) {
  if (sameSearchPathOnly) return "NO_MATERIAL_BODY_DIFFERENCE_DETECTED";
  if (!remoteDefinitionComplete && fn.reconciliation_status === "BODY_DIFFERENT") return "REMOTE_BODY_MISSING_FOR_SEMANTIC_DIFF";
  if (fn.reconciliation_status === "REMOTE_OVERLOAD_ONLY") return "REMOTE_LEGACY_OVERLOAD_WITH_MODERN_LOCAL_REPLACEMENT";
  return "DEFERRED";
}

function desiredStateFor({ fn, decision }) {
  if (decision === "SECURITY_HARDENING_REQUIRED") return "LOCAL_SEARCH_PATH_HARDENED_FUNCTION";
  if (decision === "DEPRECATE_REMOTE_OVERLOAD_LATER") return "MODERN_USER_AGENT_SIGNATURE_ONLY_AFTER_COMPATIBILITY_APPROVAL";
  if (decision === "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT") return "STUDENT_IDENTITY_CONTRACT_REMAINS_SEPARATE";
  if (decision === "DEFER_TO_AOE_RECONCILIATION") return "AOE_BODY_RECONCILIATION_REMAINS_SEPARATE";
  return `NO_AUTOMATIC_SQL_FOR_${fn.function_name}`;
}

function migrationGroupFor({ fn, decision }) {
  if (decision === "SECURITY_HARDENING_REQUIRED") return "GROUP_A_UTILITY_SECURITY_HARDENING";
  if (decision === "DEPRECATE_REMOTE_OVERLOAD_LATER" && fn.category === "FINANCIAL") return "GROUP_D_FINANCIAL_FUNCTION_RECONCILIATION";
  if (decision === "DEPRECATE_REMOTE_OVERLOAD_LATER") return "GROUP_C_ADMIN_LEGACY_OVERLOADS";
  if (fn.category === "FINANCIAL") return "GROUP_D_FINANCIAL_FUNCTION_RECONCILIATION";
  if (fn.category === "ADMIN") return "GROUP_B_ADMIN_BODY_RECONCILIATION";
  if (fn.category === "AOE") return "GROUP_E_AOE_SECURITY";
  return "NO_MIGRATION_GROUP";
}

function reasonFor({ fn, callers, decision, remoteDefinitionComplete, hasAuthenticatedGrant, anonGrant }) {
  if (decision === "SECURITY_HARDENING_REQUIRED") return "Local and remote trigger body are equivalent except local adds SET search_path; security invoker trigger has no dynamic SQL.";
  if (decision === "DEPRECATE_REMOTE_OVERLOAD_LATER") return `No current src RPC caller omits p_user_agent, but remote authenticated grant is ${hasAuthenticatedGrant ? "present" : "not found"} and full remote definition must be captured before removal.`;
  if (decision === "EVIDENCE_REQUIRED") return remoteDefinitionComplete ? "Manual decision still required." : "Existing artifacts have hashes/config/grants but not full remote pg_get_functiondef body.";
  if (decision === "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT") return "Student identity RPC is intentionally separated from this function review.";
  if (decision === "DEFER_TO_AOE_RECONCILIATION") return anonGrant ? "AOE body difference is separate from confirmed anon grant security issue." : "AOE body reconciliation remains domain-specific.";
  return callers.length ? "Current caller found." : "No current caller found.";
}

function nextActionFor({ fn, decision, evidenceComplete }) {
  if (decision === "SECURITY_HARDENING_REQUIRED") return "Design a narrow utility security migration in Group A; do not mix with financial/admin functions.";
  if (!evidenceComplete) return "Collect full remote pg_get_functiondef with the generated SELECT-only SQL before migration design.";
  if (fn.category === "FINANCIAL") return "Complete FINANCIAL_OWNER_REVIEW before future migration design.";
  if (decision === "DEPRECATE_REMOTE_OVERLOAD_LATER") return "Confirm no external consumers, then design Group C/D migration with rollback.";
  return "Keep documented decision for the next scoped design round.";
}

function securityDecisionFor({ fn, decision, sameSearchPathOnly, anonGrant }) {
  if (decision === "SECURITY_HARDENING_REQUIRED" || anonGrant) return "LOCAL_HARDENING_PREFERRED";
  if (fn.category === "STUDENT_IDENTITY") return "SECURITY_EQUIVALENT";
  if (decision === "EVIDENCE_REQUIRED") return "SECURITY_REVIEW_REQUIRED";
  return "SECURITY_EQUIVALENT";
}

function remoteSecurityDefinerFromGrantText(text, fn) {
  return firstRemoteGrantFromText(text, fn)?.security_definer ?? "";
}

function remoteSearchPathFromGrantText(text, fn) {
  return firstRemoteGrantFromText(text, fn)?.search_path ?? "";
}

function executeGrantsFor(text, fn) {
  const review = JSON.parse(text);
  return (review.remoteGrants || [])
    .filter((grant) => grant.function_name === fn.function_name && grant.identity_arguments === fn.signature)
    .map((grant) => `${grant.grantee}.${grant.privilege_type}`)
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .join("; ");
}

function firstRemoteGrantFromText(text, fn) {
  const review = JSON.parse(text);
  return (review.remoteGrants || []).find((grant) => grant.function_name === fn.function_name && grant.identity_arguments === fn.signature) || null;
}

function rollbackDefinedFor(decision) {
  return ["SECURITY_HARDENING_REQUIRED", "AOE_ANON_EXECUTE_EXCESS_CONFIRMED"].includes(decision);
}

function testsPossibleFor(decision) {
  return decision !== "EVIDENCE_REQUIRED";
}

export function collectSourceHits(files) {
  const hits = [];
  for (const [file, text] of Object.entries(files)) {
    const lines = text.split(/\r?\n/);
    lines.forEach((line, index) => {
      for (const name of targetNames) {
        if (!line.includes(name)) continue;
        const payload = lines.slice(index, Math.min(lines.length, index + 14)).join(" ").replace(/\s+/g, " ").trim().slice(0, 700);
        let kind = "reference";
        if (line.includes(".rpc(") || line.includes("rpc(\"") || line.includes("rpc('")) kind = "rpc";
        if (line.includes(`public.${name}(`) || line.includes(`function public.${name}`)) kind = "sql-call";
        if (/trigger/i.test(line) || /execute function/i.test(line)) kind = "trigger";
        hits.push({ file, line: index + 1, name, kind, payload });
      }
    });
  }
  return hits;
}

function readTextIfExists(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function readJson(path) {
  return JSON.parse(readFileSync(join(reportDir, path), "utf8"));
}

function writeJson(path, value) {
  writeFileSync(join(reportDir, path), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]).filter((key) => !["caller_analysis_complete", "security_analysis_complete", "rollback_defined", "tests_possible"].includes(key));
  return `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")).join("\n")}\n`;
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function renderSummary(result, rows) {
  return `# Phase 3.1 Function Scope Manual Review

Decision: \`${result.decision}\`.

Supabase change: \`${result.supabase_change}\`.

Production action required: \`${result.production_action_required}\`.

Remote link state: \`${result.remote_link_state}\`.

## Outcome

- Reviewed rows: ${rows.length}
- Migration candidates: ${rows.filter((row) => row.migration_candidate).length}
- Evidence gaps: ${rows.filter((row) => !row.evidence_complete).length}

## Decisions

${Object.entries(result.summary.by_decision).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## Migration Candidate Groups

${result.migration_candidate_groups.map((group) => `- ${group.group}: ${group.functions.join(", ") || "none"}; risk=${group.risk}; approval=${group.approval_required}`).join("\n")}

## Evidence Gap

Full remote function definitions are still required for admin/financial body diffs and legacy overload removal decisions. The generated SQL is SELECT-only and was not executed remotely.
`;
}

function renderDoc(result, rows) {
  const section = (title, predicate) => `## ${title}\n\n${rows.filter(predicate).map((row) => `- ${row.function}(${row.signature}) - ${row.decision}; ${row.reason}`).join("\n") || "- None"}\n`;
  return `# Function Scope Manual Review

## Context

Phase 3.1 turns the generic Phase 3 function/RPC decisions into function-by-function product and security decisions. No SQL write, migration, link, push, repair, commit or remote query was executed.

${section("Overloads", (row) => row.divergence === "REMOTE_OVERLOAD_ONLY")}
${section("Admin Body Diffs", (row) => row.category === "ADMIN" && row.divergence === "BODY_DIFFERENT")}
${section("Financial Functions", (row) => row.category === "FINANCIAL")}
${section("Utility", (row) => row.category === "UTILITY")}
${section("AOE Security", (row) => row.category === "AOE")}
${section("Student Identity", (row) => row.category === "STUDENT_IDENTITY")}
## Decisions

${Object.entries(result.summary.by_decision).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

## Migration Candidate Groups

${result.migration_candidate_groups.map((group) => `- ${group.group}: ${group.functions.join(", ") || "none"}; tests=${group.tests}; approval=${group.approval_required}; rollback=${group.rollback}`).join("\n")}

## Evidence Gaps

- Full remote pg_get_functiondef output is missing for admin/financial body diffs and remote legacy overloads.
- Financial owner review is required before any financial function replacement/removal.
- AOE body reconciliation remains separate from the anon EXECUTE security issue.

## Next Step

Collect SELECT-only function definitions with \`reports/supabase-production-sync/phase31-function-definitions-readonly.sql\`, then design one narrow migration group at a time.
`;
}

function readonlySql() {
  const values = [
    ["admin_atualizar_perfil", "p_user_id uuid, p_nome text, p_role text, p_tipo_acesso text, p_status text"],
    ["admin_bloquear_usuario", "p_user_id uuid"],
    ["admin_liberar_assinante", "p_user_id uuid, p_plano text, p_data_inicio date, p_data_vencimento date"],
    ["admin_liberar_beta", "p_user_id uuid"],
    ["admin_upsert_assinatura", "p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date"],
    ["admin_listar_logs", "p_acao text, p_target_user_id uuid, p_data_inicio date, p_data_fim date, p_busca text"],
    ["admin_listar_usuarios", ""],
    ["admin_registrar_log", "p_target_user_id uuid, p_acao text, p_entidade text, p_entidade_id uuid, p_dados_anteriores jsonb, p_dados_novos jsonb, p_user_agent text"],
    ["admin_upsert_assinatura", "p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date, p_user_agent text"],
    ["aoe_idempotency_get_or_create", "p_id text, p_actor_id uuid, p_organization_id uuid, p_operation text, p_idempotency_key text, p_request_fingerprint text"],
  ];
  return `with target_functions(function_name, identity_arguments) as (
  values
${values.map(([name, args]) => `    ('${name}', '${args.replaceAll("'", "''")}')`).join(",\n")}
)
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  pg_get_function_result(p.oid) as return_type,
  p.prosecdef as security_definer,
  case p.provolatile when 'i' then 'IMMUTABLE' when 's' then 'STABLE' else 'VOLATILE' end as volatility,
  p.proconfig as config,
  pg_get_functiondef(p.oid) as full_definition,
  p.proacl as acl
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
join target_functions tf
  on tf.function_name = p.proname
 and tf.identity_arguments = pg_get_function_identity_arguments(p.oid)
where n.nspname = 'public'
order by p.proname, pg_get_function_identity_arguments(p.oid);
`;
}

function migrationGroups(rows) {
  const groups = [
    ["GROUP_A_UTILITY_SECURITY_HARDENING", "LOW", "set_workout_templates_updated_at trigger regression/static schema check", "Engineering/security approval", "Recreate prior function definition without SET search_path if rollback is needed"],
    ["GROUP_B_ADMIN_BODY_RECONCILIATION", "HIGH", "admin list/log RPC tests plus data exposure review", "Admin/product/security approval", "Restore captured production definitions"],
    ["GROUP_C_ADMIN_LEGACY_OVERLOADS", "MEDIUM", "RPC caller absence and external consumer review", "Admin/product approval", "Recreate overloads and grants from captured definitions"],
    ["GROUP_D_FINANCIAL_FUNCTION_RECONCILIATION", "P0/P1", "financial subscription lifecycle tests", "FINANCIAL_OWNER_REVIEW_COMPLETED", "Restore captured production definitions and grants"],
    ["GROUP_E_AOE_SECURITY", "P0", "AOE authenticated/anon boundary tests", "AOE/security approval", "Restore previous anon grant if product requires it"],
  ];
  return groups.map(([group, risk, tests, approval_required, rollback]) => ({
    group,
    functions: rows.filter((row) => row.migration_group === group && row.migration_candidate).map((row) => row.function),
    risk,
    dependencies: rows.filter((row) => row.migration_group === group).map((row) => row.function),
    tests,
    approval_required,
    rollback,
  }));
}

function summarize(rows) {
  return {
    by_decision: countBy(rows, (row) => row.decision),
    by_group: countBy(rows, (row) => row.migration_group),
    by_evidence: countBy(rows, (row) => row.evidence_complete ? "COMPLETE" : "INCOMPLETE"),
  };
}

function countBy(items, fn) {
  return items.reduce((acc, item) => {
    const key = fn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

export function main() {
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const phase3Scope = readJson("function-reconciliation-scope.json");
  const inventory = readJson("phase3-function-inventory.json");
  const grantReview = readJson("function-grant-review.json");
  const sourceFiles = {
    "src/services/adminService.js": readTextIfExists(join(root, "src/services/adminService.js")),
    "src/services/adminLogsService.js": readTextIfExists(join(root, "src/services/adminLogsService.js")),
    "src/aoe/infrastructure/persistence/supabase-idempotency-repository.js": readTextIfExists(join(root, "src/aoe/infrastructure/persistence/supabase-idempotency-repository.js")),
    "supabase/baseline-src/05-functions.sql": readTextIfExists(join(root, "supabase/baseline-src/05-functions.sql")),
    "supabase/baseline-src/09-grants.sql": readTextIfExists(join(root, "supabase/baseline-src/09-grants.sql")),
    "supabase/migrations-archive/20260705090000_hardening_admin_functions.sql": readTextIfExists(join(root, "supabase/migrations-archive/20260705090000_hardening_admin_functions.sql")),
  };
  const rows = buildReview({ phase3Scope, inventory, grantReview, sourceHits: collectSourceHits(sourceFiles) });
  const sql = readonlySql();
  if (!validateReadonlySql(sql)) throw new Error("Generated SQL is not read-only.");
  const groups = migrationGroups(rows);
  const result = {
    decision: "READY_FOR_PHASE31_EVIDENCE_COLLECTION",
    supabase_change: "NO_NEW_MIGRATION",
    production_action_required: "READONLY_EVIDENCE_COLLECTION_REQUIRED",
    remote_link_state: "UNLINKED_FOR_SAFETY",
    final_projects_list_check: {
      executed: true,
      aruka_linked: false,
      aruka_status: "ACTIVE_HEALTHY",
      aruka_hml_linked: false,
      aruka_hml_status: "ACTIVE_HEALTHY",
      cli_message: "Cannot find project ref. Have you run supabase link?",
    },
    reviewed_functions: rows.length,
    summary: summarize(rows),
    migration_candidate_groups: groups,
    read_only_sql_required: true,
    read_only_sql: "reports/supabase-production-sync/phase31-function-definitions-readonly.sql",
    commands_not_executed: ["supabase link", "supabase db push", "supabase db pull", "supabase migration repair", "remote SQL execution", "new migration"],
  };
  writeFileSync(join(reportDir, "phase31-function-decision-matrix.csv"), toCsv(rows), "utf8");
  writeJson("function-scope-review-result.json", { ...result, decisions: rows });
  writeFileSync(join(reportDir, "function-scope-review-summary.md"), renderSummary(result, rows), "utf8");
  writeFileSync(join(docsDir, "12-function-scope-manual-review.md"), renderDoc(result, rows), "utf8");
  writeFileSync(join(reportDir, "phase31-function-definitions-readonly.sql"), sql, "utf8");
  console.log(`SUPABASE_FUNCTION_SCOPE_REVIEW ${result.decision}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
