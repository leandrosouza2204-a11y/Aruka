# Cycle 09.6 - Workout Integration Closeout

## Status

COMPLETE

## Objective

Connect the Exercise Library to workout editing so professionals can add official or personal exercises to workout days while preserving manual entries, legacy rows, nullable `exercise_id`, execution-history independence and media authorization boundaries.

## Functional PR

- PR: #71
- Title: `feat: integrate exercise library into workouts`
- State: MERGED
- Merged at: 2026-09-07T02:10:04Z
- Functional commit: `7ae4c4a feat: integrate exercise library into workouts`
- Functional merge commit: `eab76ff720071311d3f4c1b77aee3f5d5a74fb0d`

## Implementation

- Added an Exercise Library picker inside the workout-day exercise editor.
- Added search and filters for origin, muscle group, category and media.
- Added loading, empty, error, retry, select and cancel states.
- Added selection for active official exercises and owner-scoped personal exercises.
- Preserved manual exercise entry, edit, remove, reorder, save and reload flows.
- Added stored badges for library-derived workout exercises without live library lookup.

## Data Contract

- `exercise_id` remains nullable for legacy/manual workout rows.
- Library selection stores a stable `exerciseId` and `exerciseMediaSnapshot`.
- Manual fallback clears `exerciseId` and stores an empty snapshot.
- Workout templates and duplicated workouts preserve library references and snapshots.
- Workout parameters such as series, repetitions, load, rest and notes remain independent from the library.

## Snapshot

The workout exercise snapshot stores the selected library exercise state at insertion time. Later edits or archival of the library exercise do not mutate previously saved workout rows. Existing workouts continue rendering from workout data even when the live library row changes or is removed through `ON DELETE SET NULL`.

## Media Snapshot

- YouTube snapshots store canonical public metadata.
- Uploaded-video snapshots store private storage paths and MIME metadata only.
- Signed URLs are temporary and are not persisted.
- No `getPublicUrl` path was introduced for private uploaded media.

## Security

- Official references require active official library rows.
- Personal references require `owner_id = auth.uid()`.
- Cross-owner personal exercise references are rejected by `salvar_treino_composto`.
- Browser-sent user IDs are not trusted for authorization.
- Student media rendering remains out of scope for 09.6.

## Supabase

SUPABASE CHANGE: YES

- Project: `aruka / vrizeuhuhvtvbrmtvdik`
- Migration: `20260907090000_workout_exercise_library_integration_v1.sql`
- DB push: PASS
- Post-push migration list: ALIGNED
- Post-push dry-run: REMOTE DATABASE UP TO DATE
- Post-resume dry-run: REMOTE DATABASE UP TO DATE
- DB push required after resume: NO
- Production action required: NO

## Fake Existing Data

The workout data present during implementation was synthetic/test data. No complex backfill or real historical data migration strategy was required. The delivered contract is still prepared for real data through nullable `exercise_id`, persisted snapshots, `ON DELETE SET NULL` and history that does not depend on the live library row.

## Validation

- `npm.cmd run qa:exercise-library-workout-integration` - PASS
- `npm.cmd run qa:exercise-library-workout-snapshot` - PASS
- `npm.cmd run qa:exercise-library-workout-integration-responsive` - PASS
- `npm.cmd run qa:exercise-library-workout-integration-accessibility` - PASS
- `npm.cmd run qa:exercise-library-workout-integration-runtime` - PASS
- `npm.cmd run qa:exercise-library-read-experience` - PASS
- `npm.cmd run qa:exercise-library-custom-exercises` - PASS
- `npm.cmd run qa:exercise-library-youtube-media` - PASS
- `npm.cmd run qa:exercise-library-video-upload` - PASS
- `npm.cmd run qa:exercise-library-video-storage-security` - PASS
- `npm.cmd run qa:workout-template-discovery` - PASS
- `npm.cmd run qa:workout-template-guided-application` - PASS
- `npm.cmd run qa:personal-workout-template-management` - PASS
- `npm.cmd run qa:workout-delivery-contract` - PASS
- `npm.cmd run qa:workout-delivery-data` - PASS
- `npm.cmd run qa:workout-delivery-authorization` - PASS
- `npm.cmd run lint` - PASS
- `npm.cmd run build` - PASS
- `git diff --check` - PASS

## Unit Tests

`node --test src/features/treinos/utils/*.test.js` reproduces the known preexisting mismatch in `workoutLifecyclePresentation.test.js`: `ACTIVE` actions include `edit`, while the legacy expectation omits it. No new 09.6-related unit failure was observed.

## Visual QA

AUTHENTICATED_VISUAL_QA: NOT_EXECUTED

No authenticated browser/manual screenshot evidence was produced during the post-merge closeout. This does not block 09.6 because static responsive/accessibility gates, build and runtime database checks passed.

## Limitations

- Picker supports single-add only.
- Student media display is intentionally deferred to 09.7.
- Seed/catalog expansion is intentionally deferred to 09.8.
- Mobile/PWA stabilization sweep is intentionally deferred to 09.9.

## Decision

09.6 is COMPLETE.

## Cycle Progress

Cycle 09 remains IN_PROGRESS.

Completed stages: 09.1, 09.2, 09.3, 09.4, 09.5, 09.6.

Remaining stages: 09.7, 09.8, 09.9.

## Next Stage

NEXT_STAGE_NUMBER: 09.7

NEXT_STAGE_TITLE: Student media experience

NEXT_STAGE_OBJECTIVE: allow students to view authorized demonstration media for prescribed exercises inside delivered workouts without exposing another professional's private uploads.

NEXT_STAGE_DEPENDENCIES: 09.1 data model/security, 09.2 read experience, 09.3 personal CRUD, 09.4 YouTube media, 09.5 uploaded video/storage, 09.6 workout integration.

NEXT_STAGE_RECOMMENDED_BRANCH: `feat/product-roadmap-v4-cycle-09-7-student-media-experience`

NEXT_STAGE_STATUS: READY_FOR_START
