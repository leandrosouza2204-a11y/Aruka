begin;

alter table public.alunos
  alter column created_at set not null,
  alter column user_id set not null,
  alter column whatsapp set not null;

commit;
