# Canonical Local CI Harness

Production remains a six-migration chain in `supabase/migrations/`. The historical baseline is reference-only at `supabase/reference-baselines/20260716090000_baseline_aruka_v1.sql` and keeps SHA-256 `67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B`.

Fresh local and CI databases use an ephemeral chain: reference baseline first, then the six executable migrations. This gives a seven-entry local history without changing production or making the baseline executable in the repository.

The canonical implementation is `scripts/lib/supabase-local-environment.mjs`. It validates the baseline, validates the six executable migrations, assembles a temporary Supabase workdir, and removes it after `supabase start` or `supabase db reset`.

Fresh database entrypoints now consume the same implementation through `scripts/supabase-local-bootstrap-canonical.mjs`, `scripts/supabase-cycle-8-lib.mjs`, `scripts/reset-supabase-local-safe.mjs`, and the clean-worktree overlay. Seeds run only after that canonical bootstrap/reset contract is satisfied.

Before push, run `npm.cmd run qa:supabase-ci-full-local` twice with cleanup between runs. The required local rule is `LOCAL_FULL_CI_PARITY=PASS_X2`.
