# Cycle 9.1 - Required Check Merge Block Validation

## Objective

Confirm that `main` cannot receive a PR while the required Supabase quality check is failing.

## Evidence A - Required Check Configured

Reported as configured for PR #1:

- Check displayed as `Supabase Local Quality Gates / validation (pull_request)`.
- Required status check: `validation`.
- Check state after final run: success.
- All checks passed.
- No conflict with `main`.

Decision: `REQUIRED_CHECK_CONFIGURED`.

## Evidence B - Merge Allowed After Required Check Success

Reported final PR state:

- Required check passed.
- Merge became available after required check success.
- PR #1 is ready for merge from the check/ruleset perspective.
- PR has not been merged by this process.

Decision: `MERGE_ALLOWED_AFTER_REQUIRED_CHECK_SUCCESS`.

## Remaining Negative Proof

The repository still has `reports/supabase-ci-runtime/merge-block-negative-result.json` with `result: NOT_EXECUTED`. A failing required-check run after ruleset activation has not been represented in validator-approved evidence.

Decision: `MERGE_BLOCK_ON_FAILED_REQUIRED_CHECK_NOT_YET_RETESTED_AFTER_RULESET_ACTIVATION`.

Do not declare `MERGE_BLOCKED_BY_FAILED_REQUIRED_CHECK_VALIDATED` until that negative proof is collected.

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
