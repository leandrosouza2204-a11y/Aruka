# Cycle 09 Exercise Library and Media Planning Summary

Decision: IN_PROGRESS.

Cycle 08.3 dependency:

- PR #57 merged into main.
- Merge commit: `8eb322313dc0c75cb43a6fde75abb637b8da30aa`.
- Main synchronized before creating the Cycle 09 branch.

Roadmap change:

- Previous next cycle: `COACH_AUTOMATION`.
- New next cycle: `EXERCISE_LIBRARY_AND_MEDIA`.
- `COACH_AUTOMATION_POSTPONED=YES`.
- Reason: priority is strengthening the core workout assembly and student workout delivery experience.

Current exercise audit:

- Exercise model: `treino_exercicios`, scoped to workout day, no reusable catalog.
- Workout relation: `treinos` -> `treino_dias` -> `treino_exercicios`.
- Execution relation: `workout_execution_exercises` snapshots prescribed exercise data from `treino_exercicios`.
- Media: YouTube URL only through `video_url`; no uploaded exercise video support.
- Custom exercise: free-text inside workout/template only; no reusable owner-scoped entity.
- Groups/categories: day-level free-text group only; no exercise category catalog.

Implementation path:

- 09.1: data model and security. COMPLETE via PR #61.
- 09.2: read library. COMPLETE via PR #63, merged on 2026-09-05.
- 09.3: custom exercise creation. COMPLETE via PR #65, merged on 2026-09-06.
- 09.4: YouTube media. NEXT.
- 09.5: video upload/storage.
- 09.6: workout integration.
- 09.7: student media experience.
- 09.8: seed/catalog.
- 09.9: mobile/PWA QA and stabilization.

Recommended data model:

- Add reusable `exercises`.
- Add controlled `exercise_muscle_groups` and `exercise_categories`.
- Add per-professional `professional_exercise_favorites`.
- Add media metadata through columns or `exercise_media`.
- Add nullable `treino_exercicios.exercise_id`.
- Preserve existing IDs, snapshots and history.

Security recommendation:

- Private Supabase Storage bucket for uploaded professional exercise videos.
- Owner-isolated storage paths based on `auth.uid()`.
- Signed URL or RPC-mediated student access for prescribed workout media.
- YouTube URL validation must reject unsafe protocols, arbitrary domains, HTML and iframes.

MVP:

- Library, search, muscle groups, categories, system exercises, professional exercises, favorites, create exercise, YouTube, uploaded video, add to workout, student media, authorization and mobile/PWA QA.

Planning artifacts:

- `docs/product-roadmap-v4/16-cycle-09-exercise-library-media.md`
- `reports/product-roadmap-v4/cycle-09-exercise-library-media-summary.md`

PLANNING_COMPLETE=YES
IMPLEMENTATION_STARTED=YES
MIGRATION_CREATED=YES
STAGE_09_1_COMPLETE=YES
STAGE_09_2_STATUS=COMPLETE
STAGE_09_3_STATUS=COMPLETE
NEXT_STAGE=09.4_YOUTUBE_MEDIA_VALIDATION_PREVIEW
