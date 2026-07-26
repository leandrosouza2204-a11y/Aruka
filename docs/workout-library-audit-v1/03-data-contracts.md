# 03 - Data Contracts

## Entidades

| Entidade | Origem | Campos principais | Backend/banco | Frontend | Riscos |
| --- | --- | --- | --- | --- | --- |
| Template oficial | `src/data/treinosModelos.js` | `id`, `nome`, `genero`, `divisao`, `objetivo`, `nivel`, `descricao`, `isSystem`, `dias[]` | Nao persiste em tabela. | `criarModeloTreino`, `obterModelosTreino`. | Contrato diferente de `template_data`. |
| Template pessoal | `workout_templates` | `owner_id`, `name`, `reference_gender`, `split_type`, `objective`, `level`, `description`, `template_data`, `is_system`, `is_active` | RLS por `owner_id`; check `is_system=false`; `template_data` jsonb objeto. | `workoutTemplatesService`. | JSONB pouco restrito no banco; validacao forte fica no frontend. |
| Treino persistido | `treinos` | `user_id`, `aluno_id`, `nome_rotina`, `objetivo`, `nivel`, `dias_semana`, `status`, datas, observacoes | FK para `auth.users` e `alunos`; RLS por `user_id`. | `treinosService`. | Gravacao composta nao atomica. |
| Dia de treino | `treino_dias` | `treino_id`, `nome`, `grupo_muscular`, `ordem` | FK cascade para `treinos`; RLS via treino. | `inserirDiasEExercicios`, `rowParaTreino`. | Ordem depende de insercao sequencial. |
| Exercicio do treino | `treino_exercicios` | `treino_dia_id`, `nome`, `series`, `repeticoes`, `carga`, `descanso`, `observacoes`, `video_url`, `ordem` | FK cascade para `treino_dias`; RLS via treino. | `TreinoModal`, `ExercicioCard`. | Sem catalogo mestre de exercicios. |
| Aluno | `alunos` | `id`, `user_id`, `nome`, `whatsapp`, plano/status | RLS por `user_id`. | Contexto e selecao de treino. | Treino exige aluno existente do usuario. |

## Matriz comparativa

| Conceito | Template oficial | Template pessoal | Treino persistido |
| --- | --- | --- | --- |
| Origem | `src/data/treinosModelos.js` | `public.workout_templates` | `public.treinos`, `treino_dias`, `treino_exercicios` |
| Persistencia | Codigo frontend | Supabase JSONB | Supabase relacional |
| Identificador | String fixa por modelo | UUID | UUID por treino/dia/exercicio |
| Ownership | Nao tem usuario; protegido por codigo | `owner_id = auth.uid()` | `user_id = auth.uid()` e aluno do usuario |
| Estrutura de dias | `dias[].nome/descricao/exercicios` | `template_data.days[]` | Tabela `treino_dias` |
| Estrutura de exercicios | Campos UI em portugues | `name`, `sets`, `repetitions`, `rest`, `technique`, `notes`, `video`, `order` | Tabela `treino_exercicios` |
| Campos obrigatorios | Definidos por codigo | `name`, `template_data`; dias/exercicios validados no frontend | `aluno_id`, `nome_rotina`, dias/exercicios com `nome` |
| Sanitizacao | Nao passa por `sanitizeWorkoutForTemplate` | Remove aluno, datas, status, IDs, carga e ownership | Nao sanitiza como template; mapeia payload |
| Transformacao | `criarModeloTreino` | `templateDataToWorkout` e `sanitizeWorkoutForTemplate` | `rowParaTreino` e `treinoParaPayload` |
| Riscos | Divergencia com JSONB pessoal | Banco aceita JSONB objeto sem schema profundo | Persistencia parcial em varias chamadas |

## Transformacoes

| Transformacao | Funcao | Entrada | Saida | Risco |
| --- | --- | --- | --- | --- |
| Modelo oficial -> editor | `criarModeloTreino` | ID/divisao e opcoes | Treino editavel | Status usa "Em revisao" sem acento, enquanto filtros incluem "Em revisão". |
| Modelo pessoal -> editor | `templateDataToWorkout` | Modelo com `templateData` | Treino editavel | Perde `technique` se `notes` existir, pois concatena por prioridade. |
| Treino existente -> editor | `abrirEdicao` + estado inicial do `TreinoModal` | Objeto normalizado | Form local | Mantem IDs locais ate salvar. |
| Editor -> template pessoal | `sanitizeWorkoutForTemplate` | Treino do editor | `template_data` | Remove `carga` e dados de aluno por design. |
| Editor -> treino persistido | `treinoParaPayload` + `inserirDiasEExercicios` | Form normalizado | Registros relacionais | Nao atomico. |
| Duplicacao de treino | `duplicarTreino` | Treino existente | Novo treino em revisao | Tambem depende de gravacao composta. |
| Aplicacao ao aluno | `TreinoTemplatesModal.gerar` | Modelo + aluno | Editor com aluno preselecionado | Nao persiste ate salvar. |

## Observacoes

- Nao existe tabela de biblioteca de exercicios/categorias/grupos musculares dedicada.
- Campos de exercicio sao texto livre.
- `workout_templates` tem indices por `owner_id`, `(owner_id, updated_at desc)` e `(owner_id, split_type)`.
- `treinos` tem indices por `user_id`, `aluno_id` e `(user_id, created_at desc)`.
