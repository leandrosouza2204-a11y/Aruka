# Discovery Closeout

Cycle: COACH_WORKFLOW_AUTOMATION

Title: Coach Workflow Automation

Stage: 10.1 - Discovery and Signal Contract

Status: COMPLETE

Decision: COMPLETE

## Objective

Canonize the initial operational signal contract for coach workflow automation using signals already supported by the product, without introducing premature external automation or infrastructure.

## Functional PR

- PR: #79
- URL: https://github.com/leandrosouza2204-a11y/Aruka/pull/79
- Commit: `6fbdf29df1125c5996b9a30c4434fada515df5d9`
- Merge commit: `60bf9fc161ff4fbfc5e77567cd64a5caea7eb487`

## Signals Found

- `NO_ACTIVE_WORKOUT`
- `STUDENT_ACCESS_ATTENTION`
- `RECENT_ABANDONED_SESSION`
- `EXECUTION_INACTIVITY`
- `RECENT_EXECUTION_ACTIVITY`
- `FINANCE_ATTENTION`
- `WORKOUT_REVIEW_DUE`
- `NO_ASSESSMENT`

## Signals Rejected

- `ADHERENCE_PERCENTAGE`
- `BROAD_LAST_ACTIVITY_STALLED_STUDENT`
- `ASSESSMENT_OVERDUE_WITHOUT_CADENCE`
- `AUTOMATIC_FOLLOW_UP_SEND`
- `AUTOMATIC_WORKOUT_OR_FINANCE_MUTATION`

## Capabilities

Stalled-student capability: PARTIAL.

The only reliable current proxy is factual execution inactivity from loaded execution history. The product does not yet have a reliable broad `last_activity_at` across login, viewing, workout start, payment or assessment activity.

Pending-action capability: PARTIAL.

Supported pending actions are active student without active workout, student access attention, recent abandoned session, execution inactivity and billing attention from the existing finance helper. Workout review due remains a candidate for the next queue contract.

## Data Gaps

- No reliable cross-product `last_activity_at`.
- No persisted dismiss, resolve or read state.
- No schedule/adherence denominator.
- No assessment cadence contract.

## Security Model

Coach workflow signals are professional-only. They must remain behind protected professional routes, existing ownership-filtered services and RLS. Student and anonymous surfaces remain unchanged.

## Data Decision

10.1 decision: CALCULATED_ONLY.

Persisted state is deferred until a later stage needs dismiss/resolve history, manual priority or audit.

## Infrastructure

- Cron required: NO.
- Edge Function required: NO.
- External notification required: NO.
- Supabase change: NO.
- Production action required: NO.

## QA

- `npm.cmd run qa:coach-workflow-automation-discovery`: PASS.
- JSON validation: PASS.
- `git diff --check`: PASS.
- PR #79 validation: PASS.
- PR #79 Vercel: PASS.
- Post-merge `npm.cmd run lint`: PASS.
- Post-merge `npm.cmd run build`: PASS.

## Next Stage

- ID: 10.2.
- Title: Coach Attention Queue.
- Status: READY_FOR_START.
- Objective: Surface calculated coach workflow signals as a compact professional attention queue without automatic action.
- Dependencies: 10.1 Discovery and Signal Contract; existing Cycle 07 coach workflow signals; protected professional routes and ownership-filtered services/RLS.
- Acceptance criteria: queue uses calculated signals only, stays professional-only, does not mutate workouts/students/finance automatically, and keeps Supabase/infrastructure changes out unless explicitly justified.
- Recommended branch: `feat/product-roadmap-v4-coach-attention-queue`.
