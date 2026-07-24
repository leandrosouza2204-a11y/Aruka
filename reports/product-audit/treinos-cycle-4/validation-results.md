# Validation Results - Treinos Cycle 4

Decisao final: READY_WITH_LIMITATIONS.

Motivo da limitacao: regressao incompleta e falha ambiental/autenticacao na suite do Cycle 1.

## PASS

- `node --check scripts/validate-treinos-resiliencia-erros-retry-cdp.mjs`
- `node --check src/features/treinos/utils/treinosErrorState.js`
- `node --test src/features/treinos/utils/*.test.js`
- `npm.cmd run lint`
- `npm.cmd run build`
- `npm.cmd run qa:local:data`
- `npm.cmd run qa:treinos-editor-integrity`
- `npm.cmd run qa:treinos-operabilidade-gestao`
- `npm.cmd run qa:treinos-resiliencia-erros-retry`
- `npm.cmd run qa:treinos-mobile`

## FAIL

- `npm.cmd run qa:treinos-context-onboarding`
- Motivo: autenticacao nao concluida; execucao permaneceu em `/login` aguardando `[data-testid="treinos-page"]`.
- Classificacao: FAIL_ENVIRONMENT_OR_AUTHENTICATION.
- Nao houve entrada no modulo Treinos nessa execucao. Portanto, a falha nao comprova regressao funcional do Cycle 4.

## NOT_RUN

- `npm.cmd run qa:treino-editor-mobile`
- `npm.cmd run qa:treino-templates-mobile`
- `npm.cmd run qa:treino-custom-templates`
- `npm.cmd run qa:treino-editor-module`
- `npm.cmd run qa:treino-editor-final`
- `npm.cmd run qa:treino-exercises-mobile`
- `npm.cmd run qa:treino-template-editor-flow`
- `npm.cmd run qa:treinos-functional-audit`
- `npm.cmd run qa:treino-library-cycle-6-4`

## Evidencias Operacionais

- Fixtures restauradas por `qa:local:data`: `LOCAL_QA_DATA_READY`, modo `default`, 14 alunos, 2 planos, 14 pagamentos, 1 treino e 1 avaliacao.
- Relatorio antigo de dashboard restaurado apos as execucoes QA.
- Relatorios historicos de `reports/product-audit/treinos-cycle-2/` e `reports/product-audit/treinos-cycle-3/` restaurados apos as execucoes QA.
- Portas 5173, 5174 e 9222 verificadas sem listeners remanescentes.

## Observacoes

- A suite dedicada registrou PASS para carga inicial com erro recuperavel, retry com sucesso, retry com nova falha, falha controlada de duplicacao, falha controlada de exclusao, preservacao de contexto via URL e viewports 320/375/390/768/1366.
- Console e network foram registrados em `console-results.md` e `network-results.md`; falhas LOCAL_QA aparecem como eventos controlados da propria suite.
