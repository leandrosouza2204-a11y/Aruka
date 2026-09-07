import { readFileSync } from "node:fs";

const sql = readFileSync("supabase/migrations/20260907150000_exercise_official_catalog_v1.sql", "utf8");
const rows = [...sql.matchAll(/\('([0-9a-f-]{36})',\s+null,\s+'official',\s+'([^']+)',\s+'([^']+)',\s+'([^']+)',\s+'([^']+)',\s+'([^']+)'/gi)].map((match) => ({
  id: match[1],
  name: match[2],
  description: match[3],
  muscleGroup: match[4],
  category: match[5],
  instructions: match[6],
}));
const errors = [];
const names = new Set();

for (const row of rows) {
  check(row.name.trim() === row.name, `${row.name}: name has edge whitespace`);
  check(!/\s{2,}/.test(row.name), `${row.name}: name has duplicate spaces`);
  check(!/^[A-ZÀ-Ý\s]+$/.test(row.name), `${row.name}: name is all uppercase`);
  check(row.muscleGroup.trim().length > 0, `${row.name}: empty muscle group`);
  check(row.category.trim().length > 0, `${row.name}: empty category`);
  check(row.description.trim().length >= 24, `${row.name}: short description`);
  check(row.instructions.trim().length >= 50, `${row.name}: short instructions`);
  const normalized = normalize(row.name);
  check(!names.has(normalized), `${row.name}: duplicate normalized name`);
  names.add(normalized);
}

check(rows.length >= 30, `Catalog has too few rows: ${rows.length}`);

if (errors.length) {
  console.error("Exercise library catalog quality validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Exercise library catalog quality validation passed (${rows.length} exercises).`);

function check(ok, message) {
  if (!ok) errors.push(message);
}

function normalize(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
}
