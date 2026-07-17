# Cycle 8 - Final Evidence

## Expected Decision

`LOCAL_SEEDS_AND_SAFE_RESET_VALIDATED`

## Evidence Commands

```powershell
npm.cmd ci
npm.cmd run supabase:preflight
npm.cmd run supabase:bootstrap
npm.cmd run supabase:seed:local
npm.cmd run supabase:fixtures:validate
npm.cmd run supabase:seed:local
npm.cmd run supabase:fixtures:validate
npm.cmd run qa:supabase-safe-reset
npm.cmd run qa:supabase-seeds-negative
npm.cmd run qa:supabase-cycle-8
npm.cmd run qa:supabase-local-reproducibility
npm.cmd run qa:supabase-local-negative
npm.cmd run qa:supabase-clean-worktree-wrapper
npm.cmd run supabase:stop
```

## Required Results

- `SAFE_RESET_VALIDATED`
- `DETERMINISTIC_FIXTURES_VALIDATED`
- `30/30 SEED_MUTATIONS_REJECTED`
- `LOCAL_SEEDS_AND_SAFE_RESET_VALIDATED`
- `20/20 MUTATIONS_REJECTED`
- `20/20 URL_CASES_VALIDATED`
- `LOCAL_REPRODUCIBILITY_VALIDATED`

## Baseline

Official file:

`supabase/migrations/20260716090000_baseline_aruka_v1.sql`

Official SHA256:

`745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE`

## Residual Risks

- Auth fixture rows are inserted directly only in the local database because public tables require `auth.users` foreign keys.
- Storage fixture coverage validates bucket existence and placeholder paths only; it does not upload files.
- Safe reset must remain limited to local Supabase CLI context.
