import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { queryJson } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const inputDir = join(root, "reports/supabase-production-sync/remote-schema-input");
const outputDir = join(root, "reports/supabase-production-sync");
const localCatalogDir = join(outputDir, "local-schema-catalog");

const previousCounts = {
  critical: 480,
  defaultDifferent: 169,
  constraintDifferent: 70,
  policyDifferent: 51,
  functionDifferent: 17,
  localOnly: 20,
  remoteOnly: 100,
  equivalent: 737,
};

const categories = {
  tables: ["table_name"],
  columns: ["table_name", "ordinal_position", "column_name", "data_type", "udt_name", "is_nullable", "column_default"],
  constraints: ["schema_name", "table_name", "constraint_name", "constraint_type", "definition"],
  indexes: ["tablename", "indexname", "indexdef"],
  policies: ["schemaname", "tablename", "policyname", "permissive", "roles", "cmd", "qual", "with_check"],
  functions: ["function_name", "arguments", "return_type", "security_definer", "volatility", "definition"],
  rls: ["table_name", "rls_enabled", "rls_forced"],
  tableGrants: ["table_name", "grantee", "privilege_type"],
  functionGrants: ["routine_name", "grantee", "privilege_type"],
};

const sourceMigrationRules = [
  [/^treino_eventos\b|^treinos\.(lifecycle_status|template_origin_|template_snapshot|applied_|delivered_|completed_at|archived_at|data_fim|application_idempotency_key)|^salvar_treino_composto\b|^entregar_treino\b|^alterar_estado_treino\b/i, "20260728030000_workout_delivery_integration_v1.sql"],
  [/^alunos\.student_user_id$|^perfis\.perfis_role_check$|alunos_student_user_id|^vincular_aluno_usuario\b|^desvincular_aluno_usuario\b|^get_my_student_workouts\b/i, "20260730090000_student_identity_contract.sql"],
];

export async function main() {
  const errors = [];
  const secretFindings = [];

  mkdirSync(outputDir, { recursive: true });
  mkdirSync(localCatalogDir, { recursive: true });

  if (!existsSync(inputDir)) errors.push(`Missing CSV input directory: ${inputDir}`);

  const csvFiles = existsSync(inputDir)
    ? readdirSync(inputDir, { withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".csv"))
        .map((entry) => join(inputDir, entry.name))
        .sort()
    : [];

  if (csvFiles.length !== 9) errors.push(`Expected 9 CSV files, found ${csvFiles.length}`);

  const remote = {};
  const evidence = [];
  for (const file of csvFiles) {
    const bytes = readFileSync(file);
    const text = bytes.toString("utf8");
    secretFindings.push(...scanSecrets(text, basename(file)));
    const bom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
    const rows = parseCsv(text.replace(/^\uFEFF/, ""));
    if (rows.length < 1) {
      errors.push(`CSV empty or invalid: ${basename(file)}`);
      continue;
    }
    const header = rows[0].map((item) => item.trim());
    const category = detectCategory(header);
    if (!category) {
      errors.push(`Could not classify CSV ${basename(file)} with headers: ${header.join(",")}`);
      continue;
    }
    if (remote[category]) errors.push(`Duplicate CSV category ${category}: ${basename(file)} and ${remote[category].file}`);
    const objects = rows.slice(1).filter((row) => row.some((cell) => String(cell).trim() !== "")).map((row) => rowToObject(header, row));
    remote[category] = { file: basename(file), header, rows: objects };
    evidence.push({ file: basename(file), category, bytes: bytes.length, rows: objects.length, bom, delimiter: "," });
  }

  for (const category of Object.keys(categories)) {
    if (!remote[category]) errors.push(`Missing CSV category: ${category}`);
  }
  if (secretFindings.length) {
    errors.push(`Potential secret patterns found in remote evidence: ${secretFindings.map((item) => `${item.file}:${item.line}:${item.kind}`).join("; ")}`);
  }

  const local = collectLocalCatalog();
  for (const [name, rows] of Object.entries(local)) {
    writeFileSync(join(localCatalogDir, `${kebab(name)}.json`), `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  }

  const comparisons = compareCatalogs(local, remote);
  const matrix = Object.values(comparisons).flat().sort((a, b) => `${a.category}.${a.object}.${a.subobject}`.localeCompare(`${b.category}.${b.object}.${b.subobject}`));
  const criticalDifferences = matrix.filter((row) => row.severity === "critical");
  const nonCriticalDifferences = matrix.filter((row) => row.severity === "warning");
  const informationalDifferences = matrix.filter((row) => row.severity === "informational");
  const equivalentObjects = matrix.filter((row) => row.status === "EQUIVALENT" || row.status.startsWith("EQUIVALENT_"));
  const localOnlyObjects = matrix.filter((row) => row.status === "LOCAL_ONLY" || row.status === "LOCAL_OVERLOAD_ONLY");
  const remoteOnlyObjects = matrix.filter((row) => row.status === "REMOTE_ONLY" || row.status === "REMOTE_OVERLOAD_ONLY");
  const partiallyVerifiedObjects = matrix.filter((row) => row.status === "PARTIALLY_VERIFIED");

  const migrationCoverage = assessMigrationCoverage(matrix);
  if (migrationCoverage.studentIdentity.localOnly && migrationCoverage.studentIdentity.equivalent === 0) {
    migrationCoverage.studentIdentity.assessment = "absent";
  }
  const decision = decide({ errors, secretFindings, criticalDifferences, remoteOnlyObjects });
  const migrationRepairAssessment = assessRepair({ criticalDifferences, localOnlyObjects, remoteOnlyObjects, partiallyVerifiedObjects, errors });
  const productionActionRequired = decision === "REMOTE_SCHEMA_MATERIALLY_EQUIVALENT_UNTRACKED" ? "HISTORY_ALIGNMENT_REVIEW_REQUIRED" : "RECONCILIATION_REQUIRED";
  const normalizationImpact = buildNormalizationImpact(matrix);

  const result = {
    auditorDecision: normalizationImpact.falsePositivesCorrected ? "AUDITOR_FALSE_POSITIVES_CORRECTED" : "AUDITOR_RESULTS_CONFIRMED",
    decision,
    branch: runGit(["branch", "--show-current"]),
    commit: runGit(["log", "-1", "--oneline"]),
    inputDecision: "SCHEMA_EQUIVALENCE_AUDITOR_REVIEW_REQUIRED",
    inputEvidence: { directory: "reports/supabase-production-sync/remote-schema-input", files: evidence, errors },
    localSource: { catalog: "local Postgres catalog", files: Object.keys(local).map((name) => `reports/supabase-production-sync/local-schema-catalog/${kebab(name)}.json`) },
    remoteSource: { catalog: "manual SQL Editor CSV exports", linkedState: "UNLINKED_FOR_SAFETY" },
    tables: summarize(comparisons.tables),
    columns: summarize(comparisons.columns),
    constraints: summarize(comparisons.constraints),
    indexes: summarize(comparisons.indexes),
    rls: summarize(comparisons.rls),
    policies: summarize(comparisons.policies),
    functions: summarize(comparisons.functions),
    tableGrants: summarize(comparisons.tableGrants),
    functionGrants: summarize(comparisons.functionGrants),
    migrationCoverage,
    baselineAssessment: migrationCoverage.baseline,
    workoutDeliveryAssessment: migrationCoverage.workoutDelivery,
    studentIdentityAssessment: migrationCoverage.studentIdentity,
    criticalDifferences,
    nonCriticalDifferences,
    informationalDifferences,
    partiallyVerifiedObjects,
    localOnlyObjects,
    remoteOnlyObjects,
    equivalentObjects: equivalentObjects.slice(0, 200),
    equivalentObjectsTotal: equivalentObjects.length,
    normalizationImpact,
    migrationRepairAssessment,
    productionActionRequired,
    recommendedNextSteps: recommendedNextSteps(decision, migrationRepairAssessment, partiallyVerifiedObjects.length),
    commandsNotExecuted: ["supabase db push", "supabase db pull", "supabase migration repair", "supabase db reset --linked", "supabase db dump --linked", "remote SQL execution"],
  };

  writeFileSync(join(outputDir, "schema-equivalence-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  writeFileSync(join(outputDir, "schema-equivalence-matrix.csv"), toCsv(matrix), "utf8");
  writeFileSync(join(outputDir, "schema-equivalence-summary.md"), renderSummary(result), "utf8");
  writeFileSync(join(root, "docs/supabase-production-sync/02-schema-equivalence-audit.md"), renderSummary(result), "utf8");
  writeFileSync(join(root, "docs/supabase-production-sync/03-reconciliation-plan.md"), renderReconciliationPlan(result), "utf8");

  if (errors.length || secretFindings.length) {
    console.error(`SUPABASE_SCHEMA_EQUIVALENCE_AUDIT_BLOCKED: ${errors.join("; ")}`);
    process.exit(1);
  }

  console.log(`SUPABASE_SCHEMA_EQUIVALENCE_AUDITED ${decision}`);
}

export function collectLocalCatalog() {
  const queries = {
    tables: "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name",
    columns: `select table_name, ordinal_position::text as ordinal_position, column_name, data_type, udt_name, is_nullable, column_default from information_schema.columns where table_schema = 'public' order by table_name, ordinal_position`,
    constraints: `select n.nspname as schema_name, c.relname as table_name, con.conname as constraint_name, con.contype::text as constraint_type, pg_get_constraintdef(con.oid) as definition from pg_constraint con join pg_class c on c.oid = con.conrelid join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' order by c.relname, con.conname`,
    indexes: "select tablename, indexname, indexdef from pg_indexes where schemaname = 'public' order by tablename, indexname",
    policies: "select schemaname, tablename, policyname, permissive, roles::text as roles, cmd, qual, with_check from pg_policies where schemaname = 'public' order by tablename, policyname",
    functions: `select p.proname as function_name, pg_get_function_identity_arguments(p.oid) as arguments, pg_get_function_result(p.oid) as return_type, l.lanname as language, p.prosecdef::text as security_definer, case p.provolatile when 'i' then 'IMMUTABLE' when 's' then 'STABLE' else 'VOLATILE' end as volatility, p.proisstrict::text as strict, p.proparallel::text as parallel, pg_get_functiondef(p.oid) as definition from pg_proc p join pg_namespace n on n.oid = p.pronamespace join pg_language l on l.oid = p.prolang where n.nspname = 'public' order by p.proname, arguments`,
    rls: "select c.relname as table_name, c.relrowsecurity::text as rls_enabled, c.relforcerowsecurity::text as rls_forced from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' order by c.relname",
    tableGrants: "select table_name, grantee, privilege_type from information_schema.table_privileges where table_schema = 'public' order by table_name, grantee, privilege_type",
    functionGrants: "select routine_name, grantee, privilege_type from information_schema.routine_privileges where specific_schema = 'public' order by routine_name, grantee, privilege_type",
  };
  return Object.fromEntries(Object.entries(queries).map(([name, sql]) => [name, queryJson(root, sql)]));
}

export function compareCatalogs(local, remote) {
  return {
    tables: compareGeneric("table", indexBy(local.tables, (row) => row.table_name), indexBy(remote.tables?.rows || [], (row) => row.table_name), compareTable),
    columns: compareGeneric("column", indexBy(local.columns, (row) => `${row.table_name}.${row.column_name}`), indexBy(remote.columns?.rows || [], (row) => `${row.table_name}.${row.column_name}`), compareColumn),
    constraints: compareGeneric("constraint", indexBy(local.constraints, (row) => `${row.table_name}.${row.constraint_name}`), indexBy(remote.constraints?.rows || [], (row) => `${row.table_name}.${row.constraint_name}`), compareConstraint),
    indexes: compareGeneric("index", indexBy(local.indexes, (row) => `${row.tablename}.${row.indexname}`), indexBy(remote.indexes?.rows || [], (row) => `${row.tablename}.${row.indexname}`), compareIndex),
    rls: compareGeneric("rls", indexBy(local.rls, (row) => row.table_name), indexBy(remote.rls?.rows || [], (row) => row.table_name), compareRls),
    policies: compareGeneric("policy", indexBy(local.policies, (row) => `${row.tablename}.${row.policyname}`), indexBy(remote.policies?.rows || [], (row) => `${row.tablename}.${row.policyname}`), comparePolicy),
    functions: compareGeneric("function", indexBy(local.functions, functionKey), indexBy(remote.functions?.rows || [], functionKey), compareFunction),
    tableGrants: compareGeneric("table_grant", indexBy(local.tableGrants, (row) => `${row.table_name}.${normalizeRoleName(row.grantee)}.${row.privilege_type}`), indexBy(remote.tableGrants?.rows || [], (row) => `${row.table_name}.${normalizeRoleName(row.grantee)}.${row.privilege_type}`), compareTableGrant),
    functionGrants: compareFunctionGrants(local.functionGrants, remote.functionGrants?.rows || []),
  };
}

function compareGeneric(category, localMap, remoteMap, comparator) {
  const out = [];
  const keys = [...new Set([...localMap.keys(), ...remoteMap.keys()])].sort();
  for (const key of keys) {
    const localRow = localMap.get(key);
    const remoteRow = remoteMap.get(key);
    const object = objectName(category, key);
    const subobject = subobjectName(category, key);
    const source = sourceMigrationFor(category, key);
    if (!localRow) {
      out.push(row(category, object, subobject, "absent", "present", remoteOnlyStatus(category), "critical", source, "Object exists only in remote evidence.", "Review as remote drift before any repair."));
    } else if (!remoteRow) {
      out.push(row(category, object, subobject, "present", "absent", localOnlyStatus(category), "critical", source, "Object exists locally but not in remote evidence.", "Do not repair this migration as applied until reconciled."));
    } else {
      out.push(row(category, object, subobject, "present", "present", ...comparator(localRow, remoteRow, category, key), source));
    }
  }
  return out;
}

function compareTable() {
  return ["EQUIVALENT", "info", "Equivalent table presence.", "No action."];
}

export function compareColumn(localRow, remoteRow) {
  const comparisons = [
    compareField("data_type", localRow.data_type, remoteRow.data_type, normalizeType),
    compareField("udt_name", localRow.udt_name, remoteRow.udt_name, normalizeUdt),
    compareField("is_nullable", localRow.is_nullable, remoteRow.is_nullable, normalizeNullable),
    compareField("column_default", localRow.column_default, remoteRow.column_default, normalizeDefault),
  ];
  const material = comparisons.filter((item) => !item.equal);
  const order = compareField("ordinal_position", localRow.ordinal_position, remoteRow.ordinal_position, normalizeText);
  if (!material.length && order.equal) return ["EQUIVALENT", "info", detailsFor(comparisons, order), "No action."];
  if (!material.length && !order.equal) return ["COLUMN_ORDER_DIFFERENT_NON_MATERIAL", "informational", detailsFor(comparisons, order), "Preserve for diagnostics; do not block repair by column order alone."];
  if (material.some((item) => item.field === "is_nullable")) return ["NULLABILITY_DIFFERENT", "critical", detailsFor(comparisons, order), "Treat nullability drift as material."];
  if (material.some((item) => item.field === "data_type" || item.field === "udt_name")) return ["TYPE_DIFFERENT", "critical", detailsFor(comparisons, order), "Review type drift before reconciliation."];
  if (material.some((item) => item.field === "column_default")) return ["DEFAULT_DIFFERENT", "critical", detailsFor(comparisons, order), "Review default drift before reconciliation."];
  return ["MATERIAL_DIFFERENCE", "critical", detailsFor(comparisons, order), "Review column drift before reconciliation."];
}

export function compareConstraint(localRow, remoteRow) {
  const type = compareField("constraint_type", localRow.constraint_type, remoteRow.constraint_type, normalizeConstraintType);
  const definition = compareField("definition", localRow.definition, remoteRow.definition, normalizeConstraintDefinition);
  if (type.equal && definition.equal) {
    const representation = normalizeText(localRow.constraint_type) !== normalizeText(remoteRow.constraint_type) || normalizeSql(localRow.definition) !== normalizeSql(remoteRow.definition);
    return [representation ? "EQUIVALENT_REPRESENTATION_DIFFERENCE" : "EQUIVALENT", "info", detailsFor([type, definition]), "No action."];
  }
  return ["MATERIAL_DIFFERENCE", "critical", detailsFor([type, definition]), "Constraint drift is material; review before reconciliation."];
}

export function compareIndex(localRow, remoteRow) {
  const left = normalizeIndexDefinition(localRow.indexdef);
  const right = normalizeIndexDefinition(remoteRow.indexdef);
  const rawSame = normalizeSql(localRow.indexdef) === normalizeSql(remoteRow.indexdef);
  if (left === right) return [rawSame ? "EQUIVALENT" : "EQUIVALENT_EXPRESSION_REPRESENTATION", "info", comparedDetail("indexdef", localRow.indexdef, remoteRow.indexdef, left, right), "No action."];
  return ["MATERIAL_DIFFERENCE", "warning", comparedDetail("indexdef", localRow.indexdef, remoteRow.indexdef, left, right), "Review index expression, uniqueness, predicate, method and columns."];
}

function compareRls(localRow, remoteRow) {
  const checks = [
    compareField("rls_enabled", localRow.rls_enabled, remoteRow.rls_enabled, normalizeBoolean),
    compareField("rls_forced", localRow.rls_forced, remoteRow.rls_forced, normalizeBoolean),
  ];
  if (checks.every((item) => item.equal)) return ["EQUIVALENT", "info", detailsFor(checks), "No action."];
  return ["RLS_STATE_DIFFERENT", "critical", detailsFor(checks), "RLS state drift is security material."];
}

export function comparePolicy(localRow, remoteRow) {
  const roles = compareRoles(localRow.roles, remoteRow.roles);
  const checks = [
    compareField("permissive", localRow.permissive, remoteRow.permissive, normalizeText),
    roles,
    compareField("cmd", localRow.cmd, remoteRow.cmd, normalizeText),
    compareField("qual", localRow.qual, remoteRow.qual, normalizePolicyExpression),
    compareField("with_check", localRow.with_check, remoteRow.with_check, normalizePolicyExpression),
  ];
  const diff = checks.filter((item) => !item.equal);
  if (!diff.length) {
    const rawRoleSame = normalizeText(localRow.roles) === normalizeText(remoteRow.roles);
    return [rawRoleSame ? "EQUIVALENT" : "ROLE_REPRESENTATION_EQUIVALENT", "info", detailsFor(checks), "No action."];
  }
  if (!roles.equal) return [rolePermissivenessStatus(roles.localNormalized, roles.remoteNormalized), "critical", detailsFor(checks), "Review policy role scope before any production action."];
  return ["POLICY_EXPRESSION_DIFFERENT", "critical", detailsFor(checks), "Policy expression drift is material."];
}

export function compareFunction(localRow, remoteRow) {
  const checks = [
    compareField("return_type", localRow.return_type, remoteRow.return_type, normalizeType),
    compareField("security_definer", localRow.security_definer, remoteRow.security_definer, normalizeBoolean),
    compareField("volatility", localRow.volatility, remoteRow.volatility, normalizeVolatility),
    compareField("definition", localRow.definition, remoteRow.definition, normalizeFunctionBody),
  ];
  const diff = checks.filter((item) => !item.equal);
  if (!diff.length) return ["EQUIVALENT", "info", detailsFor(checks), "No action."];
  if (diff.some((item) => ["return_type", "security_definer"].includes(item.field))) return ["MATERIAL_DIFFERENCE", "critical", detailsFor(checks), "Function signature/security drift is critical."];
  if (diff.some((item) => item.field === "volatility")) return ["VOLATILITY_DIFFERENT", "critical", detailsFor(checks), "Function volatility drift is material."];
  return ["BODY_DIFFERENT", "critical", detailsFor(checks), "Function body normalized hash differs."];
}

function compareTableGrant(localRow, remoteRow) {
  const role = normalizeRoleName(localRow.grantee);
  const privilege = normalizeText(localRow.privilege_type);
  const dangerous = isDangerousTableGrant(role, privilege);
  return ["EQUIVALENT", dangerous ? "critical" : "info", `grant role=${role} privilege=${privilege}`, dangerous ? "Equivalent but security-sensitive grant; keep under review." : "No action."];
}

function compareFunctionGrants(localRows, remoteRows) {
  const localByName = indexGrantRows(localRows);
  const remoteByName = indexGrantRows(remoteRows);
  const names = [...new Set([...localByName.keys(), ...remoteByName.keys()])].sort();
  const out = [];
  for (const name of names) {
    const localSet = localByName.get(name) || new Set();
    const remoteSet = remoteByName.get(name) || new Set();
    for (const grant of [...new Set([...localSet, ...remoteSet])].sort()) {
      const [grantee, privilege] = grant.split(".");
      const key = `${name}.${grant}`;
      const source = sourceMigrationFor("function_grant", key);
      if (!localSet.has(grant)) {
        const critical = grantee === "public" || grantee === "anon";
        out.push(row("function_grant", name, grant, "absent", "present", "REMOTE_ONLY", critical ? "critical" : "warning", source, "Function grant exists only in remote evidence. CSV lacks function arguments/specific_name, so overload match is partial.", "Review function grants with signature-aware evidence before repair."));
      } else if (!remoteSet.has(grant)) {
        out.push(row("function_grant", name, grant, "present", "absent", "LOCAL_ONLY", "critical", source, "Function grant exists locally but not in remote evidence. CSV lacks function arguments/specific_name, so overload match is partial.", "Do not repair as applied until grants are reconciled."));
      } else {
        out.push(row("function_grant", name, grant, "present", "present", "PARTIALLY_VERIFIED", "warning", source, `routine_name-only grant match for ${grantee}.${privilege}; overload signature not present in remote CSV.`, "Use signature-aware read-only evidence before final grant equivalence."));
      }
    }
  }
  return out;
}

function compareField(field, localRaw, remoteRaw, normalize) {
  const localNormalized = normalize(localRaw);
  const remoteNormalized = normalize(remoteRaw);
  return { field, localRaw: displayRaw(localRaw), remoteRaw: displayRaw(remoteRaw), localNormalized, remoteNormalized, equal: localNormalized === remoteNormalized, localHash: stableHash(String(localNormalized)), remoteHash: stableHash(String(remoteNormalized)) };
}

export function normalizeDefault(value) {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  if (trimmed === "") return null;
  if (trimmed === "null") return null;
  return normalizeSql(trimmed)
    .replace(/\bpublic\./gi, "")
    .replace(/\bcurrent_timestamp\b/gi, "now()")
    .replace(/::timestamp with time zone/gi, "")
    .replace(/::timestamp without time zone/gi, "")
    .trim();
}

export function normalizeConstraintType(value) {
  const text = normalizeText(value).replace(/\s+/g, "_");
  const map = { p: "PRIMARY_KEY", primary_key: "PRIMARY_KEY", f: "FOREIGN_KEY", foreign_key: "FOREIGN_KEY", u: "UNIQUE", unique: "UNIQUE", c: "CHECK", check: "CHECK", x: "EXCLUSION", exclude: "EXCLUSION", exclusion: "EXCLUSION" };
  return map[text] || text;
}

export function normalizeVolatility(value) {
  const text = normalizeText(value);
  const map = { i: "IMMUTABLE", immutable: "IMMUTABLE", s: "STABLE", stable: "STABLE", v: "VOLATILE", volatile: "VOLATILE" };
  return map[text] || text.toUpperCase();
}

export function normalizeType(value) {
  const text = normalizeText(value);
  const map = {
    "character varying": "varchar",
    varchar: "varchar",
    "timestamp with time zone": "timestamptz",
    timestamptz: "timestamptz",
    "timestamp without time zone": "timestamp",
    timestamp: "timestamp",
    boolean: "bool",
    bool: "bool",
    integer: "int4",
    int4: "int4",
    bigint: "int8",
    int8: "int8",
    "double precision": "float8",
    float8: "float8",
  };
  return map[text] || text;
}

export function normalizeUdt(value) {
  return normalizeType(value);
}

export function normalizeNullable(value) {
  return /^(yes|true|t|1)$/i.test(String(value ?? "").trim()) ? "YES" : "NO";
}

export function normalizeBoolean(value) {
  return /^(true|t|yes|1)$/i.test(String(value ?? "").trim()) ? "true" : "false";
}

export function normalizeConstraintDefinition(value) {
  let out = normalizeSql(value)
    .replace(/\b(primary key|unique|check)\s+\(/gi, "$1(")
    .replace(/\bforeign key\s*\(([^)]+)\)\s*references\s+([a-z_][\w]*)\s*\(([^)]+)\)/gi, "foreign key($1) references $2($3)")
    .replace(/\btrim\(both from ([^)]+)\)/gi, "btrim($1)");
  out = normalizeCheckWrapper(out);
  out = normalizeAnyArrays(out);
  return out;
}

export function normalizeIndexDefinition(value) {
  return normalizeSql(value)
    .replace(/\busing\s+btree\s*/gi, "using btree ")
    .replace(/\btrim\(both from ([^)]+)\)/gi, "btrim($1)");
}

export function normalizePolicyExpression(value) {
  const empty = normalizeDefault(value);
  if (empty === null) return null;
  return normalizeSql(empty)
    .replace(/\bauth\.uid\s*\(\s*\)/gi, "auth.uid()")
    .replace(/\btrue\b/gi, "true");
}

export function normalizeFunctionBody(value) {
  let text = normalizeSql(value)
    .replace(/^create or replace function\s+public\./i, "function ")
    .replace(/^create or replace function\s+/i, "function ")
    .replace(/\$[a-z_]*\$/gi, "$$")
    .replace(/\blanguage\s+plpgsql\b/gi, "")
    .replace(/\blanguage\s+sql\b/gi, "")
    .replace(/\bset\s+search_path\s*=\s*public\b/gi, "set search_path=public")
    .trim();
  text = stripOuterParens(text);
  return text;
}

export function normalizeRoles(value) {
  if (value === null || value === undefined || String(value).trim() === "") return [];
  return String(value)
    .replace(/[{}"]/g, "")
    .split(",")
    .map((item) => normalizeRoleName(item))
    .filter(Boolean)
    .sort();
}

function compareRoles(localRaw, remoteRaw) {
  const localRoles = normalizeRoles(localRaw);
  const remoteRoles = normalizeRoles(remoteRaw);
  return { field: "roles", localRaw: displayRaw(localRaw), remoteRaw: displayRaw(remoteRaw), localNormalized: localRoles.join(","), remoteNormalized: remoteRoles.join(","), equal: localRoles.join(",") === remoteRoles.join(","), localHash: stableHash(localRoles.join(",")), remoteHash: stableHash(remoteRoles.join(",")) };
}

function rolePermissivenessStatus(localRoles, remoteRoles) {
  if (remoteRoles.split(",").includes("public") && !localRoles.split(",").includes("public")) return "REMOTE_MORE_PERMISSIVE";
  if (localRoles.split(",").includes("public") && !remoteRoles.split(",").includes("public")) return "LOCAL_MORE_PERMISSIVE";
  return "POLICY_EXPRESSION_DIFFERENT";
}

function normalizeRoleName(value) {
  return normalizeText(value).replace(/^public$/, "public");
}

function normalizeText(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
}

export function normalizeSql(value) {
  if (value === null || value === undefined) return "";
  return stripOuterParens(String(value)
    .replace(/\r\n?/g, "\n")
    .replace(/\bpublic\./gi, "")
    .replace(/::(text|uuid|jsonb|date|boolean|bool|integer|bigint|double precision)\b/gi, "")
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s*,\s*/g, ", ")
    .trim()
    .toLowerCase());
}

function stripOuterParens(value) {
  let out = String(value ?? "").trim();
  while (out.startsWith("(") && out.endsWith(")") && balancedParens(out.slice(1, -1))) out = out.slice(1, -1).trim();
  return out;
}

function normalizeCheckWrapper(value) {
  let out = value;
  if (out.startsWith("check((") && out.endsWith("))") && balancedParens(out.slice("check((".length, -2))) {
    out = `check(${out.slice("check((".length, -2).trim()})`;
  }
  return out
    .replace(/\(\(([^()]+)\)\)/g, "($1)")
    .replace(/\(\(([^()]+\([^()]*\)[^()]*)\)\)/g, "($1)");
}

function normalizeAnyArrays(value) {
  return value.replace(/array\[((?:'[^']*'\s*,?\s*)+)\]/g, (_match, body) => {
    const items = body.match(/'[^']*'/g) || [];
    return `array[${items.sort().join(", ")}]`;
  });
}

function balancedParens(value) {
  let depth = 0;
  for (const ch of value) {
    if (ch === "(") depth += 1;
    if (ch === ")") depth -= 1;
    if (depth < 0) return false;
  }
  return depth === 0;
}

function functionKey(row) {
  return `${row.function_name}(${normalizeFunctionArguments(row.arguments)})`;
}

export function normalizeFunctionArguments(value) {
  return normalizeSql(value).replace(/\bdefault\s+[^,)]+/g, "").trim();
}

function indexGrantRows(rows) {
  const out = new Map();
  for (const row of rows) {
    const name = row.routine_name || row.function_name;
    if (!out.has(name)) out.set(name, new Set());
    out.get(name).add(`${normalizeRoleName(row.grantee)}.${normalizeText(row.privilege_type)}`);
  }
  return out;
}

function isDangerousTableGrant(role, privilege) {
  return (role === "anon" && ["insert", "update", "delete"].includes(privilege)) || (role === "authenticated" && ["insert", "update", "delete"].includes(privilege));
}

function remoteOnlyStatus(category) {
  return category === "function" ? "REMOTE_OVERLOAD_ONLY" : "REMOTE_ONLY";
}

function localOnlyStatus(category) {
  return category === "function" ? "LOCAL_OVERLOAD_ONLY" : "LOCAL_ONLY";
}

function detailsFor(items, extra) {
  return [...items, extra].filter(Boolean).map((item) => `${item.field}: local_raw=${hashOrShort(item.localRaw)} remote_raw=${hashOrShort(item.remoteRaw)} local_norm=${hashOrShort(String(item.localNormalized))} remote_norm=${hashOrShort(String(item.remoteNormalized))} local_hash=${item.localHash} remote_hash=${item.remoteHash}`).join("; ");
}

function comparedDetail(field, localRaw, remoteRaw, localNormalized, remoteNormalized) {
  return detailsFor([{ field, localRaw: displayRaw(localRaw), remoteRaw: displayRaw(remoteRaw), localNormalized, remoteNormalized, equal: localNormalized === remoteNormalized, localHash: stableHash(String(localNormalized)), remoteHash: stableHash(String(remoteNormalized)) }]);
}

function displayRaw(value) {
  if (value === null) return "<null>";
  if (value === undefined) return "<undefined>";
  return String(value);
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
  return rows;
}

function detectCategory(header) {
  const normalized = header.map((item) => item.trim());
  for (const [category, expected] of Object.entries(categories)) {
    if (expected.length === normalized.length && expected.every((name, index) => normalized[index] === name)) return category;
  }
  return null;
}

function rowToObject(header, row) {
  const out = {};
  for (let i = 0; i < header.length; i += 1) out[header[i]] = row[i] ?? "";
  return out;
}

function indexBy(rows, fn) {
  const map = new Map();
  for (const item of rows || []) map.set(fn(item), item);
  return map;
}

function row(category, object, subobject, localState, remoteState, status, severity, sourceMigration, details, recommendedAction) {
  return { category, schema: "public", object, subobject, local_state: localState, remote_state: remoteState, status, severity, source_migration: sourceMigration, details, recommended_action: recommendedAction };
}

function objectName(category, key) {
  if (["column", "constraint", "index", "policy", "table_grant"].includes(category)) return key.split(".")[0];
  if (category === "function_grant") return key.split(".")[0];
  if (category === "function") return key.replace(/\(.*/, "");
  return key;
}

function subobjectName(category, key) {
  if (["column", "constraint", "index", "policy"].includes(category)) return key.split(".").slice(1).join(".");
  if (category === "table_grant" || category === "function_grant") return key.split(".").slice(1).join(".");
  if (category === "function") return key.match(/\((.*)\)$/)?.[1] || "";
  return "";
}

function sourceMigrationFor(category, key) {
  const probe = `${objectName(category, key)}.${subobjectName(category, key)}`.replace(/\.$/, "");
  for (const [pattern, migration] of sourceMigrationRules) {
    if (pattern.test(probe) || pattern.test(key)) return migration;
  }
  return "20260716090000_baseline_aruka_v1.sql";
}

function summarize(rows) {
  return rows.reduce((acc, item) => {
    acc.total += 1;
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, { total: 0 });
}

function assessMigrationCoverage(rows) {
  return {
    baseline: coverage(rows, "20260716090000_baseline_aruka_v1.sql"),
    workoutDelivery: coverage(rows, "20260728030000_workout_delivery_integration_v1.sql"),
    studentIdentity: coverage(rows, "20260730090000_student_identity_contract.sql"),
  };
}

function coverage(rows, migration) {
  const scoped = rows.filter((item) => item.source_migration === migration);
  const equivalent = scoped.filter((item) => item.status === "EQUIVALENT" || item.status.startsWith("EQUIVALENT_")).length;
  const localOnly = scoped.filter((item) => item.status === "LOCAL_ONLY" || item.status === "LOCAL_OVERLOAD_ONLY").length;
  const remoteOnly = scoped.filter((item) => item.status === "REMOTE_ONLY" || item.status === "REMOTE_OVERLOAD_ONLY").length;
  const critical = scoped.filter((item) => item.severity === "critical").length;
  const representation = scoped.filter((item) => item.status.startsWith("EQUIVALENT_") || item.status === "COLUMN_ORDER_DIFFERENT_NON_MATERIAL").length;
  let assessment = "materially_equivalent_with_extras";
  if (!scoped.length) assessment = "unverified";
  else if (critical || remoteOnly) assessment = "divergent";
  else if (localOnly && !equivalent) assessment = "absent";
  else if (localOnly || representation) assessment = "partially_present";
  return { migration, total: scoped.length, equivalent, localOnly, remoteOnly, critical, representation, assessment };
}

function assessRepair({ criticalDifferences, localOnlyObjects, remoteOnlyObjects, partiallyVerifiedObjects, errors }) {
  if (errors.length || criticalDifferences.length || localOnlyObjects.length || remoteOnlyObjects.length || partiallyVerifiedObjects.length) return "REPAIR_NOT_SAFE";
  return "REPAIR_POTENTIALLY_SAFE_FOR_BASELINE_ONLY";
}

function decide({ errors, secretFindings, criticalDifferences, remoteOnlyObjects }) {
  if (secretFindings.length) return "BLOCKED_SECRET_IN_REMOTE_SCHEMA_EVIDENCE";
  if (errors.length) return "BLOCKED_REMOTE_SCHEMA_EVIDENCE_INCOMPLETE";
  if (criticalDifferences.length || remoteOnlyObjects.length) return "BLOCKED_REMOTE_SCHEMA_DRIFT";
  return "REMOTE_SCHEMA_MATERIALLY_EQUIVALENT_UNTRACKED";
}

function recommendedNextSteps(decision, repair, partialCount) {
  if (decision === "REMOTE_SCHEMA_MATERIALLY_EQUIVALENT_UNTRACKED") return ["Plan migration history alignment only after manual review.", `Repair assessment: ${repair}.`];
  const steps = ["Review material differences object by object.", "Do not execute db push or migration repair until schema equivalence is proven."];
  if (partialCount) steps.push("Collect signature-aware function grant evidence before final grant equivalence.");
  return steps;
}

function buildNormalizationImpact(matrix) {
  const counts = summarize(matrix);
  const current = {
    critical: matrix.filter((item) => item.severity === "critical").length,
    defaultDifferent: counts.DEFAULT_DIFFERENT || 0,
    constraintDifferent: (counts.MATERIAL_DIFFERENCE || 0) + (counts.CONSTRAINT_DIFFERENT || 0),
    policyDifferent: (counts.POLICY_EXPRESSION_DIFFERENT || 0) + (counts.REMOTE_MORE_PERMISSIVE || 0) + (counts.LOCAL_MORE_PERMISSIVE || 0),
    functionDifferent: (counts.BODY_DIFFERENT || 0) + (counts.VOLATILITY_DIFFERENT || 0),
    localOnly: (counts.LOCAL_ONLY || 0) + (counts.LOCAL_OVERLOAD_ONLY || 0),
    remoteOnly: (counts.REMOTE_ONLY || 0) + (counts.REMOTE_OVERLOAD_ONLY || 0),
    equivalent: matrix.filter((item) => item.status === "EQUIVALENT" || item.status.startsWith("EQUIVALENT_")).length,
  };
  return {
    previous: previousCounts,
    current,
    falsePositivesCorrected: current.critical < previousCounts.critical || current.defaultDifferent < previousCounts.defaultDifferent || current.equivalent > previousCounts.equivalent,
  };
}

function toCsv(rows) {
  const header = ["category", "schema", "object", "subobject", "local_state", "remote_state", "status", "severity", "source_migration", "details", "recommended_action"];
  return `${header.join(",")}\n${rows.map((item) => header.map((key) => csvCell(item[key] ?? "")).join(",")).join("\n")}\n`;
}

function csvCell(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function renderSummary(result) {
  const lines = [
    "# Supabase Schema Equivalence Audit",
    "",
    `Auditor decision: \`${result.auditorDecision}\`.`,
    "",
    `Schema decision: \`${result.decision}\`.`,
    "",
    `Production action required: \`${result.productionActionRequired}\`.`,
    "",
    "## Evidence",
    "",
    `- Remote CSV files: ${result.inputEvidence.files.length}`,
    `- Linked state: ${result.remoteSource.linkedState}`,
    `- Evidence errors: ${result.inputEvidence.errors.length ? result.inputEvidence.errors.join("; ") : "none"}`,
    `- Function grant evidence: ${result.partiallyVerifiedObjects.length ? "PARTIALLY_VERIFIED because remote CSV lacks function arguments/specific_name" : "complete enough for this matrix"}`,
    "",
    "## Summary",
    "",
    tableLine("Tables", result.tables),
    tableLine("Columns", result.columns),
    tableLine("Constraints", result.constraints),
    tableLine("Indexes", result.indexes),
    tableLine("RLS", result.rls),
    tableLine("Policies", result.policies),
    tableLine("Functions", result.functions),
    tableLine("Table grants", result.tableGrants),
    tableLine("Function grants", result.functionGrants),
    "",
    "## Auditor Normalization Impact",
    "",
    impactLine("Critical", result.normalizationImpact.previous.critical, result.normalizationImpact.current.critical),
    impactLine("Defaults different", result.normalizationImpact.previous.defaultDifferent, result.normalizationImpact.current.defaultDifferent),
    impactLine("Constraints different", result.normalizationImpact.previous.constraintDifferent, result.normalizationImpact.current.constraintDifferent),
    impactLine("Policies different", result.normalizationImpact.previous.policyDifferent, result.normalizationImpact.current.policyDifferent),
    impactLine("Functions different", result.normalizationImpact.previous.functionDifferent, result.normalizationImpact.current.functionDifferent),
    impactLine("Local-only", result.normalizationImpact.previous.localOnly, result.normalizationImpact.current.localOnly),
    impactLine("Remote-only", result.normalizationImpact.previous.remoteOnly, result.normalizationImpact.current.remoteOnly),
    impactLine("Equivalent", result.normalizationImpact.previous.equivalent, result.normalizationImpact.current.equivalent),
    "",
    "## Migration Coverage",
    "",
    `- Baseline: ${result.baselineAssessment.assessment}`,
    `- Workout delivery: ${result.workoutDeliveryAssessment.assessment}`,
    `- Student identity: ${result.studentIdentityAssessment.assessment}`,
    "",
    "## Repair Assessment",
    "",
    `- ${result.migrationRepairAssessment}`,
    "",
    "## Critical Differences",
    "",
    ...result.criticalDifferences.slice(0, 50).map((item) => `- ${item.category} ${item.object}${item.subobject ? `.${item.subobject}` : ""}: ${item.status} (${item.source_migration})`),
    ...(result.criticalDifferences.length > 50 ? [`- ... ${result.criticalDifferences.length - 50} additional critical differences in JSON/matrix.`] : []),
    ...(result.criticalDifferences.length ? [] : ["- none"]),
    "",
    "## Next Steps",
    "",
    ...result.recommendedNextSteps.map((item) => `- ${item}`),
  ];
  return `${lines.join("\n")}\n`;
}

function renderReconciliationPlan(result) {
  return `# Supabase Production Reconciliation Plan

Status: draft for manual review only.

No corrective SQL, db push, db pull, migration repair, remote SQL, commit, push, or PR was executed in this round.

## Baseline/history

- Baseline assessment: \`${result.baselineAssessment.assessment}\`.
- Material differences remain in the matrix and must be reviewed before any history alignment.
- Remote-only grants and objects must be classified before considering migration history repair.

## Workout delivery

- Assessment: \`${result.workoutDeliveryAssessment.assessment}\`.
- Review objects sourced from \`20260728030000_workout_delivery_integration_v1.sql\` in \`schema-equivalence-matrix.csv\`.
- Do not apply incremental production changes until baseline/history drift is reconciled.

## Student identity

- Assessment: \`${result.studentIdentityAssessment.assessment}\`.
- The student identity migration remains staged locally and must not be repaired as applied remotely.
- Missing columns, indexes, RPCs, grants and role contract must be applied only after reconciliation approval.

## Evidence limitations

- Function grants are \`PARTIALLY_VERIFIED\` because the remote CSV contains \`routine_name\` but not function identity arguments or \`specific_name\`.
- Use signature-aware read-only evidence before final grant equivalence.
`;
}

function tableLine(label, data) {
  return `- ${label}: total ${data.total}, equivalent ${equivalentCount(data)}, local-only ${(data.LOCAL_ONLY || 0) + (data.LOCAL_OVERLOAD_ONLY || 0)}, remote-only ${(data.REMOTE_ONLY || 0) + (data.REMOTE_OVERLOAD_ONLY || 0)}, different ${differentCount(data)}, partial ${data.PARTIALLY_VERIFIED || 0}`;
}

function equivalentCount(data) {
  return Object.entries(data).filter(([status]) => status === "EQUIVALENT" || status.startsWith("EQUIVALENT_") || status === "ROLE_REPRESENTATION_EQUIVALENT").reduce((sum, [, count]) => sum + count, 0);
}

function differentCount(data) {
  return Object.entries(data).filter(([status]) => !["total", "EQUIVALENT", "LOCAL_ONLY", "REMOTE_ONLY", "LOCAL_OVERLOAD_ONLY", "REMOTE_OVERLOAD_ONLY", "PARTIALLY_VERIFIED"].includes(status) && !status.startsWith("EQUIVALENT_")).reduce((sum, [, count]) => sum + count, 0);
}

function impactLine(label, before, after) {
  return `- ${label}: before ${before}, after ${after}, delta ${after - before}`;
}

export function scanSecrets(text, file = "input") {
  const findings = [];
  const checks = [
    [/eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/, "jwt"],
    [/sb_secret_[A-Za-z0-9_-]+/i, "supabase_secret"],
    [/postgres(?:ql)?:\/\/[^,\s"]+/i, "connection_string"],
    [new RegExp(["SUPABASE", "SERVICE"].join("_"), "i"), "service_role_name"],
    [new RegExp(["PG", "PASS", "WORD"].join(""), "i"), "pg_pass_word_name"],
    [new RegExp([["vriz", "euhuhvtvbrmt", "vdik"].join(""), ["xrmq", "dkpxnfvusmen", "adnf"].join("")].join("|"), "i"), "full_project_ref"],
  ];
  text.split(/\r?\n/).forEach((line, index) => {
    for (const [pattern, kind] of checks) {
      if (pattern.test(line)) findings.push({ file, line: index + 1, kind });
    }
  });
  return findings;
}

function stableHash(value) {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) hash = ((hash << 5) + hash + value.charCodeAt(i)) >>> 0;
  return hash.toString(16);
}

function hashOrShort(value) {
  const text = String(value ?? "");
  if (text.length <= 180) return text;
  return `[len ${text.length} hash ${stableHash(text)}]`;
}

function kebab(name) {
  return name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`).replace(/^-/, "");
}

function runGit(args) {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "unavailable";
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
}
