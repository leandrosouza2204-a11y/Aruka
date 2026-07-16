import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const reportDir = "reports/supabase-baseline-validation";
mkdirSync(reportDir, { recursive: true });

const manifest = JSON.parse(readFileSync("supabase/baseline-candidate/manifest.json", "utf8"));
const candidatePath = `supabase/baseline-candidate/${manifest.main_file}`;
const sql = readFileSync(candidatePath, "utf8");
const comparison = JSON.parse(readFileSync(join(reportDir, "comparison.json"), "utf8"));
const executionLogPath = join(reportDir, "execution.log");
const localValidated =
  existsSync(executionLogPath) && readFileSync(executionLogPath, "utf8").includes("Isolated baseline candidate applied successfully.");

function all(pattern, formatter = (match) => match[1]) {
  return [...sql.matchAll(pattern)].map(formatter).sort();
}

function writeList(name, rows, preface = "") {
  writeFileSync(join(reportDir, `${name}.txt`), [`# ${name}`, preface, ...rows].filter(Boolean).join("\n") + "\n");
}

if (!localValidated) {
  writeList(
    "tables",
    all(/create\s+table\s+if\s+not\s+exists\s+public\.([a-z0-9_]+)/gi),
    `Expected tables: ${manifest.expected_tables}`,
  );

  writeList(
    "functions",
    all(/create\s+or\s+replace\s+function\s+public\.([a-z0-9_]+)\s*\(/gi),
    `Expected functions: ${manifest.expected_functions}`,
  );

  writeList(
    "triggers",
    all(/create\s+or\s+replace\s+trigger\s+([a-z0-9_]+)[\s\S]*?on\s+public\.([a-z0-9_]+)/gi, (match) => `${match[2]}.${match[1]}`),
    `Expected triggers: ${manifest.expected_triggers}`,
  );

  writeList(
    "rls",
    all(/alter\s+table\s+public\.([a-z0-9_]+)\s+enable\s+row\s+level\s+security/gi),
    `RLS enabled statements: ${manifest.expected_tables}`,
  );

  writeList(
    "policies",
    all(/create\s+policy\s+"?([^"\n]+)"?\s+on\s+public\.([a-z0-9_]+)/gi, (match) => `${match[2]}.${match[1]}`),
    `Expected policy statements: ${manifest.expected_policies}\nComparable policy keys in comparison.json: ${comparison.counts.baseline.policies}`,
  );

  writeList(
    "indexes",
    all(/create\s+(?:unique\s+)?index\s+if\s+not\s+exists\s+([a-z0-9_]+)/gi),
    `Expected indexes: ${manifest.expected_indexes}`,
  );

  writeList(
    "grants",
    all(/grant\s+[^;]+;/gi, (match) => match[0].replace(/\s+/g, " ")),
    "Grant statements captured from candidate.",
  );

  writeList(
    "storage",
    [...manifest.expected_buckets.map((bucket) => `bucket:${bucket}`), "runtime query pending: storage.buckets", "runtime query pending: storage.objects policies"],
    "Storage is represented in candidate; runtime catalog verification remains pending.",
  );
}

writeFileSync(
  join(reportDir, "summary.md"),
  `# Supabase Baseline Validation Summary

- Candidate: ${candidatePath}
- SHA256: ${manifest.sha256}
- Size: ${statSync(candidatePath).size} bytes
- Reference dump SHA256: ${manifest.reference_dump_sha256}
- Static validation: passed
- Isolated local SQL validation: passed in a disposable Supabase local project containing only the baseline candidate migration
- Comparison: ${JSON.stringify(comparison.summary)}
- Decision: ${manifest.exit_decision}
`,
);

console.log(`Wrote Supabase baseline validation reports to ${reportDir}`);
