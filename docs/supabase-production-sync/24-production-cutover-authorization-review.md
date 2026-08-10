# Production Cutover Authorization Review

## Technical Readiness

Decision: `READY_FOR_SUPERVISED_PRODUCTION_CUTOVER`.

The cutover package is technically ready for user authorization review. This does not authorize production execution.

## Operational Readiness

Operational package state: `READY_WITH_BACKUP_PENDING`.

The only mandatory unresolved operational prerequisite is a verified production backup immediately before cutover.

## Backup Requirement

`CUTOVER_BACKUP_REQUIRED=YES`

`CUTOVER_BACKUP_VERIFIED=NO`

Future execution must record:

- backup_method:
- backup_timestamp:
- backup_reference:
- backup_verified_by:
- restore_method_reviewed:

## Execution Method

`EXECUTION_METHOD=MANUAL_SUPERVISED_SQL_EDITOR`

`DB_PUSH_ALLOWED_NOW=NO`

## Maintenance Window

`MAINTENANCE_WINDOW_REQUIRED=YES`

Estimate: `30-60 min`

Reason: structural Workout Delivery changes, index creation, constraint replacement, NOT NULL enforcement and high-risk security policy/grant replacement should be run step by step with review gates.

## Step Risks

- 01 Workout Delivery: `MEDIUM`
- 02 Student Identity: `MEDIUM`
- 03 Security: `HIGH`
- 04 Required Fields: `MEDIUM`
- 05 AOE Security: `LOW`
- 06 Group A: `LOW`

## Go/No-Go

GO only when backup is verified, the correct project is confirmed, the step precheck output is expected, the apply file is reviewed and no blocker is present.

NO_GO on missing backup, wrong project, incompatible object, null required field, changed function hash, unexpected policy/grant, failed smoke test or stale evidence.

STOP_AND_INVESTIGATE on any ambiguous precheck, postcheck failure or smoke failure.

## Production Authorization Status

`PRODUCTION_EXECUTION_AUTHORIZED=NO`

The next action is `USER_CUTOVER_AUTHORIZATION_AND_BACKUP_PREPARATION`.

## Backup Preparation Reference

The manual backup preparation procedure is documented in `docs/supabase-production-sync/25-cutover-backup-preparation.md`.
