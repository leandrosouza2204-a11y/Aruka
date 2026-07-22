# Dashboard Cycle 1 - Clareza Acionavel

## Objetivo

Elevar o Dashboard de painel informativo estavel para central de decisao diaria, sem nova infraestrutura e sem refatoracao ampla.

## Problemas incluidos

- `DASH-P1-001`: periodo/criterio das metricas financeiras.
- `DASH-P1-002`: alertas sem destino contextual.
- `DASH-P1-003`: grafico sem alternativa textual completa.
- `DASH-P1-004`: criterio do check-in pouco transparente.

## Problemas excluidos

- Nova infraestrutura ou staging remoto.
- Redesenho completo do Dashboard.
- Automacao real de WhatsApp.
- Regras profundas de treinos/avaliacoes.
- Estado vazio com fixture dedicada.

## Arquivos provavelmente afetados

- `src/features/dashboard/hooks/useDashboardPage.js`
- `src/features/dashboard/components/DashboardCards.jsx`
- `src/features/dashboard/components/DashboardAlertas.jsx`
- `src/features/dashboard/components/DashboardAtalhos.jsx`
- `src/features/dashboard/components/DashboardCheckin.jsx`
- `src/index.css`

## Comportamento esperado

O usuario deve entender em segundos:

- qual periodo os numeros representam;
- quais alertas exigem acao;
- para onde cada alerta leva;
- quem entra no check-in semanal;
- quais valores compoem o grafico de receita.

## Desktop

Preservar densidade atual e estabilidade sem overflow. Adicionar contexto sem aumentar muito o primeiro fold.

## Mobile

Manter alertas cedo na tela, mas reduzir interpretacao manual e evitar scroll desnecessario para entender a prioridade.

## Acessibilidade

Adicionar texto/tabela do grafico, garantir nomes acessiveis e revisar areas de toque principais.

## Criterios de aceite

- Cards financeiros mostram periodo e regra.
- Alertas abrem destino com filtro, query ou destaque verificavel.
- Receita Mensal possui alternativa textual acessivel.
- Check-in explica criterio de aptidao.
- Viewports obrigatorios continuam sem overflow.
- Console e network seguem sem erros.

## Testes necessarios

- `npm run qa:local:setup`
- `npm run qa:dashboard-authenticated`
- `npm run qa:dashboard-mobile`
- `npm run build`
- `npm run lint`
- teste do guard LOCAL_QA

## Riscos

- Definir periodo financeiro sem alinhamento de produto.
- Prometer filtros que Alunos/Financeiro ainda nao suportam.
- Aumentar texto e piorar mobile.

## Dependencias

- Definicao do periodo financeiro oficial.
- Contrato simples de filtros/destaques nos destinos.

## Definicao de pronto

O ciclo esta pronto quando os quatro P1 estiverem implementados, evidenciados em `LOCAL_QA`, sem regressao de responsividade, build/lint/testes passando e sem acesso a producao.
