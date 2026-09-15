# Cycle 12.4 — Training Library V2

## Discovery

The canonical current program is the latest delivered `treinos` row for the linked student with `lifecycle_status = 'active'`, ordered by `delivered_at desc nulls last, created_at desc, id`. The schema permits more than one active row, so this deterministic rule is shared with the Home V2 contract. Completed, archived and draft programs are not library candidates.

Program days and prescribed exercises use their explicit `ordem`, with `created_at, id` as deterministic tie-breakers. Exercises belong to days through `treino_exercicios.treino_dia_id`; series, repetitions, load, rest and notes are prescription text fields. A set total is reliable only when every visible exercise has an integer `series` value. The library never derives duration, muscle groups or repetition ranges.

`tracking_config` lives on `treino_exercicios` and is snapshot onto execution exercises at start. The prescription stores exercise-library identity and `exercise_media_snapshot`; the safe media contract supports YouTube and private uploaded videos, but there is no canonical thumbnail. Deleted library items do not invalidate a retained prescription snapshot. Removed prescription rows disappear through the existing relational lifecycle; there is no separate active flag on `treino_exercicios`.

An active execution session maps to both `treino_id` and `treino_dia_id`. The existing start command remains authoritative for ownership, one-active-session enforcement and idempotency. The frontend never creates a second session while a current one is known and revalidates the library immediately before start.

The legacy `get_my_student_workouts()` read is intentionally not reused: it returns active and completed programs with every exercise and media entry. `get_my_student_home_v2()` remains unchanged and bounded to Home.

## Architecture and data contracts

The page uses two additive, ownership-derived RPCs:

- `get_my_student_training_library_v2()` performs one request for the current program, ordered day cards, trustworthy counts and the single active-session mapping. It contains no exercise list or history list.
- `get_my_student_workout_detail_v2(day_id)` is loaded only for the selected day route. It returns one ordered prescription and returns `null` for an invalid, inactive-program or cross-student day.

Both functions derive identity from `auth.uid()`, require active student access, use `SECURITY DEFINER` with `search_path = ''`, schema-qualify database objects, revoke `PUBLIC`/`anon`, and grant only `authenticated`. The detail identifier is treated as an opaque selector, never as authorization. Existing foreign-key indexes cover day/exercise membership; additional indexes require plan evidence and are not added speculatively.

Details use the nested deep-link `/minha-area/treinos/:workoutId` inside `StudentShell`. This provides refresh, browser back/forward, keyboard navigation and focus without modal focus-trap complexity. Videos are never autoplayed and are loaded only after explicit interaction. Uploaded-video paths remain server-side and use the existing authorized signed-URL RPC.

## Product behavior

The information order is program, workouts, details, action. Program `display_name` is preferred when present, with `nome_rotina` as the safe fallback. Cards show only structured muscle focus, exercise count, trustworthy set count, active-session state and recent completion where available. A program without days and a student without an active program have distinct nontechnical empty states.

Any active session has global priority. Continue always navigates with the real session ID. Start uses the existing `iniciarExecucaoTreino` adapter after a fresh summary read; pending actions are disabled, and backend concurrency/idempotency remain the final protection. The destination remains the current `/workout/:sessionId` fallback; no Player V2 behavior is introduced.

## Scope and rollout

`VITE_STUDENT_EXPERIENCE_V2_ENABLED` remains default OFF. The legacy `/minha-area`, Home RPC, player fallback and existing session commands are preserved. Production data is not accessed or mutated. This stage prepares a bounded ordered prescription, media contract and session mapping for Cycle 12.5 without starting it.

## Validation evidence

- Clean local bootstrap: 31 executable migrations plus the reference baseline, 32 ordered bootstrap steps, final schema inventory valid.
- Safe reset: two complete reset/seed runs produced identical migrations, schema and fixtures. Clean-worktree validation also passed with dependency install, bootstrap, validation, stop, credential/JWT scan and full temporary cleanup.
- Runtime data/security: a six-day program, canonical ordering, numeric and textual series, active session on another day, own/cross-student/suspended/anon cases, fixed `search_path`, least-privilege grants and existing-index query plans.
- Payload budgets: summary 1,639 bytes under a 15,000-byte budget; selected detail 1,091 bytes under a 30,000-byte budget.
- Browser QA: 320, 375, 390, 430, 768 and 1280 px; Home-to-Treinos keyboard navigation; list/detail focus; missing media; long program name; loading; safe error and retry surface; double-start; active session; no program; empty program; rollout OFF.
- Session regression: two-client command concurrency, idempotent set completion, cross-student/session denial, cancellation, short-workout validation, terminal immutability and legacy execution flow.
- Supabase security advisor: no issues. Performance advisor findings are the pre-existing RLS initialization-plan baseline; this stage adds no policies. Explicit plans use `treino_dias_treino_id_idx` and `treino_exercicios_treino_dia_id_idx`, so no speculative index was added.

The visual harness creates a temporary local student through the local service role, removes the fixture in `finally`, and never serializes the key or password. Screenshots are temporary QA artifacts and are removed after inspection. Environment prepared for 12.5: **YES**. Cycle 12.5 started: **NO**.
