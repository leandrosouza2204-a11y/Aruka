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
