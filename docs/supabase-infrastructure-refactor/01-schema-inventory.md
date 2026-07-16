# Inventario do Schema

Fonte: SQL versionado em `supabase/*.sql` e `supabase/migrations/*.sql`.

## Tabelas

| Tabela | Origem principal | PK | FKs | Colunas principais | Indices declarados |
| --- | --- | --- | --- | --- | --- |
| `public.alunos` | `supabase/alunos.sql` | `id uuid` | `user_id -> auth.users(id)` | `nome`, `whatsapp`, `nascimento`, `inicio`, `vencimento`, `aviso7`, `aviso1`, `plano`, `valor`, `status`, `pagamento_recebido`, `data_pagamento`, `observacoes`, `created_at`; migrations adicionam `acompanhamento_status`, `acompanhamento_encerrado_em`, `acompanhamento_motivo`, `acompanhamento_motivo_detalhe` | `alunos_user_id_idx`, `alunos_vencimento_idx`, `alunos_user_vencimento_idx`, `alunos_user_acompanhamento_status_idx` |
| `public.planos` | `supabase/planos.sql` | `id uuid` | `user_id -> auth.users(id)` | `nome`, `descricao`, `duracao_meses`, `valor`, campos de parcelamento, `ativo`, `created_at`; migration adiciona unicidade por usuario/nome ativo | `planos_user_id_idx`, `planos_ativo_idx`, `planos_user_ativo_idx` |
| `public.pagamentos` | `supabase/pagamentos.sql` | `id uuid` | `user_id -> auth.users(id)`, `aluno_id -> public.alunos(id)` | `plano`, `valor`, `data_pagamento`, `forma_pagamento`, `parcela`, `total_parcelas`, `tipo_movimento`, vencimentos, `observacao`, `observacoes`, `created_at` | `pagamentos_user_id_idx`, `pagamentos_aluno_id_idx`, `pagamentos_data_pagamento_idx`, `pagamentos_user_aluno_data_idx` |
| `public.perfis` | `supabase/perfis.sql` | `id uuid` | `user_id -> auth.users(id)` unique | `nome`, `email`, `role`, `tipo_acesso`, `status`, `created_at` | `perfis_user_id_idx`, `perfis_tipo_acesso_idx`, `perfis_status_idx` |
| `public.assinaturas` | `supabase/assinaturas.sql` | `id uuid` | `user_id -> auth.users(id)` | `plano`, `status`, `data_inicio`, `data_vencimento`, `pagamento_id`, `created_at` | `assinaturas_user_id_idx`, `assinaturas_status_idx`, `assinaturas_data_vencimento_idx`, `assinaturas_user_created_at_idx`, `assinaturas_user_status_vencimento_idx` |
| `public.admin_logs` | `supabase/admin_logs.sql` | `id uuid` | `admin_user_id -> auth.users(id)`, `target_user_id -> auth.users(id)` | `acao`, `entidade`, `entidade_id`, `dados_anteriores`, `dados_novos`, `ip`, `user_agent`, `created_at` | `admin_logs_admin_user_id_idx`, `admin_logs_target_user_id_idx`, `admin_logs_acao_idx`, `admin_logs_created_at_idx` |
| `public.aceites_legais` | `supabase/aceites_legais.sql` | `id uuid` | `user_id -> auth.users(id)` | `politica_versao`, `termos_versao`, flags de aceite, `aceito_em`, `ip`, `user_agent`, `created_at` | `aceites_legais_user_id_idx`, `aceites_legais_versoes_idx`, `aceites_legais_aceito_em_idx` |
| `public.avaliacoes` | `supabase/avaliacoes_anamneses.sql` | `id uuid` | `user_id -> auth.users(id)`, `aluno_id -> public.alunos(id)` | medidas corporais, dobras, percentuais, fotos, `status`, aderencia, `observacoes`, `created_at` | `avaliacoes_user_id_idx`, `avaliacoes_aluno_id_idx`, `avaliacoes_data_idx`, `avaliacoes_user_data_idx` |
| `public.anamneses` | `supabase/avaliacoes_anamneses.sql` | `id uuid` | `user_id -> auth.users(id)`, `aluno_id -> public.alunos(id)` | rotina, saude, experiencia, disponibilidade, escalas, habitos, preferencias, `observacoes`, `created_at` | `anamneses_user_id_idx`, `anamneses_aluno_id_idx`, `anamneses_user_created_at_idx` |
| `public.treinos` | `supabase/treinos.sql` | `id uuid` | `user_id -> auth.users(id)`, `aluno_id -> public.alunos(id)` | `nome_rotina`, `objetivo`, `nivel`, `dias_semana`, `observacoes`, `status`, datas, `created_at` | `treinos_user_id_idx`, `treinos_aluno_id_idx`, `treinos_user_created_at_idx` |
| `public.treino_dias` | `supabase/treinos.sql` | `id uuid` | `treino_id -> public.treinos(id)` | `nome`, `grupo_muscular`, `ordem`, `created_at` | `treino_dias_treino_id_idx` |
| `public.treino_exercicios` | `supabase/treinos.sql` | `id uuid` | `treino_dia_id -> public.treino_dias(id)` | `nome`, `series`, `repeticoes`, `carga`, `descanso`, `observacoes`, `video_url`, `ordem`, `created_at` | `treino_exercicios_treino_dia_id_idx` |
| `public.acompanhamento_eventos` | `20260711091000_historico_acompanhamento_alunos.sql` | `id uuid` | `user_id -> auth.users(id)`, `aluno_id -> public.alunos(id)`, `plano_id -> public.planos(id)` | `tipo`, `ocorrido_em`, motivo, plano, vencimentos, `metadata`, `event_key`, `created_at` | `acompanhamento_eventos_user_id_idx`, `acompanhamento_eventos_aluno_id_idx`, `acompanhamento_eventos_ocorrido_em_idx`, `acompanhamento_eventos_user_aluno_ocorrido_idx` |
| `public.workout_templates` | `20260714090000_workout_templates.sql` | `id uuid` | `owner_id -> auth.users(id)` | metadados do modelo, `template_data jsonb`, `is_system`, `is_active`, `created_at`, `updated_at` | `workout_templates_owner_id_idx`, `workout_templates_owner_updated_idx`, `workout_templates_owner_split_idx` |
| `public.aoe_decisions` | `20260715090000_aoe_infrastructure_pilot.sql` | `id text` | `actor_id -> auth.users(id)`, `student_id -> public.alunos(id)` | request, ator, aluno, status, modelo selecionado, scores, riscos, warnings, resposta publica, traces, timestamps | `aoe_decisions_request_idx`, `aoe_decisions_student_idx`, `aoe_decisions_actor_idx`, `aoe_decisions_org_idx`, `aoe_decisions_model_idx` |
| `public.aoe_decision_traces` | `20260715090000_aoe_infrastructure_pilot.sql` | `id text` | `decision_id -> public.aoe_decisions(id)` | `organization_id`, `trace_version`, `trace_payload`, `redaction_version`, `created_at` | `aoe_traces_decision_idx` |
| `public.aoe_human_reviews` | `20260715090000_aoe_infrastructure_pilot.sql` | `id text` | `decision_id -> public.aoe_decisions(id)`, `reviewer_id -> auth.users(id)` | status, flags, motivos, checklist, ajustes, notas, timestamps | `aoe_reviews_decision_idx`, unique `aoe_human_reviews_one_active_per_decision` |
| `public.aoe_idempotency_keys` | `20260715090000_aoe_infrastructure_pilot.sql` | `id text` | `actor_id -> auth.users(id)`, `decision_id -> public.aoe_decisions(id)` | operacao, chave, fingerprint, status, payload, erro, timestamps | unique `aoe_idempotency_unique_key`, `aoe_idempotency_expires_idx` |
| `public.aoe_audit_events` | `20260715090000_aoe_infrastructure_pilot.sql` | `id text` | Nenhuma FK declarada | tipo, ator, organizacao, recurso, request/correlation, resultado, metadados, versoes, `occurred_at` | `aoe_audit_org_event_date_idx` |

## Constraints Relevantes

- PK declarada em todas as tabelas publicas inventariadas.
- Checks: `perfis_role_check`, `perfis_tipo_acesso_check`, `perfis_status_check`, `assinaturas_status_check`, `alunos_acompanhamento_status_check`, `acompanhamento_eventos_tipo_check`, `workout_templates_*`, `aoe_human_reviews_notes_length`.
- Unique: `perfis.user_id`, `aceites_legais_versao_unica`, nome ativo de planos por usuario, `aoe_human_reviews_one_active_per_decision`, `aoe_idempotency_unique_key`.

## Views, Sequences e Triggers

- Views: nenhuma `create view` localizada nos artefatos Supabase.
- Sequences explicitas: nenhuma `create sequence` localizada. IDs UUID usam `gen_random_uuid()`; tabelas AOE usam `text`.
- Triggers: `set_workout_templates_updated_at` em `public.workout_templates`, `before update`, chama `public.set_workout_templates_updated_at()`.

## Observacoes

- Ha SQL estrutural fora de `supabase/migrations/` em `supabase/*.sql`; ver diagnostico.
- Algumas migrations complementam tabelas criadas em SQL solto, portanto a ordem real de aplicacao precisa ser confirmada no ambiente ativo.
