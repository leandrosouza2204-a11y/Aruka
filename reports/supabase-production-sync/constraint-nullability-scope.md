# Constraint and Nullability Phase 2 Scope

Decision: `READY_FOR_PHASE2_COMMIT`.

Manual product decision: `APPROVED`.

Supabase change: `YES`.

Remote link state: `UNLINKED_FOR_SAFETY`.

The remote nullability profile is complete for the ten `public.alunos` columns: 26 rows, 0 nulls in every column. This proves current data compatibility. The manual decision approves only three `NOT NULL` changes in this phase.

## Included

- `public.alunos.created_at`: `NOT_NULL_REQUIRED_BY_CONTRACT`, database default `now()`.
- `public.alunos.user_id`: `NOT_NULL_REQUIRED_BY_CONTRACT`, ownership/RLS-derived.
- `public.alunos.whatsapp`: `NOT_NULL_REQUIRED_BY_CONTRACT`, required by current form.

## Preserved

- `public.alunos.acompanhamento_motivo`: `NULLABLE_SHOULD_BE_PRESERVED`.
- `public.alunos.observacoes`: `NULLABLE_SHOULD_BE_PRESERVED`.
- `public.alunos.inicio`: `NULLABLE_PRESERVED_BY_PRODUCT_DECISION`.
- `public.alunos.pagamento_recebido`: `NULLABLE_PRESERVED_BY_PRODUCT_DECISION`.
- `public.alunos.plano`: `NULLABLE_PRESERVED_BY_PRODUCT_DECISION`.
- `public.alunos.status`: `NULLABLE_PRESERVED_BY_PRODUCT_DECISION`.
- `public.alunos.valor`: `NULLABLE_PRESERVED_BY_PRODUCT_DECISION`.

The five financial/lifecycle columns are classified as `FUTURE_CONTRACT_HARDENING_OPTIONAL` if the model later formalizes stricter requirements.

## Constraints

No constraint is included in the Phase 2 migration.

- `public.perfis.perfis_role_check`: `DEFERRED_TO_STUDENT_IDENTITY`.
- `public.treinos.treinos_lifecycle_dates_check`: `DEFERRED_TO_WORKOUT_DELIVERY`.
- `public.treino_eventos.treino_eventos_metadata_object_check`: `SEMANTIC_FALSE_POSITIVE`.
- `public.treinos.treinos_template_origin_snapshot_object_check`: `SEMANTIC_FALSE_POSITIVE`.
- `public.treinos.treinos_template_origin_type_check`: `SEMANTIC_FALSE_POSITIVE`.

`PHASE2_CONSTRAINT_CHANGE_COUNT=0`.

## Migration

`supabase/migrations/20260801143335_reconcile_alunos_required_fields.sql`

Rollback concept:

```sql
ALTER TABLE public.alunos
  ALTER COLUMN created_at DROP NOT NULL,
  ALTER COLUMN user_id DROP NOT NULL,
  ALTER COLUMN whatsapp DROP NOT NULL;
```
