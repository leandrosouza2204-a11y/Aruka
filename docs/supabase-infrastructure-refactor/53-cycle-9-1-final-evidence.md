# Cycle 9.1 - Final Evidence

## Current Decision

`CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED`

This is the decision returned by `npm.cmd run qa:supabase-cycle-9-1` after reviewing `scripts/validate-supabase-cycle-9-1.mjs`.

## Pending Values

- Branch: `main`
- HEAD at preparation: `f6c1a193572e8b0a5d8841c018a18e062d433455`
- Commit for Cycle 9: `f6c1a19 ci: add supabase local quality gates`
- PR used: `#1`
- Run ID: `PENDING_RUNTIME_EVIDENCE`
- Run URL: `PENDING_RUNTIME_EVIDENCE`
- Workflow: `Supabase Local Quality Gates`
- Job: `validation`
- Real check: `Supabase Local Quality Gates / validation (pull_request)`
- Runner: `ubuntu-latest`
- Node: `22`
- Supabase CLI: `2.109.1`
- Artifact names: reported generated successfully; versioned artifact validation JSON still `NOT_EXECUTED`
- Branch protection: reported ruleset `Protect main` active; versioned branch protection JSON still manual-validation-required
- Merge block negative test: `NOT_EXECUTED` in versioned JSON
- Baseline SHA: `F7C580FD9677D4E2C6F28E2944CBA75BC17D0F88528F1372BFD3F1C0DC04000A`
- Protected HML Project Ref: `xrmqdkpxnfvusmenadnf`

## Initial Runtime Failure

The first GitHub Actions run for PR #1 failed in check `validation` with `Official baseline SHA mismatch`.

The failure was caused by hashing a non-canonical line-ending representation: Git blob and Linux runner use LF, while the Windows working tree had mixed endings. There was no semantic SQL change. The old unstable working-tree SHA was `745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE`; the active official canonical LF SHA is `F7C580FD9677D4E2C6F28E2944CBA75BC17D0F88528F1372BFD3F1C0DC04000A`.

Cycle 9.1 remains incomplete and main branch protection has not been configured.

## Gate 3 Runtime Failure

After the SHA correction, PR #1 passed Gates 1 and 2 and then failed Gate 3 in `npm run supabase:preflight` with `PREFLIGHT_FAILED`.

The failure was caused by local preflight requirements leaking into isolated CI: the script required HML-linked state even though the workflow uses `SUPABASE_CI_LOCAL_ONLY=true` and an ephemeral `SUPABASE_PROJECT_ID`. Isolated CI must not be linked to HML and must not require `supabase/.temp/project-ref` before bootstrap.

The correction separates `local` and `isolated_ci`, keeps the local HML guardrail intact, validates the CI project ID/config pairing, rejects protected HML refs in CI, validates Docker context by mode and prints detailed errors to the GitHub Actions log. No remote Supabase access or Edge Function deploy was performed.

## Gate 7 Runtime Failure

After the preflight correction, PR #1 reached Gate 7 and failed clean worktree validation because the assertion still required `HML Project Ref preserved: true`.

In isolated CI the expected state is `HML Project Ref preserved: false`; the artifact also showed `Primary error: none` and `Cleanup errors: none`. The correction added explicit `LOCAL` and `ISOLATED_CI` modes and reports `expected_hml_preservation`, `actual_hml_preservation`, and `assertion_passed`.

## Final Reported Runtime

- Pull Request: #1.
- Branch: `chore/supabase-ci-runtime-validation`.
- Workflow: `Supabase Local Quality Gates`.
- Check: `Supabase Local Quality Gates / validation (pull_request)`.
- Final reported conclusion: success.
- Artifact: generated successfully.
- Cycle 9 evidence: `CI_QUALITY_GATES_VALIDATED`.
- Cleanup: `CI_CLEANUP_VALIDATED`.
- Negative tests: 40/40.
- Required check: `validation`.
- Main ruleset: `Protect main`, active.
- Force pushes: blocked.
- Branch deletion: blocked.
- Pull request before merge: required.
- Remote access performed: no.
- Edge Functions deployed: no.
- PR merge: not performed by this process.

## Validator Contract

`scripts/validate-supabase-cycle-9-1.mjs` requires all of the following for final approval:

- `github-actions-run-result.json`: `GITHUB_ACTIONS_RUN_COLLECTED` with conclusion `success`.
- `github-actions-artifacts-result.json`: `GITHUB_ACTIONS_ARTIFACTS_VALIDATED`.
- `github-actions-check-result.json`: `GITHUB_ACTIONS_CLEANUP_VALIDATED`.
- `branch-protection-result.json`: nested validation result `BRANCH_PROTECTION_VALIDATED`.
- `merge-block-negative-result.json`: `MERGE_BLOCK_NEGATIVE_VALIDATED`.

Current versioned evidence does not satisfy this contract. The final validator returned `CYCLE_9_1_RUNTIME_EVIDENCE_REQUIRED` with primary error `Real successful GitHub Actions run missing`.

## Final Decision Gate

Do not replace this state with `GITHUB_ACTIONS_RUNTIME_AND_BRANCH_PROTECTION_VALIDATED` until the real GitHub Actions run, artifacts, cleanup, branch protection and merge block evidence are all validated.
