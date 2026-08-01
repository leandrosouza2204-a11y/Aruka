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

## Constraint and Nullability Phase 2 Update

- Decision: `READY_FOR_PHASE2_COMMIT`.
- Manual product decision: `APPROVED`.
- Supabase change: `YES`.
- Production action required: `NO`.
- Nullability profile: `COMPLETE`, 10/10 `public.alunos` columns, 26 remote rows, 0 nulls.
- Migration: `supabase/migrations/20260801143335_reconcile_alunos_required_fields.sql`.
- Included: `created_at`, `user_id` and `whatsapp` set `NOT NULL`.
- Preserved: `acompanhamento_motivo`, `observacoes`, `inicio`, `pagamento_recebido`, `plano`, `status` and `valor`.
- Constraint scope: no constraint included; student identity and workout delivery constraints remain deferred, and three CHECK differences are representation false positives.
