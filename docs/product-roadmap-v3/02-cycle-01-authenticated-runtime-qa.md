# Roadmap v3 Cycle 01 - Authenticated Runtime QA

## 1. Problema

A Product Audit v2 fechou funcionalmente, mas a verificacao visual autenticada continuou limitada. Os QAs `qa:core-mobile-layout`, `qa:finance-modals` e `qa:renovacao-mobile` dependem de aplicacao navegavel, Chrome com CDP e sessao autenticada.

## 2. Root Cause

O erro anterior `fetch failed` era generico demais. A auditoria do tooling mostrou que os scripts financeiros chamavam diretamente `http://127.0.0.1:9222/json/...`; quando CDP nao estava ativo, o erro bruto era exibido sem classificacao. O precheck atual separa base URL, CDP, target do navegador e sessao autenticada.

## 3. Arquitetura Runtime

Contrato do ambiente:

- `ARUKA_QA_BASE_URL`: URL da aplicacao local/staging.
- `ARUKA_QA_CDP_URL`: URL do Chrome DevTools Protocol, default `http://127.0.0.1:9222`.
- `ARUKA_QA_AUTH_ROUTE`: rota autenticada de referencia, default `/dashboard`.
- Navegador Chrome/Chromium aberto com remote debugging em localhost.
- Sessao autenticada manualmente pelo usuario.

Aliases preservados:

- `CORE_MOBILE_LAYOUT_BASE_URL`
- `QA_BASE_URL`
- `CDP_URL`

## 4. Seguranca

- Nao versionar credenciais, cookies, localStorage, sessionStorage, JWT ou tokens.
- Usar CDP somente em `127.0.0.1`.
- Nao abrir remote debugging em `0.0.0.0`.
- Preferir profile dedicado fora do repositorio.

## 5. Bootstrap

PowerShell:

```powershell
npm run dev
$env:ARUKA_QA_BASE_URL = "http://localhost:5173"
$env:ARUKA_QA_CDP_URL = "http://127.0.0.1:9222"
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="$env:TEMP\aruka-chrome-qa" --no-first-run "http://localhost:5173/login"
```

## 6. Autenticacao

Autentique manualmente no navegador aberto para QA. O ciclo nao adiciona automacao de login com senha nem grava credenciais em arquivos versionados.

## 7. Precheck

Comandos:

```powershell
npm run qa:authenticated-runtime-precheck
```

Markers:

- `RUNTIME_BASE_URL_REACHABLE=YES|NO`
- `CDP_REACHABLE=YES|NO`
- `BROWSER_TARGET_FOUND=YES|NO`
- `AUTH_SESSION_PRESENT=YES|NO`
- `AUTHENTICATED_ROUTE_REACHABLE=YES|NO`
- `RUNTIME_PRECHECK=PASS|BLOCKED`

## 8. Core Mobile

`qa:core-mobile-layout` agora reconhece `ARUKA_QA_BASE_URL` e aliases legados. O validador tambem aceita o formato atual do script npm com `--env-file=.env.qa.local`, evitando falso negativo em `packageScriptPresent`.

## 9. Finance Modals

`qa:finance-modals` agora classifica falhas de runtime com marker acionavel em vez de retornar apenas `fetch failed`. O QA tambem respeita o estado real das fixtures locais: quando `Em acompanhamento` nao possui registros acionaveis e `Encerrados` possui historico, ele troca para a visao `Encerrados` antes de abrir `Ver historico`.

## 10. Renovacao Mobile

`qa:renovacao-mobile` usa a mesma classificacao de runtime. Mutacoes reais continuam proibidas fora de ambiente local/staging controlado. O QA tambem respeita o estado real das fixtures locais: quando `Em acompanhamento` nao possui registros acionaveis e `Encerrados` possui alunos renovaveis, ele troca para a visao `Encerrados` antes de abrir `Renovar plano`.

O QA de renovacao agora mede overflow dentro do subtree do modal, nao em toda a pagina de fundo. A falha anterior de 8 elementos vinha da tabela financeira desktop sob o overlay (`table.app-table.financeiro-desktop-table`, `colgroup`, `col`, `thead`, `tr`, `th`) em `800x360`, `844x390`, `915x412` e `1024x768`. O modal de renovacao tambem recebeu hardening de layout com shell flex escopado, altura maxima por viewport e rolagem interna para landscape/tablet/desktop compacto.

## 11. Comandos

```powershell
npm run test:authenticated-runtime
npm run qa:authenticated-runtime-precheck
npm run qa:authenticated-runtime
```

## 11.1 Isolamento de Estado do Browser

Os QAs financeiros autenticados usam uma pagina CDP isolada dentro do mesmo profile autenticado. Antes de cada fluxo, o runner define viewport, navega explicitamente para `/financeiro`, aguarda app ready, fecha dialogs/modais e menus via `Escape`/clique legitimo e reseta scroll. Ao final, fecha modais/menus, navega para rota neutra `/`, registra estado final e fecha a pagina CDP.

Estado registrado sem dados sensiveis:

- `QA_START_URL`
- `QA_START_VIEWPORT`
- `QA_START_MODAL_COUNT`
- `QA_START_OPEN_MENU_COUNT`
- `QA_START_SCROLL_Y`
- `QA_END_URL`
- `QA_END_VIEWPORT`
- `QA_END_MODAL_COUNT`
- `QA_END_OPEN_MENU_COUNT`
- `QA_END_SCROLL_Y`

## 12. Troubleshooting

- `BASE_URL_UNAVAILABLE`: inicie o app e defina `ARUKA_QA_BASE_URL`.
- `CDP_UNAVAILABLE`: abra Chrome com `--remote-debugging-port=9222` em localhost.
- `CDP_TARGET_NOT_FOUND`: abra pelo menos uma aba no Chrome QA.
- `AUTH_SESSION_REQUIRED`: autentique manualmente no Aruka dentro do Chrome QA.
- `AUTH_ROUTE_FAILURE`: a rota autenticada nao carregou mesmo com sessao presente.
- `RUNTIME_ENVIRONMENT_BLOCKED`: falha externa de runtime antes de classificar o fluxo funcional.

## 13. Resultados

Nesta execucao:

- Precheck: `PASS`
- Base URL: `YES`
- CDP: `YES`
- Browser target: `YES`
- Browser origin match: `YES`
- Sessao autenticada: `YES`
- Rota autenticada: `YES`
- Core mobile layout: `PASS_RUNTIME_READY`
- Finance modals: `PASS_RUNTIME`
- Finance root cause fixed: `FINANCE_HISTORY_QA_FIXTURE_STATE_MISMATCH`
- Renovacao mobile: `PASS_RUNTIME`
- Renovacao root cause fixed: `RENEWAL_QA_FIXTURE_STATE_MISMATCH`
- Renovacao layout root cause fixed: `RENEWAL_MODAL_QA_OVERFLOW_SCOPE_INCLUDED_BACKGROUND_TABLE`
- Renovacao overflow before: 8 elementos de tabela financeira de fundo em `800x360`, `844x390`, `915x412` e `1024x768`.
- Renovacao overflow after: `0` elementos excedendo viewport no subtree do modal em todos os viewports validados.
- Browser state root cause: `AUTHENTICATED_QA_SHARED_BROWSER_STATE_LEAKAGE`
- Browser state isolation: `PASS`
- Finance -> Renewal -> Finance: `PASS`
- Authenticated runtime run 1: `PASS`
- Authenticated runtime run 2: `PASS`
- Auth session reused: `YES`
- Login repeated: `NO`
- Functional failures: `0`
- Environment blockers: `0`
- Regressions: `qa:core-mobile-layout`, `qa:modal-accessibility-parity`, `qa:finance-mutation-confirmations`, `qa:contextual-error-feedback`, `test:authenticated-runtime`, `lint` e `build` passaram.

## 14. Limitacoes

O tooling esta pronto para diferenciar ambiente, autenticacao, navegacao e falha funcional. A execucao runtime autenticada entrou no fluxo real, corrigiu o QA do historico financeiro, corrigiu o QA de selecao da renovacao, validou o modal de renovacao em mobile, landscape, tablet e desktop compacto e fechou a repetibilidade da suite autenticada com duas execucoes consecutivas.

## 15. Proximo Ciclo

Cycle 01 esta pronto para `READY_FOR_ROADMAP_V3_CYCLE_02`.

Next action: `IMPLEMENT_FINANCE_WORKFLOW_RELIABILITY_PASS`.
