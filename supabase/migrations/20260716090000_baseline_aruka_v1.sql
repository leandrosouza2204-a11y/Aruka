-- Aruka Supabase Baseline Candidate
-- Version: v1.0
-- Date: 2026-07-16
-- Source cycle: Supabase Infrastructure Refactor v1.0 - Ciclo 5
-- Purpose: consolidated candidate baseline for local validation before Migration Cutover.
-- Remote application is prohibited before Ciclo 6 - Migration Cutover.
-- Sources: supabase/baseline-src/*.sql, Ciclo 3 runtime audit, Ciclo 4 drift decisions.
-- Architectural decision: this file is a candidate artifact, not an active migration.
-- Data policy: contains structural SQL only; no real data, users, secrets, project refs, or production URLs.

-- ============================================================
-- Source: supabase/baseline-src/01-extensions.sql
-- ============================================================

create extension if not exists "pgcrypto";


-- ============================================================
-- Source: supabase/baseline-src/02-tables.sql
-- ============================================================

create table if not exists public.perfis (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  nome text,
  email text,
  role text default 'user'::text not null,
  tipo_acesso text default 'pendente'::text not null,
  status text default 'ativo'::text not null,
  created_at timestamptz default now() not null
);

create table if not exists public.alunos (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  nome text not null,
  whatsapp text not null,
  nascimento date,
  inicio date not null,
  vencimento date,
  aviso7 date,
  aviso1 date,
  plano text not null,
  valor numeric(10,2) default 0 not null,
  status text default 'Ativo'::text not null,
  pagamento_recebido boolean default false not null,
  data_pagamento date,
  observacoes text default ''::text not null,
  created_at timestamptz default now() not null,
  acompanhamento_status text default 'ativo'::text not null,
  acompanhamento_encerrado_em date,
  acompanhamento_motivo text,
  acompanhamento_motivo_detalhe text default ''::text not null
);

create table if not exists public.planos (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  nome text not null,
  descricao text default ''::text not null,
  duracao_meses integer default 1 not null,
  valor numeric(10,2) default 0 not null,
  permite_parcelamento boolean default false not null,
  quantidade_parcelas integer default 1 not null,
  valor_parcela numeric(10,2) default 0 not null,
  intervalo_parcelas_meses integer default 1 not null,
  ativo boolean default true not null,
  created_at timestamptz default now() not null
);

create table if not exists public.assinaturas (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  plano text not null,
  status text default 'pendente'::text not null,
  data_inicio date,
  data_vencimento date,
  pagamento_id text,
  created_at timestamptz default now() not null
);

create table if not exists public.pagamentos (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  aluno_id uuid not null,
  plano text default ''::text not null,
  valor numeric(10,2) default 0 not null,
  data_pagamento date not null,
  forma_pagamento text default ''::text not null,
  parcela text default '1'::text not null,
  total_parcelas integer default 1 not null,
  tipo_movimento text default 'pagamento_avulso'::text not null,
  vencimento_parcela date,
  vencimento_anterior date,
  vencimento_novo date,
  observacao text default ''::text not null,
  observacoes text default ''::text not null,
  created_at timestamptz default now() not null
);

create table if not exists public.admin_logs (
  id uuid default gen_random_uuid() not null,
  admin_user_id uuid,
  target_user_id uuid,
  acao text not null,
  entidade text,
  entidade_id uuid,
  dados_anteriores jsonb,
  dados_novos jsonb,
  ip text,
  user_agent text,
  created_at timestamptz default now() not null
);

create table if not exists public.aceites_legais (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  politica_versao text not null,
  termos_versao text not null,
  politica_aceita boolean default false not null,
  termos_aceitos boolean default false not null,
  aceito_em timestamptz,
  ip text,
  user_agent text,
  created_at timestamptz default now() not null
);

create table if not exists public.avaliacoes (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  aluno_id uuid not null,
  data_avaliacao date not null,
  idade numeric(5,1),
  sexo text,
  altura numeric(6,2),
  peso numeric(6,2),
  pescoco numeric(6,2),
  ombro numeric(6,2),
  torax numeric(6,2),
  cintura numeric(6,2),
  abdomen numeric(6,2),
  quadril numeric(6,2),
  braco_direito numeric(6,2),
  braco_esquerdo numeric(6,2),
  antebraco_direito numeric(6,2),
  antebraco_esquerdo numeric(6,2),
  coxa_direita numeric(6,2),
  coxa_esquerda numeric(6,2),
  panturrilha_direita numeric(6,2),
  panturrilha_esquerda numeric(6,2),
  dobra_peitoral numeric(6,2),
  dobra_abdominal numeric(6,2),
  dobra_coxa numeric(6,2),
  dobra_triceps numeric(6,2),
  dobra_subescapular numeric(6,2),
  dobra_supra_iliaca numeric(6,2),
  dobra_axilar_media numeric(6,2),
  percentual_gordura numeric(6,2),
  percentual_massa_magra numeric(6,2),
  massa_gorda numeric(6,2),
  massa_magra numeric(6,2),
  imc numeric(6,2),
  status text default 'inicial'::text not null,
  objetivo_atual text default ''::text not null,
  aderencia_treino text default ''::text not null,
  aderencia_dieta text default ''::text not null,
  foto_frente_url text,
  foto_lateral_url text,
  foto_costas_url text,
  observacoes text default ''::text not null,
  created_at timestamptz default now() not null
);

create table if not exists public.anamneses (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  aluno_id uuid not null,
  profissao text default ''::text not null,
  rotina_trabalho text default ''::text not null,
  objetivo_principal text default ''::text not null,
  objetivo_secundario text default ''::text not null,
  doenca_diagnosticada text default ''::text not null,
  usa_medicamento text default ''::text not null,
  dores_lesoes text default ''::text not null,
  cirurgia text default ''::text not null,
  restricao_medica text default ''::text not null,
  liberado_exercicio text default ''::text not null,
  experiencia_musculacao text default ''::text not null,
  frequencia_semanal text default ''::text not null,
  dias_disponiveis text default ''::text not null,
  tempo_treino text default ''::text not null,
  local_treino text default ''::text not null,
  equipamentos text default ''::text not null,
  escala_sono text default ''::text not null,
  escala_estresse text default ''::text not null,
  escala_energia text default ''::text not null,
  escala_fome text default ''::text not null,
  escala_motivacao text default ''::text not null,
  escala_adesao_rotina text default ''::text not null,
  sono text default ''::text not null,
  horas_sono text default ''::text not null,
  estresse text default ''::text not null,
  agua text default ''::text not null,
  alcool text default ''::text not null,
  tabagismo text default ''::text not null,
  dieta text default ''::text not null,
  nutricionista text default ''::text not null,
  refeicoes_dia text default ''::text not null,
  dificuldade_alimentacao text default ''::text not null,
  fome_noite text default ''::text not null,
  compulsao text default ''::text not null,
  exercicios_gosta text default ''::text not null,
  exercicios_nao_gosta text default ''::text not null,
  grupos_prioritarios text default ''::text not null,
  limitacoes_horario text default ''::text not null,
  observacoes text default ''::text not null,
  created_at timestamptz default now() not null
);

create table if not exists public.treinos (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  aluno_id uuid not null,
  nome_rotina text not null,
  objetivo text default ''::text not null,
  nivel text default ''::text not null,
  dias_semana integer default 0 not null,
  observacoes text default ''::text not null,
  status text default 'Ativo'::text not null,
  data_inicio date,
  data_revisao date,
  created_at timestamptz default now() not null
);

create table if not exists public.treino_dias (
  id uuid default gen_random_uuid() not null,
  treino_id uuid not null,
  nome text not null,
  grupo_muscular text default ''::text not null,
  ordem integer default 1 not null,
  created_at timestamptz default now() not null
);

create table if not exists public.treino_exercicios (
  id uuid default gen_random_uuid() not null,
  treino_dia_id uuid not null,
  nome text not null,
  series text default ''::text not null,
  repeticoes text default ''::text not null,
  carga text default ''::text not null,
  descanso text default ''::text not null,
  observacoes text default ''::text not null,
  video_url text default ''::text not null,
  ordem integer default 1 not null,
  created_at timestamptz default now() not null
);

create table if not exists public.acompanhamento_eventos (
  id uuid default gen_random_uuid() not null,
  user_id uuid not null,
  aluno_id uuid not null,
  tipo text not null,
  ocorrido_em timestamptz default now() not null,
  motivo text,
  motivo_detalhe text,
  plano_id uuid,
  plano_nome text,
  vencimento_anterior date,
  vencimento_novo date,
  metadata jsonb default '{}'::jsonb not null,
  event_key text,
  created_at timestamptz default now() not null
);

create table if not exists public.workout_templates (
  id uuid default gen_random_uuid() not null,
  owner_id uuid not null,
  name text not null,
  reference_gender text default 'Unissex'::text not null,
  split_type text default 'Outro'::text not null,
  objective text default ''::text not null,
  level text default ''::text not null,
  description text default ''::text not null,
  template_data jsonb not null,
  is_system boolean default false not null,
  is_active boolean default true not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.aoe_decisions (
  id text not null,
  request_id text not null,
  actor_id uuid not null,
  student_id uuid not null,
  organization_id uuid,
  status text not null,
  selected_model_code text,
  selected_model_version text,
  selected_apl_release text,
  alternatives jsonb default '[]'::jsonb not null,
  compatibility_score numeric,
  raw_score numeric,
  confidence_score numeric,
  confidence_level text,
  risk_score numeric,
  risk_level text,
  ambiguity_level text,
  warnings jsonb default '[]'::jsonb not null,
  reason_codes jsonb default '[]'::jsonb not null,
  human_review_required boolean default false not null,
  human_review_id text,
  versions jsonb default '{}'::jsonb not null,
  public_response jsonb not null,
  trace_reference jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create table if not exists public.aoe_decision_traces (
  id text not null,
  decision_id text not null,
  organization_id uuid,
  trace_version text not null,
  trace_payload jsonb not null,
  redaction_version text default '1.0.0'::text not null,
  created_at timestamptz default now() not null
);

create table if not exists public.aoe_human_reviews (
  id text not null,
  decision_id text not null,
  organization_id uuid,
  status text not null,
  required boolean default true not null,
  blocking boolean default false not null,
  reason_codes jsonb default '[]'::jsonb not null,
  checklist jsonb default '[]'::jsonb not null,
  reviewer_id uuid,
  reviewer_role text,
  adjustments jsonb default '[]'::jsonb not null,
  notes text default ''::text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  completed_at timestamptz
);

create table if not exists public.aoe_idempotency_keys (
  id text not null,
  actor_id uuid not null,
  organization_id uuid,
  operation text not null,
  idempotency_key text not null,
  request_fingerprint text not null,
  status text not null,
  decision_id text,
  response_payload jsonb,
  error_code text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  expires_at timestamptz
);

create table if not exists public.aoe_audit_events (
  id text not null,
  event_type text not null,
  actor_id uuid,
  actor_role text,
  organization_id uuid,
  resource_type text,
  resource_id text,
  request_id text,
  correlation_id text,
  outcome text not null,
  metadata jsonb default '{}'::jsonb not null,
  versions jsonb default '{}'::jsonb not null,
  occurred_at timestamptz default now() not null
);


-- ============================================================
-- Source: supabase/baseline-src/03-constraints.sql
-- ============================================================

alter table only public.perfis add constraint perfis_pkey primary key (id);
alter table only public.perfis add constraint perfis_user_id_key unique (user_id);
alter table only public.perfis add constraint perfis_role_check check (role in ('admin', 'user'));
alter table only public.perfis add constraint perfis_tipo_acesso_check check (tipo_acesso in ('admin', 'beta', 'assinante', 'pendente', 'bloqueado'));
alter table only public.perfis add constraint perfis_status_check check (status in ('ativo', 'inativo'));
alter table only public.perfis add constraint perfis_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table only public.alunos add constraint alunos_pkey primary key (id);
alter table only public.alunos add constraint alunos_acompanhamento_status_check check (acompanhamento_status in ('ativo', 'encerrado', 'nao_renovado', 'cancelado'));
alter table only public.alunos add constraint alunos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table only public.planos add constraint planos_pkey primary key (id);
alter table only public.planos add constraint planos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table only public.assinaturas add constraint assinaturas_pkey primary key (id);
alter table only public.assinaturas add constraint assinaturas_status_check check (status in ('pendente', 'ativo', 'vencido', 'cancelado', 'teste'));
alter table only public.assinaturas add constraint assinaturas_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table only public.pagamentos add constraint pagamentos_pkey primary key (id);
alter table only public.pagamentos add constraint pagamentos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.pagamentos add constraint pagamentos_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete cascade;

alter table only public.admin_logs add constraint admin_logs_pkey primary key (id);
alter table only public.admin_logs add constraint admin_logs_admin_user_id_fkey foreign key (admin_user_id) references auth.users(id);
alter table only public.admin_logs add constraint admin_logs_target_user_id_fkey foreign key (target_user_id) references auth.users(id);

alter table only public.aceites_legais add constraint aceites_legais_pkey primary key (id);
alter table only public.aceites_legais add constraint aceites_legais_versao_unica unique (user_id, politica_versao, termos_versao);
alter table only public.aceites_legais add constraint aceites_legais_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table only public.avaliacoes add constraint avaliacoes_pkey primary key (id);
alter table only public.avaliacoes add constraint avaliacoes_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.avaliacoes add constraint avaliacoes_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete cascade;

alter table only public.anamneses add constraint anamneses_pkey primary key (id);
alter table only public.anamneses add constraint anamneses_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.anamneses add constraint anamneses_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete cascade;

alter table only public.treinos add constraint treinos_pkey primary key (id);
alter table only public.treinos add constraint treinos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.treinos add constraint treinos_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete cascade;

alter table only public.treino_dias add constraint treino_dias_pkey primary key (id);
alter table only public.treino_dias add constraint treino_dias_treino_id_fkey foreign key (treino_id) references public.treinos(id) on delete cascade;

alter table only public.treino_exercicios add constraint treino_exercicios_pkey primary key (id);
alter table only public.treino_exercicios add constraint treino_exercicios_treino_dia_id_fkey foreign key (treino_dia_id) references public.treino_dias(id) on delete cascade;

alter table only public.acompanhamento_eventos add constraint acompanhamento_eventos_pkey primary key (id);
alter table only public.acompanhamento_eventos add constraint acompanhamento_eventos_tipo_check check (tipo in ('acompanhamento_iniciado', 'acompanhamento_encerrado', 'acompanhamento_reativado', 'plano_renovado'));
alter table only public.acompanhamento_eventos add constraint acompanhamento_eventos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.acompanhamento_eventos add constraint acompanhamento_eventos_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete restrict;
alter table only public.acompanhamento_eventos add constraint acompanhamento_eventos_plano_id_fkey foreign key (plano_id) references public.planos(id) on delete set null;

alter table only public.workout_templates add constraint workout_templates_pkey primary key (id);
alter table only public.workout_templates add constraint workout_templates_owner_id_fkey foreign key (owner_id) references auth.users(id) on delete cascade;
alter table only public.workout_templates add constraint workout_templates_name_required check (length(btrim(name)) > 0);
alter table only public.workout_templates add constraint workout_templates_personal_only check (is_system = false);
alter table only public.workout_templates add constraint workout_templates_gender_check check (reference_gender in ('Masculino', 'Feminino', 'Unissex'));
alter table only public.workout_templates add constraint workout_templates_split_check check (split_type in ('ABC', 'ABCD', 'ABCDE', 'Full Body', 'Upper/Lower', 'Outro'));
alter table only public.workout_templates add constraint workout_templates_template_data_object check (jsonb_typeof(template_data) = 'object');

alter table only public.aoe_decisions add constraint aoe_decisions_pkey primary key (id);
alter table only public.aoe_decisions add constraint aoe_decisions_actor_id_fkey foreign key (actor_id) references auth.users(id) on delete restrict;
alter table only public.aoe_decisions add constraint aoe_decisions_student_id_fkey foreign key (student_id) references public.alunos(id) on delete restrict;

alter table only public.aoe_decision_traces add constraint aoe_decision_traces_pkey primary key (id);
alter table only public.aoe_decision_traces add constraint aoe_decision_traces_decision_id_fkey foreign key (decision_id) references public.aoe_decisions(id) on delete cascade;

alter table only public.aoe_human_reviews add constraint aoe_human_reviews_pkey primary key (id);
alter table only public.aoe_human_reviews add constraint aoe_human_reviews_decision_id_fkey foreign key (decision_id) references public.aoe_decisions(id) on delete cascade;
alter table only public.aoe_human_reviews add constraint aoe_human_reviews_reviewer_id_fkey foreign key (reviewer_id) references auth.users(id) on delete restrict;
alter table only public.aoe_human_reviews add constraint aoe_human_reviews_notes_length check (char_length(notes) <= 500);

alter table only public.aoe_idempotency_keys add constraint aoe_idempotency_keys_pkey primary key (id);
alter table only public.aoe_idempotency_keys add constraint aoe_idempotency_keys_actor_id_fkey foreign key (actor_id) references auth.users(id) on delete restrict;
alter table only public.aoe_idempotency_keys add constraint aoe_idempotency_keys_decision_id_fkey foreign key (decision_id) references public.aoe_decisions(id) on delete set null;

alter table only public.aoe_audit_events add constraint aoe_audit_events_pkey primary key (id);


-- ============================================================
-- Source: supabase/baseline-src/04-indexes.sql
-- ============================================================

create index if not exists perfis_user_id_idx on public.perfis using btree (user_id);
create index if not exists perfis_tipo_acesso_idx on public.perfis using btree (tipo_acesso);
create index if not exists perfis_status_idx on public.perfis using btree (status);
create index if not exists alunos_user_vencimento_idx on public.alunos using btree (user_id, vencimento);
create index if not exists alunos_user_acompanhamento_status_idx on public.alunos using btree (user_id, acompanhamento_status);
create index if not exists planos_user_id_idx on public.planos using btree (user_id);
create index if not exists planos_ativo_idx on public.planos using btree (ativo);
create index if not exists planos_user_ativo_idx on public.planos using btree (user_id, ativo);
create unique index if not exists planos_user_nome_normalizado_unique_idx on public.planos using btree (user_id, lower(regexp_replace(btrim(nome), '\s+'::text, ' '::text, 'g'::text)));
create index if not exists assinaturas_user_id_idx on public.assinaturas using btree (user_id);
create index if not exists assinaturas_status_idx on public.assinaturas using btree (status);
create index if not exists assinaturas_data_vencimento_idx on public.assinaturas using btree (data_vencimento);
create index if not exists assinaturas_user_created_at_idx on public.assinaturas using btree (user_id, created_at desc);
create index if not exists assinaturas_user_status_vencimento_idx on public.assinaturas using btree (user_id, status, data_vencimento);
create index if not exists pagamentos_user_id_idx on public.pagamentos using btree (user_id);
create index if not exists pagamentos_aluno_id_idx on public.pagamentos using btree (aluno_id);
create index if not exists pagamentos_data_pagamento_idx on public.pagamentos using btree (data_pagamento);
create index if not exists pagamentos_user_aluno_data_idx on public.pagamentos using btree (user_id, aluno_id, data_pagamento desc, created_at desc);
create index if not exists admin_logs_admin_user_id_idx on public.admin_logs using btree (admin_user_id);
create index if not exists admin_logs_target_user_id_idx on public.admin_logs using btree (target_user_id);
create index if not exists admin_logs_acao_idx on public.admin_logs using btree (acao);
create index if not exists admin_logs_created_at_idx on public.admin_logs using btree (created_at desc);
create index if not exists aceites_legais_user_id_idx on public.aceites_legais using btree (user_id);
create index if not exists aceites_legais_versoes_idx on public.aceites_legais using btree (politica_versao, termos_versao);
create index if not exists aceites_legais_aceito_em_idx on public.aceites_legais using btree (aceito_em);
create index if not exists avaliacoes_user_id_idx on public.avaliacoes using btree (user_id);
create index if not exists avaliacoes_aluno_id_idx on public.avaliacoes using btree (aluno_id);
create index if not exists avaliacoes_data_idx on public.avaliacoes using btree (data_avaliacao);
create index if not exists avaliacoes_user_data_idx on public.avaliacoes using btree (user_id, data_avaliacao desc);
create index if not exists anamneses_user_id_idx on public.anamneses using btree (user_id);
create index if not exists anamneses_aluno_id_idx on public.anamneses using btree (aluno_id);
create index if not exists anamneses_user_created_at_idx on public.anamneses using btree (user_id, created_at desc);
create index if not exists treinos_user_id_idx on public.treinos using btree (user_id);
create index if not exists treinos_aluno_id_idx on public.treinos using btree (aluno_id);
create index if not exists treinos_user_created_at_idx on public.treinos using btree (user_id, created_at desc);
create index if not exists treino_dias_treino_id_idx on public.treino_dias using btree (treino_id);
create index if not exists treino_exercicios_treino_dia_id_idx on public.treino_exercicios using btree (treino_dia_id);
create index if not exists acompanhamento_eventos_user_id_idx on public.acompanhamento_eventos using btree (user_id);
create index if not exists acompanhamento_eventos_aluno_id_idx on public.acompanhamento_eventos using btree (aluno_id);
create index if not exists acompanhamento_eventos_ocorrido_em_idx on public.acompanhamento_eventos using btree (ocorrido_em desc);
create index if not exists acompanhamento_eventos_user_aluno_ocorrido_idx on public.acompanhamento_eventos using btree (user_id, aluno_id, ocorrido_em desc);
create unique index if not exists acompanhamento_eventos_user_event_key_uidx on public.acompanhamento_eventos using btree (user_id, event_key) where event_key is not null;
create index if not exists workout_templates_owner_id_idx on public.workout_templates using btree (owner_id);
create index if not exists workout_templates_owner_updated_idx on public.workout_templates using btree (owner_id, updated_at desc);
create index if not exists workout_templates_owner_split_idx on public.workout_templates using btree (owner_id, split_type);
create unique index if not exists aoe_idempotency_unique_key on public.aoe_idempotency_keys using btree (coalesce(organization_id, '00000000-0000-0000-0000-000000000000'::uuid), actor_id, operation, idempotency_key);
create unique index if not exists aoe_human_reviews_one_active_per_decision on public.aoe_human_reviews using btree (decision_id);
create index if not exists aoe_decisions_request_idx on public.aoe_decisions using btree (request_id);
create index if not exists aoe_decisions_student_idx on public.aoe_decisions using btree (student_id);
create index if not exists aoe_decisions_actor_idx on public.aoe_decisions using btree (actor_id);
create index if not exists aoe_decisions_org_idx on public.aoe_decisions using btree (organization_id);
create index if not exists aoe_decisions_model_idx on public.aoe_decisions using btree (selected_model_code);
create index if not exists aoe_traces_decision_idx on public.aoe_decision_traces using btree (decision_id);
create index if not exists aoe_reviews_decision_idx on public.aoe_human_reviews using btree (decision_id);
create index if not exists aoe_idempotency_expires_idx on public.aoe_idempotency_keys using btree (expires_at);
create index if not exists aoe_audit_org_event_date_idx on public.aoe_audit_events using btree (organization_id, event_type, occurred_at desc);


-- ============================================================
-- Source: supabase/baseline-src/05-functions.sql
-- ============================================================

create or replace function public.admin_eh_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.perfis
    where perfis.user_id = auth.uid()
      and perfis.status = 'ativo'
      and (perfis.role = 'admin' or perfis.tipo_acesso = 'admin')
  );
$$;

create or replace function public.admin_validar_acesso()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_eh_admin() then
    raise exception 'Acesso negado: permissao de administrador necessaria.';
  end if;
end;
$$;

create or replace function public.admin_registrar_log(
  p_target_user_id uuid,
  p_acao text,
  p_entidade text default null,
  p_entidade_id uuid default null,
  p_dados_anteriores jsonb default null,
  p_dados_novos jsonb default null,
  p_user_agent text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_log_id uuid;
begin
  perform public.admin_validar_acesso();

  insert into public.admin_logs (
    admin_user_id,
    target_user_id,
    acao,
    entidade,
    entidade_id,
    dados_anteriores,
    dados_novos,
    user_agent
  )
  values (
    auth.uid(),
    p_target_user_id,
    p_acao,
    p_entidade,
    p_entidade_id,
    p_dados_anteriores,
    p_dados_novos,
    nullif(trim(coalesce(p_user_agent, '')), '')
  )
  returning id into v_log_id;

  return v_log_id;
end;
$$;

create or replace function public.admin_listar_logs(
  p_acao text default null,
  p_target_user_id uuid default null,
  p_data_inicio date default null,
  p_data_fim date default null,
  p_busca text default null
)
returns table (
  id uuid,
  admin_user_id uuid,
  admin_email text,
  admin_nome text,
  target_user_id uuid,
  target_email text,
  target_nome text,
  acao text,
  entidade text,
  entidade_id uuid,
  dados_anteriores jsonb,
  dados_novos jsonb,
  ip text,
  user_agent text,
  created_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_busca text := lower(trim(coalesce(p_busca, '')));
begin
  perform public.admin_validar_acesso();

  return query
  select
    logs.id,
    logs.admin_user_id,
    admin_users.email::text,
    admin_perfis.nome,
    logs.target_user_id,
    target_users.email::text,
    target_perfis.nome,
    logs.acao,
    logs.entidade,
    logs.entidade_id,
    logs.dados_anteriores,
    logs.dados_novos,
    logs.ip,
    logs.user_agent,
    logs.created_at
  from public.admin_logs logs
  left join auth.users admin_users on admin_users.id = logs.admin_user_id
  left join auth.users target_users on target_users.id = logs.target_user_id
  left join public.perfis admin_perfis on admin_perfis.user_id = logs.admin_user_id
  left join public.perfis target_perfis on target_perfis.user_id = logs.target_user_id
  where
    (p_acao is null or p_acao = '' or logs.acao = p_acao)
    and (p_target_user_id is null or logs.target_user_id = p_target_user_id)
    and (p_data_inicio is null or logs.created_at >= p_data_inicio::timestamptz)
    and (p_data_fim is null or logs.created_at < (p_data_fim + interval '1 day')::timestamptz)
    and (
      v_busca = ''
      or lower(coalesce(target_users.email::text, '')) like '%' || v_busca || '%'
      or lower(coalesce(target_perfis.nome, '')) like '%' || v_busca || '%'
      or lower(coalesce(admin_users.email::text, '')) like '%' || v_busca || '%'
      or lower(coalesce(admin_perfis.nome, '')) like '%' || v_busca || '%'
      or lower(coalesce(logs.acao, '')) like '%' || v_busca || '%'
    )
  order by logs.created_at desc
  limit 500;
end;
$$;

create or replace function public.admin_listar_usuarios()
returns table (
  user_id uuid,
  email text,
  created_at timestamptz,
  nome text,
  role text,
  tipo_acesso text,
  status text,
  assinatura_plano text,
  assinatura_status text,
  data_inicio date,
  data_vencimento date
)
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  perform public.admin_validar_acesso();

  return query
  with ultima_assinatura as (
    select distinct on (assinaturas.user_id)
      assinaturas.user_id,
      assinaturas.plano,
      assinaturas.status,
      assinaturas.data_inicio,
      assinaturas.data_vencimento
    from public.assinaturas
    order by assinaturas.user_id, assinaturas.created_at desc
  )
  select
    users.id,
    users.email::text,
    users.created_at,
    perfis.nome,
    coalesce(perfis.role, 'user'),
    coalesce(perfis.tipo_acesso, 'pendente'),
    coalesce(perfis.status, 'ativo'),
    ultima_assinatura.plano,
    ultima_assinatura.status,
    ultima_assinatura.data_inicio,
    ultima_assinatura.data_vencimento
  from auth.users
  left join public.perfis on perfis.user_id = users.id
  left join ultima_assinatura on ultima_assinatura.user_id = users.id
  order by users.created_at desc;
end;
$$;

create or replace function public.admin_atualizar_perfil(
  p_user_id uuid,
  p_nome text,
  p_role text,
  p_tipo_acesso text,
  p_status text,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text;
  v_antes jsonb;
  v_depois jsonb;
  v_acao text := 'alterar_perfil';
begin
  perform public.admin_validar_acesso();

  if p_role not in ('admin', 'user') then
    raise exception 'Role invalida: %', p_role;
  end if;

  if p_tipo_acesso not in ('admin', 'beta', 'assinante', 'pendente', 'bloqueado') then
    raise exception 'Tipo de acesso invalido: %', p_tipo_acesso;
  end if;

  if p_status not in ('ativo', 'inativo') then
    raise exception 'Status invalido: %', p_status;
  end if;

  select users.email::text into v_email from auth.users where users.id = p_user_id;
  if v_email is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  select to_jsonb(perfis.*) into v_antes from public.perfis where perfis.user_id = p_user_id;

  if coalesce(v_antes->>'role', 'user') <> 'admin' and p_role = 'admin' then
    v_acao := 'tornar_admin';
  elsif coalesce(v_antes->>'role', 'user') = 'admin' and p_role <> 'admin' then
    v_acao := 'remover_admin';
  elsif coalesce(v_antes->>'status', 'ativo') = 'inativo' and p_status = 'ativo' then
    v_acao := 'reativar_usuario';
  end if;

  insert into public.perfis (user_id, nome, email, role, tipo_acesso, status)
  values (p_user_id, nullif(trim(coalesce(p_nome, '')), ''), v_email, p_role, p_tipo_acesso, p_status)
  on conflict (user_id) do update
  set nome = excluded.nome,
      email = excluded.email,
      role = excluded.role,
      tipo_acesso = excluded.tipo_acesso,
      status = excluded.status;

  select to_jsonb(perfis.*) into v_depois from public.perfis where perfis.user_id = p_user_id;
  perform public.admin_registrar_log(p_user_id, v_acao, 'perfis', (v_depois->>'id')::uuid, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.admin_upsert_assinatura(
  p_user_id uuid,
  p_plano text,
  p_status text,
  p_data_inicio date,
  p_data_vencimento date,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_assinatura_id uuid;
  v_antes jsonb;
  v_depois jsonb;
  v_acao text := 'alterar_assinatura';
begin
  perform public.admin_validar_acesso();

  if p_status not in ('pendente', 'ativo', 'vencido', 'cancelado', 'teste') then
    raise exception 'Status de assinatura invalido: %', p_status;
  end if;

  if not exists (select 1 from auth.users where users.id = p_user_id) then
    raise exception 'Usuario nao encontrado.';
  end if;

  select assinaturas.id, to_jsonb(assinaturas.*)
  into v_assinatura_id, v_antes
  from public.assinaturas
  where assinaturas.user_id = p_user_id
  order by assinaturas.created_at desc
  limit 1;

  if p_status = 'cancelado' then
    v_acao := 'cancelar_assinatura';
  end if;

  if v_assinatura_id is null then
    insert into public.assinaturas (user_id, plano, status, data_inicio, data_vencimento)
    values (p_user_id, coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'), p_status, p_data_inicio, p_data_vencimento)
    returning id into v_assinatura_id;
  else
    update public.assinaturas
    set plano = coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'),
        status = p_status,
        data_inicio = p_data_inicio,
        data_vencimento = p_data_vencimento
    where assinaturas.id = v_assinatura_id;
  end if;

  select to_jsonb(assinaturas.*) into v_depois from public.assinaturas where assinaturas.id = v_assinatura_id;
  perform public.admin_registrar_log(p_user_id, v_acao, 'assinaturas', v_assinatura_id, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.admin_bloquear_usuario(p_user_id uuid, p_user_agent text default null)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text;
  v_antes jsonb;
  v_depois jsonb;
begin
  perform public.admin_validar_acesso();

  if p_user_id = auth.uid() then
    raise exception 'Nao e permitido bloquear o proprio usuario.';
  end if;

  select users.email::text into v_email from auth.users where users.id = p_user_id;
  if v_email is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  select to_jsonb(perfis.*) into v_antes from public.perfis where perfis.user_id = p_user_id;

  insert into public.perfis (user_id, email, role, tipo_acesso, status)
  values (p_user_id, v_email, 'user', 'bloqueado', 'inativo')
  on conflict (user_id) do update
  set email = excluded.email,
      tipo_acesso = 'bloqueado',
      status = 'inativo';

  select to_jsonb(perfis.*) into v_depois from public.perfis where perfis.user_id = p_user_id;
  perform public.admin_registrar_log(p_user_id, 'bloquear_usuario', 'perfis', (v_depois->>'id')::uuid, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.admin_liberar_beta(p_user_id uuid, p_user_agent text default null)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_email text;
  v_antes jsonb;
  v_depois jsonb;
begin
  perform public.admin_validar_acesso();

  select users.email::text into v_email from auth.users where users.id = p_user_id;
  if v_email is null then
    raise exception 'Usuario nao encontrado.';
  end if;

  select to_jsonb(perfis.*) into v_antes from public.perfis where perfis.user_id = p_user_id;

  insert into public.perfis (user_id, email, role, tipo_acesso, status)
  values (p_user_id, v_email, 'user', 'beta', 'ativo')
  on conflict (user_id) do update
  set email = excluded.email,
      role = case when perfis.role = 'admin' then 'admin' else 'user' end,
      tipo_acesso = 'beta',
      status = 'ativo';

  select to_jsonb(perfis.*) into v_depois from public.perfis where perfis.user_id = p_user_id;
  perform public.admin_registrar_log(p_user_id, 'liberar_usuario_beta', 'perfis', (v_depois->>'id')::uuid, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.admin_liberar_assinante(
  p_user_id uuid,
  p_plano text,
  p_data_inicio date,
  p_data_vencimento date,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_antes jsonb;
  v_depois jsonb;
begin
  perform public.admin_validar_acesso();

  select jsonb_build_object('perfil', to_jsonb(perfis.*), 'assinatura', to_jsonb(assinaturas.*))
  into v_antes
  from auth.users
  left join public.perfis on perfis.user_id = users.id
  left join lateral (
    select *
    from public.assinaturas
    where assinaturas.user_id = users.id
    order by assinaturas.created_at desc
    limit 1
  ) assinaturas on true
  where users.id = p_user_id;

  perform public.admin_atualizar_perfil(p_user_id, coalesce((select perfis.nome from public.perfis where perfis.user_id = p_user_id), ''), 'user', 'assinante', 'ativo', p_user_agent);
  perform public.admin_upsert_assinatura(p_user_id, p_plano, 'ativo', p_data_inicio, p_data_vencimento, p_user_agent);

  select jsonb_build_object('perfil', to_jsonb(perfis.*), 'assinatura', to_jsonb(assinaturas.*))
  into v_depois
  from auth.users
  left join public.perfis on perfis.user_id = users.id
  left join lateral (
    select *
    from public.assinaturas
    where assinaturas.user_id = users.id
    order by assinaturas.created_at desc
    limit 1
  ) assinaturas on true
  where users.id = p_user_id;

  perform public.admin_registrar_log(p_user_id, 'liberar_assinante', 'assinaturas', null, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.processar_encerramento_automatico_aluno(
  p_user_id uuid,
  p_aluno_id uuid,
  p_vencimento date,
  p_ocorrido_em date,
  p_event_key text,
  p_plano_id uuid default null,
  p_plano_nome text default '',
  p_dias_apos_vencimento integer default 0,
  p_status_anterior text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_aluno record;
  v_evento_id uuid;
begin
  if p_user_id is null or p_aluno_id is null or p_vencimento is null or p_ocorrido_em is null or nullif(trim(coalesce(p_event_key, '')), '') is null then
    return jsonb_build_object('ok', false, 'status', 'invalid_payload');
  end if;

  select id, user_id, vencimento, acompanhamento_status
  into v_aluno
  from public.alunos
  where id = p_aluno_id and user_id = p_user_id
  for update;

  if not found then
    return jsonb_build_object('ok', false, 'status', 'aluno_nao_encontrado');
  end if;

  if v_aluno.vencimento is distinct from p_vencimento then
    return jsonb_build_object('ok', false, 'status', 'vencimento_alterado');
  end if;

  if coalesce(v_aluno.acompanhamento_status, 'ativo') in ('nao_renovado', 'cancelado', 'encerrado') then
    return jsonb_build_object('ok', false, 'status', 'ja_encerrado_manual_ou_processado');
  end if;

  update public.alunos
  set acompanhamento_status = 'encerrado',
      acompanhamento_encerrado_em = p_ocorrido_em,
      acompanhamento_motivo = 'vencimento_sem_renovacao',
      acompanhamento_motivo_detalhe = ''
  where id = p_aluno_id and user_id = p_user_id;

  begin
    insert into public.acompanhamento_eventos (
      user_id, aluno_id, tipo, ocorrido_em, motivo, motivo_detalhe, plano_id, plano_nome,
      vencimento_anterior, vencimento_novo, metadata, event_key
    )
    values (
      p_user_id, p_aluno_id, 'acompanhamento_encerrado', p_ocorrido_em::timestamptz,
      'vencimento_sem_renovacao', null, p_plano_id, nullif(trim(coalesce(p_plano_nome, '')), ''),
      p_vencimento, null,
      jsonb_build_object('origem', 'automatico_90_dias', 'dias_apos_vencimento', greatest(coalesce(p_dias_apos_vencimento, 0), 0), 'status_anterior', coalesce(nullif(trim(p_status_anterior), ''), 'ativo')),
      p_event_key
    )
    returning id into v_evento_id;
  exception
    when unique_violation then
      return jsonb_build_object('ok', true, 'status', 'duplicado', 'duplicate', true, 'event_key', p_event_key);
  end;

  return jsonb_build_object('ok', true, 'status', 'processado', 'duplicate', false, 'evento_id', v_evento_id, 'event_key', p_event_key);
end;
$$;

create or replace function public.aoe_user_owns_student(p_student_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.alunos
    where alunos.id = p_student_id
      and alunos.user_id = auth.uid()
  );
$$;

create or replace function public.aoe_idempotency_get_or_create(
  p_id text,
  p_actor_id uuid,
  p_organization_id uuid,
  p_operation text,
  p_idempotency_key text,
  p_request_fingerprint text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.aoe_idempotency_keys%rowtype;
  v_inserted integer := 0;
begin
  if p_actor_id is distinct from auth.uid() and not public.admin_eh_admin() then
    raise exception 'Acesso negado: ator nao corresponde ao usuario autenticado.';
  end if;

  insert into public.aoe_idempotency_keys (id, actor_id, organization_id, operation, idempotency_key, request_fingerprint, status)
  values (p_id, p_actor_id, p_organization_id, p_operation, p_idempotency_key, p_request_fingerprint, 'PROCESSING')
  on conflict on constraint aoe_idempotency_keys_pkey do nothing;

  get diagnostics v_inserted = row_count;

  select * into v_row
  from public.aoe_idempotency_keys
  where id = p_id
  for update;

  return jsonb_build_object('created', v_inserted > 0, 'record', to_jsonb(v_row));
end;
$$;

create or replace function public.set_workout_templates_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- Source: supabase/baseline-src/06-triggers.sql
-- ============================================================

create or replace trigger set_workout_templates_updated_at
before update on public.workout_templates
for each row execute function public.set_workout_templates_updated_at();


-- ============================================================
-- Source: supabase/baseline-src/07-rls.sql
-- ============================================================

alter table public.perfis enable row level security;
alter table public.alunos enable row level security;
alter table public.planos enable row level security;
alter table public.assinaturas enable row level security;
alter table public.pagamentos enable row level security;
alter table public.admin_logs enable row level security;
alter table public.aceites_legais enable row level security;
alter table public.avaliacoes enable row level security;
alter table public.anamneses enable row level security;
alter table public.treinos enable row level security;
alter table public.treino_dias enable row level security;
alter table public.treino_exercicios enable row level security;
alter table public.acompanhamento_eventos enable row level security;
alter table public.workout_templates enable row level security;
alter table public.aoe_decisions enable row level security;
alter table public.aoe_decision_traces enable row level security;
alter table public.aoe_human_reviews enable row level security;
alter table public.aoe_idempotency_keys enable row level security;
alter table public.aoe_audit_events enable row level security;


-- ============================================================
-- Source: supabase/baseline-src/08-policies.sql
-- ============================================================

create policy "Usuarios podem listar seu perfil" on public.perfis for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem criar seu perfil padrao" on public.perfis for insert to authenticated with check (auth.uid() = user_id and role = 'user' and tipo_acesso = 'pendente' and status = 'ativo');

create policy "Usuarios podem listar seus alunos" on public.alunos for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar seus alunos" on public.alunos for insert to authenticated with check (auth.uid() = user_id);
create policy "Usuarios podem atualizar seus alunos" on public.alunos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Usuarios podem excluir seus alunos" on public.alunos for delete to authenticated using (auth.uid() = user_id);

create policy "Usuarios podem listar seus planos" on public.planos for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar seus planos" on public.planos for insert to authenticated with check (auth.uid() = user_id);
create policy "Usuarios podem atualizar seus planos" on public.planos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Usuarios podem excluir seus planos" on public.planos for delete to authenticated using (auth.uid() = user_id);

create policy "Usuarios podem listar suas assinaturas" on public.assinaturas for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar suas assinaturas" on public.assinaturas for insert to authenticated with check (auth.uid() = user_id and status = 'pendente');

create policy "Usuarios podem listar seus pagamentos" on public.pagamentos for select to authenticated using (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem cadastrar seus pagamentos" on public.pagamentos for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem atualizar seus pagamentos" on public.pagamentos for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem excluir seus pagamentos" on public.pagamentos for delete to authenticated using (auth.uid() = user_id);

create policy "Admins podem listar logs administrativos" on public.admin_logs for select to authenticated using (public.admin_eh_admin());
create policy "Usuarios comuns nao inserem logs administrativos" on public.admin_logs for insert to authenticated with check (false);

create policy "Usuarios podem listar seus aceites legais" on public.aceites_legais for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem registrar seus aceites legais" on public.aceites_legais for insert to authenticated with check (auth.uid() = user_id and politica_aceita = true and termos_aceitos = true);

create policy "Usuarios podem listar suas avaliacoes" on public.avaliacoes for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar suas avaliacoes" on public.avaliacoes for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = avaliacoes.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem atualizar suas avaliacoes" on public.avaliacoes for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = avaliacoes.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem excluir suas avaliacoes" on public.avaliacoes for delete to authenticated using (auth.uid() = user_id);

create policy "Usuarios podem listar suas anamneses" on public.anamneses for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar suas anamneses" on public.anamneses for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = anamneses.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem atualizar suas anamneses" on public.anamneses for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = anamneses.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem excluir suas anamneses" on public.anamneses for delete to authenticated using (auth.uid() = user_id);

create policy "Usuarios podem listar seus treinos" on public.treinos for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar seus treinos" on public.treinos for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = treinos.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem atualizar seus treinos" on public.treinos for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = treinos.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem excluir seus treinos" on public.treinos for delete to authenticated using (auth.uid() = user_id);

create policy "Usuarios podem listar dias dos seus treinos" on public.treino_dias for select to authenticated using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem cadastrar dias dos seus treinos" on public.treino_dias for insert to authenticated with check (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem atualizar dias dos seus treinos" on public.treino_dias for update to authenticated using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid())) with check (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem excluir dias dos seus treinos" on public.treino_dias for delete to authenticated using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));

create policy "Usuarios podem listar exercicios dos seus treinos" on public.treino_exercicios for select to authenticated using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem cadastrar exercicios dos seus treinos" on public.treino_exercicios for insert to authenticated with check (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem atualizar exercicios dos seus treinos" on public.treino_exercicios for update to authenticated using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid())) with check (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem excluir exercicios dos seus treinos" on public.treino_exercicios for delete to authenticated using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));

create policy "Usuarios podem listar seus eventos de acompanhamento" on public.acompanhamento_eventos for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar seus eventos de acompanhamento" on public.acompanhamento_eventos for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = acompanhamento_eventos.aluno_id and alunos.user_id = auth.uid())
  and (acompanhamento_eventos.plano_id is null or exists (select 1 from public.planos where planos.id = acompanhamento_eventos.plano_id and planos.user_id = auth.uid()))
);

create policy "Usuarios podem listar seus modelos de treino" on public.workout_templates for select to authenticated using (auth.uid() = owner_id and is_active = true and is_system = false);
create policy "Usuarios podem cadastrar seus modelos de treino" on public.workout_templates for insert to authenticated with check (auth.uid() = owner_id and is_system = false);
create policy "Usuarios podem atualizar seus modelos de treino" on public.workout_templates for update to authenticated using (auth.uid() = owner_id and is_system = false) with check (auth.uid() = owner_id and is_system = false);
create policy "Usuarios podem excluir seus modelos de treino" on public.workout_templates for delete to authenticated using (auth.uid() = owner_id and is_system = false);

create policy "Usuarios podem listar decisoes AOE dos seus alunos" on public.aoe_decisions for select to authenticated using (actor_id = auth.uid() or public.admin_eh_admin() or public.aoe_user_owns_student(student_id));
create policy "Usuarios podem criar decisoes AOE dos seus alunos" on public.aoe_decisions for insert to authenticated with check (actor_id = auth.uid() and public.aoe_user_owns_student(student_id));
create policy "Traces AOE restritos ao profissional autorizado" on public.aoe_decision_traces for select to authenticated using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and (d.actor_id = auth.uid() or public.admin_eh_admin())));
create policy "Usuarios podem consultar reviews AOE autorizadas" on public.aoe_human_reviews for select to authenticated using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and (d.actor_id = auth.uid() or public.admin_eh_admin())));
create policy "Usuarios podem criar reviews AOE autorizadas" on public.aoe_human_reviews for insert to authenticated with check (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid()));
create policy "Usuarios podem atualizar reviews AOE autorizadas" on public.aoe_human_reviews for update to authenticated using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid())) with check (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid()));
create policy "Idempotencia AOE restrita ao ator" on public.aoe_idempotency_keys for all to authenticated using (actor_id = auth.uid() or public.admin_eh_admin()) with check (actor_id = auth.uid() or public.admin_eh_admin());
create policy "Auditoria AOE somente admin leitura" on public.aoe_audit_events for select to authenticated using (public.admin_eh_admin());


-- ============================================================
-- Source: supabase/baseline-src/09-grants.sql
-- ============================================================

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on table public.perfis to authenticated;
grant select, insert, update, delete on table public.alunos to authenticated;
grant select, insert, update, delete on table public.planos to authenticated;
grant select, insert, update, delete on table public.assinaturas to authenticated;
grant select, insert, update, delete on table public.pagamentos to authenticated;
grant select, insert, update, delete on table public.admin_logs to authenticated;
grant select, insert, update, delete on table public.aceites_legais to authenticated;
grant select, insert, update, delete on table public.avaliacoes to authenticated;
grant select, insert, update, delete on table public.anamneses to authenticated;
grant select, insert, update, delete on table public.treinos to authenticated;
grant select, insert, update, delete on table public.treino_dias to authenticated;
grant select, insert, update, delete on table public.treino_exercicios to authenticated;
grant select, insert, update, delete on table public.acompanhamento_eventos to authenticated;
grant select, insert, update, delete on table public.workout_templates to authenticated;
grant select, insert, update, delete on table public.aoe_decisions to authenticated;
grant select, insert, update, delete on table public.aoe_decision_traces to authenticated;
grant select, insert, update, delete on table public.aoe_human_reviews to authenticated;
grant select, insert, update, delete on table public.aoe_idempotency_keys to authenticated;
grant select, insert, update, delete on table public.aoe_audit_events to authenticated;

grant all on all tables in schema public to service_role;

revoke all on function public.admin_eh_admin() from public;
revoke all on function public.admin_validar_acesso() from public;
revoke all on function public.admin_registrar_log(uuid, text, text, uuid, jsonb, jsonb, text) from public;
revoke all on function public.admin_listar_logs(text, uuid, date, date, text) from public;
revoke all on function public.admin_listar_usuarios() from public;
revoke all on function public.admin_atualizar_perfil(uuid, text, text, text, text, text) from public;
revoke all on function public.admin_upsert_assinatura(uuid, text, text, date, date, text) from public;
revoke all on function public.admin_bloquear_usuario(uuid, text) from public;
revoke all on function public.admin_liberar_beta(uuid, text) from public;
revoke all on function public.admin_liberar_assinante(uuid, text, date, date, text) from public;
revoke all on function public.processar_encerramento_automatico_aluno(uuid, uuid, date, date, text, uuid, text, integer, text) from public;
revoke all on function public.aoe_user_owns_student(uuid) from public;
revoke all on function public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) from public;
revoke all on function public.set_workout_templates_updated_at() from public;

grant execute on function public.admin_eh_admin() to authenticated, service_role;
grant execute on function public.admin_validar_acesso() to authenticated, service_role;
grant execute on function public.admin_registrar_log(uuid, text, text, uuid, jsonb, jsonb, text) to authenticated, service_role;
grant execute on function public.admin_listar_logs(text, uuid, date, date, text) to authenticated, service_role;
grant execute on function public.admin_listar_usuarios() to authenticated, service_role;
grant execute on function public.admin_atualizar_perfil(uuid, text, text, text, text, text) to authenticated, service_role;
grant execute on function public.admin_upsert_assinatura(uuid, text, text, date, date, text) to authenticated, service_role;
grant execute on function public.admin_bloquear_usuario(uuid, text) to authenticated, service_role;
grant execute on function public.admin_liberar_beta(uuid, text) to authenticated, service_role;
grant execute on function public.admin_liberar_assinante(uuid, text, date, date, text) to authenticated, service_role;
grant execute on function public.processar_encerramento_automatico_aluno(uuid, uuid, date, date, text, uuid, text, integer, text) to service_role;
grant execute on function public.aoe_user_owns_student(uuid) to authenticated, service_role;
grant execute on function public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) to authenticated, service_role;
grant execute on function public.set_workout_templates_updated_at() to service_role;


-- ============================================================
-- Source: supabase/baseline-src/10-storage.sql
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avaliacoes-fotos',
  'avaliacoes-fotos',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy avaliacoes_fotos_select_own_folder
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avaliacoes-fotos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy avaliacoes_fotos_insert_own_folder
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avaliacoes-fotos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy avaliacoes_fotos_update_own_folder
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avaliacoes-fotos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avaliacoes-fotos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy avaliacoes_fotos_delete_own_folder
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avaliacoes-fotos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

