create extension if not exists "pgcrypto";

create table if not exists public.workout_templates (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  reference_gender text not null default 'Unissex',
  split_type text not null default 'Outro',
  objective text not null default '',
  level text not null default '',
  description text not null default '',
  template_data jsonb not null,
  is_system boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workout_templates_name_required check (length(btrim(name)) > 0),
  constraint workout_templates_personal_only check (is_system = false),
  constraint workout_templates_gender_check check (
    reference_gender in ('Masculino', 'Feminino', 'Unissex')
  ),
  constraint workout_templates_split_check check (
    split_type in ('ABC', 'ABCD', 'ABCDE', 'Full Body', 'Upper/Lower', 'Outro')
  ),
  constraint workout_templates_template_data_object check (
    jsonb_typeof(template_data) = 'object'
  )
);

create index if not exists workout_templates_owner_id_idx
  on public.workout_templates(owner_id);

create index if not exists workout_templates_owner_updated_idx
  on public.workout_templates(owner_id, updated_at desc);

create index if not exists workout_templates_owner_split_idx
  on public.workout_templates(owner_id, split_type);

alter table public.workout_templates enable row level security;

create or replace function public.set_workout_templates_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_workout_templates_updated_at on public.workout_templates;
create trigger set_workout_templates_updated_at
before update on public.workout_templates
for each row execute function public.set_workout_templates_updated_at();

drop policy if exists "Usuarios podem listar seus modelos de treino" on public.workout_templates;
create policy "Usuarios podem listar seus modelos de treino"
on public.workout_templates
for select
using (
  auth.uid() = owner_id
  and is_active = true
  and is_system = false
);

drop policy if exists "Usuarios podem cadastrar seus modelos de treino" on public.workout_templates;
create policy "Usuarios podem cadastrar seus modelos de treino"
on public.workout_templates
for insert
with check (
  auth.uid() = owner_id
  and is_system = false
);

drop policy if exists "Usuarios podem atualizar seus modelos de treino" on public.workout_templates;
create policy "Usuarios podem atualizar seus modelos de treino"
on public.workout_templates
for update
using (
  auth.uid() = owner_id
  and is_system = false
)
with check (
  auth.uid() = owner_id
  and is_system = false
);

drop policy if exists "Usuarios podem excluir seus modelos de treino" on public.workout_templates;
create policy "Usuarios podem excluir seus modelos de treino"
on public.workout_templates
for delete
using (
  auth.uid() = owner_id
  and is_system = false
);
