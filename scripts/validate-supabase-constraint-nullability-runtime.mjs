import { runPsql } from "./supabase-cycle-8-lib.mjs";

const root = process.cwd();

const sql = String.raw`
begin;

do $$
declare
  required_missing text[];
  preserved_mismatch text[];
begin
  select array_agg(column_name order by column_name)
  into required_missing
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'alunos'
    and column_name in ('created_at', 'user_id', 'whatsapp')
    and is_nullable <> 'NO';

  if required_missing is not null then
    raise exception 'required columns still nullable: %', required_missing;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'alunos'
      and column_name = 'created_at'
      and column_default = 'now()'
  ) then
    raise exception 'created_at default was not preserved as now()';
  end if;

  if exists (
    select 1
    from public.alunos
    where created_at is null or user_id is null or whatsapp is null
  ) then
    raise exception 'local null data found in required columns';
  end if;

  with expected(column_name, is_nullable) as (
    values
      ('acompanhamento_motivo', 'YES'),
      ('observacoes', 'NO'),
      ('inicio', 'NO'),
      ('pagamento_recebido', 'NO'),
      ('plano', 'NO'),
      ('status', 'NO'),
      ('valor', 'NO')
  )
  select array_agg(format('%s expected %s got %s', e.column_name, e.is_nullable, c.is_nullable) order by e.column_name)
  into preserved_mismatch
  from expected e
  join information_schema.columns c
    on c.table_schema = 'public'
   and c.table_name = 'alunos'
   and c.column_name = e.column_name
  where c.is_nullable <> e.is_nullable;

  if preserved_mismatch is not null then
    raise exception 'preserved local baseline nullability mismatch: %', preserved_mismatch;
  end if;

end $$;

insert into auth.users (id, aud, role, email, email_confirmed_at, created_at, updated_at)
values ('30000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'phase2-prof@example.invalid', now(), now(), now());

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status)
values ('30000000-0000-4000-8000-000000000101', '30000000-0000-4000-8000-000000000001', 'Phase2 Prof', 'phase2-prof@example.invalid', 'user', 'assinante', 'ativo');

insert into public.alunos (id, user_id, nome, whatsapp, inicio, plano, valor, status)
values ('30000000-0000-4000-8000-000000000201', '30000000-0000-4000-8000-000000000001', 'Phase2 Aluno', '+5511999990000', current_date, 'Mensal', 0, 'Ativo');

do $$
declare
  inserted_created_at timestamptz;
begin
  select created_at into inserted_created_at
  from public.alunos
  where id = '30000000-0000-4000-8000-000000000201';

  if inserted_created_at is null then
    raise exception 'created_at default did not populate';
  end if;
end $$;

do $$
begin
  begin
    insert into public.alunos (id, user_id, nome, whatsapp)
    values ('30000000-0000-4000-8000-000000000202', '30000000-0000-4000-8000-000000000001', 'Created Null', '+5511999990001');
    update public.alunos set created_at = null where id = '30000000-0000-4000-8000-000000000202';
    raise exception 'created_at null unexpectedly accepted';
  exception when not_null_violation then
    null;
  end;

  begin
    insert into public.alunos (id, user_id, nome, whatsapp)
    values ('30000000-0000-4000-8000-000000000203', null, 'Owner Null', '+5511999990002');
    raise exception 'user_id null unexpectedly accepted';
  exception when not_null_violation then
    null;
  end;

  begin
    insert into public.alunos (id, user_id, nome, whatsapp)
    values ('30000000-0000-4000-8000-000000000204', '30000000-0000-4000-8000-000000000001', 'Whats Null', null);
    raise exception 'whatsapp null unexpectedly accepted';
  exception when not_null_violation then
    null;
  end;
end $$;

update public.alunos
set nome = 'Phase2 Aluno Editado',
    whatsapp = '+5511999991111'
where id = '30000000-0000-4000-8000-000000000201'
  and user_id = '30000000-0000-4000-8000-000000000001';

do $$
begin
  if not exists (
    select 1
    from public.alunos
    where id = '30000000-0000-4000-8000-000000000201'
      and user_id = '30000000-0000-4000-8000-000000000001'
      and whatsapp = '+5511999991111'
  ) then
    raise exception 'valid edit or ownership check failed';
  end if;

  if not exists (
    select 1
    from information_schema.table_privileges
    where table_schema = 'public'
      and table_name = 'alunos'
      and grantee = 'authenticated'
      and privilege_type = 'INSERT'
  ) then
    raise exception 'phase 1 authenticated grant regression detected';
  end if;
end $$;

rollback;
`;

runPsql(root, sql, { timeoutMs: 120000 });
console.log("SUPABASE_CONSTRAINT_NULLABILITY_RUNTIME_VALIDATED");
