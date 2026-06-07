create extension if not exists "pgcrypto";

create table if not exists public.treinos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  nome_rotina text not null,
  objetivo text not null default '',
  nivel text not null default '',
  dias_semana integer not null default 0,
  observacoes text not null default '',
  status text not null default 'Ativo',
  data_inicio date,
  data_revisao date,
  created_at timestamptz not null default now()
);

create table if not exists public.treino_dias (
  id uuid primary key default gen_random_uuid(),
  treino_id uuid not null references public.treinos(id) on delete cascade,
  nome text not null,
  grupo_muscular text not null default '',
  ordem integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.treino_exercicios (
  id uuid primary key default gen_random_uuid(),
  treino_dia_id uuid not null references public.treino_dias(id) on delete cascade,
  nome text not null,
  series text not null default '',
  repeticoes text not null default '',
  carga text not null default '',
  descanso text not null default '',
  observacoes text not null default '',
  video_url text not null default '',
  ordem integer not null default 1,
  created_at timestamptz not null default now()
);

alter table public.treinos enable row level security;
alter table public.treino_dias enable row level security;
alter table public.treino_exercicios enable row level security;

create policy "Usuarios podem listar seus treinos"
on public.treinos
for select
using (auth.uid() = user_id);

create policy "Usuarios podem cadastrar seus treinos"
on public.treinos
for insert
with check (auth.uid() = user_id);

create policy "Usuarios podem atualizar seus treinos"
on public.treinos
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuarios podem excluir seus treinos"
on public.treinos
for delete
using (auth.uid() = user_id);

create policy "Usuarios podem listar dias dos seus treinos"
on public.treino_dias
for select
using (
  exists (
    select 1
    from public.treinos
    where treinos.id = treino_dias.treino_id
      and treinos.user_id = auth.uid()
  )
);

create policy "Usuarios podem cadastrar dias dos seus treinos"
on public.treino_dias
for insert
with check (
  exists (
    select 1
    from public.treinos
    where treinos.id = treino_dias.treino_id
      and treinos.user_id = auth.uid()
  )
);

create policy "Usuarios podem atualizar dias dos seus treinos"
on public.treino_dias
for update
using (
  exists (
    select 1
    from public.treinos
    where treinos.id = treino_dias.treino_id
      and treinos.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.treinos
    where treinos.id = treino_dias.treino_id
      and treinos.user_id = auth.uid()
  )
);

create policy "Usuarios podem excluir dias dos seus treinos"
on public.treino_dias
for delete
using (
  exists (
    select 1
    from public.treinos
    where treinos.id = treino_dias.treino_id
      and treinos.user_id = auth.uid()
  )
);

create policy "Usuarios podem listar exercicios dos seus treinos"
on public.treino_exercicios
for select
using (
  exists (
    select 1
    from public.treino_dias
    join public.treinos on treinos.id = treino_dias.treino_id
    where treino_dias.id = treino_exercicios.treino_dia_id
      and treinos.user_id = auth.uid()
  )
);

create policy "Usuarios podem cadastrar exercicios dos seus treinos"
on public.treino_exercicios
for insert
with check (
  exists (
    select 1
    from public.treino_dias
    join public.treinos on treinos.id = treino_dias.treino_id
    where treino_dias.id = treino_exercicios.treino_dia_id
      and treinos.user_id = auth.uid()
  )
);

create policy "Usuarios podem atualizar exercicios dos seus treinos"
on public.treino_exercicios
for update
using (
  exists (
    select 1
    from public.treino_dias
    join public.treinos on treinos.id = treino_dias.treino_id
    where treino_dias.id = treino_exercicios.treino_dia_id
      and treinos.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.treino_dias
    join public.treinos on treinos.id = treino_dias.treino_id
    where treino_dias.id = treino_exercicios.treino_dia_id
      and treinos.user_id = auth.uid()
  )
);

create policy "Usuarios podem excluir exercicios dos seus treinos"
on public.treino_exercicios
for delete
using (
  exists (
    select 1
    from public.treino_dias
    join public.treinos on treinos.id = treino_dias.treino_id
    where treino_dias.id = treino_exercicios.treino_dia_id
      and treinos.user_id = auth.uid()
  )
);

create index if not exists treinos_user_id_idx on public.treinos(user_id);
create index if not exists treinos_aluno_id_idx on public.treinos(aluno_id);
create index if not exists treino_dias_treino_id_idx on public.treino_dias(treino_id);
create index if not exists treino_exercicios_treino_dia_id_idx on public.treino_exercicios(treino_dia_id);
