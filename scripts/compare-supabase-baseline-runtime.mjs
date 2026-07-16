import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const reportDir = "reports/supabase-baseline-validation";
mkdirSync(reportDir, { recursive: true });

const manifest = JSON.parse(readFileSync("supabase/baseline-candidate/manifest.json", "utf8"));
const baseline = readFileSync(`supabase/baseline-candidate/${manifest.main_file}`, "utf8");
const runtime = readFileSync("reports/hml-baseline/production-public-schema.sql", "utf8");

function names(pattern, text, normalizer = (value) => value) {
  return new Set([...text.matchAll(pattern)].map((match) => normalizer(match[1], match)));
}

const baselineObjects = {
  tables: names(/create\s+table\s+if\s+not\s+exists\s+public\.([a-z0-9_]+)/gi, baseline),
  functions: names(/create\s+or\s+replace\s+function\s+public\.([a-z0-9_]+)\s*\(/gi, baseline),
  triggers: names(/create\s+or\s+replace\s+trigger\s+([a-z0-9_]+)/gi, baseline),
  policies: names(/create\s+policy\s+"?([^"\n]+)"?\s+on\s+public\.([a-z0-9_]+)/gi, baseline, (_value, match) => `${match[2]}.${match[1]}`),
  indexes: names(/create\s+(?:unique\s+)?index\s+if\s+not\s+exists\s+([a-z0-9_]+)/gi, baseline),
};

const runtimeObjects = {
  tables: names(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+"public"\."([^"]+)"/g, runtime),
  functions: names(/CREATE\s+OR\s+REPLACE\s+FUNCTION\s+"public"\."([^"]+)"/g, runtime),
  triggers: names(/CREATE\s+OR\s+REPLACE\s+TRIGGER\s+"([^"]+)"/g, runtime),
  policies: names(/CREATE\s+POLICY\s+"([^"]+)"\s+ON\s+"public"\."([^"]+)"/g, runtime, (_value, match) => `${match[2]}.${match[1]}`),
  indexes: names(/CREATE\s+(?:UNIQUE\s+)?INDEX\s+"([^"]+)"/g, runtime),
};

const decisions = {
  excludedRuntimeFunctions: [
    "admin_atualizar_perfil",
    "admin_bloquear_usuario",
    "admin_liberar_assinante",
    "admin_liberar_beta",
    "admin_upsert_assinatura",
  ],
  expectedHardening: [
    "grants_without_anon",
    "aoe_idempotency_actor_check",
    "workout_template_trigger_search_path",
    "runtime_overloads_excluded",
  ],
  requiresRuntimeQuery: ["storage.buckets", "storage.objects policies"],
};

function compareSet(kind) {
  const baselineSet = baselineObjects[kind];
  const runtimeSet = runtimeObjects[kind];
  const rows = [];
  for (const item of baselineSet) {
    rows.push({
      kind,
      name: item,
      classification: runtimeSet.has(item) ? "MATCHED" : kind === "policies" ? "EXPECTED_HARDENING_DIFFERENCE" : "EXTRA_IN_BASELINE",
    });
  }
  for (const item of runtimeSet) {
    if (!baselineSet.has(item)) {
      const classification =
        kind === "functions" && decisions.excludedRuntimeFunctions.includes(item)
          ? "EXPECTED_HARDENING_DIFFERENCE"
          : kind === "policies"
            ? "EXPECTED_HARDENING_DIFFERENCE"
            : "MISSING_IN_BASELINE";
      rows.push({ kind, name: item, classification });
    }
  }
  return rows;
}

const comparisons = [
  ...compareSet("tables"),
  ...compareSet("functions"),
  ...compareSet("triggers"),
  ...compareSet("policies"),
  ...compareSet("indexes"),
  ...decisions.requiresRuntimeQuery.map((name) => ({ kind: "managed_dependency", name, classification: "REQUIRES_RUNTIME_QUERY" })),
];

const summary = comparisons.reduce((acc, row) => {
  acc[row.classification] = (acc[row.classification] || 0) + 1;
  return acc;
}, {});

const result = {
  baseline_file: manifest.main_file,
  baseline_sha256: manifest.sha256,
  reference_dump_sha256: manifest.reference_dump_sha256,
  summary,
  counts: {
    baseline: Object.fromEntries(Object.entries(baselineObjects).map(([key, set]) => [key, set.size])),
    runtime: Object.fromEntries(Object.entries(runtimeObjects).map(([key, set]) => [key, set.size])),
  },
  comparisons,
};

writeFileSync(join(reportDir, "comparison.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log("Supabase baseline/runtime comparison written to reports/supabase-baseline-validation/comparison.json");
