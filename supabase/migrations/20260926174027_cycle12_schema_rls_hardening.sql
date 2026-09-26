begin;

-- Cycle 12.13.2: REQUIRED-only schema/RLS hardening.
-- Preconditions intentionally abort on drift before persistent DDL is applied.

create temporary table cycle_12_13_expected_policies (
  table_name text not null,
  policy_name text not null,
  command text not null,
  primary key (table_name, policy_name)
) on commit drop;

insert into cycle_12_13_expected_policies (table_name, policy_name, command) values
  ('aceites_legais', 'Usuarios podem listar seus aceites legais', 'SELECT'),
  ('aceites_legais', 'Usuarios podem registrar seus aceites legais', 'INSERT'),
  ('acompanhamento_eventos', 'Usuarios podem cadastrar seus eventos de acompanhamento', 'INSERT'),
  ('acompanhamento_eventos', 'Usuarios podem listar seus eventos de acompanhamento', 'SELECT'),
  ('alunos', 'Usuarios podem atualizar seus alunos', 'UPDATE'),
  ('alunos', 'Usuarios podem cadastrar seus alunos', 'INSERT'),
  ('alunos', 'Usuarios podem excluir seus alunos', 'DELETE'),
  ('alunos', 'Usuarios podem listar seus alunos', 'SELECT'),
  ('anamneses', 'Usuarios podem atualizar suas anamneses', 'UPDATE'),
  ('anamneses', 'Usuarios podem cadastrar suas anamneses', 'INSERT'),
  ('anamneses', 'Usuarios podem excluir suas anamneses', 'DELETE'),
  ('anamneses', 'Usuarios podem listar suas anamneses', 'SELECT'),
  ('aoe_decision_traces', 'Traces AOE restritos ao profissional autorizado', 'SELECT'),
  ('aoe_decisions', 'Usuarios podem criar decisoes AOE dos seus alunos', 'INSERT'),
  ('aoe_decisions', 'Usuarios podem listar decisoes AOE dos seus alunos', 'SELECT'),
  ('aoe_human_reviews', 'Usuarios podem atualizar reviews AOE autorizadas', 'UPDATE'),
  ('aoe_human_reviews', 'Usuarios podem consultar reviews AOE autorizadas', 'SELECT'),
  ('aoe_human_reviews', 'Usuarios podem criar reviews AOE autorizadas', 'INSERT'),
  ('aoe_idempotency_keys', 'Idempotencia AOE restrita ao ator', 'ALL'),
  ('assinaturas', 'Usuarios podem cadastrar suas assinaturas', 'INSERT'),
  ('assinaturas', 'Usuarios podem listar suas assinaturas', 'SELECT'),
  ('avaliacoes', 'Usuarios podem atualizar suas avaliacoes', 'UPDATE'),
  ('avaliacoes', 'Usuarios podem cadastrar suas avaliacoes', 'INSERT'),
  ('avaliacoes', 'Usuarios podem excluir suas avaliacoes', 'DELETE'),
  ('avaliacoes', 'Usuarios podem listar suas avaliacoes', 'SELECT'),
  ('exercise_favorites', 'Profissionais favoritam exercicios visiveis', 'INSERT'),
  ('exercise_favorites', 'Profissionais leem seus favoritos', 'SELECT'),
  ('exercise_favorites', 'Profissionais removem seus favoritos', 'DELETE'),
  ('exercise_library', 'Profissionais atualizam exercicios pessoais', 'UPDATE'),
  ('exercise_library', 'Profissionais criam exercicios pessoais', 'INSERT'),
  ('exercise_library', 'Profissionais leem biblioteca oficial e propria', 'SELECT'),
  ('pagamentos', 'Usuarios podem atualizar seus pagamentos', 'UPDATE'),
  ('pagamentos', 'Usuarios podem cadastrar seus pagamentos', 'INSERT'),
  ('pagamentos', 'Usuarios podem excluir seus pagamentos', 'DELETE'),
  ('pagamentos', 'Usuarios podem listar seus pagamentos', 'SELECT'),
  ('perfis', 'Usuarios podem criar seu perfil padrao', 'INSERT'),
  ('perfis', 'Usuarios podem listar seu perfil', 'SELECT'),
  ('planos', 'Usuarios podem atualizar seus planos', 'UPDATE'),
  ('planos', 'Usuarios podem cadastrar seus planos', 'INSERT'),
  ('planos', 'Usuarios podem excluir seus planos', 'DELETE'),
  ('planos', 'Usuarios podem listar seus planos', 'SELECT'),
  ('smart_management_locations', 'Profissionais gerenciam seus locais inteligentes', 'ALL'),
  ('smart_management_services', 'Profissionais gerenciam seus servicos inteligentes', 'ALL'),
  ('smart_management_transfer_rules', 'Profissionais gerenciam suas regras inteligentes', 'ALL'),
  ('smart_management_transfer_tiers', 'Profissionais gerenciam suas faixas inteligentes', 'ALL'),
  ('treino_dias', 'Usuarios podem atualizar dias dos seus treinos', 'UPDATE'),
  ('treino_dias', 'Usuarios podem cadastrar dias dos seus treinos', 'INSERT'),
  ('treino_dias', 'Usuarios podem excluir dias dos seus treinos', 'DELETE'),
  ('treino_dias', 'Usuarios podem listar dias dos seus treinos', 'SELECT'),
  ('treino_eventos', 'Usuarios podem listar eventos dos seus treinos', 'SELECT'),
  ('treino_exercicios', 'Usuarios podem atualizar exercicios dos seus treinos', 'UPDATE'),
  ('treino_exercicios', 'Usuarios podem cadastrar exercicios dos seus treinos', 'INSERT'),
  ('treino_exercicios', 'Usuarios podem excluir exercicios dos seus treinos', 'DELETE'),
  ('treino_exercicios', 'Usuarios podem listar exercicios dos seus treinos', 'SELECT'),
  ('treinos', 'Usuarios podem atualizar seus treinos', 'UPDATE'),
  ('treinos', 'Usuarios podem cadastrar seus treinos', 'INSERT'),
  ('treinos', 'Usuarios podem excluir seus treinos', 'DELETE'),
  ('treinos', 'Usuarios podem listar seus treinos', 'SELECT'),
  ('workout_templates', 'Usuarios podem atualizar seus modelos de treino', 'UPDATE'),
  ('workout_templates', 'Usuarios podem cadastrar seus modelos de treino', 'INSERT'),
  ('workout_templates', 'Usuarios podem excluir seus modelos de treino', 'DELETE'),
  ('workout_templates', 'Usuarios podem listar seus modelos de treino', 'SELECT');

do $$
declare
  v_problem text;
  v_direct_count integer;
begin
  if to_regprocedure('public.admin_upsert_assinatura(uuid,text,text,date,date,text)') is null
     or to_regprocedure('public.admin_upsert_assinatura(uuid,text,text,date,date,text,date,boolean)') is null then
    raise exception 'CYCLE_12_13_PRECONDITION: expected admin_upsert_assinatura overloads are missing';
  end if;

  if to_regprocedure('public.admin_liberar_assinante(uuid,text,date,date,text)') is null
     or to_regprocedure('public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)') is null then
    raise exception 'CYCLE_12_13_PRECONDITION: expected admin wrapper/lifecycle signature is missing';
  end if;

  if (select count(*) from cycle_12_13_expected_policies) <> 62 then
    raise exception 'CYCLE_12_13_PRECONDITION: expected policy allowlist must contain exactly 62 rows';
  end if;

  select string_agg(format('%I.%I [%s]', e.table_name, e.policy_name, coalesce(p.cmd, 'missing')), ', ' order by e.table_name, e.policy_name)
  into v_problem
  from cycle_12_13_expected_policies e
  left join pg_policies p
    on p.schemaname = 'public'
   and p.tablename = e.table_name
   and p.policyname = e.policy_name
  left join pg_class c
    on c.oid = format('public.%I', e.table_name)::regclass
  where p.policyname is null
     or p.cmd <> e.command
     or p.roles::text <> '{authenticated}'
     or p.permissive <> 'PERMISSIVE'
     or not c.relrowsecurity
     or (coalesce(p.qual, '') || coalesce(p.with_check, '')) not like '%auth.uid()%'
     or (coalesce(p.qual, '') || coalesce(p.with_check, '')) like '%SELECT auth.uid()%';

  if v_problem is not null then
    raise exception 'CYCLE_12_13_PRECONDITION: policy drift: %', v_problem;
  end if;

  select count(*) into v_direct_count
  from pg_policies p
  where p.schemaname = 'public'
    and (
      (coalesce(p.qual, '') like '%auth.uid()%' and coalesce(p.qual, '') not like '%SELECT auth.uid()%')
      or
      (coalesce(p.with_check, '') like '%auth.uid()%' and coalesce(p.with_check, '') not like '%SELECT auth.uid()%')
    );

  if v_direct_count <> 62 then
    raise exception 'CYCLE_12_13_PRECONDITION: expected 62 public direct-auth policies, found %', v_direct_count;
  end if;
end;
$$;

create temporary table cycle_12_13_policy_snapshot on commit drop as
select
  p.tablename,
  p.policyname,
  p.permissive,
  p.roles::text as roles,
  p.cmd,
  p.qual,
  p.with_check
from pg_policies p
where p.schemaname = 'public';

create temporary table cycle_12_13_function_snapshot on commit drop as
select
  p.oid,
  p.oid::regprocedure::text as signature,
  p.proowner,
  p.prosecdef,
  p.proconfig,
  p.proacl
from pg_proc p
where p.oid in (
  'public.admin_liberar_assinante(uuid,text,date,date,text)'::regprocedure,
  'public.admin_subscription_lifecycle_action(uuid,text,text,date,date,date,text)'::regprocedure
);

create or replace function public.admin_liberar_assinante(
  p_user_id uuid,
  p_plano text,
  p_data_inicio date,
  p_data_vencimento date,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_antes jsonb;
  v_depois jsonb;
begin
  perform public.admin_validar_acesso();

  select jsonb_build_object('perfil', to_jsonb(perfis.*), 'assinatura', to_jsonb(assinaturas.*))
  into v_antes
  from auth.users
  left join public.perfis on perfis.user_id = users.id
  left join lateral (
    select *
    from public.assinaturas
    where assinaturas.user_id = users.id
    order by assinaturas.created_at desc
    limit 1
  ) assinaturas on true
  where users.id = p_user_id;

  perform public.admin_atualizar_perfil(p_user_id, coalesce((select perfis.nome from public.perfis where perfis.user_id = p_user_id), ''), 'user', 'assinante', 'ativo', p_user_agent);
  perform public.admin_upsert_assinatura(
    p_user_id,
    p_plano,
    'ativo'::text,
    p_data_inicio,
    p_data_vencimento,
    p_user_agent,
    null::date,
    false
  );

  select jsonb_build_object('perfil', to_jsonb(perfis.*), 'assinatura', to_jsonb(assinaturas.*))
  into v_depois
  from auth.users
  left join public.perfis on perfis.user_id = users.id
  left join lateral (
    select *
    from public.assinaturas
    where assinaturas.user_id = users.id
    order by assinaturas.created_at desc
    limit 1
  ) assinaturas on true
  where users.id = p_user_id;

  perform public.admin_registrar_log(p_user_id, 'liberar_assinante', 'assinaturas', null, v_antes, v_depois, p_user_agent);
end;
$$;

create or replace function public.admin_subscription_lifecycle_action(
  p_user_id uuid,
  p_action text,
  p_plano text default null,
  p_data_inicio date default null,
  p_data_vencimento date default null,
  p_grace_until date default null,
  p_user_agent text default null
)
returns void
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_action text := lower(trim(coalesce(p_action, '')));
  v_assinatura_id uuid;
  v_antes jsonb;
  v_depois jsonb;
  v_start date;
  v_end date;
  v_grace date;
  v_log_action text;
begin
  perform public.admin_validar_acesso();

  if p_user_id is null then
    raise exception 'Usuario alvo obrigatorio.';
  end if;

  select id, to_jsonb(assinaturas.*), data_inicio, data_vencimento, grace_until
  into v_assinatura_id, v_antes, v_start, v_end, v_grace
  from public.assinaturas
  where user_id = p_user_id
  order by created_at desc
  limit 1;

  if v_assinatura_id is null then
    insert into public.assinaturas (user_id, plano, status, data_inicio, data_vencimento)
    values (p_user_id, coalesce(nullif(trim(coalesce(p_plano, '')), ''), 'pendente'), 'pendente', p_data_inicio, p_data_vencimento)
    returning id into v_assinatura_id;

    select id, to_jsonb(assinaturas.*), data_inicio, data_vencimento, grace_until
    into v_assinatura_id, v_antes, v_start, v_end, v_grace
    from public.assinaturas
    where id = v_assinatura_id;
  end if;

  if v_action = 'mark_paid' then
    v_start := coalesce(p_data_inicio, current_date);
    v_end := p_data_vencimento;
    if v_end is null or v_end < current_date then
      raise exception 'Reativacao exige periodo de assinatura valido.';
    end if;
    update public.assinaturas
    set plano = coalesce(nullif(trim(coalesce(p_plano, '')), ''), plano, 'Mensal'),
        status = 'ativo',
        data_inicio = v_start,
        data_vencimento = v_end,
        grace_until = null,
        cancel_at_period_end = false,
        suspended_at = null,
        cancelled_at = null,
        reactivated_at = current_date
    where id = v_assinatura_id;
    v_log_action := 'subscription_marked_paid';
  elsif v_action = 'enter_grace' then
    v_grace := coalesce(p_grace_until, coalesce(v_end, current_date) + 7);
    if v_grace < current_date then
      raise exception 'Periodo de tolerancia precisa terminar hoje ou no futuro.';
    end if;
    update public.assinaturas
    set status = 'vencido',
        grace_until = v_grace,
        suspended_at = null
    where id = v_assinatura_id;
    v_log_action := 'subscription_grace_extended';
  elsif v_action = 'extend_grace' then
    v_grace := p_grace_until;
    if v_grace is null or v_grace < current_date then
      raise exception 'Informe uma data de tolerancia futura.';
    end if;
    update public.assinaturas
    set status = 'vencido',
        grace_until = v_grace,
        suspended_at = null
    where id = v_assinatura_id;
    v_log_action := 'subscription_grace_extended';
  elsif v_action = 'suspend_subscription' then
    update public.assinaturas
    set status = 'vencido',
        grace_until = null,
        suspended_at = current_date,
        cancel_at_period_end = false
    where id = v_assinatura_id;
    v_log_action := 'subscription_suspended';
  elsif v_action = 'reactivate_subscription' then
    v_start := coalesce(p_data_inicio, current_date);
    v_end := p_data_vencimento;
    if v_end is null or v_end < current_date then
      raise exception 'Reativacao exige periodo de assinatura valido.';
    end if;
    update public.assinaturas
    set plano = coalesce(nullif(trim(coalesce(p_plano, '')), ''), plano, 'Mensal'),
        status = 'ativo',
        data_inicio = v_start,
        data_vencimento = v_end,
        grace_until = null,
        cancel_at_period_end = false,
        cancelled_at = null,
        suspended_at = null,
        reactivated_at = current_date
    where id = v_assinatura_id;
    v_log_action := 'subscription_reactivated';
  elsif v_action = 'schedule_cancellation' then
    if coalesce(v_end, p_data_vencimento) is null then
      raise exception 'Cancelamento ao fim do periodo exige data de vencimento.';
    end if;
    update public.assinaturas
    set cancel_at_period_end = true,
        cancelled_at = null,
        suspended_at = null
    where id = v_assinatura_id;
    v_log_action := 'subscription_cancel_scheduled';
  elsif v_action = 'cancel_now' then
    update public.assinaturas
    set status = 'cancelado',
        cancel_at_period_end = false,
        grace_until = null,
        suspended_at = null,
        cancelled_at = current_date
    where id = v_assinatura_id;
    v_log_action := 'subscription_cancelled_now';
  else
    raise exception 'Acao de lifecycle invalida: %', p_action;
  end if;

  select to_jsonb(assinaturas.*) into v_depois
  from public.assinaturas
  where id = v_assinatura_id;

  perform public.admin_registrar_log(p_user_id, v_log_action, 'assinaturas', v_assinatura_id, v_antes, v_depois, p_user_agent);
end;
$$;

-- Core ownership and relational ownership policies.
alter policy "Usuarios podem listar seus aceites legais" on public.aceites_legais
  using ((select auth.uid()) = user_id);
alter policy "Usuarios podem registrar seus aceites legais" on public.aceites_legais
  with check ((select auth.uid()) = user_id and politica_aceita = true and termos_aceitos = true);

alter policy "Usuarios podem cadastrar seus eventos de acompanhamento" on public.acompanhamento_eventos
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.alunos where alunos.id = acompanhamento_eventos.aluno_id and alunos.user_id = (select auth.uid()))
    and (plano_id is null or exists (select 1 from public.planos where planos.id = acompanhamento_eventos.plano_id and planos.user_id = (select auth.uid())))
  );
alter policy "Usuarios podem listar seus eventos de acompanhamento" on public.acompanhamento_eventos
  using ((select auth.uid()) = user_id);

alter policy "Usuarios podem atualizar seus alunos" on public.alunos
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
alter policy "Usuarios podem cadastrar seus alunos" on public.alunos
  with check ((select auth.uid()) = user_id);
alter policy "Usuarios podem excluir seus alunos" on public.alunos
  using ((select auth.uid()) = user_id);
alter policy "Usuarios podem listar seus alunos" on public.alunos
  using ((select auth.uid()) = user_id);

alter policy "Usuarios podem atualizar suas anamneses" on public.anamneses
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and exists (select 1 from public.alunos where alunos.id = anamneses.aluno_id and alunos.user_id = (select auth.uid())));
alter policy "Usuarios podem cadastrar suas anamneses" on public.anamneses
  with check ((select auth.uid()) = user_id and exists (select 1 from public.alunos where alunos.id = anamneses.aluno_id and alunos.user_id = (select auth.uid())));
alter policy "Usuarios podem excluir suas anamneses" on public.anamneses
  using ((select auth.uid()) = user_id);
alter policy "Usuarios podem listar suas anamneses" on public.anamneses
  using ((select auth.uid()) = user_id);

-- AOE helpers remain row-dependent and are intentionally not wrapped.
alter policy "Traces AOE restritos ao profissional autorizado" on public.aoe_decision_traces
  using (exists (select 1 from public.aoe_decisions d where d.id = aoe_decision_traces.decision_id and (d.actor_id = (select auth.uid()) or public.admin_eh_admin())));
alter policy "Usuarios podem criar decisoes AOE dos seus alunos" on public.aoe_decisions
  with check (actor_id = (select auth.uid()) and public.aoe_user_owns_student(student_id));
alter policy "Usuarios podem listar decisoes AOE dos seus alunos" on public.aoe_decisions
  using (actor_id = (select auth.uid()) or public.admin_eh_admin() or public.aoe_user_owns_student(student_id));
alter policy "Usuarios podem atualizar reviews AOE autorizadas" on public.aoe_human_reviews
  using (exists (select 1 from public.aoe_decisions d where d.id = aoe_human_reviews.decision_id and d.actor_id = (select auth.uid())))
  with check (exists (select 1 from public.aoe_decisions d where d.id = aoe_human_reviews.decision_id and d.actor_id = (select auth.uid())));
alter policy "Usuarios podem consultar reviews AOE autorizadas" on public.aoe_human_reviews
  using (exists (select 1 from public.aoe_decisions d where d.id = aoe_human_reviews.decision_id and (d.actor_id = (select auth.uid()) or public.admin_eh_admin())));
alter policy "Usuarios podem criar reviews AOE autorizadas" on public.aoe_human_reviews
  with check (exists (select 1 from public.aoe_decisions d where d.id = aoe_human_reviews.decision_id and d.actor_id = (select auth.uid())));
alter policy "Idempotencia AOE restrita ao ator" on public.aoe_idempotency_keys
  using (actor_id = (select auth.uid()) or public.admin_eh_admin())
  with check (actor_id = (select auth.uid()) or public.admin_eh_admin());

alter policy "Usuarios podem cadastrar suas assinaturas" on public.assinaturas
  with check ((select auth.uid()) = user_id and status = 'pendente');
alter policy "Usuarios podem listar suas assinaturas" on public.assinaturas
  using ((select auth.uid()) = user_id);

alter policy "Usuarios podem atualizar suas avaliacoes" on public.avaliacoes
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and exists (select 1 from public.alunos where alunos.id = avaliacoes.aluno_id and alunos.user_id = (select auth.uid())));
alter policy "Usuarios podem cadastrar suas avaliacoes" on public.avaliacoes
  with check ((select auth.uid()) = user_id and exists (select 1 from public.alunos where alunos.id = avaliacoes.aluno_id and alunos.user_id = (select auth.uid())));
alter policy "Usuarios podem excluir suas avaliacoes" on public.avaliacoes
  using ((select auth.uid()) = user_id);
alter policy "Usuarios podem listar suas avaliacoes" on public.avaliacoes
  using ((select auth.uid()) = user_id);

-- Exercise library/favorites keep row-dependent visibility helpers per-row.
alter policy "Profissionais favoritam exercicios visiveis" on public.exercise_favorites
  with check (
    professional_id = (select auth.uid())
    and exists (
      select 1 from public.exercise_library e
      where e.id = exercise_favorites.exercise_id
        and e.status = 'active'
        and (e.origin = 'official' or e.owner_id = (select auth.uid()))
    )
  );
alter policy "Profissionais leem seus favoritos" on public.exercise_favorites
  using (professional_id = (select auth.uid()));
alter policy "Profissionais removem seus favoritos" on public.exercise_favorites
  using (professional_id = (select auth.uid()));
alter policy "Profissionais atualizam exercicios pessoais" on public.exercise_library
  using (
    origin = 'personal' and owner_id = (select auth.uid())
    and exists (select 1 from public.perfis p where p.user_id = (select auth.uid()) and p.role = 'user' and p.status = 'ativo')
  )
  with check (
    origin = 'personal' and owner_id = (select auth.uid())
    and exists (select 1 from public.perfis p where p.user_id = (select auth.uid()) and p.role = 'user' and p.status = 'ativo')
  );
alter policy "Profissionais criam exercicios pessoais" on public.exercise_library
  with check (
    origin = 'personal' and owner_id = (select auth.uid()) and status = 'active'
    and exists (select 1 from public.perfis p where p.user_id = (select auth.uid()) and p.role = 'user' and p.status = 'ativo')
  );
alter policy "Profissionais leem biblioteca oficial e propria" on public.exercise_library
  using (
    (origin = 'official' and status = 'active')
    or owner_id = (select auth.uid())
    or public.exercise_is_prescribed_to_current_student(id)
  );

alter policy "Usuarios podem atualizar seus pagamentos" on public.pagamentos
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = (select auth.uid())));
alter policy "Usuarios podem cadastrar seus pagamentos" on public.pagamentos
  with check ((select auth.uid()) = user_id and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = (select auth.uid())));
alter policy "Usuarios podem excluir seus pagamentos" on public.pagamentos
  using ((select auth.uid()) = user_id);
alter policy "Usuarios podem listar seus pagamentos" on public.pagamentos
  using ((select auth.uid()) = user_id and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = (select auth.uid())));

alter policy "Usuarios podem criar seu perfil padrao" on public.perfis
  with check ((select auth.uid()) = user_id and role = 'user' and tipo_acesso = 'pendente' and status = 'ativo');
alter policy "Usuarios podem listar seu perfil" on public.perfis
  using ((select auth.uid()) = user_id);

alter policy "Usuarios podem atualizar seus planos" on public.planos
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
alter policy "Usuarios podem cadastrar seus planos" on public.planos
  with check ((select auth.uid()) = user_id);
alter policy "Usuarios podem excluir seus planos" on public.planos
  using ((select auth.uid()) = user_id);
alter policy "Usuarios podem listar seus planos" on public.planos
  using ((select auth.uid()) = user_id);

-- Smart management helpers remain unchanged; only the constant identity lookup is cached.
alter policy "Profissionais gerenciam seus locais inteligentes" on public.smart_management_locations
  using (professional_id = (select auth.uid()) and public.smart_management_current_user_is_professional())
  with check (professional_id = (select auth.uid()) and public.smart_management_current_user_is_professional());
alter policy "Profissionais gerenciam seus servicos inteligentes" on public.smart_management_services
  using (professional_id = (select auth.uid()) and public.smart_management_current_user_is_professional())
  with check (professional_id = (select auth.uid()) and public.smart_management_current_user_is_professional());
alter policy "Profissionais gerenciam suas regras inteligentes" on public.smart_management_transfer_rules
  using (professional_id = (select auth.uid()) and public.smart_management_current_user_is_professional())
  with check (professional_id = (select auth.uid()) and public.smart_management_current_user_is_professional());
alter policy "Profissionais gerenciam suas faixas inteligentes" on public.smart_management_transfer_tiers
  using (professional_id = (select auth.uid()) and public.smart_management_current_user_is_professional())
  with check (professional_id = (select auth.uid()) and public.smart_management_current_user_is_professional());

alter policy "Usuarios podem atualizar dias dos seus treinos" on public.treino_dias
  using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = (select auth.uid())))
  with check (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = (select auth.uid())));
alter policy "Usuarios podem cadastrar dias dos seus treinos" on public.treino_dias
  with check (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = (select auth.uid())));
alter policy "Usuarios podem excluir dias dos seus treinos" on public.treino_dias
  using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = (select auth.uid())));
alter policy "Usuarios podem listar dias dos seus treinos" on public.treino_dias
  using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = (select auth.uid())));

alter policy "Usuarios podem listar eventos dos seus treinos" on public.treino_eventos
  using ((select auth.uid()) = user_id and exists (select 1 from public.treinos where treinos.id = treino_eventos.treino_id and treinos.user_id = (select auth.uid())));

alter policy "Usuarios podem atualizar exercicios dos seus treinos" on public.treino_exercicios
  using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = (select auth.uid())))
  with check (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = (select auth.uid())));
alter policy "Usuarios podem cadastrar exercicios dos seus treinos" on public.treino_exercicios
  with check (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = (select auth.uid())));
alter policy "Usuarios podem excluir exercicios dos seus treinos" on public.treino_exercicios
  using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = (select auth.uid())));
alter policy "Usuarios podem listar exercicios dos seus treinos" on public.treino_exercicios
  using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = (select auth.uid())));

alter policy "Usuarios podem atualizar seus treinos" on public.treinos
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id and exists (select 1 from public.alunos where alunos.id = treinos.aluno_id and alunos.user_id = (select auth.uid())));
alter policy "Usuarios podem cadastrar seus treinos" on public.treinos
  with check ((select auth.uid()) = user_id and exists (select 1 from public.alunos where alunos.id = treinos.aluno_id and alunos.user_id = (select auth.uid())));
alter policy "Usuarios podem excluir seus treinos" on public.treinos
  using ((select auth.uid()) = user_id);
alter policy "Usuarios podem listar seus treinos" on public.treinos
  using ((select auth.uid()) = user_id);

alter policy "Usuarios podem atualizar seus modelos de treino" on public.workout_templates
  using ((select auth.uid()) = owner_id and is_system = false)
  with check ((select auth.uid()) = owner_id and is_system = false);
alter policy "Usuarios podem cadastrar seus modelos de treino" on public.workout_templates
  with check ((select auth.uid()) = owner_id and is_system = false);
alter policy "Usuarios podem excluir seus modelos de treino" on public.workout_templates
  using ((select auth.uid()) = owner_id and is_system = false);
alter policy "Usuarios podem listar seus modelos de treino" on public.workout_templates
  using ((select auth.uid()) = owner_id and is_active = true and is_system = false);

-- Postconditions: exact allowlist, semantic normalization only, and no metadata drift.
do $$
declare
  v_problem text;
  v_changed_count integer;
  v_direct_count integer;
begin
  select string_agg(format('%I.%I', before.tablename, before.policyname), ', ' order by before.tablename, before.policyname)
  into v_problem
  from cycle_12_13_policy_snapshot before
  join pg_policies after
    on after.schemaname = 'public'
   and after.tablename = before.tablename
   and after.policyname = before.policyname
  left join cycle_12_13_expected_policies e
    on e.table_name = before.tablename
   and e.policy_name = before.policyname
  where e.policy_name is null
    and (before.permissive, before.roles, before.cmd, before.qual, before.with_check)
        is distinct from
        (after.permissive, after.roles::text, after.cmd, after.qual, after.with_check);

  if v_problem is not null then
    raise exception 'CYCLE_12_13_POSTCONDITION: unexpected policy drift: %', v_problem;
  end if;

  select count(*) into v_changed_count
  from cycle_12_13_policy_snapshot before
  join pg_policies after
    on after.schemaname = 'public'
   and after.tablename = before.tablename
   and after.policyname = before.policyname
  where (before.qual, before.with_check) is distinct from (after.qual, after.with_check);

  if v_changed_count <> 62 then
    raise exception 'CYCLE_12_13_POSTCONDITION: expected exactly 62 changed policies, found %', v_changed_count;
  end if;

  select string_agg(format('%I.%I', e.table_name, e.policy_name), ', ' order by e.table_name, e.policy_name)
  into v_problem
  from cycle_12_13_expected_policies e
  join cycle_12_13_policy_snapshot before
    on before.tablename = e.table_name and before.policyname = e.policy_name
  join pg_policies after
    on after.schemaname = 'public' and after.tablename = e.table_name and after.policyname = e.policy_name
  where before.permissive <> after.permissive
     or before.roles <> after.roles::text
     or before.cmd <> after.cmd
     or replace(after.qual, '( SELECT auth.uid() AS uid)', 'auth.uid()') is distinct from before.qual
     or replace(after.with_check, '( SELECT auth.uid() AS uid)', 'auth.uid()') is distinct from before.with_check;

  if v_problem is not null then
    raise exception 'CYCLE_12_13_POSTCONDITION: authorization semantics drift: %', v_problem;
  end if;

  select count(*) into v_direct_count
  from pg_policies p
  where p.schemaname = 'public'
    and (
      (coalesce(p.qual, '') like '%auth.uid()%' and coalesce(p.qual, '') not like '%SELECT auth.uid()%')
      or
      (coalesce(p.with_check, '') like '%auth.uid()%' and coalesce(p.with_check, '') not like '%SELECT auth.uid()%')
    );

  if v_direct_count <> 0 then
    raise exception 'CYCLE_12_13_POSTCONDITION: expected zero public direct-auth policies, found %', v_direct_count;
  end if;

  select string_agg(s.signature, ', ' order by s.signature)
  into v_problem
  from cycle_12_13_function_snapshot s
  join pg_proc p on p.oid = s.oid
  where (s.proowner, s.prosecdef, s.proconfig, s.proacl)
        is distinct from
        (p.proowner, p.prosecdef, p.proconfig, p.proacl);

  if v_problem is not null then
    raise exception 'CYCLE_12_13_POSTCONDITION: function owner/security/search_path/ACL drift: %', v_problem;
  end if;
end;
$$;

commit;
