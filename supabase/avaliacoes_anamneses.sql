create extension if not exists "pgcrypto";

create table if not exists public.avaliacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  data_avaliacao date not null,
  idade numeric(5, 1),
  sexo text,
  altura numeric(6, 2),
  peso numeric(6, 2),
  pescoco numeric(6, 2),
  ombro numeric(6, 2),
  torax numeric(6, 2),
  cintura numeric(6, 2),
  abdomen numeric(6, 2),
  quadril numeric(6, 2),
  braco_direito numeric(6, 2),
  braco_esquerdo numeric(6, 2),
  antebraco_direito numeric(6, 2),
  antebraco_esquerdo numeric(6, 2),
  coxa_direita numeric(6, 2),
  coxa_esquerda numeric(6, 2),
  panturrilha_direita numeric(6, 2),
  panturrilha_esquerda numeric(6, 2),
  dobra_peitoral numeric(6, 2),
  dobra_abdominal numeric(6, 2),
  dobra_coxa numeric(6, 2),
  dobra_triceps numeric(6, 2),
  dobra_subescapular numeric(6, 2),
  dobra_supra_iliaca numeric(6, 2),
  dobra_axilar_media numeric(6, 2),
  percentual_gordura numeric(6, 2),
  percentual_massa_magra numeric(6, 2),
  massa_gorda numeric(6, 2),
  massa_magra numeric(6, 2),
  imc numeric(6, 2),
  observacoes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.avaliacoes
  add column if not exists dobra_peitoral numeric(6, 2),
  add column if not exists dobra_abdominal numeric(6, 2),
  add column if not exists dobra_coxa numeric(6, 2),
  add column if not exists dobra_triceps numeric(6, 2),
  add column if not exists dobra_subescapular numeric(6, 2),
  add column if not exists dobra_supra_iliaca numeric(6, 2),
  add column if not exists dobra_axilar_media numeric(6, 2);

create table if not exists public.anamneses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  profissao text not null default '',
  rotina_trabalho text not null default '',
  objetivo_principal text not null default '',
  objetivo_secundario text not null default '',
  doenca_diagnosticada text not null default '',
  usa_medicamento text not null default '',
  dores_lesoes text not null default '',
  cirurgia text not null default '',
  restricao_medica text not null default '',
  liberado_exercicio text not null default '',
  experiencia_musculacao text not null default '',
  frequencia_semanal text not null default '',
  dias_disponiveis text not null default '',
  tempo_treino text not null default '',
  local_treino text not null default '',
  equipamentos text not null default '',
  escala_sono text not null default '',
  escala_estresse text not null default '',
  escala_energia text not null default '',
  escala_fome text not null default '',
  escala_motivacao text not null default '',
  escala_adesao_rotina text not null default '',
  sono text not null default '',
  horas_sono text not null default '',
  estresse text not null default '',
  agua text not null default '',
  alcool text not null default '',
  tabagismo text not null default '',
  dieta text not null default '',
  nutricionista text not null default '',
  refeicoes_dia text not null default '',
  dificuldade_alimentacao text not null default '',
  fome_noite text not null default '',
  compulsao text not null default '',
  exercicios_gosta text not null default '',
  exercicios_nao_gosta text not null default '',
  grupos_prioritarios text not null default '',
  limitacoes_horario text not null default '',
  observacoes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.anamneses
  add column if not exists escala_sono text not null default '',
  add column if not exists escala_estresse text not null default '',
  add column if not exists escala_energia text not null default '',
  add column if not exists escala_fome text not null default '',
  add column if not exists escala_motivacao text not null default '',
  add column if not exists escala_adesao_rotina text not null default '';

alter table public.avaliacoes enable row level security;
alter table public.anamneses enable row level security;

create policy "Usuarios podem listar suas avaliacoes"
on public.avaliacoes
for select
using (auth.uid() = user_id);

create policy "Usuarios podem cadastrar suas avaliacoes"
on public.avaliacoes
for insert
with check (auth.uid() = user_id);

create policy "Usuarios podem atualizar suas avaliacoes"
on public.avaliacoes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuarios podem excluir suas avaliacoes"
on public.avaliacoes
for delete
using (auth.uid() = user_id);

create policy "Usuarios podem listar suas anamneses"
on public.anamneses
for select
using (auth.uid() = user_id);

create policy "Usuarios podem cadastrar suas anamneses"
on public.anamneses
for insert
with check (auth.uid() = user_id);

create policy "Usuarios podem atualizar suas anamneses"
on public.anamneses
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuarios podem excluir suas anamneses"
on public.anamneses
for delete
using (auth.uid() = user_id);

create index if not exists avaliacoes_user_id_idx on public.avaliacoes(user_id);
create index if not exists avaliacoes_aluno_id_idx on public.avaliacoes(aluno_id);
create index if not exists avaliacoes_data_idx on public.avaliacoes(data_avaliacao);
create index if not exists anamneses_user_id_idx on public.anamneses(user_id);
create index if not exists anamneses_aluno_id_idx on public.anamneses(aluno_id);
