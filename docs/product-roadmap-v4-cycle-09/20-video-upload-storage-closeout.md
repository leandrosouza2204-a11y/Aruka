# Cycle 09.5 - Video Upload/Storage Closeout

## Status

COMPLETE

## Objetivo

Add private professional-owned uploaded-video support to personal exercises in the Exercise Library without exposing another professional's media or making the bucket public.

## PR funcional

- PR: #69
- Title: `feat: add exercise video upload storage`
- State: MERGED
- Merged at: 2026-09-06T14:49:17Z

## Feature commit

`2897c5c feat: add exercise video upload storage`

The feature commit is preserved in `main`.

## Merge commit

`487389cd0d3e343b359f0d223ea6575faadfcda7`

## Supabase migration

SUPABASE CHANGE: YES

- Project: `aruka / vrizeuhuhvtvbrmtvdik`
- Migration: `20260906020000_exercise_video_upload_storage_v1.sql`
- DB push: PASS
- Post-push migration list: ALIGNED
- Post-push dry-run: REMOTE DATABASE UP TO DATE
- Production action required: NO

## Local validation

- `npm.cmd run qa:exercise-library-video-upload` - PASS
- `npm.cmd run qa:exercise-library-video-storage-security` - PASS
- `npm.cmd run qa:exercise-library-video-upload-responsive` - PASS
- `npm.cmd run qa:exercise-library-video-upload-accessibility` - PASS
- `npm.cmd run qa:exercise-library-youtube-media` - PASS
- `npm.cmd run qa:exercise-library-custom-exercises` - PASS
- `npm.cmd run qa:exercise-library-read-experience` - PASS
- `npm.cmd run qa:exercise-library-data-model` - PASS
- `npm.cmd run qa:exercise-library-security` - PASS
- `npm.cmd run qa:exercise-library-media-security` - PASS
- `npm.cmd run lint` - PASS
- `npm.cmd run build` - PASS
- `git diff --check` - PASS

## Production promotion

The 09.5 migration was promoted to the production Supabase project after local migration, local QA, remote migration list review and dry-run confirmation. A post-push dry-run confirmed no pending migrations, seeds or roles.

## Storage

- Bucket: `exercise-media`
- Private: true
- MIME allowlist: `video/mp4`, `video/webm`
- Max size: 104857600 bytes
- Path contract: `<auth.uid()>/exercises/<exercise_id>/<asset_uuid>.<mp4|webm>`
- Filename strategy: generated UUID plus MIME-derived extension

## Security

- Owner uploads are restricted to the authenticated user's first path segment.
- Cross-owner storage access is denied by Storage policies.
- Anonymous private media access remains denied.
- Student read remains bounded by the prescribed-exercise helper for future delivered-workout access.
- Signed URLs are temporary and are not persisted.
- `getPublicUrl` is not used for uploaded exercise videos.
- `service_role` is absent from the frontend upload path.

## Upload

Implemented with client validation, generated owner-scoped path, private bucket upload and DB reference persistence.

## Preview

Local selection uses an object URL. Existing uploaded media uses a temporary signed URL. No autoplay is introduced.

## Replace

Replacement uploads the new object first, updates the exercise row, then removes old media only after the DB mutation succeeds.

## Remove

Removal clears the DB reference and then removes the Storage object after a successful mutation.

## Cleanup

If an upload succeeds but the DB mutation fails, the new object is removed when possible. Old media is not removed before the replacement row is safely persisted.

## Responsive

The upload controls and preview are responsive, use internal modal scrolling and keep long file names within the layout.

## Accessibility

The file input has a programmatic label, status/error text is associated with the control, upload status is perceptible, and the remove action has text.

## CI hardening

CI_MIGRATION_COUNT_HARDENING: PASS

- Before 09.5: 18 executable migrations.
- After 09.5: 19 executable migrations.
- The gate was updated to the current strict migration list.
- No security reduction was introduced.
- The correction was validated in CI and entered the functional PR.

## QA

The functional PR checks passed: Vercel, Vercel Preview Comments and GitHub `validation`.

## Known preexisting issue

PREEXISTING_TEST_FAILURE_CONFIRMED

`node --test src/features/treinos/utils/*.test.js` still has one unrelated mismatch in `workoutLifecyclePresentation.test.js`: `ACTIVE` actions include `edit`, while the legacy expectation omits it. No 09.5 files touch the `treinos` feature.

## Decision

09.5 is COMPLETE.

## Cycle progress

Cycle 09 remains IN_PROGRESS.

Completed stages: 09.1, 09.2, 09.3, 09.4, 09.5.

Remaining stages: 09.6, 09.7, 09.8, 09.9.

## Next stage

NEXT_STAGE_NUMBER: 09.6

NEXT_STAGE_TITLE: Workout integration

NEXT_STAGE_OBJECTIVE: allow the workout editor to add exercises from the structured library while preserving existing workout rows and execution-history integrity.

NEXT_STAGE_DEPENDENCIES: 09.1 data model/security, 09.2 read experience, 09.3 personal CRUD, 09.4 YouTube media, 09.5 uploaded video/storage.

NEXT_STAGE_IN_SCOPE: library entry point from workout editing, search/filter selection, append-to-day flow, preservation of existing ordering, nullable legacy compatibility and focused QA.

NEXT_STAGE_OUT_OF_SCOPE: student media experience, seed/catalog expansion, mobile/PWA stabilization sweep, AI recommendations, multiselect and large editor rewrite.

NEXT_STAGE_ACCEPTANCE_CRITERIA: professionals can add system or own custom library exercises to workout days, legacy exercises still render, media references remain authorized and lint/build/focused QA pass.

NEXT_STAGE_STATUS: READY_FOR_START
