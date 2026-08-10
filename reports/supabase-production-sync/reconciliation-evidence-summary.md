# Reconciliation Evidence Summary

Decision: `READY_FOR_RECONCILIATION_DESIGN`.

Global decision: `BLOCKED_REMOTE_SCHEMA_DRIFT`.

Recommended strategy: `INCREMENTAL_RECONCILIATION_THEN_NEW_BASELINE`.

## Evidence Completeness

- Overall: RECONCILIATION_EVIDENCE_COMPLETE
- Function grants: COMPLETE_BY_SIGNATURE_FOR_RECEIVED_GRID
- Function configuration: RECONCILIATION_INSPECTION_PARTIAL
- Reconciliation CSV: RECONCILIATION_INSPECTION_PARTIAL
- Nullability: REMOTE_NULLABILITY_PROFILE_COMPLETE

## Function Grants

- Received rows: 89
- Unique canonical grants: 69
- PUBLIC grants: 1
- anon grants: 6
- authenticated grants: 18
- service_role grants: 22
- SECURITY DEFINER grants: 64

## Nullability

- Expected columns: 10
- Received rows: 10
- Missing columns: 0

## Policies

- REMOTE_MORE_PERMISSIVE confirmed: 48

## Student Identity

- STUDENT_IDENTITY_ABSENT_REMOTE_CONFIRMED
