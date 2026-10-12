\set ON_ERROR_STOP on

begin;

create temporary table aruka_g3_canonical_required (
  signature text primary key
) on commit drop;

insert into aruka_g3_canonical_required (signature)
values
  ('admin_atualizar_perfil(uuid,text,text,text,text,text)'),
  ('admin_bloquear_usuario(uuid,text)'),
  ('admin_eh_admin()'),
  ('admin_liberar_assinante(uuid,text,date,date,text)'),
  ('admin_liberar_beta(uuid,text)'),
  ('admin_listar_logs(text,uuid,date,date,text)'),
  ('admin_registrar_log(uuid,text,text,uuid,jsonb,jsonb,text)'),
  ('admin_upsert_assinatura(uuid,text,text,date,date,text)'),
  ('admin_validar_acesso()'),
  ('alterar_estado_treino(uuid,text)'),
  ('aoe_idempotency_get_or_create(text,uuid,uuid,text,text,text)'),
  ('claim_pending_student_invite()'),
  ('entregar_treino(uuid)'),
  ('get_my_student_exercise_media(uuid)'),
  ('get_my_student_workouts()'),
  ('processar_encerramento_automatico_aluno(uuid,uuid,date,date,text,uuid,text,integer,text)'),
  ('salvar_treino_composto(jsonb)');

do $validation$
begin
  if (select count(*) from aruka_g3_canonical_required) <> 17 then
    raise exception 'G3_CANONICAL_REQUIRED_COUNT_MISMATCH';
  end if;

  if exists (
    select 1
    from aruka_g3_canonical_required
    where to_regprocedure('public.' || signature) is null
  ) then
    raise exception 'G3_CANONICAL_REQUIRED_FUNCTION_MISSING';
  end if;

  if exists (
    select 1
    from aruka_g3_canonical_required r
    join pg_catalog.pg_proc p
      on p.oid = to_regprocedure('public.' || r.signature)
    where not p.prosecdef
       or coalesce(array_to_string(p.proconfig, ','), '') <> 'search_path=""'
  ) then
    raise exception 'G3_CANONICAL_FUNCTION_HARDENING_MISMATCH';
  end if;

  if exists (
    select 1
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.prosecdef
      and has_function_privilege('anon', p.oid, 'execute')
  ) then
    raise exception 'G3_CANONICAL_ANON_DEFINER_EXECUTE_REMAINS';
  end if;

  if not exists (
    select 1
    from supabase_migrations.schema_migrations
    where version = '20261011232512'
  ) then
    raise exception 'G3_CANONICAL_MIGRATION_HISTORY_MISSING';
  end if;
end
$validation$;

select 'canonical_security|required_signatures_17|PASS';
select 'canonical_security|required_security_definer|PASS';
select 'canonical_security|required_search_path_empty|PASS';
select 'canonical_security|anon_privileged_execution_zero|PASS';
select 'canonical_security|migration_history_20261011232512|PASS';

rollback;
