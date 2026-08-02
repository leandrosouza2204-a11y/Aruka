# Function Security Reconciliation Implementation

## Context

Phase 3.2 found one isolated security change with sufficient evidence: production grants `anon.execute` on `public.aoe_idempotency_get_or_create(...)`, while the local contract grants execution only to authenticated application roles.

The AOE function body remains out of scope and is not changed here.

## Migration

Path: `supabase/migrations/20260801173000_revoke_aoe_idempotency_anon_execute.sql`

```sql
-- Phase 3.2 Group E: remove excessive anon EXECUTE from AOE idempotency RPC.
-- The function body is intentionally unchanged in this migration.

revoke execute on function public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) from anon;
```

## Production Boundary

Production action remains pending reconciliation completion. This migration is local repository work only in this round.
