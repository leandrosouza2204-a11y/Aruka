-- CoachFlow - Auditoria da camada de dados
-- Data: 2026-07-04
--
-- Este arquivo NAO foi aplicado automaticamente.
-- Revise no SQL Editor/Supabase CLI antes de executar em producao.

begin;

-- ============================================================
-- 1. Diagnosticos de integridade multi-tenant
-- ============================================================

select
  'pagamentos_com_aluno_invalido_ou_de_outro_usuario' as check_name,
  p.id,
  p.user_id,
  p.aluno_id,
  a.user_id as aluno_user_id
from public.pagamentos p
left join public.alunos a on a.id = p.aluno_id
where a.id is null or a.user_id <> p.user_id;

select
  'treinos_com_aluno_invalido_ou_de_outro_usuario' as check_name,
  t.id,
  t.user_id,
  t.aluno_id,
  a.user_id as aluno_user_id
from public.treinos t
left join public.alunos a on a.id = t.aluno_id
where a.id is null or a.user_id <> t.user_id;

select
  'avaliacoes_com_aluno_invalido_ou_de_outro_usuario' as check_name,
  av.id,
  av.user_id,
  av.aluno_id,
  a.user_id as aluno_user_id
from public.avaliacoes av
left join public.alunos a on a.id = av.aluno_id
where a.id is null or a.user_id <> av.user_id;

select
  'anamneses_com_aluno_invalido_ou_de_outro_usuario' as check_name,
  an.id,
  an.user_id,
  an.aluno_id,
  a.user_id as aluno_user_id
from public.anamneses an
left join public.alunos a on a.id = an.aluno_id
where a.id is null or a.user_id <> an.user_id;

select
  'perfis_email_duplicado' as check_name,
  lower(email) as email_normalizado,
  count(*) as total
from public.perfis
where nullif(trim(coalesce(email, '')), '') is not null
group by lower(email)
having count(*) > 1;

select
  'assinaturas_ativas_multiplas_por_usuario' as check_name,
  user_id,
  count(*) as total
from public.assinaturas
where status = 'ativo'
group by user_id
having count(*) > 1;

-- ============================================================
-- 2. Indices seguros sugeridos
-- ============================================================

create index if not exists alunos_user_vencimento_idx
on public.alunos(user_id, vencimento);

create index if not exists planos_user_ativo_idx
on public.planos(user_id, ativo);

create index if not exists assinaturas_user_created_at_idx
on public.assinaturas(user_id, created_at desc);

create index if not exists assinaturas_user_status_vencimento_idx
on public.assinaturas(user_id, status, data_vencimento);

create index if not exists treinos_user_created_at_idx
on public.treinos(user_id, created_at desc);

create index if not exists avaliacoes_user_data_idx
on public.avaliacoes(user_id, data_avaliacao desc);

create index if not exists anamneses_user_created_at_idx
on public.anamneses(user_id, created_at desc);

-- ============================================================
-- 3. RLS sugerida: validar propriedade do aluno vinculado
-- ============================================================
-- Motivo:
-- treinos, avaliacoes e anamneses possuem user_id e aluno_id, mas as
-- policies atuais validam apenas user_id. O bloco abaixo impede gravar
-- aluno_id de outro personal e tambem aplica a recomendacao de performance
-- do Supabase usando (select auth.uid()).

drop policy if exists "Usuarios podem listar seus treinos" on public.treinos;
create policy "Usuarios podem listar seus treinos"
on public.treinos
for select
using ((select auth.uid()) = user_id);

drop policy if exists "Usuarios podem cadastrar seus treinos" on public.treinos;
create policy "Usuarios podem cadastrar seus treinos"
on public.treinos
for insert
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.alunos
    where alunos.id = treinos.aluno_id
      and alunos.user_id = (select auth.uid())
  )
);

drop policy if exists "Usuarios podem atualizar seus treinos" on public.treinos;
create policy "Usuarios podem atualizar seus treinos"
on public.treinos
for update
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.alunos
    where alunos.id = treinos.aluno_id
      and alunos.user_id = (select auth.uid())
  )
);

drop policy if exists "Usuarios podem excluir seus treinos" on public.treinos;
create policy "Usuarios podem excluir seus treinos"
on public.treinos
for delete
using ((select auth.uid()) = user_id);

drop policy if exists "Usuarios podem listar suas avaliacoes" on public.avaliacoes;
create policy "Usuarios podem listar suas avaliacoes"
on public.avaliacoes
for select
using ((select auth.uid()) = user_id);

drop policy if exists "Usuarios podem cadastrar suas avaliacoes" on public.avaliacoes;
create policy "Usuarios podem cadastrar suas avaliacoes"
on public.avaliacoes
for insert
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.alunos
    where alunos.id = avaliacoes.aluno_id
      and alunos.user_id = (select auth.uid())
  )
);

drop policy if exists "Usuarios podem atualizar suas avaliacoes" on public.avaliacoes;
create policy "Usuarios podem atualizar suas avaliacoes"
on public.avaliacoes
for update
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.alunos
    where alunos.id = avaliacoes.aluno_id
      and alunos.user_id = (select auth.uid())
  )
);

drop policy if exists "Usuarios podem excluir suas avaliacoes" on public.avaliacoes;
create policy "Usuarios podem excluir suas avaliacoes"
on public.avaliacoes
for delete
using ((select auth.uid()) = user_id);

drop policy if exists "Usuarios podem listar suas anamneses" on public.anamneses;
create policy "Usuarios podem listar suas anamneses"
on public.anamneses
for select
using ((select auth.uid()) = user_id);

drop policy if exists "Usuarios podem cadastrar suas anamneses" on public.anamneses;
create policy "Usuarios podem cadastrar suas anamneses"
on public.anamneses
for insert
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.alunos
    where alunos.id = anamneses.aluno_id
      and alunos.user_id = (select auth.uid())
  )
);

drop policy if exists "Usuarios podem atualizar suas anamneses" on public.anamneses;
create policy "Usuarios podem atualizar suas anamneses"
on public.anamneses
for update
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.alunos
    where alunos.id = anamneses.aluno_id
      and alunos.user_id = (select auth.uid())
  )
);

drop policy if exists "Usuarios podem excluir suas anamneses" on public.anamneses;
create policy "Usuarios podem excluir suas anamneses"
on public.anamneses
for delete
using ((select auth.uid()) = user_id);

-- ============================================================
-- 4. Recomendacao futura, nao executar sem plano de migracao
-- ============================================================
-- A coluna public.alunos.plano e text. O app hoje usa esse campo como id
-- de plano em varios fluxos, mas o banco nao consegue garantir integridade.
-- Caminho recomendado para uma etapa propria:
--
-- alter table public.alunos add column if not exists plano_id uuid;
-- update public.alunos a
-- set plano_id = p.id
-- from public.planos p
-- where a.user_id = p.user_id
--   and a.plano = p.id::text
--   and a.plano_id is null;
-- alter table public.alunos
--   add constraint alunos_plano_id_fkey
--   foreign key (plano_id) references public.planos(id)
--   on delete set null;
--
-- Manter plano text em paralelo ate o frontend ser migrado.

commit;
