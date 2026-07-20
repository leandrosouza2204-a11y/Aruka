# Cycle 9.1 - GitHub Actions Runtime Evidence

## Objective

Collect real, read-only evidence from the GitHub Actions execution of `Supabase Local Quality Gates`.

## Current State

Validator state: `CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED`.

Initial GitHub Actions execution for PR #1 failed in check `validation` with primary error `Official baseline SHA mismatch`.

Confirmed cause: the official SHA had been calculated from a Windows working tree representation with mixed line endings, while the Git blob and the Linux runner use LF. The baseline SQL had no semantic change. The active canonical LF SHA is `F7C580FD9677D4E2C6F28E2944CBA75BC17D0F88528F1372BFD3F1C0DC04000A`; the historical unstable Windows working-tree SHA was `745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE`.

Correction: baseline identity validation normalizes UTF-8 text to LF before SHA-256 and `.gitattributes` pins the active baseline to LF.

Second GitHub Actions execution after the SHA correction passed Gates 1 and 2, then failed Gate 3 during `npm run supabase:preflight` with `PREFLIGHT_FAILED`.

Confirmed cause: the preflight script still enforced local HML-linked state during isolated CI. The workflow runs with `SUPABASE_CI_LOCAL_ONLY=true` and an ephemeral `SUPABASE_PROJECT_ID`, so it must not require `supabase/.temp/project-ref` to exist before bootstrap and must not require the protected HML ref.

Correction: preflight now separates `local` and `isolated_ci` modes, validates the ephemeral CI project ID against `supabase/config.toml`, keeps protected HML refs forbidden in CI, validates Docker context per mode, and emits detailed `::error::` messages in GitHub Actions logs. No remote Supabase access or Edge Function deploy was performed.

Third GitHub Actions execution then failed Gate 7 because clean worktree validation still expected `HML Project Ref preserved: true` in isolated CI. The artifact showed `HML Project Ref preserved: False`, `Primary error: none`, and `Cleanup errors: none`, so the operational failure was the assertion, not cleanup/bootstrap behavior.

Correction: clean worktree validation now separates `LOCAL` and `ISOLATED_CI`, expects HML preservation only in local mode, expects no HML preservation in isolated CI, and reports `mode`, `expected_hml_preservation`, `actual_hml_preservation`, and `assertion_passed`.

Final operational evidence reported for PR #1: branch `chore/supabase-ci-runtime-validation`, event `pull_request`, workflow `Supabase Local Quality Gates`, job/check `Supabase Local Quality Gates / validation (pull_request)`, conclusion `success`, artifact generated, `CI_QUALITY_GATES_VALIDATED`, `CI_CLEANUP_VALIDATED`, 40/40 negative tests, remote access performed: no, Edge Functions deployed: no.

Repository validator caveat: the versioned reports still show `github-actions-run-result.json` as `MANUAL_COLLECTION_REQUIRED`, artifacts/cleanup as `NOT_EXECUTED`, branch protection as manual validation required, and merge-block negative as `NOT_EXECUTED`. Therefore `npm.cmd run qa:supabase-cycle-9-1 -- --final` still returns `CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED`.

## Runtime History

1. Initial failure: baseline SHA depended on non-canonical line endings.
2. Gate 3 failure: local preflight required HML state in isolated CI.
3. Gate 7 failure: clean worktree expected HML preservation in isolated CI.
4. Final reported execution: workflow success with artifact, cleanup and required check passing.

Final automated approval still requires the JSON evidence expected by `scripts/validate-supabase-cycle-9-1.mjs`, including merge-block negative evidence.

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
- Required check is configured for `validation`.
- Merge-block negative proof is recorded, if required by the validator.
