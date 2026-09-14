# Cycle 12.1 — Architecture & Foundation

## Mission decision

Cycle 12.1 introduces isolated, default-off foundations only. Legacy `/minha-area` is unchanged. V2 is guarded by `VITE_STUDENT_EXPERIENCE_V2_ENABLED`; only the literal `true` enables it, so deploy and rollback require only configuration plus redeploy, never a migration.

```
ProtectedRoute
├─ /minha-area                         → legacy MinhaArea (default)
├─ /minha-area/inicio|treinos|evolucao|perfil
│  → StudentExperienceV2Route → StudentShell → route outlet
└─ /workout/:sessionId
   → StudentExperienceV2Route → focused future player (no shell navigation)
```

The V2 guard is UX/navigation control only. It resolves the existing student daily-access payload, permits only a linked `active` student, and returns unlinked, suspended, revoked or failed resolution to legacy. RLS/RPC ownership remains authoritative. The shell has one information architecture; responsive implementation in 12.3 uses the repository standard `767px/768px` boundary: mobile bottom navigation, desktop sidebar, and the same outlet/deep links.

## Rollout and rollback

Default production environment: flag absent/OFF. Normal navigation has no link to V2. Pilot activation sets `VITE_STUDENT_EXPERIENCE_V2_ENABLED=true` in the target environment and exposes only the foundation routes. Critical rollback sets it false and redeploys; V2 deep links redirect to `/minha-area`. There is no automatic fallback or dual write.

## Domain decisions (closed)

- **TRACKING_MODEL_DECISION:** add `treino_exercicios.tracking_config jsonb`, defaulting to `{load:true,reps:true,rir:false,rpe:false,duration:false,distance:false}`, and snapshot it onto `workout_execution_exercises` at session start. JSONB is preferred to columns because tracking dimensions will expand; the allowlisted object is validated in RPCs, never inferred from free text. Bodyweight may set `load:false`; time/distance can be introduced without schema churn.
- **SCHEMA_IMPACT / MIGRATION_REQUIRED:** YES / YES, in 12.2. Professional editor defaults and advanced controls are a later product surface; the compatible default retains current strength-workout behavior.
- **CANCEL_SEMANTICS:** new canonical `cancelled`; legacy `abandoned` is semantically cancelled in V2 reads. Preserve partial technical rows; no physical delete. Completed/cancelled sessions are immutable.
- **VALID_SESSION_SEMANTICS:** only `status='completed'` contributes to metrics/history/previous performance. `in_progress`, `cancelled`, and `abandoned` do not. A confirmed short completed workout remains valid.
- **ZERO_SET_COMPLETION_RULE:** `completed_set_count > 0` is required server-side. All-skipped/no-set sessions must continue or cancel.
- **SHORT_WORKOUT_RULE:** `SHORT_WORKOUT_THRESHOLD_SECONDS=300`; server calculates `completed_at - started_at`. Duration `<= 300` requires `short_duration_confirmed=true`; 301 does not. The flag is retained on a valid completed session.
- **SKIP_COMMAND_CONTRACT:** `skip_workout_execution_exercise(session, exercise)`, owner + in-progress + membership checked under lock; idempotent if already skipped. Reject if any completed set exists—never erase recorded effort silently.
- **SET_COMMAND_CONTRACT:** `complete_workout_execution_set(session, exercise, set_number, values)`, owner/in-progress/membership validation, natural key `(execution_exercise_id,set_number)`, row/session lock, upsert/retry-safe, canonical saved payload returned. Values are checked against tracking snapshot.
- **COMPLETE_COMMAND_CONTRACT:** lock owned in-progress session, count completed sets, calculate server duration, enforce short confirmation, atomically set completed timestamp/status, return canonical summary. Repeated completion returns a deterministic already-completed result rather than creating another record.
- **PREVIOUS_PERFORMANCE_FILTER:** server-side only, `status='completed'`; include short-confirmed, exclude cancelled/abandoned/in-progress. First execution returns empty reference; match by immutable exercise/library identity where present, otherwise no unsafe name-based comparison; differing set counts return available rows only.

## Workout player route contract

`/workout/:sessionId` uses a UUID session ID. On refresh, the future read RPC fetches the canonical session by ID and verifies current student ownership and active access. Missing, foreign, cancelled, or completed sessions do not mount a player: foreign/missing resolves safely to legacy/not-found UX; completed resolves to the completion/history destination; cancelled resolves to training/history. Completion goes to completion summary then training/home; cancellation goes to training/home. This mission creates no player behavior.

## 12.2 migration/RPC/RLS specification

| Order | Purpose/objects | Compatibility, rollback and lock risk |
|---|---|---|
| `migration_01_session_semantics` | Extend session status check with `cancelled`; add `cancelled_at`, optional bounded reason, `short_duration_confirmed default false`, `last_activity_at`; add `tracking_config` to prescription and tracking snapshot to execution exercise. | Additive nullable/defaulted columns; no legacy rewrite. Rollback removes new client use first, then objects only after safe release. Brief table lock—schedule normally. |
| `migration_02_indexes_predicates` | Partial completed-history index and session/exercise lookup indexes; canonical SQL predicate/view used by all metric reads. | Add concurrently where Supabase migration policy permits; rollback drops only new indexes/view. Validate `EXPLAIN ANALYZE`. |
| `migration_03_commands` | Definer RPCs: set, skip, cancel, complete; update payload normalizer/read state. | Retain legacy bulk-save/abandon RPCs. All functions use `auth.uid()`, fixed `search_path`, explicit grants, row locks and deterministic retry behavior. |
| `migration_04_reads` | Home summary, program detail, previous performance read RPCs. | Additive; V2 reads migrate independently. Query budgets: Home one RPC, no exercises/media/history list; detail one program; previous performance paginated/one exercise. |

RLS plan: keep relationship isolation; add no broad table grants. Students command only own active sessions; professionals retain read-only ownership-scoped access; suspended/revoked users fail commands; direct prescription mutation remains forbidden. Test matrix: anonymous; Student A/B; Professional A/B; expired student; cross-session exercise/set; completed/cancelled mutation; malformed UUID; definer grants/search path.

## Test and acceptance plan

Foundation unit tests cover flag OFF/ON, linked active versus suspended/unlinked access, valid metric status and threshold. Route static/regression tests must prove legacy `/minha-area`, protected routes, and V2 route registration. 12.3 adds viewport runtime tests; 12.2 adds local Supabase RLS/RPC concurrency tests. No migration, RLS, production RPC, legacy UI or default-route behavior changes belong to 12.1.
