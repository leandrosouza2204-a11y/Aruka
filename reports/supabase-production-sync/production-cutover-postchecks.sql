-- Production cutover postcheck. Read-only index only.
-- Run each step-specific file manually and review PASS/SKIP/STOP output.
select '01-workout-delivery-postcheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/01-workout-delivery-postcheck.sql' as path, 'Workout Delivery' as domain;
select '02-student-identity-postcheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/02-student-identity-postcheck.sql' as path, 'Student Identity' as domain;
select '03-security-reconciliation-postcheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/03-security-reconciliation-postcheck.sql' as path, 'Security' as domain;
select '04-required-fields-postcheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/04-required-fields-postcheck.sql' as path, 'Required Fields' as domain;
select '05-aoe-security-postcheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/05-aoe-security-postcheck.sql' as path, 'AOE Security' as domain;
select '06-group-a-security-postcheck' as file_name, 'reports/supabase-production-sync/production-cutover-sql/06-group-a-security-postcheck.sql' as path, 'Group A Security' as domain;
