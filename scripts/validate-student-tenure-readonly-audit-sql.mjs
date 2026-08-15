import { readFileSync } from "node:fs";

const file = "docs/student-tenure-model/04-production-readonly-audit.sql";
const sql = readFileSync(file, "utf8");

const withoutBlockComments = sql.replace(/\/\*[\s\S]*?\*\//g, " ");
const withoutLineComments = withoutBlockComments.replace(/--.*$/gm, " ");
const withoutStrings = withoutLineComments.replace(/'([^']|'')*'/g, "''");

const forbidden = [
  "insert",
  "update",
  "delete",
  "alter",
  "drop",
  "create",
  "truncate",
  "grant",
  "revoke",
  "call",
  "merge",
  "replace",
  "execute",
  "do",
  "vacuum",
  "analyze",
  "refresh",
  "comment",
  "security",
];

const matches = forbidden.filter((word) => new RegExp(`\\b${word}\\b`, "i").test(withoutStrings));
if (matches.length) {
  console.error(`READONLY_AUDIT_SQL=FAIL forbidden=${matches.join(",")}`);
  process.exit(1);
}

if (!/\bselect\b/i.test(withoutStrings) || !/\bfrom\b/i.test(withoutStrings)) {
  console.error("READONLY_AUDIT_SQL=FAIL missing_select");
  process.exit(1);
}

console.log("READONLY_AUDIT_SQL=PASS");
