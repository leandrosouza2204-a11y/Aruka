# Student Tenure Production Deployment Runbook

Do not execute this runbook without explicit human authorization.

1. Confirm backup/snapshot availability.
2. Run `04-production-readonly-audit.sql` with read-only credentials.
3. Review aggregate inventory and the student classification matrix.
4. Decide whether `DERIVED_LOW_CONFIDENCE` rows may be temporarily backfilled with visible uncertainty.
5. Apply the migration only through the approved production change process.
6. Run smoke checks for login, students, finance, renewal, and dashboard.
7. Reconcile ambiguous rows using only verified evidence.
8. Deploy frontend compatible with the new schema.
9. Monitor renewal RPC errors, ledger uniqueness violations, and support reports.

Deployment compatibility: `DATABASE_FIRST` is safest. New frontend expects `consultoria_inicio` and `aluno_contratos`; old frontend can still read/write core student data but will not maintain the canonical ledger for renewals.

Rollback strategy: code rollback is straightforward. Database rollback is not automatic after real renewals are written to the ledger; use snapshot restore only under incident command, otherwise prefer forward correction.
