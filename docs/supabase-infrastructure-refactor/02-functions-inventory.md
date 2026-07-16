# Inventario de Funcoes SQL

Fonte: `supabase/admin_rpc.sql`, `supabase/admin_logs.sql`, `supabase/migrations/*.sql`.

| Funcao | Parametros | Retorno | SECURITY DEFINER | Dependencias principais |
| --- | --- | --- | --- | --- |
| `public.admin_eh_admin` | nenhum | `boolean` | Sim | `public.perfis`, `auth.uid()` |
| `public.admin_validar_acesso` | nenhum | `void` | Sim | `public.admin_eh_admin()` |
| `public.admin_listar_usuarios` | nenhum | table de usuarios/perfis/assinatura | Sim | `auth.users`, `public.perfis`, `public.assinaturas`, `public.admin_validar_acesso()` |
| `public.admin_atualizar_perfil` | `p_user_id uuid`, `p_nome text`, `p_role text`, `p_tipo_acesso text`, `p_status text`, `p_user_agent text default null` | `void` | Sim | `auth.users`, `public.perfis`, `public.admin_validar_acesso()`, `public.admin_registrar_log()` |
| `public.admin_upsert_assinatura` | `p_user_id uuid`, `p_plano text`, `p_status text`, `p_data_inicio date`, `p_data_vencimento date`, `p_user_agent text default null` | `void` | Sim | `auth.users`, `public.assinaturas`, `public.admin_validar_acesso()`, `public.admin_registrar_log()` |
| `public.admin_bloquear_usuario` | `p_user_id uuid`, `p_user_agent text default null` | `void` | Sim | `auth.users`, `public.perfis`, `public.admin_validar_acesso()`, `public.admin_registrar_log()` |
| `public.admin_liberar_beta` | `p_user_id uuid`, `p_user_agent text default null` | `void` | Sim | `auth.users`, `public.perfis`, `public.admin_validar_acesso()`, `public.admin_registrar_log()` |
| `public.admin_liberar_assinante` | `p_user_id uuid`, `p_plano text`, `p_data_inicio date`, `p_data_vencimento date`, `p_user_agent text default null` | `void` | Sim | `auth.users`, `public.perfis`, `public.assinaturas`, `public.admin_atualizar_perfil()`, `public.admin_upsert_assinatura()`, `public.admin_registrar_log()` |
| `public.admin_registrar_log` | `p_target_user_id uuid`, `p_acao text`, `p_entidade text default null`, `p_entidade_id uuid default null`, `p_dados_anteriores jsonb default null`, `p_dados_novos jsonb default null`, `p_user_agent text default null` | `uuid` | Sim | `public.perfis`, `public.admin_logs`, `auth.uid()` |
| `public.admin_listar_logs` | `p_acao text default null`, `p_target_user_id uuid default null`, `p_data_inicio date default null`, `p_data_fim date default null`, `p_busca text default null` | table de logs | Sim | `public.admin_logs`, `auth.users`, `public.perfis` |
| `public.processar_encerramento_automatico_aluno` | `p_user_id uuid`, `p_aluno_id uuid`, `p_vencimento date`, `p_ocorrido_em date`, `p_event_key text`, `p_plano_id uuid default null`, `p_plano_nome text default ''`, `p_dias_apos_vencimento integer default 0`, `p_status_anterior text default ''` | `jsonb` | Sim | `public.alunos`, `public.acompanhamento_eventos` |
| `public.set_workout_templates_updated_at` | trigger context | `trigger` | Nao declarado | `public.workout_templates` trigger |
| `public.aoe_user_owns_student` | `p_student_id uuid` | `boolean` | Sim | `public.alunos`, `auth.uid()` |
| `public.aoe_idempotency_get_or_create` | `p_id text`, `p_actor_id uuid`, `p_organization_id uuid`, `p_operation text`, `p_idempotency_key text`, `p_request_fingerprint text` | `jsonb` | Sim | `public.aoe_idempotency_keys`, unique/PK de idempotencia |

## Grants Observados

- Funcoes admin e AOE revogam `public` e concedem `execute` para `authenticated`, exceto `processar_encerramento_automatico_aluno`, concedida apenas a `service_role`.
- Funcoes `SECURITY DEFINER` usam `set search_path` na maioria dos casos. `set_workout_templates_updated_at` nao declara `security definer` nem `set search_path`.

## Dependencias de Aplicacao

- `src/services/adminService.js`: RPCs admin.
- `src/services/adminLogsService.js`: `admin_listar_logs`.
- Edge Function `processar-encerramentos-automaticos`: RPC `processar_encerramento_automatico_aluno`.
- Infra AOE: Edge Function `aoe` persiste em tabelas AOE; a funcao SQL de idempotencia existe para suporte transacional.
