# Mobile Ciclo 3.2 - Overflow em modais financeiros

## Arquivos analisados
- `src/features/financeiro/components/modals/HistoricoFinanceiroModal.jsx`
- `src/features/financeiro/components/mobile/HistoricoFinanceiroMobileCards.jsx`
- `src/features/financeiro/components/modals/RelatorioAlunoModal.jsx`
- `src/features/financeiro/components/modals/RelatorioGeralModal.jsx`
- `src/features/financeiro/components/IndicadoresAcompanhamentoSection.jsx`
- `src/features/financeiro/components/modals/ModalBase.jsx`
- `src/components/AccessibleModal.jsx`
- `src/index.css`

## Arquivos alterados
- `src/index.css`

## Causas encontradas
- O overlay mobile do `AccessibleModal` usa `padding: 12px`, deixando area util horizontal de `100vw - 24px`.
- A regra mobile anterior da classe `.financeiro-modal` usava `width: calc(100vw - 20px)`, podendo exceder a area util do overlay em 4px.
- Cabecalhos, acoes, cards e linhas de detalhe dos relatorios tinham protecoes parciais de `min-width: 0`, mas ainda podiam sofrer pressao de textos longos.
- Rankings e linhas com `justify-content: space-between` podiam manter largura implicita maior que o container em casos extremos.

## Solucao aplicada
- `.financeiro-modal` passou a usar `width: 100%` e `max-width: calc(100vw - 24px)` no mobile.
- Filho direto do modal financeiro limitado a `width: 100%` e `max-width: 100%`.
- Cabecalho financeiro recebeu limites estruturais (`max-width`, `min-width: 0`, `width: 100%`).
- Titulos, legendas, alertas e textos internos passaram a quebrar com `overflow-wrap: anywhere`.
- Controles (`button`, `input`, `select`, `textarea`) dentro do modal financeiro foram limitados a `max-width: 100%`.
- Cards, detalhes, rankings e linhas internas receberam `box-sizing`, `max-width: 100%`, `min-width: 0` e `width: 100%`.
- Linhas de informacao dos cards financeiros foram empilhadas em uma coluna no mobile para evitar que valores longos pressionem o layout.
- Elementos internos com `justify-content: space-between` dentro do modal financeiro podem quebrar linha no mobile.

## Breakpoints utilizados
- Correcoes aplicadas somente em `@media (max-width: 767px)`.
- Desktop e tablet a partir de 768px preservados.

## Testes executados
- `npm run lint`
- `npm run build`
- `git diff --check`

## Validacao visual
- Nao houve sessao autenticada real disponivel nesta execucao.
- Nao foram declarados valores de `scrollWidth/clientWidth`.
- A confirmacao final deve ser feita com os modais abertos em 320, 360, 375, 390, 412 e 430px.

## Pendencias
- Medir em navegador autenticado:
  - Historico financeiro aberto e com card expandido.
  - Relatorios financeiros aberto com rankings/listas.
  - `document.documentElement.scrollWidth === document.documentElement.clientWidth`.
