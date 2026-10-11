\pset tuples_only on
\pset format unaligned
\pset fieldsep '|'

select 'server_version' as category, 'version' as check_name, version() as actual;
select 'configuration', 'shared_preload_libraries', current_setting('shared_preload_libraries');
select 'configuration', 'wal_level', current_setting('wal_level');
select 'configuration', 'cron.database_name', current_setting('cron.database_name');
select 'configuration', 'pg_net.database_name', current_setting('pg_net.database_name');

select 'schemas', 'expected', string_agg(nspname, ',' order by nspname)
from pg_namespace
where nspname in (
  'auth', 'extensions', 'graphql', 'graphql_public', 'pgbouncer',
  'public', 'realtime', 'storage', 'supabase_migrations', 'vault'
);

select 'extensions', 'installed', string_agg(extname || ':' || extversion, ',' order by extname)
from pg_extension
where extname in ('pg_cron', 'pg_net', 'pg_stat_statements', 'pgcrypto', 'supabase_vault', 'uuid-ossp');

select 'objects', 'tables_without_extension_members', count(*)::text
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p')
  and n.nspname in ('auth', 'extensions', 'graphql', 'graphql_public', 'pgbouncer', 'public', 'realtime', 'storage', 'supabase_migrations', 'vault')
  and not exists (
    select 1 from pg_depend d
    where d.classid = 'pg_class'::regclass and d.objid = c.oid and d.deptype = 'e'
  );

select 'objects', 'functions_without_extension_members', count(*)::text
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname in ('auth', 'extensions', 'graphql', 'graphql_public', 'pgbouncer', 'public', 'realtime', 'storage', 'supabase_migrations', 'vault')
  and not exists (
    select 1 from pg_depend d
    where d.classid = 'pg_proc'::regclass and d.objid = p.oid and d.deptype = 'e'
  );

select 'objects', 'sequences_without_extension_members', count(*)::text
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind = 'S'
  and n.nspname in ('auth', 'extensions', 'graphql', 'graphql_public', 'pgbouncer', 'public', 'realtime', 'storage', 'supabase_migrations', 'vault')
  and not exists (
    select 1 from pg_depend d
    where d.classid = 'pg_class'::regclass and d.objid = c.oid and d.deptype = 'e'
  );

select 'objects', 'foreign_keys', count(*)::text
from pg_constraint c
join pg_namespace n on n.oid = c.connamespace
where c.contype = 'f' and n.nspname in ('auth', 'public', 'realtime', 'storage', 'supabase_migrations');

select 'objects', 'validated_foreign_keys', count(*)::text
from pg_constraint c
join pg_namespace n on n.oid = c.connamespace
where c.contype = 'f' and c.convalidated
  and n.nspname in ('auth', 'public', 'realtime', 'storage', 'supabase_migrations');

select 'objects', 'policies', count(*)::text
from pg_policy p
join pg_class c on c.oid = p.polrelid
join pg_namespace n on n.oid = c.relnamespace
where n.nspname in ('auth', 'public', 'realtime', 'storage', 'supabase_migrations');

select 'objects', 'rls_tables', count(*)::text
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where c.relkind in ('r', 'p') and c.relrowsecurity
  and n.nspname in ('auth', 'public', 'realtime', 'storage', 'supabase_migrations');

select 'integrity', 'invalid_indexes', count(*)::text
from pg_index i
join pg_class c on c.oid = i.indexrelid
join pg_namespace n on n.oid = c.relnamespace
where not i.indisvalid and n.nspname in ('auth', 'public', 'realtime', 'storage', 'supabase_migrations');

select 'integrity', 'not_valid_constraints', count(*)::text
from pg_constraint c
join pg_namespace n on n.oid = c.connamespace
where not c.convalidated and n.nspname in ('auth', 'public', 'realtime', 'storage', 'supabase_migrations');

select 'integrity', 'not_valid_constraint_names', string_agg(n.nspname || '.' || c.relname || '.' || con.conname, ',' order by n.nspname, c.relname, con.conname)
from pg_constraint con
join pg_class c on c.oid = con.conrelid
join pg_namespace n on n.oid = c.relnamespace
where not con.convalidated and n.nspname in ('auth', 'public', 'realtime', 'storage', 'supabase_migrations');

select 'integrity', 'realtime_messages_payload_exclusive_violations', count(*)::text
from realtime.messages
where payload is not null and binary_payload is not null;

select 'critical_rows', 'auth.users', count(*)::text from auth.users;
select 'critical_rows', 'public.alunos', count(*)::text from public.alunos;
select 'critical_rows', 'public.perfis', count(*)::text from public.perfis;
select 'critical_rows', 'public.treinos', count(*)::text from public.treinos;
select 'critical_rows', 'public.treino_dias', count(*)::text from public.treino_dias;
select 'critical_rows', 'public.treino_exercicios', count(*)::text from public.treino_exercicios;
select 'critical_rows', 'public.avaliacoes', count(*)::text from public.avaliacoes;
select 'critical_rows', 'public.workout_execution_sessions', count(*)::text from public.workout_execution_sessions;
select 'critical_rows', 'supabase_migrations.schema_migrations', count(*)::text from supabase_migrations.schema_migrations;
select 'migration_history', 'latest_version', max(version) from supabase_migrations.schema_migrations;

begin;
create temp table aruka_g2_row_counts (
  schema_name text not null,
  table_name text not null,
  row_count bigint not null
);

do $$
declare
  relation record;
  relation_count bigint;
begin
  for relation in
    select n.nspname, c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where c.relkind in ('r', 'p')
      and n.nspname in ('auth', 'public', 'realtime', 'storage', 'supabase_migrations')
    order by n.nspname, c.relname
  loop
    execute format('select count(*) from %I.%I', relation.nspname, relation.relname)
      into relation_count;
    insert into aruka_g2_row_counts values (relation.nspname, relation.relname, relation_count);
  end loop;
end
$$;

select 'data', 'tables_counted', count(*)::text from aruka_g2_row_counts;
select 'data', 'nonempty_tables', count(*) filter (where row_count > 0)::text from aruka_g2_row_counts;
select 'data', 'total_rows', coalesce(sum(row_count), 0)::text from aruka_g2_row_counts;

create temp table aruka_g2_fk_orphans (
  schema_name text not null,
  constraint_name text not null,
  orphan_count bigint not null
);

do $$
declare
  relation record;
  join_predicate text;
  nonnull_predicate text;
  orphan_total bigint;
begin
  for relation in
    select
      con.oid,
      con.conname,
      ns.nspname,
      format('%I.%I', ns.nspname, rel.relname) as source_table,
      format('%I.%I', fns.nspname, frel.relname) as target_table,
      array_agg(format('%I', a.attname) order by keys.ordinality) as source_columns,
      array_agg(format('%I', fa.attname) order by keys.ordinality) as target_columns
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace ns on ns.oid = rel.relnamespace
    join pg_class frel on frel.oid = con.confrelid
    join pg_namespace fns on fns.oid = frel.relnamespace
    join unnest(con.conkey, con.confkey) with ordinality keys(attnum, fattnum, ordinality) on true
    join pg_attribute a on a.attrelid = con.conrelid and a.attnum = keys.attnum
    join pg_attribute fa on fa.attrelid = con.confrelid and fa.attnum = keys.fattnum
    where con.contype = 'f'
      and ns.nspname in ('auth', 'public', 'realtime', 'storage', 'supabase_migrations')
    group by con.oid, con.conname, ns.nspname, rel.relname, fns.nspname, frel.relname
  loop
    select
      string_agg(format('source.%s = target.%s', relation.source_columns[i], relation.target_columns[i]), ' and '),
      string_agg(format('source.%s is not null', relation.source_columns[i]), ' and ')
    into join_predicate, nonnull_predicate
    from generate_subscripts(relation.source_columns, 1) indexes(i);

    execute format(
      'select count(*) from %s source where %s and not exists (select 1 from %s target where %s)',
      relation.source_table, nonnull_predicate, relation.target_table, join_predicate
    ) into orphan_total;

    insert into aruka_g2_fk_orphans values (relation.nspname, relation.conname, orphan_total);
  end loop;
end
$$;

select 'integrity', 'foreign_keys_checked', count(*)::text from aruka_g2_fk_orphans;
select 'integrity', 'foreign_key_orphans', coalesce(sum(orphan_count), 0)::text from aruka_g2_fk_orphans;
select 'integrity', 'foreign_keys_with_orphans', count(*) filter (where orphan_count > 0)::text from aruka_g2_fk_orphans;
rollback;
