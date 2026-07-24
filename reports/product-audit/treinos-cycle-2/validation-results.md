# Validation Results - Treinos Cycle 2

## Escopo

Este relatorio registra apenas os resultados do Treinos Cycle 2, focado em integridade minima do editor de Treinos, dirty state e protecao contra descarte silencioso.

## PASS

- `node --check scripts/validate-treinos-editor-integrity-cdp.mjs`: PASS.
- `node --test src/features/treinos/utils/*.test.js`: PASS.
- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.
- `npm.cmd run qa:treinos-editor-integrity`: PASS.
- `git diff --check`: PASS.

## FAIL

- `npm.cmd run qa:treinos-context-onboarding`: FAIL_ENVIRONMENT_OR_AUTHENTICATION.

Motivo: autenticacao nao concluida; a execucao permaneceu em `/login` aguardando `[data-testid="treinos-page"]`.

Classificacao: `FAIL_ENVIRONMENT_OR_AUTHENTICATION`.

Nao houve entrada no modulo Treinos durante essa execucao. Portanto, esta falha nao comprova regressao funcional do Cycle 2; ela limita a regressao completa porque a suite do Cycle 1 nao conseguiu atravessar a etapa ambiental/autenticacao.

## NOT_RUN

- `npm.cmd run qa:dashboard-environment-check`
- `npm.cmd run qa:local:environment-check`
- `npm.cmd run qa:treinos-functional-audit`
- `npm.cmd run qa:treinos-mobile`
- `npm.cmd run qa:treino-editor-mobile`
- `npm.cmd run qa:treino-exercises-mobile`
- `npm.cmd run qa:treino-templates-mobile`
- `npm.cmd run qa:alunos-query-context`
- `npm.cmd run qa:alunos-authenticated`
- `npm.cmd run qa:workout-templates-data`
- `npm.cmd run qa:workout-template-sanitization`

## Estado Restaurado

- Fixtures restauradas por `qa:local:data`.
- Relatorio antigo de dashboard restaurado.
- Portas 5173, 5174 e 9222 verificadas sem listeners remanescentes.

## Decisao Final

`READY_WITH_LIMITATIONS`.

Motivo da limitacao: regressao incompleta e falha ambiental/autenticacao na suite do Cycle 1 (`npm.cmd run qa:treinos-context-onboarding`), que permaneceu em `/login` antes de entrar no modulo Treinos.
