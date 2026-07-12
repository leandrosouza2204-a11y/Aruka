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
- `scripts/validate-finance-modals-cdp.mjs`

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

## Script de validacao criado
- `scripts/validate-finance-modals-cdp.mjs`
- Usa Chrome DevTools Protocol na porta `9222` por padrao.
- Aceita porta alternativa via `CDP_PORT`.
- Carrega credenciais QA locais via `node --env-file=.env.qa.local`.
- Nao carrega credenciais no frontend e nao usa variaveis `VITE_`.
- Se nao houver sessao autenticada, tenta login automatico com `QA_USER_EMAIL` e `QA_USER_PASSWORD`.
- O script nao imprime e-mail, senha, tokens, storage, cookies ou headers de autenticacao.
- Navega para `/financeiro`, testa 320, 360, 375, 390, 412 e 430px.
- Para cada largura, tenta abrir:
  - `Relatorios financeiros`;
  - `Historico financeiro do aluno`;
  - detalhes expandidos do historico, quando houver botao `Ver detalhes`.
- Registra:
  - `document.documentElement.clientWidth`;
  - `document.documentElement.scrollWidth`;
  - `document.body.clientWidth`;
  - `document.body.scrollWidth`;
  - `modal.clientWidth`;
  - `modal.scrollWidth`;
  - `scrollContainer.clientWidth`;
  - `scrollContainer.scrollWidth`;
  - visibilidade do botao `Fechar`;
  - elementos que ainda excedem o viewport.
- Salva evidencias em `tmp-responsive-screenshots/finance-modals/`, pasta ignorada pelo Git.
- Retorna codigo diferente de zero quando a autenticacao falha, um modal nao abre, um seletor obrigatorio nao e encontrado ou algum delta horizontal passa de 1px.

## Como executar com credenciais QA locais
1. Criar ou editar `.env.qa.local` na raiz do projeto.
2. Preencher somente localmente:
   - `QA_USER_EMAIL`
   - `QA_USER_PASSWORD`
3. Nunca versionar `.env.qa.local`.
4. Iniciar o app local em `http://127.0.0.1:5173/`.
5. Iniciar o Chrome com DevTools Protocol na porta `9222`.
6. Executar:
   - `npm run qa:finance-modals`

## Protecao de credenciais
- `.env.qa.local` possui regra explicita em `.gitignore`.
- O arquivo tambem fica coberto pelas regras existentes `.env.*`, `*.local` e `.env*`.
- Confirmar com:
  - `git check-ignore -v .env.qa.local`
  - `git ls-files .env.qa.local`

## Validacao executada em 2026-07-12
- Vite local iniciado em `http://127.0.0.1:5173/`.
- Chrome headless com CDP iniciado na porta `9222` usando perfil temporario.
- Resultado: nao autenticado. A rota `/financeiro` redirecionou para `/login` em 320px.
- Chrome headless com CDP iniciado na porta `9223` tentando reaproveitar o perfil padrao.
- Resultado: nao autenticado. A rota `/financeiro` redirecionou para `/login` em 320px.
- `.env.local` nao possui credencial de teste nomeada; foi encontrada somente chave relacionada a Vercel.
- Foi adicionado suporte seguro a `.env.qa.local`, mas o arquivo local esta sem valores reais nesta execucao.
- `npm run lint`
- `npm run build`
- `git diff --check`

## Validacao pendente em navegador autenticado
- Nao houve sessao autenticada real disponivel nesta execucao.
- A validacao final nao foi declarada concluida.
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
