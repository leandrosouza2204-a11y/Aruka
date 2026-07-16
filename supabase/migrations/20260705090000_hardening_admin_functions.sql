------------------------------------------------------------------
-- CoachFlow Database Migration
--
-- Migration:
-- 20260705_hardening_admin_functions
--
-- Objetivo:
-- Reduzir superficie de execucao das funcoes administrativas
-- SECURITY DEFINER expostas via RPC.
--
-- Aplicacao:
-- Revisar e executar manualmente no Supabase SQL Editor.
--
-- Compatibilidade:
-- Idempotente (REVOKE/GRANT podem ser reaplicados)
------------------------------------------------------------------

-- ============================================================
-- 1. Revogar acesso publico/anonimo de todas as funcoes admin
-- ============================================================

revoke execute on function public.admin_atualizar_perfil(uuid, text, text, text, text) from public, anon;
revoke execute on function public.admin_atualizar_perfil(uuid, text, text, text, text, text) from public, anon;

revoke execute on function public.admin_bloquear_usuario(uuid) from public, anon;
revoke execute on function public.admin_bloquear_usuario(uuid, text) from public, anon;

revoke execute on function public.admin_eh_admin() from public, anon;

revoke execute on function public.admin_liberar_assinante(uuid, text, date, date) from public, anon;
revoke execute on function public.admin_liberar_assinante(uuid, text, date, date, text) from public, anon;

revoke execute on function public.admin_liberar_beta(uuid) from public, anon;
revoke execute on function public.admin_liberar_beta(uuid, text) from public, anon;

revoke execute on function public.admin_listar_logs(text, uuid, date, date, text) from public, anon;
revoke execute on function public.admin_listar_usuarios() from public, anon;

revoke execute on function public.admin_registrar_log(uuid, text, text, uuid, jsonb, jsonb, text) from public, anon;

revoke execute on function public.admin_upsert_assinatura(uuid, text, text, date, date) from public, anon;
revoke execute on function public.admin_upsert_assinatura(uuid, text, text, date, date, text) from public, anon;

revoke execute on function public.admin_validar_acesso() from public, anon;

-- ============================================================
-- 2. Revogar authenticated de helpers internos e overloads legados
-- ============================================================
-- Helpers internos nao sao chamados diretamente pelo frontend.
-- Overloads sem p_user_agent foram mantidos apenas por compatibilidade
-- historica; o frontend atual chama as versoes com p_user_agent.

revoke execute on function public.admin_eh_admin() from authenticated;
revoke execute on function public.admin_validar_acesso() from authenticated;
revoke execute on function public.admin_registrar_log(uuid, text, text, uuid, jsonb, jsonb, text) from authenticated;

revoke execute on function public.admin_atualizar_perfil(uuid, text, text, text, text) from authenticated;
revoke execute on function public.admin_bloquear_usuario(uuid) from authenticated;
revoke execute on function public.admin_liberar_assinante(uuid, text, date, date) from authenticated;
revoke execute on function public.admin_liberar_beta(uuid) from authenticated;
revoke execute on function public.admin_upsert_assinatura(uuid, text, text, date, date) from authenticated;

-- ============================================================
-- 3. Manter authenticated apenas nas RPCs usadas pelo painel admin
-- ============================================================
-- Todas estas funcoes validam admin internamente antes de retornar dados
-- ou alterar registros. O acesso direto por authenticated e necessario
-- para chamadas via supabase.rpc no frontend logado.

grant execute on function public.admin_listar_usuarios() to authenticated;
grant execute on function public.admin_listar_logs(text, uuid, date, date, text) to authenticated;
grant execute on function public.admin_atualizar_perfil(uuid, text, text, text, text, text) to authenticated;
grant execute on function public.admin_upsert_assinatura(uuid, text, text, date, date, text) to authenticated;
grant execute on function public.admin_bloquear_usuario(uuid, text) to authenticated;
grant execute on function public.admin_liberar_beta(uuid, text) to authenticated;
grant execute on function public.admin_liberar_assinante(uuid, text, date, date, text) to authenticated;
