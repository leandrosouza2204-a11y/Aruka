import { runPsql } from "./supabase-cycle-8-lib.mjs";

const sql = String.raw`
begin;

create extension if not exists pgtap with schema extensions;

select plan(25);

insert into auth.users (id, email)
values
  ('00000000-0000-4000-8000-000000011101', 'cycle-11-professional-a@example.invalid'),
  ('00000000-0000-4000-8000-000000011102', 'cycle-11-professional-b@example.invalid'),
  ('00000000-0000-4000-8000-000000011103', 'cycle-11-student@example.invalid')
on conflict (id) do nothing;

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status)
values
  ('00000000-0000-4000-8000-000000011101', '00000000-0000-4000-8000-000000011101', 'Cycle 11 Professional A', 'cycle-11-professional-a@example.invalid', 'user', 'assinante', 'ativo'),
  ('00000000-0000-4000-8000-000000011102', '00000000-0000-4000-8000-000000011102', 'Cycle 11 Professional B', 'cycle-11-professional-b@example.invalid', 'user', 'assinante', 'ativo'),
  ('00000000-0000-4000-8000-000000011103', '00000000-0000-4000-8000-000000011103', 'Cycle 11 Student', 'cycle-11-student@example.invalid', 'student', 'pendente', 'ativo')
on conflict (user_id) do nothing;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000011101', true);

insert into public.smart_management_locations (id, professional_id, name, description)
values
  ('00000000-0000-4000-8000-000000011201', '00000000-0000-4000-8000-000000011101', 'Academia A', 'Tiered fixture'),
  ('00000000-0000-4000-8000-000000011202', '00000000-0000-4000-8000-000000011101', 'Academia B', 'Fixed fixture'),
  ('00000000-0000-4000-8000-000000011203', '00000000-0000-4000-8000-000000011101', 'Academia C', 'No transfer fixture');

select is((select count(*)::int from public.smart_management_locations where professional_id = '00000000-0000-4000-8000-000000011101'), 3, 'professional A creates and reads own locations');

insert into public.smart_management_transfer_rules (id, location_id, professional_id, rule_type)
values ('00000000-0000-4000-8000-000000011301', '00000000-0000-4000-8000-000000011201', '00000000-0000-4000-8000-000000011101', 'tiered');
insert into public.smart_management_transfer_tiers (transfer_rule_id, professional_id, min_students, max_students, amount)
values
  ('00000000-0000-4000-8000-000000011301', '00000000-0000-4000-8000-000000011101', 1, 1, 50),
  ('00000000-0000-4000-8000-000000011301', '00000000-0000-4000-8000-000000011101', 2, 2, 100),
  ('00000000-0000-4000-8000-000000011301', '00000000-0000-4000-8000-000000011101', 3, null, 150);
select is((select count(*)::int from public.smart_management_transfer_tiers where transfer_rule_id = '00000000-0000-4000-8000-000000011301'), 3, 'Academia A tiered scenario is representable');

insert into public.smart_management_transfer_rules (id, location_id, professional_id, rule_type, fixed_amount)
values ('00000000-0000-4000-8000-000000011302', '00000000-0000-4000-8000-000000011202', '00000000-0000-4000-8000-000000011101', 'fixed', 75);
select is((select fixed_amount from public.smart_management_transfer_rules where id = '00000000-0000-4000-8000-000000011302'), 75.00, 'Academia B fixed scenario is representable');

insert into public.smart_management_transfer_rules (id, location_id, professional_id, rule_type)
values ('00000000-0000-4000-8000-000000011303', '00000000-0000-4000-8000-000000011203', '00000000-0000-4000-8000-000000011101', 'none');
select ok(exists (select 1 from public.smart_management_transfer_rules where id = '00000000-0000-4000-8000-000000011303' and fixed_amount is null), 'Academia C no-transfer scenario is representable');

insert into public.smart_management_locations (id, professional_id, name)
values ('00000000-0000-4000-8000-000000011204', '00000000-0000-4000-8000-000000011101', 'Studio Per Student');
insert into public.smart_management_transfer_rules (id, location_id, professional_id, rule_type, per_student_amount)
values ('00000000-0000-4000-8000-000000011304', '00000000-0000-4000-8000-000000011204', '00000000-0000-4000-8000-000000011101', 'per_student', 25);
select is((select per_student_amount from public.smart_management_transfer_rules where id = '00000000-0000-4000-8000-000000011304'), 25.00, 'per-student rule is representable');

insert into public.smart_management_locations (id, professional_id, name)
values ('00000000-0000-4000-8000-000000011205', '00000000-0000-4000-8000-000000011101', 'Studio Percentage');
insert into public.smart_management_transfer_rules (id, location_id, professional_id, rule_type, percentage_rate)
values ('00000000-0000-4000-8000-000000011305', '00000000-0000-4000-8000-000000011205', '00000000-0000-4000-8000-000000011101', 'percentage', 12.5);
select is((select percentage_rate from public.smart_management_transfer_rules where id = '00000000-0000-4000-8000-000000011305'), 12.50, 'percentage rule is representable');

select is((select count(*)::int from public.save_smart_management_location(null, 'Academia RPC', 'Atomic fixture', 'tiered', null, '[{"minStudents":1,"maxStudents":"1","amount":50},{"minStudents":2,"maxStudents":"","amount":100}]'::jsonb)), 1, 'professional can save a complete location through the atomic RPC');
select is((select count(*)::int from public.smart_management_locations where name = 'Academia RPC'), 1, 'atomic RPC persists its location');
select is((select count(*)::int from public.smart_management_transfer_tiers t join public.smart_management_transfer_rules r on r.id = t.transfer_rule_id join public.smart_management_locations l on l.id = r.location_id where l.name = 'Academia RPC'), 2, 'atomic RPC persists its tiers');
select throws_ok($$select public.save_smart_management_location(null, 'Overlapping RPC', '', 'tiered', null, '[{"minStudents":1,"maxStudents":"3","amount":50},{"minStudents":2,"maxStudents":"","amount":100}]'::jsonb)$$, '23514', null, 'atomic RPC rejects overlapping tiers');

select throws_ok($$insert into public.smart_management_transfer_rules (location_id, professional_id, rule_type, fixed_amount) values ('00000000-0000-4000-8000-000000011205', '00000000-0000-4000-8000-000000011101', 'none', 1)$$, '23514', null, 'none rejects amount');
select throws_ok($$insert into public.smart_management_transfer_rules (location_id, professional_id, rule_type, percentage_rate) values ('00000000-0000-4000-8000-000000011205', '00000000-0000-4000-8000-000000011101', 'percentage', 150)$$, '23514', null, 'percentage rejects over 100');
select throws_ok($$insert into public.smart_management_transfer_tiers (transfer_rule_id, professional_id, min_students, max_students, amount) values ('00000000-0000-4000-8000-000000011301', '00000000-0000-4000-8000-000000011101', 3, 2, 10)$$, '23514', null, 'tier rejects inverted range');
select throws_ok($$insert into public.smart_management_transfer_tiers (transfer_rule_id, professional_id, min_students, amount) values ('00000000-0000-4000-8000-000000011302', '00000000-0000-4000-8000-000000011101', 1, 10)$$, 'P0001', null, 'tier cannot attach to non-tiered rule');

update public.smart_management_locations
set description = 'updated'
where id = '00000000-0000-4000-8000-000000011201';
select is((select description from public.smart_management_locations where id = '00000000-0000-4000-8000-000000011201'), 'updated', 'professional A updates own location');

update public.smart_management_locations
set status = 'archived', archived_at = now()
where id = '00000000-0000-4000-8000-000000011205';
select is((select status from public.smart_management_locations where id = '00000000-0000-4000-8000-000000011205'), 'archived', 'professional A archives own location');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000011102', true);
select is((select count(*)::int from public.smart_management_locations where id = '00000000-0000-4000-8000-000000011201'), 0, 'professional B cannot read professional A location');
update public.smart_management_locations set name = 'Bad Cross Owner' where id = '00000000-0000-4000-8000-000000011201';
select is((select count(*)::int from public.smart_management_locations where name = 'Bad Cross Owner'), 0, 'professional B cannot update professional A location');
select throws_ok($$insert into public.smart_management_transfer_rules (location_id, professional_id, rule_type) values ('00000000-0000-4000-8000-000000011201', '00000000-0000-4000-8000-000000011102', 'none')$$, 'P0001', null, 'professional B cannot attach rule to professional A location');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000011103', true);
select is((select count(*)::int from public.smart_management_locations), 0, 'student cannot read smart management locations');
select throws_ok($$insert into public.smart_management_locations (professional_id, name) values ('00000000-0000-4000-8000-000000011103', 'Student Bad')$$, '42501', null, 'student cannot create smart management location');
select is((select count(*)::int from public.smart_management_transfer_rules), 0, 'student cannot read smart management transfer rules');
select is((select count(*)::int from public.smart_management_transfer_tiers), 0, 'student cannot read smart management transfer tiers');

reset role;
set local role anon;
select throws_ok($$select count(*)::int from public.smart_management_locations$$, '42501', null, 'anon cannot read smart management locations');
select throws_ok($$insert into public.smart_management_locations (professional_id, name) values ('00000000-0000-4000-8000-000000011101', 'Anon Bad')$$, '42501', null, 'anon cannot create smart management location');

reset role;
select * from finish();
rollback;
`;

const result = runPsql(process.cwd(), sql, { timeoutMs: 180000, throwOnError: false });
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);

if (result.status !== 0 || /not ok/i.test(result.stdout)) {
  process.exit(1);
}

console.log("SMART_MANAGEMENT_RLS_RUNTIME=PASS");
