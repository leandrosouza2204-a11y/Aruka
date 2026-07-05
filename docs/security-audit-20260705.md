# Auditoria de Seguranca CoachFlow - 2026-07-05

## Escopo

Auditoria focada nos warnings exportados pelo Supabase Performance/Security Lints, rotas protegidas, RPCs administrativas, Edge Function `transfer-user-access`, RLS, isolamento multi-tenant, XSS basico, uploads e acoes sensiveis.

Nenhum SQL foi executado automaticamente no banco.

## Warnings do Supabase

| Warning | Quantidade | Tratamento |
| --- | ---: | --- |
| `anon_security_definer_function_executable` | 15 | Migration criada para revogar `public/anon` das funcoes administrativas. |
| `authenticated_security_definer_function_executable` | 15 | Migration revoga `authenticated` de helpers internos e overloads legados. RPCs usadas pelo painel admin continuam acessiveis para `authenticated` com validacao interna de admin. |
| `auth_leaked_password_protection` | 1 | Depende de configuracao manual no Supabase Dashboard. |

## Funcoes Administrativas

| Funcao | Usada no frontend? | Chamada por | Valida admin? | Search path | Decisao |
| --- | --- | --- | --- | --- | --- |
| `admin_listar_usuarios()` | Sim | `src/services/adminService.js` | Sim, via `admin_validar_acesso` | Seguro | Manter `authenticated`, revogar `anon`. |
| `admin_atualizar_perfil(..., p_user_agent)` | Sim | `src/services/adminService.js` | Sim | Seguro | Manter `authenticated`, revogar `anon`. |
| `admin_upsert_assinatura(..., p_user_agent)` | Sim | `src/services/adminService.js` | Sim | Seguro | Manter `authenticated`, revogar `anon`. |
| `admin_bloquear_usuario(..., p_user_agent)` | Sim | `src/services/adminService.js` | Sim | Seguro | Manter `authenticated`, revogar `anon`. |
| `admin_liberar_beta(..., p_user_agent)` | Sim | `src/services/adminService.js` | Sim | Seguro | Manter `authenticated`, revogar `anon`. |
| `admin_liberar_assinante(..., p_user_agent)` | Sim | `src/services/adminService.js` | Sim | Seguro | Manter `authenticated`, revogar `anon`. |
| `admin_listar_logs(...)` | Sim | `src/services/adminLogsService.js` | Sim | Seguro | Manter `authenticated`, revogar `anon`. |
| `admin_eh_admin()` | Nao | Helper SQL | Consulta perfil ativo/admin | Seguro | Revogar `anon` e `authenticated`. |
| `admin_validar_acesso()` | Nao | Helper SQL | Sim | Seguro | Revogar `anon` e `authenticated`. |
| `admin_registrar_log(...)` | Nao | Helper SQL | Sim | Seguro | Revogar `anon` e `authenticated`. |
| Overloads sem `p_user_agent` | Nao no frontend atual | Legado | Variavel | Nao reavaliado | Revogar `anon` e `authenticated`. |

## Problemas Criticos

Nenhum problema critico novo foi confirmado no codigo da aplicacao durante esta etapa. Os pontos de banco criticos permanecem como migrations sugeridas, sem aplicacao automatica.

## Problemas Altos

- Funcoes administrativas `SECURITY DEFINER` expostas para `anon`.
  - Risco: chamada anonima via `/rest/v1/rpc/*`.
  - Correcao: `supabase/migrations/20260705_hardening_admin_functions.sql`.

- RPCs administrativas precisam continuar acessiveis a `authenticated`.
  - Risco residual: o Supabase Linter pode manter warning para as RPCs usadas pelo painel.
  - Mitigacao atual: cada funcao valida admin internamente antes de executar.
  - Evolucao futura: mover operacoes admin para Edge Functions ou schema privado com wrappers mais restritos.

## Problemas Medios

- CORS amplo na Edge Function `transfer-user-access`.
  - Risco: origem ampla em producao.
  - Mitigacao atual: exige Authorization/JWT e valida perfil admin.
  - Recomendacao: restringir origem ao dominio oficial em producao.

- Links de video de treino aceitavam qualquer protocolo.
  - Risco: URL `javascript:` em campo livre.
  - Correcao aplicada no frontend: renderizar link apenas para URLs `http` ou `https`.

## Problemas Baixos

- `auth_leaked_password_protection` esta desativado.
  - Correcao: Supabase Dashboard > Authentication > Settings > Password Protection / Leaked Password Protection.
  - Nao e corrigido por codigo neste projeto.

- Nao ha fluxo real de upload/fotos identificado no codigo atual.
  - Recomendacao futura: quando uploads forem implementados, validar MIME, tamanho, extensao, bucket privado e URLs assinadas.

## RLS e Multi-Tenant

- Tabelas principais possuem RLS habilitado nos scripts SQL.
- `pagamentos` ja valida propriedade do `aluno_id` nas policies.
- `treinos`, `avaliacoes` e `anamneses` ja tiveram recomendacao anterior de reforco em `supabase/auditoria_dados_recomendacoes.sql`.
- Admin acessa dados administrativos via RPCs com validacao interna, nao por policies abertas.

## Auth e Rotas Protegidas

- `ProtectedRoute` exige sessao Supabase.
- `SubscriptionRoute` revalida perfil/assinatura via services.
- `AdminRoute` revalida perfil admin via Supabase.
- Assinatura ativa exige status `ativo` e vencimento hoje/futuro.
- Usuario bloqueado/inativo nao recebe acesso liberado.
- Beta e admin seguem as regras atuais do sistema.

## Edge Function

`transfer-user-access`:

- Usa service role apenas server-side.
- Exige Authorization bearer token.
- Valida usuario autenticado.
- Valida perfil admin ativo.
- Valida payload.
- Impede transferencia para e-mail ja existente.
- Atualiza Auth e perfil.
- Registra log administrativo.
- Recomendacao: restringir CORS em producao.

## Migrations Criadas

- `supabase/migrations/20260705_hardening_admin_functions.sql`

## Configuracao Manual Necessaria

Ativar protecao contra senhas vazadas no Supabase:

1. Abrir Supabase Dashboard.
2. Ir para Authentication.
3. Abrir Settings.
4. Localizar Password Protection / Leaked Password Protection.
5. Habilitar verificacao de senhas vazadas.

## Testes Manuais Antes de Producao

- Usuario anonimo nao consegue chamar RPC admin via REST.
- Usuario comum autenticado nao consegue listar usuarios/admin logs.
- Admin consegue listar usuarios.
- Admin consegue listar logs.
- Admin consegue atualizar perfil.
- Admin consegue liberar beta.
- Admin consegue liberar assinante.
- Admin consegue bloquear usuario.
- Admin consegue cancelar/alterar assinatura.
- Transferencia de acesso continua funcionando.
- Usuario bloqueado nao acessa rotas protegidas.
- Assinatura vencida nao acessa rotas protegidas.
- Link de video `https://...` abre normalmente.
- Link de video com `javascript:` nao e renderizado.
