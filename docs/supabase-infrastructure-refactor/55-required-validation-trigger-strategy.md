# Cycle 9.2 - Required validation trigger strategy

## Context

The `Protect main` ruleset requires the status check named `validation`.
The check is published by `.github/workflows/supabase-local-quality-gates.yml`
through the job:

- job id: `validation`
- published job name: `validation`

## Root cause

The previous workflow used `paths` on the `pull_request` event. Pull requests
that changed files outside those paths did not start the workflow at all. When
the workflow did not start, GitHub could not publish the required check and the
PR stayed blocked in `Expected - Waiting for status to be reported`.

Required checks must not depend on event-level path filters. If a required
workflow is skipped before job creation, the required check remains absent.

## Adopted architecture

The workflow now starts for every pull request targeting `main`:

- `pull_request` to `main`: no `paths` and no `paths-ignore`
- `push` to `main`: keeps the infrastructure path filter
- `workflow_dispatch`: always available and treated as Supabase-relevant

The workflow keeps a single required job:

- `validation`

The job performs internal change detection, runs lightweight validation for all
PRs, and runs the Supabase gates only when relevant files are detected.

## Relevant files

The Supabase gates run when at least one changed file matches:

- `supabase/**`
- `scripts/**`
- `package.json`
- `package-lock.json`
- `.github/workflows/supabase-local-quality-gates.yml`
- `.ci/**`
- `docs/supabase-infrastructure-refactor/**`
- `reports/supabase-local-bootstrap/**`
- `reports/supabase-local-seeds/**`

`workflow_dispatch` is intentionally treated as relevant and runs the full
suite.

## Lightweight validation

Every PR runs a real validation before the optional heavy gates:

- deterministic dependency install with `npm ci`
- whitespace/diff validation with `git diff --check` or `git diff-tree --check`
- `npm run lint`
- `npm run build`

This is not an unconditional success path. Documentation-only and frontend PRs
can still fail the required check if repository validation fails.

## Heavy Supabase gates

When `supabase_relevant=true`, the workflow preserves the existing sequence:

1. Docker diagnostics
2. Supabase CLI version check
3. Ephemeral project configuration
4. Gate 1 and 2 - repository safety and static validation
5. Gate 3 - local bootstrap
6. Gate 4 - deterministic seeds
7. Gate 5 - safe reset
8. Gate 6 - negative security tests
9. Gate 7 - regression suite
10. Gate 8 - evidence validation
11. Gate 9 - consolidated quality gates
12. Cycle 9.1 controlled failure proof

Failures are not converted to warnings and `continue-on-error` is not used.

## Event behavior

| Event | Behavior |
|---|---|
| PR documentation-only | Workflow starts, lightweight validation runs, Supabase gates are skipped, `validation` is published. |
| PR frontend-only | Workflow starts, lightweight validation runs, Supabase gates are skipped unless another relevant file changed, `validation` is published. |
| PR Supabase/CI | Workflow starts, lightweight validation and full Supabase gates run. |
| Push to `main` | Path filter remains limited to Supabase/CI infrastructure paths. |
| `workflow_dispatch` | Full Supabase gates run. |

## Concurrency

The concurrency group includes workflow, event name and PR number/ref:

`supabase-local-quality-gates-${{ github.workflow }}-${{ github.event_name }}-${{ github.event.pull_request.number || github.ref }}`

This allows a new run for the same PR to cancel an older run while preventing
different PRs, pushes and manual runs from cancelling one another incorrectly.

## Cleanup and evidence

Cleanup remains scoped to the Supabase-heavy path and runs with `if: always()`
when the heavy gates ran. Evidence upload also remains `if: always()` for the
heavy path and keeps the existing artifact retention.

For non-relevant PRs, the summary records that Supabase gates were skipped
because no relevant files were detected.

## Gate 9 validator compatibility

The first required-validation PR run exposed a static validator false negative:
Gate 9 still expected cleanup and evidence upload to match `if: ${{ always() }}`
literally. Cycle 9.2 now uses the safer composed condition
`${{ always() && steps.detect_changes.outputs.supabase_relevant == 'true' }}`.

The Cycle 9 validator now checks the condition semantically. Cleanup and
artifact upload must include a real `always()` call and must also require
`steps.detect_changes.outputs.supabase_relevant == 'true'`. Unsafe variants
that remove either requirement, use a different output, reintroduce
`continue-on-error`, rename the `validation` job, or add `paths` back to
`pull_request` continue to fail.

## Diagnosing an Expected check

If a PR shows `Expected - Waiting for status to be reported` for `validation`:

1. Confirm the PR targets `main`.
2. Confirm the workflow file exists on the branch.
3. Confirm the `pull_request` event has no `paths` or `paths-ignore`.
4. Confirm the workflow run exists for the PR.
5. Confirm the published job name is exactly `validation`.
6. Check whether the run was cancelled by concurrency and replaced by a newer run.

## Remote validation plan

After technical review:

1. Commit this infrastructure change.
2. Push `ci/required-validation-all-prs`.
3. Open a PR to `main`.
4. Confirm `Supabase Local Quality Gates` starts.
5. Confirm the required check is named exactly `validation`.
6. Confirm this PR executes the heavy gates because it changes the workflow.
7. Merge only after success.
8. Update the blocked documentation PR and confirm it now receives `validation`
   while skipping heavy Supabase gates.

## Safe rollback

Rollback by reverting this workflow change. Do not remove the required check
from the ruleset. If rollback is necessary, expect documentation-only PRs to
return to the previous `Expected` failure until a replacement strategy is
merged.

## Known risks and mitigations

- Required check absent: mitigated by removing PR path filters.
- Duplicate `validation` checks: avoided by keeping a single job.
- False negative in file detection: mitigated by full checkout and explicit
  base/head SHA comparison.
- Heavy gates skipped unexpectedly: workflow and package files remain relevant.
- Cleanup skipped for heavy runs: preserved with `if: always()`.
- Excessive CI cost: heavy Docker/Supabase gates run only for relevant files.

## Documentation-only PR validation

This section records the validation of the lightweight pull request path.

For a pull request containing documentation changes only, the required
alidation check must still be published. Supabase-heavy gates must be
skipped because no relevant infrastructure files were changed.

Expected result:

- the alidation status is reported;
- the required check completes successfully;
- the workflow records that Supabase gates were skipped;
- no duplicate alidation check is created.
