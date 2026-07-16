# Local Baseline Runtime Validation

## Decisao

`BASELINE_CANDIDATE_VALIDATED`

## Ambiente

- Data: 2026-07-16.
- Branch: `main`.
- Project-ref remoto preservado: `xrmqdkpxnfvusmenadnf`.
- Docker Client: `29.6.1`.
- Docker Server: `29.6.1`, Docker Desktop `4.82.0`.
- Docker context: `desktop-linux`.
- Supabase CLI: `2.109.1`.

## Causa raiz Docker

O erro anterior foi classificado como `DOCKER_CONFIG_PERMISSION_DENIED` quando executado dentro da sandbox, pois o processo nao conseguia ler `C:\Users\lsdsouza\.docker`. Com permissao elevada, o Docker config ficou legivel, o daemon respondeu e o teste `hello-world` passou. O validador passou a usar `DOCKER_CONFIG` temporario por processo para nao copiar nem alterar a configuracao real do usuario.

## Estrategia isolada

O script `scripts/validate-supabase-baseline-local.ps1` cria um projeto temporario exclusivo em `reports/supabase-baseline-validation/tmp-local-project-<timestamp>` contendo apenas `supabase/config.toml` e `supabase/migrations/20260716090000_baseline_aruka_v1.sql`.

O `project_id` temporario e `aruka_baseline_validation`. O script nao copia `supabase/.temp`, migrations historicas, Edge Functions, seeds ou secrets. Antes de iniciar, confirma que a pasta temporaria de migrations contem exatamente um arquivo SQL e que ele e a baseline candidate.

## Tentativas e correcoes

| Tentativa | Resultado | Causa | Correcao |
| --- | --- | --- | --- |
| 1 | Bloqueada | Docker config inacessivel na sandbox | Diagnostico elevado e `DOCKER_CONFIG` temporario por processo |
| 2 | Falhou antes do SQL | `config.toml` temporario gravado com BOM | Escrita UTF-8 sem BOM via .NET |
| 3 | Falhou antes do SQL | `npx` no projeto temporario sem `package.json` | Uso explicito de `npx.cmd --yes supabase@2.109.1` |
| 4 | Bloqueada por stack local | Containers orfaos do `project_id` temporario | Remocao somente de containers `supabase_*_aruka_baseline_validation` |
| 5 | Falhou por health check | Servicos auxiliares instaveis no Windows | Stack temporario reduzido para SQL/Auth/Storage necessarios |
| 6 | Divergencia de metrica | Catalogo contou indices backing constraints | Validacao passou a contar 56 indices explicitos |
| 7 | Sucesso | Baseline aplicada e catalogo validado | Nenhuma correcao SQL necessaria |

## SHA

- SHA inicial: `745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE`.
- SHA final: `745601B2963721AA060063F1DB250CBF11091EB2C5B74E799A675CCC73CB8DCE`.
- Dump de referencia: `637B21F0729CA765BF3573652254EB855A3BC0C8F255A1F1A3DACF73BA1EC541`.

Nenhuma correcao SQL foi necessaria em `supabase/baseline-src` ou no SQL consolidado.

## Inventario local validado

| Item | Esperado | Obtido |
| --- | ---: | ---: |
| Tabelas public | 19 | 19 |
| Funcoes public | 14 | 14 |
| Triggers public | 1 | 1 |
| Indices public explicitos | 56 | 56 |
| Policies public | 54 | 54 |
| Policies Storage | 4 | 4 |
| Tabelas public com RLS | 19 | 19 |
| Bucket `avaliacoes-fotos` privado | 1 | 1 |
| SECURITY DEFINER sem `search_path` | 0 | 0 |

Evidencias foram gravadas em `reports/supabase-baseline-validation/`.

## Resultado

A baseline candidate foi aplicada integralmente em ambiente Supabase local limpo, descartavel e isolado. O ambiente temporario e o Docker config temporario foram removidos ao final. Nenhum banco remoto, Edge Function, Auth remoto, Storage remoto, secret ou `.env` foi alterado.

## Validacao Ciclo 6

O mesmo fluxo local foi executado usando a pasta oficial `supabase/migrations/` apos o cutover. A baseline oficial aplicou com sucesso, as migrations arquivadas nao foram copiadas e uma migration posterior temporaria validou a ordem de evolucao pos-corte.

## Sanitizacao posterior

O Ciclo 5.3 sanitizou os logs e relatorios locais gerados por esta validacao. As credenciais efemeras do Supabase local foram substituidas por placeholders estaveis e os artefatos temporarios `credential-scan.txt`, `negative-tests/` e `tmp-local-project*/` foram removidos/ignorados para versionamento.
