-- One explicit professional confirmation per owned student; absence means pending.
create table public.agenda_apresentacoes (
  profissional_id uuid not null references auth.users(id) on delete cascade,
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  confirmado_em timestamptz not null default now(),
  primary key (profissional_id, aluno_id)
);

alter table public.agenda_apresentacoes enable row level security;
revoke all on public.agenda_apresentacoes from public, anon, authenticated;
grant select (profissional_id, aluno_id), insert (profissional_id, aluno_id)
on public.agenda_apresentacoes to authenticated;

create policy "Professionals read own agenda introductions"
on public.agenda_apresentacoes for select to authenticated
using (
  profissional_id = (select auth.uid())
  and exists (select 1 from public.alunos a where a.id = aluno_id and a.user_id = (select auth.uid()))
);

create policy "Professionals confirm own agenda introductions"
on public.agenda_apresentacoes for insert to authenticated
with check (
  profissional_id = (select auth.uid())
  and exists (select 1 from public.alunos a where a.id = aluno_id and a.user_id = (select auth.uid()))
);
