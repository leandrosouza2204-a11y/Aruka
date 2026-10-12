# G4.1 production go-live readiness

## Decision

`READY_FOR_AUTHORIZATION` for a separately approved G4.2 window. Production remained strictly read-only.

The current production baseline was reconfirmed on 2026-10-12: Supabase `aruka` is healthy on PostgreSQL 17.6 with 25 migrations, Vercel production serves merge commit `58980add1a520f31f8b1dac68f801d344ee68704`, and Student Experience V2 remains unavailable/default-off. The published bundle is compatible with the current schema because its V2 capability flag is absent/false and a missing rollout RPC fails closed to V1.

Sixteen migrations are pending, including the final security remediation. The canonical LF SHA-256 of `20261011232512_harden_privileged_function_execution.sql` matches the approved `8673CF833854A1FA6F3572E8E4D1121F1D2E51CABE65CB367FA18D6A1A58EB21`. Production currently still has the 17 Security Advisor findings; they are not considered resolved until G4.2 is authorized, executed and verified.

The G2 backup hash was revalidated and its isolated restore evidence remains PASS. A fresh database snapshot and isolated validation are mandatory immediately before G4.2. Storage remains a database-only DR boundary: eight private objects exist in `avaliacoes-fotos`, none in `exercise-media`, and object bytes are not in the dump. The change owner must formally accept that limitation or authorize a separate encrypted byte backup.

Authenticated Vercel configuration/log inspection and Git publication require operator authorization. Automatic production deployment from `main` is proven, so G4.1 artifacts must not be pushed or merged without explicit publication approval.

## Artifacts

- `reports/aruka-g4-1-go-live-readiness-20261012-01/report.md`
- `reports/aruka-g4-1-go-live-readiness-20261012-01/report.json`
- `reports/aruka-g4-1-go-live-readiness-20261012-01/g4-2-runbook.md`
- `reports/aruka-g4-1-go-live-readiness-20261012-01/operational-checklist.md`
- `reports/aruka-g4-1-go-live-readiness-20261012-01/risk-matrix.md`
- `reports/aruka-g4-1-go-live-readiness-20261012-01/read-only-queries.sql`
- `reports/aruka-g4-1-go-live-readiness-20261012-01/read-only-evidence.md`
- `scripts/prepare-aruka-g4-2-package.mjs` (offline prepare-only; cannot execute production)
- `scripts/__tests__/prepare-aruka-g4-2-package.test.mjs`

Restricted production-derived G2/G3 evidence remains on the approved encrypted recovery volume and was not copied to Git.
