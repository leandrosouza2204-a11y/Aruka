# Cycle 12.5 — Workout Player Foundation

## Discovery

The existing execution domain remains authoritative for session creation, ownership, lifecycle transitions, exercise ordering, prescription snapshots, tracking snapshots, skip and cancel commands. The Player does not recreate those rules in the browser. It opens an existing execution session by its opaque `sessionId` and never treats the identifier as authorization.

The legacy `/workout/:sessionId` route remains available as the rollout fallback. Student Experience V2 remains default OFF, while the V2 Home and Training Library now send an existing or newly created session to `/minha-area/treino/:sessionId`. The focused Player route intentionally lives outside `StudentShell`, so global student navigation does not compete with an in-progress workout.

## Bounded player contract

`get_my_workout_player_v2(p_session_id uuid)` is the single initial Player read. It returns the owned session, canonically ordered execution exercises, immutable prescription and tracking snapshots, bounded progress for the session's sets, and safe media metadata. It does not return workout history, a global exercise catalog, or unrelated student data.

The function derives the caller through `auth.uid()`, requires an active linked student, validates session ownership, uses `SECURITY DEFINER` with `search_path = ''`, schema-qualifies database objects, revokes access from `PUBLIC` and `anon`, and grants execution only to `authenticated`. Cross-student, professional, suspended-student and invalid-session requests safely return no player payload; anonymous execution is denied. Terminal sessions remain readable for a safe summary but expose no mutation actions.

One representative three-exercise fixture produced a 2,112-byte payload, below the 30,000-byte budget, in one request. Query-plan validation confirmed the existing indexes are sufficient; no speculative index was introduced.

## Route, shell and session identity

The canonical V2 route is `/minha-area/treino/:sessionId`. Direct links, reloads, browser navigation, starts from Training Library and resumes from Home or Library all preserve the real execution-session identity. Reloading or leaving the route does not start, duplicate, skip, complete or cancel a session.

The focused shell contains a compact session header, exercise progress, the current exercise, bounded actions and an explicit exit. “Sair” means leave and continue later; cancellation is a separate destructive action with confirmation and uses the canonical cancel command.

## Exercise navigation and snapshots

Exercises follow the backend's canonical order. Previous, next and the accessible exercise selector change only the local selected exercise; navigation is never completion, skip or cancellation. The selected exercise is stored per session in `sessionStorage`, so a same-session reload resumes the same view without creating server state.

The Player renders names, series, repetitions, prescribed load, rest, notes and tracking configuration from execution snapshots. Later prescription edits cannot rewrite an in-progress execution. Skip uses the existing canonical command and refreshes bounded Player state after persistence.

## Media

The existing safe media mapper and video component are reused. YouTube and authorized uploaded media load only after explicit user interaction and never autoplay. Storage paths are not exposed in the Player payload. Missing, deleted or invalid media produces a stable fallback and does not block the prescription or navigation.

## Cycle boundaries

The Set Tracker boundary for Cycle 12.6 is present as a dedicated stage fed by the session and selected execution exercise, but full set-entry controls are not implemented in this cycle. The Previous Performance boundary is also present without loading workout history or claiming comparisons. Cycle 12.6 can extend the route, focused shell, session loader, navigation and snapshot consumption without redesigning them.

The resilient rest-timer boundary for Cycle 12.7 is timestamp-ready; a full timer is not implemented. Full workout completion, short-workout confirmation UI and post-workout feedback remain Cycle 12.8 work. Existing backend completion and short-workout contracts are preserved and covered by regression tests.

## Responsive behavior and accessibility

The focused layout was inspected at 320, 390, 768 and 1280 CSS pixels. Long exercise names wrap, prescription content remains readable, the action area respects the mobile safe area, and no tested viewport has horizontal overflow, clipping or overlap. Visible interactive controls measure at least 44 CSS pixels in the 320-pixel viewport.

The page has one primary heading, named controls, semantic progress, keyboard-operable navigation and dialog behavior, Escape dismissal, explicit focus return to the exercise-selector trigger, programmatic heading focus after navigation, and reduced-motion support. Loading, safe error, missing-session, empty-exercise, missing-media, last-exercise and terminal states remain usable without exposing internal errors.

## Security and privacy

Authorization is enforced in the bounded database function, not inferred from route state. Direct table writes and terminal-state mutations remain denied by the existing RLS and command contracts. The runtime matrix covers owned, cross-student, anonymous, professional, suspended, invalid and terminal cases, fixed `search_path`, least-privilege grants and snapshot immutability.

All runtime and browser fixtures are synthetic and local. Production was neither accessed nor mutated. No environment file, browser authentication state, HAR, trace, screenshot, real student record or credential is intended for publication.

## Validation evidence

- Supabase bootstrap: 32 executable migrations plus the reference baseline, canonical order PASS, final inventory of 56 public functions, and temporary baseline cleanup PASS.
- Reproducibility: canonical bootstrap and validation PASS; two-run safe reset produced equivalent inventories and fixtures.
- Player runtime: one bounded request, 2,112 bytes for three exercises, no N+1, no history/global-library payload, ownership matrix PASS, canonical order PASS, immutable snapshots PASS, reload PASS, skip/cancel persistence PASS and existing-index plans PASS.
- Visual QA: 10 captured states across 320, 390, 768 and 1280 pixels, including media, missing media, prescription, selector keyboard flow, reload, last exercise, leave/resume, loading, safe error and terminal state; screenshots were inspected rather than accepted by generation alone.
- Accessibility: visible touch targets at least 44 CSS pixels, keyboard activation and dismissal, focus return, accessible names, progress semantics, safe-area behavior and reduced motion PASS.
- Regressions: Cycle 12.1 rollout/routes, Cycle 12.2 safety/idempotency/concurrency/RLS, Cycle 12.3 Home, Cycle 12.4 Training Library, route fallback and 42 legacy executor utility tests PASS. The historical Cycle 6 aggregate's exact-14-migration assertion is already stale on `origin/main` and is not a product regression.
- Quality: focused Player/domain tests, lint, production build, static contracts and `git diff --check` PASS.

## Limitations and 12.6 handoff

This foundation is intentionally read-oriented except for the existing skip and cancel commands. It does not implement editable set tracking, previous-performance calculations, a resilient rest timer, workout completion, short-workout confirmation or post-workout feedback. It also does not replace the legacy Player while the feature flag is OFF.

Cycle 12.6 should attach set-entry behavior to the existing Set Tracker boundary, preserve the one-session/one-route identity, continue using execution snapshots, refresh only bounded session data after canonical commands, and keep Previous Performance separately bounded. The route, shell, session loading, exercise selection and media behavior are ready for that extension.
