# Operational Corrections 01: Billing Attention And Student Tenure

## Decision

IMPLEMENTED_WITHOUT_DATABASE_CHANGE.

## OPS-R01 Root Cause

Dashboard counted billing attention using contract or installment status, while Alunos only filtered by `aluno.status`. A student with an installment close to due could be counted in Dashboard and hidden after navigating to Alunos.

## Canonical Rule

Billing attention is now calculated through `montarAtencaoCobranca`:

- contract due when the current contract is within 7 days or overdue;
- installment due when the next unpaid installment is within 7 days or overdue;
- urgent warning when the reference date is within 3 days;
- overdue warning when the reference date is before today.

Dashboard, Alunos and Financeiro consume the same rule.

## OPS-R02 Root Cause

The renewal flow updates `aluno.inicio` to the current contract start. The student report previously treated that same field as the original consultancy start, so tenure reset after renewal.

## Tenure Rule

The report now derives original consultancy start from the earliest available date among:

- current student `inicio`;
- payment installment due dates;
- previous contract due dates recorded in payments, only when not future-dated;
- payment dates, only when not future-dated.

The current contract start remains visible as a separate report field.

## Database

No migration, remote database mutation, db push, Supabase link or production access was required.
