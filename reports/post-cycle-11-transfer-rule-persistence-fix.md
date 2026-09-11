# Post-Cycle 11 Transfer Rule Persistence Fix

## Decision

COMPLETE

## Baseline

- Baseline SHA: `43304ec57b61874cf3378609069bfd74c3a6f22b`
- Branch: `fix/smart-management-transfer-rule-persistence`
- Root cause category: `READ_NORMALIZATION`
- Supabase change: `NO`
- Migration: `NONE`
- DB push: `NO`
- Production action: `NO`

## Symptom and Root Cause

The atomic RPC correctly persisted a location, its transfer rule, and its tiers.
`smart_management_transfer_rules.location_id` is unique, so PostgREST returns the
embedded transfer rule as a one-to-one object. The client normalizer read it as an
array with `smart_management_transfer_rules?.[0]`, converting every valid persisted
rule into `null` after reload. This produced the false pending configuration and
invalid-location states in the simulator and comparator.

## Fix

- Added a dependency-free location persistence normalizer that accepts the actual
  one-to-one PostgREST object and preserves the legacy array shape defensively.
- Preserved fixed, per-student, percentage, none, and tiered values, including sorted
  tier ranges.
- Required `location_id` in the RPC response before the submit flow can report success.
- Added the persistence test to the existing Locations and Transfers QA gate.

## Data Flow

- Write path: `SmartManagementFoundationPage` -> `saveSmartManagementLocation` ->
  `save_smart_management_location` RPC.
- Database source: `smart_management_locations`,
  `smart_management_transfer_rules`, and `smart_management_transfer_tiers`.
- Read path: `listSmartManagementLocations` ->
  `normalizeSmartManagementLocation`.
- Validation and consumption: `transferRules`, `profitabilityEngine`,
  `profitabilityComparison`, and `locationComparator`.
- RLS involved: `NO` as root cause. Local runtime validation confirmed ownership and
  denial boundaries remain intact.

## Model Validation

| Model | Save | Reload normalization | Edit/RPC update | Simulator | Comparator |
| --- | --- | --- | --- | --- | --- |
| `none` | PASS | PASS | PASS | PASS | PASS |
| `fixed` | PASS | PASS | PASS | PASS | PASS |
| `per_student` | PASS | PASS | PASS | PASS | PASS |
| `percentage` | PASS | PASS | PASS | PASS | PASS |
| `tiered` | PASS | PASS | PASS | PASS | PASS |

The local RLS runtime suite validates atomic RPC persistence, tier persistence,
updates, invalid configurations, and professional/student/anonymous isolation. The
new unit suite validates the PostgREST reload shape for all supported models and the
consumer suites validate simulator and comparator calculations for all models.

## QA Evidence

- `qa:smart-management-locations-transfers`: PASS (71 tests)
- `qa:smart-management-rls-runtime`: PASS (25 checks)
- `supabase:validate`: PASS
- Smart Management data model, security, foundation, access, responsive, dashboard,
  services/pricing, profitability, simulator, comparator, commercial presentation,
  mobile/PWA, and accessibility validators: PASS
- `qa:visible-ui-copy`: PASS
- `test:alunos`: PASS (65 tests)
- `lint`: PASS
- `build`: PASS
- `git diff --check`: PASS

## Residual Risk

No schema or policy change was needed. The fix is limited to client read
normalization and RPC acknowledgement; live production UI interaction is intentionally
outside this local validation run.
