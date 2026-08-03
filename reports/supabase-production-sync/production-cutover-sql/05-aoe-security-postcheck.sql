-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 05 AOE POSTCHECK
-- READ_ONLY_SQL=YES
select 'PASS_SKIP_STOP:aoe_expected_grants' as check_name, grantee, count(*) > 0 as has_execute from (values ('anon'),('authenticated'),('service_role')) expected(grantee) left join information_schema.routine_privileges rp on rp.routine_schema='public' and rp.routine_name='aoe_idempotency_get_or_create' and rp.grantee=expected.grantee and rp.privilege_type='EXECUTE' group by grantee order by grantee;
