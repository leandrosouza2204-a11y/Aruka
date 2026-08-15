import { readFileSync } from "node:fs";

const file = "docs/student-tenure-model/07-production-legacy-reconciliation-readonly.sql";
const sql = readFileSync(file, "utf8");

const withoutBlockComments = sql.replace(/\/\*[\s\S]*?\*\//g, " ");
const withoutLineComments = withoutBlockComments.replace(/--.*$/gm, " ");
const withoutStrings = withoutLineComments.replace(/'([^']|'')*'/g, "''");

const forbidden = [
  "insert",
  "update",
  "delete",
  "alter",
  "create",
  "drop",
  "truncate",
  "call",
  "do",
  "grant",
  "revoke",
  "merge",
  "vacuum",
  "reindex",
  "cluster",
  "copy",
];

const matches = forbidden.filter((word) => new RegExp(`\\b${word}\\b`, "i").test(withoutStrings));
if (matches.length) {
  console.error(`LEGACY_RECONCILIATION_SQL=FAIL forbidden=${matches.join(",")}`);
  process.exit(1);
}

if (!/\bselect\b/i.test(withoutStrings) || !/\bfrom\b/i.test(withoutStrings)) {
  console.error("LEGACY_RECONCILIATION_SQL=FAIL missing_select");
  process.exit(1);
}

console.log("LEGACY_RECONCILIATION_SQL=PASS");
