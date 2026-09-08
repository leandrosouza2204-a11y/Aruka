# Coach Workflow Automation Discovery Summary

Decision: COMPLETE.

Cycle: COACH_WORKFLOW_AUTOMATION.

Stage: 10.1 - Discovery and Signal Contract.

## Discovery

The canonical roadmap defines Coach Workflow Automation as operational automation for follow-up, stalled students, pending actions and repeated coach decisions after the exercise library and media foundation.

The product already has a Cycle 07 signal foundation in `/alunos`. Those signals are calculated, professional-only and do not use new tables, cron, Edge Functions or external notifications.

## Signal Result

Accepted reliable signals:

- Active student without active workout.
- Student access attention.
- Recent abandoned session.
- Execution inactivity based on loaded history.
- Recent execution activity for review.
- Finance attention as an input from existing billing helper.
- Workout review due as a dashboard signal candidate.
- No assessment as a low-confidence dashboard signal candidate.

Rejected for now:

- Adherence percentage.
- Broad stalled student by last activity.
- Assessment overdue without cadence.
- Automatic follow-up send.
- Automatic workout, student or finance mutation.

## Architecture

- Calculated vs persisted: CALCULATED_ONLY for 10.1.
- Cron required: NO.
- Edge Function required: NO.
- External notification required: NO.
- Supabase impact: NO.

## Stages

1. 10.1 Discovery and Signal Contract.
2. 10.2 Coach Attention Queue.
3. 10.3 Student-Level Workflow Actions.
4. 10.4 Prioritization and Resolution.
5. 10.5 Mobile/PWA Stabilization.

## Next

NEXT_STAGE: 10.2 Coach Attention Queue.

NEXT_OBJECTIVE: surface calculated coach workflow signals as a compact professional attention queue without automatic action.
