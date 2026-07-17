# Cycle 9 - Pull Request Quality Gates

## Required Checks

Recommended manual branch protection checks:

- `Supabase Local Quality Gates / validation`

Branch protection must be configured manually in GitHub after the workflow is reviewed and merged. This cycle does not call GitHub APIs and does not change branch protection automatically.

## Pull Request Safety

The workflow uses `pull_request`, not `pull_request_target`, so untrusted PR code does not receive secrets. The workflow has `contents: read` only and `persist-credentials: false` on checkout.

## Artifacts

Uploaded paths:

- `reports/supabase-ci/**`
- `reports/supabase-local-bootstrap/**`
- `reports/supabase-local-seeds/**`

Excluded by design:

- `.env`
- `supabase/.temp`
- `node_modules`
- Docker state
- dumps
- keys
- tokens

## Local Equivalent

Local equivalent validation:

```powershell
npm.cmd run qa:supabase-cycle-9-local
```

This validates the semantic workflow gates and reports without pushing to GitHub.
