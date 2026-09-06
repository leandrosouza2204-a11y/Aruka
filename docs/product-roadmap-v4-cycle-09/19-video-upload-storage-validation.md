# Product Roadmap v4 - Cycle 09.5 Video Upload Storage Validation

Stage: 09.5 - Video upload/storage
Status: VALIDATED

## Required Commands

- `node --test src/features/exerciseLibrary/utils/uploadedVideoMedia.test.js` - PASS
- `node --test src/features/exerciseLibrary/utils/youtubeMedia.test.js src/features/exerciseLibrary/utils/uploadedVideoMedia.test.js src/services/exerciseLibraryService.test.js` - PASS
- `node --test src/services/exerciseLibraryUploadService.test.js` - PASS
- `npm run qa:exercise-library-video-upload` - PASS
- `npm run qa:exercise-library-video-storage-security` - PASS
- `npm run qa:exercise-library-video-storage-runtime` - PASS
- `npm run qa:exercise-library-video-upload-responsive` - PASS
- `npm run qa:exercise-library-video-upload-accessibility` - PASS
- `npm run qa:exercise-library-youtube-media` - PASS
- `npm run qa:exercise-library-custom-exercises` - PASS
- `npm run qa:exercise-library-read-experience` - PASS
- `npm run qa:exercise-library-data-model` - PASS
- `npm run qa:exercise-library-security` - PASS
- `npm run qa:exercise-library-media-security` - PASS
- `npm run qa:exercise-library-local-drift` - PASS
- `npm run qa:exercise-library-rls-runtime` - PASS
- `npm run supabase:reset:safe` - PASS
- `npm run supabase:bootstrap` - PASS
- `npm run supabase:validate` - PASS
- `npm run qa:supabase-ci-static` - PASS
- `npm run lint` - PASS
- `npm run build` - PASS

## Remote Supabase Gates

If local migration/security/runtime gates pass:

- Confirm remote project `aruka / vrizeuhuhvtvbrmtvdik` - PASS.
- Confirm migration list alignment - PASS; only `20260906020000` was pending before push.
- Run dry-run - PASS; only `20260906020000_exercise_video_upload_storage_v1.sql` would be applied.
- Apply only the 09.5 migration - PASS.
- Confirm post-push migration list and dry-run up-to-date - PASS.

## Residual

`node --test src/features/treinos/utils/*.test.js` has one unrelated pre-existing mismatch in `workoutLifecyclePresentation.test.js`: `ACTIVE` actions include `edit`, while the legacy expectation omits it. No Cycle 09.5 changed files are in the `treinos` feature.
