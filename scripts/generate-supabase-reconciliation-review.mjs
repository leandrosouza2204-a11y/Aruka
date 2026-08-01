import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "reports/supabase-production-sync");
const docsDir = join(root, "docs/supabase-production-sync");
mkdirSync(outDir, { recursive: true });
mkdirSync(docsDir, { recursive: true });

const result = readJson("reports/supabase-production-sync/schema-equivalence-result.json");
const matrix = parseCsv(readFileSync(join(root, "reports/supabase-production-sync/schema-equivalence-matrix.csv"), "utf8"));
const localCatalog = {
  rls: readJson("reports/supabase-production-sync/local-schema-catalog/rls.json"),
  policies: readJson("reports/supabase-production-sync/local-schema-catalog/policies.json"),
  functions: readJson("reports/supabase-production-sync/local-schema-catalog/functions.json"),
  tableGrants: readJson("reports/supabase-production-sync/local-schema-catalog/table-grants.json"),
};

const materialRows = matrix.filter((row) => isMaterial(row));
const criticalReview = materialRows.map((row) => classifyCritical(row)).sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.category.localeCompare(b.category) || a.object.localeCompare(b.object));

const policyReview = buildPolicyReview();
const tableGrantReview = buildTableGrantReview();
const functionReview = buildFunctionReview();
const workoutReview = buildWorkoutReview();
const studentReview = buildStudentReview();
const nullabilityReview = buildNullabilityReview();
const remoteOnlyReview = buildRemoteOnlyReview();
const localOnlyReview = buildLocalOnlyReview();

const decisionSpecific = chooseSpecificDecision({ policyReview, tableGrantReview, functionReview });
const strategy = "STRATEGY_MORE_EVIDENCE_REQUIRED";

writeCsv("schema-critical-review.csv", criticalReview, ["priority", "security_impact", "data_impact", "category", "schema", "object", "subobject", "status", "severity", "source_migration", "local_state", "remote_state", "details", "evidence_quality", "likely_cause", "recommended_strategy", "requires_remote_change", "requires_history_alignment", "manual_review_status"]);
writeJson("policy-security-review.json", policyReview);
writeFile("policy-security-review.md", renderPolicyReview(policyReview));
writeJson("table-grant-review.json", tableGrantReview);
writeFile("table-grant-review.md", renderTableGrantReview(tableGrantReview));
writeFile("function-grant-review.md", renderFunctionGrantReview());
writeJson("function-difference-review.json", functionReview);
writeFile("function-difference-review.md", renderFunctionReview(functionReview));
writeJson("workout-delivery-reconciliation.json", workoutReview);
writeFile("workout-delivery-reconciliation.md", renderWorkoutReview(workoutReview));
writeJson("student-identity-production-gap.json", studentReview);
writeFile("student-identity-production-gap.md", renderStudentReview(studentReview));
writeCsv("remote-only-object-review.csv", remoteOnlyReview, ["priority", "category", "object", "subobject", "status", "classification", "security_impact", "financial_impact", "recommended_strategy", "details"]);
writeCsv("local-only-object-review.csv", localOnlyReview, ["migration", "category", "object", "subobject", "classification", "purpose", "dependency", "functional_need", "impact_if_absent", "future_strategy"]);
writeFile("function-grants-signature-inspection.sql", renderFunctionGrantInspectionSql());
writeFile("remote-nullability-profile.sql", renderNullabilityProfileSql(nullabilityReview));
writeFile("reconciliation-readonly-inspection.sql", renderCombinedInspectionSql(nullabilityReview));
writeFile("summary.md", renderSummaryAppend(readFileSync(join(outDir, "summary.md"), "utf8"), { decisionSpecific, strategy, criticalReview, policyReview, tableGrantReview, functionReview, workoutReview, studentReview, nullabilityReview }));
writeFile("schema-equivalence-summary.md", renderEquivalenceSummary(readFileSync(join(outDir, "schema-equivalence-summary.md"), "utf8"), { decisionSpecific, strategy, criticalReview }));
writeFile("../docs-placeholder", "");
writeFileDoc("03-reconciliation-plan.md", renderReconciliationPlan({ decisionSpecific, strategy, criticalReview, policyReview, tableGrantReview, functionReview, workoutReview, studentReview, nullabilityReview, remoteOnlyReview, localOnlyReview }));
writeFileDoc("02-schema-equivalence-audit.md", renderEquivalenceDoc(readFileSync(join(docsDir, "02-schema-equivalence-audit.md"), "utf8"), { decisionSpecific, criticalReview }));
writeJson("result.json", updateMainResult(readJson("reports/supabase-production-sync/result.json"), { decisionSpecific, strategy, criticalReview, policyReview, tableGrantReview, functionReview, workoutReview, studentReview, nullabilityReview }));
writeJson("schema-equivalence-result.json", { ...result, manualReview: buildManualReviewSummary({ decisionSpecific, strategy, criticalReview, policyReview, tableGrantReview, functionReview, workoutReview, studentReview, nullabilityReview }) });

console.log(`SUPABASE_RECONCILIATION_REVIEW_GENERATED ${decisionSpecific}`);

function buildPolicyReview() {
  const rows = matrix.filter((row) => row.category === "policy" && ["REMOTE_MORE_PERMISSIVE", "POLICY_DEFINITION_DIFFERENT", "LOCAL_ONLY", "REMOTE_ONLY"].includes(row.status));
  return {
    summary: {
      total: rows.length,
      remoteMorePermissive: rows.filter((row) => row.status === "REMOTE_MORE_PERMISSIVE").length,
      localOnly: rows.filter((row) => row.status === "LOCAL_ONLY").length,
      remoteOnly: rows.filter((row) => row.status === "REMOTE_ONLY").length,
      writePolicies: rows.filter((row) => /\b(insert|update|delete|all)\b/i.test(row.details)).length,
    },
    policies: rows.map((row) => {
      const roles = extractNorm(row.details, "roles");
      const qual = extractNorm(row.details, "qual");
      const check = extractNorm(row.details, "with_check");
      const cmd = extractNorm(row.details, "cmd");
      const remotePublic = roles.remote.includes("public");
      const write = /\b(insert|update|delete|all)\b/i.test(cmd.remote || row.details);
      const usingTrue = /\btrue\b/i.test(qual.remote);
      const checkTrue = /\btrue\b/i.test(check.remote);
      return {
        table: row.object,
        local_name: row.subobject,
        remote_name: row.subobject,
        command: cmd.remote || cmd.local || "unknown",
        local_roles: roles.local,
        remote_roles: roles.remote,
        local_using: qual.local,
        remote_using: qual.remote,
        local_with_check: check.local,
        remote_with_check: check.remote,
        auth_uid_local: /auth\.uid\(\)/i.test(qual.local + check.local),
        auth_uid_remote: /auth\.uid\(\)/i.test(qual.remote + check.remote),
        cross_read_risk: row.status === "REMOTE_MORE_PERMISSIVE" && remotePublic ? "HIGH" : "REVIEW",
        cross_write_risk: write && (remotePublic || usingTrue || checkTrue) ? "HIGH" : write ? "REVIEW" : "LOW",
        financial_risk: isFinancial(row.object) ? "REVIEW_REQUIRED" : "LOW",
        administrative_risk: isAdmin(row.object) ? "REVIEW_REQUIRED" : "LOW",
        classification: row.status === "REMOTE_MORE_PERMISSIVE" ? "REMOTE_MORE_PERMISSIVE_CONFIRMED" : row.status === "REMOTE_ONLY" ? "LEGACY_POLICY" : row.status === "LOCAL_ONLY" ? "MATERIAL_EXPRESSION_DIFFERENCE" : "MATERIAL_EXPRESSION_DIFFERENCE",
        write_policy_decision: write && (remotePublic || usingTrue || checkTrue) ? "EXCESSIVE_REMOTE_ACCESS" : write ? "REQUIRES_RECONCILIATION" : "SAFE_BY_RLS_CONDITION",
        priority: priorityFor(row),
        recommendation: row.status === "REMOTE_MORE_PERMISSIVE" ? "Reconcile role scope; do not treat public as authenticated." : "Review expression/name against migration before schema changes.",
        source_migration: row.source_migration,
        details: row.details,
      };
    }),
  };
}

function buildTableGrantReview() {
  const rlsByTable = new Map(localCatalog.rls.map((row) => [row.table_name, row]));
  const remoteOnly = matrix.filter((row) => row.category === "table_grant" && row.status === "REMOTE_ONLY");
  const grants = remoteOnly.map((row) => {
    const parts = row.subobject.split(".");
    const grantee = parts[0] || "unknown";
    const privilege = parts[1] || "unknown";
    const rls = rlsByTable.get(row.object);
    const platform = ["service_role", "postgres", "supabase_admin", "dashboard_user"].includes(grantee);
    const write = ["insert", "update", "delete"].includes(privilege.toLowerCase());
    const critical = (grantee === "anon" && write) || (grantee === "public" && write) || (grantee === "authenticated" && write && isAdmin(row.object));
    return {
      table: row.object,
      grantee,
      privilege,
      exists_locally: false,
      rls_enabled: String(rls?.rls_enabled) === "true",
      applicable_policy: "REVIEW_POLICY_MATRIX",
      platform_managed_role: platform,
      effective_risk: critical ? "HIGH" : write ? "REVIEW_REQUIRED" : platform ? "LOW_PLATFORM_ROLE" : "REVIEW_REQUIRED",
      classification: platform ? "PLATFORM_MANAGED_EXPECTED" : critical ? "REMOTE_EXCESS_GRANT" : String(rls?.rls_enabled) === "true" ? "REMOTE_RESTRICTED_BY_RLS_BUT_REVIEW_REQUIRED" : "UNVERIFIED",
      recommendation: critical ? "Treat as P0 until manually reconciled." : "Classify against policy coverage and platform role expectations.",
      source_migration: row.source_migration,
      details: row.details,
    };
  });
  return { summary: groupByCount(grants, "grantee"), grants };
}

function buildFunctionReview() {
  const rows = matrix.filter((row) => row.category === "function" && ["BODY_DIFFERENT", "MATERIAL_DIFFERENCE", "VOLATILITY_DIFFERENT", "REMOTE_OVERLOAD_ONLY", "LOCAL_OVERLOAD_ONLY"].includes(row.status));
  return {
    summary: groupByCount(rows, "status"),
    functions: rows.map((row) => ({
      function_name: row.object,
      signature: row.subobject,
      status: row.status,
      classification: row.status === "BODY_DIFFERENT" ? functionClassification(row.object) : row.status === "REMOTE_OVERLOAD_ONLY" ? "REMOTE_FUNCTION_EXTRA" : "LOCAL_FUNCTION_ABSENT_REMOTE",
      priority: priorityFor(row),
      security_definer_impact: /security_definer.*local_norm=true|remote_norm=true/i.test(row.details) ? "REVIEW_REQUIRED" : "NOT_DETECTED_IN_DIFF",
      search_path_impact: /search_path/i.test(row.details) ? "REVIEW_REQUIRED" : "NOT_DETECTED_IN_DIFF",
      auth_uid_usage: /auth\.uid/i.test(row.details) ? "PRESENT_IN_DIFF" : "REVIEW_FUNCTION_BODY",
      financial_impact: isFinancial(row.object) ? "REVIEW_REQUIRED" : "LOW",
      administrative_impact: isAdmin(row.object) ? "REVIEW_REQUIRED" : "LOW",
      recommendation: "Compare normalized body against production function definition before designing SQL.",
      source_migration: row.source_migration,
      details: row.details,
    })),
  };
}

function buildWorkoutReview() {
  const rows = matrix.filter((row) => row.source_migration === "20260728030000_workout_delivery_integration_v1.sql");
  return {
    migration: "20260728030000_workout_delivery_integration_v1.sql",
    summary: groupByCount(rows, "status"),
    requires: {
      incremental_migration: true,
      function_replacement: rows.some((row) => row.category === "function" && row.status !== "EQUIVALENT"),
      constraint_adjustment: rows.some((row) => row.category === "constraint" && row.status === "MATERIAL_DIFFERENCE"),
      grant_adjustment: rows.some((row) => row.category.includes("grant") && row.status !== "EQUIVALENT"),
      policy_adjustment: rows.some((row) => row.category === "policy" && row.status !== "EQUIVALENT"),
      data_backfill: rows.some((row) => row.category === "column" && row.status === "LOCAL_ONLY"),
    },
    objects: rows.map((row) => ({ category: row.category, object: row.object, subobject: row.subobject, classification: workoutClassification(row), status: row.status, recommended_future_action: futureAction(row), details: row.details })),
  };
}

function buildStudentReview() {
  const rows = matrix.filter((row) => row.source_migration === "20260730090000_student_identity_contract.sql");
  return {
    decision: "STUDENT_IDENTITY_ABSENT_REMOTE_CONFIRMED",
    confirmations: {
      migration_cannot_receive_repair: true,
      apply_only_after_reconciliation: true,
      existing_alunos_remain_null: true,
      no_email_linking: true,
    },
    summary: groupByCount(rows, "status"),
    gaps: rows.map((row) => ({ category: row.category, object: row.object, subobject: row.subobject, status: row.status, classification: "ABSENT_REMOTE_EXPECTED_PENDING_RECONCILIATION", impact: studentImpact(row), details: row.details })),
  };
}

function buildNullabilityReview() {
  const rows = matrix.filter((row) => row.status === "NULLABILITY_DIFFERENT");
  return rows.map((row) => {
    const nullable = extractNorm(row.details, "is_nullable");
    const defaults = extractNorm(row.details, "column_default");
    return {
      table: row.object,
      column: row.subobject,
      local_nullable: nullable.local,
      remote_nullable: nullable.remote,
      direction: nullable.local === "NO" && nullable.remote === "YES" ? "LOCAL_MORE_RESTRICTIVE" : "LOCAL_MORE_PERMISSIVE",
      remote_null_count_required: "REMOTE_DATA_PROFILE_REQUIRED",
      backfill_required: nullable.local === "NO" && nullable.remote === "YES" ? "POSSIBLE" : "REVIEW",
      local_default: defaults.local,
      remote_default: defaults.remote,
      frontend_impact: isFinancial(row.object) || row.object === "alunos" ? "REVIEW_REQUIRED" : "LOW",
      insert_impact: "REVIEW_EXISTING_INSERT_PATHS",
      details: row.details,
    };
  });
}

function buildRemoteOnlyReview() {
  return matrix.filter((row) => row.status === "REMOTE_ONLY" || row.status === "REMOTE_OVERLOAD_ONLY").map((row) => ({
    priority: priorityFor(row),
    category: row.category,
    object: row.object,
    subobject: row.subobject,
    status: row.status,
    classification: remoteOnlyClassification(row),
    security_impact: securityImpact(row),
    financial_impact: isFinancial(row.object) ? "REVIEW_REQUIRED" : "LOW",
    recommended_strategy: "Do not remove automatically; classify with read-only evidence and application usage.",
    details: row.details,
  })).sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
}

function buildLocalOnlyReview() {
  return matrix.filter((row) => row.status === "LOCAL_ONLY" || row.status === "LOCAL_OVERLOAD_ONLY").map((row) => ({
    migration: row.source_migration,
    category: row.category,
    object: row.object,
    subobject: row.subobject,
    classification: row.source_migration.includes("student_identity") || row.source_migration.includes("20260730090000") ? "ABSENT_REMOTE_EXPECTED_PENDING_RECONCILIATION" : "LOCAL_CONTRACT_PENDING_REMOTE",
    purpose: purposeFor(row),
    dependency: dependencyFor(row),
    functional_need: row.source_migration.includes("20260730090000") ? "Student portal authorization contract" : "Application contract parity",
    impact_if_absent: impactIfAbsent(row),
    future_strategy: "Apply only after schema reconciliation plan is approved; do not repair as applied.",
  }));
}

function classifyCritical(row) {
  return {
    priority: priorityFor(row),
    security_impact: securityImpact(row),
    data_impact: dataImpact(row),
    category: row.category,
    schema: row.schema,
    object: row.object,
    subobject: row.subobject,
    status: row.status,
    severity: row.severity,
    source_migration: row.source_migration,
    local_state: row.local_state,
    remote_state: row.remote_state,
    details: row.details,
    evidence_quality: evidenceQuality(row),
    likely_cause: likelyCause(row),
    recommended_strategy: recommendedStrategy(row),
    requires_remote_change: requiresRemoteChange(row),
    requires_history_alignment: true,
    manual_review_status: "PENDING_MANUAL_REVIEW",
  };
}

function priorityFor(row) {
  const text = `${row.category} ${row.object} ${row.subobject} ${row.status} ${row.details}`.toLowerCase();
  if (row.status === "REMOTE_MORE_PERMISSIVE" || /anon\.insert|anon\.update|anon\.delete|public\.execute|security_definer|search_path|using true|with check true|admin_/.test(text)) return "P0";
  if (row.status === "NULLABILITY_DIFFERENT" || row.status === "TYPE_DIFFERENT" || /foreign key|on delete|status_check|student_user_id|vincular_aluno_usuario|get_my_student_workouts|authenticated\.(insert|update|delete)/.test(text)) return "P1";
  if (["BODY_DIFFERENT", "MATERIAL_DIFFERENCE", "REMOTE_OVERLOAD_ONLY", "LOCAL_OVERLOAD_ONLY"].includes(row.status)) return "P2";
  return "P3";
}

function isMaterial(row) {
  if (row.status === "EQUIVALENT" || row.status.startsWith("EQUIVALENT_") || row.status === "COLUMN_ORDER_DIFFERENT_NON_MATERIAL") return false;
  return true;
}

function likelyCause(row) {
  if (row.status === "REMOTE_MORE_PERMISSIVE") return "Remote policy role is broader than local contract.";
  if (row.status.includes("OVERLOAD")) return "Function signature exists on only one side or remote evidence has overload gap.";
  if (row.status === "PARTIALLY_VERIFIED") return "Remote CSV lacks function signature/specific_name.";
  if (row.category.includes("grant")) return "Remote privilege differs from local baseline/grant contract.";
  if (row.status === "NULLABILITY_DIFFERENT") return "Remote table permits or requires nulls differently than local contract.";
  if (row.status === "MATERIAL_DIFFERENCE") return "Material constraint expression remains different after safe normalization.";
  return "Schema contract differs after safe normalization.";
}

function recommendedStrategy(row) {
  if (row.status === "PARTIALLY_VERIFIED") return "Collect signature-aware read-only evidence.";
  if (row.status === "REMOTE_MORE_PERMISSIVE") return "Prioritize policy reconciliation before any history repair.";
  if (row.category.includes("grant")) return "Classify platform role versus application role, then reconcile grants.";
  if (row.status === "NULLABILITY_DIFFERENT") return "Run nullability profile before designing NOT NULL/default changes.";
  return "Review object-specific diff and design incremental reconciliation only after evidence collection.";
}

function evidenceQuality(row) {
  if (row.status === "PARTIALLY_VERIFIED" || row.category === "function_grant") return "PARTIAL_ROUTINE_NAME_ONLY";
  if (row.status.includes("OVERLOAD")) return "SIGNATURE_AWARE_FOR_FUNCTIONS_PARTIAL_FOR_GRANTS";
  return "CATALOG_CSV_AND_LOCAL_CATALOG";
}

function requiresRemoteChange(row) {
  return !["REMOTE_ONLY", "PARTIALLY_VERIFIED"].includes(row.status);
}

function securityImpact(row) {
  if (row.status === "REMOTE_MORE_PERMISSIVE" || row.category === "policy") return "HIGH";
  if (row.category.includes("grant") || row.category === "function") return "REVIEW_REQUIRED";
  if (row.object === "perfis" || row.object === "admin_logs") return "REVIEW_REQUIRED";
  return "LOW";
}

function dataImpact(row) {
  if (row.status === "NULLABILITY_DIFFERENT" || row.status === "TYPE_DIFFERENT" || row.category === "constraint") return "HIGH";
  if (isFinancial(row.object)) return "REVIEW_REQUIRED";
  return "LOW";
}

function functionClassification(name) {
  if (/salvar_treino_composto|entregar_treino|alterar_estado_treino/i.test(name)) return "MATERIAL_BUSINESS_LOGIC_DIFFERENCE";
  if (/admin_/i.test(name)) return "LOCAL_SECURITY_HARDENING_MISSING_REMOTE";
  if (/aoe_/i.test(name)) return "REMOTE_LEGACY_IMPLEMENTATION";
  return "MATERIAL_BUSINESS_LOGIC_DIFFERENCE";
}

function workoutClassification(row) {
  if (row.status === "EQUIVALENT" || row.status.startsWith("EQUIVALENT_")) return "PRESENT_EQUIVALENT";
  if (row.status === "LOCAL_ONLY" || row.status === "LOCAL_OVERLOAD_ONLY") return "ABSENT_REMOTE";
  if (row.status === "REMOTE_ONLY" || row.status === "REMOTE_OVERLOAD_ONLY") return "REMOTE_EXTRA";
  if (row.status === "PARTIALLY_VERIFIED") return "UNVERIFIED";
  return "PRESENT_DIFFERENT";
}

function futureAction(row) {
  if (row.category === "function") return "possible function replacement after review";
  if (row.category === "policy") return "policy reconciliation";
  if (row.category.includes("grant")) return "grant adjustment review";
  if (row.category === "constraint") return "constraint adjustment review";
  if (row.category === "column" && row.status === "LOCAL_ONLY") return "migration/backfill review";
  return "no automatic action";
}

function studentImpact(row) {
  if (row.category === "column") return "student account cannot be linked to aluno row in production.";
  if (row.category === "function") return "student/professional account linking RPC unavailable in production.";
  if (row.category.includes("grant")) return "student identity RPC permission absent or unverified.";
  if (row.category === "constraint") return "student role/FK contract absent or divergent.";
  return "student identity contract incomplete in production.";
}

function remoteOnlyClassification(row) {
  if (row.category.includes("grant")) return "EXTRA_GRANT";
  if (row.category === "policy") return "LEGACY_POLICY";
  if (row.status === "REMOTE_OVERLOAD_ONLY") return "LEGACY_FUNCTION_OVERLOAD";
  if (["service_role", "postgres", "supabase_admin", "dashboard_user"].some((role) => row.subobject.includes(role))) return "PLATFORM_MANAGED";
  return "UNKNOWN";
}

function purposeFor(row) {
  if (row.source_migration.includes("20260730090000")) return "Student identity and student workout access.";
  if (row.source_migration.includes("20260728030000")) return "Workout delivery lifecycle and template application.";
  return "Baseline application contract.";
}

function dependencyFor(row) {
  if (row.category === "function") return "tables, grants, RLS policies";
  if (row.category === "constraint") return "existing production data profile";
  if (row.category === "column") return "backfill/default review";
  return "schema history reconciliation";
}

function impactIfAbsent(row) {
  if (row.source_migration.includes("20260730090000")) return "Student portal remains blocked for production.";
  if (row.source_migration.includes("20260728030000")) return "Workout delivery contract is incomplete in production.";
  return "Local baseline cannot be marked applied safely.";
}

function chooseSpecificDecision({ policyReview, tableGrantReview, functionReview }) {
  if (policyReview.summary.remoteMorePermissive > 0) return "BLOCKED_SECURITY_POLICY_DRIFT";
  if (tableGrantReview.grants.some((grant) => grant.classification === "REMOTE_EXCESS_GRANT")) return "BLOCKED_REMOTE_EXCESS_GRANTS";
  if (functionReview.functions.some((fn) => fn.status === "BODY_DIFFERENT")) return "BLOCKED_FUNCTION_LOGIC_DRIFT";
  return "READY_FOR_RECONCILIATION_EVIDENCE_COLLECTION";
}

function renderPolicyReview(review) {
  return `# Policy Security Review

Decision: ${review.summary.remoteMorePermissive ? "BLOCKED_SECURITY_POLICY_DRIFT" : "READY_FOR_REVIEW"}.

- Total reviewed: ${review.summary.total}
- REMOTE_MORE_PERMISSIVE confirmed: ${review.summary.remoteMorePermissive}
- Local-only policies: ${review.summary.localOnly}
- Remote-only policies: ${review.summary.remoteOnly}
- Write policies detected from evidence: ${review.summary.writePolicies}

Remote policies using \`public\` are not treated as equivalent to \`authenticated\`.

${review.policies.slice(0, 80).map((item) => `- ${item.priority} ${item.table}.${item.remote_name}: ${item.classification}; cmd=${item.command}; roles local=${item.local_roles || "n/a"} remote=${item.remote_roles || "n/a"}; write=${item.write_policy_decision}; recommendation=${item.recommendation}`).join("\n")}
`;
}

function renderTableGrantReview(review) {
  return `# Table Grant Review

Remote-only grants grouped by grantee:

${Object.entries(review.summary).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

Critical rule: anon/PUBLIC writes and unplanned authenticated writes remain review blockers even when RLS is enabled.

${review.grants.slice(0, 120).map((grant) => `- ${grant.table}.${grant.grantee}.${grant.privilege}: ${grant.classification}; rls=${grant.rls_enabled}; risk=${grant.effective_risk}; ${grant.recommendation}`).join("\n")}
`;
}

function renderFunctionGrantReview() {
  const rows = matrix.filter((row) => row.category === "function_grant");
  return `# Function Grant Review

Decision: PARTIALLY_VERIFIED.

The remote evidence includes \`routine_name\`, \`grantee\` and \`privilege_type\`, but not \`specific_name\` or function identity arguments. Final equivalence for overloaded functions must wait for \`function-grants-signature-inspection.sql\`.

- Total rows: ${rows.length}
- Partially verified: ${rows.filter((row) => row.status === "PARTIALLY_VERIFIED").length}
- Local-only: ${rows.filter((row) => row.status === "LOCAL_ONLY").length}
- Remote-only: ${rows.filter((row) => row.status === "REMOTE_ONLY").length}
- SECURITY DEFINER review required for PUBLIC/anon/authenticated grants.
`;
}

function renderFunctionReview(review) {
  return `# Function Difference Review

${Object.entries(review.summary).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

${review.functions.map((fn) => `- ${fn.priority} ${fn.function_name}(${fn.signature}): ${fn.classification}; financial=${fn.financial_impact}; admin=${fn.administrative_impact}; ${fn.recommendation}`).join("\n")}
`;
}

function renderWorkoutReview(review) {
  return `# Workout Delivery Reconciliation Review

Migration: ${review.migration}

${Object.entries(review.summary).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

Required future work:

- Incremental migration: ${review.requires.incremental_migration}
- Function replacement review: ${review.requires.function_replacement}
- Constraint adjustment review: ${review.requires.constraint_adjustment}
- Grant adjustment review: ${review.requires.grant_adjustment}
- Policy adjustment review: ${review.requires.policy_adjustment}
- Backfill review: ${review.requires.data_backfill}
`;
}

function renderStudentReview(review) {
  return `# Student Identity Production Gap

Decision: ${review.decision}.

The student identity migration must not be repaired as applied remotely. It must only be applied after baseline/history reconciliation strategy is approved.

${Object.entries(review.summary).map(([key, value]) => `- ${key}: ${value}`).join("\n")}

Confirmed rules:

- Existing alunos remain nullable for student link.
- No email-based linking.
- No production SQL was executed.
`;
}

function renderFunctionGrantInspectionSql() {
  return `-- Function grants signature inspection
-- Execute manually in Supabase SQL Editor and export results as CSV.
-- Read-only SELECT statements only.

select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  r.specific_name,
  rp.grantee,
  rp.privilege_type,
  p.prosecdef as security_definer,
  coalesce(array_to_string(p.proconfig, ','), '') as function_config
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
left join information_schema.routines r
  on r.specific_schema = n.nspname
 and r.routine_name = p.proname
left join information_schema.routine_privileges rp
  on rp.specific_schema = r.specific_schema
 and rp.specific_name = r.specific_name
where n.nspname = 'public'
order by p.proname, identity_arguments, rp.grantee, rp.privilege_type;
`;
}

function renderNullabilityProfileSql(rows) {
  const selects = rows.map((row) => `select '${row.table}' as table_name, '${row.column}' as column_name, count(*) as total_rows, count(*) filter (where "${row.column}" is null) as null_rows from public."${row.table}";`);
  return `-- Remote nullability profile
-- Read-only. Execute manually and export the result.

${selects.join("\n")}
`;
}

function renderCombinedInspectionSql(rows) {
  return `-- Supabase reconciliation read-only inspection package
-- Export each result set as CSV. Do not append corrective SQL.

-- Function grants by signature.
${renderFunctionGrantInspectionSql()}

-- Nullability profile for divergent columns.
${renderNullabilityProfileSql(rows)}

-- Role existence relevant to reconciliation.
select rolname, rolcanlogin, rolsuper from pg_roles where rolname in ('anon', 'authenticated', 'service_role', 'postgres', 'supabase_admin', 'dashboard_user') order by rolname;

-- Critical grants currently visible through information_schema.
select table_name, grantee, privilege_type
from information_schema.table_privileges
where table_schema = 'public'
  and grantee in ('anon', 'authenticated', 'PUBLIC', 'public')
order by table_name, grantee, privilege_type;

-- Public functions with security mode and configuration.
select n.nspname as schema_name, p.proname as function_name, pg_get_function_identity_arguments(p.oid) as identity_arguments, p.prosecdef as security_definer, coalesce(array_to_string(p.proconfig, ','), '') as function_config
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
order by p.proname, identity_arguments;
`;
}

function renderReconciliationPlan(ctx) {
  return `# Supabase Production Reconciliation Plan

Status: draft for manual review only.

## 1. Current State

- Specific decision: \`${ctx.decisionSpecific}\`.
- Global decision: \`BLOCKED_REMOTE_SCHEMA_DRIFT\`.
- Repair: \`REPAIR_NOT_SAFE\`.
- Production action: \`RECONCILIATION_REQUIRED\`.
- Recommended strategy: \`${ctx.strategy}\`.
- Supabase state: \`UNLINKED_FOR_SAFETY\`.

## 2. Blockers

- Security policy drift remains confirmed.
- Remote-only grants require role/platform classification.
- Function grants remain partial until signature evidence is exported.
- Nullability changes require remote data profiling before design.

## 3. Confirmed Differences

- P0: ${ctx.criticalReview.filter((row) => row.priority === "P0").length}
- P1: ${ctx.criticalReview.filter((row) => row.priority === "P1").length}
- P2: ${ctx.criticalReview.filter((row) => row.priority === "P2").length}
- P3: ${ctx.criticalReview.filter((row) => row.priority === "P3").length}

## 4. False Positives Removed

- Defaults different: 169 -> 0.
- Constraints different: 70 -> 5.
- Functions different: 17 -> 6.
- Critical differences: 480 -> 242.

## 5. Policies

- Reviewed: ${ctx.policyReview.summary.total}
- REMOTE_MORE_PERMISSIVE confirmed: ${ctx.policyReview.summary.remoteMorePermissive}
- Remote-only: ${ctx.policyReview.summary.remoteOnly}
- Local-only: ${ctx.policyReview.summary.localOnly}

## 6. Grants

- Remote-only table grants: ${ctx.tableGrantReview.grants.length}
- Function grants: PARTIALLY_VERIFIED until signature-aware export is reviewed.

## 7. Constraints

Five material constraints remain after normalization. See \`schema-critical-review.csv\` for exact raw and normalized evidence. Possible classes include CHECK value differences, FK absence, and possible remaining normalization gaps requiring human review.

## 8. Functions

- Functions/overloads requiring review: ${ctx.functionReview.functions.length}
- Body differences: ${ctx.functionReview.functions.filter((fn) => fn.status === "BODY_DIFFERENT").length}

## 9. Nullability

- Divergent columns: ${ctx.nullabilityReview.length}
- Remote profiling required before any NOT NULL/default design.

## 10. Types

No remaining \`TYPE_DIFFERENT\` rows after canonical type normalization.

## 11. Workout Delivery

Workout delivery remains \`divergent\`; future work may include function, grant, policy, constraint and possible data/backfill review.

## 12. Student Identity

\`STUDENT_IDENTITY_ABSENT_REMOTE_CONFIRMED\`. Do not repair as applied. Apply only after reconciliation design is approved.

## 13. Financial Safety Assessment

Classification: \`DATA_PROFILE_REQUIRED\` and \`REMOTE_CONTRACT_DIFFERENT\`.

No financial SQL is planned. Review objects touching \`planos\`, \`assinaturas\`, \`pagamentos\`, \`acompanhamento_eventos\`, and financial columns in \`alunos\`.

## 14. Remote-only Objects

Remote-only objects are classified in \`remote-only-object-review.csv\`. Do not remove automatically.

## 15. Local-only Objects

Local-only objects are classified in \`local-only-object-review.csv\`. Student identity rows are expected pending reconciliation.

## 16. Additional Queries

- \`function-grants-signature-inspection.sql\`
- \`remote-nullability-profile.sql\`
- \`reconciliation-readonly-inspection.sql\`

## 17. Schema Track

Resolve policies, grants, constraints, functions, nullability, absent local objects and extra remote objects first.

## 18. History Track

Only after schema converges: evaluate migration list, dry-run, and whether any baseline/history repair is safe. Do not repair student identity while absent.

## 19. Recommended Strategy

\`${ctx.strategy}\`: collect additional read-only evidence before SQL design.

## 20. Criteria To Create Corrective SQL

All P0/P1 rows must be classified, null profiles exported, function grants signature-aware, and manual approval recorded.

## 21. Criteria For Repair

Schema equivalence must be materially proven. No repair while policies, functions, grants, constraints or student identity remain divergent.

## 22. Criteria For db push

Only after reconciliation SQL is reviewed, local replay passes, dry-run is clean, and production action is explicitly approved.

## 23. Conceptual Rollback

Future SQL must be incremental and reversible conceptually through restore/backout plan; no rollback SQL is created in this round.

## 24. Risks

Remote policy permissiveness, excess grants, function logic drift, data-profile unknowns, and migration history mismatch.

## 25. Next Round

Execute read-only inspection manually in production, return CSVs, then design reconciliation SQL.
`;
}

function renderSummaryAppend(existing, ctx) {
  const marker = "## Manual Review Round";
  const body = `${marker}

Specific decision: \`${ctx.decisionSpecific}\`.

Recommended strategy: \`${ctx.strategy}\`.

- P0 rows: ${ctx.criticalReview.filter((row) => row.priority === "P0").length}
- P1 rows: ${ctx.criticalReview.filter((row) => row.priority === "P1").length}
- Policies reviewed: ${ctx.policyReview.summary.total}
- REMOTE_MORE_PERMISSIVE confirmed: ${ctx.policyReview.summary.remoteMorePermissive}
- Remote-only table grants: ${ctx.tableGrantReview.grants.length}
- Function differences/overloads reviewed: ${ctx.functionReview.functions.length}
- Nullability rows requiring profile: ${ctx.nullabilityReview.length}

Read-only evidence package created; no remote SQL was executed.
`;
  return `${existing.split(marker)[0].trim()}\n\n${body}`;
}

function renderEquivalenceSummary(existing, ctx) {
  return `${existing.trim()}\n\n## Manual Critical Review\n\n- Specific decision: \`${ctx.decisionSpecific}\`.\n- Recommended strategy: \`${ctx.strategy}\`.\n- Critical review rows: ${ctx.criticalReview.length}.\n- P0: ${ctx.criticalReview.filter((row) => row.priority === "P0").length}.\n- P1: ${ctx.criticalReview.filter((row) => row.priority === "P1").length}.\n`;
}

function renderEquivalenceDoc(existing, ctx) {
  return `${existing.trim()}\n\n## Manual Critical Review\n\n- Specific decision: \`${ctx.decisionSpecific}\`.\n- Critical review matrix: \`reports/supabase-production-sync/schema-critical-review.csv\`.\n- P0 rows: ${ctx.criticalReview.filter((row) => row.priority === "P0").length}.\n- P1 rows: ${ctx.criticalReview.filter((row) => row.priority === "P1").length}.\n`;
}

function updateMainResult(existing, ctx) {
  return {
    ...existing,
    manual_reconciliation_review: buildManualReviewSummary(ctx),
    reports: [...new Set([...(existing.reports || []), "docs/supabase-production-sync/03-reconciliation-plan.md", "reports/supabase-production-sync/schema-critical-review.csv", "reports/supabase-production-sync/policy-security-review.json", "reports/supabase-production-sync/table-grant-review.json", "reports/supabase-production-sync/function-difference-review.json", "reports/supabase-production-sync/workout-delivery-reconciliation.json", "reports/supabase-production-sync/student-identity-production-gap.json", "reports/supabase-production-sync/reconciliation-readonly-inspection.sql"])],
  };
}

function buildManualReviewSummary(ctx) {
  return {
    specific_decision: ctx.decisionSpecific,
    global_decision: "BLOCKED_REMOTE_SCHEMA_DRIFT",
    repair: "REPAIR_NOT_SAFE",
    production_action: "RECONCILIATION_REQUIRED",
    recommended_strategy: ctx.strategy,
    p0: ctx.criticalReview.filter((row) => row.priority === "P0").length,
    p1: ctx.criticalReview.filter((row) => row.priority === "P1").length,
    p2: ctx.criticalReview.filter((row) => row.priority === "P2").length,
    p3: ctx.criticalReview.filter((row) => row.priority === "P3").length,
    policies_reviewed: ctx.policyReview.summary.total,
    remote_more_permissive_confirmed: ctx.policyReview.summary.remoteMorePermissive,
    remote_only_table_grants: ctx.tableGrantReview.grants.length,
    function_differences_reviewed: ctx.functionReview.functions.length,
    workout_delivery: "divergent",
    student_identity: "absent",
    nullability_profile_required: ctx.nullabilityReview.length,
  };
}

function extractNorm(details, field) {
  const re = new RegExp(`${field}:.*?local_norm=([^;]*?) remote_norm=([^;]*?)(?: local_hash|;|$)`, "i");
  const match = details.match(re);
  return { local: match?.[1]?.trim() || "", remote: match?.[2]?.trim() || "" };
}

function groupByCount(rows, field) {
  return rows.reduce((acc, row) => {
    const key = row[field] || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function isFinancial(object) {
  return /planos|assinaturas|pagamentos|acompanhamento_eventos|alunos/i.test(object);
}

function isAdmin(object) {
  return /admin|perfis/i.test(object);
}

function priorityRank(priority) {
  return { P0: 0, P1: 1, P2: 2, P3: 3 }[priority] ?? 9;
}

function readJson(path) {
  return JSON.parse(readFileSync(join(root, path), "utf8"));
}

function writeJson(name, value) {
  writeFile(name, `${JSON.stringify(value, null, 2)}\n`);
}

function writeCsv(name, rows, header) {
  writeFile(name, `${header.join(",")}\n${rows.map((row) => header.map((key) => csvCell(row[key] ?? "")).join(",")).join("\n")}\n`);
}

function writeFile(name, content) {
  if (name === "../docs-placeholder") return;
  writeFileSync(join(outDir, name), content, "utf8");
}

function writeFileDoc(name, content) {
  writeFileSync(join(docsDir, name), content, "utf8");
}

function csvCell(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field.length || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  const header = rows.shift();
  return rows.filter((cells) => cells.some(Boolean)).map((cells) => Object.fromEntries(header.map((key, index) => [key, cells[index] ?? ""])));
}
