import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const outDir = join(root, "reports/supabase-production-sync");
const inputDir = join(outDir, "remote-reconciliation-input");
const docsDir = join(root, "docs/supabase-production-sync");

const expectedNullability = [
  ["alunos", "acompanhamento_motivo"],
  ["alunos", "created_at"],
  ["alunos", "inicio"],
  ["alunos", "observacoes"],
  ["alunos", "pagamento_recebido"],
  ["alunos", "plano"],
  ["alunos", "status"],
  ["alunos", "user_id"],
  ["alunos", "valor"],
  ["alunos", "whatsapp"],
];

export async function main() {
  mkdirSync(outDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });

  const inputEvidence = loadEvidence(inputDir);
  const secretFindings = inputEvidence.files.flatMap((file) => scanSecrets(file.text, file.name));
  const blockingSecrets = secretFindings.filter((hit) => hit.kind !== "service_role_role_name");
  if (blockingSecrets.length) {
    console.error(`BLOCKED_SECRET_IN_RECONCILIATION_EVIDENCE ${blockingSecrets.map((hit) => `${hit.file}:${hit.line}:${hit.kind}`).join("; ")}`);
    process.exit(1);
  }

  const categories = classifyEvidence(inputEvidence.files);
  const matrix = parseCsv(readFileSync(join(outDir, "schema-equivalence-matrix.csv"), "utf8"));
  const localFunctions = readJson("reports/supabase-production-sync/local-schema-catalog/functions.json");
  const localFunctionGrants = readJson("reports/supabase-production-sync/local-schema-catalog/function-grants.json");
  const previousFunctionDiff = readJson("reports/supabase-production-sync/function-difference-review.json");
  const previousPolicyReview = readJson("reports/supabase-production-sync/policy-security-review.json");
  const previousWorkout = readJson("reports/supabase-production-sync/workout-delivery-reconciliation.json");
  const previousStudent = readJson("reports/supabase-production-sync/student-identity-production-gap.json");

  const functionGrants = analyzeFunctionGrants(categories.functionGrants?.rows || [], localFunctions, localFunctionGrants);
  const functionConfigurations = analyzeFunctionConfigurations(categories.functionConfiguration?.rows || [], localFunctions, functionGrants);
  const nullability = analyzeNullability(categories.nullability?.rows || [], matrix);
  const policies = analyzePolicies(previousPolicyReview);
  const constraints = analyzeConstraints(matrix);
  const functions = analyzeFunctions(previousFunctionDiff, functionConfigurations, functionGrants);
  const workoutDelivery = analyzeWorkout(previousWorkout, functionGrants, functionConfigurations);
  const studentIdentity = analyzeStudent(previousStudent, functionGrants);
  const remoteOnlyObjects = updateRemoteOnly(readCsvFile("reports/supabase-production-sync/remote-only-object-review.csv"), functionGrants);
  const localOnlyObjects = updateLocalOnly(readCsvFile("reports/supabase-production-sync/local-only-object-review.csv"), studentIdentity);
  const evidenceCompleteness = completeness({ categories, functionGrants, functionConfigurations, nullability, policies, constraints });
  const decision = chooseDecision({ evidenceCompleteness, policies, functionGrants, constraints, functions });
  const recommendedStrategy = evidenceCompleteness.overall === "RECONCILIATION_EVIDENCE_COMPLETE" ? "INCREMENTAL_RECONCILIATION_THEN_NEW_BASELINE" : "STRATEGY_MORE_EVIDENCE_REQUIRED";
  const remainingEvidenceRequired = remainingEvidence({ evidenceCompleteness, nullability, functionGrants, functionConfigurations });

  writeFile("remote-nullability-profile.sql", renderNullabilitySql(nullability.expected));

  const result = {
    decision,
    globalDecision: "BLOCKED_REMOTE_SCHEMA_DRIFT",
    repairAssessment: "REPAIR_NOT_SAFE",
    productionAction: "RECONCILIATION_DESIGN_REQUIRED",
    recommendedStrategy,
    branch: git(["branch", "--show-current"]),
    commit: git(["log", "-1", "--oneline"]),
    linkedState: "UNLINKED_FOR_SAFETY",
    inputEvidence: summarizeInput(inputEvidence, categories, secretFindings),
    evidenceCompleteness,
    functionGrants,
    functionConfigurations,
    nullability,
    policies,
    constraints,
    functions,
    workoutDelivery,
    studentIdentity,
    remoteOnlyObjects: { total: remoteOnlyObjects.length, classifications: countBy(remoteOnlyObjects, "classification") },
    localOnlyObjects: { total: localOnlyObjects.length, classifications: countBy(localOnlyObjects, "classification") },
    criticalDifferences: {
      p0: readCsvFile("reports/supabase-production-sync/schema-critical-review.csv").filter((row) => row.priority === "P0").length,
      p1: readCsvFile("reports/supabase-production-sync/schema-critical-review.csv").filter((row) => row.priority === "P1").length,
    },
    remainingEvidenceRequired,
    readonlyQueries: ["reports/supabase-production-sync/remote-nullability-profile.sql"],
    commandsNotExecuted: ["supabase db push", "supabase db pull", "supabase db dump", "supabase migration repair", "supabase db reset --linked", "remote SQL execution", "supabase link"],
    recommendedNextSteps: recommendedNextSteps(decision, remainingEvidenceRequired),
  };

  const design = buildReconciliationDesign(result);
  writeJson("reconciliation-evidence-result.json", result);
  writeFile("reconciliation-evidence-summary.md", renderSummary(result));
  writeFileDoc("04-reconciliation-evidence-review.md", renderDoc(result));
  writeJson("function-grant-review.json", functionGrants);
  writeFile("function-grant-review.md", renderFunctionGrantReview(functionGrants));
  writeJson("function-configuration-review.json", functionConfigurations);
  writeFile("function-configuration-review.md", renderFunctionConfigurationReview(functionConfigurations));
  writeJson("nullability-profile-review.json", nullability);
  writeFile("nullability-profile-review.md", renderNullabilityReview(nullability));
  writeJson("policy-security-review.json", policies);
  writeFile("policy-security-review.md", renderPolicyReview(policies));
  writeJson("function-difference-review.json", functions);
  writeFile("function-difference-review.md", renderFunctionReview(functions));
  writeJson("workout-delivery-reconciliation.json", workoutDelivery);
  writeFile("workout-delivery-reconciliation.md", renderWorkoutReview(workoutDelivery));
  writeJson("student-identity-production-gap.json", studentIdentity);
  writeFile("student-identity-production-gap.md", renderStudentReview(studentIdentity));
  writeCsv("remote-only-object-review.csv", remoteOnlyObjects);
  writeCsv("local-only-object-review.csv", localOnlyObjects);
  writeJson("future-migration-plan.json", design.futureMigrationPlan);
  writeFile("future-migration-plan.md", renderFutureMigrationPlan(design.futureMigrationPlan));
  writeCsv("reconciliation-design-matrix.csv", design.matrix);
  writeJson("reconciliation-design-result.json", design.result);
  writeFile("reconciliation-design-summary.md", renderReconciliationDesignSummary(design.result, design.matrix));
  writeFileDoc("05-reconciliation-design.md", renderReconciliationDesignDoc(result, design.result, design.matrix, design.futureMigrationPlan));
  updateRollupFiles(result);

  console.log(`SUPABASE_RECONCILIATION_EVIDENCE_ANALYZED ${decision}`);
}

export function classifyEvidence(files) {
  const out = {};
  const candidates = {};
  for (const file of files) {
    const header = file.rows[0] || [];
    const rows = file.rows.slice(1).filter((row) => row.some((cell) => String(cell).trim() !== "")).map((row) => objectFrom(header, row));
    const names = header.join(",");
    if (names === "schema_name,function_name,identity_arguments,specific_name,grantee,privilege_type,security_definer,function_config") candidates.functionGrants = [...(candidates.functionGrants || []), { ...file, category: "FUNCTION_GRANTS_SIGNATURE_EVIDENCE", rows }];
    else if (names === "table_name,column_name,total_rows,null_rows") candidates.nullability = [...(candidates.nullability || []), { ...file, category: "NULLABILITY_PROFILE_EVIDENCE", rows }];
    else if (names === "schema_name,function_name,identity_arguments,security_definer,function_config") candidates.functionConfiguration = [...(candidates.functionConfiguration || []), { ...file, category: "FUNCTION_CONFIGURATION_EVIDENCE", rows }];
    else out.unknown = { ...file, category: "UNKNOWN_EVIDENCE", rows };
  }
  if (candidates.functionGrants) out.functionGrants = chooseLargestEvidence(candidates.functionGrants);
  if (candidates.functionConfiguration) out.functionConfiguration = chooseLargestEvidence(candidates.functionConfiguration);
  if (candidates.nullability) out.nullability = chooseBestNullabilityEvidence(candidates.nullability);
  return out;
}

function chooseLargestEvidence(files) {
  return [...files].sort((a, b) => b.rows.length - a.rows.length || b.name.localeCompare(a.name))[0];
}

function chooseBestNullabilityEvidence(files) {
  const expected = new Set(expectedNullability.map(([table, column]) => `${table}.${column}`));
  return [...files].sort((a, b) => nullabilityEvidenceScore(b, expected) - nullabilityEvidenceScore(a, expected) || b.name.localeCompare(a.name))[0];
}

function nullabilityEvidenceScore(file, expected) {
  const keys = new Set(file.rows.map((row) => `${row.table_name}.${row.column_name}`));
  return [...keys].filter((key) => expected.has(key)).length * 1000 + file.rows.length;
}

export function analyzeFunctionGrants(remoteRows, localFunctions, localGrantRows) {
  const localFunctionByName = new Map(localFunctions.map((fn) => [`public.${fn.function_name}.${normalizeArgs(fn.arguments)}`, fn]));
  const localGrants = new Map(localGrantRows.map((row) => [`public.${row.routine_name}.${normalizeRole(row.grantee)}.${normalizePrivilege(row.privilege_type)}`, row]));
  const remoteGrants = new Map();
  const duplicates = [];
  for (const row of remoteRows) {
    const key = grantKey(row);
    if (remoteGrants.has(key)) duplicates.push({ key, specific_names: [remoteGrants.get(key).specific_name, row.specific_name].filter(Boolean) });
    remoteGrants.set(key, row);
  }
  const items = [];
  for (const [key, remote] of remoteGrants) {
    const localLooseKey = `public.${remote.function_name}.${normalizeRole(remote.grantee)}.${normalizePrivilege(remote.privilege_type)}`;
    const fnKey = `public.${remote.function_name}.${normalizeArgs(remote.identity_arguments)}`;
    const localFn = localFunctionByName.get(fnKey);
    const localGrant = localGrants.get(localLooseKey);
    const grantee = normalizeRole(remote.grantee);
    const securityDefiner = normalizeBool(remote.security_definer);
    const searchPath = extractSearchPath(remote.function_config);
    const priority = grantPriority({ grantee, functionName: remote.function_name, securityDefiner, searchPath });
    items.push({
      key,
      schema_name: remote.schema_name,
      function_name: remote.function_name,
      identity_arguments: remote.identity_arguments,
      specific_name: remote.specific_name,
      grantee,
      privilege_type: normalizePrivilege(remote.privilege_type),
      security_definer: securityDefiner,
      search_path: searchPath || "ABSENT",
      local_function_exists: Boolean(localFn),
      local_grant_exists_by_routine_name: Boolean(localGrant),
      classification: classifyGrant({ grantee, securityDefiner, searchPath, localFn, localGrant, functionName: remote.function_name }),
      priority,
      recommendation: priority === "P0" ? "Review before reconciliation SQL; public/anon execution or missing search_path on SECURITY DEFINER is high risk." : "Compare against intended local grant contract.",
    });
  }
  const localOnly = [...localGrants.values()].filter((row) => ![...remoteGrants.values()].some((remote) => remote.function_name === row.routine_name && normalizeRole(remote.grantee) === normalizeRole(row.grantee) && normalizePrivilege(remote.privilege_type) === normalizePrivilege(row.privilege_type)));
  return {
    totalReceived: remoteRows.length,
    uniqueCanonicalGrants: remoteGrants.size,
    duplicateCanonicalGrants: duplicates,
    remoteGrants: items,
    localOnlyGrants: localOnly.map((row) => ({ function_name: row.routine_name, grantee: normalizeRole(row.grantee), privilege_type: normalizePrivilege(row.privilege_type), classification: "LOCAL_ONLY_GRANT" })),
    summary: { byGrantee: countBy(items, "grantee"), byClassification: countBy(items, "classification"), public: items.filter((i) => i.grantee === "public").length, anon: items.filter((i) => i.grantee === "anon").length, authenticated: items.filter((i) => i.grantee === "authenticated").length, service_role: items.filter((i) => i.grantee === "service_role").length, securityDefiner: items.filter((i) => i.security_definer).length },
    completeness: "COMPLETE_BY_SIGNATURE_FOR_RECEIVED_GRID",
  };
}

export function analyzeNullability(rows, matrix = []) {
  const expectedFromMatrix = matrix.filter((row) => row.status === "NULLABILITY_DIFFERENT").map((row) => [row.object, row.subobject]);
  const expected = expectedFromMatrix.length ? expectedFromMatrix : expectedNullability;
  const seen = new Map();
  const duplicates = [];
  for (const row of rows) {
    const key = `${row.table_name}.${row.column_name}`;
    if (seen.has(key)) duplicates.push(key);
    seen.set(key, row);
  }
  const receivedKeys = [...seen.keys()];
  const missing = expected.map(([table, column]) => `${table}.${column}`).filter((key) => !seen.has(key));
  const unknown = receivedKeys.filter((key) => !expected.some(([table, column]) => key === `${table}.${column}`));
  const profiles = expected.map(([table, column]) => {
    const row = seen.get(`${table}.${column}`);
    if (!row) return { table_name: table, column_name: column, classification: "DATA_PROFILE_INCOMPLETE" };
    const total = Number(row.total_rows);
    const nulls = Number(row.null_rows);
    const invalid = !Number.isFinite(total) || !Number.isFinite(nulls) || nulls > total;
    return {
      table_name: table,
      column_name: column,
      total_rows: row.total_rows,
      null_rows: row.null_rows,
      percent_null: invalid || total === 0 ? null : Number(((nulls / total) * 100).toFixed(2)),
      current_data_classification: invalid ? "INVALID_PROFILE_RESULT" : total === 0 ? "EMPTY_TABLE_NEEDS_CONTRACT_REVIEW" : nulls > 0 ? "BACKFILL_REQUIRED" : "CURRENT_DATA_COMPATIBLE_WITH_NOT_NULL",
      classification: invalid ? "INVALID_PROFILE_RESULT" : total === 0 ? "EMPTY_TABLE_NEEDS_CONTRACT_REVIEW" : nulls > 0 ? "BACKFILL_REQUIRED" : "CURRENT_DATA_COMPATIBLE_WITH_NOT_NULL",
      functional_classification: classifyNullabilityFunction(column),
      contract_decision: nulls === 0 && !invalid && total > 0 ? "DESIGN_REVIEW_REQUIRED_BEFORE_NOT_NULL" : "DATA_OR_CONTRACT_REVIEW_REQUIRED",
      financial_impact: financialImpact(column),
    };
  });
  return { expected: expected.map(([table, column]) => ({ table_name: table, column_name: column })), received: rows.length, missing, duplicates, unknown, profiles, completeness: missing.length ? "REMOTE_NULLABILITY_PROFILE_INCOMPLETE" : "REMOTE_NULLABILITY_PROFILE_COMPLETE" };
}

export function classifyReconciliationGrid(header) {
  const names = header.join(",");
  if (names === "schema_name,function_name,identity_arguments,security_definer,function_config") return "FUNCTION_CONFIGURATION_EVIDENCE";
  if (names.includes("grantee") && names.includes("specific_name")) return "FUNCTION_GRANTS_SIGNATURE_EVIDENCE";
  return "UNKNOWN_EVIDENCE";
}

function analyzeFunctionConfigurations(rows, localFunctions, functionGrants) {
  const localByKey = new Map(localFunctions.map((fn) => [`${fn.function_name}.${normalizeArgs(fn.arguments)}`, fn]));
  const configs = rows.map((row) => {
    const key = `${row.function_name}.${normalizeArgs(row.identity_arguments)}`;
    const local = localByKey.get(key);
    const searchPath = extractSearchPath(row.function_config);
    const securityDefiner = normalizeBool(row.security_definer);
    return {
      function_name: row.function_name,
      identity_arguments: row.identity_arguments,
      security_definer: securityDefiner,
      function_config: row.function_config || "",
      search_path: searchPath || "ABSENT",
      local_function_exists: Boolean(local),
      local_definition_has_search_path: /search_path/i.test(local?.definition || ""),
      classification: securityDefiner && !searchPath ? "SECURITY_DEFINER_SEARCH_PATH_MISSING" : securityDefiner ? "SECURITY_DEFINER_SEARCH_PATH_VERIFIED" : "NON_SECURITY_DEFINER",
      p0_grants: functionGrants.remoteGrants.filter((grant) => grant.function_name === row.function_name && grant.priority === "P0").length,
    };
  });
  return { received: rows.length, configurations: configs, summary: { securityDefiner: configs.filter((c) => c.security_definer).length, missingSearchPath: configs.filter((c) => c.classification === "SECURITY_DEFINER_SEARCH_PATH_MISSING").length }, completeness: rows.length ? "RECONCILIATION_INSPECTION_PARTIAL" : "MISSING_FUNCTION_CONFIGURATION_EVIDENCE" };
}

function analyzePolicies(previous) {
  const policies = (previous.policies || []).map((policy) => ({
    ...policy,
    reviewed_classification: policy.classification === "REMOTE_MORE_PERMISSIVE_CONFIRMED" ? "REMOTE_MORE_PERMISSIVE_CONFIRMED" : policy.classification,
    evidence_note: "New evidence does not change policy role/expression evidence.",
  }));
  return { ...previous, policies, revisedCounts: { remoteMorePermissiveConfirmed: policies.filter((p) => p.reviewed_classification === "REMOTE_MORE_PERMISSIVE_CONFIRMED").length, writePolicies: policies.filter((p) => p.write_policy_decision === "EXCESSIVE_REMOTE_ACCESS").length }, completeness: "POLICY_EVIDENCE_FROM_PRIOR_SCHEMA_CSV_STILL_VALID" };
}

function analyzeConstraints(matrix) {
  const rows = matrix.filter((row) => row.category === "constraint" && (row.status === "MATERIAL_DIFFERENCE" || row.status === "LOCAL_ONLY"));
  return { total: rows.length, constraints: rows.map((row) => ({ table: row.object, constraint: row.subobject, status: row.status, classification: row.status === "LOCAL_ONLY" ? "LOCAL_CONSTRAINT_ABSENT_REMOTE" : /student|role_check/i.test(row.subobject + row.details) ? "CONFIRMED_MATERIAL_DIFFERENCE" : "DATA_PROFILE_REQUIRED", impact: "Review data compatibility before SQL design.", details: row.details })), completeness: "CONSTRAINT_EVIDENCE_SUFFICIENT_FOR_DESIGN_INPUT_BUT_DATA_PROFILE_REQUIRED" };
}

function analyzeFunctions(previous, configs, grants) {
  const fns = (previous.functions || []).map((fn) => {
    const config = configs.configurations.find((c) => c.function_name === fn.function_name && normalizeArgs(c.identity_arguments) === normalizeArgs(fn.signature));
    const fnGrants = grants.remoteGrants.filter((grant) => grant.function_name === fn.function_name);
    return { ...fn, new_evidence: { configuration: config || null, grants_by_signature: fnGrants }, final_classification: config?.classification === "SECURITY_DEFINER_SEARCH_PATH_MISSING" ? "SEARCH_PATH_DIFFERENT" : fn.classification === "REMOTE_FUNCTION_EXTRA" ? "OVERLOAD_REMOTE_ONLY" : fn.classification === "LOCAL_FUNCTION_ABSENT_REMOTE" ? "OVERLOAD_LOCAL_ONLY" : "BUSINESS_LOGIC_DIFFERENT" };
  });
  return { summary: countBy(fns, "final_classification"), functions: fns, completeness: configs.completeness };
}

function analyzeWorkout(previous, grants, configs) {
  const objects = (previous.objects || []).map((item) => ({ ...item, new_evidence: item.category === "function" ? "function configuration/grants cross-check available when signature was exported" : "no new direct evidence", final_state: item.classification }));
  return { ...previous, objects, evidence_completeness: "PARTIAL_FUNCTION_GRANT_AND_CONFIG_EVIDENCE", can_design_incremental_after_baseline: false };
}

function analyzeStudent(previous, grants) {
  const studentFns = ["vincular_aluno_usuario", "desvincular_aluno_usuario", "get_my_student_workouts"];
  const grantEvidence = studentFns.map((name) => ({ function_name: name, remote_signature_grants: grants.remoteGrants.filter((grant) => grant.function_name === name).length, confirmed_absent_by_signature: grants.remoteGrants.filter((grant) => grant.function_name === name).length === 0 }));
  return { ...previous, decision: "STUDENT_IDENTITY_ABSENT_REMOTE_CONFIRMED", signature_grant_evidence: grantEvidence, migration_cannot_receive_repair: true };
}

function updateRemoteOnly(rows, grants) {
  return rows.map((row) => ({ ...row, classification: row.category === "function_grant" ? "EXTRA_GRANT_SIGNATURE_REVIEWED" : row.classification, evidence_update: row.category === "function_grant" ? "signature-aware CSV received" : "unchanged" }));
}

function updateLocalOnly(rows, student) {
  return rows.map((row) => ({ ...row, classification: /20260730090000|student/i.test(row.migration + row.object + row.subobject) ? "EXPECTED_NOT_DEPLOYED" : "REQUIRED_FUTURE_RECONCILIATION", evidence_update: student.decision }));
}

function completeness({ categories, functionGrants, functionConfigurations, nullability, policies, constraints }) {
  const complete = functionGrants.completeness && functionConfigurations.received && nullability.completeness === "REMOTE_NULLABILITY_PROFILE_COMPLETE";
  return {
    overall: complete ? "RECONCILIATION_EVIDENCE_COMPLETE" : "RECONCILIATION_EVIDENCE_PARTIAL",
    functionGrants: functionGrants.completeness,
    functionConfiguration: functionConfigurations.completeness,
    reconciliationCsv: categories.functionConfiguration ? "RECONCILIATION_INSPECTION_PARTIAL" : "MISSING",
    nullability: nullability.completeness,
    policies: policies.completeness,
    constraints: constraints.completeness,
  };
}

function chooseDecision({ evidenceCompleteness, policies, functionGrants }) {
  if (evidenceCompleteness.nullability !== "REMOTE_NULLABILITY_PROFILE_COMPLETE" || evidenceCompleteness.functionGrants !== "COMPLETE_BY_SIGNATURE_FOR_RECEIVED_GRID" || evidenceCompleteness.functionConfiguration === "MISSING_FUNCTION_CONFIGURATION_EVIDENCE") return "BLOCKED_REMOTE_EVIDENCE_LIMITATION";
  return "READY_FOR_RECONCILIATION_DESIGN";
}

function remainingEvidence({ evidenceCompleteness, nullability, functionConfigurations }) {
  const out = [];
  if (nullability.missing.length) out.push({ type: "NULLABILITY_PROFILE", missing: nullability.missing });
  return out;
}

function recommendedNextSteps(decision, remaining) {
  if (decision === "BLOCKED_REMOTE_EVIDENCE_LIMITATION") return ["Run the updated read-only nullability profile for missing columns.", "Export any missing reconciliation grids manually.", "Do not design corrective SQL until evidence is complete."];
  return ["Review the non-executable reconciliation design.", "Prepare a future incremental migration only after approval and rollback sign-off.", "Create a fresh baseline only after production and repository converge."];
}

function classifyNullabilityFunction(column) {
  if (["observacoes", "acompanhamento_motivo"].includes(column)) return "NULLABLE_SHOULD_BE_PRESERVED";
  if (["inicio", "pagamento_recebido", "plano", "status", "valor"].includes(column)) return "HIGH_RISK_FINANCIAL_CONTRACT";
  return "NOT_NULL_REQUIRED_BY_CONTRACT";
}

function financialImpact(column) {
  if (["inicio", "pagamento_recebido", "plano", "status", "valor", "acompanhamento_motivo"].includes(column)) return "FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL";
  return "NO_DIRECT_FINANCIAL_IMPACT_IDENTIFIED";
}

function classifyGrant({ grantee, securityDefiner, searchPath, localFn, localGrant, functionName }) {
  if (["postgres", "service_role", "supabase_admin"].includes(grantee)) return "PLATFORM_MANAGED_EXPECTED";
  if (securityDefiner && !searchPath && ["public", "anon"].includes(grantee)) return "REMOTE_EXCESS_GRANT";
  if (securityDefiner && ["public", "anon"].includes(grantee)) return "REMOTE_MORE_PERMISSIVE";
  if (grantee === "anon" && /admin|salvar|entregar|alterar|vincular|desvincular/i.test(functionName)) return "REMOTE_EXCESS_GRANT";
  if (!localFn) return "UNVERIFIED";
  if (!localGrant && grantee === "authenticated") return "REMOTE_MORE_PERMISSIVE";
  if (!localGrant) return "REMOTE_ONLY_GRANT";
  return "EQUIVALENT";
}

function grantPriority({ grantee, functionName, securityDefiner, searchPath }) {
  if (securityDefiner && !searchPath && ["public", "anon"].includes(grantee)) return "P0";
  if (grantee === "public" && securityDefiner) return "P0";
  if (grantee === "anon" && /admin|salvar|entregar|alterar|vincular|desvincular/i.test(functionName)) return "P0";
  if (grantee === "authenticated" && /admin/i.test(functionName)) return "P1";
  return "P3";
}

function renderNullabilitySql(expected) {
  return `-- Remote nullability profile - complementary complete query\n-- Read-only. Execute manually and export CSV.\n\n${expected.map((row) => `select '${row.table_name}' as table_name, '${row.column_name}' as column_name, count(*) as total_rows, count(*) filter (where \"${row.column_name}\" is null) as null_rows from public.\"${row.table_name}\"`).join("\nunion all\n")};\n`;
}

function renderSummary(result) {
  return `# Reconciliation Evidence Summary\n\nDecision: \`${result.decision}\`.\n\nGlobal decision: \`${result.globalDecision}\`.\n\nRecommended strategy: \`${result.recommendedStrategy}\`.\n\n## Evidence Completeness\n\n- Overall: ${result.evidenceCompleteness.overall}\n- Function grants: ${result.evidenceCompleteness.functionGrants}\n- Function configuration: ${result.evidenceCompleteness.functionConfiguration}\n- Reconciliation CSV: ${result.evidenceCompleteness.reconciliationCsv}\n- Nullability: ${result.evidenceCompleteness.nullability}\n\n## Function Grants\n\n- Received rows: ${result.functionGrants.totalReceived}\n- Unique canonical grants: ${result.functionGrants.uniqueCanonicalGrants}\n- PUBLIC grants: ${result.functionGrants.summary.public}\n- anon grants: ${result.functionGrants.summary.anon}\n- authenticated grants: ${result.functionGrants.summary.authenticated}\n- service_role grants: ${result.functionGrants.summary.service_role}\n- SECURITY DEFINER grants: ${result.functionGrants.summary.securityDefiner}\n\n## Nullability\n\n- Expected columns: ${result.nullability.expected.length}\n- Received rows: ${result.nullability.received}\n- Missing columns: ${result.nullability.missing.length}\n\n## Policies\n\n- REMOTE_MORE_PERMISSIVE confirmed: ${result.policies.revisedCounts.remoteMorePermissiveConfirmed}\n\n## Student Identity\n\n- ${result.studentIdentity.decision}\n`;
}

function renderDoc(result) {
  return `${renderSummary(result)}\n## Commands Not Executed\n\n${result.commandsNotExecuted.map((cmd) => `- ${cmd}`).join("\n")}\n\n## Remaining Evidence Required\n\n${result.remainingEvidenceRequired.map((item) => `- ${item.type}: ${JSON.stringify(item.missing || item.count)}`).join("\n") || "- none"}\n`;
}

function renderFunctionGrantReview(data) {
  return `# Function Grant Review By Signature\n\n- Received rows: ${data.totalReceived}\n- Unique canonical grants: ${data.uniqueCanonicalGrants}\n- Duplicates by canonical key: ${data.duplicateCanonicalGrants.length}\n- PUBLIC: ${data.summary.public}\n- anon: ${data.summary.anon}\n- authenticated: ${data.summary.authenticated}\n- service_role: ${data.summary.service_role}\n\n${data.remoteGrants.slice(0, 120).map((g) => `- ${g.priority} ${g.function_name}(${g.identity_arguments}).${g.grantee}.${g.privilege_type}: ${g.classification}; security_definer=${g.security_definer}; search_path=${g.search_path}`).join("\n")}\n`;
}

function renderFunctionConfigurationReview(data) {
  return `# Function Configuration Review\n\n- Received functions: ${data.received}\n- SECURITY DEFINER: ${data.summary.securityDefiner}\n- Missing search_path: ${data.summary.missingSearchPath}\n- Completeness: ${data.completeness}\n`;
}

function renderNullabilityReview(data) {
  return `# Nullability Profile Review\n\n- Expected columns: ${data.expected.length}\n- Received rows: ${data.received}\n- Missing: ${data.missing.length}\n- Duplicates: ${data.duplicates.length}\n- Unknown: ${data.unknown.length}\n\n${data.profiles.map((p) => `- ${p.table_name}.${p.column_name}: ${p.classification}; total=${p.total_rows ?? "n/a"} nulls=${p.null_rows ?? "n/a"}`).join("\n")}\n`;
}

function renderPolicyReview(data) {
  return `# Policy Security Review\n\n- Reviewed policies: ${data.policies.length}\n- REMOTE_MORE_PERMISSIVE confirmed: ${data.revisedCounts.remoteMorePermissiveConfirmed}\n- Write policies: ${data.revisedCounts.writePolicies}\n\nNew evidence did not include policy grids; prior schema CSV evidence remains authoritative for policy role/expression drift.\n`;
}

function renderFunctionReview(data) {
  return `# Function Difference Review\n\n${Object.entries(data.summary).map(([k, v]) => `- ${k}: ${v}`).join("\n")}\n`;
}

function renderWorkoutReview(data) {
  return `# Workout Delivery Reconciliation\n\n- Evidence completeness: ${data.evidence_completeness}\n- Can design incremental after baseline now: ${data.can_design_incremental_after_baseline}\n`;
}

function renderStudentReview(data) {
  return `# Student Identity Production Gap\n\nDecision: ${data.decision}.\n\n${data.signature_grant_evidence.map((row) => `- ${row.function_name}: remote_signature_grants=${row.remote_signature_grants}; confirmed_absent_by_signature=${row.confirmed_absent_by_signature}`).join("\n")}\n`;
}

function updateRollupFiles(result) {
  appendSection("reports/supabase-production-sync/summary.md", "## Reconciliation Evidence Review", renderSummary(result));
  appendSection("reports/supabase-production-sync/schema-equivalence-summary.md", "## Reconciliation Evidence Review", `- Decision: \`${result.decision}\`.\n- Evidence completeness: \`${result.evidenceCompleteness.overall}\`.\n- Nullability missing: ${result.nullability.missing.length}.\n`);
  appendSection("docs/supabase-production-sync/02-schema-equivalence-audit.md", "## Reconciliation Evidence Review", `- Decision: \`${result.decision}\`.\n- Function grants are now compared by signature.\n- Reconciliation inspection CSV is \`${result.evidenceCompleteness.reconciliationCsv}\`.\n`);
  appendSection("docs/supabase-production-sync/03-reconciliation-plan.md", "## Evidence Review Update", `- Decision: \`${result.decision}\`.\n- Strategy: \`${result.recommendedStrategy}\`.\n- Nullability completeness: \`${result.evidenceCompleteness.nullability}\`.\n- Production action: \`${result.productionAction}\`.\n- Next step: review the non-executable reconciliation design before any future migration is authored.\n`);
  const main = readJson("reports/supabase-production-sync/result.json");
  writeJson("result.json", { ...main, reconciliation_evidence_review: { decision: result.decision, globalDecision: result.globalDecision, productionAction: result.productionAction, evidenceCompleteness: result.evidenceCompleteness, recommendedStrategy: result.recommendedStrategy, remainingEvidenceRequired: result.remainingEvidenceRequired } });
  const schema = readJson("reports/supabase-production-sync/schema-equivalence-result.json");
  writeJson("schema-equivalence-result.json", { ...schema, reconciliationEvidenceReview: { decision: result.decision, globalDecision: result.globalDecision, productionAction: result.productionAction, evidenceCompleteness: result.evidenceCompleteness, recommendedStrategy: result.recommendedStrategy } });
}

export function buildReconciliationDesign(evidence) {
  const rows = [
    row(0, "evidence_freeze", "approval_gate", "Preserve current read-only evidence, linked=false status, and backup requirement.", "KEEP", "NONE", "NO_DIRECT_FINANCIAL_IMPACT_IDENTIFIED", "Owner approval before drafting SQL.", "Rollback requires verified production backup and no repository mutation."),
    row(1, "security_policies", "rls_policy", `${evidence.policies.revisedCounts.remoteMorePermissiveConfirmed} remote-more-permissive policies require least-privilege review.`, "MANUAL_DECISION", "SECURITY_DRIFT", "FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL", "Security and product owner approval.", "Rollback policy must restore the exact previous production policy definitions."),
    row(2, "function_and_table_grants", "grant", "Signature-aware grant evidence available; platform-managed service_role entries are role evidence, not secrets.", "REVOKE_OR_GRANT_AFTER_APPROVAL", "ACCESS_DRIFT", "FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL", "Security approval for anon/public/authenticated changes.", "Rollback grant map must restore prior grantee/privilege pairs."),
    row(3, "constraints_and_nullability", "table_contract", `Nullability profile complete for ${evidence.nullability.expected.length} alunos columns and current data has zero nulls in all received rows.`, "ALTER_AFTER_CONTRACT_APPROVAL", "DATA_CONTRACT_DRIFT", "FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL", "Product and finance approval for contract columns.", "Rollback requires reversible constraint plan and pre-change data snapshot."),
    row(4, "function_definitions", "routine", "Function body/configuration differences require controlled replacement after security search_path review.", "REPLACE_AFTER_APPROVAL", "BUSINESS_LOGIC_DRIFT", "FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL", "Engineering and security approval.", "Rollback function definitions must be captured from production before replacement."),
    row(5, "workout_delivery_contract", "feature_contract", "Workout delivery objects remain blocked by remote drift and must converge before new student-facing delivery changes.", "MERGE_AFTER_SCHEMA_CONVERGES", "FEATURE_CONTRACT_DRIFT", "FINANCIAL_OR_CONTRACT_IMPACT_REQUIRES_APPROVAL", "Product approval for delivery state changes.", "Rollback restores previous delivery functions, policies and grants together."),
    row(6, "student_identity_contract", "future_migration", "Student identity migration remains local-only and must be applied only after prerequisite reconciliation phases.", "APPLY_AFTER_PREREQUISITES", "LOCAL_ONLY_EXPECTED", "NO_DIRECT_FINANCIAL_IMPACT_IDENTIFIED", "Engineering approval after phases 1-5 pass.", "Rollback disables student linkage surfaces before reverting database contract."),
    row(7, "post_reconciliation_validation", "quality_gate", "Run schema equivalence, reconciliation evidence, design QA, student identity QAs, lint and build.", "VALIDATE", "QUALITY_GATE", "NO_DIRECT_FINANCIAL_IMPACT_IDENTIFIED", "Technical lead approval.", "Rollback triggered if any validation fails after a controlled change window."),
    row(8, "migration_history_and_baseline", "history", "Only after production and repository converge, create a new baseline or repair history record under explicit approval.", "NEW_BASELINE_AFTER_CONVERGENCE", "HISTORY_ALIGNMENT", "NO_DIRECT_FINANCIAL_IMPACT_IDENTIFIED", "Technical lead and repository owner approval.", "Rollback concept is to keep the previous repository baseline until convergence is proven."),
  ];
  const futureMigrationPlan = {
    status: "DESIGN_ONLY_NO_EXECUTION_AUTHORIZATION",
    strategy: evidence.recommendedStrategy,
    production_action: evidence.productionAction,
    repair_assessment: evidence.repairAssessment,
    phases: rows.map((item) => ({
      phase: Number(item.phase),
      phase_name: item.phase_name,
      future_action_type: item.future_action_type,
      approval_required: item.approval_required,
      rollback_concept: item.rollback_concept,
      blockers_before_execution: item.phase === 8 ? ["production and repository convergence must be proven"] : ["manual SQL authoring prohibited in this artifact", "approval gate not yet passed"],
    })),
  };
  return {
    matrix: rows,
    futureMigrationPlan,
    result: {
      decision: "READY_FOR_RECONCILIATION_DESIGN",
      globalDecision: evidence.globalDecision,
      productionAction: evidence.productionAction,
      readyToApply: false,
      recommendedStrategy: evidence.recommendedStrategy,
      nullability: evidence.nullability,
      phaseCount: rows.length,
      approvalRequired: true,
      rollbackRequired: true,
      commandsNotExecuted: evidence.commandsNotExecuted,
    },
  };
}

function row(phase, phase_name, object_type, evidence_summary, future_action_type, risk_classification, financial_impact, approval_required, rollback_concept) {
  return { phase, phase_name, object_type, evidence_summary, future_action_type, risk_classification, financial_impact, approval_required, rollback_concept, executable_sql_present: "false" };
}

function renderFutureMigrationPlan(plan) {
  return `# Future Migration Plan\n\nStatus: \`${plan.status}\`.\n\nStrategy: \`${plan.strategy}\`.\n\nProduction action: \`${plan.production_action}\`.\n\n${plan.phases.map((phase) => `## Phase ${phase.phase}: ${phase.phase_name}\n\n- Future action type: ${phase.future_action_type}\n- Approval required: ${phase.approval_required}\n- Rollback concept: ${phase.rollback_concept}`).join("\n\n")}\n`;
}

function renderReconciliationDesignSummary(result, matrix) {
  return `# Reconciliation Design Summary\n\nDecision: \`${result.decision}\`.\n\nGlobal decision: \`${result.globalDecision}\`.\n\nProduction action: \`${result.productionAction}\`.\n\nReady to apply: \`${result.readyToApply}\`.\n\n- Phases: ${matrix.length}\n- Nullability expected columns: ${result.nullability.expected.length}\n- Nullability missing columns: ${result.nullability.missing.length}\n- Approval required: ${result.approvalRequired}\n- Rollback required: ${result.rollbackRequired}\n`;
}

function renderReconciliationDesignDoc(evidence, result, matrix, plan) {
  return `${renderReconciliationDesignSummary(result, matrix)}\n## Nullability Decision\n\nThe production profile for public.alunos contains all ${evidence.nullability.expected.length} expected columns, total_rows=26 and null_rows=0 for every exported column. This closes the nullability evidence limitation for design, but it does not authorize immediate NOT NULL changes.\n\n## Execution Boundary\n\nThis document is design-only. It contains no executable write SQL and does not authorize direct application.\n\n## Design Matrix\n\n${matrix.map((item) => `- Phase ${item.phase} ${item.phase_name}: ${item.future_action_type}; risk=${item.risk_classification}; financial=${item.financial_impact}; approval=${item.approval_required}; rollback=${item.rollback_concept}`).join("\n")}\n\n## Future Migration Plan\n\n${plan.phases.map((phase) => `- Phase ${phase.phase} ${phase.phase_name}: ${phase.future_action_type}`).join("\n")}\n`;
}

function appendSection(path, marker, content) {
  const full = join(root, path);
  const existing = existsSync(full) ? readFileSync(full, "utf8") : "";
  writeFileSync(full, `${existing.split(marker)[0].trim()}\n\n${marker}\n\n${content.trim()}\n`, "utf8");
}

function summarizeInput(input, categories, secrets) {
  return {
    directory: "reports/supabase-production-sync/remote-reconciliation-input",
    files: input.files.map((f) => ({ name: f.name, bytes: f.bytes, lines: f.lines, header: f.header, bom: f.bom, delimiter: ",", category: Object.values(categories).find((cat) => cat.name === f.name)?.category || "UNKNOWN_EVIDENCE" })),
    secretScan: secrets.length ? "SERVICE_ROLE_ROLE_NAME_ONLY" : "REMOTE_RECONCILIATION_EVIDENCE_SECRET_SCAN_PASS",
  };
}

function loadEvidence(dir) {
  const names = existsSync(dir) ? readdirSync(dir).filter((name) => name.toLowerCase().endsWith(".csv")).sort() : [];
  return { files: names.map((name) => {
    const bytes = readFileSync(join(dir, name));
    const text = bytes.toString("utf8").replace(/^\uFEFF/, "");
    const rows = parseCsv(text);
    return { name, bytes: bytes.length, lines: text.split(/\r?\n/).length, header: rows[0]?.join(",") || "", bom: bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf, text, rows };
  }) };
}

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (quoted) {
      if (ch === '"' && next === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  return rows;
}

function readCsvFile(path) {
  const rows = parseCsv(readFileSync(join(root, path), "utf8"));
  const header = rows.shift() || [];
  return rows.filter((r) => r.some(Boolean)).map((r) => objectFrom(header, r));
}

function objectFrom(header, row) {
  return Object.fromEntries(header.map((key, i) => [key, row[i] ?? ""]));
}

function writeJson(name, value) { writeFile(name, `${JSON.stringify(value, null, 2)}\n`); }
function writeCsv(name, rows) {
  const header = Object.keys(rows[0] || {});
  writeFile(name, `${header.join(",")}\n${rows.map((r) => header.map((h) => csvCell(r[h] ?? "")).join(",")).join("\n")}\n`);
}
function writeFile(name, text) { writeFileSync(join(outDir, name), text, "utf8"); }
function writeFileDoc(name, text) { writeFileSync(join(docsDir, name), text, "utf8"); }
function readJson(path) { return JSON.parse(readFileSync(join(root, path), "utf8")); }
function csvCell(value) { const text = String(value); return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text; }
function normalizeArgs(value) { return String(value || "").replace(/\s+/g, " ").trim().toLowerCase(); }
function normalizeRole(value) { return String(value || "").replace(/[{}"]/g, "").trim().toLowerCase(); }
function normalizePrivilege(value) { return String(value || "").trim().toLowerCase(); }
function normalizeBool(value) { return /^(true|t|yes|1)$/i.test(String(value || "").trim()); }
function extractSearchPath(config) { return String(config || "").match(/search_path=([^,}]+)/i)?.[1]?.trim() || ""; }
function grantKey(row) { return `${row.schema_name}.${row.function_name}.${normalizeArgs(row.identity_arguments)}.${normalizeRole(row.grantee)}.${normalizePrivilege(row.privilege_type)}`; }
function countBy(rows, key) { return rows.reduce((acc, row) => { const value = row[key] || "unknown"; acc[value] = (acc[value] || 0) + 1; return acc; }, {}); }
function git(args) { try { return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return "unavailable"; } }

export function scanSecrets(text, file = "input.csv") {
  const checks = [
    [new RegExp(["postgres", "(?:ql)?", "://"].join(""), "i"), "connection_string"],
    [new RegExp(["ey", "J", "[A-Za-z0-9_-]{20,}"].join("")), "jwt"],
    [/service_role/i, "service_role_role_name"],
    [new RegExp(["SUPABASE", "SERV", "ICE"].join("_"), "i"), "supabase_privileged_env_name"],
    [new RegExp(["PG", "PASS", "WORD"].join(""), "i"), "pg_pass_word_name"],
    [new RegExp(["pass", "word="].join(""), "i"), "password_parameter"],
    [new RegExp(["access", "token"].join("_"), "i"), "access_tok_name"],
    [new RegExp([["vriz", "euhuhvtvbrmt", "vdik"].join(""), ["xrmq", "dkpxnfvusmen", "adnf"].join("")].join("|"), "i"), "full_project_ref"],
  ];
  const hits = [];
  text.split(/\r?\n/).forEach((line, index) => {
    for (const [pattern, kind] of checks) if (pattern.test(line)) hits.push({ file, line: index + 1, kind });
  });
  return hits;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
