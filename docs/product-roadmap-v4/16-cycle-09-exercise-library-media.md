# Product Roadmap v4 - Cycle 09: Exercise Library and Media

## Objective

Create the Aruka exercise library and media foundation for workout assembly, with system exercises, professional custom exercises, favorites, YouTube support, uploaded professional videos and authorized student viewing inside delivered workouts.

Planning is complete and implementation has started incrementally. Stages 09.1, 09.2 and 09.3 are complete; stages 09.4 through 09.9 remain pending.

## Motivation

Workout assembly is currently functional but exercise selection is still manual and embedded in the workout editor. The next product step is a structured library that helps professionals prescribe faster and helps students understand each prescribed exercise through safe demonstration media.

Coach Automation remains valuable, but is postponed to a future cycle because the current priority is strengthening the core workout creation and delivery experience.

COACH_AUTOMATION_POSTPONED=YES

## Current State Audit

CURRENT_EXERCISE_MODEL=`public.treino_exercicios` is the current exercise record. It belongs to a workout day, not to a reusable exercise catalog. Fields are `id`, `treino_dia_id`, `nome`, `series`, `repeticoes`, `carga`, `descanso`, `observacoes`, `video_url`, `ordem`, `created_at`.

CURRENT_WORKOUT_EXERCISE_RELATION=`public.treinos` -> `public.treino_dias` -> `public.treino_exercicios`. Days contain free-text `grupo_muscular`; exercises contain prescription fields and optional YouTube URL. Save/update uses `public.salvar_treino_composto(jsonb)`, which validates ownership and rewrites days/exercises transactionally.

CURRENT_STUDENT_EXECUTION_CONTRACT=Student access uses `public.get_my_student_workouts()` for active/completed workouts and `public.start_workout_execution_session()` for execution. Execution creates snapshot rows in `workout_execution_exercises`, preserving exercise name, prescribed series/reps/load/rest/notes, day/group/order and workout title.

CURRENT_MEDIA_SUPPORT=Only a text `video_url` exists on `treino_exercicios`. The editor accepts YouTube/youtu.be/Shorts URLs; student UI renders a lazy YouTube no-cookie iframe through `ExerciseVideoPlayer`. There is no uploaded exercise video support.

CURRENT_CUSTOM_EXERCISE_SUPPORT=Professionals can type any exercise into a workout day or personal workout template, but there is no reusable custom exercise entity, owner-scoped custom library, favorites or archive state.

CURRENT_CATEGORIES=None for exercises. Workout templates have objective/level/split metadata, but exercises do not have category metadata.

CURRENT_MUSCLE_GROUPS=Workout days have free-text `grupo_muscular`/editor `descricao`; individual exercises do not have normalized muscle group.

Storage audit: current baseline has private bucket `avaliacoes-fotos` with owner-folder policies and image MIME restrictions. No exercise media bucket exists.

## Architectural Decision

Do not create an unrelated parallel workout model. Cycle 09 should evolve the current model by adding a reusable exercise library and linking prescribed workout exercises to library exercises while preserving existing `treino_exercicios` IDs and execution history.

Reference vs snapshot:

- Reference: library exercise identity, source type, owner, normalized muscle group/category, media metadata and current official/custom exercise content.
- Snapshot on prescription/execution: exercise display name and all prescriptive fields required to preserve historical integrity, including series, reps, load, rest, notes and the media reference that was available when the workout was delivered or executed.

Existing historical `treino_exercicios` must remain readable even if `exercise_id` is null.

## Proposed Data Model

Tables/changes to design in 09.1:

- `exercises`: reusable catalog with `id`, `name`, `instructions`, `muscle_group_id`, `category_id`, `source_type`, `owner_user_id`, `media_type`, `youtube_url`, `youtube_video_id`, `storage_bucket`, `storage_path`, `thumbnail_url`, `status`, `created_at`, `updated_at`.
- `exercise_muscle_groups`: controlled global catalog, with possible future owner-scoped custom rows.
- `exercise_categories`: controlled global catalog, with possible future owner-scoped custom rows.
- `professional_exercise_favorites`: `professional_id`, `exercise_id`, `created_at`; favorite is never global.
- `exercise_media` or embedded media columns: choose in 09.1 after deciding whether one exercise may have multiple media assets. P0 can use one media asset per exercise.
- `treino_exercicios.exercise_id nullable`: links prescribed exercises to the library while allowing legacy free-text rows.
- Optional `treino_exercicios.exercise_media_snapshot jsonb`: preserves the media chosen for the prescribed workout if library media changes later.

Global vs custom:

- SYSTEM_EXERCISE: owner is null, source type `system`, visible to professionals, not editable by common users.
- CUSTOM_EXERCISE: owner is `auth.uid()`, source type `custom`, visible/editable only by owner, usable for that professional's students.

Archive strategy: custom exercises should be soft archived instead of hard deleted once used by workouts/history. System exercises should use status-based publication control.

## Groups And Categories

Recommended initial muscle groups: Peitoral, Costas, Ombros, Biceps, Triceps, Antebraco, Abdomen/Core, Quadriceps, Posteriores de coxa, Gluteos, Panturrilhas, Adutores, Abdutores, Corpo inteiro.

Recommended initial categories: Musculacao, Aerobico, Mobilidade, Alongamento, Funcional, Em casa.

Creation of custom groups/categories should not be P0 unless there is a clear operational need. The safer initial model is a controlled global catalog plus future owner-scoped custom taxonomy to avoid duplicates such as "Peito" vs "Peitoral".

## UX

Library:

- Search input labeled "Buscar exercicios".
- Compact filters for muscle group, category, source and favorites.
- Source options: Todos, Biblioteca Aruka, Meus exercicios, Favoritos.
- List/grid items show name, muscle group, category, media indicator, favorite action and primary action.

Exercise preview:

- Opens as responsive modal/drawer.
- Shows name, group, category, instructions and media when available.
- Does not autoplay media.

Create exercise:

- Fields: Nome required, Grupo muscular required, Categoria required, Media, Instrucoes/observacoes, Favorito optional.
- Media selector: Sem media, YouTube, Enviar video.
- YouTube field validates inline and shows preview after a valid URL.
- Upload flow handles idle, selecting, uploading, success and failed states.

Workout flow:

- Treino -> Adicionar exercicio -> Biblioteca -> buscar/filtrar -> Adicionar ao treino -> return to the current workout day.
- P0 recommendation: add one exercise at a time for lower complexity and less editor disruption. Multiselect is P1 after the single-add flow is stable.
- Existing exercise ordering must be preserved; library insertion appends to the current day unless the editor adds a deliberate insertion position later.

Student flow:

- Delivered workout exercise shows a compact "Ver demonstracao" action when media exists.
- YouTube renders with generated no-cookie embed from a validated video ID.
- Uploaded video uses native HTML5 controls with play, pause, seek, volume and fullscreen.
- No autoplay.

## Media And Storage

YouTube:

- Store original URL only after validation.
- Normalize/extract video ID using a specific parser.
- Accept legitimate YouTube, youtu.be and Shorts formats.
- Reject `javascript:`, `data:`, arbitrary domains, HTML, scripts and user-provided iframes.
- Generate embed URLs from the validated video ID.

Uploaded video:

- Use Supabase Storage or existing Aruka storage conventions; do not store binaries in the database.
- Recommended bucket: private `exercise-media`.
- Initial MIME allowlist: `video/mp4`; evaluate `video/webm` for P0 if mobile/browser QA supports it.
- Initial size limit recommendation: 100 MB until real usage proves another limit.
- Storage path: `professional/<auth.uid()>/exercises/<exercise_id>/<asset_id>.<ext>` or equivalent generated server-side path.
- Never trust browser-sent `user_id`; policies must rely on `auth.uid()`.
- Replacement should upload the new object, update metadata, then mark/delete old object after success.
- Thumbnail can be default/poster in P0; generated or uploaded thumbnails are P1.

Storage recommendation: private bucket plus signed URLs/RPC-mediated access. This prioritizes privacy and authorization for professional-owned videos. Public buckets are acceptable only for official Aruka-owned public media after a separate decision.

## Security And RLS

Professional:

- Can read system exercises and own custom exercises.
- Cannot read or mutate another professional's custom exercises.
- Can favorite/unfavorite per own user ID only.
- Can attach media only under own storage path.

Student:

- Cannot access the creation library.
- Can read exercise/media data only when linked to the professional's student record and the exercise is part of an active/completed prescribed workout authorized to that student.
- For private uploaded video, student access should be via signed URL or RPC that verifies the prescribed workout relationship.

Anonymous: no private exercise/media access.

Authorization must use authenticated identity and relationship checks, never email and never client-controlled professional IDs as source of truth.

## Performance

- Debounced case-insensitive search by name, with possible group/category search.
- Start with `ILIKE` plus indexes appropriate to catalog size; consider trigram/full-text only when needed.
- Paginate or limit results; do not load the entire library once seed grows.
- Lazy load thumbnails.
- Never render video players in the list; render player only in preview/student disclosure.

## Migration Strategy

Cycle 09 migrations should be incremental:

1. Catalog tables and RLS.
2. Favorites.
3. Media metadata and storage policies.
4. Nullable `treino_exercicios.exercise_id` and optional media snapshot.
5. RPC/service integration.

Legacy rows keep `exercise_id` null and continue using `nome`/`video_url`. No backfill is required for MVP unless a controlled mapping is created later.

## Seed Strategy

P0 should seed a curated official Aruka library, likely 100-200 fundamental exercises, after schema/security are stable. Each official exercise needs name, muscle group, category, short professional-facing instructions and optional licensed/owned media.

Do not download random YouTube videos, copy MFit media or reuse third-party GIFs/images without license. Official Aruka media must be produced, licensed or explicitly authorized.

## QA

Required validation:

- Professional A reads system + own custom, not Professional B custom.
- Professional B same isolation.
- Student reads only prescribed exercises/media in own delivered workouts.
- Anonymous reads no private resources.
- Favorite is per professional.
- YouTube validator accepts supported formats and rejects unsafe/arbitrary input.
- Upload rejects invalid MIME/oversize files and enforces storage path isolation.
- Existing workouts, execution sessions and history still render after nullable library integration.
- Mobile/PWA upload and preview tested on Android and iOS standalone/browser behavior.

## Phases

09.1 - Data model and security. COMPLETE via PR #61, merged on 2026-09-05.
09.2 - Exercise library read experience. COMPLETE via PR #63, merged on 2026-09-05.
09.3 - Custom exercise creation and editing. COMPLETE via PR #65, merged on 2026-09-06.
09.4 - YouTube media validation and preview. NEXT.
09.5 - Video upload/storage.
09.6 - Workout integration.
09.7 - Student media experience.
09.8 - Seed/catalog.
09.9 - Mobile/PWA QA and stabilization.

## MVP

P0: library, search, muscle group, category, system exercises, professional exercises, favorites, create exercise, YouTube, uploaded professional video, add to workout, student media, full authorization, mobile/PWA QA.

P1: photo/GIF, duplicate Aruka exercise, custom groups, custom categories, multiselect, advanced thumbnails, analytics.

P2: shared libraries, templates, recommendations, AI, automation and usage metrics.

## Risks

- Accidentally treating favorite as global.
- Making professional-uploaded video public for ease.
- Breaking execution history by replacing snapshots with live-only references.
- Polluting global taxonomy with free-text groups/categories.
- Loading many videos in list views.
- Copying third-party media or reference UI.

## Open Decisions

- Single media columns vs `exercise_media` table.
- Final upload size/duration limit.
- Whether `video/webm` enters P0.
- Whether student signed URLs are generated client-side through Supabase SDK or server/RPC-mediated.
- Whether initial official seed is closer to 100 or 200 exercises.

## Definition Of Done

- Library model implemented without breaking legacy workout rows.
- RLS/storage policies proven for professional, student and anonymous scenarios.
- Workout editor can add library exercises quickly.
- Student can view authorized demonstration media.
- Lint/build and focused QA pass.
- No remote production mutation occurs without explicit supervised migration/deployment authorization.

PLANNING_STATUS=PLANNED_READY_FOR_IMPLEMENTATION
IMPLEMENTATION_STARTED=YES
MIGRATION_CREATED=YES
STAGE_09_1_STATUS=COMPLETE
STAGE_09_2_STATUS=COMPLETE
STAGE_09_3_STATUS=COMPLETE
NEXT_STAGE=09.4_YOUTUBE_MEDIA_VALIDATION_PREVIEW
