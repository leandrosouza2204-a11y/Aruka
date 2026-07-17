do $$
declare
  fixture_users integer;
  fixture_students integer;
begin
  select count(*) into fixture_users
  from auth.users
  where id in (
    '00000000-0000-4000-8000-000000000801',
    '00000000-0000-4000-8000-000000000802'
  );

  select count(*) into fixture_students
  from public.alunos
  where id in (
    '00000000-0000-4000-8000-000000000821',
    '00000000-0000-4000-8000-000000000822',
    '00000000-0000-4000-8000-000000000823'
  );

  if fixture_users <> 2 then
    raise exception 'cycle8 fixture auth user count mismatch: %', fixture_users;
  end if;

  if fixture_students <> 3 then
    raise exception 'cycle8 fixture student count mismatch: %', fixture_students;
  end if;
end $$;
