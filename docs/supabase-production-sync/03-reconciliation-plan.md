# Supabase Production Reconciliation Plan

Status: draft for manual review only.

No corrective SQL, db push, db pull, migration repair, remote SQL, commit, push, or PR was executed in this round.

## Baseline/history

- Baseline assessment: `divergent`.
- Material differences remain in the matrix and must be reviewed before any history alignment.
- Remote-only grants and objects must be classified before considering migration history repair.

## Workout delivery

- Assessment: `divergent`.
- Review objects sourced from `20260728030000_workout_delivery_integration_v1.sql` in `schema-equivalence-matrix.csv`.
- Do not apply incremental production changes until baseline/history drift is reconciled.

## Student identity

- Assessment: `absent`.
- The student identity migration remains staged locally and must not be repaired as applied remotely.
- Missing columns, indexes, RPCs, grants and role contract must be applied only after reconciliation approval.

## Evidence limitations

- Function grants are `PARTIALLY_VERIFIED` because the remote CSV contains `routine_name` but not function identity arguments or `specific_name`.
- Use signature-aware read-only evidence before final grant equivalence.

## Evidence Review Update

- Decision: `READY_FOR_RECONCILIATION_DESIGN`.
- Strategy: `INCREMENTAL_RECONCILIATION_THEN_NEW_BASELINE`.
- Nullability completeness: `REMOTE_NULLABILITY_PROFILE_COMPLETE`.
- Production action: `RECONCILIATION_DESIGN_REQUIRED`.
- Next step: review the non-executable reconciliation design before any future migration is authored.
