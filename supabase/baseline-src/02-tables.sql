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
