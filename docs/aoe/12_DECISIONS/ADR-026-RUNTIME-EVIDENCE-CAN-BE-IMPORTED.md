# ADR-026 - Runtime Evidence Can Be Imported

Status: Accepted.

## Context

Supabase CLI inspection can depend on Docker or unavailable local tooling.

## Decision

When the CLI cannot inspect the remote PostgreSQL schema, exported evidence from the Supabase SQL Editor may be imported and validated by the project.

## Consequences

- Imported evidence must be JSON or CSV.
- Import scripts never execute SQL and never modify the database.
- Manual claims without metadata evidence do not approve runtime validation.
