# Required validation remote runtime plan

This plan must be executed only after technical review. No commit, push, pull
request or merge is performed by this cycle.

## Validation sequence

1. Review the local diff.
2. Confirm only the expected workflow, documentation and report files changed.
3. Run final local validations.
4. Stage only the approved files.
5. Inspect the staged diff.
6. Commit with:

   ```bash
   git commit -m "ci: garante check obrigatorio em todos os pull requests"
   ```

7. Push `ci/required-validation-all-prs`.
8. Create a pull request to `main`.
9. Confirm `Supabase Local Quality Gates` starts for the PR.
10. Confirm the published required check is named exactly `validation`.
11. Confirm this infrastructure PR runs the full Supabase gates because it
    changes `.github/workflows/supabase-local-quality-gates.yml`.
12. Confirm cleanup runs with `if: always()` when the heavy gates execute.
13. Confirm evidence upload runs with `if: always()` when the heavy gates
    execute.
14. Merge only after all checks pass and review is approved.
15. Update local `main`.
16. Update the blocked documentation branch/PR.
17. Confirm the documentation PR now starts the workflow.
18. Confirm the documentation PR reports `supabase_relevant=false`.
19. Confirm the documentation PR runs lightweight validation only.
20. Confirm the `validation` check is published and does not remain `Expected`.
21. Merge the documentation PR only after approval and check success.

## Expected remote proof

- Infrastructure PR: `validation` appears and runs full Supabase gates.
- PR #8 run `29796367085` failed in Gate 9 because the static validator still
  required literal `if: ${{ always() }}` for cleanup and artifact upload. The
  next push must prove the validator accepts the composed
  `${{ always() && steps.detect_changes.outputs.supabase_relevant == 'true' }}`
  condition while still rejecting unsafe variants.
- Documentation PR: `validation` appears and skips heavy Supabase gates with a
  summary reason.
- No duplicate `validation` check appears.
- Ruleset `Protect main` remains unchanged.

## Rollback plan

If the workflow is invalid or the remote run fails due to this change, revert
the workflow commit. Do not remove or weaken the required `validation` check in
the ruleset.
