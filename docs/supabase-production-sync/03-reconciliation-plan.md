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

## Function/RPC Phase 3.2 Update

- Decision: `READY_FOR_PHASE32_SECURITY_MIGRATION`.
- Supabase change: `YES`.
- Production action required: `PENDING_RECONCILIATION_COMPLETION`.
- Migration: `supabase/migrations/20260801173000_revoke_aoe_idempotency_anon_execute.sql`.
- Group E: ready as isolated AOE EXECUTE grant hardening; function body is intentionally unchanged.
- Group A: not included because the Phase 3.2 remote CSV did not include `set_workout_templates_updated_at()`.
- Admin overloads: `EXTERNAL_CONSUMER_REVIEW_REQUIRED`.
- Admin body diffs: `MANUAL_PRODUCT_DECISION_REQUIRED`.
- Financial functions: `FINANCIAL_OWNER_REVIEW_REQUIRED`.
- Student identity: still deferred.

## Function/RPC Phase 3.3 Group A Update

- Decision: `READY_FOR_PHASE33_EVIDENCE_COLLECTION`.
- Supabase change: `NO`.
- Production action required: `READONLY_EVIDENCE_COLLECTION_REQUIRED`.
- Migration created: `NO`.
- Group A: `EVIDENCE_REQUIRED` for `public.set_workout_templates_updated_at()`.
- Read-only SQL: `reports/supabase-production-sync/phase33-group-a-readonly-inspection.sql`.
- Expected ignored CSV directory: `reports/supabase-production-sync/remote-phase33-input/`.

## Function/RPC Phase 3.4 Group A Update

- Decision: `READY_FOR_PHASE34_GROUP_A_COMMIT`.
- Supabase change: `YES`.
- Production action required: `PENDING_RECONCILIATION_COMPLETION`.
- Migration: `supabase/migrations/20260801180000_harden_workout_templates_updated_at.sql`.
- Group A: `SECURITY_HARDENING_CONFIRMED`.
- Body replacement required: `NO`.
- Trigger change required: `NO`.
- Changes: set `search_path = public`; revoke direct EXECUTE from `PUBLIC`, `anon`, and `authenticated`.

## Post-Phase 3.4 Global Audit

- Decision: `READY_FOR_POST_PHASE34_GLOBAL_AUDIT_COMMIT`.
- Supabase change: `NO`.
- Production action required: `NO`.
- Migration repair allowed: `NO`.
- Local reconciliation state: `PARTIALLY_RECONCILED`.
- Remote reconciliation state: `NOT_APPLIED`.
- History alignment state: `PENDING`.
- Phase 1: `LOCAL_RECONCILIATION_IMPLEMENTED`, remote application pending.
- Phase 2: `LOCAL_RECONCILIATION_IMPLEMENTED`, remote application pending.
- Phase 3 Group E: `LOCAL_RECONCILIATION_IMPLEMENTED`, remote application pending.
- Phase 3 Group A: `LOCAL_RECONCILIATION_IMPLEMENTED`, remote application pending.
- Next safe group: `STUDENT_IDENTITY_DEPLOYMENT_DESIGN`.

## Final Active Security Drift Reconciliation

- Decision: `READY_FOR_FINAL_SECURITY_RECLASSIFICATION_COMMIT`.
- Supabase change: `NO`.
- Production action required: `NO`.
- Migration repair allowed: `NO`.
- Initial security drift count: `1`.
- Final local security drift count: `0`.
- Remote pending security count: `1`.
- Existing migration reused: `supabase/migrations/20260731190000_reconcile_security_policies_and_grants.sql`.
- Migration created: `NO`.
- Next safe group: `STUDENT_IDENTITY_DEPLOYMENT_DESIGN`.

## Workout Delivery Final Reconciliation

- Decision: `READY_FOR_WORKOUT_DELIVERY_RECLASSIFICATION_COMMIT`.
- WORKOUT_DELIVERY_LOCAL_STATE: `LOCAL_COMPLETE_BY_EXISTING_MIGRATION`.
- ACTIVE_LOCAL_WORKOUT_DELIVERY_DRIFT: `0`.
- REMOTE_WORKOUT_DELIVERY_PENDING: `50`.
- Existing migration coverage: `supabase/migrations/20260728030000_workout_delivery_integration_v1.sql`.
- Migration created: `NO`.
- Next safe group: `STUDENT_IDENTITY_DEPLOYMENT_DESIGN`.

## Evidence Review Update

- Decision: `READY_FOR_RECONCILIATION_DESIGN`.
- Strategy: `INCREMENTAL_RECONCILIATION_THEN_NEW_BASELINE`.
- Nullability completeness: `REMOTE_NULLABILITY_PROFILE_COMPLETE`.
- Production action: `RECONCILIATION_DESIGN_REQUIRED`.
- Next step: review the non-executable reconciliation design before any future migration is authored.
