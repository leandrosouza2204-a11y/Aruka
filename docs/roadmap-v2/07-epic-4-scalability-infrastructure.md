# Epic 4 - Scalability Infrastructure

## Objetivo

Preparar dados, seguranca, operacao e pipeline para crescimento controlado sem comprometer isolamento multi-tenant, reproducibilidade e capacidade de diagnostico.

## Contexto atual

A infraestrutura Supabase tem documentacao extensa de inventario, baseline, drift, seeds, reset local e CI. A baseline oficial esta versionada e ha runbooks para ambientes novos e existentes.

Fontes principais:

- `docs/supabase-infrastructure-refactor/README.md`
- `docs/supabase-infrastructure-refactor/14-roadmap.md`
- `docs/supabase-infrastructure-refactor/19-risk-register.md`
- `docs/supabase-infrastructure-refactor/45-ci-validation-pipeline.md`
- `supabase/migrations/**`
- `supabase/functions/**`

## Iniciativas

| Iniciativa | Prioridade | Descricao |
| --- | --- | --- |
| Checklist obrigatorio de schema | Alta | Toda mudanca de tabela deve declarar RLS, indices, ownership, rollback e impacto em seeds. |
| Indices por fluxo | Alta | Revisar consultas de Alunos, Treinos, Avaliacoes e Financeiro para listagens, filtros e contexto. |
| Transacoes/RPCs criticas | Alta | Avaliar gravacoes compostas de treino, avaliacao e financeiro para evitar persistencia parcial. |
| Observabilidade operacional | Media | Padronizar logs de Edge Functions, RPCs administrativas e erros de dominio. |
| Cutover HML/producao | Media | Executar runbooks read-only antes de qualquer escrita remota. |
| Branch protection verificavel | Media | Fechar pendencias de evidencia runtime e required check documentadas nos ciclos Supabase. |

## Padroes desejados

- Nenhuma service role no frontend.
- Toda tabela tenant-aware com `user_id` ou ownership equivalente.
- Toda policy RLS com teste negativo.
- Toda Edge Function com input validation, auth validation e logs suficientes.
- Toda migration nova com revisao de idempotencia.
- Toda mudanca de dados com caminho de rollback ou mitigacao documentada.

## Riscos

- Crescimento de listagens client-side em modulos de alta cardinalidade.
- Gravacoes compostas sem transacao criando estado parcial.
- Divergencia entre ambiente local, HML e producao.
- Branch protection assumido por configuracao manual sem evidencia atual.
- Edge Functions com comportamento operacional dificil de auditar.

## Gates

Para promover a infraestrutura a `PRONTO_PARA_ESCALA`:

- CI local Supabase reproduzivel em clean clone;
- evidencia runtime atual de branch protection;
- matriz de indices por consulta critica;
- testes negativos de RLS para novas entidades;
- runbook de HML/producao executado em modo read-only;
- nenhum segredo ou URL sensivel em relatorios.
