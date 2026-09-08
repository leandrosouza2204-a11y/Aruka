# Student Workflow Actions Summary

Decision: IN_PROGRESS

Cycle: COACH_WORKFLOW_AUTOMATION

Stage: 10.3 Student-Level Workflow Actions

The functional implementation adds stable action descriptors to the calculated Coach Attention Queue and renders explicit primary and secondary student-level actions on the dashboard queue.

Actions implemented:

- `OPEN_WORKOUTS`
- `OPEN_ACCESS`
- `OPEN_FINANCE`
- `OPEN_STUDENT`

Signal mapping:

- `NO_ACTIVE_WORKOUT` -> `OPEN_WORKOUTS`, secondary `OPEN_STUDENT`.
- `STUDENT_ACCESS_ATTENTION` -> `OPEN_ACCESS`, secondary `OPEN_STUDENT`.
- `FINANCE_ATTENTION` -> `OPEN_FINANCE`, secondary `OPEN_STUDENT`.

READ_STATE: NOT_IMPLEMENTED.

PERSISTENCE_DECISION: NO.

Supabase change: NO.

Finance functional change: NO.

Auto-action: NO.

QA created: `qa:student-workflow-actions`.

QA results:

- `qa:student-workflow-actions`: PASS.
- `qa:coach-attention-queue`: PASS.
- `qa:coach-workflow-automation-discovery`: PASS.
- `qa:coach-workflow-signals`: PASS.
- `test:alunos`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.
- `git diff --check`: PASS.
- `qa:dashboard-authenticated`: NOT_EXECUTED due script unsettled top-level await in local runtime.
- `qa:alunos-authenticated`: NOT_EXECUTED due `fetch failed`.
- `workoutLifecyclePresentation.test.js`: PREEXISTING_TEST_FAILURE_CONFIRMED.

Next stage after closeout: 10.4 Prioritization and Resolution.
