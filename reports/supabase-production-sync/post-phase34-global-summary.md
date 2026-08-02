# Post-Phase 3.4 Global Reconciliation Audit

Decision: `READY_FOR_POST_PHASE34_GLOBAL_AUDIT_COMMIT`.

Production action required: `NO`.

Migration repair allowed: `NO`.

Remote link state: `UNLINKED_FOR_SAFETY`.

## Context

This audit consolidates the local state after Phase 1, Phase 2, Phase 3.2 Group E and Phase 3.4 Group A. It does not create SQL, apply production changes, link Supabase, repair migration history, commit, push or open a PR.

## Phases Completed

- Phase 1: local security policies/grants reconciliation implemented.
- Phase 2: local required `alunos` nullability reconciliation implemented.
- Phase 3.2 Group E: local AOE anon EXECUTE revoke implemented.
- Phase 3.4 Group A: local utility function search_path and direct EXECUTE hardening implemented.

## Current Local State

Local schema state: `PARTIALLY_RECONCILED`.

Local migration count: `7`.

Local replay: `supabase db reset` passed and `supabase db diff --local --schema public` reported no schema changes.

## Current Remote Evidence State

Remote schema state: `NOT_APPLIED`.

The remote evidence still represents production before these local reconciliation migrations are applied. Therefore resolved local work can still appear as remote drift in raw equivalence output.

## Resolved Items

- Phase 1 resolved items: 1
- Phase 2 resolved items: 3
- Group E resolved items: 1
- Group A resolved items: 1

## Deferred Items

- AOE body: `DEFERRED_TO_AOE_BODY_RECONCILIATION`
- Student identity: `DEFERRED_TO_STUDENT_IDENTITY`
- Workout delivery: `DEFERRED_TO_WORKOUT_DELIVERY`
- Migration history: `HISTORY_ALIGNMENT_PENDING`

## Active Drift

Active technical security drift remains at the remote-state level because approved local security migrations have not been applied to production.

## Manual Decisions

Admin body diffs remain `MANUAL_ADMIN_DECISION_REQUIRED`. Financial/admin subscription behavior remains `MANUAL_FINANCIAL_DECISION_REQUIRED`.

## Student Identity

Student identity is local-only future deployment. It is not a generic blocker and must remain separated from production drift.

## Workout Delivery

Workout delivery backend drift remains deferred by object. It should be reconciled after remaining technical security hardening is closed or explicitly released.

## AOE

The anon EXECUTE grant is locally resolved by Group E. The AOE body divergence remains deferred.

## Admin

Legacy admin overloads are `REMOTE_ONLY_LEGACY` and require external consumer review before deprecation.

## Financial

Financial behavior changes require manual product/financial approval before any migration.

## History

Schema state and migration history are separate. History alignment remains pending; migration repair is not allowed.

## Next Safe Group

`NEXT_SAFE_GROUP=SECURITY_HARDENING`.

## Production Action

No production action is requested by this audit.

## Risks

The main residual risk is confusing local implemented reconciliation with production-applied reconciliation. Keep local, remote and history states separate until production application and history strategy are approved.
