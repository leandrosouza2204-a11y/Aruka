import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const root = process.cwd();
const reportDir = join(root, "reports/supabase-production-sync");
const docsDir = join(root, "docs/supabase-production-sync");

const functionReview = readJson("function-difference-review.json");
const grantReview = readJson("function-grant-review.json");
const localFunctions = readJson("local-schema-catalog/functions.json");
const schemaEquivalence = readJson("schema-equivalence-result.json");

const functionDiffs = functionReview.functions || [];
const localByKey = new Map(localFunctions.map((fn) => [signatureKey(fn.function_name, fn.arguments), fn]));
const localByName = groupBy(localFunctions, (fn) => fn.function_name);
const diffByKey = new Map(functionDiffs.map((fn) => [signatureKey(fn.function_name, fn.signature), fn]));
const phase3Names = new Set([...functionDiffs.map((fn) => fn.function_name), ...localFunctions.map((fn) => fn.function_name)]);

const inventory = [...phase3Names].sort().flatMap((name) => {
  const diffs = functionDiffs.filter((fn) => fn.function_name === name);
  const locals = localByName.get(name) || [];
  const rows = [];
  const seen = new Set();

  for (const diff of diffs) {
    const key = signatureKey(diff.function_name, diff.signature);
    const local = localByKey.get(key);
    seen.add(key);
    rows.push(buildInventoryRow({ name, signature: diff.signature || "", local, diff }));
  }

  for (const local of locals) {
    const key = signatureKey(local.function_name, local.arguments);
    if (seen.has(key)) continue;
    rows.push(buildInventoryRow({ name, signature: local.arguments || "", local, diff: null }));
  }

  return rows;
});

const divergentInventory = inventory.filter((row) => row.reconciliation_status !== "EQUIVALENT_OR_NOT_IN_PHASE3_DIFF");
const scopeRows = divergentInventory.map((row) => {
  const decision = scopeDecision(row);
  return {
    ...pick(row, [
      "function_name",
      "signature",
      "category",
      "reconciliation_status",
      "source_migration",
      "security_definer",
      "search_path",
      "local_definition_hash",
      "remote_definition_hash",
    ]),
    included_in_phase3_migration: false,
    phase3_decision: decision.decision,
    blocker: decision.blocker,
    recommended_next_action: decision.nextAction,
  };
});

const dependencyGraph = buildDependencyGraph(inventory);
const summary = summarize(scopeRows);
const result = {
  decision: "READY_FOR_PHASE3_FUNCTION_SCOPE_REVIEW",
  migration_decision: "NO_NEW_MIGRATION",
  reason: "Function divergences include business logic, overload, grant and feature-line ambiguities that require explicit product/security review before SQL changes.",
  remote_link_state: "UNLINKED_FOR_SAFETY",
  final_projects_list_check: {
    executed: true,
    aruka_linked: false,
    aruka_status: "ACTIVE_HEALTHY",
    aruka_hml_linked: false,
    aruka_hml_status: "ACTIVE_HEALTHY",
    cli_message: "Cannot find project ref. Have you run supabase link?",
  },
  source_reports: [
    "reports/supabase-production-sync/schema-equivalence-result.json",
    "reports/supabase-production-sync/function-difference-review.json",
    "reports/supabase-production-sync/function-grant-review.json",
    "reports/supabase-production-sync/local-schema-catalog/functions.json",
  ],
  summary,
  phase3_scope_size: scopeRows.length,
  included_in_phase3_migration: 0,
  deferred_or_blocked: scopeRows.length,
  no_remote_db_commands_executed: true,
  commands_not_executed: [
    "supabase link",
    "supabase db push",
    "supabase db pull",
    "supabase migration repair",
    "supabase db dump --linked",
    "remote SQL execution",
  ],
};

mkdirSync(reportDir, { recursive: true });
mkdirSync(docsDir, { recursive: true });

writeJson("phase3-function-inventory.json", { generated_from: result.source_reports, functions: inventory });
writeFileSync(join(reportDir, "phase3-function-inventory.csv"), toCsv(inventory), "utf8");
writeJson("phase3-function-dependency-graph.json", dependencyGraph);
writeJson("function-reconciliation-scope.json", { decision: result.decision, migration_decision: result.migration_decision, functions: scopeRows });
writeFileSync(join(reportDir, "function-phase3-scope.csv"), toCsv(scopeRows), "utf8");
writeJson("function-reconciliation-result.json", result);
writeFileSync(join(reportDir, "function-reconciliation-scope.md"), renderScopeMd(result, scopeRows), "utf8");
writeFileSync(join(reportDir, "function-reconciliation-summary.md"), renderSummaryMd(result, scopeRows), "utf8");
writeFileSync(join(docsDir, "11-function-reconciliation-audit.md"), renderSummaryMd(result, scopeRows), "utf8");

console.log(`SUPABASE_FUNCTION_RECONCILIATION_AUDITED ${result.decision}`);

function buildInventoryRow({ name, signature, local, diff }) {
  const localDefinition = local?.definition || "";
  const config = diff?.new_evidence?.configuration || {};
  const status = diff?.status || "EQUIVALENT_OR_NOT_IN_PHASE3_DIFF";
  const category = classifyFunction(name);

  return {
    schema: "public",
    function_name: name,
    signature,
    category,
    reconciliation_status: status,
    source_migration: diff?.source_migration || "20260716090000_baseline_aruka_v1.sql",
    security_definer: local?.security_definer ?? config.security_definer ?? "",
    volatility: local?.volatility || "",
    return_type: local?.return_type || "",
    search_path: extractSearchPath(localDefinition) || config.search_path || "",
    local_exists: Boolean(local),
    remote_exists: status !== "LOCAL_OVERLOAD_ONLY",
    local_definition_hash: localDefinition ? hash(normalizeDefinition(localDefinition)) : "",
    remote_definition_hash: extractRemoteHash(diff),
    grant_evidence: summarizeGrantEvidence(diff),
    recommended_action: diff?.recommendation || "No Phase 3 divergence detected.",
  };
}

function scopeDecision(row) {
  if (row.category === "WORKOUT_DELIVERY") {
    return {
      decision: "DEFER_TO_WORKOUT_DELIVERY_RECONCILIATION",
      blocker: "Workout delivery RPCs/triggers are outside this Phase 3 approval scope.",
      nextAction: "Review with workout delivery deployment owner before SQL.",
    };
  }
  if (row.category === "STUDENT_IDENTITY") {
    return {
      decision: "DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT",
      blocker: "Student identity functions belong to the already separated student identity contract.",
      nextAction: "Keep blocked until student identity deployment/history decision is explicit.",
    };
  }
  if (row.category === "AOE") {
    return {
      decision: "DEFER_TO_AOE_RECONCILIATION",
      blocker: "AOE function body/grant changes need dedicated domain review.",
      nextAction: "Compare intended AOE runtime behavior before generating SQL.",
    };
  }
  if (row.reconciliation_status === "REMOTE_OVERLOAD_ONLY") {
    return {
      decision: "MANUAL_PRODUCT_DECISION_REQUIRED",
      blocker: "Remote overload may preserve production behavior not present locally.",
      nextAction: "Decide whether to backfill local migration, keep remote-only, or deprecate safely.",
    };
  }
  if (row.reconciliation_status === "BODY_DIFFERENT") {
    return {
      decision: "MANUAL_SECURITY_AND_BUSINESS_LOGIC_REVIEW_REQUIRED",
      blocker: "Normalized function body differs; automated replacement could alter production behavior.",
      nextAction: "Diff local and remote bodies with owner approval, then create a narrow migration.",
    };
  }
  return {
    decision: "NO_PHASE3_SQL_ACTION",
    blocker: "No unambiguous SQL action.",
    nextAction: "Keep as audit evidence.",
  };
}

function buildDependencyGraph(rows) {
  const localTableNames = new Set((schemaEquivalence.tables?.byStatus?.EQUIVALENT || []).map((row) => row.object));
  for (const row of [...(schemaEquivalence.localOnlyObjects || []), ...(schemaEquivalence.remoteOnlyObjects || [])]) {
    if (row.category === "table") localTableNames.add(row.object);
  }
  const functionNames = new Set(rows.map((row) => row.function_name));
  const nodes = rows.map((row) => {
    const local = localByKey.get(signatureKey(row.function_name, row.signature));
    const definition = local?.definition || "";
    return {
      id: signatureKey(row.function_name, row.signature),
      function_name: row.function_name,
      signature: row.signature,
      category: row.category,
      reconciliation_status: row.reconciliation_status,
      depends_on_tables: extractNames(definition, localTableNames),
      calls_functions: extractCalls(definition, functionNames, row.function_name),
    };
  });
  const edges = nodes.flatMap((node) => [
    ...node.depends_on_tables.map((target) => ({ source: node.id, target: `public.${target}`, type: "TABLE_REFERENCE" })),
    ...node.calls_functions.map((target) => ({ source: node.id, target: `public.${target}`, type: "FUNCTION_CALL" })),
  ]);
  return { nodes, edges };
}

function summarize(rows) {
  return {
    by_category: countBy(rows, (row) => row.category),
    by_status: countBy(rows, (row) => row.reconciliation_status),
    by_decision: countBy(rows, (row) => row.phase3_decision),
  };
}

function renderScopeMd(result, rows) {
  return `# Phase 3 Function Reconciliation Scope

Decision: ${result.decision}

Migration decision: ${result.migration_decision}

Remote link state: ${result.remote_link_state}

No function was selected for an automatic Phase 3 migration. The remaining differences are business-logic or ownership-sensitive and require explicit review.

## Scope Summary

${renderCounts(result.summary.by_decision)}

## Functions Requiring Review

${rows.map((row) => `- ${row.function_name}(${row.signature}) - ${row.reconciliation_status} - ${row.phase3_decision}`).join("\n")}
`;
}

function renderSummaryMd(result, rows) {
  return `# Phase 3 Function/RPC Reconciliation Audit

Decision: ${result.decision}

Migration decision: ${result.migration_decision}

Remote safety: ${result.remote_link_state}; no remote database command was executed.

## Findings

- Functions/RPCs reviewed: ${rows.length}
- Included in new SQL migration: ${result.included_in_phase3_migration}
- Deferred or blocked: ${result.deferred_or_blocked}

## Category Counts

${renderCounts(result.summary.by_category)}

## Status Counts

${renderCounts(result.summary.by_status)}

## Decision Counts

${renderCounts(result.summary.by_decision)}

## Conclusion

Phase 3 produced inventory, dependency and scope artifacts only. A new migration was intentionally not created because the function differences include remote overloads, body differences and feature-line contracts that are not safe to reconcile automatically.
`;
}

function classifyFunction(name) {
  if (/^aoe_/i.test(name)) return "AOE";
  if (/^(salvar_treino_composto|entregar_treino|alterar_estado_treino)$/i.test(name)) return "WORKOUT_DELIVERY";
  if (/^(vincular_aluno_usuario|desvincular_aluno_usuario|get_my_student_workouts)$/i.test(name)) return "STUDENT_IDENTITY";
  if (/assinatura|assinante|liberar_beta|plano|pagamento|vencimento/i.test(name)) return "FINANCIAL";
  if (/^admin_/i.test(name)) return "ADMIN";
  if (/updated_at|timestamp|handle_new_user/i.test(name)) return "UTILITY";
  return "UNKNOWN";
}

function extractSearchPath(definition) {
  const match = definition.match(/SET\s+search_path\s+TO\s+([^\n]+)/i) || definition.match(/set_config\('search_path',\s*'([^']+)'/i);
  return match ? match[1].replace(/;$/, "").trim() : "";
}

function extractRemoteHash(diff) {
  const text = diff?.source_migration || "";
  const definitionSegment = text.match(/definition:.*?(?=$|; [a-z_]+:)/i)?.[0] || text;
  const match = definitionSegment.match(/remote_hash=([0-9a-f]+)/i);
  return match?.[1] || "";
}

function summarizeGrantEvidence(diff) {
  const grants = diff?.new_evidence?.grants_by_signature || [];
  if (!grants.length) return "";
  return [...new Set(grants.map((grant) => `${grant.grantee}.${grant.privilege_type}.${grant.classification}`))].sort().join("; ");
}

function extractNames(definition, names) {
  const lower = definition.toLowerCase();
  return [...names].filter((name) => lower.includes(`public.${name.toLowerCase()}`) || lower.includes(`${name.toLowerCase()}.`)).sort();
}

function extractCalls(definition, names, self) {
  const lower = definition.toLowerCase();
  return [...names].filter((name) => name !== self && lower.includes(`public.${name.toLowerCase()}(`)).sort();
}

function normalizeDefinition(definition) {
  return definition.replace(/\s+/g, " ").trim().toLowerCase();
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

function signatureKey(name, signature = "") {
  return `${name}(${String(signature || "").replace(/\s+/g, " ").trim()})`;
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(reportDir, relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  writeFileSync(join(reportDir, relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function groupBy(items, fn) {
  const map = new Map();
  for (const item of items) {
    const key = fn(item);
    map.set(key, [...(map.get(key) || []), item]);
  }
  return map;
}

function countBy(items, fn) {
  return items.reduce((acc, item) => {
    const key = fn(item) || "UNKNOWN";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function pick(value, keys) {
  return Object.fromEntries(keys.map((key) => [key, value[key]]));
}

function renderCounts(counts) {
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `- ${key}: ${value}`)
    .join("\n");
}

function toCsv(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  return `${headers.join(",")}\n${rows.map((row) => headers.map((header) => csvCell(row[header])).join(",")).join("\n")}\n`;
}

function csvCell(value) {
  if (Array.isArray(value)) return csvCell(value.join("; "));
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
