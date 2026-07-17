# Cycle 8 - Local Seeds and Deterministic Fixtures

## Decision

Cycle 8 introduces local-only deterministic fixtures for Supabase development and QA. The expected final decision is `LOCAL_SEEDS_AND_SAFE_RESET_VALIDATED`.

## Architecture

The Supabase CLI executes `supabase/seed.sql` as a single SQL batch during local `db reset`. Because this execution mode does not support psql `\ir` includes, `supabase/seed.sql` is a safe entrypoint marker and `npm.cmd run supabase:seed:local` is the explicit orchestrator:

1. `00-cleanup.sql`
2. `10-structural-fixtures.sql`
3. `20-admin-fixtures.sql`
4. `30-student-fixtures.sql`
5. `40-workout-fixtures.sql`
6. `50-assessment-fixtures.sql`
7. `60-financial-fixtures.sql`
8. `70-aoe-fixtures.sql`
9. `90-validation-fixtures.sql`

The scripts can also reapply the same seed over an already running local database through `npm.cmd run supabase:seed:local`.

## Reserved IDs

| Entity | ID |
| --- | --- |
| Admin auth/profile | `00000000-0000-4000-8000-000000000801` |
| Personal auth/profile | `00000000-0000-4000-8000-000000000802` |
| Monthly plan | `00000000-0000-4000-8000-000000000811` |
| Quarterly plan | `00000000-0000-4000-8000-000000000812` |
| Archived plan | `00000000-0000-4000-8000-000000000813` |
| Active student | `00000000-0000-4000-8000-000000000821` |
| Closed student | `00000000-0000-4000-8000-000000000822` |
| Pending student | `00000000-0000-4000-8000-000000000823` |
| AOE records | `cycle8-*` |

## Fixture Domains

- Admin and personal profiles.
- Three students: active, closed and pending.
- Three plans: active monthly, active quarterly and inactive.
- Workout, workout day, exercises and workout template.
- Assessment and anamnese.
- Subscription and payments.
- Follow-up events.
- AOE decisions, traces, human reviews, idempotency and audit.

## Privacy Rules

- Emails use `example.invalid`.
- Names are explicitly fictitious.
- Phones use reserved local placeholders.
- No CPF, address, production URL, token, key or real payment credential is stored.
- Storage is represented by placeholder paths only; no upload is performed.

## Commands

```powershell
npm.cmd run supabase:seed:local
npm.cmd run supabase:fixtures:validate
npm.cmd run qa:supabase-seeds-negative
```
