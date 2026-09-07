import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { runCommand, runPsql } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();
const catalogMigration = readFileSync("supabase/migrations/20260907150000_exercise_official_catalog_v1.sql", "utf8");

const snapshots = [];
for (const label of ["reset-1", "reset-2"]) {
  const reset = runCommand(root, process.platform === "win32" ? "npm.cmd" : "npm", ["run", "supabase:reset:safe"], {
    timeoutMs: 300000,
  });
  process.stdout.write(reset.stdout);
  process.stderr.write(reset.stderr);
  if (reset.status !== 0) {
    console.error(`${label} failed.`);
    process.exit(1);
  }
  snapshots.push(snapshotCatalog(label));
}

if (fingerprint(snapshots[0].rows) !== fingerprint(snapshots[1].rows)) {
  console.error("Exercise library seed reproducibility validation failed: reset snapshots differ.");
  console.error(JSON.stringify(snapshots, null, 2));
  process.exit(1);
}

const rerun = runPsql(root, catalogMigration, {
  timeoutMs: 120000,
  throwOnError: false,
});
process.stdout.write(rerun.stdout);
process.stderr.write(rerun.stderr);
if (rerun.status !== 0) process.exit(1);

const afterRerun = snapshotCatalog("rerun");
if (fingerprint(snapshots[1].rows) !== fingerprint(afterRerun.rows)) {
  console.error("Exercise library seed reproducibility validation failed: rerun changed catalog snapshot.");
  process.exit(1);
}

console.log(`Exercise library seed reproducibility validation passed (${afterRerun.rows.length} official exercises).`);

function snapshotCatalog(label) {
  const sql = String.raw`
\pset tuples_only on
\pset format unaligned
select coalesce(jsonb_agg(jsonb_build_object(
  'id', id,
  'name', name,
  'origin', origin,
  'owner_id', owner_id,
  'status', status,
  'muscle_group', muscle_group,
  'category', category,
  'media_type', media_type,
  'media_path', media_path,
  'youtube_url', youtube_url
) order by id), '[]'::jsonb)::text
from public.exercise_library
where metadata->>'catalog' = 'aruka_official_v1';
`;
  const result = runPsql(root, sql, { timeoutMs: 120000 });
  const text = result.stdout.trim().split(/\r?\n/).filter(Boolean).at(-1) || "[]";
  return { label, rows: JSON.parse(text) };
}

function fingerprint(rows) {
  return createHash("sha256").update(JSON.stringify(rows)).digest("hex");
}
