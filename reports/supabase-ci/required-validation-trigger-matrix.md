# Required validation trigger matrix

## Decision

The required `validation` check is published by a single job in
`.github/workflows/supabase-local-quality-gates.yml`. Pull requests to `main`
always start the workflow. Supabase gates run only when the internal detector
marks the change set as relevant.

| Scenario | Workflow starts | Lightweight validation | Supabase gates | Check `validation` |
|---|---:|---:|---:|---:|
| PR `docs/product-audit-v1/**` | Yes | Yes | No | Published |
| PR `reports/product-audit-v1/**` | Yes | Yes | No | Published |
| PR other documentation | Yes | Yes | No | Published |
| PR `src/**` | Yes | Yes | No, unless another relevant file changed | Published |
| PR `public/**` | Yes | Yes | No, unless another relevant file changed | Published |
| PR `supabase/**` | Yes | Yes | Yes | Published |
| PR `scripts/**` | Yes | Yes | Yes | Published |
| PR `package.json` | Yes | Yes | Yes | Published |
| PR `package-lock.json` | Yes | Yes | Yes | Published |
| PR `.github/workflows/supabase-local-quality-gates.yml` | Yes | Yes | Yes | Published |
| PR `.ci/**` | Yes | Yes | Yes | Published |
| PR `docs/supabase-infrastructure-refactor/**` | Yes | Yes | Yes | Published |
| PR `reports/supabase-local-bootstrap/**` | Yes | Yes | Yes | Published |
| PR `reports/supabase-local-seeds/**` | Yes | Yes | Yes | Published |
| Push `main` relevant paths | Yes, by push path policy | Yes | Yes | Published |
| Push `main` non-relevant paths | No, by push path policy | No | No | Not applicable to PR required check |
| `workflow_dispatch` | Yes | Yes | Yes | Published |

## Detection tests

| Controlled file list | Expected `supabase_relevant` |
|---|---:|
| `docs/product-audit-v1/README.md`, `reports/product-audit-v1/dashboard/evidence/runtime-limitations.md` | false |
| `src/features/dashboard/components/DashboardCards.jsx` | false |
| `supabase/migrations/example.sql` | true |
| `scripts/supabase-local-example.mjs` | true |
| `package.json` | true |
| `.github/workflows/supabase-local-quality-gates.yml` | true |

## Lightweight validation

The lightweight path executes:

- `npm ci`
- `git diff --check` or `git diff-tree --check`
- `npm run lint`
- `npm run build`

## Heavy gate skip reason

For non-relevant PRs, the job summary records that Supabase quality gates were
skipped because no Supabase/CI-relevant files were detected.
