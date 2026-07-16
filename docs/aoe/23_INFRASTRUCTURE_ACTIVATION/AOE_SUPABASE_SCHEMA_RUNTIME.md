# AOE Supabase Schema Runtime

Status: bloqueado.

## Evidencia

- Project Ref: `vriz...vdik`.
- Supabase CLI: disponivel via `npx.cmd`, versao `2.109.1`.
- `supabase/config.toml`: ausente.
- Docker local: indisponivel para `supabase status` e `supabase db dump`.
- Migration local: `supabase/migrations/20260715090000_aoe_infrastructure_pilot.sql` presente.

## Resultado

O schema real nao foi inventariado por consulta ao PostgreSQL. A migration aplicada manualmente nao foi confirmada em runtime.

## Tabelas Esperadas

- `aoe_decisions`
- `aoe_decision_traces`
- `aoe_human_reviews`
- `aoe_idempotency_keys`
- `aoe_audit_events`

## RPCs Esperadas

- `aoe_user_owns_student`
- `aoe_idempotency_get_or_create`

## Decisao

Schema runtime: nao validado.
