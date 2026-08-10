-- Phase 3.3 Group A Utility Security Hardening evidence collection.
-- Target: public.set_workout_templates_updated_at()
-- Run manually in the production SQL Editor and export each result grid as CSV.
-- This file is read-only by design.

-- Query 1: function definition and security metadata.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  p.oid::regprocedure::text as function_signature,
  pg_get_function_result(p.oid) as result_type,
  l.lanname as language_name,
  case p.provolatile
    when 'i' then 'IMMUTABLE'
    when 's' then 'STABLE'
    when 'v' then 'VOLATILE'
  end as volatility,
  p.prosecdef as security_definer,
  p.proleakproof as leakproof,
  p.proisstrict as strict,
  p.proparallel as parallel_mode,
  p.proconfig as function_config,
  r.rolname as owner_name,
  p.proacl as function_acl,
  pg_get_functiondef(p.oid) as full_definition
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
join pg_language l on l.oid = p.prolang
join pg_roles r on r.oid = p.proowner
where n.nspname = 'public'
  and p.proname = 'set_workout_templates_updated_at'
  and pg_get_function_identity_arguments(p.oid) = ''
order by p.oid::regprocedure::text;

-- Query 2: trigger dependencies for the exact function signature.
select
  tn.nspname as table_schema,
  c.relname as table_name,
  t.tgname as trigger_name,
  case t.tgenabled
    when 'O' then 'enabled'
    when 'D' then 'disabled'
    when 'R' then 'replica'
    when 'A' then 'always'
  end as trigger_enabled,
  fnn.nspname as function_schema,
  fn.proname as function_name,
  pg_get_function_identity_arguments(fn.oid) as identity_arguments,
  fn.oid::regprocedure::text as function_signature,
  pg_get_triggerdef(t.oid, true) as trigger_definition
from pg_trigger t
join pg_class c on c.oid = t.tgrelid
join pg_namespace tn on tn.oid = c.relnamespace
join pg_proc fn on fn.oid = t.tgfoid
join pg_namespace fnn on fnn.oid = fn.pronamespace
where not t.tgisinternal
  and fnn.nspname = 'public'
  and fn.proname = 'set_workout_templates_updated_at'
  and pg_get_function_identity_arguments(fn.oid) = ''
order by tn.nspname, c.relname, t.tgname;

-- Query 3: grants for the exact function signature.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  p.oid::regprocedure::text as function_signature,
  coalesce(grantee.rolname, 'PUBLIC') as grantee,
  acl.privilege_type,
  acl.is_grantable,
  grantor.rolname as grantor
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
cross join lateral aclexplode(coalesce(p.proacl, acldefault('f', p.proowner))) acl
left join pg_roles grantee on grantee.oid = acl.grantee
left join pg_roles grantor on grantor.oid = acl.grantor
where n.nspname = 'public'
  and p.proname = 'set_workout_templates_updated_at'
  and pg_get_function_identity_arguments(p.oid) = ''
order by grantee, acl.privilege_type;

-- Query 4: optional dependency metadata for audit traceability.
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  p.oid::regprocedure::text as function_signature,
  d.classid::regclass::text as dependency_catalog,
  d.deptype as dependency_type,
  d.refclassid::regclass::text as referenced_catalog,
  d.refobjid::regclass::text as referenced_object
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
left join pg_depend d on d.objid = p.oid
where n.nspname = 'public'
  and p.proname = 'set_workout_templates_updated_at'
  and pg_get_function_identity_arguments(p.oid) = ''
order by d.classid::regclass::text, d.deptype, d.refclassid::regclass::text, d.refobjid::regclass::text;
