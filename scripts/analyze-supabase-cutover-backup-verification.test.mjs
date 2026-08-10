import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';

const root = process.cwd();
const script = path.join(root, 'scripts/analyze-supabase-cutover-backup-verification.mjs');

const hash = (content) => crypto.createHash('sha256').update(content).digest('hex');

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-verification-'));
  const roles = 'SET default_transaction_read_only = off;\nCREATE ROLE authenticated;\n';
  const schema = 'CREATE TABLE public.alunos(id int);\nCREATE TABLE public.perfis(id int);\nCREATE TABLE public.treinos(id int);\nCREATE TABLE public.treino_eventos(id int);\nCREATE TABLE public.workout_templates(id int);\nCREATE FUNCTION public.f() RETURNS int LANGUAGE sql AS $$ select 1 $$;\n';
  const data = 'COPY public.alunos (id) FROM stdin;\n1\n\\\\.\n';
  const storageFiles = Array.from({ length: 8 }, (_, index) => ({
    path: `file-${index + 1}.jpg`,
    content: Buffer.alloc(index === 0 ? 2113707 : 1, index + 1),
  }));
  write(path.join(dir, 'database/roles.sql'), roles);
  write(path.join(dir, 'database/schema.sql'), schema);
  write(path.join(dir, 'database/data.sql'), data);
  for (const file of storageFiles) write(path.join(dir, 'storage/avaliacoes-fotos', file.path), file.content);
  const manifest = {
    project: { name: 'aruka', ref_masked: 'vriz...vdik' },
    backup: { type: 'LOGICAL_DATABASE_PLUS_STORAGE', started_at_utc: '2026-08-03T20:37:01.000Z', completed_at_utc: '2026-08-03T20:37:02.000Z', status: 'BACKUP_LOGICAL_COMPLETE' },
    database: {
      roles: { file: 'database/roles.sql', size_bytes: Buffer.byteLength(roles), sha256: hash(roles) },
      schema: { file: 'database/schema.sql', size_bytes: Buffer.byteLength(schema), sha256: hash(schema) },
      data: { file: 'database/data.sql', size_bytes: Buffer.byteLength(data), sha256: hash(data) },
    },
    storage: { bucket: 'avaliacoes-fotos', objects_listed: 8, objects_downloaded: 8, objects_failed: 0, total_bytes: 2113714 },
    credentials: { stored: false, logged: false },
    restore: { executed: false },
    cutover: { authorized: false, executed: false },
  };
  const storageManifest = {
    bucket: 'avaliacoes-fotos',
    objects_listed: 8,
    objects_downloaded: 8,
    objects_failed: 0,
    total_bytes: 2113714,
    status: 'PASS',
    files: storageFiles.map((file) => ({ path: file.path, size_bytes: file.content.length, sha256: hash(file.content) })),
  };
  write(path.join(dir, 'backup-manifest.json'), JSON.stringify(manifest, null, 2));
  write(path.join(dir, 'validation/storage-avaliacoes-fotos-manifest.json'), JSON.stringify(storageManifest, null, 2));
  write(path.join(dir, 'README-BACKUP.md'), 'Project: aruka\nvriz...vdik\nResult: BACKUP_LOGICAL_COMPLETE\nRestore executed:\nNO\nCutover authorized:\nNO\nCredentials stored:\nNO\nCredentials logged:\nNO\n');
  write(path.join(dir, 'logs/backup-runner.jsonl'), [
    { step: 'roles-dump', status: 'STARTED' },
    { step: 'roles-dump', status: 'PASS_WITH_CLI_EXIT_ANOMALY' },
    { step: 'schema-dump', status: 'STARTED' },
    { step: 'schema-dump', status: 'PASS_WITH_CLI_EXIT_ANOMALY' },
    { step: 'data-dump', status: 'STARTED' },
    { step: 'data-dump', status: 'PASS_WITH_CLI_EXIT_ANOMALY' },
    { step: 'storage-download', status: 'STARTED' },
    { step: 'storage-download', status: 'PASS' },
    { step: 'manifest', status: 'PASS' },
  ].map((line) => JSON.stringify(line)).join('\n'));
  for (const log of ['roles-dump.err.log', 'schema-dump.err.log', 'data-dump.err.log', 'storage-download.err.log']) write(path.join(dir, `logs/${log}`), '');
  const sums = [
    ['database/roles.sql', hash(roles)],
    ['database/schema.sql', hash(schema)],
    ['database/data.sql', hash(data)],
    ...storageFiles.map((file) => [`storage/avaliacoes-fotos/${file.path}`, hash(file.content)]),
    ['backup-manifest.json', hash(fs.readFileSync(path.join(dir, 'backup-manifest.json')))],
  ].map(([file, sum]) => `${sum}  ${file}`).join('\n');
  write(path.join(dir, 'SHA256SUMS.txt'), sums);
  return dir;
}

function run(dir) {
  return execFileSync(process.execPath, [script], { cwd: root, env: { ...process.env, ARUKA_BACKUP_DIR: dir }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function fails(dir, expected) {
  assert.throws(() => run(dir), (error) => String(error.stderr || error.message).includes(expected));
}

test('manifest missing fails', () => {
  const dir = fixture();
  fs.unlinkSync(path.join(dir, 'backup-manifest.json'));
  fails(dir, 'MISSING_FILE');
});

test('wrong project fails', () => {
  const dir = fixture();
  const file = path.join(dir, 'backup-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.project.name = 'other';
  fs.writeFileSync(file, JSON.stringify(manifest));
  fails(dir, 'BLOCKED_BACKUP_MANIFEST_MISMATCH');
});

test('backup status not complete fails', () => {
  const dir = fixture();
  const file = path.join(dir, 'backup-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.backup.status = 'PENDING';
  fs.writeFileSync(file, JSON.stringify(manifest));
  fails(dir, 'BLOCKED_BACKUP_MANIFEST_MISMATCH');
});

test('checksum mismatch fails', () => {
  const dir = fixture();
  fs.appendFileSync(path.join(dir, 'database/data.sql'), 'changed');
  fails(dir, 'DATA_SIZE_MISMATCH');
});

test('roles invalid fails', () => {
  const dir = fixture();
  fs.writeFileSync(path.join(dir, 'database/roles.sql'), 'SET default_transaction_read_only = off;');
  const file = path.join(dir, 'backup-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.database.roles.size_bytes = fs.statSync(path.join(dir, 'database/roles.sql')).size;
  manifest.database.roles.sha256 = hash(fs.readFileSync(path.join(dir, 'database/roles.sql')));
  fs.writeFileSync(file, JSON.stringify(manifest));
  fails(dir, 'ROLES_ROLE_STATEMENT_MISSING');
});

test('schema invalid fails', () => {
  const dir = fixture();
  fs.writeFileSync(path.join(dir, 'database/schema.sql'), 'CREATE TABLE public.alunos(id int);');
  const file = path.join(dir, 'backup-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.database.schema.size_bytes = fs.statSync(path.join(dir, 'database/schema.sql')).size;
  manifest.database.schema.sha256 = hash(fs.readFileSync(path.join(dir, 'database/schema.sql')));
  fs.writeFileSync(file, JSON.stringify(manifest));
  fails(dir, 'SCHEMA_PERFIS_MISSING');
});

test('data invalid fails', () => {
  const dir = fixture();
  fs.writeFileSync(path.join(dir, 'database/data.sql'), 'SELECT 1;');
  const file = path.join(dir, 'backup-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.database.data.size_bytes = fs.statSync(path.join(dir, 'database/data.sql')).size;
  manifest.database.data.sha256 = hash(fs.readFileSync(path.join(dir, 'database/data.sql')));
  fs.writeFileSync(file, JSON.stringify(manifest));
  fails(dir, 'DATA_DATA_FORMAT_MISSING');
});

test('Storage missing file fails', () => {
  const dir = fixture();
  fs.unlinkSync(path.join(dir, 'storage/avaliacoes-fotos/file-1.jpg'));
  fails(dir, 'SHA256SUMS_FILE_MISSING');
});

test('Storage extra file fails', () => {
  const dir = fixture();
  write(path.join(dir, 'storage/avaliacoes-fotos/extra.jpg'), 'x');
  fails(dir, 'BLOCKED_STORAGE_BACKUP_INVENTORY_DRIFT');
});

test('Storage hash mismatch fails', () => {
  const dir = fixture();
  fs.writeFileSync(path.join(dir, 'storage/avaliacoes-fotos/file-1.jpg'), 'changed');
  fails(dir, 'BLOCKED_BACKUP_CHECKSUM_MISMATCH');
});

test('runner FAIL entry fails', () => {
  const dir = fixture();
  fs.appendFileSync(path.join(dir, 'logs/backup-runner.jsonl'), '\n{"step":"x","status":"FAIL"}');
  fails(dir, 'BLOCKED_BACKUP_RUNNER_LOG_FAILURE');
});

test('secret leak fails', () => {
  const dir = fixture();
  fs.writeFileSync(path.join(dir, 'logs/data-dump.err.log'), 'postgresql://user:pass@example/db');
  fails(dir, 'SECRET_LEAK');
});

test('cutover allowed fails', () => {
  const dir = fixture();
  const file = path.join(dir, 'backup-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.cutover.authorized = true;
  fs.writeFileSync(file, JSON.stringify(manifest));
  fails(dir, 'CUTOVER_STATE_INVALID');
});

test('production authorization true fails through result fixture', () => {
  const dir = fixture();
  const file = path.join(dir, 'backup-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'));
  manifest.production_execution_authorized = true;
  fs.writeFileSync(file, JSON.stringify(manifest));
  fails(dir, 'PRODUCTION_AUTHORIZATION_INVALID');
});

test('valid backup passes', () => {
  const output = run(fixture());
  assert.match(output, /READY_FOR_FINAL_CUTOVER_AUTHORIZATION/);
});
