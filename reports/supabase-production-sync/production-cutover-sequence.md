# Production Cutover Sequence

Baseline remains SKIP_REFERENCE_ONLY. No baseline apply file exists.

## 01 Workout Delivery

- Precheck: `reports/supabase-production-sync/production-cutover-sql/01-workout-delivery-precheck.sql`
- Apply: `reports/supabase-production-sync/production-cutover-sql/01-workout-delivery.sql`
- Postcheck: `reports/supabase-production-sync/production-cutover-sql/01-workout-delivery-postcheck.sql`
- Recovery: `reports/supabase-production-sync/production-cutover-sql/01-workout-delivery-recovery.md`
- Risk: `MEDIUM`
- Status: `READY_FOR_REVIEW`

## 02 Student Identity

- Precheck: `reports/supabase-production-sync/production-cutover-sql/02-student-identity-precheck.sql`
- Apply: `reports/supabase-production-sync/production-cutover-sql/02-student-identity.sql`
- Postcheck: `reports/supabase-production-sync/production-cutover-sql/02-student-identity-postcheck.sql`
- Recovery: `reports/supabase-production-sync/production-cutover-sql/02-student-identity-recovery.md`
- Risk: `MEDIUM`
- Status: `READY_FOR_REVIEW`

## 03 Security

- Precheck: `reports/supabase-production-sync/production-cutover-sql/03-security-reconciliation-precheck.sql`
- Apply: `reports/supabase-production-sync/production-cutover-sql/03-security-reconciliation.sql`
- Postcheck: `reports/supabase-production-sync/production-cutover-sql/03-security-reconciliation-postcheck.sql`
- Recovery: `reports/supabase-production-sync/production-cutover-sql/03-security-reconciliation-recovery.md`
- Risk: `HIGH`
- Status: `READY_FOR_REVIEW`

## 04 Required Fields

- Precheck: `reports/supabase-production-sync/production-cutover-sql/04-required-fields-precheck.sql`
- Apply: `reports/supabase-production-sync/production-cutover-sql/04-required-fields.sql`
- Postcheck: `reports/supabase-production-sync/production-cutover-sql/04-required-fields-postcheck.sql`
- Recovery: `reports/supabase-production-sync/production-cutover-sql/04-required-fields-recovery.md`
- Risk: `MEDIUM`
- Status: `READY_FOR_REVIEW`

## 05 AOE Security

- Precheck: `reports/supabase-production-sync/production-cutover-sql/05-aoe-security-precheck.sql`
- Apply: `reports/supabase-production-sync/production-cutover-sql/05-aoe-security.sql`
- Postcheck: `reports/supabase-production-sync/production-cutover-sql/05-aoe-security-postcheck.sql`
- Recovery: `reports/supabase-production-sync/production-cutover-sql/05-aoe-security-recovery.md`
- Risk: `LOW`
- Status: `READY_FOR_REVIEW`

## 06 Group A Security

- Precheck: `reports/supabase-production-sync/production-cutover-sql/06-group-a-security-precheck.sql`
- Apply: `reports/supabase-production-sync/production-cutover-sql/06-group-a-security.sql`
- Postcheck: `reports/supabase-production-sync/production-cutover-sql/06-group-a-security-postcheck.sql`
- Recovery: `reports/supabase-production-sync/production-cutover-sql/06-group-a-security-recovery.md`
- Risk: `LOW`
- Status: `READY_FOR_REVIEW`
