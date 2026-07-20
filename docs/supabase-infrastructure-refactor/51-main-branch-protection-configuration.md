# Cycle 9.1 - Main Branch Protection Configuration

## Reported Active Ruleset

- Ruleset: `Protect main`
- Enforcement: Active
- Target branch: `main`
- Bypass list: empty
- Require pull request before merging: enabled
- Require status checks to pass: enabled
- Required check: `validation`
- Displayed required check: `Supabase Local Quality Gates / validation (pull_request)`
- Block force pushes: enabled
- Restrict deletions: enabled

Do not record conversation resolution, branches up to date, or required approvals as enabled unless they are explicitly captured in GitHub evidence.

## Manual Path

GitHub repository settings:

Settings -> Rules -> Rulesets -> `Protect main`

## Validator State

The operational state above was reported after PR #1 validation, but the versioned `reports/supabase-ci-runtime/branch-protection-result.json` still contains `BRANCH_PROTECTION_MANUAL_VALIDATION_REQUIRED`. The final validator therefore still reports `CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED` until branch protection evidence is collected by a supported read-only mechanism or committed as validator-approved evidence.

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
