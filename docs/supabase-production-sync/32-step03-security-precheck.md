# Step03 Security Precheck

## Objective

Prepare the read-only production precheck for Step03 Security Reconciliation without executing mutable production SQL.

## Scope

Step03 covers RLS, policies, table grants, function grants and security hardening already represented by the approved security migration.

Canonical migration:

`supabase/migrations/20260731190000_reconcile_security_policies_and_grants.sql`

## Cutover Files

- Precheck: `reports/supabase-production-sync/production-cutover-sql/03-security-reconciliation-precheck.sql`
- Apply: `reports/supabase-production-sync/production-cutover-sql/03-security-reconciliation.sql`
- Postcheck: `reports/supabase-production-sync/production-cutover-sql/03-security-reconciliation-postcheck.sql`
- Recovery: `reports/supabase-production-sync/production-cutover-sql/03-security-reconciliation-recovery.md`

## Apply Hash

`BD2753069A1F2F6565AFD1E846872D1E48EA5A4FE24F413415C8E66BC3392D54`

## Static Gates

- Precheck read-only: `PASS`.
- Apply traceability: `UNTRACEABLE_STATEMENT_COUNT=0`.
- Recovery available: `YES`.
- Postcheck available: `YES`.
- Runtime requirement: `SECURITY_POSTCHECK_SUFFICIENT`.

## Runner

External runner:

`C:\Backups\Aruka\run-step03-security-precheck.ps1`

Command:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -NoExit -File C:\Backups\Aruka\run-step03-security-precheck.ps1
```

The runner uses Docker with `public.ecr.aws/supabase/postgres:17.6.1.156`, Session Pooler credentials collected locally, a temporary process-scoped database credential environment variable, and native exit-code based handling for PostgreSQL NOTICE/WARNING output.

## Awaiting Secure Execution

Decision is `AWAITING_SECURE_STEP03_PRECHECK_EXECUTION`. Step03 apply remains unauthorized and was not executed.

Next action: `USER_EXECUTE_STEP03_PRECHECK_RUNNER`.
