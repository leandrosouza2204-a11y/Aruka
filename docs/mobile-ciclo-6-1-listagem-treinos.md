# Ciclo 6.1 - Listagem e navegacao de Treinos mobile

Data da validacao: 2026-07-13

## Escopo

- Tela `/treinos`: cabecalho, filtros, busca, listagem, cards, menus de acao, abertura de detalhes e preservacao desktop.
- Fora do escopo: editor de treino, exercicios, series, repeticoes, carga, descanso, prescricao, volume, banco de dados, RLS, regras de status, sidebar e bottom navigation.

## Arquivos analisados

- `src/pages/Treinos.jsx`
- `src/features/treinos/hooks/useTreinosPage.js`
- `src/features/treinos/components/TreinosList.jsx`
- `src/features/treinos/components/TreinosHeader.jsx`
- `src/features/treinos/components/TreinosFilters.jsx`
- `src/features/treinos/components/TreinosCards.jsx`
- `src/features/treinos/components/TreinoDetalhesModal.jsx`
- `src/components/TableActions.jsx`
- `src/components/ConfirmDialog.jsx`
- `src/index.css`

## Correcoes aplicadas

- Adicionados seletores estaveis de QA para pagina, filtros, busca, cards, botao de visualizar, menus e confirmacao de exclusao.
- `TableActions` passou a aceitar `testIdPrefix`, preservando o padrao `aluno` e permitindo `treino` sem quebrar validacoes anteriores.
- `ConfirmDialog` passou a aceitar `testIdPrefix`, preservando `aluno` por padrao e expondo `treino-confirmation-*` no modulo Treinos.
- Aplicada compactacao responsiva estrutural na listagem de Treinos, com `box-sizing`, `min-width: 0`, `max-width: 100%`, quebra de texto e contencao dos cards.
- Criado `scripts/validate-treinos-mobile-cdp.mjs`.
- Adicionado `npm run qa:treinos-mobile`.

## Matriz de acoes

| Acao | Resultado mobile | Observacao |
| --- | --- | --- |
| Abrir `/treinos` autenticado | aprovado | sessao QA real concluida |
| Buscar termo sem resultado | aprovado | estado vazio sem overflow |
| Filtrar por status | aprovado | lista reduziu para 1 card no QA |
| Abrir menu do primeiro card | aprovado | menu dentro da viewport em 320 e 390 |
| Abrir menu do ultimo card | aprovado | menu dentro da viewport em 320 e 390 |
| Visualizar treino | aprovado | detalhes contidos em 390 |
| Excluir treino | aprovado sem persistir | confirmacao aberta e cancelada |
| Duplicar treino | nao executado | acao persiste dados imediatamente |
| Novo/editar treino | fora do ciclo | pertence aos ciclos de formulario/editor |

## Dados QA

- Autenticacao: concluida com sucesso.
- Dados disponiveis: 3 cards de treino carregados na listagem.
- Detalhes: pelo menos 1 treino abriu o painel de detalhes.
- Confirmacao destrutiva: dialogo de exclusao abriu e foi cancelado.
- O indicador `hasEmptyState` no log aparece como `true` antes da selecao porque o painel auxiliar "Selecione um treino" esta presente junto da lista; isso nao significa listagem vazia quando `cardCount` e maior que zero.

## Medicoes

| Viewport | Fase | Document | Body | Pagina | Card | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 320x800 | inicio | 320/320 | 320/320 | 320/320 | 268/268 | aprovado |
| 320x800 | menu primeiro | 320/320 | 320/320 | 320/320 | 268/268 | aprovado |
| 320x800 | menu ultimo | 320/320 | 320/320 | 320/320 | 268/268 | aprovado |
| 320x800 | final | 320/320 | 320/320 | 320/320 | 268/268 | aprovado |
| 360x800 | inicio/final | 360/360 | 360/360 | 360/360 | 308/308 | aprovado |
| 375x812 | inicio/final | 375/375 | 375/375 | 375/375 | 319/319 | aprovado |
| 390x844 | inicio | 390/390 | 390/390 | 390/390 | 334/334 | aprovado |
| 390x844 | menu primeiro | 390/390 | 390/390 | 390/390 | 334/334 | aprovado |
| 390x844 | menu ultimo | 390/390 | 390/390 | 390/390 | 334/334 | aprovado |
| 390x844 | busca sem resultado | 390/390 | 390/390 | 390/390 | n/a | aprovado |
| 390x844 | filtro status | 390/390 | 390/390 | 390/390 | 334/334 | aprovado |
| 390x844 | detalhes | 390/390 | 390/390 | 390/390 | 334/334 | aprovado |
| 390x844 | confirmacao excluir | 390/390 | 390/390 | 390/390 | 334/334 | aprovado |
| 390x844 | final | 390/390 | 390/390 | 390/390 | 334/334 | aprovado |
| 412x915 | inicio/final | 412/412 | 412/412 | 412/412 | 356/356 | aprovado |
| 430x932 | inicio/final | 430/430 | 430/430 | 430/430 | 374/374 | aprovado |
| 800x360 | inicio/final | 800/800 | 800/800 | 800/800 | 724/724 | aprovado |
| 844x390 | inicio/final | 844/844 | 844/844 | 844/844 | 768/768 | aprovado |
| 915x412 | inicio/final | 915/915 | 915/915 | 915/915 | 839/839 | aprovado |
| 768x1024 | inicio/final | 768/768 | 768/768 | 768/768 | 712/712 | aprovado |
| 820x1180 | inicio/final | 820/820 | 820/820 | 820/820 | 744/744 | aprovado |
| 1024x768 | inicio/final | 1009/1009 | 1009/1009 | 1009/1009 | 933/933 | aprovado |
| 1366x768 | inicio/final | 1351/1351 | 1351/1351 | 1091/1091 | 320/320 | aprovado |
| 1440x900 | inicio/final | 1425/1425 | 1425/1425 | 1165/1165 | 344/344 | aprovado |

Todos os deltas horizontais ficaram em 0px. Nenhum elemento excedente foi registrado.

## Screenshots

Evidencias geradas em `tmp-responsive-screenshots/treinos-mobile/`:

- `treinos-320-inicio.png`, `treinos-320-final.png`, `treinos-320-menu-primeiro.png`, `treinos-320-menu-ultimo.png`
- `treinos-360-inicio.png`, `treinos-360-final.png`
- `treinos-375-inicio.png`, `treinos-375-final.png`
- `treinos-390-inicio.png`, `treinos-390-final.png`, `treinos-390-menu-primeiro.png`, `treinos-390-menu-ultimo.png`
- `treinos-412-inicio.png`, `treinos-412-final.png`
- `treinos-430-inicio.png`, `treinos-430-final.png`
- `treinos-paisagem-844x390.png`
- `treinos-tablet-768x1024.png`, `treinos-tablet-820x1180.png`
- `treinos-desktop-1024.png`, `treinos-desktop-1366.png`, `treinos-desktop-1440.png`
- `treinos-busca-sem-resultado-390.png`
- `treinos-confirmacao-excluir-390.png`

## Validacoes tecnicas

- `git check-ignore -v .env.qa.local`: ignorado por `.gitignore`.
- `git ls-files .env.qa.local`: vazio.
- `git check-ignore -v tmp-responsive-screenshots/treinos-mobile/treinos-320-inicio.png`: ignorado por `.gitignore`.
- `node --check scripts/validate-treinos-mobile-cdp.mjs`: aprovado.
- `npm run qa:treinos-mobile`: aprovado.
- `npm run lint`: aprovado.
- `npm run build`: aprovado.
- `git diff --check`: aprovado, apenas avisos de LF/CRLF do Windows.

## Status

Aprovado. A listagem e navegacao inicial de Treinos em mobile, paisagem, tablet e desktop nao apresentaram overflow horizontal, menus ficaram contidos e nenhum dado persistente foi alterado durante a validacao.
