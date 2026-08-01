with target_functions(function_name, identity_arguments) as (
  values
    ('admin_atualizar_perfil', 'p_user_id uuid, p_nome text, p_role text, p_tipo_acesso text, p_status text'),
    ('admin_bloquear_usuario', 'p_user_id uuid'),
    ('admin_liberar_assinante', 'p_user_id uuid, p_plano text, p_data_inicio date, p_data_vencimento date'),
    ('admin_liberar_beta', 'p_user_id uuid'),
    ('admin_upsert_assinatura', 'p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date'),
    ('admin_listar_logs', 'p_acao text, p_target_user_id uuid, p_data_inicio date, p_data_fim date, p_busca text'),
    ('admin_listar_usuarios', ''),
    ('admin_registrar_log', 'p_target_user_id uuid, p_acao text, p_entidade text, p_entidade_id uuid, p_dados_anteriores jsonb, p_dados_novos jsonb, p_user_agent text'),
    ('admin_upsert_assinatura', 'p_user_id uuid, p_plano text, p_status text, p_data_inicio date, p_data_vencimento date, p_user_agent text'),
    ('aoe_idempotency_get_or_create', 'p_id text, p_actor_id uuid, p_organization_id uuid, p_operation text, p_idempotency_key text, p_request_fingerprint text')
)
select
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as identity_arguments,
  pg_get_function_result(p.oid) as return_type,
  p.prosecdef as security_definer,
  case p.provolatile when 'i' then 'IMMUTABLE' when 's' then 'STABLE' else 'VOLATILE' end as volatility,
  p.proconfig as config,
  pg_get_functiondef(p.oid) as full_definition,
  p.proacl as acl
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
join target_functions tf
  on tf.function_name = p.proname
 and tf.identity_arguments = pg_get_function_identity_arguments(p.oid)
where n.nspname = 'public'
order by p.proname, pg_get_function_identity_arguments(p.oid);
