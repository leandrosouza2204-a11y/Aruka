# Validation Results - Treinos Cycle 3

## PASS

- `node --check scripts/validate-treinos-operabilidade-gestao-cdp.mjs`: PASS.
- `node --check src/features/treinos/utils/treinosListQueryState.js`: PASS.
- `node --test src/features/treinos/utils/*.test.js`: PASS, 21 tests.
- `npm.cmd run lint`: PASS.
- `npm.cmd run build`: PASS.
- `npm.cmd run qa:local:data`: PASS apos rerun escalado.
- `npm.cmd run qa:treinos-editor-integrity`: PASS apos rerun escalado.
- `npm.cmd run qa:treinos-operabilidade-gestao`: PASS apos ajuste de produto e rerun escalado.
- `npm.cmd run qa:treinos-context-onboarding`: PASS apos rerun escalado.
- `git diff --check`: PASS.

## FAIL_ENVIRONMENT_OR_AUTHENTICATION

- `npm.cmd run qa:local:data`: primeira execucao sandboxed falhou com `EACCES` ao executar `npx supabase status`.
- `npm.cmd run qa:treinos-editor-integrity`: primeira execucao sandboxed ficou presa apos timeout interno de `cmd.exe`; rerun escalado passou.
- `npm.cmd run qa:treinos-operabilidade-gestao`: primeira execucao sandboxed falhou no bootstrap interno de `qa:local:data`; rerun escalado passou.
- `npm.cmd run qa:treinos-context-onboarding`: primeira execucao sandboxed falhou no bootstrap interno de `qa:local:data`; rerun escalado passou.

Essas falhas ocorreram antes ou ao redor do bootstrap ambiental local e nao comprovam regressao funcional do Cycle 3.

## FAIL_PRODUCT

- Primeiros runs de `npm.cmd run qa:treinos-operabilidade-gestao` detectaram perda de parametros em alteracoes sequenciais de filtros.
- Correcao aplicada: setters de filtros passaram a usar a URL atual como base antes de chamar `setSearchParams`.
- Resultado final: PASS no rerun escalado.

## NOT_RUN

- `npm.cmd run qa:treinos-functional-audit`
- `npm.cmd run qa:treinos-mobile`
- `npm.cmd run qa:treino-editor-mobile`
- `npm.cmd run qa:treino-exercises-mobile`
- `npm.cmd run qa:treino-templates-mobile`
- `npm.cmd run qa:alunos-query-context`
- `npm.cmd run qa:alunos-authenticated`
- `npm.cmd run qa:workout-templates-data`
- `npm.cmd run qa:workout-template-sanitization`

## Evidencia Funcional

- PASS: filtros secundarios persistem na URL e no refresh.
- PASS: limpar filtros preserva listagem operacional.
- PASS: cancelar exclusao preserva treino.
- PASS: duplicar treino exibe feedback e seleciona copia.
- PASS: excluir copia exige confirmacao e remove item.
- PASS: viewports 320, 375, 390, 768 e 1366 sem overflow horizontal.

## Estado Final

READY.
