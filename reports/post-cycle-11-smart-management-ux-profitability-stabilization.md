# Post-Cycle 11 Smart Management UX and Profitability Stabilization

## Decision

PARTIAL

## Delete Lifecycle

Locations and services now expose Edit, Archive, and Delete. Delete uses the shared
accessible confirmation dialog and only reports success after the backend returns the
deleted record id. Both calls filter by `professional_id`; existing RLS policies also
enforce the active professional owner boundary.

Locations only own transfer rules and tiers, whose existing foreign keys already use
`ON DELETE CASCADE`. They are configuration children, not historical records. No
external foreign-key dependency to locations or services exists in the active Smart
Management migrations. Archive behavior is unchanged.

Supabase change: `NO`. Migration: `NONE`. DB push: `NO`.

## Profitability Diagnosis

`PROFITABILITY_SCOPE_UNDEFINED`

Stage 11.4 canonically defines the calculated-only profitability engine and explicitly
names the next stage as Smart Simulator. It does not define a separate Rentabilidade
surface. The current page renders `ProfitabilityPanel` for both tabs, which explains
the duplicate interface, but no canonical UI exists to replace it. No speculative
profitability module was added.

## Presentation Copy

The active-services summary is now centralized and tested for zero, singular, and
plural forms. The invalid `disponivelis` inflection is removed.

## Local QA

- Smart Management Locations and Transfers: PASS (73 tests)
- Services and Pricing: PASS (68 tests)
- Commercial Presentation: PASS (13 tests)
- Smart Management service/persistence unit tests: PASS
- Lint: PASS
- `git diff --check`: PASS

Residual scope: a distinct Rentabilidade experience requires a canonical product
definition before implementation.
