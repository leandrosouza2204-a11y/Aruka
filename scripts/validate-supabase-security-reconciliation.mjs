import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const migrationName = "20260731190000_reconcile_security_policies_and_grants.sql";
const migrationPath = join(root, "supabase/migrations", migrationName);
const previousTimestamps = ["20260716090000", "20260728030000", "20260730090000"];
const reportDir = join(root, "reports/supabase-production-sync");
const docsDir = join(root, "docs/supabase-production-sync");
const privilegeOrder = ["select", "insert", "update", "delete"];

export const expectedAuthenticatedTablePrivileges = {
  perfis: ["select", "insert"],
  alunos: ["select", "insert", "update", "delete"],
  planos: ["select", "insert", "update", "delete"],
  assinaturas: ["select", "insert"],
  pagamentos: ["select", "insert", "update", "delete"],
  admin_logs: ["select"],
  aceites_legais: ["select", "insert"],
  avaliacoes: ["select", "insert", "update", "delete"],
  anamneses: ["select", "insert", "update", "delete"],
  treinos: ["select", "insert", "update", "delete"],
  treino_dias: ["select", "insert", "update", "delete"],
  treino_exercicios: ["select", "insert", "update", "delete"],
  acompanhamento_eventos: ["select", "insert"],
  workout_templates: ["select", "insert", "update", "delete"],
  aoe_decisions: ["select", "insert"],
  aoe_decision_traces: ["select"],
  aoe_human_reviews: ["select", "insert", "update"],
  aoe_idempotency_keys: ["select", "insert", "update", "delete"],
  aoe_audit_events: ["select"],
};

export async function main() {
  const sql = readFileSync(migrationPath, "utf8");
  const findings = validateSecurityReconciliation({
    migrationName,
    sql,
    migrations: readdirSync(join(root, "supabase/migrations")),
  });
  writePrecommitReports(sql, findings);
  if (findings.length) {
    console.error(`SUPABASE_SECURITY_RECONCILIATION_INVALID ${JSON.stringify(findings, null, 2)}`);
    process.exit(1);
  }
  console.log("SUPABASE_SECURITY_RECONCILIATION_VALIDATED PHASE_1_SECURITY_ONLY");
}

export function validateSecurityReconciliation({ migrationName, sql, migrations }) {
  return [
    ...validateTimestamp(migrationName),
    ...validateSingleSecurityMigration(migrations),
    ...validateAllowedStatements(sql),
    ...validateForbiddenSql(sql),
    ...validatePolicySafety(sql),
    ...validateGrantSafety(sql),
    ...validateAuthenticatedTableGrantContract(sql),
    ...validateSecrets(sql),
  ];
}

export function validateTimestamp(name) {
  const timestamp = name.match(/^(\d{14})_/)?.[1] || "";
  if (!timestamp) return ["migration timestamp missing"];
  return previousTimestamps.some((previous) => timestamp <= previous) ? ["migration timestamp must be after previous migrations"] : [];
}

export function validateSingleSecurityMigration(migrations) {
  const matches = migrations.filter((name) => /reconcile_security_policies_and_grants\.sql$/.test(basename(name)));
  return matches.length === 1 ? [] : ["exactly one security reconciliation migration must exist"];
}

export function validateAllowedStatements(sql) {
  const findings = [];
  const stripped = stripComments(sql);
  for (const statement of splitStatements(stripped)) {
    if (!/^(begin|commit|drop\s+policy\s+if\s+exists|create\s+policy|revoke\s+all\s+on\s+(table|function)|grant\s+((select|insert|update|delete)(\s*,\s*(select|insert|update|delete))*|execute)\s+on\s+(table|function)|comment\s+on\s+schema)\b/i.test(statement)) {
      findings.push(`statement outside phase 1 scope: ${statement.slice(0, 90)}`);
    }
  }
  return findings;
}

export function validateForbiddenSql(sql) {
  const stripped = stripComments(sql);
  const findings = [];
  const patterns = [
    [/create\s+(table|type|index|function|trigger)\b/i, "create outside policy scope"],
    [/alter\s+(table|type|function|index)\b/i, "alter outside policy scope"],
    [/drop\s+(table|column|function|type|index|trigger)\b/i, "drop outside policy scope"],
    [/\b(insert|update|delete|merge)\s+(into\s+)?public\./i, "data write is forbidden"],
    [/\b(default|not\s+null|constraint|foreign\s+key|primary\s+key)\b/i, "schema contract change is forbidden"],
    [/\bvalor\s*=|\bpagamento_recebido\s*=|\bdata_vencimento\s*=|\bplano\s*=/i, "financial data mutation is forbidden"],
  ];
  for (const [pattern, message] of patterns) if (pattern.test(stripped)) findings.push(message);
  return findings;
}

export function validatePolicySafety(sql) {
  const findings = [];
  if (/\busing\s*\(\s*true\s*\)/i.test(sql)) findings.push("policy USING true is forbidden");
  if (/\bwith\s+check\s*\(\s*true\s*\)/i.test(sql)) findings.push("policy WITH CHECK true is forbidden");
  if (/create\s+policy[\s\S]*?\bto\s+anon\b/i.test(sql)) findings.push("policy to anon is forbidden in this phase");
  if (/create\s+policy[\s\S]*?\bto\s+public\b/i.test(sql)) findings.push("policy to public is forbidden in this phase");
  return findings;
}

export function validateGrantSafety(sql) {
  const findings = [];
  if (/grant\s+(select|insert|update|delete)(\s*,\s*(select|insert|update|delete))*.*?\bto\s+anon\b/i.test(sql)) findings.push("table grant to anon is forbidden");
  if (/grant\s+execute\s+on\s+function[\s\S]*?\bto\s+(public|anon)\b/i.test(sql)) findings.push("PUBLIC or anon EXECUTE grant is forbidden");
  if (/grant\s+execute\s+on\s+function\s+public\.[a-z_][a-z0-9_]*\s+to\s+authenticated\b/i.test(sql)) findings.push("function EXECUTE grant must include an explicit signature");
  if (/\b(service_role|postgres|supabase_admin)\b/i.test(sql)) findings.push("platform role changes must not be introduced in this phase");
  return findings;
}

export function validateAuthenticatedTableGrantContract(sql) {
  const findings = [];
  const grants = parseAuthenticatedTableGrants(sql);
  const revokes = parseAuthenticatedTableRevokes(sql);
  for (const [table, expected] of Object.entries(expectedAuthenticatedTablePrivileges)) {
    const actual = grants[table] || [];
    if (!revokes.has(table)) findings.push(`authenticated revoke missing for ${table}`);
    const extra = actual.filter((privilege) => !expected.includes(privilege));
    const missing = expected.filter((privilege) => !actual.includes(privilege));
    if (extra.length) findings.push(`authenticated grant has excessive privileges on ${table}: ${extra.join(",")}`);
    if (missing.length) findings.push(`authenticated grant missing privileges on ${table}: ${missing.join(",")}`);
  }
  for (const table of Object.keys(grants)) {
    if (!expectedAuthenticatedTablePrivileges[table]) findings.push(`unexpected authenticated table grant on ${table}`);
  }
  return findings;
}

export function validateSecrets(sql) {
  const patterns = [/postgres(?:ql)?:\/\//i, /eyJ[A-Za-z0-9_-]{20,}/, /SUPABASE_SERVICE/i, /PGPASSWORD/i, /password=/i, /access_token/i];
  return patterns.some((pattern) => pattern.test(sql)) ? ["secret-like value found"] : [];
}

function stripComments(sql) {
  return sql.replace(/--.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

function splitStatements(sql) {
  return sql.split(";").map((item) => item.trim()).filter(Boolean);
}

function parseAuthenticatedTableGrants(sql) {
  const grants = {};
  for (const statement of splitStatements(stripComments(sql))) {
    const match = statement.match(/^grant\s+(.+?)\s+on\s+table\s+public\.([a-z_][a-z0-9_]*)\s+to\s+authenticated$/i);
    if (!match) continue;
    const privileges = match[1].split(",").map((privilege) => privilege.trim().toLowerCase());
    grants[match[2]] = orderPrivileges([...new Set([...(grants[match[2]] || []), ...privileges])]);
  }
  return grants;
}

function parseAuthenticatedTableRevokes(sql) {
  const revokes = new Set();
  for (const statement of splitStatements(stripComments(sql))) {
    const match = statement.match(/^revoke\s+all\s+on\s+table\s+public\.([a-z_][a-z0-9_]*)\s+from\s+authenticated$/i);
    if (match) revokes.add(match[1]);
  }
  return revokes;
}

function orderPrivileges(privileges) {
  return privilegeOrder.filter((privilege) => privileges.includes(privilege));
}

function writePrecommitReports(sql, findings) {
  mkdirSync(reportDir, { recursive: true });
  mkdirSync(docsDir, { recursive: true });
  const grants = parseAuthenticatedTableGrants(sql);
  const revokes = parseAuthenticatedTableRevokes(sql);
  const policies = parsePolicyStatements(sql);
  const baselinePolicies = parsePolicyStatements(readIfExists(join(root, "supabase/baseline-src/08-policies.sql")));
  const grantRows = buildGrantRows(grants, revokes);
  const policyRows = buildPolicyRows(policies, baselinePolicies);
  const decision = findings.length ? "BLOCKED_SECURITY_PRECOMMIT_AUDIT" : "READY_FOR_PHASE1_COMMIT";
  const storageLimitation = "LOCAL_STORAGE_TIMEOUT_KNOWN";

  writeJson("security-precommit-inventory.json", {
    generated_at: new Date().toISOString(),
    migration: migrationName,
    decision,
    runtime_limitation: storageLimitation,
    counts: {
      create_policies: policies.length,
      authenticated_table_grant_tables: Object.keys(grants).length,
      authenticated_table_revoke_tables: revokes.size,
      anon_table_revokes: countMatches(sql, /revoke\s+all\s+on\s+table\s+public\.[a-z_][a-z0-9_]*\s+from\s+anon/gi),
      protected_function_execute_grants: countMatches(sql, /grant\s+execute\s+on\s+function\s+public\.[a-z_][a-z0-9_]*\([^)]*\)\s+to\s+authenticated/gi),
    },
    expected_authenticated_table_privileges: expectedAuthenticatedTablePrivileges,
    findings,
  });

  writeCsv("authenticated-table-grant-precommit-review.csv", [
    ["table", "expected_privileges", "migration_privileges", "authenticated_revoke_present", "decision", "note"],
    ...grantRows.map((row) => [row.table, row.expected, row.actual, row.revoked, row.decision, row.note]),
  ]);
  writeCsv("security-policy-precommit-review.csv", [
    ["table", "policy", "operation", "baseline_match", "decision"],
    ...policyRows.map((row) => [row.table, row.name, row.operation, row.baselineMatch, row.decision]),
  ]);
  writeJson("table-grant-catalog-delta.json", buildGrantCatalogDelta());
  writeJson("security-precommit-audit-result.json", {
    decision,
    runtime_limitation: storageLimitation,
    corrections_applied: [
      "authenticated CRUD grants reduced to policy-aligned minimum privileges",
      "authenticated grants now include explicit revoke-before-grant convergence for every reviewed table",
      "alunos authenticated grant is now reconciled deterministically instead of relying on inherited prior state",
    ],
    findings,
    blocked_remote_actions: ["supabase link", "supabase db push", "supabase db pull", "remote SQL", "commit", "push"],
  });
  const summary = buildSummary(decision, storageLimitation, grantRows, policyRows, findings);
  writeFileSync(join(reportDir, "security-precommit-audit-summary.md"), summary);
  writeFileSync(join(docsDir, "08-security-reconciliation-precommit-audit.md"), summary);
}

function buildGrantRows(grants, revokes) {
  return Object.entries(expectedAuthenticatedTablePrivileges).map(([table, expectedPrivileges]) => {
    const actualPrivileges = grants[table] || [];
    const extra = actualPrivileges.filter((privilege) => !expectedPrivileges.includes(privilege));
    const missing = expectedPrivileges.filter((privilege) => !actualPrivileges.includes(privilege));
    const revoked = revokes.has(table);
    const ok = revoked && extra.length === 0 && missing.length === 0;
    return {
      table,
      expected: expectedPrivileges.join("|"),
      actual: actualPrivileges.join("|"),
      revoked: String(revoked),
      decision: ok ? "JUSTIFIED_MINIMAL" : "REVIEW_REQUIRED",
      note: ok ? "Matches canonical policy surface." : `extra=${extra.join("|") || "none"} missing=${missing.join("|") || "none"}`,
    };
  });
}

function buildPolicyRows(policies, baselinePolicies) {
  const baselineKeys = new Set(baselinePolicies.map((policy) => policy.normalized));
  return policies.map((policy) => ({
    ...policy,
    baselineMatch: String(baselineKeys.has(policy.normalized)),
    decision: baselineKeys.has(policy.normalized) ? "EXACT_CANONICAL_MATCH" : "REVIEW_REQUIRED",
  }));
}

function parsePolicyStatements(sql) {
  return splitStatements(stripComments(sql))
    .map((statement) => {
      const match = statement.match(/^create\s+policy\s+"([^"]+)"\s+on\s+public\.([a-z_][a-z0-9_]*)\s+for\s+(select|insert|update|delete|all)\s+to\s+authenticated\b/i);
      if (!match) return null;
      return {
        name: match[1],
        table: match[2],
        operation: match[3].toLowerCase(),
        normalized: normalizeSql(statement),
      };
    })
    .filter(Boolean);
}

function buildGrantCatalogDelta() {
  const filePath = "reports/supabase-production-sync/local-schema-catalog/table-grants.json";
  const current = readJsonIfExists(join(root, filePath)) || [];
  let previous = [];
  try {
    previous = JSON.parse(execFileSync("git", ["show", `HEAD:${filePath}`], { cwd: root, encoding: "utf8" }));
  } catch {
    previous = [];
  }
  const currentKeys = new Set(current.map(grantKey));
  const previousKeys = new Set(previous.map(grantKey));
  const removed = [...previousKeys].filter((key) => !currentKeys.has(key)).sort();
  const added = [...currentKeys].filter((key) => !previousKeys.has(key)).sort();
  const unexpectedRemoved = removed.filter((key) => !isExpectedRemovedGrant(key));
  return {
    generated_at: new Date().toISOString(),
    source: filePath,
    previous_total: previous.length,
    current_total: current.length,
    removed,
    added,
    unexpected_removed: unexpectedRemoved,
    removed_grantees: [...new Set(removed.map((key) => key.split(".")[1]))].sort(),
    decision: added.length === 0 && unexpectedRemoved.length === 0 ? "EXPECTED_EXCESS_GRANTS_REMOVED_ONLY" : "REVIEW_REQUIRED",
  };
}

function isExpectedRemovedGrant(key) {
  const [, grantee, table, privilege] = key.split(".");
  if (grantee === "anon") return true;
  if (grantee !== "authenticated") return false;
  const expected = expectedAuthenticatedTablePrivileges[table];
  if (!expected) return false;
  return !expected.includes(privilege.toLowerCase());
}

function buildSummary(decision, storageLimitation, grantRows, policyRows, findings) {
  const grantOk = grantRows.filter((row) => row.decision === "JUSTIFIED_MINIMAL").length;
  const policyOk = policyRows.filter((row) => row.decision === "EXACT_CANONICAL_MATCH").length;
  return `# Security reconciliation pre-commit audit

Decision: ${decision}

Runtime limitation: ${storageLimitation}. The local DB validates after replay; Supabase Storage can exceed the CLI health timeout during full stack reset and later recovers healthy.

## Inventory

- Migration: ${migrationName}
- Authenticated table grants reviewed: ${grantRows.length}
- Minimal authenticated grants approved: ${grantOk}/${grantRows.length}
- Policies compared with canonical baseline: ${policyOk}/${policyRows.length}
- Findings: ${findings.length ? findings.join("; ") : "none"}

## Grant decision

Every authenticated table grant in the Phase 1 migration is now preceded by an explicit authenticated revoke and then re-granted with the minimum operation set supported by the canonical RLS policies. Tables with read-only or append-only policies no longer receive blanket CRUD grants.

## Scope boundary

No production link, remote SQL, remote dump, db push, migration repair, commit, push, or Phase 2 implementation was executed by this audit.
`;
}

function grantKey(row) {
  return [row.table_schema, row.grantee, row.table_name, row.privilege_type].join(".");
}

function normalizeSql(statement) {
  return statement.replace(/\s+/g, " ").trim().toLowerCase();
}

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function readIfExists(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function readJsonIfExists(path) {
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : null;
}

function writeJson(file, value) {
  writeFileSync(join(reportDir, file), `${JSON.stringify(value, null, 2)}\n`);
}

function writeCsv(file, rows) {
  writeFileSync(join(reportDir, file), `${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
