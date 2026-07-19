# Cycle 9.1 - Required Check Merge Block Validation

## Objective

Confirm that `main` cannot receive a PR while the required Supabase quality check is failing.

## Procedure

1. Open a temporary PR to `main`.
2. Confirm the real check appears as required.
3. Apply a safe temporary mutation that fails the quality gate.
4. Confirm the PR cannot be merged.
5. Record PR number, failed run ID, check name and mergeable state.
6. Revert the mutation.
7. Re-run the workflow.
8. Confirm success.
9. Confirm the merge block is removed only after the check passes.

## Prohibitions

- Do not modify migrations.
- Do not modify `src`.
- Do not modify Edge Functions.
- Do not use secrets.
- Do not merge the failure mutation.
