# 05 - Validation Evidence

## Validacoes executadas

| Comando | Resultado | Observacao |
| --- | --- | --- |
| `node --test src\\features\\treinos\\utils\\*.test.js` | PASS | 33 testes passaram. |
| `npm.cmd run lint` | PASS | ESLint sem erros. |
| `npm.cmd run build` | PASS | Build Vite concluido. |
| `npm.cmd run qa:workout-template-sanitization` | PASS | Sanitizacao aprovada. |
| `npm.cmd run qa:workout-templates-data` | PASS | 10 modelos oficiais aprovados. |
| `npm.cmd run qa:supabase-baseline-src` | PASS | Baseline-src valida. |
| `npm.cmd run supabase:status` | BLOCKED_INFRASTRUCTURE | Script retornou erro sem detalhes no stdout capturado. |
| `npm.cmd run qa:treino-template-editor-flow` | BLOCKED_ENVIRONMENT | `node: .env: not found`. |

## Testes criados

`src/features/treinos/utils/workoutDataContract.test.js`

Cobertura:

- `schemaVersion`;
- template legado sem versao;
- sanitizacao de dados proibidos;
- tecnica, observacoes e video;
- status canonico e variante antiga;
- payload persistido sem IDs temporarios;
- duplicacao sem IDs originais;
- template vazio, dia invalido e exercicio invalido.

## Limitacoes

- RPC nao foi aplicada em Supabase local neste ciclo porque o ambiente local nao estava confirmado como disponivel.
- Testes positivos/negativos reais de rollback devem ser executados no ambiente local/HML antes do piloto.
- Runner CDP representativo nao iniciou por ausencia de `.env`.
