# Production Reconciliation Plan

Production was not accessed.

Before production migration, run a supervised read-only reconciliation query that reports:

- `EXACT`
- `DERIVED_HIGH_CONFIDENCE`
- `DERIVED_LOW_CONFIDENCE`
- `UNKNOWN`

Review samples in each class before authorizing production mutation.

Expected follow-up:

1. Review local migration and QA evidence.
2. Authorize production read-only reconciliation.
3. Review reconciliation counts and outliers.
4. Authorize supervised production migration.
5. Verify `consultoria_inicio`, active ledger rows, renewal RPC, and cross-screen consistency.
