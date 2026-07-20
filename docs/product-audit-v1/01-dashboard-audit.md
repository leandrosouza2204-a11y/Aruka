# Auditoria Funcional v1.0 - Dashboard

## 1. Resumo executivo

Decisao: READY_WITH_LIMITATIONS.

O Dashboard do Aruka ja apresenta uma base funcional de SaaS operacional: mostra indicadores financeiros e de alunos, checklist de primeiros passos, alertas acionaveis e grafico de receita mensal. A tela ajuda o usuario a enxergar situacao geral do negocio, especialmente quando ja existem alunos, planos e pagamentos.

O diagnostico principal e que o Dashboard esta em nivel utilizavel/profissional inicial, mas ainda nao comunica com maxima confianca a semantica dos numeros, nao oferece alternativa textual para grafico, usa carregamento simples com `...`, nao informa ultima atualizacao e nao teve validacao visual autenticada reproduzida nesta execucao por indisponibilidade do Chrome CDP.

## 2. Escopo

Auditoria restrita ao modulo Dashboard:

- rota `/dashboard`;
- pagina `src/pages/Dashboard.jsx`;
- componentes em `src/features/dashboard/components`;
- hook `src/features/dashboard/hooks/useDashboardPage.js`;
- navegacao originada por checklist, alertas, sidebar e bottom navigation;
- estados de loading, vazio, erro, dados, sessao e permissao por runtime ou inspecao.

Nao foram auditados profundamente Alunos, Treinos, Avaliacoes, Financeiro, Planos ou Administracao.

## 3. Ambiente utilizado

- Branch: `main`.
- Git inicial: working tree limpo e branch atualizada com `origin/main`.
- Ultimo commit: `4654e64 Merge pull request #6 from leandrosouza2204-a11y/feat/workout-library-cycle-6-4`.
- Sistema: Windows/PowerShell.
- Node/npm: usados via `npm.cmd` por bloqueio de `npm.ps1` pela Execution Policy.
- URL local: `http://127.0.0.1:5173/dashboard`.
- Modo: Vite dev server com `npm.cmd run dev -- --host 127.0.0.1`.
- Usuario de teste: credenciais QA lidas apenas de `.env.qa.local` pelo script existente; login nao foi concluido porque o CDP falhou antes da autenticacao.
- Supabase local: `cmd /c npm run supabase:status` falhou sem saida diagnostica util.

## 4. Limitacoes

- A aplicacao respondeu HTTP 200 em `/dashboard`, confirmando disponibilidade do runtime local.
- A validacao visual autenticada nao foi concluida: `cmd /c npm run qa:dashboard-mobile` falhou com `fetch failed` por CDP indisponivel.
- Chrome e Edge headless foram tentados para screenshot, mas nao produziram arquivo no ambiente desta execucao.
- Nao foi possivel reproduzir visualmente, nesta etapa, os breakpoints 320, 375, 390, 430, 768 e desktop autenticados.
- Estados de erro, sessao expirada, poucos dados e muitos dados foram analisados por inspecao de codigo, sem reproducao completa no runtime.

## 5. Mapa tecnico

Rota:

- `/dashboard`, protegida por `ProtectedRoute`, `SubscriptionRoute` e `LegalRoute` em `src/App.jsx`.
- `/` permanece landing publica.

Arquivos principais:

- `src/pages/Dashboard.jsx`
- `src/features/dashboard/components/DashboardPage.jsx`
- `src/features/dashboard/hooks/useDashboardPage.js`
- `src/features/dashboard/components/DashboardHeader.jsx`
- `src/features/dashboard/components/DashboardOnboardingChecklist.jsx`
- `src/features/dashboard/components/DashboardCards.jsx`
- `src/features/dashboard/components/DashboardCheckin.jsx`
- `src/features/dashboard/components/DashboardAlertas.jsx`
- `src/features/dashboard/components/DashboardAtalhos.jsx`
- `src/index.css`
- `scripts/validate-dashboard-mobile-cdp.mjs`

Componentes relevantes:

- `DashboardHeader`: usa `PageHero` com titulo "Dashboard" e descricao operacional.
- `DashboardOnboardingChecklist`: primeiros passos de plano, aluno e financeiro.
- `DashboardCards`: seis cards de indicadores.
- `DashboardCheckin`: card acionavel e modal via `AccessibleModal`.
- `DashboardAlertas`: alertas com links para `/alunos` e `/financeiro`.
- `DashboardAtalhos`: grafico de Receita Mensal em desktop e mobile.
- `Sidebar` e `MobileBottomNavigation`: navegacao global.

Fontes de dados:

- `buscarAlunosSupabase()` consulta tabela `alunos` por `user_id`.
- `buscarPagamentosSupabase()` consulta tabela `pagamentos` por `user_id`.
- `buscarPlanosSupabase()` consulta tabela `planos` por `user_id`.
- `buscarUsuarioLogado()` e Supabase Auth determinam usuario.

Dependencias:

- React, React Router, Supabase JS e lucide-react.
- Nao ha biblioteca externa de graficos; o grafico e renderizado com `div`s e CSS inline.

Estados tratados:

- `carregando`: true/false no hook.
- `erro`: string exibida em `app-error`.
- `modalCheckinAberto`: controla modal de check-in.
- `onboardingStatus`: deriva de planos, alunos e pagamentos.
- Estados vazios: grafico sem pagamentos e checklist incompleto/completo.

Testes existentes:

- `npm run qa:dashboard-mobile`: script CDP para autenticacao, medicao responsiva e screenshots.
- Nao foram encontrados testes unitarios especificos para `gerarReceitaMensal`, `montarAlertasConsultoria` ou `useDashboardPage`.

Riscos tecnicos observados:

- Erro tecnico do Supabase e interpolado diretamente na UI.
- Nao ha retry no erro de carregamento.
- Grafico nao possui alternativa textual estruturada.
- Sem carimbo de ultima atualizacao.
- A semantica de "periodo" nas metricas financeiras nao fica explicita.

## 6. Personas avaliadas

Usuario novo:

- Pontos fortes: checklist "Primeiros passos na Aruka" orienta criar plano, cadastrar aluno e acessar financeiro.
- Fragilidades: cards zerados e grafico vazio ainda podem parecer pouco valiosos; a tela explica o que fazer, mas nao contextualiza o valor futuro de cada indicador.

Profissional em operacao:

- Pontos fortes: alertas de alunos vencidos/vencendo e pagamentos pendentes criam trilhas de acao; check-in semanal reduz atrito para contato.
- Fragilidades: alertas levam a telas gerais, sem filtro contextual confirmado; nao ha bloco de tarefas diarias priorizadas.

Gestor do negocio:

- Pontos fortes: receita prevista, recebida, pendente, alunos vencidos e grafico de 6 meses dao visao executiva inicial.
- Fragilidades: ausencia de comparativos, periodo explicito, ultima atualizacao e indicadores de retencao/engajamento limita leitura estrategica.

## 7. Fluxo atual

Estrutura visual atual:

1. Sidebar.
2. Cabecalho "Dashboard".
3. Erro, quando existe.
4. Onboarding / primeiros passos.
5. Grid de metricas.
6. Check-in semanal.
7. Alertas da consultoria, quando existem.
8. Receita Mensal.

Acoes visiveis mapeadas:

| Acao | Posicao | Objetivo | Cliques | Destino | Resultado esperado | Clareza |
| --- | --- | --- | ---: | --- | --- | --- |
| Criar plano | Checklist | Configurar oferta comercial | 1 | `/planos` | Abrir modulo Planos | Alta |
| Cadastrar aluno | Checklist | Iniciar carteira | 1 | `/alunos` | Abrir modulo Alunos | Alta |
| Ir para financeiro | Checklist | Registrar/acompanhar pagamento | 1 | `/financeiro` | Abrir Financeiro | Alta |
| Enviar check-ins | Card Check-in | Abrir modal de contatos | 1 | Modal local | Listar alunos aptos | Media |
| Enviar | Modal Check-in | Abrir WhatsApp do aluno | 1 | WhatsApp externo | Enviar mensagem manual | Media |
| Ver alunos | Alerta | Resolver vencidos | 1 | `/alunos` | Abrir Alunos | Media, falta filtro |
| Ver vencimentos | Alerta | Resolver vencendo | 1 | `/alunos` | Abrir Alunos | Media, falta filtro |
| Abrir financeiro | Alerta | Revisar pendencias | 1 | `/financeiro` | Abrir Financeiro | Alta |

O fluxo faz sentido, mas ainda ha perda de contexto quando alertas levam a modulos sem filtro ou destaque garantido.

## 8. Avaliacao desktop

Por inspecao, o desktop tem hierarquia clara: hero, onboarding, metricas, alertas e grafico. Os cards usam rotulos compreensiveis e icones de apoio. A tela passa uma percepcao funcional e organizada.

Pontos de atencao:

- "Total previsto no periodo" nao diz qual periodo.
- "Receita Mensal" explica os ultimos 6 meses, mas o grafico e visual sem alternativa textual.
- Nao ha ultima atualizacao nem refresh.
- Em ausencia de alertas, a secao some, reduzindo feedback positivo.

## 9. Avaliacao mobile

O projeto possui historico de validacao autenticada em `docs/mobile-ciclo-4-1-dashboard.md`, com sucesso previo em 320, 360, 375, 390, 412, 430, 1024, 1366 e 1440 px. A auditoria atual, entretanto, nao conseguiu reproduzir essa validacao porque o CDP local falhou.

Estado desta etapa:

- Mobile atual analisado por inspecao de CSS e componentes.
- Script existente cobre overflow horizontal, conteudo final acima da bottom navigation, primeira dobra e screenshots.
- Evidencia nova de screenshot nao foi gerada.

Classificacao: Limitacao de validacao. A recomendacao de Ciclo 1 e reexecutar `qa:dashboard-mobile` com CDP operacional antes de declarar READY pleno para release comercial.

## 10. Estados do sistema

Carregamento inicial:

- Confirmado por codigo: cards mostram `...`; alertas mostram "Carregando alertas..."; grafico mostra "Carregando pagamentos...".
- Problema: feedback e simples e nao preserva necessariamente percepcao premium.

Estado vazio:

- Confirmado por codigo: checklist orienta plano/aluno/financeiro; grafico mostra "Nenhum pagamento registrado para gerar o grafico."
- Oportunidade: criar estado vazio mais contextual para conta sem dados.

Poucos dados:

- Analisado por codigo: metricas aceitam zeros; grafico so aparece se algum mes tem valor maior que zero.
- Risco: o usuario pode nao entender se zero significa ausencia de dados, ausencia de receita ou filtro implicito.

Muitos dados:

- Limitacao de validacao: nao reproduzido com volume alto.

Erro de carregamento:

- Confirmado por codigo: `Erro ao carregar dashboard: ${error.message}`.
- Problemas: pode expor mensagem tecnica e nao oferece retry.

Dados desatualizados:

- Confirmado por codigo: nao ha ultima atualizacao nem refresh.

Sessao sem permissao ou expirada:

- Analisado por inspecao: rota passa por `ProtectedRoute`, `SubscriptionRoute` e `LegalRoute`.
- Runtime autenticado expirado nao reproduzido nesta etapa.

## 11. UX

Primeira impressao: organizada e familiar para SaaS operacional.

Hierarquia: boa, mas o onboarding fica acima dos alertas no desktop; no mobile ha ajustes historicos por CSS para priorizar alertas.

Linguagem: clara, com alguns textos mojibakeados no arquivo fonte visto via terminal, como `mÃ©tricas`, `perÃ­odo` e `atenÃ§Ã£o`. Isso pode ser apenas encoding de exibicao no terminal, mas deve ser confirmado visualmente.

Feedback: existe, mas loading, erro e ausencia de alertas podem evoluir.

Previsibilidade: a maioria dos links e botoes comunica destino; alertas para Alunos prometem um subconjunto, mas levam ao modulo geral.

## 12. Produto

O Dashboard demonstra valor porque conecta cadastros, financeiro e rotina de acompanhamento. Ele ja diferencia o Aruka de uma planilha ao combinar indicadores, checklist e alertas.

O maior salto de produto esta em transformar numeros em trabalho guiado:

- tarefas recomendadas do dia;
- filtros contextuais apos clique em alerta;
- comparativos de periodo;
- ultima atualizacao;
- alertas positivos e preventivos;
- indicadores de retencao, inadimplencia e engajamento.

## 13. Percepcao de valor

Nota geral: 3/5, produto utilizavel.

Justificativa:

- A estrutura e clara e comercialmente compreensivel.
- Os alertas acionaveis e o onboarding elevam percepcao de SaaS.
- A falta de periodo explicito, loading refinado, alternativa textual do grafico, retry e validacao visual atual impedem classificar como SaaS profissional maduro.

## 14. Acessibilidade

Pontos positivos:

- Links de alertas sao elementos semanticos `Link`.
- Modal usa `AccessibleModal`, com `role`, `aria-modal`, `aria-labelledby`, foco inicial, Escape e retorno de foco.
- Icones decorativos do checklist usam `aria-hidden`.

Pontos de atencao:

- Icones dos metric cards nao possuem `aria-hidden`; podem ser anunciados de forma pouco util dependendo do SVG.
- Grafico de Receita Mensal nao tem alternativa textual estruturada.
- Navegacao por teclado nao foi validada em runtime autenticado nesta execucao.
- Contraste aparente parece adequado por tokens, mas nao foi medido por ferramenta automatizada.

## 15. Performance percebida

O hook carrega alunos, pagamentos e planos em paralelo com `Promise.all`, o que e positivo.

Riscos:

- Nao ha cache ou refresh controlado.
- Com muitos alunos/pagamentos, os calculos no cliente podem crescer, especialmente agrupamentos por aluno e status.
- Sem profiling nesta etapa.

Console/rede:

- Console autenticado nao foi inspecionado por falha de CDP.
- HTTP local de `/dashboard` retornou 200.

## 16. Problemas encontrados

Problemas confirmados:

1. Grafico sem alternativa textual estruturada.
2. Loading usa `...` e mensagens simples.
3. Periodo das metricas financeiras nao e explicito.
4. Erro tecnico pode aparecer para usuario final.
5. Erro nao oferece retry.

Limitacoes de validacao:

1. Mobile visual autenticado nao reproduzido nesta execucao.
2. Teclado/foco nao validado em runtime autenticado.
3. Muitos dados nao reproduzido.
4. Sessao expirada nao reproduzida.

## 17. Oportunidades

- Estado positivo quando nao ha alertas.
- Alertas com destino filtrado/contextual.
- Tarefas recomendadas do dia.
- Ultima atualizacao e refresh.
- Estado vazio mais premium para conta nova.
- Comparativos de evolucao.
- Futuras automacoes para check-ins, vencimentos, inadimplencia e avaliacoes vencidas.

## 18. Pontuacoes

| Dimensao | Nota |
| --- | ---: |
| Clareza | 3 |
| Eficiencia | 3 |
| Usabilidade | 3 |
| Mobile | 3 |
| Valor percebido | 3 |
| Aparencia profissional | 3 |
| Capacidade de orientar acoes | 3 |
| Confianca transmitida | 3 |
| Percepcao geral | 3 |

## 19. Conclusao

O Dashboard esta pronto para ser tratado como modulo auditado com limitacoes. Ele possui base funcional coerente e boas intencoes de produto, mas ainda precisa fortalecer confianca, acessibilidade, contexto dos numeros e comprovacao visual atual em runtime autenticado.

Decisao final: READY_WITH_LIMITATIONS.

## 20. Recomendacao de proximos ciclos

- Ciclo 1: acessibilidade do grafico, loading, periodo das metricas, ultima atualizacao e revalidacao mobile com CDP.
- Ciclo 2: alertas contextuais, estado positivo sem pendencias e tarefas recomendadas.
- Ciclo 3: teclado/foco, volume alto e performance percebida.
- Ciclo 4: estados de erro, retry, vazios e microcopy premium.
- Ciclo 5: comparativos, retencao, engajamento e automacoes inteligentes.
