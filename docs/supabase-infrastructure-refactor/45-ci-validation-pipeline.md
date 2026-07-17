# Cycle 9 - CI Validation Pipeline

## Decision

Expected decision: `CI_QUALITY_GATES_VALIDATED`.

## Workflow

Main workflow:

`/.github/workflows/supabase-local-quality-gates.yml`

Events:

- `pull_request` to `main`
- `push` to `main` for infrastructure paths
- `workflow_dispatch`

The workflow intentionally does not use `pull_request_target`, schedules, remote previews or deployment steps.

## Gates

1. Repository Safety
2. Static Validation
3. Supabase Local Bootstrap
4. Deterministic Seeds
5. Safe Reset
6. Negative Security Tests
7. Regression Suite
8. Evidence Validation
9. Cleanup Verification

## Runtime

- Runner: `ubuntu-latest`
- Node: `22`
- Supabase CLI: `2.109.1`
- Permissions: `contents: read`
- Artifact retention: 7 days
- Timeout: 40 minutes

No remote Supabase authentication is configured.

## Commands

```powershell
npm.cmd run qa:supabase-ci-static
npm.cmd run qa:supabase-ci-negative
npm.cmd run qa:supabase-ci-evidence
npm.cmd run qa:supabase-cycle-9
```
