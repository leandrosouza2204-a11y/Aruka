# Local Smart Management QA Fixtures

## Scope

`LOCAL QA ONLY`. This tooling provisions a small deterministic dataset for the active
professional account `qa.local@aruka.test`. It must not be used against staging or production.

## Mechanism

`scripts/setup-local-smart-management-qa.mjs` verifies a local Supabase endpoint,
resolves the owner through `auth.users` and the active professional profile, then runs
cleanup and provisioning in one local database transaction. It only removes reserved
fixture IDs owned by that resolved professional; it never deletes auth or profile data.

Commands:

```text
npm run setup:local-smart-management-qa
npm run validate:local-smart-management-qa
npm run cleanup:local-smart-management-qa
```

## Coverage

- Services: `PER_SESSION`, `PER_STUDENT_SESSION`, `MONTHLY_PACKAGE`, `FIXED_PACKAGE`.
- Locations and rules: `none`, `fixed`, `per_student`, `percentage`, `tiered`.
- Tier ranges: `1-2`, `3-5`, `6+`.
- Special inputs: valid/min/max capacity, one no-duration service, and a fixed-transfer
  combination whose transfer is greater than a valid per-session revenue.

The fixture persists only domain inputs. Results remain calculated by the existing
`calculateProfitability` engine at runtime. It stores no scenarios, profit, margin,
Finance data, credentials, or secrets.

## Database Policy

Local fixture writes: `YES`. Schema change: `NO`. Migration: `NONE`. DB push: `NO`.
Production action: `NO`.
