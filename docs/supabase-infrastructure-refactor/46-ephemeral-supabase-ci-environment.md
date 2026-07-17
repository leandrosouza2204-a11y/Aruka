# Cycle 9 - Ephemeral Supabase CI Environment

## Project ID

CI uses an ephemeral local project ID:

`aruka_ci_${{ github.run_id }}_${{ github.run_attempt }}`

The value is local-only and must match `aruka_ci_[0-9]+_[0-9]+`.

Forbidden project IDs:

- `aruka_clean_worktree_validation`
- `aruka_cycle_8_validation`
- protected HML project ref `xrmqdkpxnfvusmenadnf`

## Local Only

The workflow runs local Docker and local Supabase CLI commands only. It does not set:

- Supabase access token
- service role key
- anon key
- remote database URL
- HML or production project ref

## Cleanup

Cleanup runs with `if: ${{ always() }}` and calls:

```powershell
npm.cmd run supabase:ci:cleanup
```

The cleanup script rejects empty IDs, wildcards and protected refs. It removes only resources matching the sanitized CI project ID and never uses global prune commands.
