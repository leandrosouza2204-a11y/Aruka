-- Campos opcionais para separar o acompanhamento do status financeiro.
alter table public.alunos
  add column if not exists acompanhamento_status text not null default 'ativo',
  add column if not exists acompanhamento_encerrado_em date,
  add column if not exists acompanhamento_motivo text not null default '';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'alunos_acompanhamento_status_check'
  ) then
    alter table public.alunos
      add constraint alunos_acompanhamento_status_check
      check (acompanhamento_status in ('ativo', 'nao_renovado', 'cancelado', 'encerrado'));
  end if;
end $$;

create index if not exists alunos_user_acompanhamento_status_idx
on public.alunos(user_id, acompanhamento_status);
