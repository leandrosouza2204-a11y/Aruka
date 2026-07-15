# AOE v1.7.3 - Staging Environment Provisioning

Status: NOT_READY.

This package prepares staging validation without bypassing the missing runtime evidence.

## Current Decision

The linked Supabase project is not treated as staging until `.aoe-environment.local.json` exists locally and confirms a non-production environment.

## Commands

- `npm run aoe:env:validate -- --environment=staging`
- `npm run aoe:runtime:import-schema -- --schema=<file> --environment=staging`
- `npm run aoe:staging:create-fixtures`
- `npm run aoe:staging:smoke`
- `npm run aoe:staging:cleanup -- --dry-run`
- `npm run aoe:validate:staging`

Remote writes remain blocked by default.
