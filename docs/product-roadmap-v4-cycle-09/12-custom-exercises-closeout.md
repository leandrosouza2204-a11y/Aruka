# Product Roadmap v4 - Cycle 09.3 Closeout

## Status

COMPLETE

## Stage

- Stage: 09.3
- Canonical title: Custom exercise creation and editing
- Implementation PR: #65
- Merge commit: `7bb6308b5b28872048b41a2dab6544673a170d46`
- Merged at: 2026-09-06T00:19:01Z

## Delivered

- Personal exercise creation on `/exercicios`.
- Personal exercise editing.
- Soft archive for personal exercises through `status = archived`.
- Official exercises remain protected from edit/archive UI actions.
- Form validation for required name, muscle group and category.
- Service methods for create, update and archive using the 09.1 `exercise_library` contract.

## Security

- RLS remains the authority for ownership and allowed mutations.
- Create resolves the authenticated Supabase user before assigning `owner_id`.
- Update/archive constrain requests to `origin = personal`.
- No service-role client is used in the frontend.
- No hard delete is exposed.

## Supabase

SUPABASE CHANGE: NO

No migration, baseline, storage, function, policy or production database action was required.

## QA

- PR #65 checks: PASS.
- Vercel: PASS.
- Post-merge `npm.cmd run qa:exercise-library-custom-exercises`: PASS.
- Post-merge `npm.cmd run qa:exercise-library-read-experience`: PASS.
- Post-merge `npm.cmd run qa:exercise-library-data-model`: PASS.
- Post-merge `npm.cmd run qa:exercise-library-security`: PASS.
- Post-merge `npm.cmd run qa:exercise-library-media-security`: PASS.
- Post-merge `npm.cmd run lint`: PASS.
- Post-merge `npm.cmd run build`: PASS.
- Post-merge `git diff --check`: PASS.

## Runtime And Visual

Authenticated browser runtime was not executed locally. Manual visual QA remains required for the new personal exercise modal.

## Known External Note

The focused Treinos utility suite still has the known pre-existing `workoutLifecyclePresentation.test.js` expectation mismatch around the active `edit` action. It was not introduced by 09.3 and did not block PR #65 gates.

## Next Stage

09.4 - YouTube media validation and preview.
