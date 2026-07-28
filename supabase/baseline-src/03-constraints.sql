alter table only public.perfis add constraint perfis_pkey primary key (id);
alter table only public.perfis add constraint perfis_user_id_key unique (user_id);
alter table only public.perfis add constraint perfis_role_check check (role in ('admin', 'user'));
alter table only public.perfis add constraint perfis_tipo_acesso_check check (tipo_acesso in ('admin', 'beta', 'assinante', 'pendente', 'bloqueado'));
alter table only public.perfis add constraint perfis_status_check check (status in ('ativo', 'inativo'));
alter table only public.perfis add constraint perfis_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table only public.alunos add constraint alunos_pkey primary key (id);
alter table only public.alunos add constraint alunos_acompanhamento_status_check check (acompanhamento_status in ('ativo', 'encerrado', 'nao_renovado', 'cancelado'));
alter table only public.alunos add constraint alunos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table only public.planos add constraint planos_pkey primary key (id);
alter table only public.planos add constraint planos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table only public.assinaturas add constraint assinaturas_pkey primary key (id);
alter table only public.assinaturas add constraint assinaturas_status_check check (status in ('pendente', 'ativo', 'vencido', 'cancelado', 'teste'));
alter table only public.assinaturas add constraint assinaturas_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table only public.pagamentos add constraint pagamentos_pkey primary key (id);
alter table only public.pagamentos add constraint pagamentos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.pagamentos add constraint pagamentos_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete cascade;

alter table only public.admin_logs add constraint admin_logs_pkey primary key (id);
alter table only public.admin_logs add constraint admin_logs_admin_user_id_fkey foreign key (admin_user_id) references auth.users(id);
alter table only public.admin_logs add constraint admin_logs_target_user_id_fkey foreign key (target_user_id) references auth.users(id);

alter table only public.aceites_legais add constraint aceites_legais_pkey primary key (id);
alter table only public.aceites_legais add constraint aceites_legais_versao_unica unique (user_id, politica_versao, termos_versao);
alter table only public.aceites_legais add constraint aceites_legais_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;

alter table only public.avaliacoes add constraint avaliacoes_pkey primary key (id);
alter table only public.avaliacoes add constraint avaliacoes_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.avaliacoes add constraint avaliacoes_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete cascade;

alter table only public.anamneses add constraint anamneses_pkey primary key (id);
alter table only public.anamneses add constraint anamneses_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.anamneses add constraint anamneses_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete cascade;

alter table only public.treinos add constraint treinos_pkey primary key (id);
alter table only public.treinos add constraint treinos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.treinos add constraint treinos_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete cascade;
alter table only public.treinos add constraint treinos_lifecycle_status_check check (lifecycle_status in ('draft', 'active', 'completed', 'archived'));
alter table only public.treinos add constraint treinos_template_origin_type_check check (template_origin_type is null or template_origin_type in ('official', 'personal'));
alter table only public.treinos add constraint treinos_template_origin_snapshot_object_check check (template_origin_snapshot is null or jsonb_typeof(template_origin_snapshot) = 'object');
alter table only public.treinos add constraint treinos_lifecycle_dates_check check (
  (lifecycle_status <> 'active' or delivered_at is not null)
  and (lifecycle_status <> 'completed' or completed_at is not null)
  and (lifecycle_status <> 'archived' or archived_at is not null)
);

alter table only public.treino_dias add constraint treino_dias_pkey primary key (id);
alter table only public.treino_dias add constraint treino_dias_treino_id_fkey foreign key (treino_id) references public.treinos(id) on delete cascade;

alter table only public.treino_exercicios add constraint treino_exercicios_pkey primary key (id);
alter table only public.treino_exercicios add constraint treino_exercicios_treino_dia_id_fkey foreign key (treino_dia_id) references public.treino_dias(id) on delete cascade;

alter table only public.treino_eventos add constraint treino_eventos_pkey primary key (id);
alter table only public.treino_eventos add constraint treino_eventos_treino_id_fkey foreign key (treino_id) references public.treinos(id) on delete cascade;
alter table only public.treino_eventos add constraint treino_eventos_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete restrict;
alter table only public.treino_eventos add constraint treino_eventos_event_type_check check (event_type in ('applied', 'delivered', 'status_changed', 'completed', 'archived'));
alter table only public.treino_eventos add constraint treino_eventos_metadata_object_check check (metadata is null or jsonb_typeof(metadata) = 'object');

alter table only public.acompanhamento_eventos add constraint acompanhamento_eventos_pkey primary key (id);
alter table only public.acompanhamento_eventos add constraint acompanhamento_eventos_tipo_check check (tipo in ('acompanhamento_iniciado', 'acompanhamento_encerrado', 'acompanhamento_reativado', 'plano_renovado'));
alter table only public.acompanhamento_eventos add constraint acompanhamento_eventos_user_id_fkey foreign key (user_id) references auth.users(id) on delete cascade;
alter table only public.acompanhamento_eventos add constraint acompanhamento_eventos_aluno_id_fkey foreign key (aluno_id) references public.alunos(id) on delete restrict;
alter table only public.acompanhamento_eventos add constraint acompanhamento_eventos_plano_id_fkey foreign key (plano_id) references public.planos(id) on delete set null;

alter table only public.workout_templates add constraint workout_templates_pkey primary key (id);
alter table only public.workout_templates add constraint workout_templates_owner_id_fkey foreign key (owner_id) references auth.users(id) on delete cascade;
alter table only public.workout_templates add constraint workout_templates_name_required check (length(btrim(name)) > 0);
alter table only public.workout_templates add constraint workout_templates_personal_only check (is_system = false);
alter table only public.workout_templates add constraint workout_templates_gender_check check (reference_gender in ('Masculino', 'Feminino', 'Unissex'));
alter table only public.workout_templates add constraint workout_templates_split_check check (split_type in ('ABC', 'ABCD', 'ABCDE', 'Full Body', 'Upper/Lower', 'Outro'));
alter table only public.workout_templates add constraint workout_templates_template_data_object check (jsonb_typeof(template_data) = 'object');

alter table only public.aoe_decisions add constraint aoe_decisions_pkey primary key (id);
alter table only public.aoe_decisions add constraint aoe_decisions_actor_id_fkey foreign key (actor_id) references auth.users(id) on delete restrict;
alter table only public.aoe_decisions add constraint aoe_decisions_student_id_fkey foreign key (student_id) references public.alunos(id) on delete restrict;

alter table only public.aoe_decision_traces add constraint aoe_decision_traces_pkey primary key (id);
alter table only public.aoe_decision_traces add constraint aoe_decision_traces_decision_id_fkey foreign key (decision_id) references public.aoe_decisions(id) on delete cascade;

alter table only public.aoe_human_reviews add constraint aoe_human_reviews_pkey primary key (id);
alter table only public.aoe_human_reviews add constraint aoe_human_reviews_decision_id_fkey foreign key (decision_id) references public.aoe_decisions(id) on delete cascade;
alter table only public.aoe_human_reviews add constraint aoe_human_reviews_reviewer_id_fkey foreign key (reviewer_id) references auth.users(id) on delete restrict;
alter table only public.aoe_human_reviews add constraint aoe_human_reviews_notes_length check (char_length(notes) <= 500);

alter table only public.aoe_idempotency_keys add constraint aoe_idempotency_keys_pkey primary key (id);
alter table only public.aoe_idempotency_keys add constraint aoe_idempotency_keys_actor_id_fkey foreign key (actor_id) references auth.users(id) on delete restrict;
alter table only public.aoe_idempotency_keys add constraint aoe_idempotency_keys_decision_id_fkey foreign key (decision_id) references public.aoe_decisions(id) on delete set null;

alter table only public.aoe_audit_events add constraint aoe_audit_events_pkey primary key (id);
