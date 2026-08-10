# Constraint and Nullability Reconciliation Implementation

Decision: `READY_FOR_PHASE2_COMMIT`.

Manual product decision: `APPROVED`.

Manual financial contract decision: `MANUAL_FINANCIAL_CONTRACT_DECISION_COMPLETED`.

## Input State

- Branch: `feat/workout-delivery-integration-v1`
- HEAD: `b9c10600bc401ac83149e6f4bcbd560ab8c4d149`
- Working tree initial state: staged Phase 2 scope artifacts, no unstaged diff
- Remote link state: `UNLINKED_FOR_SAFETY`
- Global decision: `BLOCKED_REMOTE_SCHEMA_DRIFT`
- Migration repair allowed: `NO`
- Production action required: `NO`

## Approved Nullability

Included in Phase 2:

- `created_at`: `NOT_NULL_REQUIRED_BY_CONTRACT`
- `user_id`: `NOT_NULL_REQUIRED_BY_CONTRACT`
- `whatsapp`: `NOT_NULL_REQUIRED_BY_CONTRACT`

Preserved nullable:

- `acompanhamento_motivo`: `NULLABLE_SHOULD_BE_PRESERVED`
- `observacoes`: `NULLABLE_SHOULD_BE_PRESERVED`
- `inicio`: `NULLABLE_PRESERVED_BY_PRODUCT_DECISION`
- `pagamento_recebido`: `NULLABLE_PRESERVED_BY_PRODUCT_DECISION`
- `plano`: `NULLABLE_PRESERVED_BY_PRODUCT_DECISION`
- `status`: `NULLABLE_PRESERVED_BY_PRODUCT_DECISION`
- `valor`: `NULLABLE_PRESERVED_BY_PRODUCT_DECISION`

The five financial/lifecycle columns are `FUTURE_CONTRACT_HARDENING_OPTIONAL`.

## Constraints

No constraint is included:

- `perfis_role_check`: `DEFERRED_TO_STUDENT_IDENTITY`
- `treinos_lifecycle_dates_check`: `DEFERRED_TO_WORKOUT_DELIVERY`
- `treino_eventos_metadata_object_check`: `SEMANTIC_FALSE_POSITIVE`
- `treinos_template_origin_snapshot_object_check`: `SEMANTIC_FALSE_POSITIVE`
- `treinos_template_origin_type_check`: `SEMANTIC_FALSE_POSITIVE`

`PHASE2_CONSTRAINT_CHANGE_COUNT=0`.

## Migration

`supabase/migrations/20260801143335_reconcile_alunos_required_fields.sql`

```sql
begin;

alter table public.alunos
  alter column created_at set not null,
  alter column user_id set not null,
  alter column whatsapp set not null;

commit;
```

Defaults changed: 0.

Data changed: 0.

Rollback concept:

```sql
ALTER TABLE public.alunos
  ALTER COLUMN created_at DROP NOT NULL,
  ALTER COLUMN user_id DROP NOT NULL,
  ALTER COLUMN whatsapp DROP NOT NULL;
```
