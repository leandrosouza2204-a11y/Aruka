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
| `npm.cmd run qa:supabase-ci-static` | PASS | Baseline unica, SHA canonica e scripts CI estaticos aprovados apos consolidacao da RPC. |
| `npm.cmd run qa:supabase-baseline-candidate` | PASS | Candidate regenerada e manifest consistente. |
| `npm.cmd run qa:supabase-migration-cutover` | PASS | Baseline ativa equivalente a candidate; migration incremental fora da cadeia ativa. |
| `npm.cmd run qa:supabase-ci-preflight-isolation` | PASS | Isolamento estatico da cadeia ativa validado. |
| `npm.cmd run qa:supabase-local-reproducibility` | BLOCKED_INFRASTRUCTURE | Docker API inacessivel: `Acesso negado`; cleanup state nao pode ser inspecionado. |
| `npm.cmd run supabase:preflight` | BLOCKED_INFRASTRUCTURE | Docker Server unavailable, contexto diferente de `desktop-linux` e Supabase CLI via `npx` indisponivel. |
| `npm.cmd run supabase:status` | BLOCKED_INFRASTRUCTURE | Script retornou exit code 1 sem detalhes no stdout capturado. |
| `npm.cmd run supabase:validate` | BLOCKED_INFRASTRUCTURE | Docker API inacessivel ao validar o container local. |
| `npm.cmd run supabase:fixtures:validate` | BLOCKED_INFRASTRUCTURE | Container local Supabase nao esta em execucao para `project_id ConsultoriaFitness`. |
| `npm.cmd run qa:treino-template-editor-flow` | BLOCKED_ENVIRONMENT | `node: .env: not found`. |

## Testes criados

`src/features/treinos/utils/workoutDataContract.test.js`

`scripts/validate-supabase-baseline-src.mjs`

Cobertura estatica da RPC:

- `treino_exercicios` preserva nove valores para nove colunas;
- `descanso` recebe `v_exercise->>'descanso'`;
- `observacoes` recebe `v_exercise->>'observacoes'`;
- `video_url` recebe `v_exercise->>'video'`;
- `ordem` recebe `v_exercise_index`.

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

- RPC nao foi aplicada em Supabase local neste ciclo porque Docker/Supabase local nao estavam operacionais neste ambiente.
- Rollback transacional runtime permanece `ROLLBACK_RUNTIME_NOT_PROVEN` ate validacao com Supabase local operacional.
- Testes positivos e negativos reais de rollback devem ser executados em ambiente local ou homologacao antes do piloto.
- Runner CDP representativo nao iniciou por ausencia de `.env`.
