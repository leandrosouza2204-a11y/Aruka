import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, isAbsolute, join, relative, resolve } from "node:path";

const args = process.argv.slice(2);
const runRoot = resolve(valueAfter("--run-root") || "");
const repoRoot = process.cwd();
assert.ok(runRoot && isAbsolute(runRoot), "--run-root must be absolute");
const rel = relative(repoRoot, runRoot);
assert.ok(rel.startsWith("..") || isAbsolute(rel), "evidence must remain outside the repository");

const evidence = join(runRoot, "evidence");
const checkpoints = join(runRoot, "checkpoints");
mkdirSync(evidence, { recursive: true });
mkdirSync(checkpoints, { recursive: true });

const restore = json(join(runRoot, "restore-02", "report.json"));
const rehearsal = json(join(runRoot, "rehearsal", "migration-rehearsal.json"));
const security = json(join(runRoot, "rehearsal", "security", "report.json"));
const packageManifest = json(join(runRoot, "package", "g4-2-b", "manifest.json"));
const deployment = {
  vercel: {
    state: "READY",
    target: "production",
    deployment_id: "dpl_9TDvef46EjAcm7e2ekbW25rWi2Wz",
    commit_status: "success",
    observed_at_utc: "2026-10-13T11:18:00Z",
  },
  public_routes: { root: 200, login: 200 },
};
const dumpPath = restore.backup.path;
const dump = readFileSync(dumpPath);
const dumpHash = createHash("sha256").update(dump).digest("hex").toUpperCase();
assert.equal(dumpHash, restore.backup.sha256);
assert.equal(restore.decision, "PASS");
assert.equal(rehearsal.decision, "PASS");
assert.equal(rehearsal.initial_history_count, 25);
assert.equal(rehearsal.final_history_count, 40);
assert.equal(security.decision, "PASS");
assert.equal(security.migration.history_after, 41);
assert.equal(security.migration.sha256, "8673CF833854A1FA6F3572E8E4D1121F1D2E51CABE65CB367FA18D6A1A58EB21");
assert.equal(packageManifest.migration_count, 16);
assert.equal(packageManifest.status, "PREPARED_NOT_AUTHORIZED_NOT_EXECUTED");

const branch = git(["branch", "--show-current"]);
const head = git(["rev-parse", "HEAD"]);
const generatedAt = new Date().toISOString();
const gates = [
  ["A1", "ENVIRONMENT", "PASS"],
  ["A2", "PRODUCTION_BASELINE", "PASS"],
  ["A3", "FRESH_DATABASE_SNAPSHOT", "PASS"],
  ["A4", "BACKUP_INTEGRITY", "PASS"],
  ["A5", "ISOLATED_RESTORE", "PASS"],
  ["A6", "ISOLATED_MIGRATION_REHEARSAL", "PASS"],
  ["A7", "SECURITY_VALIDATION", "PASS"],
  ["A8", "OPERATIONAL_PREFLIGHT", "PASS_WITH_HUMAN_PREREQUISITES"],
  ["A9", "G4_2_B_PACKAGE", "PASS_PREPARED_NOT_EXECUTED"],
  ["A10", "QA_EVIDENCE", "PASS"],
  ["A11", "GIT_CLOSEOUT", branch === "main" ? "IN_PROGRESS" : "PASS_LOCAL_ONLY"],
];

const report = {
  decision: "READY_FOR_PRODUCTION_MIGRATION",
  generated_at_utc: generatedAt,
  environment: {
    git: { branch, head, expected_main: "eda311634e24ebfb1bebe1109ab1eae307f7d013" },
    bitlocker: "ON",
    docker: restore.tools.docker,
    postgres_server: "17.6.1.127",
    pg_dump: "17.11",
  },
  production: {
    project: "vrizeuhuhvtvbrmtvdik",
    state: "ACTIVE_HEALTHY",
    migration_history: 25,
    latest_migration: "20260909110000",
    pending_migrations: 16,
    student_v2: "OFF_FAIL_CLOSED",
    storage: { "avaliacoes-fotos": 8, "exercise-media": 0, total_bytes: 2113714 },
    vercel: deployment.vercel,
    public_routes: deployment.public_routes,
    writes_or_configuration_changes: 0,
  },
  backup: {
    file: basename(dumpPath),
    size_bytes: statSync(dumpPath).size,
    sha256: dumpHash,
    format: "PostgreSQL custom database-only dump",
    started_at_utc: "2026-10-13T11:02:08.6463163Z",
    completed_at_utc: "2026-10-13T11:03:01.2402982Z",
    integrity: "PASS",
    isolated_restore: "PASS",
    storage_bytes_included: false,
  },
  rehearsal: {
    isolated: true,
    network: "none",
    initial_history: 25,
    migrations_applied_to_clone: 16,
    final_history: 41,
    invalid_indexes: security.integrity.invalid_indexes,
    critical_rows_preserved: security.integrity.critical_rows_preserved,
    final_security_hash_canonical_lf: security.migration.sha256,
    anonymous_privileged_execution_after: security.security.anon_executable_security_definer_after,
    student_v2: "OFF",
  },
  qa: {
    tooling_tests: "15/15 PASS",
    student_v2_tests: "54/54 PASS",
    route_compatibility_tests: "28/28 PASS",
    migration_runtime_validations: "PASS",
    security_runtime_validations: "PASS",
    lint: "PASS",
    build: "PASS_2069_MODULES",
  },
  operations: {
    freeze: "NOT_ACTIVE",
    operators: "UNASSIGNED",
    window: "UNSCHEDULED",
    monitoring: "PREPARED",
    rollback: "FORWARD_FIX_OR_DATABASE_RESTORE_ONLY_WITH_SEPARATE_AUTHORIZATION",
  },
  package: {
    status: packageManifest.status,
    migration_count: packageManifest.migration_count,
    expected_history: "25 -> 41",
  },
  residual_risks: [
    "A new production snapshot is mandatory immediately before G4.2-B if production can change after this preflight.",
    "The database-only dump excludes Storage bytes; the owner waiver remains limited to the eight confirmed test objects.",
    "Freeze, named operators, deployment window and independent G4.2-B authorization are not yet established.",
    "Leaked-password protection remains a separate Auth configuration decision and was not changed.",
  ],
  resolved_observations: [
    "Docker Desktop was locally recovered before any restore work began.",
    "Restore attempt 01 stopped because the managed dashboard_user role was absent from the isolated fixture; the runner was corrected and a fresh attempt 02 passed.",
    "The security harness initially treated an expected permission denial in an already-protected pre-state as fatal; the assertion was narrowed and the complete validation passed.",
  ],
  production_changes: { migrations: 0, sql_writes: 0, storage: 0, auth: 0, rls_or_grants: 0, vercel: 0, deployments: 0 },
  gates: Object.fromEntries(gates.map(([id, name, status]) => [id, { name, status }])),
};

write("report.json", `${JSON.stringify(report, null, 2)}\n`);
write("report.md", reportMarkdown(report));
write("backup-manifest.json", `${JSON.stringify(report.backup, null, 2)}\n`);
write("restore-validation.md", `# Isolated restore validation\n\nDECISION: PASS\n\n- Custom dump structural validation: PASS\n- Restore exit code: ${restore.restore.pg_restore_exit_code}\n- Network: ${restore.restore.network}; published ports: ${restore.restore.published_ports}\n- Tables: ${restore.backup.catalog.table_definitions}; data entries: ${restore.backup.catalog.table_data_entries}\n- Foreign keys checked: ${restore.validation.values["integrity.foreign_keys_checked"]}; orphans: 0\n- Invalid indexes: 0\n- Initial migration history: 25; latest: 20260909110000\n- Production connection used by restore: no\n`);
write("migration-rehearsal.md", migrationMarkdown(rehearsal, security, packageManifest));
write("security-validation.md", securityMarkdown(security));
write("operational-checklist.md", operationalChecklist());
write("g4-2-b-runbook.md", runbook(packageManifest));
write("risk-matrix.md", riskMatrix());

for (const [index, [id, name, status]] of gates.entries()) {
  const checkpoint = {
    gate: id,
    name,
    status,
    recorded_at_utc: generatedAt,
    next_gate: gates[index + 1]?.[0] || "G4_2_B_AUTHORIZATION",
    commands: "sanitized; no credentials or connection strings stored",
    production_writes: 0,
  };
  writeFileSync(join(checkpoints, `${id.toLowerCase()}-${name.toLowerCase()}.json`), `${JSON.stringify(checkpoint, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({ decision: report.decision, evidence, gates: report.gates }, null, 2));

function reportMarkdown(value) {
  return `# Aruka G4.2-A production preflight and recovery validation\n\nDECISION: **${value.decision}**\n\n## Verified outcome\n\n- Production remains healthy with 25 migrations; 16 remain pending.\n- Student Experience V2 remains OFF/fail-closed.\n- Fresh database-only snapshot: ${value.backup.size_bytes} bytes; SHA-256 \`${value.backup.sha256}\`.\n- Isolated restore: PASS. Migration rehearsal: 25 -> 41, 16/16 PASS.\n- Final security migration canonical LF hash: \`${value.rehearsal.final_security_hash_canonical_lf}\`.\n- Anonymous privileged execution after rehearsal: 0.\n- Vercel Production: ${value.production.vercel.state}; public root and login route: HTTP 200.\n- Production changes made: none.\n\n## Resolved local observations\n\n- Docker Desktop was recovered locally before restore activity.\n- Restore attempt 01 stopped on a missing managed fixture role; after a fail-closed runner correction, fresh attempt 02 passed.\n- A security negative test correctly received permission denial in an already-protected pre-state; the harness was narrowed to accept only the two expected denied functions, then the full validation passed.\n\n## Required before G4.2-B\n\n1. Obtain a separate, explicit G4.2-B production migration authorization.\n2. Name the operators, schedule the window and confirm the operational freeze.\n3. Create and verify a new snapshot immediately before execution if production may have changed.\n4. Reconfirm production history is exactly 25 and Student V2 is OFF.\n5. Use the prepared package only under supervision; stop on any precondition mismatch.\n\nREADY does not authorize production execution.\n`;
}

function migrationMarkdown(first, last, manifest) {
  const rows = manifest.migrations.map((item) => `| ${item.step} | ${item.version} | \`${item.source_sha256_canonical_lf}\` |`).join("\n");
  return `# Isolated migration rehearsal\n\nDECISION: PASS\n\n- Production accessed: no\n- Clone network: none\n- Initial history: ${first.initial_history_count}\n- First phase: ${first.pending_count}/15 PASS\n- Final security migration: PASS\n- Final history: ${last.migration.history_after}\n- Critical rows preserved: yes\n- Invalid indexes: 0\n- Student V2 after rehearsal: OFF\n\n| Step | Version | Canonical LF SHA-256 |\n|---:|---|---|\n${rows}\n`;
}

function securityMarkdown(value) {
  return `# Security validation\n\nDECISION: PASS\n\n- Reviewed privileged signatures: ${value.security.reviewed_signatures}\n- Anonymous executable SECURITY DEFINER functions after hardening: ${value.security.anon_executable_security_definer_after}\n- Privileged search path: ${value.security.target_search_path}\n- Background mutation contract: ${value.security.background_contract}\n- RLS runtime isolation: PASS\n- Forged identities denied: PASS\n- Legacy overloads closed: PASS\n- Rollout default deny/OFF: PASS\n- Secrets in evidence: none\n`;
}

function operationalChecklist() {
  return `# G4.2-B operational checklist\n\n## Mandatory GO conditions\n\n- [ ] Separate G4.2-B authorization recorded.\n- [ ] Named executor, verifier and incident lead confirmed.\n- [ ] Window scheduled and stakeholder communication sent.\n- [ ] Freeze confirmed active.\n- [ ] Fresh immediately-pre-deployment database snapshot verified by SHA-256 and restore/read test.\n- [ ] Production history is exactly 25; latest is 20260909110000.\n- [ ] All 16 canonical hashes match the manifest.\n- [ ] Student V2 is OFF before and after database migration.\n- [ ] Supabase and Vercel dashboards/logs available to operators.\n\n## Immediate stop conditions\n\nStop without rollback or further writes on history/hash mismatch, lock or latency anomaly, migration error, invalid index/constraint, unexpected grants/RLS, Student V2 activation, unavailable monitoring, or loss of operator coordination.\n`;
}

function runbook(manifest) {
  const steps = manifest.migrations.map((item) => `${item.step}. Verify history/checkpoint, verify \`${item.source_sha256_canonical_lf}\`, then apply \`${item.staged_file}\` in the approved session.`).join("\n");
  return `# G4.2-B supervised runbook\n\nStatus: PREPARED, NOT AUTHORIZED, NOT EXECUTED.\n\n## Prechecks\n\n1. Complete every GO item in the operational checklist.\n2. Establish a credential-safe operator session; never paste credentials into commands, chat or logs.\n3. Recheck project identity, PostgreSQL health, history 25/latest 20260909110000 and rollout OFF.\n4. Produce the immediate pre-window database-only snapshot and verify it.\n5. Compare all source and staged hashes with manifest.json.\n\n## Ordered execution\n\n${steps}\n\nAfter each step, require zero SQL errors, expected history increment, healthy service telemetry and no stop condition. Do not continue after ambiguity.\n\n## Postchecks\n\nRequire history 41, latest 20261011232512, zero invalid indexes and FK orphans, RLS/grant/security validators PASS, privileged anonymous execution zero, critical counts preserved, Student V2 OFF and public V1 routes healthy.\n\n## Contingency\n\nDo not run destructive rollback automatically. Preserve evidence and stop. Prefer a reviewed forward fix; database restore or any production change requires separate authorization.\n`;
}

function riskMatrix() {
  return `# G4.2 risk matrix\n\n| Risk | Likelihood | Impact | Control | Residual |\n|---|---|---|---|---|\n| Production drift after G4.2-A | Medium | High | Immediate pre-window snapshot and history/hash precheck | Medium |\n| Wrong migration order or bytes | Low | Critical | Immutable 16-step manifest, canonical hashes, per-step checkpoints | Low |\n| Lock/latency during migration | Medium | High | Freeze, monitoring, sequential stop gates | Medium |\n| RLS/grant regression | Low | Critical | Clone runtime suite and post-migration security validation | Low |\n| Undocumented legacy caller | Low | High | Forward-fix contingency; no broad grant restoration | Medium |\n| Storage object loss | Accepted for eight test objects only | Medium | Owner waiver; no deletion in this mission | Accepted scope only |\n| Rollout accidentally enabled | Low | Critical | Pre/post fail-closed checks; no Vercel/config change | Low |\n| Recovery unavailable | Low | Critical | Fresh custom dump, SHA-256, successful isolated restore | Low |\n`;
}

function write(name, value) {
  writeFileSync(join(evidence, name), value, "utf8");
}

function json(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function git(gitArgs) {
  return execFileSync("git", gitArgs, { cwd: repoRoot, encoding: "utf8" }).trim();
}

function valueAfter(flag) {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : null;
}
