# Seed/catalog - Implementation

Stage 09.8 adds the first official Aruka exercise catalog.

## Strategy

- Catalog source: `supabase/migrations/20260907150000_exercise_official_catalog_v1.sql`.
- Strategy: migration-based seed.
- Official count: 30 exercises.
- IDs: fixed UUIDs in the `00000000-0000-4000-8000-0000000908xx` range.
- Idempotency: `on conflict (id) do update`, scoped to existing official rows.
- Owner: `owner_id = null`.
- Origin: `official`.
- Status: `active`.
- Media: no third-party media seeded.
- Metadata: `{"catalog":"aruka_official_v1","version":"09.8"}`.

## Taxonomy

Muscle groups covered: Peitoral, Costas, Ombros, Biceps, Triceps, Quadriceps, Posteriores, Gluteos, Panturrilhas, Core and Corpo inteiro.

Categories covered: Musculacao, Funcional, Em casa, Aerobico and Mobilidade.

## Evolution

Future official copy updates may update the official row by deterministic `id`. Existing workout snapshots remain protected by the 09.6 snapshot contract and are not rewritten by catalog updates.
