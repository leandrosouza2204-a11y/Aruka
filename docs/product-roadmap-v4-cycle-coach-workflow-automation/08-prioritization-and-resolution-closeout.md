# Prioritization and Resolution Closeout

Cycle: COACH_WORKFLOW_AUTOMATION

Stage: 10.4 - Prioritization and Resolution

Status: COMPLETE

## Decision

COMPLETE.

The Coach Attention Queue retains calculated factual priority and adds a reversible local-session acknowledgement. It does not persist, dismiss, resolve, manually reprioritize, or mutate operational data.

## Semantic Decisions

- Calculated priority: authoritative. `ACTION_REQUIRED`, `REVIEW`, and reserved `FOLLOW_UP` stay derived from signals.
- Acknowledge: implemented as local React session state. `Marcar como visto` means the coach saw the current grouped signal item; it neither hides nor resolves the fact.
- Dismiss: NOT_IMPLEMENTED because no reliable persisted occurrence key exists.
- Manual resolve: NOT_IMPLEMENTED. Resolution remains auto-derived when source facts change.
- Manual priority: NOT_IMPLEMENTED because no expiration, precedence, or audit policy exists.
- Occurrence model: deterministic current queue item identity only, not a persistent factual occurrence.
- Reappearance: acknowledgement resets on refresh and when the grouped signal identity changes.

## Queue And UX

Unacknowledged items sort before acknowledged items, then retain the calculated priority, timestamp, name, and id ordering. That sorting happens before the five-item queue limit. Primary operational navigation remains dominant; acknowledgement is a secondary semantic button with `aria-pressed` and a visible `Visto` state.

The existing narrow layout stacks all queue controls below 768px. No new filter or count was introduced because acknowledgement is not resolution.

## Security And Architecture

- Professional-only dashboard data and existing ownership boundaries are unchanged.
- Supabase change: NO.
- Migration, RLS runtime, local reset, drift, migration list, dry-run, and DB push: NOT_APPLICABLE.
- Backend state, cron, Edge Function, external notifications, and auto-action: NO.
- Finance impact: NO FUNCTIONAL CHANGE.
- PWA: acknowledgement is intentionally not synchronized or persisted; it resets with the session.

## Delivery

- Functional branch: `feat/product-roadmap-v4-prioritization-resolution`.
- Functional commit: `213f53a61c49b38491f2a834bf791780de389be4`.
- Functional PR: #85.
- Functional merge commit: `3c6065a601db0f9a5d6188064a4f56164aa37892`.

## QA

- `qa:coach-workflow-prioritization-resolution`: PASS.
- `qa:student-workflow-actions`: PASS.
- `qa:coach-attention-queue`: PASS.
- `qa:coach-workflow-automation-discovery`: PASS.
- `qa:coach-workflow-signals`: PASS.
- `test:alunos`: PASS.
- `lint`: PASS.
- `build`: PASS.
- Functional PR validation and Vercel: PASS.

Authenticated visual QA was not executed because the local authenticated runtime is unavailable. The unrelated known workout lifecycle expectation still fails because actual active actions include `edit`; it was unchanged by this stage.

## Next

10.5 - Mobile/PWA Stabilization.

Objective: validate mobile, PWA, accessibility, loading, empty, error and retry behavior for the coach workflow surfaces.

Recommended branch: `NOT_DEFINED_IN_CANONICAL_SOURCE`.
