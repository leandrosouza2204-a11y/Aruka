# Cycle 9.1 - GitHub Actions Runtime Evidence

## Objective

Collect real, read-only evidence from the GitHub Actions execution of `Supabase Local Quality Gates`.

## Current State

Preparation state: `CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED`.

Final approval requires a real run with conclusion `success`, downloaded artifacts, cleanup evidence, branch protection evidence and merge-block validation.

## Manual Runtime Procedure

```powershell
git switch main
git pull --ff-only origin main
git switch -c chore/supabase-ci-runtime-validation
```

Make a safe documentation-only change in Cycle 9.1 docs, then review and commit manually:

```powershell
git add <cycle-9-1-files>
git diff --cached --check
git diff --cached --name-status
git diff --cached --stat
git commit -m "ci: prepare github actions runtime validation"
git push -u origin chore/supabase-ci-runtime-validation
```

Open a PR to `main` manually and wait for the workflow.

## Read-Only Collection

```powershell
npm.cmd run supabase:ci:collect-runtime -- --run-id=<RUN_ID>
npm.cmd run supabase:ci:download-artifacts -- --run-id=<RUN_ID>
npm.cmd run qa:supabase-ci-runtime-artifacts
npm.cmd run qa:supabase-ci-runtime-cleanup
```

Allowed `gh` commands are read-only: `gh run list`, `gh run view`, `gh run download`, `gh pr checks`, and `gh api` GET.

## Approval Criteria

- Workflow conclusion is `success`.
- Job `validation` conclusion is `success`.
- Real check name is recorded.
- Artifacts validate without secrets.
- Cleanup is proven.
- No remote Supabase environment is accessed.
