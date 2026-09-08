# Coach Attention Queue Closeout

Cycle: COACH_WORKFLOW_AUTOMATION

Stage: 10.2 - Coach Attention Queue

Status: COMPLETE

Decision: COMPLETE

## Objective

Surface calculated coach workflow signals as a compact professional attention queue without automatic action.

## Functional PR

- PR: #81
- URL: https://github.com/leandrosouza2204-a11y/Aruka/pull/81
- Functional commit: `2ef75425cae9c426e98e6659b8cf8ec49c2e1ac7`
- Merge commit: `84c6b6d203ffc400a591e5cc7211e8cc17e06fb2`

## Signals Used

- `NO_ACTIVE_WORKOUT`
- `STUDENT_ACCESS_ATTENTION`
- `FINANCE_ATTENTION`

Signals were grouped by student with stable `signals[].code` identities.

## Signals Excluded

- `RECENT_ABANDONED_SESSION`
- `EXECUTION_INACTIVITY`
- `RECENT_EXECUTION_ACTIVITY`
- `WORKOUT_REVIEW_DUE`
- `NO_ASSESSMENT`

Execution-history signals were excluded from the dashboard queue because dashboard does not load per-student execution history. No broad stalled-student rule was invented.

## Queue Contract

Each item contains `id`, `studentId`, `studentName`, `priority`, `title`, `description`, `actionLabel`, `actionTarget`, `signals` and `occurredAt`.

## Grouping

QUEUE_GROUPING_STRATEGY: GROUP_BY_STUDENT.

## Priority Model

- `ACTION_REQUIRED`
- `REVIEW`
- `FOLLOW_UP`

Ordering: priority, relevant timestamp descending when available, student name and student id.

## Surface

Primary surface: dashboard.

Secondary surface: `/alunos` remains the detail/context surface.

## Actions

- `NO_ACTIVE_WORKOUT` -> `/treinos?aluno=<id>&origem=coach-attention`
- `STUDENT_ACCESS_ATTENTION` -> `/alunos?aluno=<id>&origem=coach-attention`
- `FINANCE_ATTENTION` -> `/financeiro?aluno=<id>&origem=coach-attention`

All actions are navigation-only.

## Mobile And Accessibility

The queue uses stacked mobile items, full-width mobile CTA, labelled section, accessible loading status, alert role for errors, text priority badges and keyboard-native links.

## Supabase

SUPABASE CHANGE: NO.

No migration, RPC, DB push, Edge Function or cron was required.

## Finance

NO FUNCTIONAL FINANCE CHANGE.

The queue consumes existing `FINANCE_ATTENTION` from the billing attention summary and does not alter finance rules or payment state.

## QA

- `npm.cmd run qa:coach-attention-queue`: PASS.
- `npm.cmd run qa:coach-workflow-signals`: PASS.
- `npm.cmd run test:alunos`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.
- `git diff --check`: PASS.
- PR #81 validation: PASS.
- PR #81 Vercel: PASS.
- Post-merge `npm.cmd run qa:coach-attention-queue`: PASS.
- Post-merge `npm.cmd run test:alunos`: PASS.
- Post-merge `npm.cmd run lint`: PASS.
- Post-merge `npm.cmd run build`: PASS.

## Runtime Limitations

Authenticated visual QA was not executed successfully in the local environment. `qa:dashboard-authenticated` stopped on unsettled top-level await in the audit script and `qa:alunos-authenticated` returned `fetch failed`.

`qa:product-roadmap-v4-cycle-07` passed its static/unit portion and was blocked in runtime by unavailable CDP at `127.0.0.1:9222`.

`workoutLifecyclePresentation.test.js` remains a known preexisting failure from main, with the active action list including `edit`.

## Guardrails

- `supabase/**`: unchanged.
- `src/features/financeiro/**`: unchanged.
- `.github/**`: unchanged.
- `package-lock.json`: unchanged.
- Workflow state persistence: none.
- Auto-action: none.
- Cron: none.
- Edge Function: none.
- External notifications: none.

## Next Stage

- ID: 10.3.
- Title: Student-Level Workflow Actions.
- Status: READY_FOR_START.
- Objective: Improve per-student action support with explicit navigation, dismissible read-state if justified, and no automatic mutations.
- Recommended branch: `feat/product-roadmap-v4-student-workflow-actions`.
