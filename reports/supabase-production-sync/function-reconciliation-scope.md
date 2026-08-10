# Phase 3 Function Reconciliation Scope

Decision: READY_FOR_PHASE3_FUNCTION_SCOPE_REVIEW

Migration decision: NO_NEW_MIGRATION

Remote link state: UNLINKED_FOR_SAFETY

No function was selected for an automatic Phase 3 migration. The remaining differences are business-logic or ownership-sensitive and require explicit review.

## Scope Summary

- DEFER_TO_AOE_RECONCILIATION: 1
- DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT: 3
- MANUAL_PRODUCT_DECISION_REQUIRED: 5
- MANUAL_SECURITY_AND_BUSINESS_LOGIC_REVIEW_REQUIRED: 5

## Functions Requiring Review

- admin_atualizar_perfil(p_user_id uuid, p_nome text, p_role text, p_tipo_acesso text, p_status text) - REMOTE_OVERLOAD_ONLY - MANUAL_PRODUCT_DECISION_REQUIRED
- admin_bloquear_usuario(p_user_id uuid) - REMOTE_OVERLOAD_ONLY - MANUAL_PRODUCT_DECISION_REQUIRED
- admin_liberar_assinante(p_user_id uuid, p_plano text, p_data_inicio date, p_data_vencimento date) - REMOTE_OVERLOAD_ONLY - MANUAL_PRODUCT_DECISION_REQUIRED
- admin_liberar_beta(p_user_id uuid) - REMOTE_OVERLOAD_ONLY - MANUAL_PRODUCT_DECISION_REQUIRED
- admin_listar_logs(p_acao text, p_target_user_id uuid, p_data_inicio date, p_data_fim date, p_busca text) - BODY_DIFFERENT - MANUAL_SECURITY_AND_BUSINESS_LOGIC_REVIEW_REQUIRED
- admin_listar_usuarios() - BODY_DIFFERENT - MANUAL_SECURITY_AND_BUSINESS_LOGIC_REVIEW_REQUIRED
- admin_registrar_log(p_target_user_id uuid, p_acao text, p_entidade text, p_entidade_id uuid, p_dados_anteriores jsonb, p_dados_novos jsonb, p_user_agent text) - BODY_DIFFERENT - MANUAL_SECURITY_AND_BUSINESS_LOGIC_REVIEW_REQUIRED
- admin_upsert_assinatura(p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date) - REMOTE_OVERLOAD_ONLY - MANUAL_PRODUCT_DECISION_REQUIRED
- admin_upsert_assinatura(p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date, p_user_agent text) - BODY_DIFFERENT - MANUAL_SECURITY_AND_BUSINESS_LOGIC_REVIEW_REQUIRED
- aoe_idempotency_get_or_create(p_id text, p_actor_id uuid, p_organization_id uuid, p_operation text, p_idempotency_key text, p_request_fingerprint text) - BODY_DIFFERENT - DEFER_TO_AOE_RECONCILIATION
- desvincular_aluno_usuario(p_aluno_id uuid) - LOCAL_OVERLOAD_ONLY - DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT
- get_my_student_workouts() - LOCAL_OVERLOAD_ONLY - DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT
- set_workout_templates_updated_at() - BODY_DIFFERENT - MANUAL_SECURITY_AND_BUSINESS_LOGIC_REVIEW_REQUIRED
- vincular_aluno_usuario(p_aluno_id uuid, p_student_user_id uuid) - LOCAL_OVERLOAD_ONLY - DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT

## Phase 3.1 Assisted Manual Review

Decision: `READY_FOR_PHASE31_EVIDENCE_COLLECTION`.

The manual review narrowed future migration candidates to: set_workout_templates_updated_at, aoe_idempotency_get_or_create. Follow-up read-only SQL: `reports/supabase-production-sync/phase31-function-definitions-readonly.sql`.
