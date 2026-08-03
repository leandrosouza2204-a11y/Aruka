-- Production cutover precheck. Read-only index only.
-- Run each step-specific file manually and review PASS/SKIP/STOP output.
select '01-workout-delivery-precheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/01-workout-delivery-precheck.sql' as path, 'Workout Delivery' as domain;
select '02-student-identity-precheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/02-student-identity-precheck.sql' as path, 'Student Identity' as domain;
select '03-security-reconciliation-precheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/03-security-reconciliation-precheck.sql' as path, 'Security' as domain;
select '04-required-fields-precheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/04-required-fields-precheck.sql' as path, 'Required Fields' as domain;
select '05-aoe-security-precheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/05-aoe-security-precheck.sql' as path, 'AOE Security' as domain;
select '06-group-a-security-precheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/06-group-a-security-precheck.sql' as path, 'Group A Security' as domain;
