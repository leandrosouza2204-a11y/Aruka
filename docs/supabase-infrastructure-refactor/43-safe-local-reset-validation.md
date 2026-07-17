# Cycle 8 - Safe Local Reset Validation

## Scope

The safe reset flow is local-only. It validates guardrails, preserves the official baseline SHA and runs two local reset cycles through the Supabase CLI without remote flags.

## Guardrails

The Cycle 8 scripts reject:

- `--linked`
- `--project-ref`
- `--db-url`
- `supabase.co`
- `pooler.supabase.com`
- `db push`
- `db pull`
- `migration repair`
- credentialed remote PostgreSQL URLs
- JWT-like tokens
- `sb_secret_` values
- protected HML project ref in execution context

The protected HML project ref remains documented only as a protected value: `xrmqdkpxnfvusmenadnf`.

## Reset Flow

```powershell
npm.cmd run supabase:reset:safe
```

The script performs:

1. Local guardrail validation.
2. Baseline SHA validation.
3. First `supabase db reset` on local CLI context.
4. Cycle 8 seed runner load.
5. Snapshot of migration history, schema inventory and fixture totals.
6. Second local reset.
7. Second Cycle 8 seed runner load.
8. Second snapshot.
9. Semantic comparison ignoring volatile timings.
10. JSON and Markdown evidence.

## Reports

- `reports/supabase-local-seeds/safe-reset-result.json`
- `reports/supabase-local-seeds/safe-reset-summary.md`
- `reports/supabase-local-seeds/fixtures-result.json`
- `reports/supabase-local-seeds/fixtures-summary.md`
- `reports/supabase-local-seeds/negative-seeds-result.json`
- `reports/supabase-local-seeds/negative-seeds-summary.md`
- `reports/supabase-local-seeds/cycle-8-result.json`
- `reports/supabase-local-seeds/cycle-8-summary.md`

## Acceptance

The decision can be emitted only when the baseline SHA is preserved, migration history is exactly `20260716090000`, fixtures are deterministic, the second load does not duplicate records, negative tests reject all mutations and no remote access or Edge Function deploy is reported.
