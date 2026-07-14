# Ciclo 6.3 - Exercicios no editor de treino mobile

Data: 2026-07-14

## Arquivos analisados

- `src/components/TreinoModal.jsx`
- `src/components/ExercicioCard.jsx`
- `src/features/treinos/hooks/useTreinosPage.js`
- `src/services/treinosService.js`
- `src/data/treinosModelos.js`
- `src/services/workoutTemplatesService.js`
- `src/features/treinos/utils/workoutTemplateSanitization.js`
- `src/index.css`
- scripts QA do Ciclo 6.2
- documentacao do Ciclo 6.2

## Arquivos alterados

- `src/components/ExercicioCard.jsx`
- `src/components/TreinoModal.jsx`
- `package.json`
- `scripts/validate-treino-exercises-mobile-cdp.mjs`

## Estrutura dos exercicios

O editor preserva a arquitetura atual: exercicios ficam no estado local de cada dia e sao persistidos somente quando o treino inteiro e salvo.

Campo | Obrigatorio | Editavel | Persistido | Exibido no card | Mobile | Desktop
--- | --- | --- | --- | --- | --- | ---
`nome` | sim | sim | sim | sim | sim | sim
`series` | nao | sim | sim | sim | sim | sim
`repeticoes` | nao | sim | sim | sim | sim | sim
`carga` | nao | sim | sim | sim | sim | sim
`descanso` | nao | sim | sim | sim | sim | sim
`observacoes` | nao | sim | sim | sim | sim | sim
`video` | nao | sim | sim | link seguro quando existe | sim | sim
`id` | tecnico | nao | sim/temporario | nao | sim | sim

Nao ha campo de tecnica, status por exercicio, grupo muscular por exercicio ou biblioteca persistida de exercicios neste ciclo.

## Decisoes

- Mantido input livre para nome do exercicio; nao existe fonte local confiavel para autocomplete.
- Adicionados seletores estaveis `exercise-*` para QA.
- Adicionada ordenacao local com botoes `Subir` e `Descer`, alternativa acessivel ao drag and drop.
- Adicionado cancelamento explicito da edicao de exercicio.
- Exclusao continua com confirmacao, agora com prefixo proprio de teste.
- Duplicacao de exercicio nao existia e nao foi criada neste ciclo.
- Carga individual permanece no treino e continua removida dos modelos pessoais pela sanitizacao aprovada.

## Card de exercicio

O card passou a exibir:

- ordem visual;
- nome com quebra segura;
- series e repeticoes em destaque;
- carga;
- descanso;
- observacoes;
- link de video seguro quando existe;
- acoes de mover, editar e excluir.

Nomes longos usam `overflow-wrap` e largura contida.

## QA autenticado

Script criado:

- `scripts/validate-treino-exercises-mobile-cdp.mjs`
- `npm run qa:treino-exercises-mobile`

Cobertura:

- login QA;
- `/treinos`;
- novo treino;
- criacao local de dia;
- inclusao local de exercicios;
- nomes longos;
- edicao cancelada;
- edicao confirmada localmente;
- ordenacao;
- exclusao cancelada;
- exclusao confirmada localmente;
- muitos exercicios;
- primeiro e ultimo card;
- rolagem;
- cancelamento do editor;
- comparacao para ausencia de persistencia;
- medicoes de overflow.

Viewports aprovados:

- 320x800
- 360x800
- 375x812
- 390x844
- 412x915
- 430x932
- 844x390
- 768x1024
- 820x1180
- 1024x768
- 1366x768
- 1440x900

Chrome headless nao simula teclado virtual real; a validacao cobre foco e rolagem com inputs focaveis.

## Regressoes

Executadas e aprovadas:

- `npm run qa:workout-template-sanitization`
- `npm run qa:workout-templates-data`
- `npm run qa:treino-templates-mobile`
- `npm run qa:treino-custom-templates`
- `npm run lint`
- `npm run build`
- `git diff --check`

## Evidencias

Screenshots salvas em:

- `tmp-responsive-screenshots/treino-exercises-mobile/`

A pasta permanece ignorada pelo git.

## Riscos residuais

- Warning preexistente de ESLint em `useTreinosPage.js` sobre dependencia de hook.
- Teste de teclado virtual real deve ser complementado manualmente em dispositivo fisico.

## Pendencias para o Ciclo 6.4

- Avaliar melhorias de foco fino apos cada reordenacao.
- Avaliar menu compacto para acoes secundarias se a densidade dos cards crescer.
- Avaliar tecnica/superset/periodizacao somente se virarem escopo formal futuro.

## Status

Ciclo 6.3 aprovado.
