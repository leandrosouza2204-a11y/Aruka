# Migration And Backfill

Migration: `supabase/migrations/20260811090000_student_tenure_contract_model.sql`

## Backfill Classification

`EXACT`: earliest `acompanhamento_iniciado` event date, if present and not future.

`DERIVED_HIGH_CONFIDENCE`: reserved for future/imported unambiguous contract ledger evidence.

`DERIVED_LOW_CONFIDENCE`: fallback to legacy `alunos.inicio` when no stronger evidence exists and date is not future.

`UNKNOWN`: no valid non-future source.

This intentionally avoids generic `MIN(any_date)`. Payments remain financial movement evidence; `vencimento_parcela` remains installment due date.

## Ledger Backfill

The migration creates at least the current contract representation for existing students with `alunos.inicio`.

Historical contracts are not fabricated when evidence is insufficient.

`LEGACY_CONTRACT_HISTORY_PARTIAL=YES`

## Renewal Atomicity

Renewal is implemented by RPC `public.renovar_aluno_contrato(...)`:

- locks the student row;
- preserves `consultoria_inicio`;
- marks previous active contract as `renovado`;
- creates the new active contract;
- updates `alunos.inicio`, `alunos.vencimento`, plan and value;
- optionally creates the renewal payment;
- records `plano_renovado` with previous/new contract metadata.

This prevents partial client-side state where the student updates but the ledger does not.
