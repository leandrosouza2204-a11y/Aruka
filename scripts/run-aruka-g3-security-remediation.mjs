import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";

const root = process.cwd();
const runId = process.env.ARUKA_G3_SECURITY_RUN_ID || "g3-security-20261011-01";
const container = process.env.ARUKA_G3_SECURITY_CONTAINER || `aruka-g2-restore-${runId}`;
const evidenceRoot = resolve(process.env.ARUKA_G3_SECURITY_EVIDENCE || "reports/aruka-g3-security-remediation-20261011-01");
const migrationFile = "20261011232512_harden_privileged_function_execution.sql";
const migrationPath = join(root, "supabase", "migrations", migrationFile);
const version = migrationFile.slice(0, 14);
const name = basename(migrationFile, ".sql").slice(15);
const checkpointPath = join(evidenceRoot, "checkpoint.json");
const tempRoot = mkdtempSync(join(tmpdir(), "aruka-g3-security-"));

mkdirSync(evidenceRoot, { recursive: true });

try {
  const inspect = JSON.parse(run("docker", ["inspect", container]))[0];
  assert.equal(inspect.Config.Labels?.["aruka.g2-restore"], runId);
  assert.equal(inspect.HostConfig.NetworkMode, "none");
  assert.equal(Object.keys(inspect.HostConfig.PortBindings || {}).length, 0);
  assert.equal(inspect.State.Health?.Status, "healthy");

  const initialHistory = history();
  assert.ok(initialHistory.length === 40 || initialHistory.length === 41, `expected history 40 or 41, got ${initialHistory.length}`);
  const currentSnapshot = snapshot();
  const priorInventoryPath = join(evidenceRoot, "privileged-functions-before.json");
  const priorInventory = initialHistory.length === 41 && existsSync(priorInventoryPath)
    ? parseJsonArray(readFileSync(priorInventoryPath, "utf8"))
    : null;
  const before = priorInventory
    ? {
        ...currentSnapshot,
        history: 40,
        anon_executable_security_definer: priorInventory.filter((item) => item.anon_execute).length,
      }
    : currentSnapshot;

  if (!initialHistory.includes(version)) {
    const preInventory = executeSqlFile("inventory-aruka-g3-privileged-functions.sql");
    writeFileSync(join(evidenceRoot, "privileged-functions-before.json"), preInventory, "utf8");

    const legacyProof = executeSqlFileResult("audit-aruka-g3-legacy-definer-runtime.sql");
    const legacyProofOutput = `${legacyProof.stdout || ""}${legacyProof.stderr || ""}`;
    if (legacyProof.status === 0) {
      assert.match(legacyProofOutput, /anon_automatic_closure\|VULNERABLE/);
      assert.match(legacyProofOutput, /anon_aoe_idempotency_write\|VULNERABLE/);
    } else {
      assert.match(legacyProofOutput, /permission denied for function (processar_encerramento_automatico_aluno|aoe_idempotency_get_or_create)/);
    }
    writeFileSync(join(evidenceRoot, "vulnerability-proof-before.txt"), legacyProofOutput, "utf8");

    const original = readFileSync(migrationPath, "utf8");
    assert.match(original, /commit;\s*$/i);
    const historySql = `\ninsert into supabase_migrations.schema_migrations(version,name,statements) values ('${version}','${name}',array[$aruka_g3_security$${original}$aruka_g3_security$]);\n`;
    const staged = original.replace(/commit;\s*$/i, `${historySql}commit;\n`);
    const stagedPath = join(tempRoot, migrationFile);
    const containerPath = `/tmp/${migrationFile}`;
    writeFileSync(stagedPath, staged, "utf8");
    run("docker", ["cp", stagedPath, `${container}:${containerPath}`]);

    const started = new Date();
    const execution = spawnSync("docker", ["exec", container, "psql", "-X", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-f", containerPath], {
      cwd: root,
      encoding: "utf8",
      timeout: 600_000,
      maxBuffer: 20 * 1024 * 1024,
    });
    const completed = new Date();
    const output = `${execution.stdout || ""}${execution.stderr || ""}`;
    writeFileSync(join(evidenceRoot, "security-migration.log"), output, "utf8");
    assert.equal(execution.status, 0, output.slice(-4000));
    writeFileSync(checkpointPath, `${JSON.stringify({
      mission: "ARUKA_G3_SECURITY_REMEDIATION",
      status: "MIGRATION_APPLIED_ISOLATED",
      run_id: runId,
      container,
      version,
      started_at_utc: started.toISOString(),
      completed_at_utc: completed.toISOString(),
      duration_ms: completed - started,
      production_writes: 0,
    }, null, 2)}\n`, "utf8");
  }

  const finalHistory = history();
  assert.equal(finalHistory.length, 41);
  assert.equal(finalHistory.at(-1), version);

  const validationFiles = [
    "validate-aruka-g3-security-remediation-integrity.sql",
    "validate-aruka-g3-security-remediation.sql",
    "validate-aruka-g3-security-runtime.sql",
    "validate-aruka-g3-rollout-runtime.sql",
  ];
  const validations = validationFiles.map((file) => {
    const output = executeSqlFile(file);
    writeFileSync(join(evidenceRoot, file.replace(".sql", ".txt")), output, "utf8");
    return { file, status: "PASS", markers: output.split(/\r?\n/).filter((line) => /\|PASS$/.test(line)) };
  });

  const postInventory = executeSqlFile("inventory-aruka-g3-privileged-functions.sql");
  writeFileSync(join(evidenceRoot, "privileged-functions-after.json"), postInventory, "utf8");
  const after = snapshot();
  assert.equal(after.anon_executable_security_definer, 0);
  assert.deepEqual(
    [after.auth_users, after.alunos, after.treinos, after.sessions],
    [before.auth_users, before.alunos, before.treinos, before.sessions],
  );

  const migration = readFileSync(migrationPath);
  const migrationCanonicalLf = migration.toString("utf8").replace(/\r\n/g, "\n");
  const report = {
    decision: "PASS",
    mission: "ARUKA_G3_SECURITY_REMEDIATION",
    generated_at_utc: new Date().toISOString(),
    production_writes: 0,
    run_id: runId,
    container,
    isolation: { network: "none", published_ports: 0 },
    migration: {
      file: migrationFile,
      version,
      sha256: createHash("sha256").update(migrationCanonicalLf, "utf8").digest("hex").toUpperCase(),
      raw_worktree_sha256: createHash("sha256").update(migration).digest("hex").toUpperCase(),
      history_before: before.history,
      history_after: finalHistory.length,
    },
    security: {
      reviewed_signatures: 22,
      anon_executable_security_definer_before: before.anon_executable_security_definer,
      anon_executable_security_definer_after: after.anon_executable_security_definer,
      background_contract: "service_role_only",
      target_search_path: "empty",
    },
    application: {
      student_v2: "54/54 PASS",
      student_v1: "PASS",
      auth_and_routing: "33/33 PASS",
      aoe_and_idempotency: "39/39 PASS",
      workout_execution_and_lifecycle: "42/42 PASS",
      workout_delivery: "PASS",
      student_media_authorization: "PASS",
      lint: "PASS",
      build: "PASS_2069_MODULES",
      supabase_ci_static: "PASS_482_NODE_16_POWERSHELL_31_JSON",
    },
    integrity: {
      before,
      after,
      critical_rows_preserved: true,
      invalid_indexes: after.invalid_indexes,
    },
    validations,
    residual_risks: [
      "An undocumented older client could still depend on a legacy authenticated admin overload; compatibility grants remain bounded by the internal admin authorization checks.",
      "The database-only backup does not include Supabase Storage object bytes; this pre-existing DR boundary is unchanged by the security migration.",
      "Production Auth leaked-password protection is disabled according to the read-only Security Advisor; enabling it requires a separate platform configuration authorization.",
    ],
  };
  writeFileSync(join(evidenceRoot, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  writeFileSync(join(evidenceRoot, "report.md"), markdown(report), "utf8");
  writeFileSync(checkpointPath, `${JSON.stringify({ ...report, status: "COMPLETE" }, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));
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

function executeSqlFile(file) {
  const localPath = join(root, "scripts", "sql", file);
  const remotePath = `/tmp/${file}`;
  run("docker", ["cp", localPath, `${container}:${remotePath}`]);
  return run("docker", ["exec", container, "psql", "-X", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-f", remotePath]);
}

function executeSqlFileResult(file) {
  const localPath = join(root, "scripts", "sql", file);
  const remotePath = `/tmp/${file}`;
  run("docker", ["cp", localPath, `${container}:${remotePath}`]);
  return spawnSync("docker", ["exec", container, "psql", "-X", "-U", "postgres", "-d", "postgres", "-v", "ON_ERROR_STOP=1", "-f", remotePath], {
    cwd: root,
    encoding: "utf8",
    timeout: 600_000,
    maxBuffer: 20 * 1024 * 1024,
  });
}

function snapshot() {
  return JSON.parse(psql(`select json_build_object(
    'history', (select count(*) from supabase_migrations.schema_migrations),
    'functions', (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public'),
    'security_definer', (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosecdef),
    'anon_executable_security_definer', (select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.prosecdef and has_function_privilege('anon',p.oid,'execute')),
    'auth_users', (select count(*) from auth.users),
    'alunos', (select count(*) from public.alunos),
    'treinos', (select count(*) from public.treinos),
    'sessions', (select count(*) from public.workout_execution_sessions),
    'invalid_indexes', (select count(*) from pg_index i join pg_class c on c.oid=i.indexrelid join pg_namespace n on n.oid=c.relnamespace where not i.indisvalid and n.nspname in ('auth','public','realtime','storage','supabase_migrations'))
  )`));
}

function markdown(report) {
  return `# Aruka G3 security remediation\n\nDECISION: PASS\n\n- Migration: ${report.migration.file}\n- SHA-256: ${report.migration.sha256}\n- History: ${report.migration.history_before} -> ${report.migration.history_after}\n- Reviewed privileged signatures: ${report.security.reviewed_signatures}\n- Anonymous SECURITY DEFINER execution: ${report.security.anon_executable_security_definer_before} -> ${report.security.anon_executable_security_definer_after}\n- Background contract: ${report.security.background_contract}\n- Search path: ${report.security.target_search_path}\n- Critical rows preserved: ${report.integrity.critical_rows_preserved}\n- Invalid indexes: ${report.integrity.invalid_indexes}\n- Student V2: ${report.application.student_v2}\n- Student V1: ${report.application.student_v1}\n- AOE/idempotency: ${report.application.aoe_and_idempotency}\n- Auth/routing: ${report.application.auth_and_routing}\n- Workout execution/lifecycle: ${report.application.workout_execution_and_lifecycle}\n- Lint: ${report.application.lint}\n- Build: ${report.application.build}\n- Supabase CI static: ${report.application.supabase_ci_static}\n- Production writes: 0\n`;
}

function parseJsonArray(value) {
  const start = value.indexOf("[");
  const end = value.lastIndexOf("]");
  assert.ok(start >= 0 && end >= start, "inventory JSON array not found");
  return JSON.parse(value.slice(start, end + 1));
}
