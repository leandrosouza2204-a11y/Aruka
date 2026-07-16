# Migration Cutover Runbook

## Objetivo

Registrar a baseline oficial como marco de historico sem reaplicar DDL em ambientes existentes.

## Pre-condicoes

- Baseline oficial validada localmente.
- SHA da baseline confirmado.
- Backup aprovado para ambiente alvo.
- Freeze de deploy ativo.
- Ambiente confirmado nominalmente.
- Equivalencia read-only executada.

## Comandos proibidos neste ciclo

- `supabase db push`
- `supabase db pull`
- `supabase migration repair`
- qualquer comando com `--linked`, `--project-ref` ou `--db-url` remoto
- SQL remoto de escrita

## Checklist GO/NO-GO

- SHA baseline confere.
- Schema remoto equivale a baseline.
- Storage read-only confere.
- Edge Functions e secrets foram inventariados.
- Responsavel de banco presente.
- Rollback operacional aprovado.

## Comandos propostos para ciclo futuro

Os comandos remotos devem ser definidos apenas no ciclo de ativacao HML/producao. Este documento registra a necessidade, nao executa a acao.

## Rollback operacional

- Suspender cutover.
- Manter migrations arquivadas no Git.
- Reverter commit de cutover se necessario.
- Nao executar DDL destrutivo automatico em producao.

## Evidencias

- Hashes.
- Dumps/catalog queries read-only.
- Logs de validacao local.
- Resultado de smoke tests.
- Decisao GO/NO-GO assinada.

