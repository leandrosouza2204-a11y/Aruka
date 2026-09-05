# Product Roadmap v4 - Cycle 08.3 Closeout

## Objetivo

Encerrar oficialmente o Cycle 08.3 apos o merge funcional da PR #58, o hotfix do QA tipografico da PR #59 e a aprovacao visual manual final da landing e da pagina publica `/sobre`.

## Escopo entregue

O ciclo entregou alinhamento premium/editorial da landing publica e da pagina `/sobre`, refinamento mobile, preservacao de conteudo institucional, navegacao publica validada e guardrails contra regressao tipografica do Manifesto.

## PR funcional #58

- PR: #58
- Titulo: `fix: alinha experiencia premium da landing e sobre no mobile`
- Branch: `fix/product-roadmap-v4-cycle-08-3-mobile-premium-alignment`
- Base: `main`
- Estado: MERGED
- Merge commit: `8bd4a860b030a2427a2af0792d2313919be86502`
- Merged at: `2026-09-04T23:30:44Z`

## Merge funcional

O merge preservou os commits funcionais do refinamento:

- `b6face9` - `fix: alinha experiencia premium da landing e sobre no mobile`
- `2a04089` - `fix: refina pagina sobre no mobile`
- `9255dc1` - `fix: ajusta tipografia e alinhamento da sobre`
- `cd1b0a3` - `fix: uniformiza hierarquia tipografica do manifesto`
- `6e945d3` - `fix: suaviza destaque tipografico do manifesto`
- `a6b7219` - `fix: uniformiza textos do manifesto`

## Hotfix QA

- PR: #59
- Titulo: `fix: corrige validacao tipografica da pagina sobre`
- Branch: `fix/cycle-08-3-about-typography-qa`
- Estado: MERGED
- Merge commit: `ce525de98a79d3ac2c6ba30aede94b18503eb7df`
- Merged at: `2026-09-05T02:22:17Z`

O hotfix corrigiu um falso negativo do validator tipografico em ambiente Windows/CRLF. O CSS aprovado nao foi alterado; o validator passou a normalizar CRLF/LF e localizar a regra tipografica agrupada por seletor.

## Landing mobile premium alignment

A landing recebeu alinhamento visual premium/editorial, mantendo a mensagem comercial, planos, navegacao publica, imagem real do dashboard e contratos de PWA. A composicao mobile foi alinhada ao desktop aprovado.

## Pagina /sobre

A pagina `/sobre` foi refinada como experiencia institucional premium, com hero, origem da marca, Manifesto, Missao, Visao, Valores, CTA, Header e Footer preservados no conteudo final aprovado.

## Hero

PASS. A secao Nossa Historia foi preservada e aprovada na validacao manual.

## Origem da Marca

PASS. A origem da marca foi preservada, incluindo a declaracao de que Aruka e um nome original e nao uma palavra existente em tupi-guarani.

## Manifesto

PASS. Houve varias iteracoes tipograficas no Manifesto:

- inicialmente havia diferencas excessivas de tamanho;
- depois a conclusao ficou diferenciada por peso;
- a validacao final determinou tipografia uniforme;
- o resultado final foi aprovado manualmente.

Contrato final mobile para os cinco blocos narrativos:

- font-family: `"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- font-size: `15.5px`
- font-weight: `400`
- line-height: `1.62`
- opacity: `0.82`

Apenas `Toda evolucao comeca com um caminho.` permanece como headline principal.

## Missao

PASS. Alinhamento central mobile aprovado.

## Visao

PASS. Alinhamento central mobile aprovado.

## Valores

PASS. Cabecalho centralizado e lista estrutural preservada.

## CTA

PASS. CTA final aprovado.

## Responsividade

PASS. O ciclo considerou mobile 320, 360, 375, 390, 412 e 430 px, alem de desktop/tablet 768, 1024, 1280 e 1440 px. A aprovacao final visual foi realizada pelo usuario em dispositivo mobile real.

## Acessibilidade

PASS. Headings, semantica publica, navegacao, foco, leitura mobile e contraste foram preservados no escopo do ciclo.

## QA automatizado

Executado na `main` sincronizada apos o hotfix:

- `qa:about-mobile-visual-polish`: PASS
- `qa:about-final-typography-alignment`: PASS
- `qa:visible-ui-copy`: PASS
- `qa:route-fallback`: PASS
- `lint`: PASS
- `build`: PASS
- `git diff --check`: PASS

## QA visual manual

MANUAL_VISUAL_QA: PASS.

Areas aprovadas:

- Nossa Historia: PASS
- card da marca: PASS
- Origem da Marca: PASS
- Manifesto: PASS
- Missao: PASS
- Visao: PASS
- Valores: PASS
- CTA: PASS
- Header: PASS
- Footer: PASS

## Deployment

- Vercel da PR funcional: SUCCESS
- GitHub validation da PR funcional: SUCCESS
- Vercel da PR hotfix: SUCCESS
- GitHub validation da PR hotfix: SUCCESS

## Guardrails

- Supabase: NO CHANGE
- Production action Supabase: NO
- Financeiro: NO CHANGE
- `package-lock.json`: NO CHANGE
- `.github`: NO CHANGE

## Supabase

Nenhuma migration, RPC, policy, seed, Edge Function, bucket ou acao de producao foi alterada ou executada neste ciclo.

## Financeiro

Nenhum arquivo de `src/features/financeiro/**`, pagamentos, planos ou assinaturas foi alterado pelo Cycle 08.3.

## Decisao final

COMPLETE.

## Progresso do roadmap

- Progresso anterior: Cycle 08.3 aguardava fechamento formal apos PR funcional e hotfix de QA.
- Progresso atualizado: Cycle 08.3 COMPLETE.
- Main final apos hotfix: `ce525de98a79d3ac2c6ba30aede94b18503eb7df`.

## Proximo cycle

Cycle 09 - Exercise Library and Media.

Fonte: planejamento existente em `origin/feat/product-roadmap-v4-cycle-09-exercise-library-media`, arquivo `docs/product-roadmap-v4/16-cycle-09-exercise-library-media.md`, incorporado como base documental do proximo ciclo.
