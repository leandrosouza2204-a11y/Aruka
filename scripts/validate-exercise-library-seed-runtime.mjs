import { runPsql } from "./supabase-cycle-8-lib.mjs";
import { readFileSync } from "node:fs";

const expectedCount = 30;
const personalId = "00000000-0000-4000-8000-000000099801";
const professionalId = "00000000-0000-4000-8000-000000099802";
const catalogMigration = readFileSync("supabase/migrations/20260907150000_exercise_official_catalog_v1.sql", "utf8");

const sql = String.raw`
begin;

create extension if not exists pgtap with schema extensions;
select plan(10);

insert into auth.users (id, email)
values ('${professionalId}', 'cycle-09-8-professional@example.invalid')
on conflict (id) do nothing;

insert into public.perfis (id, user_id, nome, email, role, tipo_acesso, status)
values ('${professionalId}', '${professionalId}', 'Cycle 09.8 Professional', 'cycle-09-8-professional@example.invalid', 'user', 'assinante', 'ativo')
on conflict (user_id) do nothing;

insert into public.exercise_library (id, owner_id, origin, name, description, muscle_group, category, instructions, status)
values ('${personalId}', '${professionalId}', 'personal', 'Cycle 09.8 personal preservation', 'Fixture pessoal para validar preservacao.', 'Peitoral', 'Musculacao', 'Linha pessoal usada apenas no teste transacional de preservacao.', 'active')
on conflict (id) do update
set name = excluded.name,
    owner_id = excluded.owner_id,
    origin = excluded.origin;

${catalogMigration}
${catalogMigration}

select is((select count(*)::int from public.exercise_library where metadata->>'catalog' = 'aruka_official_v1'), ${expectedCount}, 'official catalog count is stable after rerun');
select is((select count(distinct id)::int from public.exercise_library where metadata->>'catalog' = 'aruka_official_v1'), ${expectedCount}, 'official ids are unique');
select is((select count(distinct lower(name))::int from public.exercise_library where metadata->>'catalog' = 'aruka_official_v1'), ${expectedCount}, 'official names are unique');
select is((select count(*)::int from public.exercise_library where metadata->>'catalog' = 'aruka_official_v1' and origin = 'official'), ${expectedCount}, 'all catalog rows are official');
select is((select count(*)::int from public.exercise_library where metadata->>'catalog' = 'aruka_official_v1' and owner_id is null), ${expectedCount}, 'all official catalog owners are null');
select is((select count(*)::int from public.exercise_library where metadata->>'catalog' = 'aruka_official_v1' and status = 'active'), ${expectedCount}, 'all official catalog rows are active');
select is((select count(*)::int from public.exercise_library where metadata->>'catalog' = 'aruka_official_v1' and media_type is null and media_path is null and youtube_url = ''), ${expectedCount}, 'official catalog does not seed media');
select ok(exists (select 1 from public.exercise_library where id = '${personalId}' and owner_id = '${professionalId}' and origin = 'personal'), 'personal exercise preserved');

set local role authenticated;
select set_config('request.jwt.claim.sub', '${professionalId}', true);
update public.exercise_library set name = 'Should not change official' where id = '00000000-0000-4000-8000-000000090801';
select is((select name from public.exercise_library where id = '00000000-0000-4000-8000-000000090801'), 'Supino reto com barra', 'professional cannot mutate official catalog');

reset role;
set local role anon;
select throws_ok($$select count(*)::int from public.exercise_library where metadata->>'catalog' = 'aruka_official_v1'$$, '42501', null, 'anon cannot read official catalog');

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

console.log("Exercise library seed runtime validation passed.");
