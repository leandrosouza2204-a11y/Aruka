import { runPsql } from "./supabase-cycle-8-lib.mjs";

const sql = String.raw`
begin;

create extension if not exists pgtap with schema extensions;

select plan(18);

insert into auth.users (id, email)
values
  ('00000000-0000-4000-8000-000000011311', 'cycle-11-3-professional-a@example.invalid'),
  ('00000000-0000-4000-8000-000000011312', 'cycle-11-3-professional-b@example.invalid'),
  ('00000000-0000-4000-8000-000000011313', 'cycle-11-3-student@example.invalid')
on conflict (id) do nothing;

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status)
values
  ('00000000-0000-4000-8000-000000011311', '00000000-0000-4000-8000-000000011311', 'Cycle 11.3 Professional A', 'cycle-11-3-professional-a@example.invalid', 'user', 'assinante', 'ativo'),
  ('00000000-0000-4000-8000-000000011312', '00000000-0000-4000-8000-000000011312', 'Cycle 11.3 Professional B', 'cycle-11-3-professional-b@example.invalid', 'user', 'assinante', 'ativo'),
  ('00000000-0000-4000-8000-000000011313', '00000000-0000-4000-8000-000000011313', 'Cycle 11.3 Student', 'cycle-11-3-student@example.invalid', 'student', 'pendente', 'ativo')
on conflict (user_id) do nothing;

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000011311', true);

select is((select count(*)::int from public.save_smart_management_service(null, 'Personal Individual 2x', '', 'personal_training', 'MONTHLY_PACKAGE', 800, 2, null, null, 60, 1, 1)), 1, 'professional creates monthly package');
select is((select count(*)::int from public.save_smart_management_service(null, 'Personal Individual 3x', '', 'personal_training', 'MONTHLY_PACKAGE', 1050, 3, null, null, 60, 1, 1)), 1, 'professional creates second monthly package');
select is((select count(*)::int from public.save_smart_management_service(null, 'Personal em Dupla', '', 'personal_training', 'PER_STUDENT_SESSION', 70, null, null, null, 60, 2, 2)), 1, 'professional creates pair per student session');
select is((select count(*)::int from public.save_smart_management_service(null, 'Personal em Grupo', '', 'personal_training', 'PER_STUDENT_SESSION', 60, null, null, null, 60, 3, null)), 1, 'professional creates open ended group');
select is((select count(*)::int from public.save_smart_management_service(null, 'Sessão Avulsa', '', 'personal_training', 'PER_SESSION', 120, null, null, null, null, 1, 1)), 1, 'professional creates per session service');
select is((select count(*)::int from public.save_smart_management_service(null, 'Pacote de 10 sessões', '', 'personal_training', 'FIXED_PACKAGE', 900, null, null, 10, null, 1, 1)), 1, 'professional creates fixed package');
select is((select count(*)::int from public.save_smart_management_service(null, 'Consultoria Online', '', 'online_coaching', 'MONTHLY_PACKAGE', 250, null, null, null, null, 1, null)), 1, 'professional creates online service without location');

select is((select count(*)::int from public.smart_management_services where professional_id = '00000000-0000-4000-8000-000000011311'), 7, 'professional reads own services');
update public.smart_management_services set price = 850 where name = 'Personal Individual 2x';
select is((select price from public.smart_management_services where name = 'Personal Individual 2x'), 850.00, 'professional updates own service');
update public.smart_management_services set status = 'archived', archived_at = now() where name = 'Sessão Avulsa';
select is((select status from public.smart_management_services where name = 'Sessão Avulsa'), 'archived', 'professional archives own service');
update public.smart_management_services set status = 'active', archived_at = null where name = 'Sessão Avulsa';
select is((select status from public.smart_management_services where name = 'Sessão Avulsa'), 'active', 'professional reactivates own service');
select throws_ok($$select public.save_smart_management_service(null, 'Pacote inválido', '', 'personal_training', 'FIXED_PACKAGE', 900, null, null, null, null, 1, 1)$$, '23514', null, 'fixed package requires quantity');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000011312', true);
select is((select count(*)::int from public.smart_management_services where professional_id = '00000000-0000-4000-8000-000000011311'), 0, 'professional B cannot read professional A services');
update public.smart_management_services set name = 'Cross owner bad' where professional_id = '00000000-0000-4000-8000-000000011311';
select is((select count(*)::int from public.smart_management_services where name = 'Cross owner bad'), 0, 'professional B cannot update professional A services');

select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-000000011313', true);
select is((select count(*)::int from public.smart_management_services), 0, 'student cannot read services');
select throws_ok($$insert into public.smart_management_services (professional_id, name, service_type, pricing_model, price) values ('00000000-0000-4000-8000-000000011313', 'Student Bad', 'other', 'PER_SESSION', 1)$$, '42501', null, 'student cannot create services');

reset role;
set local role anon;
select throws_ok($$select count(*)::int from public.smart_management_services$$, '42501', null, 'anon cannot read services');
select throws_ok($$insert into public.smart_management_services (professional_id, name, service_type, pricing_model, price) values ('00000000-0000-4000-8000-000000011311', 'Anon Bad', 'other', 'PER_SESSION', 1)$$, '42501', null, 'anon cannot create services');

reset role;
select * from finish();
rollback;
`;

const result = runPsql(process.cwd(), sql, { timeoutMs: 180000, throwOnError: false });
process.stdout.write(result.stdout);
process.stderr.write(result.stderr);

if (result.status !== 0 || /not ok/i.test(result.stdout)) process.exit(1);

console.log("SMART_MANAGEMENT_SERVICES_PRICING_RLS_RUNTIME=PASS");
