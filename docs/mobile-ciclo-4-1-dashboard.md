# Mobile Ciclo 4.1 - Dashboard

## Objetivo
Auditar e ajustar a estrutura responsiva do Dashboard mobile, preservando regras de negocio, calculos, queries, banco, Supabase, bottom navigation e sidebar desktop.

## Arquivos analisados
- `src/pages/Dashboard.jsx`
- `src/features/dashboard/components/DashboardPage.jsx`
- `src/features/dashboard/components/DashboardHeader.jsx`
- `src/features/dashboard/components/DashboardOnboardingChecklist.jsx`
- `src/features/dashboard/components/DashboardCards.jsx`
- `src/features/dashboard/components/DashboardCheckin.jsx`
- `src/features/dashboard/components/DashboardAlertas.jsx`
- `src/features/dashboard/components/DashboardAtalhos.jsx`
- `src/features/dashboard/hooks/useDashboardPage.js`
- `src/components/MobileBottomNavigation.jsx`
- `src/index.css`

## Arquivos alterados
- `src/features/dashboard/components/DashboardPage.jsx`
- `src/features/dashboard/components/DashboardAlertas.jsx`
- `src/index.css`
- `scripts/validate-dashboard-mobile-cdp.mjs`
- `package.json`

## Estrutura original
```text
Dashboard
|-- Cabecalho
|-- Erro, quando existe
|-- Onboarding / primeiros passos
|-- Grid de metricas
|   |-- 6 cards de indicadores
|   `-- Check-in semanal
|-- Alertas da consultoria
`-- Receita mensal
```

## Problemas encontrados na auditoria inicial
- Em 320 a 430px nao havia overflow horizontal: `document`, `body` e `main` ficaram com `clientWidth/scrollWidth` iguais.
- A primeira dobra mobile priorizava onboarding compacto e metricas; os alertas de acao e links de decisao ficavam abaixo.
- A acao `Enviar check-ins` ficava depois de todos os cards de metricas no grid mobile.
- Havia uma regra antiga de `overflow-x: hidden` aplicada ao `.dashboard-page`, que podia mascarar problemas em vez de corrigir largura estrutural.
- O validador inicial tratava desktop como se tivesse bottom navigation, gerando falso negativo na regressao desktop.

## Prioridade mobile aplicada
No mobile, a ordem visual passa a ser:
```text
1. Cabecalho
2. Alertas da consultoria
3. Grid de metricas, com Check-in semanal antes dos indicadores
4. Onboarding / primeiros passos
5. Receita mensal
```

A ordem desktop foi preservada.

## Correcoes aplicadas
- `DashboardPage` recebeu `data-page="dashboard"` para medicao automatizada estavel.
- Blocos principais receberam wrappers de escopo:
  - `.dashboard-onboarding-section`
  - `.dashboard-stats-section`
  - `.dashboard-alerts-section`
  - `.dashboard-chart-section`
- `DashboardAlertas` recebeu `.dashboard-alerts-panel`.
- O mobile usa `order` CSS para priorizar alertas e acoes sem duplicar consultas nem renderizar componentes duas vezes.
- `.checkin-card` usa `order: -1` no mobile para aparecer antes das metricas.
- O escopo real do Dashboard recebeu `box-sizing`, `width: 100%`, `max-width: 100%` e `min-width: 0`.
- A regra de mascara `overflow-x: hidden` foi neutralizada para `.dashboard-page`.
- Alertas mobile foram ajustados para uma coluna, com acoes em largura completa e area de toque de 44px.
- O script `qa:dashboard-mobile` foi criado para autenticar, medir e gerar evidencias sem alterar dados.

## Resultados autenticados
Comando executado:
- `npm run qa:dashboard-mobile`

Autenticacao:
- Sessao QA autenticada/reaproveitada com sucesso.
- Credenciais carregadas apenas de `.env.qa.local`.
- Nenhum e-mail, senha, token, cookie, localStorage ou sessionStorage foi registrado.

## Medicoes por viewport
| Viewport | Inicio documento | Inicio body | Inicio main | Final documento | Final body | Final main | Resultado |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 320x800 | 320/320 | 320/320 | 320/320 | 320/320 | 320/320 | 320/320 | OK |
| 360x800 | 360/360 | 360/360 | 360/360 | 360/360 | 360/360 | 360/360 | OK |
| 375x812 | 375/375 | 375/375 | 375/375 | 375/375 | 375/375 | 375/375 | OK |
| 390x844 | 390/390 | 390/390 | 390/390 | 390/390 | 390/390 | 390/390 | OK |
| 412x915 | 412/412 | 412/412 | 412/412 | 412/412 | 412/412 | 412/412 | OK |
| 430x932 | 430/430 | 430/430 | 430/430 | 430/430 | 430/430 | 430/430 | OK |
| 1024x768 | 1009/1009 | 1009/1009 | 1009/1009 | 1009/1009 | 1009/1009 | 1009/1009 | OK |
| 1366x768 | 1351/1351 | 1351/1351 | 1091/1091 | 1351/1351 | 1351/1351 | 1091/1091 | OK |
| 1440x900 | 1425/1425 | 1425/1425 | 1165/1165 | 1425/1425 | 1425/1425 | 1165/1165 | OK |

## Primeira dobra mobile
Depois do ajuste, a primeira dobra em 320 a 430px mostra:
- identificacao da tela (`Dashboard`);
- alertas da consultoria;
- acoes dos alertas, como `Ver alunos`, `Ver vencimentos` e, nas larguras maiores, `Abrir financeiro`.

## Cards e grids
- Cards de metricas continuam em uma coluna em 320 a 480px.
- Entre 481 e 768px, o grid de metricas preserva duas colunas quando ha espaco.
- `Check-in semanal` aparece antes das metricas no mobile e preserva sua posicao no desktop.
- Valores financeiros longos continuam contidos no card.

## Alertas e pendencias
- Alertas passam a ser prioridade visual no mobile.
- Cada alerta usa uma coluna em telas pequenas.
- Acoes ficam visiveis e com area de toque adequada.
- Nao houve alteracao na logica que define pendencias.

## Receita mensal
- O grafico desktop continua preservado.
- O mobile usa a visualizacao em linhas ja existente.
- Nenhum wrapper de grafico excedeu a viewport nos testes.

## Estados vazios, carregamento e erro
- A conta QA possui dados e alertas, entao o estado vazio completo nao foi exercitado neste ciclo.
- Estados de carregamento existentes foram mantidos.
- Tratamento de erro existente foi mantido.

## Acessibilidade e toque
- Links de alerta permanecem links semanticos.
- Areas de toque dos alertas foram elevadas para pelo menos 44px no mobile.
- Nao foi adicionado `tabindex` positivo.
- Nenhuma funcionalidade nova passou a depender de hover.

## Screenshots geradas
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-320-inicio.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-320-final.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-360-inicio.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-360-final.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-375-inicio.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-375-final.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-390-inicio.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-390-final.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-412-inicio.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-412-final.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-430-inicio.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-430-final.png`
- `tmp-responsive-screenshots/dashboard-mobile/dashboard-desktop-1366.png`

## Validacoes tecnicas
- `npm run qa:dashboard-mobile`: passou.
- `npm run lint`: passou.
- `npm run build`: passou.
- `git diff --check`: passou.
- `git check-ignore -v .env.qa.local`: confirmou `.gitignore:31:.env.qa.local`.
- `git ls-files .env.qa.local`: sem retorno.

## Nao alterado
- Banco.
- Supabase.
- Queries.
- Calculos dos indicadores.
- Regras de negocio.
- Bottom navigation.
- Sidebar desktop.

## Pendencias futuras
- Auditar um estado QA completamente vazio em ciclo proprio.
- Avaliar onboarding completo/incompleto com usuarios em diferentes fases.
- Considerar um bloco explicito de acoes rapidas em ciclo futuro, sem criar novas rotas ou novas regras neste ciclo.

## Status
Aprovado na validacao autenticada do Dashboard mobile e desktop.
