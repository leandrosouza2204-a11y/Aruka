import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const script = path.join(root, 'scripts/analyze-supabase-cutover-backup-preparation.mjs');
const sourceFiles = [
  'docs/supabase-production-sync/25-cutover-backup-preparation.md',
  'reports/supabase-production-sync/cutover-backup-critical-data-inventory.json',
  'reports/supabase-production-sync/cutover-backup-critical-data-inventory.md',
  'reports/supabase-production-sync/cutover-backup-checklist.md',
  'reports/supabase-production-sync/cutover-backup-evidence-template.json',
  'reports/supabase-production-sync/cutover-backup-evidence-template.md',
  'reports/supabase-production-sync/cutover-restore-readiness.md',
  'reports/supabase-production-sync/cutover-backup-preparation-result.json',
  'reports/supabase-production-sync/cutover-backup-preparation-summary.md',
  'reports/supabase-production-sync/production-cutover-sql/manifest.json',
];

function copyFixture() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cutover-backup-prep-'));
  for (const rel of sourceFiles) {
    const dest = path.join(tmp, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(path.join(root, rel), dest);
  }
  return tmp;
}

function run(cwd) {
  return execFileSync(process.execPath, [script], { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function fails(cwd, expected) {
  assert.throws(() => run(cwd), (error) => String(error.stderr || error.message).includes(expected));
}

test('backup_verified=true without evidence fails', () => {
  const tmp = copyFixture();
  const file = path.join(tmp, 'reports/supabase-production-sync/cutover-backup-preparation-result.json');
  const result = JSON.parse(fs.readFileSync(file, 'utf8'));
  result.backup_verified = true;
  fs.writeFileSync(file, JSON.stringify(result, null, 2));
  fails(tmp, 'BACKUP_VERIFIED_SHOULD_BE_FALSE');
});

test('cutover_allowed=true fails', () => {
  const tmp = copyFixture();
  const file = path.join(tmp, 'reports/supabase-production-sync/cutover-backup-preparation-result.json');
  const result = JSON.parse(fs.readFileSync(file, 'utf8'));
  result.cutover_allowed = true;
  fs.writeFileSync(file, JSON.stringify(result, null, 2));
  fails(tmp, 'CUTOVER_ALLOWED_SHOULD_BE_FALSE');
});

test('production authorized=true fails', () => {
  const tmp = copyFixture();
  const file = path.join(tmp, 'reports/supabase-production-sync/cutover-backup-preparation-result.json');
  const result = JSON.parse(fs.readFileSync(file, 'utf8'));
  result.production_execution_authorized = true;
  fs.writeFileSync(file, JSON.stringify(result, null, 2));
  fails(tmp, 'PRODUCTION_AUTHORIZED_SHOULD_BE_FALSE');
});

test('full project ref fails', () => {
  const tmp = copyFixture();
  const file = path.join(tmp, 'docs/supabase-production-sync/25-cutover-backup-preparation.md');
  fs.appendFileSync(file, '\nvrizeuhuhvtvbrmtvdik\n');
  fails(tmp, 'FULL_PROJECT_REF_EXPOSED');
});

test('password or token fails', () => {
  const tmp = copyFixture();
  const file = path.join(tmp, 'reports/supabase-production-sync/cutover-backup-evidence-template.md');
  fs.appendFileSync(file, '\npassword=secret\n');
  fails(tmp, 'SECRET_PATTERN');
});

test('backup file in worktree fails', () => {
  const tmp = copyFixture();
  fs.writeFileSync(path.join(tmp, 'backup.dump'), 'not real');
  fails(tmp, 'BACKUP_FILE_IN_WORKTREE');
});

test('missing restore plan fails', () => {
  const tmp = copyFixture();
  fs.unlinkSync(path.join(tmp, 'reports/supabase-production-sync/cutover-restore-readiness.md'));
  fails(tmp, 'MISSING_FILE');
});

test('missing Storage classification fails', () => {
  const tmp = copyFixture();
  const file = path.join(tmp, 'reports/supabase-production-sync/cutover-backup-preparation-result.json');
  const result = JSON.parse(fs.readFileSync(file, 'utf8'));
  delete result.storage_backup_status;
  fs.writeFileSync(file, JSON.stringify(result, null, 2));
  fails(tmp, 'BAD_STORAGE_STATUS');
});

test('valid pending preparation passes', () => {
  const tmp = copyFixture();
  const output = run(tmp);
  assert.match(output, /READY_FOR_MANUAL_PRODUCTION_BACKUP/);
});
