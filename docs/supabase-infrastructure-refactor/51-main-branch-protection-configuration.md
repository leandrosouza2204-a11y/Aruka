# Cycle 9.1 - Main Branch Protection Configuration

## Manual Path

GitHub repository settings:

Settings -> Branches or Rules -> Branch protection rules / Rulesets -> `main`

## Required

- Require a pull request before merging.
- Require status checks to pass before merging.
- Require branches to be up to date before merging.
- Select the real check collected from the run.
- Require conversation resolution before merging.
- Block force pushes.
- Block branch deletion.

Expected check, subject to real run confirmation:

`Supabase Local Quality Gates / validation`

## Recommended

- At least one approval.
- Dismiss stale approvals.
- Apply to administrators when operationally acceptable.
- Require linear history.
- Prevent bypass when supported by the plan.

## Validation

Run:

```powershell
npm.cmd run supabase:ci:collect-branch-protection
npm.cmd run qa:supabase-branch-protection
```
