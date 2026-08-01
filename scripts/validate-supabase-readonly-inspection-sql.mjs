import { readFileSync } from "node:fs";
import { join } from "node:path";

const files = [
  "reports/supabase-production-sync/function-grants-signature-inspection.sql",
  "reports/supabase-production-sync/remote-nullability-profile.sql",
  "reports/supabase-production-sync/reconciliation-readonly-inspection.sql",
];

const forbidden = /\b(insert|update|delete|create|alter|drop|grant|revoke|truncate|do|call|merge)\b|\bcopy\s+from\b/i;
const root = process.cwd();
const failures = [];

for (const file of files) {
  const sql = readFileSync(join(root, file), "utf8");
  const executable = stripCommentsAndStrings(sql);
  if (forbidden.test(executable)) failures.push(file);
}

if (failures.length) {
  console.error(`READONLY_SQL_VALIDATION_FAILED ${failures.join(", ")}`);
  process.exit(1);
}

console.log("READONLY_SQL_VALIDATION_PASSED");

function stripCommentsAndStrings(sql) {
  return sql
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/'([^']|'')*'/g, "''")
    .replace(/"([^"]|"")*"/g, '""');
}
