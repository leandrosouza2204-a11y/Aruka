# ADR-027 - Staging Fixtures Must Be Traceable

Status: Accepted.

## Context

Runtime validation requires fictitious users and records, but cleanup must be safe.

## Decision

Every AOE staging fixture must use the `aoe_test_` prefix, be recorded in a local cleanup manifest, and be removable only by recorded IDs.

## Consequences

- Broad deletes are not allowed.
- Real users and real students are never used.
- Cleanup remains auditable and bounded.
