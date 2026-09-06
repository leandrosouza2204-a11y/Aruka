# Product Roadmap v4 - Cycle 09.4 YouTube Media Validation

Stage: 09.4 - YouTube media validation and preview
Status: VALIDATION_DEFINED

## Validation Matrix

- Parser accepts supported YouTube formats and raw 11-character video IDs.
- Parser rejects arbitrary hosts, fake YouTube domains, unsafe schemes and iframe/HTML input.
- Payload stores only canonical URL and media metadata required by the existing schema.
- Embed and thumbnail URLs are derived internally and are not persisted.
- Modal preview uses `youtube-nocookie`, lazy iframe loading and fixed 16:9 responsive sizing.
- Personal exercise edit flow can add, replace or clear media fields.
- Supabase diff remains empty.
- 09.1, 09.2 and 09.3 focused regressions remain green.

## Commands

- `node --test src/features/exerciseLibrary/utils/youtubeMedia.test.js`
- `node --test src/services/exerciseLibraryService.test.js`
- `npm run qa:exercise-library-youtube-media`
- `npm run qa:exercise-library-custom-exercises`
- `npm run qa:exercise-library-read-experience`
- `npm run qa:exercise-library-data-model`
- `npm run qa:exercise-library-security`
- `npm run qa:exercise-library-media-security`
- `npm run qa:exercise-library-local-drift`
- `npm run lint`
- `npm run build`

Runtime browser QA remains recommended on `/exercicios` with an authenticated professional account.
