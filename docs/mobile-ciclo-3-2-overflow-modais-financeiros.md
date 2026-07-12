# Mobile Ciclo 3.2 - Overflow em modais financeiros

## Arquivos analisados
- `src/components/AccessibleModal.jsx`
- `src/features/financeiro/components/modals/ModalBase.jsx`
- `src/features/financeiro/components/modals/HistoricoFinanceiroModal.jsx`
- `src/features/financeiro/components/modals/RelatorioGeralModal.jsx`
- `src/features/financeiro/components/mobile/HistoricoFinanceiroMobileCards.jsx`
- `src/index.css`

## Arquivos alterados
- `src/features/financeiro/components/modals/HistoricoFinanceiroModal.jsx`
- `src/features/financeiro/components/modals/RelatorioGeralModal.jsx`
- `src/index.css`

## Diagnostico por codigo
- O portal do `AccessibleModal` ja e renderizado diretamente em `document.body`, sem ancestral transformado entre o dialogo e o body.
- O overlay usa `.accessible-modal-overlay.financeiro-modal-overlay`.
- O conteudo principal usa `section.accessible-modal.accessible-modal-full.financeiro-modal`.
- O wrapper intermediario de `ModalBase` aplica `style={{ width: largura }}`, com `largura="min(980px, 100%)"` nesses dois modais.
- A combinacao anterior ainda dependia do dimensionamento centralizado do modal desktop/tablet e de correcoes internas, em vez de trocar a estrutura do dialogo no mobile.

## Causa provavel do overflow
- O ancestral responsavel estava na pilha do dialogo financeiro: overlay + `section.financeiro-modal` + wrapper inline de `ModalBase`.
- As propriedades relevantes eram `padding` do overlay mobile, `width/max-width` herdados do modal desktop e `width` inline do wrapper intermediario.
- Cards, rankings e textos longos podiam ampliar a pressao interna, mas nao eram a origem estrutural principal.

## Solucao aplicada ao Dialog/portal
- Em `@media (max-width: 640px)`, `.financeiro-modal-overlay` remove padding e estica o dialogo.
- `.financeiro-modal-overlay .financeiro-modal` passa a usar estrutura fullscreen:
  - `position: fixed`
  - `inset: 0`
  - `width: auto`
  - `min-width: 0`
  - `max-width: none`
  - `height: 100dvh`
  - `max-height: 100dvh`
  - `margin: 0`
  - `border-radius: 0`
  - `box-sizing: border-box`
  - `transform: none`
  - `overflow: hidden`
- O wrapper inline de `ModalBase` e `.accessible-modal-body` sao forçados a `width: 100%`, `max-width: 100%`, `min-width: 0`, `height: 100%` e layout flex somente no breakpoint mobile.

## Solucao aplicada ao conteudo
- Os dois modais agora separam cabecalho e conteudo rolavel com `.financeiro-modal-scroll`.
- O cabecalho fica fora do container rolavel e usa `flex: 0 0 auto`.
- O conteudo usa `flex: 1 1 auto`, `overflow-y: auto`, `overflow-x: clip` e `overscroll-behavior: contain`.
- O cabecalho do historico permite quebra em duas linhas: texto em linha propria e acoes abaixo quando necessario.
- Cards, rankings e filhos diretos recebem limites de largura no mobile.
- Linhas de informacao e ranking usam `grid-template-columns: minmax(0, 1fr) auto`; blocos longos usam quebra de palavra.

## Validacao executada
- `npm run lint`

## Validacao pendente em navegador autenticado
- Nao houve sessao autenticada real disponivel nesta execucao.
- Os valores de `clientWidth` e `scrollWidth` ainda precisam ser medidos com os modais abertos.
- Larguras a medir: 320, 360, 375, 390, 412 e 430px.
- Cenarios pendentes:
  - sem modal aberto;
  - `Relatorios financeiros` aberto;
  - `Historico financeiro do aluno` aberto;
  - historico com detalhes de uma parcela expandidos;
  - relatorio aberto a partir do historico.

## Criterio tecnico esperado
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`
- `.financeiro-modal-scroll.scrollWidth === .financeiro-modal-scroll.clientWidth`
- Diferenca maxima aceitavel: 1px por arredondamento.
