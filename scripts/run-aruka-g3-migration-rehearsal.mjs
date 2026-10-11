import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";

const root = process.cwd();
const runId = process.env.ARUKA_G3_RUN_ID || "g3-20261011-03";
const container = process.env.ARUKA_G3_CONTAINER || `aruka-g2-restore-${runId}`;
const evidenceRoot = resolve(process.env.ARUKA_G3_EVIDENCE || "reports/aruka-g3-readiness-20261011-01");
const migrationRoot = join(root, "supabase", "migrations");
const logRoot = join(evidenceRoot, "migration-logs");
const tempRoot = mkdtempSync(join(tmpdir(), "aruka-g3-migrations-"));

const physicalPending = [
  "20260914130000_cycle12_execution_tracking_and_safety.sql",
  "20260914131000_cycle12_execution_commands.sql",
  "20260914132000_cycle12_completion_and_grants.sql",
  "20260914185833_cycle12_canonical_execution_reads.sql",
  "20260915014848_cycle12_student_home_v2.sql",
  "20260915140229_cycle12_student_training_library_v2.sql",
  "20260915201101_cycle12_workout_player_v2.sql",
  "20260919120000_cycle12_set_tracking_player_payload.sql",
  "20260919231657_cycle12_rest_timer_server_clock.sql",
  "20260920104727_cycle12_workout_completion_feedback.sql",
  "20260920144904_cycle12_student_evolution_v2.sql",
  "20260921010053_cycle12_profile_secondary_flows.sql",
  "20260926174027_cycle12_schema_rls_hardening.sql",
  "20261003163830_cycle12_controlled_rollout_foundation.sql",
  "20261004133801_cycle12_forward_schema_security_reconciliation.sql",
];

// Production's legacy policy names must be reconciled before the older hardening
// migration can safely enforce its canonical allowlist. Rollout remains last/OFF.
const operationalOrder = [
  ...physicalPending.slice(0, 12),
  physicalPending[14],
  physicalPending[12],
  physicalPending[13],
];

const expectedAppliedPrefix = [
  "20260728030000", "20260730090000", "20260731190000", "20260801143335",
  "20260801173000", "20260801180000", "20260811090000", "20260815120000",
  "20260816120000", "20260819090000", "20260821120000", "20260822120000",
  "20260824120000", "20260829120000", "20260829173000", "20260830203000",
  "20260831090000", "20260905120000", "20260906020000", "20260907090000",
  "20260907120000", "20260907150000", "20260908110000", "20260908120000",
  "20260909110000",
];

const riskByVersion = {
  "20260914130000": ["HIGH", "additive columns/indexes; snapshot trigger/function replacement"],
  "20260914131000": ["LOW", "SECURITY DEFINER command functions; row locks are session-scoped"],
  "20260914132000": ["MEDIUM", "function/grant/policy transition; closes temporary execute exposure"],
  "20260914185833": ["MEDIUM", "security-invoker view and canonical read functions"],
  "20260915014848": ["MEDIUM", "partial index plus bounded Home read function"],
  "20260915140229": ["LOW", "read-function additions only"],
  "20260915201101": ["LOW", "player read function replacement"],
  "20260919120000": ["LOW", "player payload function replacement"],
  "20260919231657": ["LOW", "player payload function replacement with server clock"],
  "20260920104727": ["MEDIUM", "new feedback table/FK/RLS and function replacement"],
  "20260920144904": ["LOW", "bounded evolution read functions"],
  "20260921010053": ["MEDIUM", "new contact table/FK/RLS and profile functions"],
  "20261004133801": ["HIGH", "drift reconciliation, default ACL and privileged function grants"],
  "20260926174027": ["HIGH", "global policy/ACL hardening with fail-fast preconditions"],
  "20261003163830": ["HIGH", "private rollout schema and command replacement; remains OFF"],
};

mkdirSync(logRoot, { recursive: true });
const checkpointPath = join(evidenceRoot, "migration-checkpoint.json");
const priorCheckpoint = (() => {
  try {
    const value = JSON.parse(readFileSync(checkpointPath, "utf8"));
    return value.run_id === runId ? value : null;
  } catch {
    return null;
  }
})();

try {
  const inspect = JSON.parse(run("docker", ["inspect", container]))[0];
  assert.equal(inspect.Config.Labels?.["aruka.g2-restore"], runId, "unexpected container identity");
  assert.equal(inspect.HostConfig.NetworkMode, "none", "rehearsal container must have no network");
  assert.equal(Object.keys(inspect.HostConfig.PortBindings || {}).length, 0, "rehearsal container must publish no ports");
  assert.equal(inspect.State.Health?.Status, "healthy", "rehearsal container must be healthy");

  const sourceInventory = physicalPending.map((file, physicalIndex) => {
    const content = readFileSync(join(migrationRoot, file));
    const version = file.slice(0, 14);
    const [risk, impact] = riskByVersion[version];
    return {
      physical_order: physicalIndex + 1,
      operational_order: operationalOrder.indexOf(file) + 1,
      file,
      version,
      name: basename(file, ".sql").slice(15),
      sha256: createHash("sha256").update(content).digest("hex").toUpperCase(),
      bytes: content.length,
      risk,
      impact,
    };
  });

  assert.equal(new Set(sourceInventory.map((item) => item.version)).size, 15, "duplicate pending migration version");
  const initialHistory = history();
  const unknown = initialHistory.filter((version) => !expectedAppliedPrefix.includes(version) && !sourceInventory.some((item) => item.version === version));
  assert.deepEqual(unknown, [], `unexpected migration history: ${unknown.join(",")}`);
  assert.deepEqual(initialHistory.filter((version) => expectedAppliedPrefix.includes(version)), expectedAppliedPrefix, "restored history is not the exact production prefix");

  const before = snapshot();
  const results = [];
  for (const file of operationalOrder) {
    const item = sourceInventory.find((candidate) => candidate.file === file);
    if (history().includes(item.version)) {
      const prior = priorCheckpoint?.completed?.find((candidate) => candidate.version === item.version && candidate.status === "PASS");
      results.push(prior || { ...item, status: "ALREADY_APPLIED", duration_ms: 0 });
      continue;
    }

    const original = readFileSync(join(migrationRoot, file), "utf8");
    const historySql = `\ninsert into supabase_migrations.schema_migrations(version,name,statements) values ('${item.version}','${item.name}',array[$aruka_g3$${original}$aruka_g3$]);\n`;
    const explicitTransaction = /^\s*begin\s*;/i.test(original) && /commit\s*;\s*$/i.test(original);
    const staged = explicitTransaction
      ? original.replace(/commit\s*;\s*$/i, `${historySql}commit;\n`)
      : `begin;\n${original}\n${historySql}commit;\n`;
    const stagedPath = join(tempRoot, file);
    const containerPath = `/tmp/aruka-g3-${item.version}.sql`;
    writeFileSync(stagedPath, staged, "utf8");
    run("docker", ["cp", stagedPath, `${container}:${containerPath}`]);

    const startedAt = new Date();
    const execution = spawnSync("docker", ["exec", container, "psql", "-X", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-f", containerPath], {
      cwd: root,
      encoding: "utf8",
      timeout: 600_000,
      maxBuffer: 20 * 1024 * 1024,
    });
    const endedAt = new Date();
    const log = `${execution.stdout || ""}${execution.stderr || ""}`;
    writeFileSync(join(logRoot, `${item.operational_order.toString().padStart(2, "0")}-${item.version}.log`), log, "utf8");
    if (execution.status !== 0) throw new Error(`migration ${file} failed with exit ${execution.status}: ${log.slice(-2000)}`);
    assert.ok(history().includes(item.version), `migration ${item.version} was not recorded`);
    results.push({
      ...item,
      status: "PASS",
      started_at_utc: startedAt.toISOString(),
      completed_at_utc: endedAt.toISOString(),
      duration_ms: endedAt - startedAt,
      explicit_transaction: explicitTransaction,
      warnings: (log.match(/WARNING:/g) || []).length,
      errors: (log.match(/ERROR:/g) || []).length,
    });
    writeFileSync(checkpointPath, `${JSON.stringify({
      status: "IN_PROGRESS",
      updated_at_utc: new Date().toISOString(),
      run_id: runId,
      container,
      initial_history: initialHistory,
      before,
      completed: results,
      production_accessed: false,
    }, null, 2)}\n`, "utf8");
  }

  const finalHistory = history();
  assert.equal(finalHistory.length, 40, "final migration history must contain 40 versions");
  assert.deepEqual(finalHistory, [...expectedAppliedPrefix, ...physicalPending.map((file) => file.slice(0, 14))].sort(), "final history differs from repository chain");

  const validations = [];
  for (const file of ["validate-aruka-g3-post-migrations.sql", "validate-aruka-g3-security-runtime.sql", "validate-aruka-g3-rollout-runtime.sql"]) {
    const localPath = join(root, "scripts", "sql", file);
    const remotePath = `/tmp/${file}`;
    run("docker", ["cp", localPath, `${container}:${remotePath}`]);
    const output = run("docker", ["exec", container, "psql", "-X", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-f", remotePath]);
    writeFileSync(join(evidenceRoot, file.replace(".sql", ".txt")), output, "utf8");
    validations.push({ file, status: "PASS", markers: output.split(/\r?\n/).filter((line) => /\|PASS$/.test(line)) });
  }

  const after = snapshot();
  const result = {
    decision: "PASS",
    mission: "ARUKA_G3_MIGRATION_REHEARSAL",
    run_id: runId,
    generated_at_utc: new Date().toISOString(),
    production_accessed: false,
    production_writes: 0,
    container,
    isolation: { network: "none", published_ports: 0, health: "healthy" },
    initial_history_count: priorCheckpoint?.initial_history?.length || initialHistory.length,
    initial_history_last: priorCheckpoint?.initial_history?.at(-1) || initialHistory.at(-1),
    final_history_count: finalHistory.length,
    pending_count: sourceInventory.length,
    source_inventory: sourceInventory,
    operational_order: operationalOrder,
    before: priorCheckpoint?.before || before,
    after,
    migrations: results,
    total_duration_ms: results.reduce((sum, item) => sum + item.duration_ms, 0),
    validations,
    transaction_note: "P01-P12 were wrapped per migration to reproduce the official CLI atomicity contract; the three migrations containing their own BEGIN/COMMIT retained those boundaries, with history recorded inside the same transaction.",
  };
  writeFileSync(join(evidenceRoot, "migration-rehearsal.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(result, null, 2));
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}

function run(command, args) {
  return execFileSync(command, args, { cwd: root, encoding: "utf8", timeout: 600_000, maxBuffer: 30 * 1024 * 1024 });
}

function psql(sql) {
  return run("docker", ["exec", container, "psql", "-X", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-At", "-c", sql]).trim();
}

function history() {
  const output = psql("select version from supabase_migrations.schema_migrations order by version");
  return output ? output.split(/\r?\n/) : [];
}

function snapshot() {
  return JSON.parse(psql(`select json_build_object(
    'tables', (select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where c.relkind in ('r','p') and n.nspname in ('auth','public','realtime','storage','supabase_migrations')),
    'public_columns', (select count(*) from information_schema.columns where table_schema='public'),
    'functions', (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'),
    'indexes', (select count(*) from pg_index i join pg_class c on c.oid=i.indexrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public'),
    'constraints', (select count(*) from pg_constraint c join pg_namespace n on n.oid=c.connamespace where n.nspname='public'),
    'foreign_keys', (select count(*) from pg_constraint c join pg_namespace n on n.oid=c.connamespace where c.contype='f' and n.nspname in ('auth','public','realtime','storage','supabase_migrations')),
    'policies', (select count(*) from pg_policies where schemaname='public'),
    'rls_tables', (select count(*) from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relrowsecurity),
    'history', (select count(*) from supabase_migrations.schema_migrations),
    'auth_users', (select count(*) from auth.users),
    'alunos', (select count(*) from public.alunos),
    'treinos', (select count(*) from public.treinos),
    'sessions', (select count(*) from public.workout_execution_sessions),
    'storage_buckets', (select count(*) from storage.buckets),
    'storage_objects', (select count(*) from storage.objects)
  )`));
}
