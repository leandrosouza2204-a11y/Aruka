# Student Tenure Production Migration Readiness

Decision target: supervised read-only reconciliation before production apply.

The migration adds `alunos.consultoria_inicio`, `alunos.consultoria_inicio_confianca`, and the `aluno_contratos` ledger. Existing rows are updated only by deterministic backfill rules:

- `EXACT`: earliest non-future `acompanhamento_iniciado` event.
- `DERIVED_LOW_CONFIDENCE`: fallback to current `alunos.inicio` when no explicit start event exists.
- `UNKNOWN`: no non-future safe candidate.

No production data has been queried in this review. `DERIVED_LOW_CONFIDENCE` must not be treated as confirmed historical truth without human reconciliation because `alunos.inicio` may represent a renewal/current contract start.

## Operation Classes

| Operation | Class |
| --- | --- |
| Add `consultoria_inicio` columns and comments | SCHEMA_ONLY |
| Add confidence check constraint | SCHEMA_ONLY |
| Create `aluno_contratos` table, constraints, indexes | SCHEMA_ONLY |
| Enable RLS and grant select only to authenticated | SECURITY_RELEVANT |
| Drop direct mutation policies on ledger | SECURITY_RELEVANT |
| Backfill `consultoria_inicio` from explicit start events | SAFE_DATA_BACKFILL |
| Backfill `consultoria_inicio` from current `alunos.inicio` as LOW confidence | DATA_INTERPRETATION |
| Insert one legacy current-contract ledger row per student with `inicio` | DATA_INTERPRETATION |
| Create trigger and renewal RPC | SECURITY_RELEVANT |

## Readiness Notes

`LEGACY_CONTRACT_HISTORY_PARTIAL=YES`: before the migration, production has no `aluno_contratos`, so historical contracts cannot be reconstructed unless independent evidence exists. The bootstrap ledger represents the current legacy contract only.

Payments remain financial movements. `pagamentos.data_pagamento` is not consultancy start, and `pagamentos.vencimento_parcela` is not contract start.

## Required Human Review

Run `04-production-readonly-audit.sql` in a supervised read-only production session. Review all `DERIVED_LOW_CONFIDENCE` and `UNKNOWN` rows before authorizing production apply or post-migration reconciliation.
