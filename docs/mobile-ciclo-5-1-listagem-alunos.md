# Ciclo 5.1 - Listagem e navegacao de alunos mobile

Data da validacao: 2026-07-13

## Escopo

Auditoria estrutural e responsiva da rota `/alunos`, com sessao QA autenticada real e dados reais do usuario QA. A tarefa cobriu cabecalho, botao de novo aluno, busca, filtros, cards mobile, tabela desktop, detalhes do aluno, menus de acoes, rolagem vertical, bottom navigation e ausencia de overflow horizontal.

Nao houve alteracao em regras de negocio, consultas Supabase, calculos, formularios de cadastro/edicao, sidebar ou bottom navigation.

## Ajustes realizados

- `AlunoCardMobile` passou a usar `TableActions` para as acoes secundarias `Editar` e `Excluir`, mantendo `Detalhes` e `Check-in` como acoes diretas.
- A pagina e os controles receberam seletores estaveis para validacao automatizada: `data-page="alunos"`, `data-testid="alunos-page"`, `data-testid="aluno-mobile-card"`, `data-testid="alunos-search"`, `data-testid="alunos-status-filter"` e `data-testid="alunos-plan-filter"`.
- CSS especifico de Alunos reforcou `min-width: 0`, `max-width: 100%`, quebra de texto, cards contidos, detalhes inline em uma coluna no mobile e menu de acoes dentro da largura util.
- Adicionado `scripts/validate-alunos-mobile-cdp.mjs` e script `npm run qa:alunos-mobile`.

## Seguranca

- `.env.qa.local` confirmado como ignorado pelo Git via `.gitignore`.
- `git ls-files .env.qa.local` retornou vazio.
- Credenciais, tokens, cookies e armazenamento da sessao nao foram impressos, documentados nem versionados.

## Cenario validado

- Autenticacao QA concluida e sessao reaproveitada na segunda execucao.
- Rota `/alunos` carregada com 14 cards reais.
- Busca exercitada com termo QA sem resultado e filtros limpos em seguida.
- Filtro de status exercitado e limpo em seguida.
- Detalhes do primeiro aluno abertos inline sem mutacao de dados.
- Menus de acoes do primeiro e do ultimo card abertos e medidos em todos os viewports mobile.
- Tabela desktop validada em 1024, 1366 e 1440.

Observacao: a aplicacao nao possui rota de perfil de aluno separada em `/alunos/:id`; a navegacao de perfil disponivel neste modulo e o painel inline de `Detalhes`, que foi aberto e fechado sem salvar alteracoes.

## Medicoes

| Viewport | Documento | Body | Main | Cards | Menu primeiro | Menu ultimo | Status |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| 320x800 | 320/320 | 320/320 | 320/320 | 14 | 107-297 | 107-297 | aprovado |
| 360x800 | 360/360 | 360/360 | 360/360 | 14 | 147-337 | 147-337 | aprovado |
| 375x812 | 375/375 | 375/375 | 375/375 | 14 | 160-350 | 160-350 | aprovado |
| 390x844 | 390/390 | 390/390 | 390/390 | 14 | 175-365 | 175-365 | aprovado |
| 412x915 | 412/412 | 412/412 | 412/412 | 14 | 197-387 | 197-387 | aprovado |
| 430x932 | 430/430 | 430/430 | 430/430 | 14 | 215-405 | 215-405 | aprovado |
| 1024x768 | 1009/1009 | 1009/1009 | 1009/1009 | tabela | n/a | n/a | aprovado |
| 1366x768 | 1351/1351 | 1351/1351 | 1091/1091 | tabela | n/a | n/a | aprovado |
| 1440x900 | 1425/1425 | 1425/1425 | 1165/1165 | tabela | n/a | n/a | aprovado |

Formato das colunas de largura: `clientWidth/scrollWidth`.

## Evidencias

Screenshots geradas em `tmp-responsive-screenshots/alunos-mobile/`:

- `alunos-320-inicio.png`, `alunos-320-detalhes.png`, `alunos-320-menu-primeiro.png`, `alunos-320-menu-ultimo.png`, `alunos-320-final.png`
- `alunos-360-inicio.png`, `alunos-360-detalhes.png`, `alunos-360-menu-primeiro.png`, `alunos-360-menu-ultimo.png`, `alunos-360-final.png`
- `alunos-375-inicio.png`, `alunos-375-detalhes.png`, `alunos-375-menu-primeiro.png`, `alunos-375-menu-ultimo.png`, `alunos-375-final.png`
- `alunos-390-inicio.png`, `alunos-390-detalhes.png`, `alunos-390-menu-primeiro.png`, `alunos-390-menu-ultimo.png`, `alunos-390-final.png`
- `alunos-412-inicio.png`, `alunos-412-detalhes.png`, `alunos-412-menu-primeiro.png`, `alunos-412-menu-ultimo.png`, `alunos-412-final.png`
- `alunos-430-inicio.png`, `alunos-430-detalhes.png`, `alunos-430-menu-primeiro.png`, `alunos-430-menu-ultimo.png`, `alunos-430-final.png`
- `alunos-desktop-1366.png`

## Resultado

- `documentElement.scrollWidth - clientWidth`: 0px em todos os cenarios.
- `body.scrollWidth - clientWidth`: 0px em todos os cenarios.
- `main.scrollWidth - clientWidth`: 0px em todos os cenarios.
- Nenhum elemento excedente registrado pelo diagnostico CDP.
- Menus de primeiro e ultimo card permaneceram dentro da viewport.
- Cards, textos, valores, status e detalhes ficaram contidos.
- Conteudo rolou apenas verticalmente.
- Bottom navigation nao bloqueou o ultimo card durante a medicao final.

Status final: aprovado.
