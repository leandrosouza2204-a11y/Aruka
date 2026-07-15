select 'tables' as evidence_type, table_schema, table_name, table_type
from information_schema.tables
where table_schema = 'public'
  and table_name in ('aoe_decisions', 'aoe_decision_traces', 'aoe_human_reviews', 'aoe_idempotency_keys', 'aoe_audit_events')
order by table_name;

select 'columns' as evidence_type, table_name, column_name, data_type, is_nullable, column_default
from information_schema.columns
where table_schema = 'public'
  and table_name in ('aoe_decisions', 'aoe_decision_traces', 'aoe_human_reviews', 'aoe_idempotency_keys', 'aoe_audit_events')
order by table_name, ordinal_position;

select 'constraints' as evidence_type, tc.table_name, tc.constraint_name, tc.constraint_type, kcu.column_name, ccu.table_name as foreign_table_name, ccu.column_name as foreign_column_name
from information_schema.table_constraints tc
left join information_schema.key_column_usage kcu on tc.constraint_name = kcu.constraint_name and tc.table_schema = kcu.table_schema
left join information_schema.constraint_column_usage ccu on tc.constraint_name = ccu.constraint_name and tc.table_schema = ccu.table_schema
where tc.table_schema = 'public'
  and tc.table_name in ('aoe_decisions', 'aoe_decision_traces', 'aoe_human_reviews', 'aoe_idempotency_keys', 'aoe_audit_events')
order by tc.table_name, tc.constraint_name;

select 'indexes' as evidence_type, schemaname, tablename, indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('aoe_decisions', 'aoe_decision_traces', 'aoe_human_reviews', 'aoe_idempotency_keys', 'aoe_audit_events')
order by tablename, indexname;

select 'policies' as evidence_type, schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
from pg_policies
where schemaname = 'public'
  and tablename in ('aoe_decisions', 'aoe_decision_traces', 'aoe_human_reviews', 'aoe_idempotency_keys', 'aoe_audit_events')
order by tablename, policyname;

select 'rls' as evidence_type, n.nspname as schema_name, c.relname as table_name, c.relrowsecurity, c.relforcerowsecurity
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in ('aoe_decisions', 'aoe_decision_traces', 'aoe_human_reviews', 'aoe_idempotency_keys', 'aoe_audit_events')
order by c.relname;

select 'functions' as evidence_type, n.nspname as schema_name, p.proname as routine_name, l.lanname as language, p.prosecdef as security_definer, p.proconfig as function_config
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
join pg_language l on l.oid = p.prolang
where n.nspname = 'public'
  and p.proname in ('aoe_user_owns_student', 'aoe_idempotency_get_or_create')
order by p.proname;

select 'grants' as evidence_type, table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and table_name in ('aoe_decisions', 'aoe_decision_traces', 'aoe_human_reviews', 'aoe_idempotency_keys', 'aoe_audit_events')
order by table_name, grantee, privilege_type;
