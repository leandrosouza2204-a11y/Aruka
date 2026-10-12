\pset tuples_only on
\pset format unaligned
\pset fieldsep '|'

begin;

do $$
declare
  v_count bigint;
  v_relation record;
  v_join text;
  v_nonnull text;
  v_orphans bigint;
begin
  select count(*) into v_count from supabase_migrations.schema_migrations;
  if v_count <> 41 then raise exception 'expected 41 migration history rows, got %', v_count; end if;

  select count(*) into v_count from pg_index i
  join pg_class c on c.oid=i.indexrelid join pg_namespace n on n.oid=c.relnamespace
  where not i.indisvalid and n.nspname in ('auth','public','realtime','storage','supabase_migrations');
  if v_count <> 0 then raise exception 'invalid indexes: %', v_count; end if;

  for v_relation in
    select con.oid, con.conname,
      format('%I.%I', ns.nspname, rel.relname) source_table,
      format('%I.%I', fns.nspname, frel.relname) target_table,
      array_agg(format('%I', a.attname) order by keys.ordinality) source_columns,
      array_agg(format('%I', fa.attname) order by keys.ordinality) target_columns
    from pg_constraint con
    join pg_class rel on rel.oid=con.conrelid join pg_namespace ns on ns.oid=rel.relnamespace
    join pg_class frel on frel.oid=con.confrelid join pg_namespace fns on fns.oid=frel.relnamespace
    join unnest(con.conkey,con.confkey) with ordinality keys(attnum,fattnum,ordinality) on true
    join pg_attribute a on a.attrelid=con.conrelid and a.attnum=keys.attnum
    join pg_attribute fa on fa.attrelid=con.confrelid and fa.attnum=keys.fattnum
    where con.contype='f' and ns.nspname in ('auth','public','realtime','storage','supabase_migrations')
    group by con.oid,con.conname,ns.nspname,rel.relname,fns.nspname,frel.relname
  loop
    select string_agg(format('s.%s=t.%s',v_relation.source_columns[i],v_relation.target_columns[i]),' and '),
           string_agg(format('s.%s is not null',v_relation.source_columns[i]),' and ')
      into v_join,v_nonnull from generate_subscripts(v_relation.source_columns,1) x(i);
    execute format('select count(*) from %s s where %s and not exists(select 1 from %s t where %s)',
      v_relation.source_table,v_nonnull,v_relation.target_table,v_join) into v_orphans;
    if v_orphans <> 0 then raise exception 'orphan rows for %: %',v_relation.conname,v_orphans; end if;
  end loop;

  if exists(select 1 from pg_constraint c join pg_namespace n on n.oid=c.connamespace
    where not c.convalidated and n.nspname in ('auth','public','storage','supabase_migrations')) then
    raise exception 'unexpected unvalidated application constraint';
  end if;
  if (select count(*) from realtime.messages where payload is not null and binary_payload is not null) <> 0 then
    raise exception 'realtime payload constraint has violating rows';
  end if;
end $$;

select 'integrity','history_41','PASS';
select 'integrity','foreign_key_orphans_0','PASS';
select 'integrity','invalid_indexes_0','PASS';
select 'integrity','constraints','PASS';
select 'integrity','critical_row_counts_preserved','PASS'
where (select count(*) from auth.users)=8
  and (select count(*) from public.alunos)=30
  and (select count(*) from public.treinos)=8
  and (select count(*) from public.workout_execution_sessions)=3;
select 'integrity','rollout_off','PASS'
where (select not global_enabled and not emergency_blocked from private.student_experience_rollout_config where singleton)
  and (select count(*) from private.student_experience_rollout_targets)=0;

rollback;
