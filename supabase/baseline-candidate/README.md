# Aruka Supabase Baseline Candidate

This directory contains the consolidated baseline candidate for Ciclo 5.

It is not an active migration and must not be copied to `supabase/migrations/` before Ciclo 6 - Migration Cutover.

## Files

- `20260716090000_baseline_aruka_v1.sql`: consolidated candidate SQL.
- `manifest.json`: expected object counts and hashes.

## Difference Between Directories

- `supabase/baseline-src/`: reviewed fragments split by responsibility.
- `supabase/baseline-candidate/`: single consolidated candidate generated from `baseline-src`.
- `supabase/migrations/`: active historical migration chain. The candidate is intentionally not there yet.

## Validation

Static validation:

```bash
npm.cmd run qa:supabase-baseline-candidate
```

SHA256:

```powershell
Get-FileHash supabase/baseline-candidate/20260716090000_baseline_aruka_v1.sql -Algorithm SHA256
```

Local SQL validation should use a disposable local Supabase/Postgres environment only. Do not run this candidate against HML or production.

## Promotion Preconditions

Before Ciclo 6, confirm:

- local SQL validation succeeds;
- Storage runtime verification is completed or explicitly accepted;
- cutover runbook prevents applying the candidate on top of historical migrations;
- no secrets or real data are present.

After cutover approval, this candidate may be converted into the official baseline migration.
