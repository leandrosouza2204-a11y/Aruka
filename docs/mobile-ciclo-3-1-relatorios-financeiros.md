# Mobile Ciclo 3.1 - Relatorios financeiros

## Relatorios analisados
- Historico financeiro do aluno.
- Relatorio financeiro do aluno.
- Relatorio geral financeiro.

## Tabelas adaptadas
- A tabela do historico financeiro do aluno permanece no desktop.
- Em mobile ate 767px, o historico financeiro passa a usar cards.
- Em 768px ou mais, a tabela do historico volta a ser exibida.

## Historico financeiro do aluno
Colunas desktop preservadas:
- Data
- Valor
- Plano
- Tipo
- Parcela
- Vencimento da parcela
- Forma
- Vencimento do plano antes
- Vencimento do plano depois
- Observacao

Campos principais no card:
- Data do pagamento
- Valor
- Plano
- Parcela
- Forma de pagamento
- Tipo de pagamento

Campos secundarios:
- Vencimento da parcela
- Vencimento do plano antes
- Vencimento do plano depois
- Observacao

Componente criado:
- `src/features/financeiro/components/mobile/HistoricoFinanceiroMobileCards.jsx`

Comportamento:
- Usa a mesma lista `pagamentos` ja ordenada no modal.
- Nao cria estado de ordenacao separado.
- Detalhes secundarios ficam em expansao local com `aria-expanded`.
- Empty state mobile mostra "Nenhum pagamento registrado." sem renderizar tabela vazia.

## Relatorio financeiro do aluno
Blocos preservados:
- Data de inicio
- Tempo na consultoria
- Total pago
- Pagamentos
- Ticket medio
- Plano atual
- Ultimo pagamento
- Proximo vencimento
- Resumo para promocoes
- Historico de acompanhamento
- Encerramento do acompanhamento, quando existir

Adaptacao mobile:
- Grids de resumo recebem classe propria e passam a uma coluna no mobile.
- Secoes do relatorio reduzem padding em telas pequenas.
- Historico de acompanhamento permanece em blocos verticais, sem alterar conteudo ou calculos.

## Relatorio geral financeiro
Blocos preservados:
- Indicadores de acompanhamento.
- Filtro de periodo dos indicadores.
- Aviso de data de corte.
- Rankings de maior valor acumulado, mais tempo na consultoria e mais pagamentos.
- Lista de pagamentos recorrentes em dia.

Adaptacao mobile:
- Grid de rankings passa a uma coluna.
- Linhas de ranking viram blocos/card simples, sem scroll horizontal.
- Todos os totais e metricas continuam vindo dos mesmos dados recebidos pelo modal.

## Estados tratados
- Historico sem pagamentos: card vazio mobile.
- Indicadores em loading/erro/vazio: comportamento existente preservado.
- Relatorio geral sem recorrentes em dia: mensagem existente preservada.

## Comportamento desktop preservado
- Tabelas e estruturas existentes permanecem em 768px ou mais.
- Nao houve alteracao de calculos, queries, ordenacao, filtros, pagamentos ou parcelamento.

## Breakpoints
- Regra implementada: ate 767px cards mobile; 768px ou mais tabela/estrutura desktop.
- Validacao tecnica executada.
- Validacao visual autenticada nos breakpoints 320, 360, 375, 390, 412, 430, 768, 1024 e 1366px nao foi declarada porque os relatorios nao foram abertos com sessao real nesta execucao.

## Limitacoes
- Sem teste visual autenticado real dos casos de pagamento a vista, parcelado, renovacao, aluno encerrado e periodo sem dados.
- O relatorio geral ja era composto majoritariamente por listas/cards; esta etapa refinou a exibicao mobile sem criar novos indicadores.

## Proximos passos
- Abrir os tres relatorios com dados reais em celular e validar cards em 320px.
- Revisar eventual necessidade de compactar ainda mais secoes longas do relatorio do aluno apos teste real.

## Correcao de overflow horizontal

### Escopo auditado
- Tela principal do Financeiro.
- Filtros e abas de acompanhamento.
- Cards mobile do Financeiro.
- Menus de acoes de tres pontos.
- Historico financeiro do aluno.
- Relatorio financeiro do aluno.
- Relatorio geral financeiro.
- CSS global relacionado a tabelas, cards, modais financeiros e bottom navigation.

### Possiveis causadores identificados por auditoria
- Filtros e abas com estilos inline herdados do desktop (`inline-flex`, `minmax(...)` e botoes com textos longos).
- Filhos de flex/grid em cards financeiros sem protecao suficiente de `min-width: 0`.
- Valores longos em cards, status, plano, motivo, observacao e rankings sem garantia consistente de quebra.
- Menus de acoes com largura fixa de 190px sem limite explicito por viewport no mobile.
- Wrappers de tabela financeira e de historico com `min-width` alto na tabela interna.
- Conteudo interno de modais financeiros usando largura desktop via `width: min(..., 100%)`.

### Correcao aplicada
- Menus de acoes agora usam `width: min(190px, calc(100vw - 24px))` no mobile.
- Itens do menu podem quebrar texto e nao devem ampliar a pagina.
- Escopo `.financeiro-page` mobile recebeu protecao estrutural: `box-sizing`, `max-width: 100%`, `min-width: 0` e `width: 100%` nos wrappers relevantes.
- Grids e filtros financeiros passam a `minmax(0, 1fr)` no mobile.
- Abas de acompanhamento passam a empilhar em 1 coluna no mobile, com texto quebravel.
- Cards financeiros, valores, badges e campos do relatorio passam a quebrar texto longo com `overflow-wrap: anywhere`.
- Wrappers de tabela financeira e historico ficam fora do fluxo no mobile com `display: none`, `min-width: 0`, `max-width: 100%` e `width: 100%`.
- Modal financeiro mobile fica limitado a `calc(100vw - 20px)` e seus filhos diretos a `max-width: 100%`.

### Valores de scrollWidth/clientWidth
- Nao houve sessao autenticada real disponivel nesta execucao.
- Portanto, os valores antes/depois de `document.documentElement.scrollWidth` e `clientWidth` nao foram declarados.
- A confirmacao final deve ser feita no navegador autenticado, nos estados descritos no briefing.

### Breakpoints a confirmar com sessao real
- 320px
- 360px
- 375px
- 390px
- 412px
- 430px
- Regressao desktop em 1366px

### Regressao desktop
- As correcoes novas foram escopadas em `@media (max-width: 767px)`.
- Tabelas e relatorios desktop permanecem preservados em 768px ou mais.
