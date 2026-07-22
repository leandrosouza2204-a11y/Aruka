# Backlog Priorizado - Dashboard v1

| ID | Titulo | Problema | Plataforma | Cenario | Evidencia | Impacto | Prioridade | Esforco | Dependencia | Recomendacao | Criterio de aceite | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DASH-P1-001 | Clareza das metricas financeiras | Receita prevista, recebida e pendente nao deixam claro periodo/criterio. | Desktop, tablet, mobile | Leitura diaria/gestor | `desktop-1366-first-fold.png`, cards com "Total previsto no periodo". | Alto: risco de decisao financeira equivocada. | P1 | S | Definicao de produto sobre periodo. | Mostrar periodo e regra de calculo nos cards. | Usuario entende se o valor e mensal, historico ou contrato atual. | CONFIRMED |
| DASH-P1-002 | Alertas com destino contextual | Alertas abrem modulos gerais sem filtro/destaque comprovado. | Desktop, tablet, mobile | Resolver aluno vencido, vencendo ou pagamento pendente | `scenario-results.md`, links encontrados para rotas amplas. | Alto: usuario precisa procurar o item depois do clique. | P1 | M | Suporte de filtros em Alunos/Financeiro. | Enviar com query/state ou destacar contexto no destino. | Ao clicar, destino mostra imediatamente os itens prometidos. | CONFIRMED |
| DASH-P1-003 | Acessibilidade do grafico | Receita Mensal depende de barras visuais. | Desktop, tablet, mobile | Leitura com teclado/leitor de tela | `accessibility-results.md`, `mobile-360-full-page.png`. | Alto: informacao financeira perde acessibilidade. | P1 | S | Nenhuma. | Adicionar resumo/tabela textual dos 6 meses. | Mes e valor ficam acessiveis sem depender das barras. | CONFIRMED |
| DASH-P1-004 | Criterio do check-in | "Alunos aptos" nao explica regra. | Desktop, mobile | Preparar contatos semanais | `checkin-mobile.png`, `scenario-results.md`. | Medio/alto: usuario pode duvidar da lista. | P1 | S | Regra de produto. | Explicar criterio junto ao card/modal. | Usuario entende por que cada aluno entra no check-in. | CONFIRMED |
| DASH-P2-001 | Prioridade diaria | O Dashboard mostra bons blocos, mas nao uma fila unica "o que fazer hoje". | Desktop, mobile | Uso operacional diario | `mobile-360-full-page.png` mostra alertas, check-in e cards separados. | Medio/alto: exige interpretacao manual. | P2 | M | Produto. | Criar bloco compacto de prioridades do dia. | Usuario identifica ate 3 acoes prioritarias em segundos. | CONFIRMED |
| DASH-P2-002 | Sinais fitness ausentes | Dataset tem treino e avaliacao, mas Dashboard nao sinaliza pendencias desses modulos. | Desktop, tablet, mobile | Visao central do personal | `data-validation.md`. | Medio: Dashboard fica mais financeiro do que fitness. | P2 | L | Regras de revisao de treino/avaliacao. | Adicionar sinais ou justificar ausencia. | Dashboard mostra treinos/avaliacoes relevantes quando existirem. | CONFIRMED |
| DASH-P2-003 | Mobile com scroll longo | Mobile e estavel, mas a decisao se espalha por alertas, check-in, cards, checklist e grafico. | Mobile | Uso com uma mao | `mobile-360-full-page.png`. | Medio: reduz velocidade de leitura. | P2 | M | Priorizacao de conteudo. | Compactar/resumir primeira tela mobile. | Primeira dobra mostra prioridade e acesso a metricas sem excesso de scroll. | CONFIRMED |
| DASH-P2-004 | Areas de toque no limite | Amostras indicam alvos abaixo de 44px em navegacao/links secundarios. | Tablet, desktop, mobile | Toque e teclado basico | `viewport-results.md`, `accessibility-results.md`. | Medio: afeta conforto e acessibilidade. | P2 | S | CSS/componentes de nav. | Ajustar minimo de areas acionaveis. | CTAs principais e navegacao atendem minimo de 44px. | PARTIALLY_CONFIRMED |
| DASH-P2-005 | Loading pouco refinado | Estados de carregamento usam abordagem simples e nao foram auditados visualmente com throttling. | Todas | Carregamento controlado | `limitations.md`. | Medio: percepcao de acabamento. | P2 | S | Fixture/interceptacao segura. | Criar skeleton/estado consistente e teste. | Loading preserva layout e comunica progresso. | TECHNICAL_ONLY |
| DASH-P2-006 | Erro controlado nao validado | Estado de erro nao foi reproduzido sem derrubar backend. | Todas | Falha de consulta segura | `limitations.md`. | Medio: risco de mensagem tecnica. | P2 | S | Interceptacao de navegador. | Mensagem amigavel e acao de tentar novamente. | Falha simulada mostra erro claro sem detalhe tecnico sensivel. | TECHNICAL_ONLY |
| DASH-P3-001 | Estado positivo sem alertas | Nao validado por ausencia de fixture vazia segura. | Todas | Operacao sem pendencias | `limitations.md`. | Baixo/medio: oportunidade de confianca. | P3 | S | Usuario/fixture dedicado. | Exibir mensagem positiva quando nao houver alertas. | Usuario entende que nao ha pendencias criticas. | TECHNICAL_ONLY |
| DASH-P3-002 | QA autenticado indisponivel | Bloqueio anterior por falta de staging e `.env.qa.local`. | Todas | Auditoria | Evidencias atuais em `authenticated-local/`. | Resolvido. | P3 | XS | Nenhuma. | Manter LOCAL_QA como fluxo oficial desta fase. | `npm run qa:dashboard-authenticated` passa localmente. | DISCARDED |
| DASH-P3-003 | Overflow horizontal | Risco tecnico anterior de responsividade. | Todas | Viewports obrigatorios | `viewport-results.md`. | Resolvido nesta execucao. | P3 | XS | Nenhuma. | Manter regressao de viewport. | Todos viewports ficam com overflow 0px. | DISCARDED |

## Ordem Recomendada

1. `DASH-P1-001`
2. `DASH-P1-002`
3. `DASH-P1-003`
4. `DASH-P1-004`
5. `DASH-P2-001`
6. `DASH-P2-002`

Esses itens compoem o primeiro ciclo porque aumentam clareza, acao e percepcao de valor sem nova infraestrutura.
