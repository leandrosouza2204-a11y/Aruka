# Cycle 02 - Mobile Core Layout Validation And Fixes

## Escopo

- Missao: `ARUKA_FUNCTIONAL_IMPROVEMENT_CYCLE_02 MOBILE_CORE_LAYOUT_VALIDATION_AND_FIXES`.
- Finding alvo: `F-003` (`P1`) - risco de overflow/colapso em layouts core no mobile.
- Rotas-alvo: Dashboard, Alunos, Treinos, Avaliacoes, Planos, Financeiro, Admin logs e Admin usuarios.
- Fora de escopo: `F-004` a `F-010`, Supabase, CI, migrations, `package-lock.json`, copy funcional, fallback semantico, banners de aluno e fluxo de workout delivery.

## Alteracoes

- Adicionada camada CSS mobile em `src/index.css` para estabilizar largura dos containers centrais, cards, filtros, cabecalhos, linhas de card, acoes, modais e regioes com tabela.
- O ajuste remove margem lateral herdada em mobile, aplica `box-sizing`, `min-width: 0`, `max-width: 100%` e largura de viewport controlada em modais.
- Tabelas e regioes naturalmente largas continuam com rolagem horizontal interna via `.app-table-scroll`, `.responsive-table` e `.admin-table-scroll`.
- Adicionado `scripts/validate-core-mobile-layout.mjs` e script `npm run qa:core-mobile-layout`.

## Matriz Validada

Viewports mobile cobertos pelo script:

- `320x800`
- `360x800`
- `375x812`
- `390x844`
- `414x896`

Viewports desktop de regressao:

- `1280x900`
- `1440x900`

O resultado detalhado foi gravado em `reports/product-audit-v2/cycle-02-mobile-matrix.csv`.

## Limitacao De Runtime

O ambiente desta execucao nao forneceu uma sessao autenticada navegavel para medir `document.scrollWidth` nas rotas protegidas. O ciclo registra explicitamente:

`AUTHENTICATED_RUNTIME_QA_ENVIRONMENT_BLOCKED`

Por isso, o status do novo QA e `PASS_STATIC_WITH_RUNTIME_LIMITATION`: as guardas de layout existem e a matriz foi gerada, mas a medicao visual autenticada por navegador/CDP ainda deve ser executada quando houver `CORE_MOBILE_LAYOUT_BASE_URL` com sessao autenticada.

## Evidencia

- `npm run qa:core-mobile-layout` - PASS static com limitacao de runtime autenticado registrada.
- `reports/product-audit-v2/cycle-02-result.json`
- `reports/product-audit-v2/cycle-02-mobile-matrix.csv`
