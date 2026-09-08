# Coach Attention Queue

Cycle: COACH_WORKFLOW_AUTOMATION

Stage: 10.2 - Coach Attention Queue

Status: COMPLETE

## Objective

Surface calculated coach workflow signals as a compact professional attention queue without automatic action.

## Existing Signals

Audited from the 10.1 contract:

- `NO_ACTIVE_WORKOUT`
- `STUDENT_ACCESS_ATTENTION`
- `RECENT_ABANDONED_SESSION`
- `EXECUTION_INACTIVITY`
- `RECENT_EXECUTION_ACTIVITY`
- `FINANCE_ATTENTION`
- `WORKOUT_REVIEW_DUE`
- `NO_ASSESSMENT`

## Signals Used

- `NO_ACTIVE_WORKOUT`
- `STUDENT_ACCESS_ATTENTION`
- `FINANCE_ATTENTION`

`RECENT_ABANDONED_SESSION`, `EXECUTION_INACTIVITY` and `RECENT_EXECUTION_ACTIVITY` remain excluded from the dashboard queue because the dashboard does not load per-student execution history. The queue must not infer stalled-student behavior without the canonical execution source.

`WORKOUT_REVIEW_DUE` and `NO_ASSESSMENT` remain dashboard aggregate signals, not grouped per-student queue actions in 10.2.

## Queue Contract

Each queue item contains:

- `id`
- `studentId`
- `studentName`
- `priority`
- `title`
- `description`
- `actionLabel`
- `actionTarget`
- `signals`
- `occurredAt`

Signal identity is stable through the `signals[].code` field.

## Grouping Strategy

QUEUE_GROUPING_STRATEGY: GROUP_BY_STUDENT.

The queue shows one item per student and groups mapped signals inside the item. This reduces visual repetition on the dashboard while keeping individual signal codes visible for QA and future workflow stages.

## Priority Model

- `ACTION_REQUIRED`: operational gap that blocks an expected next step, currently active student without active workout.
- `REVIEW`: signal that should be checked by the professional, currently access and finance attention.
- `FOLLOW_UP`: reserved for future calculated follow-up signals; not emitted in 10.2.

The copy avoids diagnostic or alarmist labels.

## Ordering

Ordering is deterministic:

1. priority rank;
2. relevant timestamp descending when available;
3. student name;
4. student id.

Grouped signals inside a student item use the same priority-first model, then signal priority, timestamp and signal code.

## Actions

- `NO_ACTIVE_WORKOUT` -> `Ver treinos` -> `/treinos?aluno=<id>&origem=coach-attention`
- `STUDENT_ACCESS_ATTENTION` -> `Ver aluno` -> `/alunos?aluno=<id>&origem=coach-attention`
- `FINANCE_ATTENTION` -> `Ver financeiro` -> `/financeiro?aluno=<id>&origem=coach-attention`

Actions navigate only. They do not mutate student, workout, access or finance state.

## UX Surface

Primary surface: dashboard.

Secondary surface: `/alunos`, which remains the operational detail surface with existing per-student "Atenção e acompanhamento" context.

The dashboard queue is compact and appears after the existing training/assessment signals. It is not a notification center.

## Security

The queue consumes data already loaded by the protected professional dashboard: students, workouts and billing attention summaries. Existing service/RLS ownership boundaries remain unchanged. Student and anonymous surfaces do not import or render the queue.

## Calculated Only

10.2 preserves CALCULATED_ONLY.

No queue table, dismiss state, resolve state, snooze, manual priority or workflow audit log was added.

## Mobile

The queue uses stacked card items on mobile and keeps the CTA as a full-width touch target at narrow widths. It does not use a horizontal table.

## Accessibility

The queue section has a labelled region, accessible loading status, alert role for errors, visible text badges for priority, keyboard-native links and explicit action labels.

## QA

- `npm.cmd run qa:coach-attention-queue`
- `npm.cmd run qa:coach-workflow-signals`
- `npm.cmd run qa:product-roadmap-v4-cycle-07` static/unit portion passed; runtime portion was blocked by unavailable CDP at `127.0.0.1:9222`.
- `npm.cmd run qa:alunos-authenticated` was not executed successfully in this environment due `fetch failed`.
- `npm.cmd run lint`
- `npm.cmd run build`
- `git diff --check`

Authenticated visual QA: NOT_EXECUTED due local authenticated runtime/CDP limitations. No visual PASS is claimed.

Known regression: `workoutLifecyclePresentation.test.js` still fails with the same preexisting action-list mismatch from main (`edit` is present in actual active actions).

## Supabase Impact

SUPABASE CHANGE: NO.

No migration, RPC, Edge Function or cron is required.

## Finance Impact

NO FUNCTIONAL FINANCE CHANGE.

`FINANCE_ATTENTION` is consumed from the existing billing attention summary only. No rule, payment status, charge flow or finance module file is changed.

## Out Of Scope

- persistent dismiss
- persistent resolve
- snooze
- manual priority
- workflow history
- cron
- Edge Function
- WhatsApp, SMS, email or push notification
- AI
- automatic workout or finance mutation

## Canonical Divergence

`docs/product-roadmap-v4/01-roadmap-overview.md` still describes Coach Workflow Automation as a future cycle, while `reports/product-roadmap-v4/roadmap.json`, `reports/product-roadmap-v4/roadmap-summary.md` and the cycle documents mark it as the current `IN_PROGRESS` cycle. The newer cycle and report artifacts prevail for 10.2.
