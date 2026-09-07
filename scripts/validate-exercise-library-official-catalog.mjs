import { existsSync, readFileSync } from "node:fs";

const migration = "supabase/migrations/20260907150000_exercise_official_catalog_v1.sql";
const sql = existsSync(migration) ? readFileSync(migration, "utf8") : "";
const errors = [];

expect(sql, "Missing official catalog migration");
expect(/insert\s+into\s+public\.exercise_library/i.test(sql), "Migration must seed exercise_library");
expect(/on\s+conflict\s*\(id\)\s+do\s+update/i.test(sql), "Catalog seed must be idempotent by deterministic id");
expect(!/gen_random_uuid\s*\(/i.test(sql), "Official catalog must not generate random ids");
expect(!/\bdelete\s+from\b|\btruncate\b|\bdrop\s+/i.test(sql), "Catalog seed must not delete, truncate or drop data");
expect(/\bwhere\s+public\.exercise_library\.origin\s*=\s*'official'/i.test(sql), "Upsert update must be scoped to existing official rows");

const rows = parseRows(sql);
expect(rows.length >= 30, `Expected at least 30 official exercises, found ${rows.length}`);

const ids = new Set();
const names = new Set();
const groups = new Set();
for (const row of rows) {
  const [id, ownerId, origin, name, description, muscleGroup, category, instructions, youtubeUrl, mediaType, mediaPath] = row;
  expect(isUuid(id), `Invalid deterministic UUID: ${id}`);
  expect(!ids.has(id), `Duplicate id: ${id}`);
  ids.add(id);
  expect(ownerId === null, `${name} must have owner_id null`);
  expect(origin === "official", `${name} must have origin official`);
  expect(name && name === sentenceCase(name), `${name} must use sentence case`);
  const normalizedName = normalize(name);
  expect(!names.has(normalizedName), `Duplicate normalized name: ${name}`);
  names.add(normalizedName);
  expect(description.length >= 24, `${name} needs a meaningful description`);
  expect(muscleGroup.length > 0, `${name} must have muscle group`);
  expect(category.length > 0, `${name} must have category`);
  expect(instructions.length >= 50, `${name} needs practical instructions`);
  expect(youtubeUrl === "", `${name} must not seed third-party video`);
  expect(mediaType === null && mediaPath === null, `${name} must not seed unlicensed media`);
  groups.add(muscleGroup);
}

for (const group of ["Peitoral", "Costas", "Ombros", "Biceps", "Triceps", "Quadriceps", "Posteriores", "Gluteos", "Panturrilhas", "Core"]) {
  expect(groups.has(group), `Missing representative group: ${group}`);
}

if (errors.length) {
  console.error("Exercise library official catalog validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Exercise library official catalog validation passed (${rows.length} exercises).`);

function expect(ok, message) {
  if (!ok) errors.push(message);
}

function parseRows(text) {
  const values = text.match(/values\s+([\s\S]*?)\s+on\s+conflict/i)?.[1] ?? "";
  const rowPattern = /\(([\s\S]*?)\)(?:,|$)/g;
  return [...values.matchAll(rowPattern)].map((match) => splitSqlTuple(match[1]));
}

function splitSqlTuple(tuple) {
  const values = [];
  let current = "";
  let quote = false;
  for (let index = 0; index < tuple.length; index += 1) {
    const char = tuple[index];
    const next = tuple[index + 1];
    if (char === "'" && next === "'") {
      current += "''";
      index += 1;
      continue;
    }
    if (char === "'") quote = !quote;
    if (char === "," && !quote) {
      values.push(clean(current));
      current = "";
    } else {
      current += char;
    }
  }
  values.push(clean(current));
  return values;
}

function clean(value) {
  const trimmed = value.trim();
  if (/^null$/i.test(trimmed)) return null;
  return trimmed.replace(/^'/, "").replace(/'(?:::jsonb)?$/, "").replace(/''/g, "'");
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function normalize(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, " ").trim();
}

function sentenceCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
