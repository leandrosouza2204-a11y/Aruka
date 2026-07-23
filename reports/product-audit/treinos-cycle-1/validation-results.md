# Validation Results

## Passed

- `node --check scripts/validate-treinos-context-onboarding-cdp.mjs`
- `node --test src/features/treinos/utils/*.test.js src/features/alunos/utils/*.test.js`
- `npm.cmd run lint`
- `npm.cmd run build`
- `npm.cmd run qa:treinos-context-onboarding`
- `npm.cmd run qa:treinos-functional-audit`
- `npm.cmd run qa:treinos-mobile`
- `npm.cmd run qa:treino-templates-mobile`
- `npm.cmd run qa:alunos-query-context`
- `npm.cmd run qa:workout-templates-data`
- `npm.cmd run qa:workout-template-sanitization`
- `npm.cmd run qa:alunos-authenticated`

## Limited / Timeout

- `npm.cmd run qa:treino-editor-mobile`: execucao isolada ficou sem saida ate o limite controlado e foi encerrada de forma direcionada.
- `npm.cmd run qa:treino-exercises-mobile`: execucao isolada ficou sem saida ate o limite controlado e foi encerrada de forma direcionada.

## Notes

- O QA dedicado de contexto cobre `alunoId` valido, `returnTo` seguro, aluno sem treino, `alunoId` malformado/inexistente, refresh, navegacao de retorno e mobile 390 sem overflow horizontal.
- `qa:alunos-authenticated` nao reproduziu a falha anterior em `aluno-form-modal`; a execucao atual finalizou com status `ok` em todos os cenarios reportados.
