# Cycle 12.2 — Session Safety & Commands

## Result

Cycle 12.2 adds the database and service contracts required by Student Experience V2 while keeping V2 disabled and preserving the legacy UI and RPCs. Validation ran only against the controlled local Supabase stack; production was neither accessed nor mutated.

## Migrations

| Migration | Purpose | Compatibility and rollback |
| --- | --- | --- |
| `20260914130000_cycle12_execution_tracking_and_safety.sql` | Adds structured prescription tracking, immutable execution snapshots, `cancelled` metadata, short-duration metadata, canonical payload fields and history indexes. | Additive columns have safe defaults. Stop V2 consumers before removing objects in a later supervised rollback. No row rewrite is performed. |
| `20260914131000_cycle12_execution_commands.sql` | Adds complete-set and skip commands with session locking, ownership, membership, tracking and retry validation. | Legacy save remains available. Remove new callers before dropping RPCs. |
| `20260914132000_cycle12_completion_and_grants.sql` | Adds cancel and V2 completion, least-privilege grants and command-only mutation hardening. | Legacy start/save/complete remain SECURITY DEFINER RPCs and passed runtime regression. |
| `20260914185833_cycle12_canonical_execution_reads.sql` | Adds the valid-session view, bounded history, previous performance and the prescription/session lookup index. | Additive read surface; clients can fall back to legacy reads before removal. |

## Domain contracts

- Tracking config is an allowlisted JSON object with boolean `load`, `reps`, `rir`, `rpe`, `duration` and `distance` keys. Invalid types and unknown keys fail the database constraint. Legacy rows receive the approved load/reps default.
- The start trigger copies prescription tracking to `workout_execution_exercises.tracking_config_snapshot`. Runtime QA proved changing the prescription does not mutate an existing snapshot and a later session receives the new config.
- V2 state machine is `in_progress → completed | cancelled`; legacy `abandoned` remains terminal. Completed, cancelled and abandoned sessions reject incompatible commands and authenticated direct writes are revoked.
- Cancellation stores server-generated `cancelled_at`, a nullable reason bounded to 500 characters and preserves partial sets.
- Completion requires at least one completed set. The server derives whole elapsed seconds from `started_at`; durations `<= 300` require explicit confirmation and 301 seconds does not.
- `last_activity_at` changes only in real set, skip, cancellation or completion commands.

## Commands and errors

`complete_workout_execution_set`, `skip_workout_execution_exercise`, `cancel_workout_execution_session` and `complete_workout_execution_session_v2` derive ownership from `auth.uid()`, require active student access, lock the owned session and validate cross-session references. New SECURITY DEFINER functions pin an empty `search_path`, schema-qualify relations, revoke PUBLIC/anon execution and grant only `authenticated`.

The natural set key remains `(execution_exercise_id, set_number)`. Equal retries return the canonical session without duplication; divergent retries raise `SET_CONFLICT`. Disabled or unknown tracking fields raise `TRACKING_VALIDATION_ERROR`. Other stable domain failures include `SESSION_NOT_OWNED`, `SESSION_NOT_IN_PROGRESS`, `INVALID_SET`, `INVALID_EXECUTION_EXERCISE`, `ZERO_COMPLETED_SETS` and `SHORT_WORKOUT_CONFIRMATION_REQUIRED`.

## Canonical reads

`valid_workout_execution_sessions` centralizes `status = 'completed'`. `get_my_valid_workout_execution_history` returns at most 50 completed sessions. `get_my_previous_workout_performance` returns the latest valid execution for one prescribed exercise, optionally before a current session, or `{ "previousExecution": null }` on first execution. Cancelled, abandoned and in-progress sessions are excluded; confirmed short completions remain valid. Changed and missing set counts are returned as actually stored.

## Security and performance

- Authenticated table mutation grants were removed from execution sessions, exercises and sets; all mutations flow through guarded RPCs. Obsolete write policies were removed.
- Runtime isolation covered own student, cross-student, cross-session, both professional roles, anon and suspended access.
- The internal canonical payload helper and tracking trigger/helper are not executable by client roles.
- Supabase security advisor reported no issues. Performance advisor warnings are pre-existing baseline RLS initialization-plan findings outside this mission; the execution policies introduced or retained by this stage use cached `(select auth.uid())` expressions.
- `EXPLAIN (FORMAT JSON)` proved valid history uses `workout_execution_sessions_valid_history_idx` and previous performance uses `workout_execution_exercises_prescription_session_idx`.

## Executed evidence

- Fresh canonical bootstrap and all 29 executable migrations: PASS.
- Runtime matrix: tracking snapshot/immutability, complete set, equal/divergent retry, two-client real concurrency, cross-student/session, skip, cancel, zero-set, 60/120/300/301 seconds, server duration, completion retry, terminal immutability and RLS: PASS.
- Canonical reads: valid history, short confirmed inclusion, invalid-state exclusion, first execution, changed set counts and bounded result: PASS.
- Legacy database flow: start, save, resume, complete and history: PASS.
- Focused execution unit suite and static authorization validator: PASS.
- Production data mutated: NO. V2 default enabled: NO. Legacy UI changed: NO.

Machine-readable evidence is in `reports/cycle-12-2-runtime-matrix.json` and `reports/cycle-12-2-canonical-reads-security.json`.

## Known limitations

The tracking configuration already reserves `duration` and `distance` for later expansion, but Cycle 12.2 persists only the existing set columns (`reps`, load/bodyweight, RIR and RPE). No new timer, offline queue, notification, shell, player or visual behavior is part of this stage.
