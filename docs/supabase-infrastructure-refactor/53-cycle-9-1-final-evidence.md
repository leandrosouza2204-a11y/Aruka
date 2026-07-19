# Cycle 9.1 - Final Evidence

## Current Decision

`PENDING_RUNTIME_EVIDENCE`

## Pending Values

- Branch: `main`
- HEAD at preparation: `f6c1a193572e8b0a5d8841c018a18e062d433455`
- Commit for Cycle 9: `f6c1a19 ci: add supabase local quality gates`
- PR used: `PENDING_RUNTIME_EVIDENCE`
- Run ID: `PENDING_RUNTIME_EVIDENCE`
- Run URL: `PENDING_RUNTIME_EVIDENCE`
- Workflow: `Supabase Local Quality Gates`
- Job: `validation`
- Real check: `PENDING_RUNTIME_EVIDENCE`
- Runner: `ubuntu-latest`
- Node: `22`
- Supabase CLI: `2.109.1`
- Artifact names: `PENDING_RUNTIME_EVIDENCE`
- Branch protection: `PENDING_RUNTIME_EVIDENCE`
- Merge block negative test: `PENDING_RUNTIME_EVIDENCE`
- Baseline SHA: `F7C580FD9677D4E2C6F28E2944CBA75BC17D0F88528F1372BFD3F1C0DC04000A`
- Protected HML Project Ref: `xrmqdkpxnfvusmenadnf`

## Initial Runtime Failure

The first GitHub Actions run for PR #1 failed in check `validation` with `Official baseline SHA mismatch`.

The failure was caused by hashing a non-canonical line-ending representation: Git blob and Linux runner use LF, while the Windows working tree had mixed endings. There was no semantic SQL change. The old unstable working-tree SHA was `745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE`; the active official canonical LF SHA is `F7C580FD9677D4E2C6F28E2944CBA75BC17D0F88528F1372BFD3F1C0DC04000A`.

Cycle 9.1 remains incomplete and main branch protection has not been configured.

## Final Decision Gate

Do not replace this state with `GITHUB_ACTIONS_RUNTIME_AND_BRANCH_PROTECTION_VALIDATED` until the real GitHub Actions run, artifacts, cleanup, branch protection and merge block evidence are all validated.
