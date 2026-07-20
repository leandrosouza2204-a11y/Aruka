# Cycle 9.1 - Automated GitHub Evidence

## Objective

Provide a safe, resumable automation path for collecting real GitHub Actions, artifact, cleanup, ruleset and merge-block evidence without fabricating JSONs.

## Safety Contract

- No Supabase remote access.
- No Edge Function deploy.
- No secrets written to disk.
- No direct changes to `main`.
- No PR merge.
- No global Docker prune.
- No `supabase link`, `db push`, `db pull`, `migration repair`, `functions deploy`, `secrets set`, `projects` or `branches`.
- Temporary state is written only under `tmp/cycle-9-1-github-evidence-state.json` and must not be committed.

## Commands

Dry-run preflight:

```powershell
npm.cmd run qa:supabase-cycle-9-1:github:preflight -- --dry-run
```

Real preflight:

```powershell
npm.cmd run qa:supabase-cycle-9-1:github:preflight
```

Collect a successful run:

```powershell
npm.cmd run qa:supabase-cycle-9-1:github:collect-success -- --pr 1 --branch chore/supabase-ci-runtime-validation
```

Create a controlled failure PR:

```powershell
npm.cmd run qa:supabase-cycle-9-1:github:create-failure -- --dry-run
npm.cmd run qa:supabase-cycle-9-1:github:create-failure
```

Verify required-check merge block:

```powershell
npm.cmd run qa:supabase-cycle-9-1:github:verify-block
```

Recover the temporary PR:

```powershell
npm.cmd run qa:supabase-cycle-9-1:github:recover -- --dry-run
npm.cmd run qa:supabase-cycle-9-1:github:recover
```

Validate final state:

```powershell
npm.cmd run qa:supabase-cycle-9-1
```

Cleanup the temporary PR only after review:

```powershell
npm.cmd run qa:supabase-cycle-9-1:github:cleanup-temporary-pr -- --confirm
```

## Controlled Failure Mechanism

The temporary branch adds only:

```text
.ci/force-supabase-cycle-9-1-failure
```

On pull requests, the workflow step `Cycle 9.1 controlled failure proof` prints `CYCLE_9_1_CONTROLLED_FAILURE_TRIGGERED` and exits with failure. Cleanup and artifact upload remain protected by `if: always()`.

## Evidence Files

The automation writes only through the evidence writer:

- `reports/supabase-ci-runtime/github-actions-run-result.json`
- `reports/supabase-ci-runtime/github-actions-artifacts-result.json`
- `reports/supabase-ci-runtime/github-actions-check-result.json`
- `reports/supabase-ci-runtime/branch-protection-result.json`
- `reports/supabase-ci-runtime/merge-block-negative-result.json`

Writes are atomic, stable JSON, sanitized against token-like content and include a UTC collection timestamp.

## Resume

If interrupted, inspect:

```powershell
npm.cmd run qa:supabase-cycle-9-1:github:status
```

The resumable local state is:

```text
tmp/cycle-9-1-github-evidence-state.json
```

Do not commit `tmp/`.

## Final Decision

Implementing this automation does not conclude Cycle 9.1. The cycle remains `CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED` until the real commands collect validator-approved evidence and `npm.cmd run qa:supabase-cycle-9-1` returns `GITHUB_ACTIONS_RUNTIME_AND_BRANCH_PROTECTION_VALIDATED`.
