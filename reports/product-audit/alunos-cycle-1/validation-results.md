# Validation Results

## Commands

- `node --test src/features/alunos/utils/alunosQueryParams.test.js`: PASS, 7 tests.
- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.
- `npm.cmd run qa:dashboard-environment-check`: PASS, 12 tests.
- `npm.cmd run qa:local:environment-check`: PASS after escalated rerun; sandboxed run failed with `EACCES` on `npx supabase status`.
- `npm.cmd run qa:local:data`: PASS, 14 alunos, 2 planos, 14 pagamentos, 1 treino, 1 avaliacao.
- `npm.cmd run qa:alunos-query-context`: PASS.
- `npm.cmd run qa:alunos-authenticated`: PASS.
- `npm.cmd run qa:alunos-functional-audit`: PASS.

## Notes

`scripts/setup-local-qa-data.mjs` was adjusted so LOCAL_QA students store the real plan ID. This makes the plan filter exercise the same contract used by the UI.
