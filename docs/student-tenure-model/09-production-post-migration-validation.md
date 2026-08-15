# Student Tenure Post-Migration Validation

## SQL Smoke Tests

Run after database migration and real-student reconciliation.

Expected checks:

- `public.alunos.consultoria_inicio` exists.
- `public.alunos.consultoria_inicio_confianca` exists.
- `public.aluno_contratos` exists.
- `public.renovar_aluno_contrato` exists.
- RLS is enabled on `public.aluno_contratos`.
- The 7 real students are reconciled from the locked manifest.
- Demo/fake records do not block deployment and may remain legacy or low confidence.
- No reconciled `consultoria_inicio` is future-dated.
- No reconciled `consultoria_inicio` is after `public.alunos.inicio`.

## App Smoke Tests

Run only after:

- `DATABASE_MIGRATION=PASS`
- `REAL_STUDENT_RECONCILIATION=PASS`
- `DATABASE_SMOKE_TEST=PASS`

Screens/workflows:

- Dashboard
- Alunos
- Student details
- Financeiro
- Student report
- Renovacao

For a real renewed student:

- historical student tenure uses `consultoria_inicio`;
- current contract start uses `inicio`;
- finance report tenure matches detail-page tenure.

## Behavioral Cases

Amabile-equivalent case:

- `consultoria_inicio=2026-05-10`
- `CURRENT_CONTRACT_START=2026-07-12`
- tenure is historical and must not collapse to the current contract start.

Future renewal:

- `consultoria_inicio` is preserved;
- previous contract becomes `renovado`;
- new contract becomes `ativo`;
- `alunos.inicio` changes to the new contract start;
- `alunos.vencimento` changes to the new contract end.

New student:

- `consultoria_inicio` starts as first contract start;
- ledger has one active contract.

Reactivation:

- `consultoria_inicio` is preserved;
- new contract origin follows the canonical model, such as `reactivation_after_closure`.

## Deployment Gate

Frontend deployment remains blocked until database-first apply and reconciliation pass.
