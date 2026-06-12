create extension if not exists "pgcrypto";

create table if not exists public.pagamentos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  aluno_id uuid not null references public.alunos(id) on delete cascade,
  plano text not null default '',
  valor numeric(10, 2) not null default 0,
  data_pagamento date not null,
  forma_pagamento text not null default '',
  parcela text not null default '1',
  total_parcelas integer not null default 1,
  tipo_movimento text not null default 'pagamento_avulso',
  vencimento_parcela date,
  vencimento_anterior date,
  vencimento_novo date,
  observacao text not null default '',
  observacoes text not null default '',
  created_at timestamptz not null default now()
);

alter table public.pagamentos
  add column if not exists plano text not null default '',
  add column if not exists valor numeric(10, 2) not null default 0,
  add column if not exists data_pagamento date,
  add column if not exists forma_pagamento text not null default '',
  add column if not exists parcela text not null default '1',
  add column if not exists total_parcelas integer not null default 1,
  add column if not exists tipo_movimento text not null default 'pagamento_avulso',
  add column if not exists vencimento_parcela date,
  add column if not exists vencimento_anterior date,
  add column if not exists vencimento_novo date,
  add column if not exists observacao text not null default '',
  add column if not exists observacoes text not null default '',
  add column if not exists created_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'pagamentos'
      and column_name = 'parcela'
      and data_type <> 'text'
  ) then
    alter table public.pagamentos
      alter column parcela type text using parcela::text;
  end if;
end $$;

update public.pagamentos
set observacao = observacoes
where coalesce(observacao, '') = ''
  and coalesce(observacoes, '') <> '';

update public.pagamentos
set tipo_movimento = case
  when total_parcelas > 1 then 'pagamento_parcela'
  when vencimento_novo is not null
    and vencimento_anterior is not null
    and vencimento_novo <> vencimento_anterior then 'renovacao_plano'
  else 'pagamento_avulso'
end
where coalesce(tipo_movimento, '') = '';

update public.pagamentos
set tipo_movimento = case
  when total_parcelas > 1 then 'pagamento_parcela'
  when vencimento_novo is not null
    and vencimento_anterior is not null
    and vencimento_novo <> vencimento_anterior then 'renovacao_plano'
  else tipo_movimento
end
where tipo_movimento = 'pagamento_avulso'
  and (
    total_parcelas > 1
    or (
      vencimento_novo is not null
      and vencimento_anterior is not null
      and vencimento_novo <> vencimento_anterior
    )
  );

alter table public.pagamentos
  alter column data_pagamento set not null,
  alter column plano set default '',
  alter column forma_pagamento set default '',
  alter column parcela set default '1',
  alter column total_parcelas set default 1,
  alter column tipo_movimento set default 'pagamento_avulso',
  alter column observacao set default '',
  alter column observacoes set default '';

alter table public.pagamentos enable row level security;

drop policy if exists "Usuarios podem listar seus pagamentos" on public.pagamentos;
drop policy if exists "Usuarios podem cadastrar seus pagamentos" on public.pagamentos;
drop policy if exists "Usuarios podem atualizar seus pagamentos" on public.pagamentos;
drop policy if exists "Usuarios podem excluir seus pagamentos" on public.pagamentos;

create policy "Usuarios podem listar seus pagamentos"
on public.pagamentos
for select
using (
  auth.uid() = user_id
  and exists (
    select 1
    from public.alunos
    where alunos.id = pagamentos.aluno_id
      and alunos.user_id = auth.uid()
  )
);

create policy "Usuarios podem cadastrar seus pagamentos"
on public.pagamentos
for insert
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.alunos
    where alunos.id = pagamentos.aluno_id
      and alunos.user_id = auth.uid()
  )
);

create policy "Usuarios podem atualizar seus pagamentos"
on public.pagamentos
for update
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.alunos
    where alunos.id = pagamentos.aluno_id
      and alunos.user_id = auth.uid()
  )
);

create policy "Usuarios podem excluir seus pagamentos"
on public.pagamentos
for delete
using (auth.uid() = user_id);

create index if not exists pagamentos_user_id_idx on public.pagamentos(user_id);
create index if not exists pagamentos_aluno_id_idx on public.pagamentos(aluno_id);
create index if not exists pagamentos_data_pagamento_idx on public.pagamentos(data_pagamento);
create index if not exists pagamentos_user_aluno_data_idx
  on public.pagamentos(user_id, aluno_id, data_pagamento desc, created_at desc);
