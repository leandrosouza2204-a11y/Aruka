# Cycle 06 - Workout Execution History Foundation

## Scope

Cycle 06 introduces the first execution-history layer for delivered workouts. The implementation is intentionally foundational: students can start or continue an execution session from `/minha-area`, register performed sets, save progress, complete a session, or abandon it. Professionals can read recent execution history inside the student detail panel.

Out of scope for this cycle: analytics, PR detection, training volume, adherence scores, gamification, AI feedback, rest timer, offline-first sync, wearables, payments, invitations, and assessment expansion.

## Database

Migration: `supabase/migrations/20260822120000_workout_execution_history_foundation.sql`

Tables:

- `workout_execution_sessions`: one student execution session, linked to `alunos`, optionally to `treinos` and `treino_dias`.
- `workout_execution_exercises`: exercise snapshots for the session. These rows preserve prescription names, sets, reps, load, rest, notes, day, group, order, and workout title even if the prescription is later edited or archived.
- `workout_execution_sets`: performed set rows with reps, load, unit, bodyweight flag, RIR, RPE, and completion flag.

Key guarantees:

- RLS is enabled on all three tables.
- Students can write only their own `in_progress` sessions and only while `student_access_status = 'active'`.
- Professionals can read only students they own through `alunos.user_id`.
- Anonymous access is revoked.
- Idempotent start is supported by `(aluno_id, idempotency_key)`.
- Only one active session per student/workout/day is allowed.

RPCs:

- `start_workout_execution_session`
- `save_workout_execution`
- `complete_workout_execution_session`
- `abandon_workout_execution_session`
- `get_my_workout_execution_state`
- `get_student_workout_execution_history`

## Application

Student:

- `/minha-area` keeps the active workout consultation flow.
- A student can choose a workout day, start execution, fill up to five visible set rows per exercise, save, complete, or abandon.
- Recent execution history is shown separately from prescribed workout history.

Professional:

- The Alunos detail panel now fetches recent execution history through `buscarHistoricoExecucaoAluno`.
- The panel is read-only and displays status, date, workout/day, touched exercise count, and completed set count.

## Validation

Static and deterministic QA commands:

- `npm run qa:product-roadmap-v4-cycle-06`
- `npm run qa:workout-execution-authorization`
- `npm run qa:workout-execution-student-runtime`
- `npm run qa:workout-execution-professional-runtime`
- `node --test src/features/workoutExecution/utils/*.test.js`

No production database action is part of this cycle.
