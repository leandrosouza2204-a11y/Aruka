# 02 - Transformation Matrix

| Transformacao | Funcao | Entrada | Saida | Decisao |
| --- | --- | --- | --- | --- |
| Template oficial -> contrato canonico | `criarModeloTreino` + contrato ao salvar | Modelo em `src/data/treinosModelos.js` | Treino editor/payload | Preservado comportamento atual; status canonico. |
| Template pessoal -> contrato canonico | `normalizeCanonicalTemplateData` | `template_data` atual ou legado | Template v1 normalizado | Aceita legado sem versao. |
| Contrato canonico -> editor | `canonicalTemplateToWorkout` | Template pessoal | Treino editavel | Remove carga; preserva tecnica/observacoes/video. |
| Editor -> contrato canonico | `workoutToCanonicalTemplateData` | Treino do editor | `template_data` v1 | Remove aluno, datas, status, IDs, ownership e carga. |
| Contrato canonico -> treino persistido | `workoutToPersistencePayload` | Treino editor | JSON para RPC | Ordena dias/exercicios por posicao. |
| Treino persistido -> editor | `rowParaTreino` | Supabase relacional | Objeto de treino | Mantido e ordenado por `ordem`. |
| Treino existente -> template pessoal | `sanitizeWorkoutForTemplate` | Treino existente | Template canonico v1 | Wrapper compativel com API anterior. |
| Treino existente -> duplicacao | `duplicateWorkoutDraft` | Treino normalizado | Novo draft sem IDs | Reutiliza `adicionarTreinoSupabase` e RPC. |

## Compatibilidade preservada

- APIs publicas `sanitizeWorkoutForTemplate`, `templateDataToWorkout`, `templateDataToPreviewDays`, `validateTemplateData` e `countTemplateExercises` continuam existindo.
- Scripts existentes de sanitizacao e dados oficiais continuam executando.
- Templates pessoais legados sem `schemaVersion` continuam sendo lidos.

## Campos removidos de template

- IDs de treino/dia/exercicio.
- `userId`, `user_id`, `owner_id`.
- `alunoId`, `aluno_id`, `aluno`, `nomeAluno`, `alunoWhatsapp`.
- `status`, datas e timestamps.
- `templateId`.
- `carga`.
