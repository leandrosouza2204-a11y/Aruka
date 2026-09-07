# Seed/catalog - Closeout

Stage 09.8 is complete.

## Objective

Expand the official controlled exercise catalog with licensed or owned seed content after schema, workout integration and student media authorization are stable.

## Catalog

- Strategy: migration-based official catalog seed.
- Source: `supabase/migrations/20260907150000_exercise_official_catalog_v1.sql`.
- Official exercises: 30.
- IDs: deterministic fixed UUIDs.
- Origin: `official`.
- Owner: `owner_id = null`.
- Status: `active`.
- Media: no third-party media seeded.
- Fixtures: local QA/test fixtures remain separate from the official catalog.

## Validation

- Idempotency: PASS.
- Reproducibility: PASS, including two safe resets and rerun validation before merge.
- Personal preservation: PASS.
- Local reset, bootstrap, validate, local drift and RLS runtime: PASS.
- Catalog QA, seed runtime QA and catalog quality QA: PASS.
- Regressions 09.2 through 09.7: PASS.
- Unit tests: PASS, 29 tests.
- Lint: PASS.
- Build: PASS.
- Functional PR checks: PASS.

## Supabase

- SUPABASE CHANGE: YES.
- Project: `aruka / vrize...vdik`.
- Migration: `20260907150000_exercise_official_catalog_v1.sql`.
- DB push: PASS.
- Post-push migration list: ALIGNED.
- Post-push dry-run: REMOTE DATABASE UP TO DATE.
- Remote catalog verification: PARTIALLY_VERIFIED through applied migration registry, post-push dry-run alignment, local deterministic/runtime validation and reproducibility QA. Direct remote catalog row SELECT was not executed because current tooling has no narrow read-only production query runner and a broad production data dump would be excessive.
- Production action required: NO.

## GitHub

- Functional PR: #75.
- Functional merge commit: `30ae3bd3f535f0801c19207ac5d4fc5dc4b3c8c9`.

## Limitations

- The initial catalog is intentionally small and representative, not the future 100-200 exercise catalog described as a broader P0 direction.
- Official media remains empty until Aruka has produced, licensed or explicitly authorized media assets.
- Remote catalog direct row read remains partially verified for this stage because no dedicated safe read-only runner exists.

## Next Stage

NEXT_STAGE_NUMBER: 09.9

NEXT_STAGE_TITLE: Mobile/PWA QA and stabilization

NEXT_STAGE_OBJECTIVE: run the mobile/PWA stabilization sweep for upload, preview and student viewing across the exercise library and media experience.

NEXT_STAGE_DEPENDENCIES: 09.1 data model/security, 09.2 read experience, 09.3 personal CRUD, 09.4 YouTube media, 09.5 uploaded video/storage, 09.6 workout integration, 09.7 student media experience, 09.8 seed/catalog.

NEXT_STAGE_RECOMMENDED_BRANCH: `feat/product-roadmap-v4-cycle-09-9-mobile-pwa-qa`
