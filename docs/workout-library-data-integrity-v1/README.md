# Workout Library Data Integrity v1

## Decisao

`READY_WITH_LIMITATIONS`

O ciclo definiu contrato canonico executavel para templates, padronizou status, moveu criacao/edicao/duplicacao de treino para uma RPC transacional consolidada na baseline oficial e adicionou testes unitarios de transformacao. A limitacao esta na validacao runtime local: Supabase local nao estava disponivel via scripts de status, e o runner CDP representativo foi bloqueado por ausencia de `.env`.

## Escopo implementado

- Contrato canonico em `src/features/treinos/utils/workoutDataContract.js`.
- Wrapper compativel em `workoutTemplateSanitization.js`.
- Persistencia composta via `public.salvar_treino_composto(jsonb)`.
- RPC incorporada aos fragmentos canonicos `supabase/baseline-src/05-functions.sql` e `supabase/baseline-src/09-grants.sql`.
- Baseline ativa e baseline-candidate regeneradas com SHA canonica `67B35BF73A2C9662DA02C3E88D404B5018E4B1E982DB8F24A23E91AA4B1DCC5B`.
- Migration incremental preservada em `supabase/migrations-archive/20260725093000_workout_atomic_persistence.sql`; `supabase/migrations` permanece com uma unica baseline SQL ativa.
- `adicionarTreinoSupabase` e `atualizarTreinoSupabase` usando RPC.
- Duplicacao usando o mesmo payload seguro de criacao.
- Status canonico `Ativo`, `Em revisao`, `Finalizado`, aceitando variantes antigas na leitura.
- Diagnostico de tabela `workout_templates` ausente em dev/QA.
- Testes unitarios de contrato, legado, sanitizacao, status, payload e duplicacao.

## Artefatos

- [01-canonical-contract.md](01-canonical-contract.md)
- [02-transformation-matrix.md](02-transformation-matrix.md)
- [03-atomic-persistence.md](03-atomic-persistence.md)
- [04-migration-rpc-decision.md](04-migration-rpc-decision.md)
- [05-validation-evidence.md](05-validation-evidence.md)
- [06-cycle-1-3-proposal.md](06-cycle-1-3-proposal.md)

Relatorios:

- `reports/workout-library-data-integrity-v1/result.json`
- `reports/workout-library-data-integrity-v1/validation-matrix.json`
- `reports/workout-library-data-integrity-v1/summary.md`
