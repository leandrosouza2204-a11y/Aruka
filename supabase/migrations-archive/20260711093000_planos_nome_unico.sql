-- Impede nomes de planos duplicados por usuario, ignorando maiusculas/minusculas
-- e espacos excedentes no inicio, fim ou duplicados internamente.
--
-- Diagnostico manual antes de aplicar:
--
-- select
--   user_id,
--   lower(regexp_replace(trim(nome), '\s+', ' ', 'g')) as nome_normalizado,
--   count(*) as quantidade,
--   array_agg(id order by created_at) as plano_ids,
--   array_agg(nome order by created_at) as nomes
-- from public.planos
-- group by user_id, nome_normalizado
-- having count(*) > 1;

do $$
begin
  if exists (
    select 1
    from (
      select
        user_id,
        lower(regexp_replace(trim(nome), '\s+', ' ', 'g')) as nome_normalizado,
        count(*) as quantidade
      from public.planos
      group by user_id, nome_normalizado
      having count(*) > 1
    ) duplicados
  ) then
    raise exception
      'Existem planos com nomes duplicados por usuario. Corrija manualmente antes de criar o indice unico. Use a consulta de diagnostico comentada nesta migration.';
  end if;
end $$;

create unique index if not exists planos_user_nome_normalizado_unique_idx
on public.planos (
  user_id,
  lower(regexp_replace(trim(nome), '\s+', ' ', 'g'))
);
