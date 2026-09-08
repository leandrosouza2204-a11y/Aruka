# Prioritization and Resolution

Cycle: COACH_WORKFLOW_AUTOMATION

Stage: 10.4 - Prioritization and Resolution

Status: COMPLETE

## Objective

Add deterministic priority and operational handling semantics only for the signals proven useful in stages 10.2 and 10.3.

## Priority Model

Calculated priority remains the factual signal contract:

- `ACTION_REQUIRED`: active student without an active workout.
- `REVIEW`: student access or finance attention.
- `FOLLOW_UP`: reserved for a future calculated signal and not emitted here.

Priority is never manually overridden. `MANUAL_PRIORITY: NOT_IMPLEMENTED` because no duration, expiry, signal-change, or audit policy is defined.

## Acknowledge

`ACKNOWLEDGE: IMPLEMENTED_LOCAL_SESSION_ONLY`.

`Marcar como visto` means the coach saw the current displayed group of factual signals. It does not hide, dismiss, resolve, or mutate the student, workout, access, or finance data. The action is reversible with `Visto` and uses a semantic button with `aria-pressed`.

The acknowledgement is held only in React state for the current dashboard session. It is intentionally not stored in localStorage, sessionStorage, Supabase, or another backend. Refreshing the dashboard clears it.

## Occurrence And Reappearance

The local acknowledgement key is the deterministic queue item identity: `studentId:signalCode+signalCode`.

It is sufficient only for temporary display ordering. It is not a persistent factual occurrence key. When the grouped signal set changes, the key changes and the item reappears as requiring attention. A refresh also restores the calculated queue.

## Dismiss And Resolve

`DISMISS: NOT_IMPLEMENTED`. There is no reliable persisted occurrence model, so the product does not suppress factual signals.

`MANUAL_RESOLVE: NOT_IMPLEMENTED`. Resolution remains auto-derived from the underlying data: a new active workout removes `NO_ACTIVE_WORKOUT`; an access or billing state change removes its corresponding calculated signal. No button may claim to resolve a fact that remains true.

## Queue Composition And Ordering

The composer combines calculated signals with transient acknowledgement state. It does not let workflow state change factual priority.

Ordering is deterministic:

1. items requiring attention;
2. acknowledged items;
3. calculated priority;
4. relevant timestamp descending;
5. student name;
6. student id.

Ordering happens before the queue limit, so an acknowledged item yields its visible slot to an item still requiring attention. No new filters or counts were added because acknowledgement is not resolution.

## Security And Scope

The implementation stays within the protected dashboard and existing ownership-filtered data. There is no backend state, no RLS or grant change, no migration, no cron, no Edge Function, and no external notification.

`PERSISTENCE: NO`.

`SUPABASE CHANGE: NO`.

`NO FUNCTIONAL FINANCE CHANGE`: finance attention is still a read-only input with a navigation action.

## Mobile And Accessibility

The acknowledgement control follows the existing queue action layout and stacks with the other controls below 768px. Its pressed state is available to keyboard and assistive technology, and a visible `Visto` badge communicates the state without relying only on color.

## QA

- `npm.cmd run qa:coach-workflow-prioritization-resolution`
- Existing queue, workflow action, discovery, signal, alunos, lint, and build regressions.

## Out Of Scope

- persisted acknowledgement
- dismiss, snooze, or manual resolve
- manual priority
- workflow history or audit trail
- automatic mutation
- cron, Edge Function, notification, or finance workflow change

## Next Stage

10.5 - Mobile/PWA Stabilization.

Objective: validate mobile, PWA, accessibility, loading, empty, error and retry behavior for coach workflow surfaces.

Recommended branch: `NOT_DEFINED_IN_CANONICAL_SOURCE`.
