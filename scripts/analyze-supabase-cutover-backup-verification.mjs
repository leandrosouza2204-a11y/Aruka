import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const backupDir = process.env.ARUKA_BACKUP_DIR || 'C:\\Backups\\Aruka\\aruka-pre-cutover-20260803-173701';
const repoResolved = path.resolve(repoRoot);
const backupResolved = path.resolve(backupDir);

const fail = (message) => {
  throw new Error(message);
};

const read = (file) => fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
const readJson = (file) => JSON.parse(read(file));
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const relPath = (file) => file.replaceAll('\\', '/');

function required(file) {
  const full = path.join(backupResolved, file);
  if (!fs.existsSync(full)) fail(`MISSING_FILE:${relPath(file)}`);
  return full;
}

function assertNoSecretText(file, text) {
  if (/postgresql:\/\/|postgres:\/\//i.test(text)) fail(`SECRET_LEAK:${relPath(file)}`);
  if (/sb_secret_[A-Za-z0-9_-]+/i.test(text)) fail(`SECRET_LEAK:${relPath(file)}`);
  if (/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/i.test(text)) fail(`SECRET_LEAK:${relPath(file)}`);
  if (/password\s*=/i.test(text)) fail(`SECRET_LEAK:${relPath(file)}`);
}

function validateDump(name, manifestEntry, semanticChecks) {
  const file = required(manifestEntry.file);
  const stat = fs.statSync(file);
  if (stat.size <= 0) fail(`${name.toUpperCase()}_EMPTY`);
  if (stat.size !== manifestEntry.size_bytes) fail(`${name.toUpperCase()}_SIZE_MISMATCH`);
  if (sha256(file).toLowerCase() !== manifestEntry.sha256.toLowerCase()) fail(`${name.toUpperCase()}_HASH_MISMATCH`);
  const text = read(file);
  assertNoSecretText(manifestEntry.file, text);
  for (const [label, regex] of semanticChecks) {
    if (!regex.test(text)) fail(`${name.toUpperCase()}_${label}`);
  }
  return { size: stat.size, hashValid: true };
}

if (!fs.existsSync(backupResolved)) fail('BLOCKED_BACKUP_DIRECTORY_MISSING');
if (backupResolved.toLowerCase().startsWith(repoResolved.toLowerCase())) fail('BLOCKED_BACKUP_INSIDE_REPOSITORY');

const manifest = readJson(required('backup-manifest.json'));
if (manifest.project?.name !== 'aruka') fail('BLOCKED_BACKUP_MANIFEST_MISMATCH');
if (manifest.project?.ref_masked !== 'vriz...vdik') fail('BLOCKED_BACKUP_MANIFEST_MISMATCH');
if (manifest.backup?.type !== 'LOGICAL_DATABASE_PLUS_STORAGE') fail('BLOCKED_BACKUP_MANIFEST_MISMATCH');
if (manifest.backup?.status !== 'BACKUP_LOGICAL_COMPLETE') fail('BLOCKED_BACKUP_MANIFEST_MISMATCH');
if (manifest.credentials?.stored !== false || manifest.credentials?.logged !== false) fail('BLOCKED_BACKUP_MANIFEST_MISMATCH');
if (manifest.restore?.executed !== false) fail('RESTORE_EXECUTED_SHOULD_BE_FALSE');
if (manifest.cutover?.authorized !== false || manifest.cutover?.executed !== false) fail('CUTOVER_STATE_INVALID');
if (manifest.production_execution_authorized === true) fail('PRODUCTION_AUTHORIZATION_INVALID');
if (manifest.cutover_allowed === true) fail('CUTOVER_STATE_INVALID');
if (manifest.storage?.bucket !== 'avaliacoes-fotos') fail('BLOCKED_BACKUP_MANIFEST_MISMATCH');
if (manifest.storage?.objects_listed !== 8 || manifest.storage?.objects_downloaded !== 8 || manifest.storage?.objects_failed !== 0) fail('BLOCKED_BACKUP_MANIFEST_MISMATCH');
if (manifest.storage?.total_bytes !== 2113714) fail('BLOCKED_BACKUP_MANIFEST_MISMATCH');

const started = Date.parse(manifest.backup.started_at_utc);
const completed = Date.parse(manifest.backup.completed_at_utc);
if (!Number.isFinite(started) || !Number.isFinite(completed) || started > completed) fail('BAD_BACKUP_TIMESTAMPS');

const roles = validateDump('roles', manifest.database.roles, [
  ['READ_ONLY_MARKER_MISSING', /SET\s+default_transaction_read_only/i],
  ['ROLE_STATEMENT_MISSING', /(ALTER|CREATE)\s+ROLE/i],
]);
const schema = validateDump('schema', manifest.database.schema, [
  ['OBJECT_SQL_MISSING', /(CREATE\s+TABLE|CREATE\s+FUNCTION|CREATE\s+INDEX|ALTER\s+TABLE|CREATE\s+POLICY|CREATE\s+TYPE|CREATE\s+TRIGGER)/i],
  ['ALUNOS_MISSING', /public\.alunos/i],
  ['PERFIS_MISSING', /public\.perfis/i],
  ['TREINOS_MISSING', /public\.treinos/i],
  ['TREINO_EVENTOS_MISSING', /public\.treino_eventos/i],
  ['WORKOUT_TEMPLATES_MISSING', /public\.workout_templates/i],
]);
const data = validateDump('data', manifest.database.data, [
  ['DATA_FORMAT_MISSING', /(COPY|INSERT\s+INTO)/i],
]);

const sums = read(required('SHA256SUMS.txt')).split(/\r?\n/).filter(Boolean);
let checksumMismatchCount = 0;
let manifestChecksumValid = false;
const listed = new Set();
for (const line of sums) {
  const match = line.match(/^([a-f0-9]{64})\s+(.+)$/i);
  if (!match) fail('BAD_SHA256SUMS_FORMAT');
  const expected = match[1].toLowerCase();
  const relative = match[2].trim();
  if (relative.includes('..') || path.isAbsolute(relative)) fail('BAD_SHA256SUMS_PATH');
  const file = path.join(backupResolved, relative);
  if (!fs.existsSync(file)) fail('SHA256SUMS_FILE_MISSING');
  listed.add(relative.replaceAll('\\', '/'));
  if (sha256(file).toLowerCase() !== expected) checksumMismatchCount += 1;
  if (relative.replaceAll('\\', '/') === 'backup-manifest.json') manifestChecksumValid = sha256(file).toLowerCase() === expected;
}
if (checksumMismatchCount !== 0) fail('BLOCKED_BACKUP_CHECKSUM_MISMATCH');
if (!manifestChecksumValid) fail('BACKUP_MANIFEST_CHECKSUM_MISSING');

const storageManifest = readJson(required('validation/storage-avaliacoes-fotos-manifest.json'));
if (storageManifest.bucket !== 'avaliacoes-fotos' || storageManifest.objects_listed !== 8 || storageManifest.objects_downloaded !== 8 || storageManifest.objects_failed !== 0 || storageManifest.total_bytes !== 2113714 || storageManifest.status !== 'PASS') fail('BLOCKED_STORAGE_MANIFEST_MISMATCH');

const storageRoot = required('storage/avaliacoes-fotos');
const physical = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile()) physical.push(full);
  }
}
walk(storageRoot);
const physicalRel = new Map(physical.map((file) => [path.relative(storageRoot, file).replaceAll('\\', '/'), file]));
let storageMissingFileCount = 0;
let storageHashMismatchCount = 0;
let storageTotalBytes = 0;
const manifestStoragePaths = new Set();
for (const entry of storageManifest.files) {
  const relative = entry.path;
  if (relative.includes('..') || path.isAbsolute(relative)) fail('BAD_STORAGE_PATH');
  manifestStoragePaths.add(relative);
  const file = physicalRel.get(relative);
  if (!file) {
    storageMissingFileCount += 1;
    continue;
  }
  const stat = fs.statSync(file);
  storageTotalBytes += stat.size;
  if (stat.size !== entry.size_bytes || sha256(file).toLowerCase() !== entry.sha256.toLowerCase()) storageHashMismatchCount += 1;
}
const storageExtraFileCount = [...physicalRel.keys()].filter((file) => !manifestStoragePaths.has(file)).length;
if (storageMissingFileCount !== 0) fail('BLOCKED_STORAGE_BACKUP_VERIFICATION');
if (storageExtraFileCount !== 0) fail('BLOCKED_STORAGE_BACKUP_INVENTORY_DRIFT');
if (storageHashMismatchCount !== 0) fail('BLOCKED_STORAGE_BACKUP_VERIFICATION');
if (physical.length !== 8 || storageTotalBytes !== 2113714) fail('BLOCKED_STORAGE_BACKUP_VERIFICATION');

const logLines = read(required('logs/backup-runner.jsonl')).split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
if (logLines.some((line) => line.status === 'FAIL')) fail('BLOCKED_BACKUP_RUNNER_LOG_FAILURE');
for (const step of ['roles-dump', 'schema-dump', 'data-dump', 'storage-download', 'manifest']) {
  if (!logLines.some((line) => line.step === step)) fail(`RUNNER_STEP_MISSING:${step}`);
}
const cliExitAnomalyAccepted = ['roles-dump', 'schema-dump', 'data-dump'].every((step) => logLines.some((line) => line.step === step && ['PASS', 'PASS_WITH_CLI_EXIT_ANOMALY'].includes(line.status)));
if (!cliExitAnomalyAccepted) fail('CLI_EXIT_ANOMALY_NOT_ACCEPTED');

for (const file of [
  'backup-manifest.json',
  'README-BACKUP.md',
  'SHA256SUMS.txt',
  'logs/backup-runner.jsonl',
  'logs/roles-dump.err.log',
  'logs/schema-dump.err.log',
  'logs/data-dump.err.log',
  'logs/storage-download.err.log',
]) {
  const full = path.join(backupResolved, file);
  if (fs.existsSync(full)) assertNoSecretText(file, read(full));
}

const readme = read(required('README-BACKUP.md'));
for (const requiredText of ['aruka', 'vriz...vdik', 'BACKUP_LOGICAL_COMPLETE', 'Restore executed:', 'NO', 'Cutover authorized:', 'Credentials stored:', 'Credentials logged:']) {
  if (!readme.includes(requiredText)) fail('README_BACKUP_INVALID');
}

const result = {
  decision: 'READY_FOR_FINAL_CUTOVER_AUTHORIZATION',
  backup_reference: path.basename(backupResolved),
  manifest_valid: true,
  roles_bytes: roles.size,
  schema_bytes: schema.size,
  data_bytes: data.size,
  database_hashes_valid: true,
  storage_objects_verified: physical.length,
  storage_total_bytes: storageTotalBytes,
  checksum_mismatch_count: checksumMismatchCount,
  storage_missing_file_count: storageMissingFileCount,
  storage_extra_file_count: storageExtraFileCount,
  storage_hash_mismatch_count: storageHashMismatchCount,
  runner_log_valid: true,
  cli_exit_anomaly_accepted: cliExitAnomalyAccepted,
  secret_leak_detected: false,
  restore_method_reviewed: true,
  restore_test_executed: false,
  backup_verified: true,
  production_execution_authorized: false,
  cutover_allowed: false,
  backup_duration_seconds: Math.round((completed - started) / 1000),
};

console.log(JSON.stringify(result, null, 2));
