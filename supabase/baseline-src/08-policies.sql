create policy "Usuarios podem listar seu perfil" on public.perfis for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem criar seu perfil padrao" on public.perfis for insert to authenticated with check (auth.uid() = user_id and role = 'user' and tipo_acesso = 'pendente' and status = 'ativo');

create policy "Usuarios podem listar seus alunos" on public.alunos for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar seus alunos" on public.alunos for insert to authenticated with check (auth.uid() = user_id);
create policy "Usuarios podem atualizar seus alunos" on public.alunos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Usuarios podem excluir seus alunos" on public.alunos for delete to authenticated using (auth.uid() = user_id);

create policy "Usuarios podem listar seus planos" on public.planos for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar seus planos" on public.planos for insert to authenticated with check (auth.uid() = user_id);
create policy "Usuarios podem atualizar seus planos" on public.planos for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Usuarios podem excluir seus planos" on public.planos for delete to authenticated using (auth.uid() = user_id);

create policy "Usuarios podem listar suas assinaturas" on public.assinaturas for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar suas assinaturas" on public.assinaturas for insert to authenticated with check (auth.uid() = user_id and status = 'pendente');

create policy "Usuarios podem listar seus pagamentos" on public.pagamentos for select to authenticated using (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem cadastrar seus pagamentos" on public.pagamentos for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem atualizar seus pagamentos" on public.pagamentos for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = pagamentos.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem excluir seus pagamentos" on public.pagamentos for delete to authenticated using (auth.uid() = user_id);

create policy "Admins podem listar logs administrativos" on public.admin_logs for select to authenticated using (public.admin_eh_admin());
create policy "Usuarios comuns nao inserem logs administrativos" on public.admin_logs for insert to authenticated with check (false);

create policy "Usuarios podem listar seus aceites legais" on public.aceites_legais for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem registrar seus aceites legais" on public.aceites_legais for insert to authenticated with check (auth.uid() = user_id and politica_aceita = true and termos_aceitos = true);

create policy "Usuarios podem listar suas avaliacoes" on public.avaliacoes for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar suas avaliacoes" on public.avaliacoes for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = avaliacoes.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem atualizar suas avaliacoes" on public.avaliacoes for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = avaliacoes.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem excluir suas avaliacoes" on public.avaliacoes for delete to authenticated using (auth.uid() = user_id);

create policy "Usuarios podem listar suas anamneses" on public.anamneses for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar suas anamneses" on public.anamneses for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = anamneses.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem atualizar suas anamneses" on public.anamneses for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = anamneses.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem excluir suas anamneses" on public.anamneses for delete to authenticated using (auth.uid() = user_id);

create policy "Usuarios podem listar seus treinos" on public.treinos for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar seus treinos" on public.treinos for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = treinos.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem atualizar seus treinos" on public.treinos for update to authenticated using (auth.uid() = user_id) with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = treinos.aluno_id and alunos.user_id = auth.uid())
);
create policy "Usuarios podem excluir seus treinos" on public.treinos for delete to authenticated using (auth.uid() = user_id);

create policy "Usuarios podem listar dias dos seus treinos" on public.treino_dias for select to authenticated using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem cadastrar dias dos seus treinos" on public.treino_dias for insert to authenticated with check (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem atualizar dias dos seus treinos" on public.treino_dias for update to authenticated using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid())) with check (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem excluir dias dos seus treinos" on public.treino_dias for delete to authenticated using (exists (select 1 from public.treinos where treinos.id = treino_dias.treino_id and treinos.user_id = auth.uid()));

create policy "Usuarios podem listar exercicios dos seus treinos" on public.treino_exercicios for select to authenticated using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem cadastrar exercicios dos seus treinos" on public.treino_exercicios for insert to authenticated with check (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem atualizar exercicios dos seus treinos" on public.treino_exercicios for update to authenticated using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid())) with check (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));
create policy "Usuarios podem excluir exercicios dos seus treinos" on public.treino_exercicios for delete to authenticated using (exists (select 1 from public.treino_dias join public.treinos on treinos.id = treino_dias.treino_id where treino_dias.id = treino_exercicios.treino_dia_id and treinos.user_id = auth.uid()));

create policy "Usuarios podem listar seus eventos de acompanhamento" on public.acompanhamento_eventos for select to authenticated using (auth.uid() = user_id);
create policy "Usuarios podem cadastrar seus eventos de acompanhamento" on public.acompanhamento_eventos for insert to authenticated with check (
  auth.uid() = user_id
  and exists (select 1 from public.alunos where alunos.id = acompanhamento_eventos.aluno_id and alunos.user_id = auth.uid())
  and (acompanhamento_eventos.plano_id is null or exists (select 1 from public.planos where planos.id = acompanhamento_eventos.plano_id and planos.user_id = auth.uid()))
);

create policy "Usuarios podem listar seus modelos de treino" on public.workout_templates for select to authenticated using (auth.uid() = owner_id and is_active = true and is_system = false);
create policy "Usuarios podem cadastrar seus modelos de treino" on public.workout_templates for insert to authenticated with check (auth.uid() = owner_id and is_system = false);
create policy "Usuarios podem atualizar seus modelos de treino" on public.workout_templates for update to authenticated using (auth.uid() = owner_id and is_system = false) with check (auth.uid() = owner_id and is_system = false);
create policy "Usuarios podem excluir seus modelos de treino" on public.workout_templates for delete to authenticated using (auth.uid() = owner_id and is_system = false);

create policy "Usuarios podem listar decisoes AOE dos seus alunos" on public.aoe_decisions for select to authenticated using (actor_id = auth.uid() or public.admin_eh_admin() or public.aoe_user_owns_student(student_id));
create policy "Usuarios podem criar decisoes AOE dos seus alunos" on public.aoe_decisions for insert to authenticated with check (actor_id = auth.uid() and public.aoe_user_owns_student(student_id));
create policy "Traces AOE restritos ao profissional autorizado" on public.aoe_decision_traces for select to authenticated using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and (d.actor_id = auth.uid() or public.admin_eh_admin())));
create policy "Usuarios podem consultar reviews AOE autorizadas" on public.aoe_human_reviews for select to authenticated using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and (d.actor_id = auth.uid() or public.admin_eh_admin())));
create policy "Usuarios podem criar reviews AOE autorizadas" on public.aoe_human_reviews for insert to authenticated with check (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid()));
create policy "Usuarios podem atualizar reviews AOE autorizadas" on public.aoe_human_reviews for update to authenticated using (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid())) with check (exists (select 1 from public.aoe_decisions d where d.id = decision_id and d.actor_id = auth.uid()));
create policy "Idempotencia AOE restrita ao ator" on public.aoe_idempotency_keys for all to authenticated using (actor_id = auth.uid() or public.admin_eh_admin()) with check (actor_id = auth.uid() or public.admin_eh_admin());
create policy "Auditoria AOE somente admin leitura" on public.aoe_audit_events for select to authenticated using (public.admin_eh_admin());
