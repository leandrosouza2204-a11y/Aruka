# Product Roadmap v4 - Cycle 09.5 Summary

Cycle 09.5 adds private uploaded-video support to personal exercises in the exercise library.

Status: IMPLEMENTED_VALIDATED_REMOTE_APPLIED

## Delivered

- MP4/WEBM validation and 100 MB size guard.
- Owner-scoped Storage path generation.
- Private upload, signed preview, replacement, removal and cleanup behavior.
- Upload option in the existing personal exercise modal.
- Incremental Supabase migration for the stricter upload contract.

## Supabase

SUPABASE CHANGE: YES

Migration: `supabase/migrations/20260906020000_exercise_video_upload_storage_v1.sql`

Target project: `aruka / vrizeuhuhvtvbrmtvdik`

Remote result: applied. Post-push dry-run returned up to date.

## Validation

- Unit and service tests: PASS.
- 09.5 structural, security, runtime, responsive and accessibility QA: PASS.
- Exercise Library regression QA: PASS.
- Supabase local reset, bootstrap, drift and RLS runtime gates: PASS.
- Lint and production build: PASS.

Known unrelated residual: `src/features/treinos/utils/workoutLifecyclePresentation.test.js` still expects no `edit` action for `ACTIVE`, while current implementation returns it. No 09.5 file changes touch that area.

## Next

09.6 - Workout integration.
