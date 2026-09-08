# Student-Level Workflow Actions

Cycle: COACH_WORKFLOW_AUTOMATION

Stage: 10.3 - Student-Level Workflow Actions

Status: IN_PROGRESS

## Objective

Improve per-student action support with explicit navigation, dismissible read-state if justified, and no automatic mutations.

## Action Inventory

| Action | Destination | Required context | Supported now | Secure | Mobile safe |
| --- | --- | --- | --- | --- | --- |
| `OPEN_WORKOUTS` | `/treinos?alunoId=<id>&returnTo=<alunos>` | `studentId` | Yes | Protected route/services/RLS | Yes |
| `OPEN_ACCESS` | `/alunos?alunoId=<id>&origem=coach-attention#student-access-panel` | `studentId` | Yes | Protected route/services/RLS | Yes |
| `OPEN_FINANCE` | `/financeiro?alunoId=<id>&returnTo=<alunos>` | `studentId` | Yes | Protected route/services/RLS | Yes |
| `OPEN_STUDENT` | `/alunos?alunoId=<id>&origem=coach-attention` | `studentId` | Yes | Protected route/services/RLS | Yes |

## Action Mapping

- `NO_ACTIVE_WORKOUT` -> primary `OPEN_WORKOUTS`, secondary `OPEN_STUDENT`.
- `STUDENT_ACCESS_ATTENTION` -> primary `OPEN_ACCESS`, secondary `OPEN_STUDENT`.
- `FINANCE_ATTENTION` -> primary `OPEN_FINANCE`, secondary `OPEN_STUDENT`.

`NO_ASSESSMENT`, `WORKOUT_REVIEW_DUE`, `RECENT_ABANDONED_SESSION`, `EXECUTION_INACTIVITY` and `RECENT_EXECUTION_ACTIVITY` are not promoted to new action items in 10.3.

## Primary And Secondary Strategy

The primary action is selected from the highest-priority grouped signal on the student queue item. One secondary action is allowed when it adds useful context without adding a fake resolution path.

The dashboard queue now renders the primary action plus a controlled secondary `Ver aluno` action when present.

## Navigation

Navigation uses React Router links. No imperative `window.location` is introduced.

The 10.3 deep-linking correction uses the existing `alunoId` contract for `/treinos` and `/financeiro`. `/alunos` now reads `alunoId` and opens the matching student detail when the id exists in the loaded professional-owned list.

## Read-State Decision

READ_STATE: NOT_IMPLEMENTED.

Read-state is not implemented because the surfaced signals are factual and remain true until the underlying student, workout, access or finance state changes. Hiding or acknowledging them without a strong occurrence model would create ambiguity.

## Persistence Decision

PERSISTENCE_DECISION: NO.

No persistence is required in 10.3 because actions are deterministic descriptors over calculated signals. There is no stable occurrence model for acknowledge/dismiss that would be safer than showing the factual item.

## Security

Frontend actions only navigate to protected professional routes. Services and RLS remain the authority for ownership. No owner id is passed by the queue, and student/anonymous surfaces remain unchanged.

## Finance Guard

NO FUNCTIONAL FINANCE CHANGE.

`FINANCE_ATTENTION` maps to navigation into the existing finance module only. No file under `src/features/financeiro/**` is changed.

## Mobile

The dashboard item keeps actions as touch-sized buttons. On mobile, the existing responsive rule stacks action links full width, avoiding horizontal button overflow.

## Accessibility

Actions are semantic links with explicit accessible names. Priority badges remain text based, and the context is understandable without relying only on icon or color.

## Supabase

SUPABASE CHANGE: NO.

No migration, workflow table, acknowledgement table, Edge Function, cron or DB push is required.

## QA

- `npm.cmd run qa:student-workflow-actions`
- `npm.cmd run qa:coach-attention-queue`
- `npm.cmd run qa:coach-workflow-automation-discovery`
- `npm.cmd run qa:coach-workflow-signals`
- `npm.cmd run test:alunos`
- `npm.cmd run lint`
- `npm.cmd run build`
- `git diff --check`

Authenticated visual QA remains conditional on the local authenticated runtime/CDP being available. No visual PASS should be claimed if that environment is unavailable.

Local authenticated runtime result: NOT_EXECUTED successfully. `qa:dashboard-authenticated` stopped on unsettled top-level await in the audit script and `qa:alunos-authenticated` returned `fetch failed`.

Known regression: `workoutLifecyclePresentation.test.js` still fails with the same preexisting action-list mismatch from main (`edit` is present in actual active actions).

## Out Of Scope

- auto resolve
- dismiss/read-state persistence
- workflow history
- cron
- Edge Function
- WhatsApp, SMS, email or push notification
- task engine
- bulk action
- AI or generative recommendation
- automatic workout, student, access or finance mutation
