# Auditoria de Produto v1.0 - Dashboard Aruka (Baseline Técnica)

> **Status:** baseline técnica preliminar. Este documento foi produzido por inspeção de código e arquitetura. A auditoria funcional autenticada em desktop, tablet e mobile ainda depende da execução no ambiente de homologação com usuário QA.

## 1. Resumo executivo

Estado geral: o Dashboard atual e funcional e compreensivel, mas ainda opera mais como painel informativo do que como central de decisao. Ele mostra metricas essenciais de alunos e financeiro, orienta primeiros passos e oferece alertas acionaveis, porem ainda nao contextualiza suficientemente o periodo dos numeros, nao inclui sinais de treinos/avaliacoes e nao consolida uma fila clara de prioridades do dia.

Pontos fortes:

- Checklist de onboarding para plano, aluno e financeiro.
- Alertas com links para Alunos e Financeiro.
- Check-in semanal com acao direta.
- Receita Mensal com historico de seis meses.
- Arquitetura simples, com carregamento paralelo de alunos, pagamentos e planos.

Principais problemas:

- As metricas financeiras nao deixam claro o periodo considerado.
- A auditoria visual autenticada nao foi reproduzida porque `.env.qa.local` esta ausente nesta branch.
- O grafico nao possui alternativa textual acessivel.
- Mensagens de erro podem expor detalhe tecnico.
- Dashboard nao consulta treinos nem avaliacoes, apesar de o produto esperar esses sinais na visao central.

Riscos para comercializacao:

- Usuario novo entende o proximo cadastro, mas pode nao perceber todo o valor do produto sem dados.
- Usuario diario recebe alertas, mas ainda precisa procurar contexto apos alguns cliques.
- Gestor pode interpretar receita prevista/recebida/pendente com denominador errado.
- Sem validacao visual autenticada atual, mobile nao deve ser considerado aprovado para release sem nova execucao.

Maior oportunidade de valor: transformar o Dashboard de painel informativo em central de decisao diaria, com periodo explicito, alertas contextuais, tarefas recomendadas e sinais de treinos/avaliacoes.

Conclusao desktop: 3/5. A estrutura e produtiva e organizada, mas falta contexto executivo e validacao visual atual em notebook/desktop autenticado.

Conclusao mobile: 3/5. Ha CSS e QA dedicado para mobile, mas esta auditoria nao conseguiu gerar evidencias visuais autenticadas; o diagnostico mobile fica condicionado a reexecucao do QA.

## 2. Escopo e metodo

Data da auditoria: 2026-07-21.

Ambiente:

- Branch: `docs/validate-required-check-light-path`.
- `git status --short` inicial: limpo.
- Runtime local: Vite em `http://127.0.0.1:5173/dashboard`.
- Usuario de teste: nao autenticado nesta execucao; `.env.qa.local` ausente.
- Origem dos dados: nao confirmada por login; avaliacao de dados feita por inspecao de services e hook.

Ferramentas e comandos:

- `git branch --show-current`
- `git status --short`
- `rg`
- `Get-Content`
- `npm.cmd run dev -- --host 127.0.0.1`
- `Invoke-WebRequest http://127.0.0.1:5173/dashboard`
- `cmd /c npm run qa:dashboard-mobile`
- `npm.cmd run build`
- `npm.cmd run lint`

Viewports previstos:

- Desktop: 1366x768, 1440x900, 1920x1080, zoom 125% em 1366x768.
- Tablet: 768x1024 e 1024x768.
- Mobile: 360x800, 390x844 e 412x915.

Limitacao: os viewports foram mapeados pelo script existente e por CSS, mas nao testados visualmente nesta execucao porque o QA autenticado falhou por ausencia de `.env.qa.local`.

## 3. Mapa tecnico atual

| Arquivo | Componente ou responsabilidade | Papel no Dashboard | Observacao relevante |
| --- | --- | --- | --- |
| `src/App.jsx` | Rotas e protecoes | Define `/dashboard` com `ProtectedRoute`, `SubscriptionRoute`, `LegalRoute` e `AppMobileNav`. | Dashboard e protegido por autenticacao, assinatura e aceite legal. |
| `src/pages/Dashboard.jsx` | Pagina wrapper | Renderiza `DashboardPage`. | Arquivo fino e sem logica propria. |
| `src/features/dashboard/components/DashboardPage.jsx` | Composicao da tela | Junta sidebar, header, onboarding, metricas, check-in, alertas e grafico. | Usa estilos inline e classes CSS responsivas. |
| `src/features/dashboard/hooks/useDashboardPage.js` | Dados e calculos | Busca alunos, pagamentos e planos; calcula metricas, alertas e receita mensal. | Nao consulta treinos ou avaliacoes. |
| `DashboardHeader.jsx` | Hero da pagina | Exibe "Dashboard" e descricao. | Bom contexto geral, sem data/periodo. |
| `DashboardOnboardingChecklist.jsx` | Onboarding | Orienta criar plano, aluno e financeiro. | Forte para primeiro acesso. |
| `DashboardCards.jsx` | Cards de metricas | Renderiza seis indicadores principais. | Cards nao sao clicaveis; icones parecem decorativos. |
| `DashboardCheckin.jsx` | Check-in semanal | Mostra alunos aptos e abre modal com envio manual via WhatsApp. | Acao util, mas criterio de aptidao nao fica transparente. |
| `DashboardAlertas.jsx` | Alertas | Lista alertas de vencidos, vencendo e receita pendente. | Links levam a modulos gerais. |
| `DashboardAtalhos.jsx` | Receita Mensal | Grafico de pagamentos confirmados nos ultimos 6 meses. | Sem alternativa textual estruturada. |
| `src/services/alunosService.js` | Query `alunos` | Busca alunos do usuario por `user_id`. | Ordena por vencimento. |
| `src/services/pagamentosService.js` | Query `pagamentos` | Busca pagamentos e suporta financeiro. | Fonte de Receita Recebida e historico mensal. |
| `src/services/planosService.js` | Query `planos` | Busca planos e parcelamento. | Usado para status financeiro dos alunos. |
| `src/index.css` | Responsividade | Regras mobile, bottom nav, cards e grafico. | Possui varias regras especificas do Dashboard. |
| `scripts/validate-dashboard-mobile-cdp.mjs` | QA mobile/desktop | Mede overflow, primeira dobra, screenshots e autenticacao por CDP. | Nao rodou por falta de `.env.qa.local`. |
| `docs/mobile-ciclo-4-1-dashboard.md` | Documentacao existente | Historico de auditoria/correcao mobile do Dashboard. | Evidencia previa, nao substitui revalidacao atual. |

## 4. Inventario da interface

| Elemento | Informacao exibida | Acao disponivel | Fonte dos dados | Desktop | Mobile |
| --- | --- | --- | --- | --- | --- |
| Header | "Dashboard" e descricao | Nenhuma | Estatica | Primeiro bloco, boa orientacao | Ocupa inicio; precisa revalidacao visual |
| Checklist | Plano, aluno, pagamento | Links para `/planos`, `/alunos`, `/financeiro` | `planos.length`, `alunos.length`, `pagamentos.length` | Bom onboarding | Empilhado; historico indica ordem ajustada |
| Total de Alunos | Contagem de alunos | Nenhuma | `alunos.length` | Claro | Claro, mas ocupa card proprio |
| Receita Prevista | Soma de valores dos alunos | Nenhuma | `alunos.valor` | Util, periodo ambiguo | Mesmo problema |
| Receita Recebida | Soma dos pagamentos | Nenhuma | `pagamentos.valor` | Util, periodo ambiguo | Mesmo problema |
| Receita Pendente | Prevista menos recebido no contrato atual | Nenhuma | alunos + pagamentos | Acionavel por alerta separado | Mesmo problema |
| Alunos Vencendo | Contagem por status | Nenhuma | status calculado | Relevante | Relevante |
| Alunos Vencidos | Contagem por status | Nenhuma | status calculado | Relevante | Relevante |
| Check-in semanal | Alunos aptos | Botao abre modal | alunos nao vencidos | Acao clara | Deve ser revalidado em 360 px |
| Modal Check-in | Nome e WhatsApp | Botao "Enviar" | alunos + WhatsApp | Usa `AccessibleModal` | Modal precisa revalidacao visual |
| Alertas | Pendencias operacionais | Links para Alunos/Financeiro | metricas derivadas | Forte valor | Deve aparecer cedo no mobile |
| Receita Mensal | Pagamentos 6 meses | Nenhuma | pagamentos | Grafico simples | Versao em barras horizontais via CSS |
| Sidebar | Modulos principais | Navegacao | Rotas | Produtiva | Oculta/substituida por bottom nav |
| Bottom navigation | Inicio e atalhos mobile | Navegacao | Rotas | Nao aplicavel | Essencial; revalidar sobreposicao |

## 5. Jornada principal

1. Usuario acessa `/dashboard`.
2. Sistema valida autenticacao, assinatura e aceite legal.
3. Dashboard busca alunos, pagamentos e planos em paralelo.
4. Usuario le header, checklist, metricas, check-in, alertas e grafico.
5. Usuario identifica pendencia, por exemplo aluno vencido ou pagamento pendente.
6. Usuario clica em "Ver alunos", "Ver vencimentos" ou "Abrir financeiro".
7. Usuario navega ao modulo relacionado.
8. Retorno ocorre por sidebar/bottom navigation.

Atritos:

- Alertas nao preservam filtro/contexto explicitamente.
- Algumas metricas nao tem acao direta no card.
- Sem ultima atualizacao, o usuario nao sabe se os dados sao atuais.
- Sem periodo explicito, a leitura financeira exige inferencia.
- Nao ha fila "o que fazer agora".

## 6. Avaliacao por criterio

### Desktop

| Criterio | Nota | Justificativa |
| --- | ---: | --- |
| Clareza visual | 3 | Layout e rotulos sao claros, mas periodo financeiro e contexto temporal faltam. |
| Facilidade de aprendizado | 4 | Checklist ajuda muito o usuario novo. |
| Quantidade de cliques | 3 | Acoes principais estao a um clique, mas destino ainda e generico. |
| Velocidade para tarefas | 3 | Check-in e alertas aceleram rotina, mas nao filtram resolucao. |
| Organizacao das informacoes | 3 | Estrutura coerente, mas sinais de treinos/avaliacoes estao ausentes. |
| Aparencia profissional | 3 | Cards, sombras e badges parecem SaaS utilizavel. Loading/erro reduzem acabamento. |
| Percepcao de valor | 3 | Mostra valor financeiro e operacional, mas ainda pouco executivo. |
| Acessibilidade | 3 | Modal e links sao bons; grafico e icones precisam ajuste. |
| Consistencia | 3 | Usa padroes do app, mas tem muito estilo inline local. |

### Mobile

| Criterio | Nota | Justificativa |
| --- | ---: | --- |
| Clareza visual | 3 | Componentes possuem regras mobile, mas nao houve screenshot autenticado atual. |
| Facilidade de aprendizado | 3 | Checklist deve funcionar, mas pode gerar scroll inicial. |
| Quantidade de cliques | 3 | Acoes continuam simples; destinos ainda genericos. |
| Velocidade para tarefas | 3 | Alertas e check-in ajudam, dependendo da ordem visual. |
| Organizacao das informacoes | 3 | Historico do projeto indica ajustes de ordem; requer revalidacao. |
| Aparencia profissional | 3 | CSS mobile e bottom nav existem; evidencia atual limitada. |
| Percepcao de valor | 3 | Valor existe, mas pode ficar diluido em scroll. |
| Acessibilidade | 2 | Areas e foco precisam validacao real em 360 px. |
| Consistencia | 3 | Usa padroes globais mobile. |
| Responsividade | 3 | Script existente cobre overflow; nao rodou nesta auditoria. |
| Uso com uma mao | 3 | Bottom nav ajuda; modal e acoes precisam screenshot/teste. |

## 7. Pontos fortes

- O onboarding cria um caminho inicial concreto e deve ser preservado.
- Alertas sao um bom inicio de central de decisao.
- O check-in semanal e uma acao diretamente ligada ao trabalho do personal.
- O carregamento paralelo reduz risco de lentidao artificial.
- A existencia de QA mobile dedicado mostra maturidade de manutencao.

## 8. Problemas encontrados

| ID | Titulo | Plataforma | Cenario | Descricao | Evidencia | Impacto | Causa provavel | Recomendacao | Prioridade | Esforco | Dependencias | Criterio de aceite |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DASH-P1-001 | Periodo financeiro ambiguo | Ambas | Uso diario/gestor | Receita prevista, recebida e pendente nao deixam claro periodo/denominador. | `useDashboardPage.js`, legendas dos cards. | Pode gerar decisao financeira errada. | Falta de definicao explicita de periodo na UI. | Exibir periodo e regra de calculo. | P1 | Medio | Produto | Cada card financeiro mostra criterio claro. |
| DASH-P1-002 | QA visual autenticado indisponivel | Ambas | Auditoria | Viewports nao foram comprovados por screenshot atual. | `.env.qa.local: not found`. | Risco para release mobile/desktop. | Credenciais QA ausentes. | Reexecutar QA com ambiente seguro. | P1 | Baixo | Ambiente QA | Evidencias geradas para viewports exigidos. |
| DASH-P1-003 | Grafico sem alternativa textual | Ambas | Acessibilidade | Receita Mensal depende de barras visuais. | `DashboardAtalhos.jsx`. | Leitor de tela perde informacao. | Grafico feito com `div`s sem tabela/resumo. | Adicionar resumo acessivel. | P1 | Baixo | Nenhuma | Meses e valores acessiveis por texto. |
| DASH-P1-004 | Erro tecnico exposto | Ambas | Falha de consulta | UI concatena `error.message`. | `setErro(...)`. | Reduz confianca e pode confundir. | Tratamento tecnico direto no hook. | Mensagem amigavel + log interno. | P1 | Baixo | Padrao de erro | Erro nao revela detalhe tecnico cru. |
| DASH-P2-001 | Loading pouco refinado | Ambas | Carregamento | Cards exibem `...`. | `valor: carregando ? "..."`. | Parece provisiorio. | Falta de skeleton/status. | Usar skeleton consistente. | P2 | Baixo | Componentes existentes | Layout estavel com feedback claro. |
| DASH-P2-002 | Alertas sem filtro contextual | Ambas | Resolver pendencias | Links abrem modulos gerais. | `to: "/alunos"` e `to: "/financeiro"`. | Usuario precisa procurar o item. | Falta de contrato de filtros. | Navegar com filtro/destaque. | P2 | Medio | Alunos/Financeiro | Destino abre contexto prometido. |
| DASH-P2-003 | Ausencia de alertas sem feedback positivo | Ambas | Operacao em dia | Secao some quando nao ha alertas. | `return null`. | Perde reforco de confianca. | Estado vazio nao definido. | Mostrar estado positivo. | P2 | Baixo | Nenhuma | Usuario entende que esta tudo em dia. |
| DASH-P2-004 | Sem ultima atualizacao/retry | Ambas | Uso diario | Nao ha refresh nem data/hora. | Hook carrega apenas no mount. | Dado pode parecer stale. | Hook nao expoe reload. | Adicionar carimbo e retry/refresh. | P2 | Baixo | Hook | Usuario recarrega sem refresh da pagina. |
| DASH-P2-005 | Treinos e avaliacoes ausentes | Ambas | Visao central | Dashboard nao sinaliza revisoes de treinos ou avaliacoes vencidas. | Hook consulta apenas alunos/pagamentos/planos. | Reduz valor especifico fitness. | Escopo inicial financeiro/alunos. | Avaliar indicadores desses modulos. | P2 | Alto | Services e regras | Dashboard cobre pendencias fitness essenciais. |
| DASH-P2-006 | Falta fila de prioridades do dia | Ambas | Profissional diario | Usuario ve numeros, mas nao uma lista priorizada de acoes. | Alertas existem separados. | Aumenta carga cognitiva. | Falta camada de recomendacao. | Criar bloco "Hoje". | P2 | Alto | Produto | Usuario sabe a proxima acao em segundos. |
| DASH-P3-001 | Possivel problema de encoding visual | Ambas | Conteudo | Terminal mostra mojibake em strings. | `mÃƒÂ©tricas`, `perÃƒÂ­odo`. | Pode prejudicar profissionalismo se renderizar assim. | Encoding de arquivo ou terminal. | Confirmar visualmente e padronizar se necessario. | P3 | Baixo | QA visual | Portugues renderiza corretamente. |
| DASH-P3-002 | Icones decorativos sem ocultacao explicita | Ambas | Acessibilidade | Icones podem gerar ruido em leitores. | `DashboardCards.jsx`. | Baixo, mas afeta polimento. | SVG sem `aria-hidden` no uso. | Marcar decorativos. | P3 | Baixo | Padrao lucide | Leitor anuncia conteudo util. |
| DASH-P3-003 | Criterio de check-in pouco claro | Ambas | Uso diario | "Alunos aptos" nao explica regra. | `alunosAtivosCheckin` filtra nao vencidos. | Usuario pode duvidar da contagem. | Regra escondida no hook. | Explicar criterio. | P3 | Baixo | Produto | Card explica quem entra na lista. |

Nao foram classificados P0 nesta auditoria porque nao houve evidencia de bloqueio total, dado incorreto confirmado em runtime ou falha grave comprovada em viewport.

## 9. Priorizacao

- P0: 0
- P1: 4
- P2: 6
- P3: 3

P1 deve abrir o primeiro ciclo porque combina risco comercial, acessibilidade e confianca nos dados. P2 concentra evolucao de produtividade e decisao diaria. P3 fica para polimento apos a revalidacao visual.

## 10. Matriz impacto x esforco

| Quadrante | Itens |
| --- | --- |
| Alto impacto / baixo esforco | DASH-P1-002, DASH-P1-003, DASH-P1-004, DASH-P2-003, DASH-P2-004 |
| Alto impacto / alto esforco | DASH-P1-001, DASH-P2-005, DASH-P2-006 |
| Baixo impacto / baixo esforco | DASH-P2-001, DASH-P3-001, DASH-P3-002, DASH-P3-003 |
| Baixo impacto / alto esforco | Nenhum recomendado nesta etapa |

Quick wins: revalidar QA com credenciais, alternativa textual do grafico, mensagem de erro amigavel, estado positivo sem alertas e ultima atualizacao.

## 11. Desktop versus mobile

| Tema | Desktop | Mobile | Decisao recomendada |
| --- | --- | --- | --- |
| Primeira dobra | Tende a mostrar hero e inicio do onboarding/metricas. | Historico indica reordenacao, mas nao validado nesta execucao. | Revalidar screenshots antes de release. |
| Metricas | Cards claros, periodo ambiguo. | Cards empilhados, possivel scroll longo. | Explicitar periodo e priorizar metricas criticas. |
| Graficos | Barras simples e legiveis por largura. | Versao horizontal existe. | Adicionar resumo textual; avaliar se mobile deve resumir ainda mais. |
| Acoes | Checklist, alertas e check-in. | Bottom nav e botoes empilhados. | Garantir areas de toque e ordem de prioridade. |
| Navegacao | Sidebar produtiva. | Bottom nav essencial. | Manter, validar sobreposicao. |
| Densidade | Boa para SaaS operacional. | Pode ficar extensa. | Criar resumo "Hoje" no topo. |
| Legibilidade | Numeros grandes e rotulos claros. | Necessita teste em 360 px. | Reexecutar QA visual. |
| Estados vazios | Checklist ajuda; grafico vazio simples. | Pode parecer scroll de cards vazios. | Criar estado vazio mais narrativo. |
| Carregamento | `...` reduz acabamento. | Mesmo problema, mais perceptivel. | Skeleton/status. |
| Acessibilidade | Modal bom; grafico fraco. | Foco/toque nao validado. | Ciclo de acessibilidade. |

## 12. Percepcao de valor

O que ja parece premium:

- Onboarding no proprio Dashboard.
- Alertas conectados ao financeiro e vencimentos.
- Check-in semanal com WhatsApp.
- Visual limpo de cards e badges.

O que ainda parece provisorio:

- Loading com `...`.
- Erro tecnico direto.
- Ausencia de ultima atualizacao.
- Falta de alternativa textual do grafico.
- Possivel mojibake se confirmado no navegador.

O que diferencia o Aruka:

- A combinacao de vencimentos, pagamentos e check-in para consultorias fitness.
- O caminho de onboarding alinhado a planos, alunos e financeiro.

O que continua generico:

- Cards financeiros sem comparativo.
- Grafico de receita simples.
- Falta de sinais de treino e avaliacao.

Informacao que deveria ser mais proeminente: "O que precisa da minha atencao hoje".

Acao que deveria ser mais evidente: resolver pendencias com contexto ja filtrado.

Dashboard atual: painel informativo ou central de decisao?

Conclusao: hoje e um painel informativo com alguns elementos acionaveis. Para virar central de decisao, precisa reduzir interpretacao manual, explicar periodos, consolidar prioridades e incluir sinais especificos de treinos/avaliacoes.

## 13. Roadmap proposto

### Ciclo Dashboard 1.1 - Confianca e clareza

Objetivo: tornar dados e estados confiaveis para uso diario.

Itens: DASH-P1-001, DASH-P1-002, DASH-P1-003, DASH-P1-004, DASH-P2-001, DASH-P2-004.

Arquivos provavelmente afetados:

- `useDashboardPage.js`
- `DashboardCards.jsx`
- `DashboardAtalhos.jsx`
- `DashboardPage.jsx`
- `scripts/validate-dashboard-mobile-cdp.mjs`, se necessario apenas para ajuste leve de QA

Dependencias: credenciais QA locais, decisao de periodo financeiro.

Riscos: alterar semantica financeira sem alinhamento de produto.

Validacoes: build, lint, QA mobile, screenshots, teclado basico.

### Ciclo Dashboard 1.2 - Alertas e resolucao

Objetivo: reduzir atrito entre alerta e acao.

Itens: DASH-P2-002, DASH-P2-003, DASH-P3-003.

Arquivos provavelmente afetados:

- `DashboardAlertas.jsx`
- `DashboardCheckin.jsx`
- modulo Alunos/Financeiro apenas se filtros forem suportados

Dependencias: filtros nos modulos de destino.

Riscos: criar links que prometem filtro inexistente.

Validacoes: clique em todos os alertas, ida/volta, mobile.

### Ciclo Dashboard 1.3 - Experiencia mobile

Objetivo: validar e lapidar a experiencia em 360, 390, 412, tablet e desktop.

Itens: DASH-P1-002 e eventuais achados visuais da reexecucao.

Arquivos provavelmente afetados:

- `src/index.css`
- componentes do Dashboard, se houver problema real confirmado

Dependencias: ambiente QA autenticado.

Riscos: ajustar mobile quebrando desktop.

Validacoes: QA CDP, screenshots e `git diff --check`.

### Ciclo Dashboard 1.4 - Estados vazios e onboarding

Objetivo: aumentar conversao de primeiro uso.

Itens: evolucao de checklist, grafico vazio e estado sem alertas.

Arquivos provavelmente afetados:

- `DashboardOnboardingChecklist.jsx`
- `DashboardAtalhos.jsx`
- `DashboardAlertas.jsx`

Dependencias: definicao de microcopy e fluxo ideal de setup.

Riscos: excesso de texto no mobile.

Validacoes: conta vazia, poucos dados e dados completos.

### Ciclo Dashboard 1.5 - Insights de consultoria fitness

Objetivo: diferenciar Aruka de painel generico.

Itens: DASH-P2-005, DASH-P2-006.

Arquivos provavelmente afetados:

- `useDashboardPage.js`
- services de treinos/avaliacoes
- novos componentes ou extensao de alertas, somente em ciclo de implementacao futuro

Dependencias: regras de vencimento de avaliacao, revisao de treino e prioridade diaria.

Riscos: aumentar consultas e complexidade antes de definir criterio.

Validacoes: dados completos, poucos dados, performance percebida.

### Ciclo Dashboard 1.6 - Acessibilidade e polimento

Objetivo: elevar maturidade de SaaS.

Itens: DASH-P3-001, DASH-P3-002 e revisao de foco/toque.

Arquivos provavelmente afetados:

- `DashboardCards.jsx`
- `DashboardAtalhos.jsx`
- CSS global

Dependencias: QA visual e teste de teclado.

Riscos: baixo.

Validacoes: teclado, leitor de tela basico, contraste aparente.

## 14. Validacoes realizadas

| Validacao | Resultado |
| --- | --- |
| Branch atual | `docs/validate-required-check-light-path` |
| `git status --short` inicial | limpo |
| Runtime local | Vite subiu em `http://127.0.0.1:5173/` |
| `/dashboard` por HTTP | 200 |
| `qa:dashboard-mobile` | falhou: `.env.qa.local: not found` |
| `npm.cmd run build` | passou |
| `npm.cmd run lint` | passou |

## 15. Limitacoes

- Branch diferente de `main`; solicitado esperava confirmar branch, e a divergencia foi registrada.
- Sem `.env.qa.local`, nao houve usuario QA autenticado.
- Sem login autenticado, nao foram capturados screenshots dos viewports.
- Estados com dados completos, poucos dados, vazio e erro foram avaliados por inspecao de codigo, nao por reproducao visual.
- Console/DevTools nao foi inspecionado no Dashboard autenticado.

## 16. Conclusao

Decisao sugerida: ajustar, nao redesenhar.

O Dashboard tem uma base boa e deve ser preservado. A primeira intervencao deve focar confianca, clareza dos indicadores e revalidacao visual. Depois disso, a evolucao de produto deve aproximar a tela de uma central de decisao diaria, incorporando prioridades, contexto, treinos e avaliacoes.
