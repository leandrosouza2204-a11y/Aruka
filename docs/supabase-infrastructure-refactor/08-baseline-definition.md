# Definicao da Baseline

## Objetivo

A futura baseline deve representar um ambiente Aruka novo, reproduzivel e funcional a partir de um unico ponto inicial de schema, sem depender dos SQL soltos em `supabase/*.sql`.

Esta definicao e arquitetural. Nenhum SQL deve ser alterado neste ciclo.

## Escopo da Baseline Inicial

### Extensions

- `pgcrypto`, para `gen_random_uuid()`.

### Tabelas

Devem compor a baseline:

- `public.perfis`
- `public.alunos`
- `public.planos`
- `public.assinaturas`
- `public.pagamentos`
- `public.admin_logs`
- `public.aceites_legais`
- `public.avaliacoes`
- `public.anamneses`
- `public.treinos`
- `public.treino_dias`
- `public.treino_exercicios`
- `public.acompanhamento_eventos`
- `public.workout_templates`
- `public.aoe_decisions`
- `public.aoe_decision_traces`
- `public.aoe_human_reviews`
- `public.aoe_idempotency_keys`
- `public.aoe_audit_events`

### Indices

A baseline deve incluir todos os indices necessarios ao estado atual:

- Indices por proprietario: `*_user_id_idx`, `workout_templates_owner_id_idx`, `aoe_decisions_actor_idx`.
- Indices operacionais: vencimentos, status, datas, aluno, treino, review, idempotencia e auditoria.
- Uniques funcionais: `aoe_idempotency_unique_key`, `aoe_human_reviews_one_active_per_decision`, unicidade de plano ativo por usuario/nome e aceite legal por versao.

### Constraints e Foreign Keys

Devem entrar na baseline:

- PKs de todas as tabelas.
- FKs para `auth.users(id)`.
- FKs internas: alunos, planos, pagamentos, avaliacoes, anamneses, treinos, acompanhamento e AOE.
- Checks de enumeracao: perfis, assinaturas, acompanhamento, templates e notas AOE.
- Defaults e `not null` ja existentes no estado inventariado.

### Funcoes

Devem compor a baseline:

- `public.admin_eh_admin`
- `public.admin_validar_acesso`
- `public.admin_listar_usuarios`
- `public.admin_atualizar_perfil`
- `public.admin_upsert_assinatura`
- `public.admin_bloquear_usuario`
- `public.admin_liberar_beta`
- `public.admin_liberar_assinante`
- `public.admin_registrar_log`
- `public.admin_listar_logs`
- `public.processar_encerramento_automatico_aluno`
- `public.set_workout_templates_updated_at`
- `public.aoe_user_owns_student`
- `public.aoe_idempotency_get_or_create`

### Triggers

- `set_workout_templates_updated_at` em `public.workout_templates`.

### Views

- Nenhuma view versionada foi identificada no Ciclo 1.
- A baseline deve manter uma secao reservada para views, mas sem criar views ate confirmacao runtime.

### Types

- Nenhum enum/type customizado foi identificado.
- A estrategia preferida para baseline v1 e manter os checks existentes, sem introduzir types novos.

### RLS e Policies

A baseline deve habilitar RLS em todas as tabelas publicas inventariadas e declarar todas as policies atuais:

- Ownership direto por `auth.uid() = user_id`.
- Ownership por relacionamento para `pagamentos`, `treino_dias`, `treino_exercicios` e AOE.
- Fluxos admin via `public.admin_eh_admin()`.
- Bloqueio de insert direto em `admin_logs`.

### Storage

Devem compor a baseline:

- Bucket privado `avaliacoes-fotos`.
- Limite de 8 MB.
- MIME types: JPEG, PNG e WebP.
- Policies de `storage.objects` para select, insert, update e delete por pasta do usuario autenticado.

## Fora da Baseline

- Dados ficticios ou dados reais: devem ir para `seed.sql` ou fixtures.
- Secrets e variaveis de ambiente.
- Deploy de Edge Functions.
- Arquivos gerados do catalogo AOE.
- Artefatos `.temp` do Supabase CLI.

## Criterio de Prontidao

A baseline estara pronta quando um projeto Supabase vazio puder ser criado com:

1. Schema completo.
2. RLS funcional.
3. Storage configurado.
4. RPCs e grants aplicados.
5. Seeds opcionais executaveis sem depender de dados reais.
