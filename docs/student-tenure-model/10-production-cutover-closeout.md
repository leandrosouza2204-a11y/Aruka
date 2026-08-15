# Student Tenure Production Cutover Closeout

## Current Decision

`BLOCKED_PHASE_1_REMOTE_READONLY_DRY_RUN_AWAITING_SUPERVISED_DATABASE_CREDENTIAL_INPUT`

The cutover did not mutate production. The next executable phase is the supervised production read-only dry-run.

## Completed Phases

Phase 0 repository/static preflight completed:

- branch: `fix/operational-billing-and-student-tenure`
- baseline commit: `e7f9497`
- current head: `e7f949702a114d075d4f759712e7d8a80928411a`
- migration hash: `b768dbb73b1e97e50a5c85cd6b124df4d8ca23c83ab0f7c1855707aa2def10f6`
- manifest hash: `aa958678d4c270f7e46c0b778d5513b21db363e5d410dc1c0078e7f5732de6ee`
- manifest validation: `PASS`
- protected code/schema diff: `ZERO`

Local QA and static checks completed:

- `qa:student-tenure-contract=PASS`
- `qa:billing-attention-runtime=PASS`
- `qa:authenticated-runtime=PASS`
- `lint=PASS`
- `build=PASS`

External runner checks completed:

- PowerShell parse: `PASS`
- reconciliation SQL validation: `PASS`
- local reconciliation dry-run: `PASS`
- secret scan for persisted credentials: `PASS`

## Pending Phase

Run:

`C:\Backups\Aruka\dry-run-production-student-tenure-plan.ps1`

This runner is production read-only. It must validate:

- target project;
- migration pending state;
- current schema state;
- the 7 manifest IDs;
- drift against `inicio` and `vencimento`;
- manifest temporal contract.

Expected successful result:

- `PRODUCTION_READONLY_DRY_RUN=PASS`
- `PRODUCTION_MUTATION_EXECUTED=NO`
- `DB_PUSH_EXECUTED=NO`
- `MIGRATION_EXECUTED=NO`
- `RECONCILIATION_EXECUTED=NO`

## Hard Stop

No production mutation is authorized by the current state.

The exact future authorization phrase is:

`APPLY_STUDENT_TENURE_PRODUCTION`

This phrase must be provided in a future turn after the read-only dry-run passes and backup/snapshot verification is confirmed.

## Residual Risk

The 20 demo/fake production records remain legacy/low-confidence candidates. This does not block the real-student cutover.

No fictional historical contracts should be created for any student.
