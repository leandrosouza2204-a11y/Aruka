# Ciclo 1.7 - Implementacao de dados e autorizacao

## Decisoes arquiteturais

- `treinos.status` legado foi preservado.
- `treinos.lifecycle_status` foi criado para o ciclo de vida canonico.
- Valores canonicos: `draft`, `active`, `completed`, `archived`.
- Portal, login e policies de aluno nao foram criados nesta etapa.
- Multiplos treinos ativos por aluno continuam tecnicamente permitidos.
- Historico minimo usa `public.treino_eventos`, nao `acompanhamento_eventos`.
- Idempotencia de aplicacao usa `application_idempotency_key` unico por usuario quando preenchido.

## Migration

Migration ativa: `supabase/migrations/20260728030000_workout_delivery_integration_v1.sql`.

Ela adiciona em `public.treinos`:

- `lifecycle_status`;
- `template_origin_id`;
- `template_origin_type`;
- `template_origin_name`;
- `template_origin_snapshot`;
- `applied_by`;
- `applied_at`;
- `delivered_by`;
- `delivered_at`;
- `completed_at`;
- `archived_at`;
- `data_fim`;
- `application_idempotency_key`.

Backfill:

- `Finalizado` vira `completed`;
- `Ativo` vira `active`;
- `Em revisao` ou `Em revisão` vira `draft`;
- valor desconhecido vira `draft`;
- ativos legados recebem `delivered_at = created_at` quando possivel;
- finalizados legados recebem `completed_at = data_revisao`, `created_at` ou `now()`;
- autoria historica nao foi inventada.

## Constraints e indices

- `treinos_lifecycle_status_check`;
- `treinos_template_origin_type_check`;
- `treinos_template_origin_snapshot_object_check`;
- `treinos_lifecycle_dates_check`;
- `treinos_user_aluno_lifecycle_idx`;
- `treinos_user_delivered_at_idx`;
- `treinos_user_template_origin_idx`;
- `treinos_user_application_idempotency_uidx`.

Nao foi criado indice unico para treino ativo por aluno.

## Treino eventos

`public.treino_eventos` registra:

- `applied`;
- `delivered`;
- `status_changed`;
- `completed`;
- `archived`.

A tabela possui FK para `treinos` com cascade e FK para `alunos` com restrict. Metadata aceita objeto JSONB. Nao registra execucao, carga realizada, RPE, RIR ou feedback.

## RPCs

`public.salvar_treino_composto(jsonb)`:

- preserva payloads antigos;
- cria novos treinos como `draft`;
- valida aluno proprio;
- valida origem `official`/`personal`;
- valida modelo pessoal do usuario quando informado;
- aplica idempotencia persistida antes de criar;
- registra evento `applied` quando ha origem de modelo.

`public.entregar_treino(uuid)`:

- exige `auth.uid()`;
- valida treino e aluno do usuario;
- valida completude de dias/exercicios;
- permite `draft -> active`;
- e idempotente quando ja esta `active`;
- registra `delivered_by`, `delivered_at` e evento `delivered`.

`public.alterar_estado_treino(uuid, text)`:

- permite `active -> completed`;
- permite `draft|active|completed -> archived`;
- bloqueia reativacao;
- registra timestamps e evento operacional.

## RLS e grants

`treino_eventos` tem RLS habilitada e policy somente de SELECT para profissional dono do treino. Eventos sao produzidos pelas RPCs; nao ha policy de insert/update/delete direto.

A migration revoga execucao publica das novas RPCs e concede execucao a `authenticated`.

## Compatibilidade e rollback logico

As alteracoes sao aditivas. Registros antigos permanecem com `status` legado. Um rollback logico pode ignorar os campos novos e continuar usando o fluxo anterior, desde que a migration nao seja revertida destrutivamente em producao.

## Impacto financeiro

Nenhuma tabela financeira foi alterada. `alunos`, `pagamentos`, `planos` e `acompanhamento_eventos` permanecem fora do escopo da Etapa 1.

## Itens adiados

- UI de entrega;
- portal do aluno;
- autenticacao de aluno;
- QA mobile de entrega;
- acompanhamento de execucao;
- RPE/RIR;
- feedback do aluno;
- regra unica de treino ativo por aluno.
