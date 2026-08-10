import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));

const files = [
  'docs/supabase-production-sync/25-cutover-backup-preparation.md',
  'reports/supabase-production-sync/cutover-backup-critical-data-inventory.json',
  'reports/supabase-production-sync/cutover-backup-critical-data-inventory.md',
  'reports/supabase-production-sync/cutover-backup-checklist.md',
  'reports/supabase-production-sync/cutover-backup-evidence-template.json',
  'reports/supabase-production-sync/cutover-backup-evidence-template.md',
  'reports/supabase-production-sync/cutover-restore-readiness.md',
  'reports/supabase-production-sync/cutover-backup-preparation-result.json',
  'reports/supabase-production-sync/cutover-backup-preparation-summary.md',
];

const fullRefs = ['vrizeuhuhvtvbrmtvdik', 'xrmqdkpxnfvusmenadnf'];
const secretPattern = /postgres:\/\/|postgresql:\/\/|password\s*[:=]|PGPASSWORD|service_role\s+key|anon\s+key\s+completa|JWT|access\s+token|refresh\s+token|eyJ[A-Za-z0-9_-]+\./i;
const backupFilePattern = /\.(dump|backup|bak|sql\.gz|tar|zip)$/i;

function fail(message) {
  throw new Error(message);
}

function assertExists(file) {
  if (!fs.existsSync(path.join(root, file))) fail(`MISSING_FILE:${file}`);
}

function validateText(file, text) {
  for (const ref of fullRefs) {
    if (text.includes(ref)) fail(`FULL_PROJECT_REF_EXPOSED:${file}`);
  }
  if (secretPattern.test(text)) fail(`SECRET_PATTERN:${file}`);
}

for (const file of files) {
  assertExists(file);
  validateText(file, read(file));
}

const result = json('reports/supabase-production-sync/cutover-backup-preparation-result.json');
const verificationEvidencePath = 'reports/supabase-production-sync/cutover-backup-verification-evidence.json';
const verificationEvidenceExists = fs.existsSync(path.join(root, verificationEvidencePath));
if (result.decision !== 'READY_FOR_MANUAL_PRODUCTION_BACKUP') fail('BAD_DECISION');
if (result.production_project?.name !== 'aruka') fail('BAD_PROJECT_NAME');
if (result.production_project?.project_ref_masked !== 'vriz...vdik') fail('BAD_MASKED_REF');
if (result.backup_required !== true) fail('BACKUP_NOT_REQUIRED');
if (result.backup_verified !== false) fail('BACKUP_VERIFIED_SHOULD_BE_FALSE');
if (result.restore_method_reviewed !== false) fail('RESTORE_REVIEWED_SHOULD_BE_FALSE');
if (result.production_execution_authorized !== false) fail('PRODUCTION_AUTHORIZED_SHOULD_BE_FALSE');
if (result.cutover_allowed !== false) fail('CUTOVER_ALLOWED_SHOULD_BE_FALSE');
if (result.backup_method_status !== 'USER_CONFIRMATION_REQUIRED') fail('BAD_METHOD_STATUS');
if (result.storage_backup_status !== 'USER_CONFIRMATION_REQUIRED') fail('BAD_STORAGE_STATUS');

const evidence = json('reports/supabase-production-sync/cutover-backup-evidence-template.json');
if (evidence.backup?.status !== 'PENDING_MANUAL_BACKUP') fail('BAD_EVIDENCE_STATUS');
if (evidence.backup?.method !== null) fail('FICTIONAL_BACKUP_METHOD');
if (evidence.backup?.reference_masked !== null) fail('FICTIONAL_BACKUP_REFERENCE');
if (evidence.backup?.retention_confirmed !== false) fail('RETENTION_SHOULD_BE_FALSE');
if (evidence.restore?.method_reviewed !== false) fail('EVIDENCE_RESTORE_REVIEWED_SHOULD_BE_FALSE');
if (evidence.authorization?.production_execution_authorized !== false) fail('EVIDENCE_PRODUCTION_AUTHORIZED');
if (evidence.authorization?.cutover_allowed !== false) fail('EVIDENCE_CUTOVER_ALLOWED');
if (evidence.storage?.status !== 'PENDING_REVIEW') fail('MISSING_STORAGE_CLASSIFICATION');

const manifest = json('reports/supabase-production-sync/production-cutover-sql/manifest.json');
if (manifest.backup_required !== true) fail('MANIFEST_BACKUP_NOT_REQUIRED');
if (manifest.backup_verified !== false && !(verificationEvidenceExists && manifest.backup_verified === true)) fail('MANIFEST_BACKUP_VERIFIED');
if (manifest.restore_method_reviewed !== false && !(verificationEvidenceExists && manifest.restore_method_reviewed === true)) fail('MANIFEST_RESTORE_REVIEWED');
if (manifest.cutover_allowed !== false) fail('MANIFEST_CUTOVER_ALLOWED');
if (manifest.production_execution_authorized !== false) fail('MANIFEST_PRODUCTION_AUTHORIZED');
if (manifest.db_push_allowed !== false) fail('MANIFEST_DB_PUSH_ALLOWED');
if (manifest.history_alignment_allowed_now !== false) fail('MANIFEST_HISTORY_ALIGNMENT_ALLOWED');

const checklist = read('reports/supabase-production-sync/cutover-backup-checklist.md');
if (!checklist.includes('[ ] Storage avaliado separadamente') && !checklist.includes('[x] Storage avaliado separadamente')) fail('CHECKLIST_STORAGE_MISSING');
if (!checklist.includes('[ ] nenhum cutover iniciado')) fail('CHECKLIST_CUTOVER_GUARD_MISSING');
if (!verificationEvidenceExists && /\[x\]/i.test(checklist)) fail('CHECKLIST_HAS_MARKED_ITEMS');

const restore = read('reports/supabase-production-sync/cutover-restore-readiness.md');
if (!restore.includes('RESTORE_METHOD_REVIEWED=NO')) fail('RESTORE_STATUS_MISSING');
if (!restore.includes('FULL_RESTORE_LAST_RESORT')) fail('RECOVERY_CLASSIFICATION_MISSING');

function scanBackupFiles(dir) {
  const ignoredDirs = new Set([
    '.git',
    'node_modules',
    'dist',
    'dist-ssr',
    'tmp-responsive-screenshots',
    '.local-backups',
    '_checkpoints',
  ]);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(root, full).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name) || rel === 'reports/supabase-production-sync/private-backups') continue;
      scanBackupFiles(full);
      continue;
    }
    if (entry.isFile() && backupFilePattern.test(entry.name)) fail(`BACKUP_FILE_IN_WORKTREE:${rel}`);
  }
}

scanBackupFiles(root);

console.log(JSON.stringify({
  decision: result.decision,
  backup_verified: result.backup_verified ? 'YES' : 'NO',
  restore_method_reviewed: result.restore_method_reviewed ? 'YES' : 'NO',
  cutover_allowed: result.cutover_allowed ? 'YES' : 'NO',
  next_action: result.next_action,
}, null, 2));
