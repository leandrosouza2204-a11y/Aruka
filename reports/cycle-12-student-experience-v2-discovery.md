# Cycle 12 — Student Experience V2

## 1. Decision and cycle number

**DECISION: READY.** The next coherent number is **Cycle 12**: Cycle 11 is marked COMPLETE in `docs/product-roadmap-v4-cycle-11-smart-management/00-cycle-definition.md`; `main` and `origin/main` resolve to `05f7a67`.

This is a new mobile-first presentation over the existing workout-delivery domain, not a replacement domain.

## 2. Current state and architecture map

The student entry point is the authenticated `/minha-area` route in `src/App.jsx`. `ProtectedRoute` protects it; a professional that reaches professional routes is redirected by `ProfessionalRoute` to this same path. It is a single large `src/pages/MinhaArea.jsx` screen: home, workout detail, execution form, timer, history summary and logout coexist in one component. It has no student-only nested router, bottom navigation, desktop sidebar, feature flag, offline queue, or deep-linkable player.

| Flow | Current implementation | Finding |
|---|---|---|
| Home/prescription | `get_my_student_workouts()` → `studentDailyExperienceService` → `buildStudentDailyExperience` | One RPC serializes full active/completed workouts, days and exercises. Useful foundation; potentially oversized for Home. |
| Start/resume | `start_workout_execution_session`, `get_my_workout_execution_state` | Durable backend session and snapshots; refresh resumes. Only one active session per student/workout/day. |
| Set save | UI mutates React state; explicit `save_workout_execution` sends all exercises/sets | Atomic RPC, but not per-set persistence or optimistic/idempotent set commands. |
| Complete/abandon | `complete_workout_execution_session`, `abandon_workout_execution_session` | Abandon is durable as `abandoned`; it is currently returned in recent history. |
| Previous performance | `buildExecutionProgressionSnapshot` over five recent sessions | Client-side, limited sample, includes abandoned records from state; unsuitable as the canonical comparison query. |
| Media | YouTube no-cookie/native signed private video through `get_my_student_exercise_media` | Reuse provider; lazy player is already separate. |
| PWA | Vite PWA, Workbox navigation fallback, prompt update registration | Cache has no runtime API/media policy and no background sync. |

The primary read RPC is not N+1 at the network boundary, but nested correlated aggregations can become costly as history/program size rises. Home V2 must use a dedicated summary RPC; detail/player should fetch the selected program/session separately.

## 3. Reuse map

| Area/file | Classification | Recommended action |
|---|---|---|
| `workoutExecutionService.js` and execution SQL RPCs | Reuse with adaptation | Keep authorization/snapshots; introduce focused command/read contracts. |
| `workoutExecutionSession.js` | Reuse with adaptation | Extend status and completion rules; keep normalization/snapshot utilities. |
| `restTimer.js` | Reuse with adaptation | Preserve timestamp deadline/local restore; add +30s, lifecycle and notification adapter. |
| `ExerciseVideoPlayer.jsx` | Reuse with adaptation | Keep lazy authorized media path in compact disclosure/player. |
| `studentDailyExperienceService.js` | Replace progressively | Split Home summary from program detail. |
| `MinhaArea.jsx` | Replace after migration | Decompose into route/layout/player modules; retain until rollout is proven. |
| PWA manager/config | Reuse with adaptation | Suppress updates during an active player; add only safe caching. |

## 4. Data model, sessions and expected migrations

Current core is `alunos` → `treinos` → `treino_dias` → `treino_exercicios`; execution snapshots are `workout_execution_sessions` → `workout_execution_exercises` → `workout_execution_sets`. Session status is `in_progress|completed|abandoned`; exercises support `not_started|partial|completed|skipped`. Sets have reps, load/value/unit, bodyweight, RIR, RPE and `completed`, with unique `(execution_exercise_id,set_number)`. Snapshotting correctly protects history from prescription edits.

`nome_rotina` is both the professional and student name today. Add nullable `display_name` on `treinos` (not an `internal_name` rename): read `coalesce(display_name, nome_rotina)` for student surfaces; professionals continue using `nome_rotina`. No backfill required; later backfill is optional.

**DATABASE CHANGES EXPECTED: YES.** Ordered migrations:

1. Add `cancelled` (canonical V2 label; map legacy `abandoned` as cancelled in UI), `cancelled_at`, optional bounded `cancellation_reason`, `short_duration_confirmed`; indexes for valid completed history. Do not rewrite legacy data.
2. Add session metadata needed for resilient commands (`last_activity_at`; optional server-owned rest deadline only if cross-device recovery is required). Keep timer local in P0.
3. Add command RPCs: `complete_workout_execution_set`, `skip_workout_execution_exercise`, `cancel_workout_execution_session`, and a completion RPC that validates/records short confirmation. Each locks and verifies the owned in-progress session.
4. Add dedicated summary/history/previous-performance RPCs and composite indexes proven by `EXPLAIN ANALYZE`.
5. Deploy additive database changes, ship dual-compatible client reads, backfill only if a later business need arises, then remove legacy client paths in a separate cleanup PR.

Use `completed` only for valid metrics. Both `cancelled` and legacy `abandoned` are excluded from frequency, volume, records, averages, progression and normal history. A deliberately confirmed short workout remains completed, carries the flag, and is included with a professional-visible qualifier. Completion should require at least one completed set; zero sets/all skipped should be blocked or require an explicit product decision, not silently become a valid workout.

## 5. Security/RLS analysis

Execution tables have RLS. Students can read/write only their own active access/session; professionals can read their own students' sessions. Direct policies prevent prescription mutation; write RPCs are `SECURITY DEFINER` but set `search_path=public`, identify `auth.uid()`, and verify student/session ownership. The frontend uses the anon key, not service role.

**RLS CHANGES EXPECTED: YES**, only to accommodate `cancelled` immutability and new RPCs; not to broaden relationship access. Required tests: Student A cannot read/write Student B; Professional A cannot read Professional B's student; student cannot write a non-owned snapshot/prescription or completed/cancelled session; an expired/suspended student cannot command a session; malformed IDs and cross-session exercise/set IDs fail; anon has no access. Re-audit all definer functions and grants during 12.1.

## 6. Workout player decisions

Persist one completed set immediately through an idempotent mutation keyed by `(session, exercise, set_number)`; optimistic UI may precede acknowledgement but must reconcile the server payload. The current bulk-save RPC is a compatibility path during rollout, not the V2 interaction model. Allow non-linear exercise selection: snapshot order remains display order and has no domain constraint requiring sequential execution.

Skip is already representable at exercise level; persist `skipped` explicitly and exclude it from completed-set/volume calculations. Cancellation should preserve technical data under `cancelled`, never infer cancellation from refresh, app close or navigation. A session remains resumable until explicit cancellation or completion.

Put `SHORT_WORKOUT_THRESHOLD_SECONDS=300` in one domain configuration. On complete, derive duration from server timestamps; `<=300` requires `short_duration_confirmed=true`. Avoid additional arbitrary gates in P0; block zero completed sets separately because it is data validity, not duration.

RIR/RPE fields exist but prescriptions are free text (`series`, `repeticoes`, `carga`, `descanso`) and do not contain per-exercise tracking flags. V2 dynamic UI needs either a compact additive `tracking` snapshot/configuration or an explicit P1 prescription model; do not parse prose as a contract. Load/reps/RIR/RPE can remain optional in the initial set command.

## 7. Rest timer and platform capability matrix

The existing deadline approach (`restEndsAt - Date.now()`) is correct for foreground, refresh and return-from-background; the interval is only a repaint trigger. Keep it, sync on `visibilitychange`, `pageshow`, `focus`, and persist the deadline per session. `Date.now()` is sufficient for this user-facing elapsed deadline; do not count down mutable seconds. Audio/vibration must only be progressive enhancement after user interaction.

| Capability | Android Chrome/browser | Android installed PWA | iOS Safari | iOS Home Screen PWA |
|---|---|---|---|---|
| Timestamp timer on return | Supported | Supported | Supported | Supported |
| Vibration | Supported where hardware/browser permits | Supported where permitted | Not supported | Not supported |
| Audio foreground | Supported after gesture | Supported after gesture | Supported after gesture | Supported after gesture |
| Audio while fully backgrounded | Not guaranteed | Not guaranteed | Not supported/guaranteed | Not supported/guaranteed |
| Persistent notification | Permission + SW required | Permission + SW required | Limited; do not promise | Supported iOS 16.4+ with permission/PWA |
| Service worker | Supported | Supported | Supported | Supported |
| Timely local/background alert without server | Not guaranteed | Not guaranteed | Not supported | Not supported |

The hard guarantee is A: correct time on return. B (background alert) needs a push-capable backend and user permission, so is not a timer-only feature and is deferred. The installed PWA presently has no push subscription/server sender. Sources: [MDN Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API), [MDN Notifications API](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API), [Apple Web Push](https://developer.apple.com/documentation/usernotifications/sending-web-push-notifications-in-web-apps-and-browsers).

## 8. UX, performance, PWA and accessibility

Use student routes `/minha-area/inicio`, `/treinos`, `/evolucao`, `/perfil`, plus focused `/workout/:sessionId`; guard all with `ProtectedRoute` plus a new student-access guard. Mobile has four-item bottom navigation except the focused player; desktop uses a student sidebar and shared route information architecture. Retain legacy `/minha-area` as a redirect/flagged fallback during migration.

Home needs loading, empty/no-program, active, in-progress, completed-today, review, partial, error and offline/stale states. Existing design tokens/components should be reused; move inline page styling to the existing CSS system as modules are extracted. Use sheets on mobile/dialogs on desktop, 44px+ targets, focus traps, labels/errors, live-region restrained timer announcements, contrast and reduced-motion paths.

Avoid player-wide context rerenders; isolate current exercise/set/timer. Lazy-load video only on demand, use image/poster fallback, avoid media in lists, and never cache signed URLs beyond their TTL. Offline write queue is not P0: shape commands with idempotency keys and immutable snapshots now so it can be added without redesign.

## 9. Migration strategy, risks and telemetry

Use additive migrations + temporary V2 route behind a server/configured rollout gate; first enable internal/student pilot, retain legacy route and RPC compatibility, then make V2 default with a rollback to legacy presentation. Do not dual-write divergent session semantics. Instrument existing audit/log infrastructure if available; otherwise defer provider work. Useful events: started, set-completed, exercise-skipped, cancelled, completed, short-confirmed, rest-started/skipped.

| Risk | Severity | Mitigation |
|---|---|---|
| Cancelled sessions pollute metrics | High | Canonical valid-session filters in every history/progression RPC and RLS/RPC tests. |
| Duplicate/lost set on retry | High | Locked idempotent per-set command; server payload reconciliation. |
| Unsupported background alert promise | High | Promise only timestamp accuracy; capability-detect alerts. |
| Home payload / nested SQL growth | Medium | Summary/detail contracts, indexes, query plans and response-size budgets. |
| Legacy/professional regression | High | Additive changes, compatibility tests, staged rollout and rollback route. |
| Free-text prescription cannot drive UI | Medium | Explicit tracking model decision in 12.1. |

## 10. Final roadmap

| Mission / expected PR | Scope and dependencies | Risk, gates and acceptance |
|---|---|---|
| 12.1 Architecture & Foundation | Student route/layout contract, student guard, data-contract design, migration/RPC specifications, tracking decision. | High. SQL/RLS static tests, route/deep-link and rollback gate. No player UI. |
| 12.2 Session Safety & Commands | Additive schema, cancel/short-completion/per-set command RPCs, valid-history query contract. Depends 12.1. | High. Transaction/idempotency/RLS/migration rollback tests; cancelled never appears in metrics. |
| 12.3 Student Shell & Home V2 | Responsive shell/nav and summary RPC/UI states. Depends 12.1–12.2 contracts. | Medium. Payload/query budget, a11y, no-program/in-progress/review QA. |
| 12.4 Training Library V2 | Current/previous program list, compact cards, media disclosure. Depends 12.3. | Medium. Legacy display-name fallback, lazy-media and responsive QA. |
| 12.5 Workout Player Foundation | Focused route, resume/deep link, selector, one-exercise-at-a-time state. Depends 12.2. | High. Refresh/navigation/reorder/skip integration QA. |
| 12.6 Set Tracking & Previous Performance | Per-set UI/commands, dynamic tracking, valid previous comparison. Depends 12.5. | High. Retry/concurrency/first-use/set-count change QA. |
| 12.7 Rest Timer Resilience | Deadline timer, +30/skip, foreground audio/vibration adapter and platform fallbacks. Depends 12.5. | Medium. Android/iOS foreground/background-return matrix. |
| 12.8 Completion & Feedback | Short-workout confirmation, result summary, optional feedback. Depends 12.2/12.6. | High. 1/2/5/>5-minute and zero-set gates. |
| 12.9 Evolution V2 | Valid session history/frequency; assessment linking; defer charts if contract insufficient. Depends 12.2. | Medium. Cancelled exclusion and empty/partial UX. |
| 12.10 Profile & Secondary Flows | Profile, professional, preferences, support/session. Depends 12.3. | Low. Guard/logout/a11y QA. |
| 12.11 PWA, Responsive & A11y QA | Cross-cutting hardening/rollback rehearsal. Depends all product stages. | High. Android/iOS/desktop/device matrix. |
| 12.12 Security, Performance & Closeout | RLS runtime audit, query plans, docs, removal decision for legacy route. Depends all. | High. Full regression and release gates. |

Dependency graph: `12.1 → 12.2 → {12.3,12.5,12.9}; 12.3 → {12.4,12.10}; 12.5 → {12.6,12.7}; 12.2+12.6 → 12.8; all → 12.11 → 12.12`.

## 11. Test strategy and next action

Test Home (none/available/active/review); player start/set/reorder/skip/refresh/background/resume/cancel/complete; short completion at 1, 2, 5 and >5 minutes plus cancelled confirmation; timer foreground/background/lock/return/+30/skip/refresh; Android Chrome/PWA and iOS Safari/Home Screen; Student A/B and Professional A/B RLS; desktop/sidebar/responsive and keyboard/screen-reader flows. Run focused unit/RPC tests, `npm.cmd run lint`, build, security/static validators and controlled local Supabase tests before each PR.

**NEW DEPENDENCIES EXPECTED: NO** for the first implementation mission. **BREAKING CHANGES EXPECTED: NO** if the additive/compatibility sequence is followed.

**First implementation mission: 12.1 — Architecture & Foundation.** It must deliver the route/layout and guard decision, V2/legacy migration and rollback contract, authoritative read/write/RLS/migration specifications, tracking-field decision, and test harness plan. It must not alter production UI, schema or behavior.

**Recommended next action:** approve this roadmap and open a narrowly scoped 12.1 discovery-to-foundation PR.
