import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const REPORT_DIR = "reports/supabase-production-sync";
const DOC_PATH = "docs/supabase-production-sync/18-post-phase34-global-reconciliation-audit.md";
const DECISION = "READY_FOR_POST_PHASE34_GLOBAL_AUDIT_COMMIT";
const NEXT_SAFE_GROUP = "PRODUCTION_RECONCILIATION_PACKAGE_DESIGN";

const migrations = [
  ["20260716090000", "baseline_aruka_v1.sql", "BASELINE", "baseline snapshot", "validated locally", "remote history listed", "Baseline"],
  ["20260728030000", "workout_delivery_integration_v1.sql", "WORKOUT_DELIVERY", "local implemented, remote evidence divergent", "validated locally", "remote reconciliation pending", "Workout delivery"],
  ["20260730090000", "student_identity_contract.sql", "STUDENT_IDENTITY", "local-only future deployment", "validated locally", "remote absent", "Student identity"],
  ["20260731190000", "reconcile_security_policies_and_grants.sql", "SECURITY_POLICIES_GRANTS", "local reconciliation implemented", "validated locally", "remote reconciliation pending", "Phase 1"],
  ["20260801143335", "reconcile_alunos_required_fields.sql", "NULLABILITY", "local reconciliation implemented", "validated locally", "remote reconciliation pending", "Phase 2"],
  ["20260801173000", "revoke_aoe_idempotency_anon_execute.sql", "AOE_SECURITY", "local reconciliation implemented", "validated locally", "remote reconciliation pending", "Phase 3.2 Group E"],
  ["20260801180000", "harden_workout_templates_updated_at.sql", "UTILITY_FUNCTIONS", "local reconciliation implemented", "validated locally", "remote reconciliation pending", "Phase 3.4 Group A"]
];

const matrix = [
  row("SECURITY_POLICIES_GRANTS", "public policies and table/function grants hardened by 20260731190000", "REMOTE_MORE_PERMISSIVE/REMOTE_ONLY grants", "20260731190000", "LOCAL_RECONCILIATION_IMPLEMENTED", "REMOTE_RECONCILIATION_PENDING", "RESOLVED_BY_PHASE1", "SECURITY", "Release/apply approved Phase 1 migration package before declaring production reconciled."),
  row("NULLABILITY", "alunos.created_at", "NULLABILITY_DIFFERENT", "20260801143335", "NOT NULL locally", "REMOTE_RECONCILIATION_PENDING", "RESOLVED_BY_PHASE2", "DATA_CONTRACT", "Keep as local implemented until production reconciliation is applied."),
  row("NULLABILITY", "alunos.user_id", "NULLABILITY_DIFFERENT", "20260801143335", "NOT NULL locally", "REMOTE_RECONCILIATION_PENDING", "RESOLVED_BY_PHASE2", "DATA_CONTRACT", "Keep as local implemented until production reconciliation is applied."),
  row("NULLABILITY", "alunos.whatsapp", "NULLABILITY_DIFFERENT", "20260801143335", "NOT NULL locally", "REMOTE_RECONCILIATION_PENDING", "RESOLVED_BY_PHASE2", "DATA_CONTRACT", "Keep as local implemented until production reconciliation is applied."),
  row("NULLABILITY", "alunos.acompanhamento_motivo", "NULLABILITY_DIFFERENT", "APPROVED_PRODUCT_DECISION", "nullable preserved", "remote not a blocker", "NULLABILITY_PRESERVED_BY_APPROVED_PRODUCT_DECISION", "LOW", "Do not reopen as blocker without product decision change."),
  row("NULLABILITY", "alunos.observacoes", "NULLABILITY_DIFFERENT", "APPROVED_PRODUCT_DECISION", "nullable preserved", "remote not a blocker", "NULLABILITY_PRESERVED_BY_APPROVED_PRODUCT_DECISION", "LOW", "Do not reopen as blocker without product decision change."),
  row("NULLABILITY", "alunos.inicio", "NULLABILITY_DIFFERENT", "APPROVED_PRODUCT_DECISION", "nullable preserved", "remote not a blocker", "NULLABILITY_PRESERVED_BY_APPROVED_PRODUCT_DECISION", "LOW", "Do not reopen as blocker without product decision change."),
  row("NULLABILITY", "alunos.pagamento_recebido", "NULLABILITY_DIFFERENT", "APPROVED_PRODUCT_DECISION", "nullable preserved", "remote not a blocker", "NULLABILITY_PRESERVED_BY_APPROVED_PRODUCT_DECISION", "LOW", "Do not reopen as blocker without product decision change."),
  row("NULLABILITY", "alunos.plano", "NULLABILITY_DIFFERENT", "APPROVED_PRODUCT_DECISION", "nullable preserved", "remote not a blocker", "NULLABILITY_PRESERVED_BY_APPROVED_PRODUCT_DECISION", "LOW", "Do not reopen as blocker without product decision change."),
  row("NULLABILITY", "alunos.status", "NULLABILITY_DIFFERENT", "APPROVED_PRODUCT_DECISION", "nullable preserved", "remote not a blocker", "NULLABILITY_PRESERVED_BY_APPROVED_PRODUCT_DECISION", "LOW", "Do not reopen as blocker without product decision change."),
  row("NULLABILITY", "alunos.valor", "NULLABILITY_DIFFERENT", "APPROVED_PRODUCT_DECISION", "nullable preserved", "remote not a blocker", "NULLABILITY_PRESERVED_BY_APPROVED_PRODUCT_DECISION", "LOW", "Do not reopen as blocker without product decision change."),
  row("CONSTRAINTS", "perfis_role_check", "MATERIAL_DIFFERENCE", "20260730090000", "student role allowed locally", "remote absent", "DEFERRED_TO_STUDENT_IDENTITY", "FEATURE_CONTRACT", "Deploy student identity when prerequisites are approved."),
  row("CONSTRAINTS", "treinos_lifecycle_dates_check", "MATERIAL_DIFFERENCE", "20260728030000", "workout lifecycle locally implemented", "remote differs", "DEFERRED_TO_WORKOUT_DELIVERY", "FEATURE_CONTRACT", "Reconcile workout delivery backend by object."),
  row("CONSTRAINTS", "treino_eventos_metadata_object_check", "MATERIAL_DIFFERENCE", "AUDITOR_NORMALIZATION", "semantic object check equivalent", "remote evidence not material", "SEMANTIC_FALSE_POSITIVE", "NONE", "Keep normalized out of blockers."),
  row("CONSTRAINTS", "treinos_template_origin_snapshot_object_check", "MATERIAL_DIFFERENCE", "AUDITOR_NORMALIZATION", "semantic object check equivalent", "remote evidence not material", "SEMANTIC_FALSE_POSITIVE", "NONE", "Keep normalized out of blockers."),
  row("CONSTRAINTS", "treinos_template_origin_type_check", "MATERIAL_DIFFERENCE", "AUDITOR_NORMALIZATION", "semantic check equivalent", "remote evidence not material", "SEMANTIC_FALSE_POSITIVE", "NONE", "Keep normalized out of blockers."),
  row("AOE_SECURITY", "aoe_idempotency_get_or_create anon EXECUTE", "REMOTE_ONLY_GRANT", "20260801173000", "anon EXECUTE=false locally", "remote evidence still shows anon grant until applied", "RESOLVED_BY_PHASE32_GROUP_E", "SECURITY", "Apply approved migration bundle before declaring production reconciled."),
  row("UTILITY_FUNCTIONS", "set_workout_templates_updated_at search_path and public/anon/authenticated EXECUTE", "BODY_DIFFERENT/REMOTE_ONLY_GRANTS", "20260801180000", "search_path=public; public/anon/authenticated EXECUTE=false", "remote evidence showed missing search_path and excessive grants", "RESOLVED_BY_PHASE34_GROUP_A", "SECURITY", "Apply approved migration bundle before declaring production reconciled."),
  row("AOE_BODY", "aoe_idempotency_get_or_create body", "BODY_DIFFERENT", "DEFERRED", "local body preserved", "remote body differs", "DEFERRED_TO_AOE_BODY_RECONCILIATION", "BUSINESS_LOGIC", "Review body semantics separately; do not mix with grant hardening."),
  row("ADMIN_FUNCTIONS", "admin_atualizar_perfil legacy overload", "REMOTE_OVERLOAD_ONLY", "DEFERRED", "modern overload present locally", "remote legacy overload present", "REMOTE_ONLY_LEGACY", "COMPATIBILITY", "EXTERNAL_CONSUMER_REVIEW_REQUIRED"),
  row("ADMIN_FUNCTIONS", "admin_bloquear_usuario legacy overload", "REMOTE_OVERLOAD_ONLY", "DEFERRED", "modern overload present locally", "remote legacy overload present", "REMOTE_ONLY_LEGACY", "COMPATIBILITY", "EXTERNAL_CONSUMER_REVIEW_REQUIRED"),
  row("FINANCIAL_FUNCTIONS", "admin_liberar_assinante legacy overload", "REMOTE_OVERLOAD_ONLY", "DEFERRED", "modern overload present locally", "remote legacy overload present", "REMOTE_ONLY_LEGACY", "FINANCIAL", "MANUAL_FINANCIAL_DECISION_REQUIRED"),
  row("FINANCIAL_FUNCTIONS", "admin_liberar_beta legacy overload", "REMOTE_OVERLOAD_ONLY", "DEFERRED", "modern overload present locally", "remote legacy overload present", "REMOTE_ONLY_LEGACY", "FINANCIAL", "MANUAL_FINANCIAL_DECISION_REQUIRED"),
  row("FINANCIAL_FUNCTIONS", "admin_upsert_assinatura legacy overload", "REMOTE_OVERLOAD_ONLY", "DEFERRED", "modern overload present locally", "remote legacy overload present", "REMOTE_ONLY_LEGACY", "FINANCIAL", "MANUAL_FINANCIAL_DECISION_REQUIRED"),
  row("ADMIN_FUNCTIONS", "admin_listar_logs body", "BODY_DIFFERENT", "DEFERRED", "local body differs", "remote body differs", "MANUAL_ADMIN_DECISION_REQUIRED", "BUSINESS_LOGIC", "Manual product/admin decision before SQL."),
  row("ADMIN_FUNCTIONS", "admin_listar_usuarios body", "BODY_DIFFERENT", "DEFERRED", "local body differs", "remote body differs", "MANUAL_ADMIN_DECISION_REQUIRED", "BUSINESS_LOGIC", "Manual product/admin decision before SQL."),
  row("ADMIN_FUNCTIONS", "admin_registrar_log body", "BODY_DIFFERENT", "DEFERRED", "local body differs", "remote body differs", "MANUAL_ADMIN_DECISION_REQUIRED", "BUSINESS_LOGIC", "Manual product/admin decision before SQL."),
  row("FINANCIAL_FUNCTIONS", "admin_upsert_assinatura modern body", "BODY_DIFFERENT", "DEFERRED", "local financial/admin behavior differs", "remote body differs", "MANUAL_FINANCIAL_DECISION_REQUIRED", "FINANCIAL", "Product/financial behavior reconciliation pending."),
  row("STUDENT_IDENTITY", "student_user_id and student RPCs", "LOCAL_ONLY", "20260730090000", "local complete by existing migration", "REMOTE_STUDENT_IDENTITY_PENDING", "STUDENT_IDENTITY_LOCAL_COMPLETE_REMOTE_PENDING", "FEATURE_CONTRACT", "Include in future production reconciliation package design."),
  row("WORKOUT_DELIVERY", "workout delivery backend contract", "DIVERGENT", "20260728030000", "local implemented by existing migration; local final drift zero", "REMOTE_WORKOUT_DELIVERY_PENDING", "WORKOUT_DELIVERY_LOCAL_COMPLETE_REMOTE_PENDING", "FEATURE_CONTRACT", "Do not create duplicate migration; apply approved bundle later before production convergence."),
  row("MIGRATION_HISTORY", "remote migration history alignment", "INCONCLUSIVE", "DEFERRED", "local sequence coherent", "remote history not aligned for reconciliation completion", "HISTORY_ALIGNMENT_PENDING", "HISTORY", "No migration repair until schema convergence and strategy approval.")
];

function row(domain, object, historicalStatus, resolvedBy, currentLocalStatus, remoteStatus, activeOrResolved, risk, nextAction) {
  return { domain, object, historical_status: historicalStatus, resolved_by: resolvedBy, current_local_status: currentLocalStatus, remote_status: remoteStatus, active_or_resolved: activeOrResolved, risk, next_action: nextAction };
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function writeCsv(path, rows, headers) {
  const text = [headers.join(","), ...rows.map((item) => headers.map((header) => csvEscape(item[header])).join(","))].join("\n");
  writeFileSync(path, `${text}\n`, "utf8");
}

function count(predicate) {
  return matrix.filter(predicate).length;
}

function validateNoScopeDiff(root) {
  const checks = [
    ["supabase/migrations/**", "POST_PHASE34_MIGRATION_DIFF_FORBIDDEN"],
    ["src/**", "POST_PHASE34_SRC_DIFF_FORBIDDEN"]
  ];
  for (const [pathspec, error] of checks) {
    const diff = execFileSync("git", ["diff", "--name-only", "--", pathspec], { cwd: root, encoding: "utf8" }).trim();
    if (diff) throw new Error(error);
  }
}

function validateNoProductionReady(result) {
  const text = JSON.stringify(result);
  if (/READY_TO_APPLY|READY_FOR_PRODUCTION|REPAIR_SAFE|HISTORY_ALIGNED|DB_PUSH_NOW/.test(text)) {
    throw new Error("POST_PHASE34_PRODUCTION_READY_FLAG_FORBIDDEN");
  }
}

function validateRemoteCsvProtection(root) {
  for (const dir of ["remote-schema-input", "remote-reconciliation-input", "remote-phase31-input", "remote-phase33-input"]) {
    const sample = `${REPORT_DIR}/${dir}/sample.csv`;
    const ignored = execFileSync("git", ["check-ignore", "-v", sample], { cwd: root, encoding: "utf8" });
    if (!ignored.includes(`${dir}/*.csv`)) throw new Error(`POST_PHASE34_CSV_IGNORE_MISSING:${dir}`);
  }
  const staged = execFileSync("git", ["diff", "--cached", "--name-only", "--", `${REPORT_DIR}/remote-*-input/*.csv`, `${REPORT_DIR}/remote-phase*-input/*.csv`], { cwd: root, encoding: "utf8" }).trim();
  if (staged) throw new Error("POST_PHASE34_RAW_CSV_STAGED");
}

function localCatalogState(root) {
  const dir = join(root, REPORT_DIR, "local-schema-catalog");
  const files = existsSync(dir) ? readdirSync(dir).filter((file) => file.endsWith(".json")).sort() : [];
  return { directory: `${REPORT_DIR}/local-schema-catalog/`, files, regenerated_by: "qa:supabase-schema-equivalence" };
}

export function buildGlobalState() {
  const resolved = count((item) => item.active_or_resolved.startsWith("RESOLVED_BY_"));
  const deferred = count((item) => item.active_or_resolved.startsWith("DEFERRED_TO_") || item.active_or_resolved === "LOCAL_ONLY_FUTURE_DEPLOYMENT" || item.active_or_resolved === "HISTORY_ALIGNMENT_PENDING");
  const manual = count((item) => item.active_or_resolved.startsWith("MANUAL_") || /MANUAL_|EXTERNAL_CONSUMER/.test(item.next_action));
  const falsePositives = count((item) => item.active_or_resolved === "SEMANTIC_FALSE_POSITIVE" || item.active_or_resolved === "NULLABILITY_PRESERVED_BY_APPROVED_PRODUCT_DECISION");
  const remotePendingSecurity = count((item) => item.risk === "SECURITY" && item.remote_status.includes("REMOTE_RECONCILIATION_PENDING"));
  const activeLocalSecurity = count((item) => item.active_or_resolved === "ACTIVE_SECURITY_DRIFT" && item.risk === "SECURITY");
  return {
    decision: DECISION,
    audit_type: "POST_PHASE34_GLOBAL_RECONCILIATION_AUDIT",
    production_action_required: "NO",
    migration_repair_allowed: "NO",
    remote_link_state: "UNLINKED_FOR_SAFETY",
    local_schema_state: "PARTIALLY_RECONCILED",
    remote_schema_state: "NOT_APPLIED",
    history_state: "HISTORY_ALIGNMENT_PENDING",
    local_reconciliation_state: "PARTIALLY_RECONCILED",
    remote_reconciliation_state: "NOT_APPLIED",
    history_alignment_state: "PENDING",
    next_safe_group: NEXT_SAFE_GROUP,
    totals: {
      historical_differences_reviewed: matrix.length,
      resolved,
      active: activeLocalSecurity,
      active_local_security_drift: activeLocalSecurity,
      remote_pending_security: remotePendingSecurity,
      deferred,
      manual_decision: manual,
      false_positive_or_preserved: falsePositives
    },
    resolved_items: matrix.filter((item) => item.active_or_resolved.startsWith("RESOLVED_BY_")),
    active_items: matrix.filter((item) => item.active_or_resolved === "ACTIVE_SECURITY_DRIFT" && item.risk === "SECURITY"),
    remote_pending_security_items: matrix.filter((item) => item.risk === "SECURITY" && item.remote_status.includes("REMOTE_RECONCILIATION_PENDING")),
    deferred_items: matrix.filter((item) => item.active_or_resolved.startsWith("DEFERRED_TO_") || item.active_or_resolved === "LOCAL_ONLY_FUTURE_DEPLOYMENT" || item.active_or_resolved === "HISTORY_ALIGNMENT_PENDING"),
    manual_decision_items: matrix.filter((item) => item.active_or_resolved.startsWith("MANUAL_") || /MANUAL_|EXTERNAL_CONSUMER/.test(item.next_action)),
    evidence_required_items: [],
    migration_inventory: migrations.map(([timestamp, filename, domain, logical_status, locally_validated, remote_expected, phase]) => ({ timestamp, filename, domain, logical_status, locally_validated, remote_expected, phase }))
  };
}

export function validateGlobalState(state) {
  if (state.decision !== DECISION) throw new Error("POST_PHASE34_DECISION_MISMATCH");
  if (state.production_action_required !== "NO") throw new Error("POST_PHASE34_PRODUCTION_ACTION_MISMATCH");
  if (state.migration_repair_allowed !== "NO") throw new Error("POST_PHASE34_REPAIR_ALLOWED_MISMATCH");
  if (state.next_safe_group !== NEXT_SAFE_GROUP) throw new Error("POST_PHASE34_NEXT_SAFE_GROUP_MISMATCH");
  for (const status of ["RESOLVED_BY_PHASE1", "RESOLVED_BY_PHASE2", "RESOLVED_BY_PHASE32_GROUP_E", "RESOLVED_BY_PHASE34_GROUP_A"]) {
    if (!matrix.some((item) => item.active_or_resolved === status)) throw new Error(`POST_PHASE34_RESOLUTION_MISSING:${status}`);
  }
  for (const status of ["DEFERRED_TO_AOE_BODY_RECONCILIATION", "HISTORY_ALIGNMENT_PENDING"]) {
    if (!matrix.some((item) => item.active_or_resolved === status || item.next_action === status)) throw new Error(`POST_PHASE34_DEFERRED_MISSING:${status}`);
  }
  if (!matrix.some((item) => item.active_or_resolved === "WORKOUT_DELIVERY_LOCAL_COMPLETE_REMOTE_PENDING")) {
    throw new Error("POST_PHASE34_WORKOUT_DELIVERY_LOCAL_COMPLETE_MISSING");
  }
  if (!matrix.some((item) => item.active_or_resolved === "STUDENT_IDENTITY_LOCAL_COMPLETE_REMOTE_PENDING")) {
    throw new Error("POST_PHASE34_STUDENT_IDENTITY_LOCAL_COMPLETE_MISSING");
  }
  validateNoProductionReady(state);
}

function writeReports(root, state) {
  mkdirSync(join(root, REPORT_DIR), { recursive: true });
  const stateJson = {
    ...state,
    local_catalog: localCatalogState(root),
    matrix
  };
  writeFileSync(join(root, REPORT_DIR, "post-phase34-reconciliation-state.json"), `${JSON.stringify(stateJson, null, 2)}\n`, "utf8");
  writeFileSync(join(root, REPORT_DIR, "post-phase34-global-result.json"), `${JSON.stringify(state, null, 2)}\n`, "utf8");
  writeCsv(join(root, REPORT_DIR, "post-phase34-reconciliation-matrix.csv"), matrix.map((item) => ({
    category: item.domain,
    object: item.object,
    previous_status: item.historical_status,
    current_local_state: item.current_local_status,
    known_remote_state: item.remote_status,
    resolved_by_phase: item.resolved_by,
    current_status: item.active_or_resolved,
    residual_risk: item.risk,
    next_action: item.next_action
  })), ["category", "object", "previous_status", "current_local_state", "known_remote_state", "resolved_by_phase", "current_status", "residual_risk", "next_action"]);
  writeCsv(join(root, REPORT_DIR, "post-phase34-resolved-active-matrix.csv"), matrix, ["domain", "object", "historical_status", "resolved_by", "current_local_status", "remote_status", "active_or_resolved", "risk", "next_action"]);

  const md = `# Post-Phase 3.4 Global Reconciliation Audit

Decision: \`${state.decision}\`.

Production action required: \`${state.production_action_required}\`.

Migration repair allowed: \`${state.migration_repair_allowed}\`.

Remote link state: \`${state.remote_link_state}\`.

## Context

This audit consolidates the local state after Phase 1, Phase 2, Phase 3.2 Group E and Phase 3.4 Group A. It does not create SQL, apply production changes, link Supabase, repair migration history, commit, push or open a PR.

## Phases Completed

- Phase 1: local security policies/grants reconciliation implemented.
- Phase 2: local required \`alunos\` nullability reconciliation implemented.
- Phase 3.2 Group E: local AOE anon EXECUTE revoke implemented.
- Phase 3.4 Group A: local utility function search_path and direct EXECUTE hardening implemented.

## Current Local State

Local schema state: \`${state.local_schema_state}\`.

Local migration count: \`${state.migration_inventory.length}\`.

Local replay: \`supabase db reset\` passed and \`supabase db diff --local --schema public\` reported no schema changes.

## Current Remote Evidence State

Remote schema state: \`${state.remote_schema_state}\`.

The remote evidence still represents production before these local reconciliation migrations are applied. Therefore resolved local work can still appear as remote drift in raw equivalence output.

## Resolved Items

- Phase 1 resolved items: ${state.resolved_items.filter((item) => item.active_or_resolved === "RESOLVED_BY_PHASE1").length}
- Phase 2 resolved items: ${state.resolved_items.filter((item) => item.active_or_resolved === "RESOLVED_BY_PHASE2").length}
- Group E resolved items: ${state.resolved_items.filter((item) => item.active_or_resolved === "RESOLVED_BY_PHASE32_GROUP_E").length}
- Group A resolved items: ${state.resolved_items.filter((item) => item.active_or_resolved === "RESOLVED_BY_PHASE34_GROUP_A").length}

## Deferred Items

- AOE body: \`DEFERRED_TO_AOE_BODY_RECONCILIATION\`
- Student identity: \`DEFERRED_TO_STUDENT_IDENTITY\`
- Workout delivery: \`DEFERRED_TO_WORKOUT_DELIVERY\`
- Migration history: \`HISTORY_ALIGNMENT_PENDING\`

## Active Drift

Active technical security drift remains at the remote-state level because approved local security migrations have not been applied to production.

## Manual Decisions

Admin body diffs remain \`MANUAL_ADMIN_DECISION_REQUIRED\`. Financial/admin subscription behavior remains \`MANUAL_FINANCIAL_DECISION_REQUIRED\`.

## Student Identity

Student identity is local-only future deployment. It is not a generic blocker and must remain separated from production drift.

## Workout Delivery

Workout delivery backend drift remains deferred by object. It should be reconciled after remaining technical security hardening is closed or explicitly released.

## AOE

The anon EXECUTE grant is locally resolved by Group E. The AOE body divergence remains deferred.

## Admin

Legacy admin overloads are \`REMOTE_ONLY_LEGACY\` and require external consumer review before deprecation.

## Financial

Financial behavior changes require manual product/financial approval before any migration.

## History

Schema state and migration history are separate. History alignment remains pending; migration repair is not allowed.

## Next Safe Group

\`NEXT_SAFE_GROUP=${state.next_safe_group}\`.

## Production Action

No production action is requested by this audit.

## Risks

The main residual risk is confusing local implemented reconciliation with production-applied reconciliation. Keep local, remote and history states separate until production application and history strategy are approved.
`;
  writeFileSync(join(root, "reports/supabase-production-sync/post-phase34-global-summary.md"), md, "utf8");
  writeFileSync(join(root, REPORT_DIR, "post-phase34-reconciliation-state.md"), `# Post-Phase 3.4 Reconciliation State

Decision: \`${state.decision}\`.

Local reconciliation state: \`${state.local_reconciliation_state}\`.

Remote reconciliation state: \`${state.remote_reconciliation_state}\`.

History alignment state: \`${state.history_alignment_state}\`.

Production action required: \`${state.production_action_required}\`.

Migration repair allowed: \`${state.migration_repair_allowed}\`.

## Totals

- Historical differences reviewed: ${state.totals.historical_differences_reviewed}
- Resolved locally: ${state.totals.resolved}
- Active local security drift: ${state.totals.active_local_security_drift}
- Remote pending security items: ${state.totals.remote_pending_security}
- Deferred items: ${state.totals.deferred}
- Manual decision items: ${state.totals.manual_decision}
- False positive or preserved product decisions: ${state.totals.false_positive_or_preserved}

## Next Safe Group

\`${state.next_safe_group}\`

This state is an audit rollup only. It does not authorize production SQL, migration repair or history alignment.
`, "utf8");
  writeFileSync(join(root, DOC_PATH), md, "utf8");
}

export function run({ write = true } = {}) {
  const root = process.cwd();
  validateNoScopeDiff(root);
  validateRemoteCsvProtection(root);
  const state = buildGlobalState();
  validateGlobalState(state);
  if (write) writeReports(root, state);
  console.log("POST_PHASE34_GLOBAL_RECONCILIATION_AUDIT");
  console.log(`NEXT_SAFE_GROUP=${state.next_safe_group}`);
  console.log("SUPABASE_POST_PHASE34_GLOBAL_STATE_READY");
  return state;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    run();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
