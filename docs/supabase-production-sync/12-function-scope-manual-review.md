# Function Scope Manual Review

## Context

Phase 3.1 turns the generic Phase 3 function/RPC decisions into function-by-function product and security decisions. No SQL write, migration, link, push, repair, commit or remote query was executed.

## Overloads

- admin_atualizar_perfil(p_user_id uuid, p_nome text, p_role text, p_tipo_acesso text, p_status text) - DEPRECATE_REMOTE_OVERLOAD_LATER; No current src RPC caller omits p_user_agent, but remote authenticated grant is present and full remote definition must be captured before removal.
- admin_bloquear_usuario(p_user_id uuid) - DEPRECATE_REMOTE_OVERLOAD_LATER; No current src RPC caller omits p_user_agent, but remote authenticated grant is present and full remote definition must be captured before removal.
- admin_liberar_assinante(p_user_id uuid, p_plano text, p_data_inicio date, p_data_vencimento date) - DEPRECATE_REMOTE_OVERLOAD_LATER; No current src RPC caller omits p_user_agent, but remote authenticated grant is present and full remote definition must be captured before removal.
- admin_liberar_beta(p_user_id uuid) - DEPRECATE_REMOTE_OVERLOAD_LATER; No current src RPC caller omits p_user_agent, but remote authenticated grant is present and full remote definition must be captured before removal.
- admin_upsert_assinatura(p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date) - DEPRECATE_REMOTE_OVERLOAD_LATER; No current src RPC caller omits p_user_agent, but remote authenticated grant is present and full remote definition must be captured before removal.

## Admin Body Diffs

- admin_listar_logs(p_acao text, p_target_user_id uuid, p_data_inicio date, p_data_fim date, p_busca text) - EVIDENCE_REQUIRED; Existing artifacts have hashes/config/grants but not full remote pg_get_functiondef body.
- admin_listar_usuarios() - EVIDENCE_REQUIRED; Existing artifacts have hashes/config/grants but not full remote pg_get_functiondef body.
- admin_registrar_log(p_target_user_id uuid, p_acao text, p_entidade text, p_entidade_id uuid, p_dados_anteriores jsonb, p_dados_novos jsonb, p_user_agent text) - EVIDENCE_REQUIRED; Existing artifacts have hashes/config/grants but not full remote pg_get_functiondef body.

## Financial Functions

- admin_liberar_assinante(p_user_id uuid, p_plano text, p_data_inicio date, p_data_vencimento date) - DEPRECATE_REMOTE_OVERLOAD_LATER; No current src RPC caller omits p_user_agent, but remote authenticated grant is present and full remote definition must be captured before removal.
- admin_liberar_beta(p_user_id uuid) - DEPRECATE_REMOTE_OVERLOAD_LATER; No current src RPC caller omits p_user_agent, but remote authenticated grant is present and full remote definition must be captured before removal.
- admin_upsert_assinatura(p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date) - DEPRECATE_REMOTE_OVERLOAD_LATER; No current src RPC caller omits p_user_agent, but remote authenticated grant is present and full remote definition must be captured before removal.
- admin_upsert_assinatura(p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date, p_user_agent text) - EVIDENCE_REQUIRED; Existing artifacts have hashes/config/grants but not full remote pg_get_functiondef body.

## Utility

- set_workout_templates_updated_at() - SECURITY_HARDENING_REQUIRED; Local and remote trigger body are equivalent except local adds SET search_path; security invoker trigger has no dynamic SQL.

## AOE Security

- aoe_idempotency_get_or_create(p_id text, p_actor_id uuid, p_organization_id uuid, p_operation text, p_idempotency_key text, p_request_fingerprint text) - DEFER_TO_AOE_RECONCILIATION; AOE body difference is separate from confirmed anon grant security issue.
- aoe_idempotency_get_or_create(p_id text, p_actor_id uuid, p_organization_id uuid, p_operation text, p_idempotency_key text, p_request_fingerprint text) - AOE_ANON_EXECUTE_EXCESS_CONFIRMED; Remote grant evidence confirms anon.execute and repository callers are authenticated application paths, not anonymous product flows.

## Student Identity

- desvincular_aluno_usuario(p_aluno_id uuid) - DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT; Student identity RPC is intentionally separated from this function review.
- get_my_student_workouts() - DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT; Student identity RPC is intentionally separated from this function review.
- vincular_aluno_usuario(p_aluno_id uuid, p_student_user_id uuid) - DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT; Student identity RPC is intentionally separated from this function review.

## Decisions

- DEPRECATE_REMOTE_OVERLOAD_LATER: 5
- EVIDENCE_REQUIRED: 4
- DEFER_TO_AOE_RECONCILIATION: 1
- DEFER_TO_STUDENT_IDENTITY_DEPLOYMENT: 3
- SECURITY_HARDENING_REQUIRED: 1
- AOE_ANON_EXECUTE_EXCESS_CONFIRMED: 1

## Migration Candidate Groups

- GROUP_A_UTILITY_SECURITY_HARDENING: set_workout_templates_updated_at; tests=set_workout_templates_updated_at trigger regression/static schema check; approval=Engineering/security approval; rollback=Recreate prior function definition without SET search_path if rollback is needed
- GROUP_B_ADMIN_BODY_RECONCILIATION: none; tests=admin list/log RPC tests plus data exposure review; approval=Admin/product/security approval; rollback=Restore captured production definitions
- GROUP_C_ADMIN_LEGACY_OVERLOADS: none; tests=RPC caller absence and external consumer review; approval=Admin/product approval; rollback=Recreate overloads and grants from captured definitions
- GROUP_D_FINANCIAL_FUNCTION_RECONCILIATION: none; tests=financial subscription lifecycle tests; approval=FINANCIAL_OWNER_REVIEW_COMPLETED; rollback=Restore captured production definitions and grants
- GROUP_E_AOE_SECURITY: aoe_idempotency_get_or_create; tests=AOE authenticated/anon boundary tests; approval=AOE/security approval; rollback=Restore previous anon grant if product requires it

## Evidence Gaps

- Full remote pg_get_functiondef output is missing for admin/financial body diffs and remote legacy overloads.
- Financial owner review is required before any financial function replacement/removal.
- AOE body reconciliation remains separate from the anon EXECUTE security issue.

## Next Step

Collect SELECT-only function definitions with `reports/supabase-production-sync/phase31-function-definitions-readonly.sql`, then design one narrow migration group at a time.
