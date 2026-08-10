# Clean Worktree HML CI Contract

HML means the protected `Aruka_HML` Supabase project ref used as a guardrail to prevent accidental remote/HML coupling during local and CI validation.

`scripts/test-supabase-clean-worktree.ps1` produces the clean-worktree HML preservation markers. `scripts/test-supabase-clean-worktree-wrapper.mjs` and `scripts/validate-supabase-local-reproducibility.mjs` consume them.

Expected behavior:

- LOCAL mode may preserve the HML ref, or have no local project ref, without implying remote access.
- ISOLATED_CI mode must not preserve the protected HML ref. It must run with an ephemeral `SUPABASE_PROJECT_ID`.

The failure was caused by counting an empty `supabase/.temp/project-ref` as HML preservation in every mode. The corrected contract keeps local safety behavior intact, but reports HML preservation as `false` in isolated CI when the protected ref is absent.

Final result: Gate 7, Gate 8, Gate 9, and local-safe Cycle 9.1 validation passed without production access or db push.
