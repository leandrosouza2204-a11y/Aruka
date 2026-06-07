create extension if not exists "pgcrypto";

create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  data_pagamento date not null,
  valor numeric(10, 2) not null default 0,
  forma_pagamento text not null default '',
  parcela integer not null default 1,
  total_parcelas integer not null default 1,
  observacoes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.pagamentos enable row level security;

create policy "Usuarios podem listar seus pagamentos"
on public.pagamentos
for select
using (auth.uid() = user_id);

create policy "Usuarios podem cadastrar seus pagamentos"
on public.pagamentos
for insert
with check (auth.uid() = user_id);

create policy "Usuarios podem atualizar seus pagamentos"
on public.pagamentos
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Usuarios podem excluir seus pagamentos"
on public.pagamentos
for delete
using (auth.uid() = user_id);

create index if not exists pagamentos_user_id_idx on public.pagamentos(user_id);
create index if not exists pagamentos_aluno_id_idx on public.pagamentos(aluno_id);
create index if not exists pagamentos_data_pagamento_idx on public.pagamentos(data_pagamento);
