# Ciclo 1.6 - Auditoria mobile da Biblioteca de Treinos

## Escopo

Auditoria dirigida do fluxo mobile da Biblioteca de Treinos, cobrindo descoberta, busca, filtros, cards, menus, visualizacao, aplicacao guiada, criacao, edicao e duplicacao de modelos pessoais. Nao foram auditados modulos externos.

## Componentes

- `TreinoTemplatesModal.jsx`: descoberta, filtros, cards, menus, preview, aplicacao guiada, sucesso, erro e retry.
- `TreinoSalvarModeloModal.jsx`: criacao, edicao, duplicacao oficial/pessoal, preview e persistencia de modelo pessoal.
- `src/index.css`: overlays, modais, grids, menus, footer, scroll e responsividade da biblioteca.
- `workoutTemplateApplication.js` e `personalWorkoutTemplateManagement.js`: regras puras ja existentes preservadas.

## Estados Auditados

Biblioteca carregando, erro de modelos, busca sem resultado, filtros ativos, card selecionado, menu oficial, menu pessoal, preview, selecao de aluno, submitting, sucesso, erro, retry, criacao, edicao, duplicacao oficial, duplicacao pessoal e confirmacao de persistencia.

## Viewports

Auditadas por inspecao estatica para riscos de layout: 320 x 568, 360 x 800, 375 x 667, 390 x 844, 412 x 915 e desktop. Validacao runtime real ficou bloqueada por infraestrutura autenticada/CDP.

## Matriz

| Jornada | Estado | Componente | Viewport | Problema | Severidade | Correcao |
| --- | --- | --- | --- | --- | --- | --- |
| Cards e menus | Menu oficial/pessoal aberto | `TreinoTemplatesModal.jsx` | 320 x 568 | Gatilho e itens eram `span role="button"`; Espaco nao acionava e sem `aria-expanded`. | Alta | Trocado para `button`, com `aria-expanded`, `aria-controls` e Escape. |
| Cards e menus | Menu aberto em card estreito | `src/index.css` | 320 x 568 | Menu nao tinha limite explicito por viewport. | Media | Adicionado `max-width: calc(100vw - 32px)` e quebra de texto nos itens. |
| Modais | Biblioteca/aplicacao | `src/index.css` | Mobile | Modal usava `100vh` como referencia principal fora do fallback. | Media | Adicionado `100dvh`/`calc(100dvh - 48px)` com fallback `100vh`. |
| Criacao/edicao | Formulario longo | `TreinoSalvarModeloModal.jsx` e CSS | 320 x 568 | Footer estava dentro do formulario rolavel sem reforco de acessibilidade visual. | Media | Footer do formulario passou a ficar sticky dentro da area rolavel e botoes empilham em mobile. |
| Acessibilidade | Erro de nome | `TreinoSalvarModeloModal.jsx` | Todos | Campo indicava invalido, mas sem vinculo explicito com mensagem. | Media | Adicionado `aria-describedby` para erro do nome. |
| Aplicacao guiada | Submitting | `TreinoTemplatesModal.jsx` | Todos | `aria-busy` existia no botao final, mas nao no dialog. | Baixa | Dialog recebe `aria-busy` durante persistencia. |

## Evidencia

A evidencia estatica esta em `reports/workout-library-mobile-flow-v1/result.json` e `reports/workout-library-mobile-flow-v1/summary.md`. Screenshots runtime nao foram geradas porque a validacao autenticada/CDP nao foi executada.
