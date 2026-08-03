# Cutover Backup Preparation

## 1. Objective

Prepare the backup and restore readiness procedure for the supervised Supabase production cutover. This round does not execute backup, restore, SQL, cutover, `db push`, `db pull`, `supabase link`, history alignment, CI/CD, commit, push or PR.

Decision: `READY_FOR_MANUAL_PRODUCTION_BACKUP`

## 2. Production Project

- `PRODUCTION_PROJECT_NAME=aruka`
- `PRODUCTION_PROJECT_REF_MASKED=vriz...vdik`
- `REMOTE_LINK_STATE=UNLINKED_FOR_SAFETY`

The HML project is `Aruka_HML` with masked ref `xrmq...adnf`. The repository must remain unlinked before manual backup verification.

## 3. Backup Scope

The backup must protect at minimum:

- `DATABASE_BACKUP`: schema `public`, public table data, functions, constraints, indexes, triggers, policies, grants, sequences and structure required for restore.
- `AUTH_DATA_CONSIDERATION`: auth-related consistency with `auth.users` must be reviewed. No auth user export is performed in this round.
- `STORAGE_METADATA_CONSIDERATION`: Storage metadata may live in database-managed schemas and requires user confirmation.
- `STORAGE_OBJECT_FILES_CONSIDERATION`: physical Storage files are not assumed to be covered by a database backup.

## 4. Critical Data

Critical conceptual domains are inventoried in `reports/supabase-production-sync/cutover-backup-critical-data-inventory.md` and `.json`. No remote personal data was queried.

## 5. Possible Methods

- Managed platform backup: `AVAILABLE_REQUIRES_USER_CONFIRMATION`
- Snapshot/PITR: `AVAILABLE_REQUIRES_USER_CONFIRMATION`
- Supervised logical database dump: `AVAILABLE_REQUIRES_USER_CONFIRMATION`
- Dashboard/platform database backup export: `AVAILABLE_REQUIRES_USER_CONFIRMATION`
- Separate Storage object backup: `AVAILABLE_REQUIRES_USER_CONFIRMATION`

Availability must be confirmed manually in the Supabase Dashboard for project `aruka`.

## 6. Recommended Method

`BACKUP_METHOD_STATUS=USER_CONFIRMATION_REQUIRED`

Recommended layered approach:

1. Confirm a recent managed backup, snapshot, PITR or restore point in the Dashboard.
2. Consider an additional supervised logical database dump immediately before cutover when operationally available.
3. Preserve definitions through the already prepared prechecks, postchecks and source traceability.
4. Record masked evidence, timestamp, retention and verifier.

## 7. Dashboard Verification

1. Open the Supabase Dashboard.
2. Select project `aruka`.
3. Visually confirm masked project ref `vriz...vdik`.
4. Open the project's backup area.
5. Verify available backup mechanisms.
6. Identify the most recent usable recovery point.
7. Verify timestamp and retention.
8. Verify restore or PITR availability.
9. Do not start restore.
10. Do not alter settings.
11. Record only masked evidence.

## 8. Optional Logical Backup

If chosen later, obtain temporary credentials securely, generate a logical dump outside the repository, validate exit code, validate file readability, record size and storage location class, and do not version the dump or credentials. Do not place dumps in `docs/`, `reports/`, Git, public CI artifacts or this conversation.

`BACKUP_STORAGE_LOCATION=EXTERNAL_SECURE_LOCATION_REQUIRED`

## 9. Storage

`STORAGE_CUTOVER_CHANGE=NO`

`STORAGE_BACKUP_COVERAGE=USER_CONFIRMATION_REQUIRED`

The planned cutover does not directly change Storage files, but Storage metadata and physical object coverage must be reviewed separately.

## 10. Evidence Required

Use `reports/supabase-production-sync/cutover-backup-evidence-template.json` or `.md` after the user verifies the real backup. Do not fill fictional values.

## 11. Restore Readiness

Restore options are documented in `reports/supabase-production-sync/cutover-restore-readiness.md`.

`RESTORE_METHOD_REVIEWED=NO`

This remains false until the user confirms how restore would be started for the correct production project.

## 12. Stop Conditions

NO_GO if project is incorrect, backup is missing, timestamp is unknown, reference is missing, retention is insufficient, restore is not understood, backup access is missing, backup is not verifiable, required Storage coverage is missing, project name/ref diverge, evidence is fictional, or backup is stored insecurely.

## 13. Authorization

`PRODUCTION_EXECUTION_AUTHORIZED=NO`

`CUTOVER_ALLOWED=NO`

Future authorization depends on verified backup evidence, restore method review, maintenance window confirmation and explicit user authorization.

## 14. Next Steps

Next action: `MANUAL_BACKUP_EXECUTION_AND_EVIDENCE`

After manual evidence is returned, run `CUTOVER_BACKUP_VERIFICATION`.
