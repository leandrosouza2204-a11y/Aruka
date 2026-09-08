# Stage 11.1 - Foundation & Data Model

Status: IN_PROGRESS

## Discovery Summary

The current app uses thin page wrappers in `src/pages/**`, domain components under `src/features/**`, shared navigation in `src/components/Sidebar.jsx` and `src/components/MobileBottomNavigation.jsx`, and route protection in `src/App.jsx`. Supabase migrations use SQL files in `supabase/migrations/**`, direct RLS policies, `auth.uid()` ownership, check constraints for allowed text values, and `numeric(10,2)` for money values.

## Domain

The new domain is `src/features/gestaoInteligente/**`. It is separate from `src/features/financeiro/**`.

The foundation page is intentionally honest: it explains the decision-support module and planned areas without dashboards, fake metrics or operational CRUD that belongs to Stage 11.2.

Planned areas:

- Visao geral.
- Locais.
- Servicos e precos.
- Simulador.
- Comparacao.

## Data Model

### smart_management_locations

Professional-owned service locations.

Fields:

- `id uuid`.
- `professional_id uuid`.
- `name text`.
- `description text`.
- `status text`.
- `archived_at timestamptz`.
- `created_at timestamptz`.
- `updated_at timestamptz`.

Deletion strategy: Stage 11.1 supports archive status in the model and keeps hard-delete available under owner-scoped RLS because no historical profitability records exist yet. Future stages should prefer archive in UI to preserve analytical history.

### smart_management_transfer_rules

One structured transfer rule per location.

Supported `rule_type` values:

- `none`.
- `fixed`.
- `per_student`.
- `tiered`.
- `percentage`.

Money uses `numeric(10,2)`, matching the current finance/contract database convention. Percentages use `numeric(5,2)`.

Shape constraints keep the rule calculable:

- `none`: no amount columns.
- `fixed`: `fixed_amount`.
- `per_student`: `per_student_amount`.
- `tiered`: tiers in `smart_management_transfer_tiers`.
- `percentage`: `percentage_rate` between 0 and 100.

### smart_management_transfer_tiers

Tiered transfer amounts for quantity bands.

Fields:

- `transfer_rule_id uuid`.
- `professional_id uuid`.
- `min_students integer`.
- `max_students integer nullable`.
- `amount numeric(10,2)`.

`max_students = null` represents "or more". Constraints prevent non-positive minimums, inverted ranges and negative amounts. Full overlap detection is deferred until Stage 11.2 unless the UI needs stronger guardrails.

## Reference Scenario

Professional charges R$ 120 per student in a 1-hour session.

Academia A can be represented as:

- location `Academia A`.
- transfer rule `tiered`.
- tiers `1..1 = 50`, `2..2 = 100`, `3..null = 150`.

Academia B can be represented as:

- location `Academia B`.
- transfer rule `fixed`.
- `fixed_amount = 75`.

Academia C can be represented as:

- location `Academia C`.
- transfer rule `none`.

These are business fixtures for documentation and tests. They are not inserted as user data or production seed data.

## Future Profitability Contract

The future engine should use structured rules to answer:

- gross revenue.
- transfer amount.
- net revenue.
- net hourly revenue.
- net revenue per student.
- which location is more profitable under the same scenario.

Expected basic contract:

```text
grossRevenue = chargedAmount * studentCount
transfer = transferRule(studentCount, grossRevenue)
netRevenue = grossRevenue - transfer
netHourlyRevenue = netRevenue / sessionDurationHours
```

Stage 11.1 does not implement this engine.

## RLS Contract

RLS is enabled on all new tables. Policies allow authenticated professionals with active `perfis` rows and `role = 'user'` to manage only rows where `professional_id = auth.uid()`.

Expected denials:

- anon cannot access the tables.
- students cannot access the tables because they do not satisfy the active professional profile predicate.
- Professional B cannot read or mutate Professional A rows.

Rules and tiers include owner-matching triggers so child records cannot be attached to another professional's location or rule.

## Indexes

Indexes are limited to expected Stage 11.2 access paths:

- locations by `professional_id`, `status`, `name`.
- rules by `professional_id`, `status`.
- rules by `location_id`.
- tiers by `transfer_rule_id`, `min_students`.
- tiers by `professional_id`.

## Supabase

SUPABASE_CHANGE: YES

Migration: `20260908110000_smart_management_foundation.sql`

Remote project target for authorized production push: `vrizeuhuhvtvbrmtvdik`.
