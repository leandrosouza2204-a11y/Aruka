# Cutover Restore Readiness

`RESTORE_METHOD_REVIEWED=NO`

No restore is executed or authorized in this round.

## Complete Restore

Full restore is necessary when the cutover causes broad corruption, inconsistent state across multiple domains, or a failure that cannot be safely isolated to specific objects. Full restore can lose production changes made after the backup recovery point and must be treated as a last resort.

## Object-Level Rollback

Object-level rollback is preferred when the failing step can be isolated to policies, grants, functions, constraints, indexes or metadata captured by step-specific recovery notes.

## Logical Rollback vs Restore

Logical rollback changes selected objects or data with supervised SQL. Restore returns the database or recovery target to a backup state. A restore may affect unrelated writes after the backup and requires explicit approval.

## Step Recovery Classification

| Step | Domain | Classification |
| --- | --- | --- |
| 01 | Workout Delivery | `OBJECT_LEVEL_ROLLBACK_PREFERRED`; `FULL_RESTORE_LAST_RESORT` |
| 02 | Student Identity | `OBJECT_LEVEL_ROLLBACK` only before real use; after use, `FULL_RESTORE_OR_DATA_AWARE_PLAN` |
| 03 | Security | `OBJECT_LEVEL_ROLLBACK_PREFERRED` |
| 04 | Required Fields | `ROLLBACK_REQUIRES_APPROVAL` |
| 05 | AOE | `OBJECT_LEVEL_ROLLBACK_PREFERRED` |
| 06 | Group A | `OBJECT_LEVEL_ROLLBACK_PREFERRED` |

## Domain Notes

- Student Identity links must preserve consistency between `public` data and `auth.users`.
- Policies and grants may block users immediately if restored incorrectly.
- Function restoration must confirm signatures and body hashes.
- NOT NULL restoration can fail or lose semantics if rows changed after backup.
- AOE grants and Group A metadata are low risk but still require postcheck review.

## Stop Requirement

Stop the cutover before restore or rollback when any postcheck, smoke test, backup evidence, restore target, function hash, policy/grant state or project identity is ambiguous.
