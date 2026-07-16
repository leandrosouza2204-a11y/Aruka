# Inventario de Edge Functions

Fonte: `supabase/functions/**`.

## `transfer-user-access`

- Arquivo: `supabase/functions/transfer-user-access/index.ts`
- Endpoint: Edge Function Supabase homonima, metodo inferido pelo handler `Deno.serve`.
- Secrets/env: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Headers usados: `Authorization`, `User-Agent`.
- Tabelas: `perfis`, `admin_logs`.
- Dependencias externas: `@supabase/supabase-js`.
- Objetivo inferido: transferir/liberar acesso de usuario com validacao por token e registro de log administrativo.
- Risco: usa `service_role`; depende de validacao correta do usuario autenticado e do perfil admin.

## `processar-encerramentos-automaticos`

- Arquivo: `supabase/functions/processar-encerramentos-automaticos/index.ts`
- Endpoint: Edge Function Supabase homonima.
- Secrets/env: `ENCERRAMENTOS_AUTOMATICOS_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.
- Headers usados: `x-job-secret`.
- Tabelas: `alunos`, `planos`, `acompanhamento_eventos`.
- RPC: `public.processar_encerramento_automatico_aluno`.
- Dependencias externas: `@supabase/supabase-js`.
- Objetivo inferido: job protegido por segredo para encerrar acompanhamento automaticamente apos vencimento.
- Risco: execucao com `service_role`; segredo do job e idempotencia por `event_key` sao controles criticos.

## `aoe`

- Arquivo: `supabase/functions/aoe/index.ts`
- Endpoint: Edge Function Supabase homonima; acao por query string `action` ou inferencia por metodo/path.
- Secrets/env: `AOE_CORS_ORIGIN`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AOE_ENABLED`, `AOE_PILOT_ENABLED` e listas lidas via helper `getCsvEnv`.
- Headers usados: `Authorization`.
- Tabelas: `perfis`, `aoe_decisions`, `aoe_audit_events`.
- Dependencias internas: bundle AOE em `src/aoe/**` e catalogo gerado `generated/apl-catalog.generated.ts`.
- Dependencias externas: `@supabase/supabase-js`.
- Objetivo inferido: expor API AOE para decisao/review/consulta com feature flags de piloto.
- Risco: mistura cliente anon para identidade e service role para persistencia; flags e allowlists precisam estar alinhadas por ambiente.

## Lacunas

- Nao ha inventario de secrets reais por ambiente neste ciclo, apenas nomes lidos no codigo.
- Nao foi executado deploy/list de Edge Functions no projeto Supabase ativo.
