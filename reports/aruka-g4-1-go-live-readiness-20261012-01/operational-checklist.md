# G4.2 operational checklist

Every checkbox requires timestamp, operator initials and evidence reference. An unchecked required item means `NO-GO`.

## Authorization and freeze

- [ ] Change ticket explicitly authorizes the 16 production migrations only.
- [ ] Incident commander, database operator, application operator, security reviewer and QA owner are named.
- [ ] Maintenance window and communication channel are active.
- [ ] Database writes, scheduled jobs, deploys and concurrent migrations are frozen.
- [ ] Student V2 activation is explicitly out of scope.

## Immutable inputs

- [ ] `main`, `origin/main`, approved SHA and Vercel production SHA are identical.
- [ ] Worktree contains no unexpected change; document 37 remains preserved.
- [ ] All 16 canonical LF hashes match the approved package.
- [ ] Security migration hash equals `8673CF833854A1FA6F3572E8E4D1121F1D2E51CABE65CB367FA18D6A1A58EB21`.
- [ ] Production history is exactly 25 versions through `20260909110000`.
- [ ] No unexpected rollout object exists before execution.

## Recovery

- [ ] Fresh database snapshot was captured after freeze using read-only export operations.
- [ ] Host and isolated-copy SHA-256 values match.
- [ ] Fresh snapshot restored and validated in a new isolated PostgreSQL 17 environment.
- [ ] RPO timestamp, measured restore/validation duration and on-call restore operator are recorded.
- [ ] Storage decision is recorded: approved byte backup or formal `DATABASE_ONLY` acceptance.
- [ ] No Storage object was copied to an unapproved destination.

## Provider prechecks

- [ ] Supabase project is `aruka` / `vrizeuhuhvtvbrmtvdik` and `ACTIVE_HEALTHY`.
- [ ] Security Advisor baseline is recorded (expected current anonymous count: 17).
- [ ] Vercel production deployment, domains and rollback candidate are recorded.
- [ ] Relevant Vercel environment variable names/settings were reviewed without copying secret values.
- [ ] Supabase and Vercel logs are open and the pre-change error baseline is recorded.

## Execution

- [ ] The staged package uses the exact operational order in `g4-2-runbook.md`.
- [ ] Each step is atomic with its migration-history insertion.
- [ ] A checkpoint is recorded after every step.
- [ ] Reconciliation has two-operator approval before step 13.
- [ ] Global hardening has two-operator approval before step 14.
- [ ] Rollout foundation remains OFF/false/zero after step 15.
- [ ] Privileged-function remediation produces zero anonymous executors after step 16.

## Postchecks

- [ ] History contains exactly 41 versions and the next approved dry-run is empty.
- [ ] 30 existing public tables plus expected new tables have correct RLS; no exposed table is unintentionally unprotected.
- [ ] Policies, grants, functions and `search_path` match the approved inventory.
- [ ] Invalid indexes = 0; FK orphans = 0; critical row counts do not decrease.
- [ ] Auth, professional flows and Student V1 smoke tests pass.
- [ ] Student V2 remains OFF; zero targets; no activation smoke is performed.
- [ ] Supabase/Postgres/Auth/PostgREST/Function and Vercel logs remain within thresholds.
- [ ] Observe for at least 60 minutes after the application/deploy checkpoint, or longer if the change record requires it.
- [ ] Sign-off is recorded before lifting freeze.
