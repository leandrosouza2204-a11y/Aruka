# ADR-025 - Explicit Non-Production Confirmation

Status: Accepted.

## Context

AOE runtime validation requires remote writes only in a safe local, development, or staging environment.

## Decision

No AOE remote write operation may run without `.aoe-environment.local.json` confirming a non-production environment.

## Consequences

- Production and indeterminate environments are blocked.
- Project refs remain local and are masked in reports.
- Runtime validation can proceed only after explicit operator confirmation.
