# Ciclo 5.3 - Perfil e detalhes do aluno mobile

Data da validacao: 2026-07-13

## Escopo

- Adaptacao responsiva do painel inline de detalhes do aluno em `/alunos`.
- Sem criacao de rota `/alunos/:id`.
- Sem alteracoes em banco, Supabase, consultas ou regras de negocio.
- Inclusao de seletores estaveis para validacao automatizada.

## Implementacao

- O painel de detalhes passou a usar a estrutura `aluno-details`, com cabecalho, grupos semanticos, area de observacoes e bloco de acoes.
- O conteudo usa quebra defensiva de texto, `min-width: 0`, `max-width: 100%` e botoes empilhados em mobile.
- Foram adicionados os seletores:
  - `data-testid="aluno-details"`
  - `data-testid="aluno-details-header"`
  - `data-testid="aluno-details-content"`
  - `data-testid="aluno-details-plan"`
  - `data-testid="aluno-details-contact"`
  - `data-testid="aluno-details-observacoes"`
  - `data-testid="aluno-details-actions"`
  - `data-testid="aluno-details-edit"`
  - `data-testid="aluno-details-close"`

## Validacao autenticada

- Comando: `npm run qa:aluno-details-mobile`
- Ambiente: Vite em `http://127.0.0.1:5173`
- Autenticacao QA: concluida com sessao real reaproveitada.
- Dados QA: havia aluno disponivel para abrir o painel de detalhes e acionar edicao.
- Credenciais, tokens, cookies e armazenamento de sessao nao foram registrados.
- `.env.qa.local` verificado como ignorado pelo Git.

## Medicoes

Formato: `clientWidth/scrollWidth`.

| Viewport | Fase | Documento | Body | Pagina | Card | Detalhes | Acoes | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 320x800 | inicio | 320/320 | 320/320 | 320/320 | 298/298 | 272/272 | 248/248 | ok |
| 320x800 | final | 320/320 | 320/320 | 320/320 | 298/298 | 272/272 | 248/248 | ok |
| 360x800 | inicio | 360/360 | 360/360 | 360/360 | 338/338 | 312/312 | 288/288 | ok |
| 360x800 | final | 360/360 | 360/360 | 360/360 | 338/338 | 312/312 | 288/288 | ok |
| 375x812 | inicio | 375/375 | 375/375 | 375/375 | 349/349 | 323/323 | 299/299 | ok |
| 375x812 | final | 375/375 | 375/375 | 375/375 | 349/349 | 323/323 | 299/299 | ok |
| 390x844 | inicio | 390/390 | 390/390 | 390/390 | 364/364 | 338/338 | 314/314 | ok |
| 390x844 | final | 390/390 | 390/390 | 390/390 | 364/364 | 338/338 | 314/314 | ok |
| 412x915 | inicio | 412/412 | 412/412 | 412/412 | 386/386 | 360/360 | 336/336 | ok |
| 412x915 | final | 412/412 | 412/412 | 412/412 | 386/386 | 360/360 | 336/336 | ok |
| 430x932 | inicio | 430/430 | 430/430 | 430/430 | 404/404 | 378/378 | 354/354 | ok |
| 430x932 | final | 430/430 | 430/430 | 430/430 | 404/404 | 378/378 | 354/354 | ok |
| 800x360 | inicio | 800/800 | 800/800 | 800/800 | n/a | 770/770 | 730/730 | ok |
| 800x360 | final | 800/800 | 800/800 | 800/800 | n/a | 770/770 | 730/730 | ok |
| 844x390 | inicio | 844/844 | 844/844 | 844/844 | n/a | 814/814 | 774/774 | ok |
| 844x390 | final | 844/844 | 844/844 | 844/844 | n/a | 814/814 | 774/774 | ok |
| 915x412 | inicio | 915/915 | 915/915 | 915/915 | n/a | 885/885 | 845/845 | ok |
| 915x412 | final | 915/915 | 915/915 | 915/915 | n/a | 885/885 | 845/845 | ok |
| 1024x768 | inicio | 1009/1009 | 1009/1009 | 1009/1009 | n/a | 979/979 | 939/939 | ok |
| 1024x768 | final | 1009/1009 | 1009/1009 | 1009/1009 | n/a | 979/979 | 939/939 | ok |
| 1366x768 | inicio | 1351/1351 | 1351/1351 | 1091/1091 | n/a | 1041/1041 | 1001/1001 | ok |
| 1366x768 | final | 1351/1351 | 1351/1351 | 1091/1091 | n/a | 1041/1041 | 1001/1001 | ok |
| 1440x900 | inicio | 1425/1425 | 1425/1425 | 1165/1165 | n/a | 1115/1115 | 1075/1075 | ok |
| 1440x900 | final | 1425/1425 | 1425/1425 | 1165/1165 | n/a | 1115/1115 | 1075/1075 | ok |

## Evidencias

Screenshots salvas em `tmp-responsive-screenshots/aluno-details-mobile/`:

- `detalhes-320-inicio.png`
- `detalhes-320-final.png`
- `detalhes-320-acoes.png`
- `detalhes-360-inicio.png`
- `detalhes-360-final.png`
- `detalhes-375-inicio.png`
- `detalhes-375-final.png`
- `detalhes-390-inicio.png`
- `detalhes-390-final.png`
- `detalhes-390-observacoes.png`
- `detalhes-390-menu.png`
- `detalhes-412-inicio.png`
- `detalhes-412-final.png`
- `detalhes-430-inicio.png`
- `detalhes-430-final.png`
- `detalhes-paisagem-800x360.png`
- `detalhes-paisagem-844x390.png`
- `detalhes-paisagem-915x412.png`
- `detalhes-desktop-1024.png`
- `detalhes-desktop-1366.png`
- `detalhes-desktop-1440.png`

## Resultado

- Overflow horizontal: nao encontrado.
- Deltas horizontais: zero em documento, body, pagina, card, painel de detalhes e acoes nos cenarios aplicaveis.
- Elementos excedentes: nenhum registrado pelo diagnostico automatizado.
- Botao Fechar, titulo, secoes, observacoes e acoes permaneceram contidos no layout.
- Acao `Editar aluno` abriu o modal de edicao e o fechamento retornou ao painel de detalhes.

Status final: aprovado.
