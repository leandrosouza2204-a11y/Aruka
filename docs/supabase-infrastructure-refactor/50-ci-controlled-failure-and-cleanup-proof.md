# Cycle 9.1 - Controlled Failure and Cleanup Proof

## Objective

Prove that cleanup runs when an earlier CI step fails.

## Rule

The failure mutation must live only in a temporary branch and must never be merged.

## Alternative A - Temporary Branch

1. Create a temporary branch from `main`.
2. Add a temporary documentation-only or CI-only failure marker.
3. Push the branch and open a PR.
4. Confirm the workflow fails before completion.
5. Confirm the `Cleanup` step still runs.
6. Download artifacts.
7. Revert the failure mutation.
8. Re-run the workflow and confirm success.

## Alternative B - Invalid Artifact Test

1. Use a temporary branch.
2. Add an isolated invalid artifact condition.
3. Confirm evidence validation fails.
4. Confirm cleanup still executes.
5. Remove the mutation before any merge.

## Expected Result

Cleanup evidence must show `CI_CLEANUP_VALIDATED` or an equivalent successful cleanup result even when the main validation fails.

## Observed Cycle 9.1 Failures

The PR #1 runtime validation produced real intermediate failures while the pipeline was being hardened:

- Baseline SHA mismatch caused by non-canonical Windows line endings.
- Gate 3 `PREFLIGHT_FAILED` caused by local HML requirements in isolated CI.
- Gate 7 clean worktree assertion mismatch: isolated CI correctly did not preserve the HML project ref.

For the final reported successful run, cleanup was reported as `CI_CLEANUP_VALIDATED`; remote access performed: no; Edge Functions deployed: no. The workflow cleanup path uses scoped cleanup and does not use global Docker prune.

The repository does not yet contain a post-ruleset controlled failing run proving merge block while the required check is failing. Current state:

`PENDING_CONTROLLED_FAILURE_MERGE_BLOCK_PROOF`

Do not claim `MERGE_BLOCKED_BY_FAILED_REQUIRED_CHECK_VALIDATED` until that proof is collected and represented in `reports/supabase-ci-runtime/merge-block-negative-result.json` or an equivalent validator-approved evidence file.
