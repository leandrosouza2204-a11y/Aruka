# Seed/catalog - Audit

Stage 09.8 audit confirmed that the existing `public.exercise_library` contract already supports an official catalog without schema expansion.

## Findings

- Official and personal exercises share `exercise_library`.
- Official rows use `origin = 'official'` and `owner_id is null`.
- Personal rows use `origin = 'personal'` and an owning professional.
- RLS allows authenticated professionals to read active official rows and own personal rows.
- RLS denies client-side mutation of official rows because insert/update policies require personal origin and matching owner.
- Local fixtures live under `supabase/seeds/**` and remain separate from the official catalog.
- Existing workout fixtures contain fake free-text exercises and are not catalog authority.
- No official exercise seed existed before 09.8.
- No frontend hardcoded list should be treated as catalog authority.

## Decision

Use a migration-based official catalog seed. The catalog must be promoted like any other production database change and must remain deterministic through fixed UUIDs and idempotent upsert by `id`.
