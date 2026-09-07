# Seed/catalog - Validation

Stage 09.8 validation status as of 2026-09-07.

## Local

- `npm.cmd run supabase:reset:safe`: PASS.
- `npm.cmd run supabase:bootstrap`: PASS.
- `npm.cmd run supabase:validate`: PASS.
- `npm.cmd run qa:exercise-library-official-catalog`: PASS.
- `npm.cmd run qa:exercise-library-catalog-quality`: PASS.
- `npm.cmd run qa:exercise-library-seed-runtime`: PASS.
- `npm.cmd run qa:exercise-library-seed-reproducibility`: PASS.
- `npm.cmd run qa:exercise-library-local-drift`: PASS.
- `npm.cmd run qa:exercise-library-rls-runtime`: PASS.
- Unit tests for exercise library/media services and utilities: PASS, 29 tests.
- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.

## Regression

- 09.2 read experience: PASS.
- 09.3 custom exercises: PASS.
- 09.4 YouTube media: PASS.
- 09.5 video upload: PASS.
- 09.6 workout integration: PASS.
- 09.6 workout snapshot: PASS.
- 09.7 student media experience: PASS.
- 09.7 student media authorization: PASS.

## Remote

- `npx.cmd supabase migration list`: PASS; only `20260907150000` is pending.
- `npx.cmd supabase db push --dry-run`: PASS; only `20260907150000_exercise_official_catalog_v1.sql` would be pushed.
- `npx.cmd -y supabase@2.109.1 db push`: PASS; `20260907150000_exercise_official_catalog_v1.sql` applied.
- Post-push `npx.cmd -y supabase@2.109.1 migration list`: PASS; `20260907150000` aligned.
- Post-push `npx.cmd -y supabase@2.109.1 db push --dry-run`: PASS; remote database is up to date.
- Remote catalog verification: PARTIALLY_VERIFIED through applied migration registry plus post-push dry-run alignment. Direct data query was not executed because no narrow read-only remote query runner exists in the current CLI/tooling without using a broad production data dump.
