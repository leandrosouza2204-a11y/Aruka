# Ciclo 5.4 - Acoes, menus e fluxos relacionados de Alunos

Data da validacao: 2026-07-13

## Escopo

- Auditoria e ajuste dos menus de acoes do modulo Alunos.
- Validacao dos fluxos disponiveis a partir de listagem, detalhes inline e tabela desktop.
- Sem alteracoes em banco, Supabase, RLS, queries, permissoes, calculos ou regras de negocio.
- Nenhuma acao destrutiva foi confirmada na automacao.

## Arquivos analisados

- `src/features/alunos/components/AlunoCardMobile.jsx`
- `src/features/alunos/components/AlunosList.jsx`
- `src/features/alunos/components/AlunosTable.jsx`
- `src/features/alunos/hooks/useAlunosPage.js`
- `src/components/TableActions.jsx`
- `src/components/AccessibleModal.jsx`
- `src/components/ConfirmDialog.jsx`
- `src/services/whatsappService.js`
- `src/index.css`

## Arquivos alterados

- `src/components/TableActions.jsx`
- `src/components/AccessibleModal.jsx`
- `src/components/ConfirmDialog.jsx`
- `src/features/alunos/components/AlunoCardMobile.jsx`
- `src/features/alunos/components/AlunosTable.jsx`
- `src/index.css`
- `package.json`
- `scripts/validate-aluno-actions-mobile-cdp.mjs`
- `docs/mobile-ciclo-5-4-acoes-menus-fluxos-alunos.md`

## Matriz de acoes

| Acao | Origem | Destino | Tipo | Muta dados | Confirmacao | Mobile | Desktop |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Detalhes/Ocultar | Card, tabela | Painel inline | UI local | Nao | Nao | Sim | Sim |
| Check-in | Card, tabela | `whatsapp://send` | Navegacao externa | Nao no app | Nao | Sim | Sim |
| Editar | Menu, detalhes, tabela | Modal de aluno | Modal | Somente se salvar | Nao | Sim | Sim |
| Excluir | Menu, tabela | Confirmacao | Destrutiva potencial | Sim, se confirmar | Sim | Sim | Sim |
| Treinos | Nao disponivel em Alunos | n/a | n/a | n/a | n/a | Nao | Nao |
| Avaliacoes | Nao disponivel em Alunos | n/a | n/a | n/a | n/a | Nao | Nao |
| Financeiro/Historico/Renovar | Nao disponivel em Alunos | n/a | n/a | n/a | n/a | Nao | Nao |
| Inativar/Reativar | Nao disponivel em Alunos | n/a | n/a | n/a | n/a | Nao | Nao |

## Correcoes

- `TableActions` agora usa clamp horizontal com margem minima de 16px, largura `min(240px, calc(100vw - 32px))`, `position: fixed`, max-height dinamico e flip vertical por espaco disponivel.
- Escape fecha o menu em listener global enquanto ele esta aberto e restaura foco ao trigger.
- Trigger do menu recebeu `data-testid="aluno-actions-trigger"` e area de toque de 44x44px em mobile.
- Menu recebeu `data-testid="aluno-actions-menu"`, z-index acima da bottom navigation e abaixo dos modais.
- Acoes de Alunos receberam seletores estaveis: detalhes, WhatsApp/check-in, editar e excluir.
- Confirmacao recebeu `role="alertdialog"` e seletores para dialog, cancelar e confirmar.
- `AccessibleModal` passou a aceitar `role` e demais props encaminhados ao dialog.

## Validacao autenticada

- Comando: `npm run qa:aluno-actions-mobile`
- Autenticacao QA: concluida com sucesso.
- Ambiente: `http://127.0.0.1:5173/alunos`
- `.env.qa.local`: ignorado pelo Git e nao versionado.
- Dados reais: usados apenas para leitura e abertura/cancelamento de fluxos.
- Mutacoes reais: nenhuma. A automacao nao salvou edicao, nao excluiu, nao inativou, nao renovou e nao registrou pagamento.

## Resultados por viewport

Formato: `clientWidth/scrollWidth`.

| Viewport | Primeiro menu | Ultimo menu | Documento | Body | Status |
| --- | --- | --- | --- | --- | --- |
| 320x800 | 57-297, 240px | 57-297, 240px | 320/320 | 320/320 | ok |
| 360x800 | 97-337, 240px | 97-337, 240px | 360/360 | 360/360 | ok |
| 375x812 | 110-350, 240px | 110-350, 240px | 375/375 | 375/375 | ok |
| 390x844 | 125-365, 240px | 125-365, 240px | 390/390 | 390/390 | ok |
| 412x915 | 147-387, 240px | 147-387, 240px | 412/412 | 412/412 | ok |
| 430x932 | 165-405, 240px | 165-405, 240px | 430/430 | 430/430 | ok |
| 800x360 | 532.95-772.95, 240px | 532.95-772.95, 240px | 800/800 | 800/800 | ok |
| 844x390 | 576.97-816.97, 240px | 576.97-816.97, 240px | 844/844 | 844/844 | ok |
| 915x412 | 647.95-887.95, 240px | 647.95-887.95, 240px | 915/915 | 915/915 | ok |
| 1024x768 | 731.78-971.78, 240px | 731.78-971.78, 240px | 1009/1009 | 1009/1009 | ok |
| 1366x768 | 1074-1314, 240px | 1074-1314, 240px | 1351/1351 | 1351/1351 | ok |
| 1440x900 | 1148-1388, 240px | 1148-1388, 240px | 1425/1425 | 1425/1425 | ok |

## Fluxos validados

- Primeiro menu: abriu dentro da viewport, sem overflow e com apenas um menu aberto.
- Ultimo menu: abriu dentro da viewport, inclusive em paisagem e proximo da area inferior.
- Detalhes: abriu e manteve `document`, `body`, card e painel sem overflow.
- Editar: abriu modal, carregou fluxo correto e cancelou sem persistir dados.
- Excluir: abriu confirmacao, foco inicial seguro em Cancelar, cancelou sem executar exclusao.
- WhatsApp/check-in: botoes disponiveis com telefone valido; a automacao nao abriu app externo.
- Treinos, Avaliacoes, Financeiro, Historico, Renovacao, Inativar e Reativar: nao existem como acoes diretas no modulo Alunos atual; registrados como indisponiveis para ciclo futuro, sem criar novas acoes.
- Body scroll: bloqueado apenas pelos modais e restaurado apos fechar.
- Portais: menu e confirmacao renderizam fora de ancestrais com overflow; sem clipping.
- Bottom navigation: nao cobriu menus nem confirmacoes testadas.
- Desktop: menus da tabela, edicao e confirmacao preservados.

## Screenshots

Pasta: `tmp-responsive-screenshots/aluno-actions-mobile/`

- `actions-320-menu-primeiro.png`
- `actions-320-menu-ultimo.png`
- `actions-320-detalhes.png`
- `actions-320-edicao.png`
- `actions-320-confirmacao-excluir.png`
- `actions-360-menu-primeiro.png`
- `actions-360-menu-ultimo.png`
- `actions-375-menu-primeiro.png`
- `actions-375-menu-ultimo.png`
- `actions-390-menu-primeiro.png`
- `actions-390-menu-ultimo.png`
- `actions-390-detalhes.png`
- `actions-390-edicao.png`
- `actions-390-confirmacao-excluir.png`
- `actions-412-menu-primeiro.png`
- `actions-412-menu-ultimo.png`
- `actions-430-menu-primeiro.png`
- `actions-430-menu-ultimo.png`
- `actions-paisagem-844x390.png`
- `actions-desktop-1366.png`

Screenshots de historico financeiro, renovacao e inativacao nao foram geradas porque essas acoes nao estao disponiveis diretamente no modulo Alunos atual.

## Status

- Overflow horizontal: nao encontrado.
- Menus primeiro e ultimo card: aprovados.
- Confirmacoes: aprovadas para cancelamento seguro.
- Acessibilidade basica: seletores, `aria-expanded`, `aria-haspopup`, role de menu e `alertdialog` presentes.
- Areas de toque: trigger mobile ajustado para 44x44px.
- Contexto: busca/filtros nao foram reinicializados por abrir/cancelar menus e modais.
- Status final: aprovado.

## Pendencias recomendadas para Ciclo 5.5

- Decidir se Alunos deve expor atalhos diretos para Treinos, Avaliacoes e Financeiro ou manter navegacao pelos modulos dedicados.
- Se essas acoes forem adicionadas futuramente, validar pre-selecao de aluno e retorno de contexto em ciclo proprio.
- Avaliar se Check-in deve virar link/anchor seguro ou manter navegacao programatica para `whatsapp://`.
