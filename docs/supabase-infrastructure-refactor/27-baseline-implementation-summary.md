# Baseline Implementation Summary

## Decisao

`BASELINE_CANDIDATE_VALIDATED`

## Candidate

- Path: `supabase/baseline-candidate/20260716090000_baseline_aruka_v1.sql`
- Timestamp: `20260716090000`
- SHA256: `745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE`
- Tamanho: `63780` bytes
- Dump de referencia: `reports/hml-baseline/production-public-schema.sql`
- SHA256 do dump: `637B21F0729CA765BF3573652254EB855A3BC0C8F255A1F1A3DACF73BA1EC541`

## Estrategia aplicada

A baseline candidate foi consolidada a partir de `supabase/baseline-src/` em um unico SQL idempotente, fora de `supabase/migrations/`, preservando as migrations historicas como artefatos incrementais. O arquivo gerado nao foi aplicado em banco remoto e nao houve alteracao em Edge Functions, RLS runtime, migrations existentes ou codigo da aplicacao.

## Inventario consolidado

| Categoria | Quantidade |
| --- | ---: |
| Tabelas public | 19 |
| Funcoes public | 14 |
| Triggers public | 1 |
| Indices public | 56 |
| Policy statements public | 54 |
| Policy statements storage | 4 |
| Policy statements totais | 58 |
| Buckets esperados | 1 |

## Validacoes

| Validacao | Resultado | Evidencia |
| --- | --- | --- |
| QA `baseline-src` | OK | `npm.cmd run qa:supabase-baseline-src` |
| QA `baseline-candidate` | OK | `npm.cmd run qa:supabase-baseline-candidate` |
| Sintaxe dos scripts Node | OK | `node --check` |
| Sintaxe do script PowerShell | OK | parse via `[scriptblock]::Create` |
| Comparacao candidate vs dump | OK com ressalvas | `reports/supabase-baseline-validation/comparison.json` |
| Validacao SQL local em Supabase/Docker | OK | `reports/supabase-baseline-validation/execution.log` |
| Sanitizacao de evidencias locais | OK | `30-validation-evidence-sanitization.md` |

## Evidencia do Ciclo 5.1

A tentativa anterior de executar `supabase start` diretamente na raiz do projeto falhou antes da baseline candidate porque a CLI aplica automaticamente as migrations historicas em `supabase/migrations/`. A primeira falha ocorreu em `20260705090000_hardening_admin_functions.sql`, ao tentar revogar permissao da assinatura `public.admin_atualizar_perfil(uuid, text, text, text, text)` antes da funcao base existir em um banco limpo.

Essa falha nao e erro da baseline candidate. Ela confirma a causa raiz documentada nos ciclos anteriores: as migrations historicas sao incrementais e dependem da estrutura inicial que antes vivia em `supabase/*.sql`. A correcao do Ciclo 5.1 e validar a candidate em projeto local isolado, com uma pasta `migrations` temporaria contendo exclusivamente `20260716090000_baseline_aruka_v1.sql`.

## Comparacao com runtime

O comparador registrou objetos equivalentes para tabelas, funcoes, triggers e indices. As diferencas classificadas como `EXPECTED_HARDENING_DIFFERENCE` refletem decisoes do Ciclo 4, principalmente endurecimento de policies/grants e exclusoes de overloads admin runtime-only.

Storage permanece como dependencia gerenciada que requer query read-only futura, pois o dump estrutural nao comprova buckets/policies de `storage`.

## Riscos residuais

- A candidate foi aplicada em banco Supabase local descartavel e isolado. O Ciclo 6 ainda precisa definir cutover para impedir reaplicacao indevida da baseline em ambientes existentes.
- Storage runtime ainda precisa verificacao read-only em HML.
- O Ciclo 6 precisa definir cutover para impedir reaplicacao indevida da baseline em ambientes existentes.
- Testes de comportamento RLS/RPC/Storage continuam pendentes para Ciclo 10.

## Proxima acao recomendada

Antes do cutover, revisar o runbook do Ciclo 6, preservar a baseline fora de `supabase/migrations/` ate a decisao de corte e coletar catalog query read-only de Storage em HML.
