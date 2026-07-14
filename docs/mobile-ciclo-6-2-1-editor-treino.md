# Ciclo 6.2.1 - Estrutura responsiva do editor de treino mobile

## Objetivo

Auditar e ajustar o editor atual de treino para uso completo em mobile, preservando desktop e sem alterar regras de prescricao, calculos, banco, Supabase, RLS, queries ou biblioteca de modelos.

## Arquivos analisados

- `src/components/TreinoModal.jsx`
- `src/components/ExercicioCard.jsx`
- `src/features/treinos/components/TreinosList.jsx`
- `src/features/treinos/hooks/useTreinosPage.js`
- `src/features/treinos/components/TreinosCards.jsx`
- `src/features/treinos/components/TreinoDetalhesModal.jsx`
- `src/features/treinos/components/TreinosHeader.jsx`
- `src/features/treinos/components/TreinosFilters.jsx`
- `src/services/treinosService.js`
- `src/index.css`
- `scripts/validate-treinos-mobile-cdp.mjs`
- `package.json`

## Estrutura original

Editor de treino:

- Cabecalho com titulo, subtitulo e botao Fechar.
- Dados gerais em grid responsivo por `auto-fit`.
- Secao de dias.
- Formulario para adicionar dia.
- Cards de dias com cabecalho, formulario de exercicio e lista de exercicios.
- Rodape com Cancelar e Salvar Treino.

O editor era um modal customizado com `position: fixed` no overlay e um card central com `maxHeight: calc(100vh - 48px)` e `overflowY: auto`.

## Causa dos problemas

- O card inteiro rolava, deixando cabecalho e rodape sem uma estrutura propria.
- O rodape ficava no fluxo da rolagem do modal e podia ficar distante ou comprimido em telas pequenas.
- O modal nao usava `100dvh` em mobile.
- Formularios de dia e exercicio podiam manter grids de desktop em paisagem estreita.
- Alguns wrappers nao tinham garantias explicitas de `min-width: 0`, quebra de texto e contencao horizontal.

## Arquivos alterados

- `src/components/TreinoModal.jsx`
- `src/index.css`
- `scripts/validate-treino-editor-mobile-cdp.mjs`
- `package.json`
- `docs/mobile-ciclo-6-2-1-editor-treino.md`

## Estrutura final

Editor de treino:

- Cabecalho fixo dentro do editor: `.treino-editor-header`.
- Conteudo rolavel: `.treino-editor-scroll`.
- Rodape de acoes fixo dentro do editor: `.treino-editor-footer`.

O modal agora e tratado como container flex column, com altura contida e rolagem apenas na area de conteudo.

## Rolagem

- A rolagem principal do editor fica em `.treino-editor-scroll`.
- O container usa `min-height: 0`, `overflow-y: auto`, `overflow-x: clip`, `overscroll-behavior: contain` e `-webkit-overflow-scrolling: touch`.
- O rodape permanece acessivel sem depender de rolar o card inteiro.

## Teclado virtual

- Em mobile, inputs e textareas usam `font-size: 16px` para evitar zoom automatico em navegadores mobile.
- A area rolavel interna permite reposicionar campos focados sem criar overflow horizontal.
- O rodape fica fora da area rolavel, com safe area aplicada ate 640px.

## Dados gerais

- Em telas ate 768px, o grid dos dados gerais passa para uma coluna.
- Campos, selects e textareas recebem limites de largura e `min-width: 0`.
- Labels permanecem visiveis porque a estrutura `Campo` foi preservada.
- Validacoes existentes foram mantidas sem alteracao.

## Dias e exercicios

- O formulario de dias vira coluna unica em mobile.
- Cabecalhos de dias aceitam wrap e textos longos quebram.
- Cards de dias e exercicios recebem contencao horizontal.
- O formulario de exercicios vira coluna unica em mobile.
- Acoes de dia e de exercicio passam a ter area de toque maior e largura segura em telas pequenas.
- Nao ha drag and drop no editor atual; nenhuma alternativa nova foi necessaria neste ciclo.

## Rodape

- O rodape usa fundo solido, borda superior e safe area.
- Em ate 640px, botoes ficam em coluna reversa, deixando a acao principal visualmente no final do bloco.
- Cancelar e Salvar Treino permanecem disponiveis sem mudanca de comportamento.

## Cancelamento e persistencia

- `onClose` continua fechando o modal sem chamar `onSave`.
- O fluxo Novo treino -> Cancelar e Editar treino -> Cancelar permanece sem persistencia.
- O script de QA compara a quantidade de cards antes/depois para detectar mutacao acidental.

## QA

Foi criado:

- `scripts/validate-treino-editor-mobile-cdp.mjs`
- `npm run qa:treino-editor-mobile`

O script:

- autentica via `.env.qa.local`;
- abre `/treinos`;
- abre Novo treino;
- preenche campos sem salvar;
- adiciona dia apenas no estado local;
- rola o editor ate o final;
- valida modal, area rolavel, rodape e overflow;
- cancela;
- abre edicao quando existe treino disponivel;
- altera temporariamente sem salvar;
- cancela;
- confirma que a quantidade de treinos nao mudou;
- gera screenshots em `tmp-responsive-screenshots/treino-editor-mobile`;
- cobre mobile, paisagem, tablet e desktop.

## Viewports cobertos

- 320x800
- 360x800
- 375x812
- 390x844
- 412x915
- 430x932
- 800x360
- 844x390
- 915x412
- 768x1024
- 820x1180
- 1024x768
- 1366x768
- 1440x900

## Validacao executada

- Data da validacao final: 2026-07-14.
- Ambiente local: `http://127.0.0.1:5173`.
- Chrome CDP: iniciado em `127.0.0.1:9222` com perfil temporario isolado.
- Autenticacao: aprovada via `.env.qa.local`, sem registro de credenciais, tokens, cookies ou storage.
- `node --check scripts\validate-treino-editor-mobile-cdp.mjs`: aprovado.
- `npm.cmd run qa:treino-editor-mobile`: aprovado.
- `npm.cmd run lint`: aprovado.
- `npm.cmd run build`: aprovado apos encerrar o dev server. Uma tentativa anterior com Vite dev ativo falhou em erro interno do Vite/Rolldown ao emitir `index.html`; repetida com a porta 5173 livre, passou.
- `git diff --check`: aprovado.
- `git check-ignore -v .env.qa.local`: aprovado.
- `git ls-files .env.qa.local`: vazio.
- `git check-ignore -v tmp-responsive-screenshots/treino-editor-mobile/`: aprovado.

## Resultado da validacao autenticada

- Novo treino: abre em todos os viewports, preenche campos sem salvar, adiciona dia apenas no estado local, rola ate o final e cancela sem persistir.
- Edicao: abre treino existente em todos os viewports, carrega campos e exercicios, altera somente estado local, rola ate o final, cancela e reabre sem persistir a alteracao temporaria.
- Cabecalho: titulo, subtitulo e Fechar permanecem visiveis e contidos.
- Area rolavel: `.treino-editor-scroll` alcanca `maxScroll` nas fases finais com tolerancia de 1 px.
- Rodape: Cancelar e Salvar Treino permanecem visiveis, contidos no editor e sem ampliar largura.
- Dias: cabecalhos, descricoes e acoes permanecem dentro da viewport; nomes longos quebram.
- Exercicios: cards existentes em edicao permanecem contidos, com acoes e textos legiveis.
- Teclado/foco: no viewport 390x844, foco em campos inicial, intermediario, final e textarea foi validado por CDP; `visualViewport` permaneceu disponivel e nao surgiu overflow horizontal. CDP headless nao simula teclado virtual real.
- Overflow horizontal: todos os deltas de `document`, `body`, modal e scroll ficaram em 0 px nas fases medidas.
- Ausencia de mutacao: quantidade e identificadores visiveis de treinos permaneceram estaveis; nenhum treino, dia ou exercicio foi salvo, duplicado ou excluido.

## Medicoes resumidas

| Viewport | Novo final | Edicao final | Overflow | Rolagem |
| --- | --- | --- | --- | --- |
| 320x800 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 360x800 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 375x812 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 390x844 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 412x915 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 430x932 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 800x360 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 844x390 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 915x412 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 768x1024 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 820x1180 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 1024x768 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 1366x768 | aprovado | aprovado | 0 px | atingiu maxScroll |
| 1440x900 | aprovado | aprovado | 0 px | atingiu maxScroll |

## Screenshots geradas

Pasta: `tmp-responsive-screenshots/treino-editor-mobile/`.

- `editor-320-novo-inicio.png`
- `editor-320-novo-final.png`
- `editor-320-edicao-inicio.png`
- `editor-320-edicao-final.png`
- `editor-360-novo-inicio.png`
- `editor-360-novo-final.png`
- `editor-375-novo-inicio.png`
- `editor-375-novo-final.png`
- `editor-390-novo-inicio.png`
- `editor-390-novo-final.png`
- `editor-390-dia.png`
- `editor-390-exercicio.png`
- `editor-390-edicao-inicio.png`
- `editor-390-edicao-final.png`
- `editor-412-novo-inicio.png`
- `editor-412-novo-final.png`
- `editor-430-novo-inicio.png`
- `editor-430-novo-final.png`
- `editor-paisagem-800x360.png`
- `editor-paisagem-844x390.png`
- `editor-paisagem-915x412.png`
- `editor-tablet-768x1024.png`
- `editor-tablet-820x1180.png`
- `editor-desktop-1024.png`
- `editor-desktop-1366.png`
- `editor-desktop-1440.png`

## Status final

Ciclo 6.2.1 aprovado.

## Pendencias para 6.2.2

- Avaliar se os dias devem virar accordion real com `aria-expanded` e `aria-controls`; o editor atual lista todos os dias abertos.
- Definir se exercicios precisam de acoes adicionais de ordenacao sem drag and drop em ciclo futuro.
- Revisar textos mojibake ja existentes em alguns componentes/servicos fora do escopo deste ciclo.
