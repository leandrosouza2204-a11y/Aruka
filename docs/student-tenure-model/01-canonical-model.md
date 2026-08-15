# Canonical Student Tenure Model

Date: 2026-08-11

Decision: adopt explicit canonical model.

## Fields

`alunos.consultoria_inicio`

Canonical `CONSULTANCY_START_DATE`: first valid known date of the historical relationship between student and consultancy.

`alunos.inicio`

Transitively preserved as `CURRENT_CONTRACT_START_DATE`. It is not renamed in this migration to avoid broad compatibility risk.

`alunos.vencimento`

Canonical `CURRENT_CONTRACT_END_DATE` for the current active commercial period.

`aluno_contratos`

Contract ledger for current and historical commercial periods.

## Ledger Columns

- `id uuid`
- `user_id uuid`
- `aluno_id uuid`
- `plano_id uuid null`
- `plano_nome_snapshot text`
- `inicio date`
- `vencimento date`
- `valor numeric(10,2)`
- `status text`: `ativo`, `renovado`, `encerrado`, `cancelado`
- `origem text`
- `renovado_de_id uuid null`
- `metadata jsonb`
- `created_at timestamptz`
- `updated_at timestamptz`

## Reactivation Policy

`RENEWAL_CONTINUOUS_RELATIONSHIP`: normal renewal when the student was not closed.

`REACTIVATION_AFTER_CLOSURE`: reactivation creates a new active contract in the ledger but preserves `consultoria_inicio`.

The current product metric "Tempo como aluno" means historical relationship duration, not uninterrupted paid active time.
