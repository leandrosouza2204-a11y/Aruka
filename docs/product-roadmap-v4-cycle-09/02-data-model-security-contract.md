# Cycle 09.1 - Data model and security contract

## Entities

### `public.exercise_library`

- PK: `id uuid`.
- Owner: `owner_id uuid null references auth.users(id) on delete cascade`.
- Origin: `origin text` with values `official` or `personal`.
- Required display: `name text`.
- Search/filter fields: `muscle_group text`, `category text`, `status text`.
- Content fields: `description text`, `instructions text`, `youtube_url text`, `metadata jsonb`.
- Media fields: `media_type text`, `media_path text`, `thumbnail_path text`, `media_mime_type text`.
- Lifecycle: `status in ('active', 'archived')`, `archived_at`, `created_at`, `updated_at`.

Constraints:

- Official exercises require `owner_id is null`.
- Personal exercises require `owner_id is not null`.
- `name` must not be blank.
- `metadata` must be a JSON object.
- Uploaded media MIME is limited to `video/mp4`, `video/webm`, `video/quicktime`.

### `public.exercise_favorites`

- PK: `id uuid`.
- FK: `professional_id references auth.users(id) on delete cascade`.
- FK: `exercise_id references public.exercise_library(id) on delete cascade`.
- Unique: `(professional_id, exercise_id)`.

### `public.treino_exercicios`

- Adds nullable `exercise_id uuid references public.exercise_library(id) on delete set null`.
- Existing snapshot columns remain unchanged and continue to preserve historical prescriptions.

## Indexes

- `exercise_library_origin_status_name_idx` for system library listing.
- `exercise_library_owner_status_name_idx` for professional custom listing.
- `exercise_library_muscle_category_idx` for active filter views.
- `exercise_favorites_professional_idx` for favorites listing.
- `treino_exercicios_exercise_id_idx` for prescribed-library lookup.

## RLS and grants

- `exercise_library` and `exercise_favorites` have RLS enabled.
- `anon` has no table grants.
- `authenticated` can select/insert/update/delete `exercise_library`, constrained by RLS.
- `authenticated` can select/insert/delete `exercise_favorites`, constrained by RLS.
- Hard delete from `exercise_library` is denied by policy; archive is represented by status update for owned personal exercises.
- Personal exercise writes require an active professional profile (`perfis.role = 'user'`) and are denied to student profiles.
- `public.exercise_is_prescribed_to_current_student(uuid)` is `SECURITY DEFINER`, has `search_path = public`, receives only an exercise id, validates `auth.uid()` internally, and is executable only by `authenticated` and `service_role`.

## Storage

- Bucket: `exercise-media`.
- Visibility: private.
- Limit: 100 MiB.
- MIME: `video/mp4`, `video/webm`, `video/quicktime`, `image/jpeg`, `image/png`, `image/webp`.
- Path convention: first path segment is the professional auth user id.
- Student read is allowed only when the object path is referenced by an exercise prescribed in the student's active or completed workout.

## Compatibility

- Existing workouts, templates and execution snapshots do not require `exercise_id`.
- Templates can continue to use JSON snapshots until a later integration stage.
- No finance, billing, UI, or Auth redesign is part of 09.1.

## Promotion Policy

- Local Docker Supabase is the validation/homologation environment.
- `Aruka_HML` is a legacy inactive environment and is not used by Cycle 09.1.
- Production promotion targets only `aruka` (`vrize...vdik`) and is protected by exact project-ref validation before migration list, dry-run and push.
