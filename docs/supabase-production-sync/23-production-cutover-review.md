# Production Cutover Review

## Objective
Prepare a reviewed manual cutover package without authorizing execution.

## Package State
`READY_FOR_PRODUCTION_CUTOVER_AUTHORIZATION_REVIEW`; six executable review steps are ready.

## Baseline
Baseline remains reference-only and has no apply SQL.

## Workout Delivery
Converted from object-level reconciliation into `01-workout-delivery.sql`, excluding Student Identity, admin, financial and duplicated Phase 1 grants.

## Student Identity
Controlled SQL file with specific precheck, postcheck and recovery.

## Security
Controlled high-risk SQL file with policy/grant precheck and recovery by captured definitions.

## Required Fields
Controlled NOT NULL SQL with mandatory null-count stop condition.

## AOE
Grant revoke only; body unchanged.

## Group A
Metadata/grant hardening only; body unchanged.

## Prechecks
Step-specific read-only files are indexed by `production-cutover-prechecks.sql`.

## Apply SQL
Apply files are manual-first, not migrations, and not authorized for execution.

## Postchecks
Step-specific read-only files are indexed by `production-cutover-postchecks.sql`.

## Recovery
Recovery is manual and step-specific; destructive automatic rollback is not authorized.

## Smoke Tests
See `production-cutover-smoke-test-plan.md`.

## Execution Checklist
See `production-cutover-execution-checklist.md`.

## Traceability
See `production-cutover-source-traceability.json`.

## Stop Conditions
Stop on incompatible object, changed function body hash, missing signature, unexpected policy/grant, null required field, failed postcheck or failed smoke test.

## Authorization State
`PRODUCTION_EXECUTION_AUTHORIZED=NO`; `DB_PUSH_ALLOWED_NOW=NO`; `HISTORY_ALIGNMENT_ALLOWED_NOW=NO`.

## Next Step
`PRODUCTION_CUTOVER_AUTHORIZATION_REVIEW`.
