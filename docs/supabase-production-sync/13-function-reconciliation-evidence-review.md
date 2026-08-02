# Function Reconciliation Evidence Review

## Context

Phase 3.2 consumes the user-provided SELECT-only production CSV in `remote-phase31-input` and compares it to the local function catalog derived from the current baseline/migrations.

## Decision

`READY_FOR_PHASE32_SECURITY_MIGRATION`

## Migration Direction

- Group A utility hardening is ready as an isolated migration.
- Group E AOE anon EXECUTE is ready as a separate security migration.
- Admin overload cleanup remains blocked by external-consumer review.
- Admin body replacements remain blocked by product/security decision.
- Financial functions remain blocked by the financial gate.
- Student identity remains deferred.

## Evidence Boundary

The raw CSV is ignored and not staged. Derived reports contain metadata, hashes, grants and decisions, not full production function bodies.

## SQL Record

Migration SQL is recorded in `docs/supabase-production-sync/14-function-security-reconciliation-implementation.md`.
