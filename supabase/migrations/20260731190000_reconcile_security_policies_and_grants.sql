-- Phase 1 - security policies and grants reconciliation.
-- Local-only incremental migration. Do not run against remote production without manual approval.
-- Scope: RLS policies, table grants, function grants and matching revokes only.

begin;

-- P0 policies: remote evidence showed public role where the local contract requires authenticated.
drop policy if exists "Usuarios podem listar seu perfil" on public.perfis;
create policy "Usuarios podem listar seu perfil" on public.perfis for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Usuarios podem criar seu perfil padrao" on public.perfis;
create policy "Usuarios podem criar seu perfil padrao" on public.perfis for insert to authenticated with check (auth.uid() = user_id and role = 'user' and tipo_acesso = 'pendente' and status = 'ativo');

drop policy if exists "Usuarios podem listar seus planos" on public.planos;
create policy "Usuarios podem listar seus planos" on public.planos for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Usuarios podem cadastrar seus planos" on public.planos;
create policy "Usuarios podem cadastrar seus planos" on public.planos for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Usuarios podem atualizar seus planos" on public.planos;
create policy "Usuarios podem atualizar seus planos" on public.planos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Usuarios podem excluir seus planos" on public.planos;
create policy "Usuarios podem excluir seus planos" on public.planos for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Usuarios podem listar suas assinaturas" on public.assinaturas;
create policy "Usuarios podem listar suas assinaturas" on public.assinaturas for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Usuarios podem cadastrar suas assinaturas" on public.assinaturas;
create policy "Usuarios podem cadastrar suas assinaturas" on public.assinaturas for insert to authenticated with check (auth.uid() = user_id and status = 'pendente');

drop policy if exists "Usuarios podem listar seus pagamentos" on public.pagamentos;
create policy "Usuarios podem listar seus pagamentos" on public.pagamentos for select to authenticated using (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = auth.uid())
);
drop policy if exists "Usuarios podem cadastrar seus pagamentos" on public.pagamentos;
create policy "Usuarios podem cadastrar seus pagamentos" on public.pagamentos for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = auth.uid())
);
drop policy if exists "Usuarios podem atualizar seus pagamentos" on public.pagamentos;
create policy "Usuarios podem atualizar seus pagamentos" on public.pagamentos for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = auth.uid())
);
drop policy if exists "Usuarios podem excluir seus pagamentos" on public.pagamentos;
create policy "Usuarios podem excluir seus pagamentos" on public.pagamentos for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Admins podem listar logs administrativos" on public.admin_logs;
create policy "Admins podem listar logs administrativos" on public.admin_logs for select to authenticated using (public.admin_eh_admin());
drop policy if exists "Usuarios comuns nao inserem logs administrativos" on public.admin_logs;
create policy "Usuarios comuns nao inserem logs administrativos" on public.admin_logs for insert to authenticated with check (false);

drop policy if exists "Usuarios podem listar seus aceites legais" on public.aceites_legais;
create policy "Usuarios podem listar seus aceites legais" on public.aceites_legais for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Usuarios podem registrar seus aceites legais" on public.aceites_legais;
create policy "Usuarios podem registrar seus aceites legais" on public.aceites_legais for insert to authenticated with check (auth.uid() = user_id and politica_aceita = true and termos_aceitos = true);

drop policy if exists "Usuarios podem listar suas avaliacoes" on public.avaliacoes;
create policy "Usuarios podem listar suas avaliacoes" on public.avaliacoes for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Usuarios podem cadastrar suas avaliacoes" on public.avaliacoes;
create policy "Usuarios podem cadastrar suas avaliacoes" on public.avaliacoes for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = avaliacoes.aluno_id and alunos.user_id = auth.uid())
);
drop policy if exists "Usuarios podem atualizar suas avaliacoes" on public.avaliacoes;
create policy "Usuarios podem atualizar suas avaliacoes" on public.avaliacoes for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = avaliacoes.aluno_id and alunos.user_id = auth.uid())
);
drop policy if exists "Usuarios podem excluir suas avaliacoes" on public.avaliacoes;
create policy "Usuarios podem excluir suas avaliacoes" on public.avaliacoes for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Usuarios podem listar suas anamneses" on public.anamneses;
create policy "Usuarios podem listar suas anamneses" on public.anamneses for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Usuarios podem cadastrar suas anamneses" on public.anamneses;
create policy "Usuarios podem cadastrar suas anamneses" on public.anamneses for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = anamneses.aluno_id and alunos.user_id = auth.uid())
);
drop policy if exists "Usuarios podem atualizar suas anamneses" on public.anamneses;
create policy "Usuarios podem atualizar suas anamneses" on public.anamneses for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = anamneses.aluno_id and alunos.user_id = auth.uid())
);
drop policy if exists "Usuarios podem excluir suas anamneses" on public.anamneses;
create policy "Usuarios podem excluir suas anamneses" on public.anamneses for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Usuarios podem listar seus treinos" on public.treinos;
create policy "Usuarios podem listar seus treinos" on public.treinos for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Usuarios podem cadastrar seus treinos" on public.treinos;
create policy "Usuarios podem cadastrar seus treinos" on public.treinos for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = treinos.aluno_id and alunos.user_id = auth.uid())
);
drop policy if exists "Usuarios podem atualizar seus treinos" on public.treinos;
create policy "Usuarios podem atualizar seus treinos" on public.treinos for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = treinos.aluno_id and alunos.user_id = auth.uid())
);
drop policy if exists "Usuarios podem excluir seus treinos" on public.treinos;
create policy "Usuarios podem excluir seus treinos" on public.treinos for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Usuarios podem listar dias dos seus treinos" on public.treino_dias;
create policy "Usuarios podem listar dias dos seus treinos" on public.treino_dias for select to authenticated using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));
drop policy if exists "Usuarios podem cadastrar dias dos seus treinos" on public.treino_dias;
create policy "Usuarios podem cadastrar dias dos seus treinos" on public.treino_dias for insert to authenticated with check (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));
drop policy if exists "Usuarios podem atualizar dias dos seus treinos" on public.treino_dias;
create policy "Usuarios podem atualizar dias dos seus treinos" on public.treino_dias for update to authenticated using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid())) with check (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));
drop policy if exists "Usuarios podem excluir dias dos seus treinos" on public.treino_dias;
create policy "Usuarios podem excluir dias dos seus treinos" on public.treino_dias for delete to authenticated using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));

drop policy if exists "Usuarios podem listar exercicios dos seus treinos" on public.treino_exercicios;
create policy "Usuarios podem listar exercicios dos seus treinos" on public.treino_exercicios for select to authenticated using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));
drop policy if exists "Usuarios podem cadastrar exercicios dos seus treinos" on public.treino_exercicios;
create policy "Usuarios podem cadastrar exercicios dos seus treinos" on public.treino_exercicios for insert to authenticated with check (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));
drop policy if exists "Usuarios podem atualizar exercicios dos seus treinos" on public.treino_exercicios;
create policy "Usuarios podem atualizar exercicios dos seus treinos" on public.treino_exercicios for update to authenticated using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid())) with check (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));
drop policy if exists "Usuarios podem excluir exercicios dos seus treinos" on public.treino_exercicios;
create policy "Usuarios podem excluir exercicios dos seus treinos" on public.treino_exercicios for delete to authenticated using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));

drop policy if exists "Usuarios podem listar seus modelos de treino" on public.workout_templates;
create policy "Usuarios podem listar seus modelos de treino" on public.workout_templates for select to authenticated using (auth.uid() = owner_id and is_active = true and is_system = false);
drop policy if exists "Usuarios podem cadastrar seus modelos de treino" on public.workout_templates;
create policy "Usuarios podem cadastrar seus modelos de treino" on public.workout_templates for insert to authenticated with check (auth.uid() = owner_id and is_system = false);
drop policy if exists "Usuarios podem atualizar seus modelos de treino" on public.workout_templates;
create policy "Usuarios podem atualizar seus modelos de treino" on public.workout_templates for update to authenticated using (auth.uid() = owner_id and is_system = false) with check (auth.uid() = owner_id and is_system = false);
drop policy if exists "Usuarios podem excluir seus modelos de treino" on public.workout_templates;
create policy "Usuarios podem excluir seus modelos de treino" on public.workout_templates for delete to authenticated using (auth.uid() = owner_id and is_system = false);

drop policy if exists "Usuarios podem listar decisoes AOE dos seus alunos" on public.aoe_decisions;
create policy "Usuarios podem listar decisoes AOE dos seus alunos" on public.aoe_decisions for select to authenticated using (actor_id = auth.uid() or public.admin_eh_admin() or public.aoe_user_owns_student(student_id));
drop policy if exists "Usuarios podem criar decisoes AOE dos seus alunos" on public.aoe_decisions;
create policy "Usuarios podem criar decisoes AOE dos seus alunos" on public.aoe_decisions for insert to authenticated with check (actor_id = auth.uid() and public.aoe_user_owns_student(student_id));
drop policy if exists "Traces AOE restritos ao profissional autorizado" on public.aoe_decision_traces;
create policy "Traces AOE restritos ao profissional autorizado" on public.aoe_decision_traces for select to authenticated using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and (d.actor_id = auth.uid() or public.admin_eh_admin())));
drop policy if exists "Usuarios podem consultar reviews AOE autorizadas" on public.aoe_human_reviews;
create policy "Usuarios podem consultar reviews AOE autorizadas" on public.aoe_human_reviews for select to authenticated using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and (d.actor_id = auth.uid() or public.admin_eh_admin())));
drop policy if exists "Usuarios podem criar reviews AOE autorizadas" on public.aoe_human_reviews;
create policy "Usuarios podem criar reviews AOE autorizadas" on public.aoe_human_reviews for insert to authenticated with check (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid()));
drop policy if exists "Usuarios podem atualizar reviews AOE autorizadas" on public.aoe_human_reviews;
create policy "Usuarios podem atualizar reviews AOE autorizadas" on public.aoe_human_reviews for update to authenticated using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid())) with check (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid()));
drop policy if exists "Idempotencia AOE restrita ao ator" on public.aoe_idempotency_keys;
create policy "Idempotencia AOE restrita ao ator" on public.aoe_idempotency_keys for all to authenticated using (actor_id = auth.uid() or public.admin_eh_admin()) with check (actor_id = auth.uid() or public.admin_eh_admin());
drop policy if exists "Auditoria AOE somente admin leitura" on public.aoe_audit_events;
create policy "Auditoria AOE somente admin leitura" on public.aoe_audit_events for select to authenticated using (public.admin_eh_admin());

-- P0 table grants: remove anon table access; RLS remains enabled and authenticated keeps the canonical grants.
revoke all on table public.aceites_legais from anon;
revoke all on table public.acompanhamento_eventos from anon;
revoke all on table public.admin_logs from anon;
revoke all on table public.alunos from anon;
revoke all on table public.anamneses from anon;
revoke all on table public.aoe_audit_events from anon;
revoke all on table public.aoe_decision_traces from anon;
revoke all on table public.aoe_decisions from anon;
revoke all on table public.aoe_human_reviews from anon;
revoke all on table public.aoe_idempotency_keys from anon;
revoke all on table public.assinaturas from anon;
revoke all on table public.avaliacoes from anon;
revoke all on table public.pagamentos from anon;
revoke all on table public.perfis from anon;
revoke all on table public.planos from anon;
revoke all on table public.treino_dias from anon;
revoke all on table public.treino_exercicios from anon;
revoke all on table public.treinos from anon;
revoke all on table public.workout_templates from anon;

revoke all on table public.perfis from authenticated;
grant select, insert on table public.perfis to authenticated;

revoke all on table public.alunos from authenticated;
grant select, insert, update, delete on table public.alunos to authenticated;

revoke all on table public.planos from authenticated;
grant select, insert, update, delete on table public.planos to authenticated;

revoke all on table public.assinaturas from authenticated;
grant select, insert on table public.assinaturas to authenticated;

revoke all on table public.pagamentos from authenticated;
grant select, insert, update, delete on table public.pagamentos to authenticated;

revoke all on table public.admin_logs from authenticated;
grant select on table public.admin_logs to authenticated;

revoke all on table public.aceites_legais from authenticated;
grant select, insert on table public.aceites_legais to authenticated;

revoke all on table public.avaliacoes from authenticated;
grant select, insert, update, delete on table public.avaliacoes to authenticated;

revoke all on table public.anamneses from authenticated;
grant select, insert, update, delete on table public.anamneses to authenticated;

revoke all on table public.treinos from authenticated;
grant select, insert, update, delete on table public.treinos to authenticated;

revoke all on table public.treino_dias from authenticated;
grant select, insert, update, delete on table public.treino_dias to authenticated;

revoke all on table public.treino_exercicios from authenticated;
grant select, insert, update, delete on table public.treino_exercicios to authenticated;

revoke all on table public.acompanhamento_eventos from authenticated;
grant select, insert on table public.acompanhamento_eventos to authenticated;

revoke all on table public.workout_templates from authenticated;
grant select, insert, update, delete on table public.workout_templates to authenticated;

revoke all on table public.aoe_decisions from authenticated;
grant select, insert on table public.aoe_decisions to authenticated;

revoke all on table public.aoe_decision_traces from authenticated;
grant select on table public.aoe_decision_traces to authenticated;

revoke all on table public.aoe_human_reviews from authenticated;
grant select, insert, update on table public.aoe_human_reviews to authenticated;

revoke all on table public.aoe_idempotency_keys from authenticated;
grant select, insert, update, delete on table public.aoe_idempotency_keys to authenticated;

revoke all on table public.aoe_audit_events from authenticated;
grant select on table public.aoe_audit_events to authenticated;

-- P0 function grants: signatures were confirmed in read-only evidence.
revoke all on function public.salvar_treino_composto(jsonb) from public;
revoke all on function public.salvar_treino_composto(jsonb) from anon;
grant execute on function public.salvar_treino_composto(jsonb) to authenticated;

revoke all on function public.entregar_treino(uuid) from public;
revoke all on function public.entregar_treino(uuid) from anon;
grant execute on function public.entregar_treino(uuid) to authenticated;

revoke all on function public.alterar_estado_treino(uuid, text) from public;
revoke all on function public.alterar_estado_treino(uuid, text) from anon;
grant execute on function public.alterar_estado_treino(uuid, text) to authenticated;

comment on schema public is 'Security reconciliation phase 1 applied locally: policies and grants only. No production action authorized.';

commit;
