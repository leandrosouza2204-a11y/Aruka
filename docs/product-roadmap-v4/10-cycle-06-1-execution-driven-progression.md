# Cycle 06.1 - Execution-Driven Progression & Feedback

## Scope

Cycle 06.1 adds a descriptive execution-comparison layer on top of the Cycle 06 workout execution history. It does not replace Cycle 01 prescription progression.

The product language separates:

- Prescrito: workout sheet fields and prescription comparison.
- Realizado: sets, reps, load, RIR and RPE registered by the student.

## Domain

`buildExecutionProgressionSnapshot` receives a current or recent session plus a bounded recent history. It returns:

- compact exercise references;
- factual load/reps deltas only when safe;
- best set references;
- confidence;
- completed-session frequency for 7 and 30 days.

No automatic load recommendation is produced.

## Matching

Exercise matching requires the same normalized execution snapshot name. It can raise confidence with compatible group, day name and order, but order alone never identifies an exercise.

The MVP prefers false negatives over false positives. It does not use fuzzy matching, Levenshtein or broad text similarity.

## Confidence

The helper exposes technical confidence values for domain use:

- HIGH: same normalized name with strong context.
- MEDIUM: same normalized name with partial context.
- LOW: same name but weak comparison or incompatible metrics.
- INSUFFICIENT: no comparable execution.

The UI does not expose technical enum names.

## Metrics

Supported:

- last registered execution;
- same-reps load delta with compatible units;
- same-load rep delta;
- best factual set;
- RIR/RPE as context only;
- completed sessions in the last 7 and 30 days.

Not supported:

- adherence percentage;
- progression score;
- performance score;
- automatic next-load recommendation;
- volume as a headline metric.

## Limitations

There is no stable logical exercise identity across workout edits. The MVP compares by conservative snapshot equivalence. If the product later needs robust identity through renames and template changes, add a logical exercise id or exercise catalog in a separate database-reviewed cycle.

Unit mismatches block load deltas. Bodyweight exercises show reps and do not treat `0 kg` as performance.

Completed sessions are eligible for progression baseline. Abandoned sessions can remain visible in raw history but are excluded from progression baseline. Skipped exercises are excluded.

## Student UX

`/minha-area` shows a compact hint per exercise during execution:

- "Ultima execucao registrada"
- "Primeiro registro deste exercicio."

After completion it shows a short factual summary with registered exercises, completed sets, safe comparisons and completed sessions in the last 7 days.

## Professional UX

The existing student detail execution history is enriched with:

- completed-session frequency for 7 and 30 days;
- performed best set per recent exercise;
- previous comparable execution;
- factual delta text;
- optional RIR/RPE context.

No new page or dashboard BI was added.

## Session Date Contract

`workout_execution_sessions.session_date` represents the local civil date on which the student performed the workout. It is not a UTC timestamp, server date or database date.

Cycle 06.1 extends `start_workout_execution_session` with `p_session_date date`. The frontend sends this value from the user's local calendar with `getLocalDateOnly()`, which uses `getFullYear()`, `getMonth()` and `getDate()` instead of `toISOString().slice(0, 10)`.

Server timestamps remain authoritative:

- `started_at`: server-side `now()`;
- `completed_at`: server-side `now()`;
- `abandoned_at`: server-side `now()`.

The RPC still derives the student from `auth.uid()`. It never accepts `aluno_id` from the client. `p_session_date` is only civil metadata and is bounded by a conservative server guard: not null, not more than 31 days in the past, and not more than 1 day in the future relative to the database date. Existing idempotent or in-progress sessions are returned without overwriting their original `session_date`.

No historical backfill is included. Existing rows cannot be corrected reliably without knowing the student's timezone at the moment of execution.

## Query Strategy

The MVP reuses the Cycle 06 payload already loaded by:

- `get_my_workout_execution_state`;
- `get_student_workout_execution_history`.

No new Supabase table, index or materialized view was added. A database-reviewed migration extends the existing start-session RPC to write the explicit local civil date.

## Security

Authorization remains delegated to Cycle 06 RPC/RLS:

- students read/write only their own active execution flow;
- professionals read only their own students;
- suspended/revoked students are blocked by existing write guards;
- cross-tenant access remains blocked.

Cycle 06.1 adds no new authorization path. The start-session RPC keeps `SECURITY DEFINER`, `search_path = public`, and student identity derived from `auth.uid()`.

## QA

Focused QA:

- `qa:product-roadmap-v4-cycle-06-1`
- `qa:execution-progression`
- `qa:execution-progression-student-runtime`
- `qa:execution-progression-professional-runtime`
- `qa:execution-progression-authorization`
- `qa:workout-execution-session-date-contract`

Regression remains required for Cycle 01, Cycle 03, Cycle 04, Cycle 04.1, Cycle 05, Cycle 05.1, Cycle 06, finance and WhatsApp encoding.
