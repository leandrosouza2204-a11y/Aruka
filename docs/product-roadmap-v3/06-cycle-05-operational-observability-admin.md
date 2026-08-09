# Roadmap v3 Cycle 05 - Operational Observability and Admin Tooling

Decision: `READY_FOR_ROADMAP_V3_CYCLE_06`

Scope: local authenticated admin tooling in `/admin/usuarios` and `/admin/logs`. No production access, no database change, no CI change and no external telemetry.

## Admin Inventory

| Route | Component | Permission guard | Data source | Actions | Filters | States |
| --- | --- | --- | --- | --- | --- | --- |
| `/admin/usuarios` | `AdminUsuarios` | `ProtectedRoute`, `SubscriptionRoute`, `LegalRoute`, `AdminRoute` | `admin_listar_usuarios` RPC | edit, beta, assinante, admin, bloquear, reativar, cancelar assinatura, transferir acesso | busca, acesso/status | loading, empty, error |
| `/admin/logs` | `AdminLogs` | `ProtectedRoute`, `SubscriptionRoute`, `LegalRoute`, `AdminRoute` | `admin_listar_logs` RPC | view details, refresh, filter | ação, usuário alvo, data, busca | loading, empty, error |
| Admin navigation | `Sidebar`, `MobileBottomNavigation` | profile role/tipo_acesso visibility | `buscarPerfilUsuario` | links only | n/a | hidden for non-admin |

## Permission Review

Admin access is not only menu hiding. Routes are wrapped by `AdminRoute`, which loads the current profile and requires `role === "admin"` or `tipoAcesso === "admin"`. Admin data and mutations use existing RPCs/Edge Function contracts; this cycle did not alter RBAC, grants, policies or migrations.

## Observability Sources

| Source | Classification | Notes |
| --- | --- | --- |
| Admin logs RPC | `ADMIN_VISIBLE`, `PERSISTED` | Timestamp, action, actor, target, entity and JSON details. |
| Admin user actions | `PERSISTED` through backend admin functions | User agent is passed to existing backend contract. |
| UI errors/toasts | `USER_VISIBLE`, `EPHEMERAL` | Humanized copy; technical details remain out of standard UI. |
| `console.error` | `DEV_ONLY`, `EPHEMERAL` | Used for developer diagnostics, not audit. |
| AOE observability | `DEV/DOMAIN_INTERNAL` | Existing logger/metrics/audit contracts, unchanged. |

## Findings

`OBS-R01` P2 `PRIVACY`: Admin Logs displayed full e-mails, raw user agent and raw JSON details in the admin UI.

Fix: Admin Logs now masks e-mails, summarizes user agent and sanitizes detail JSON for sensitive keys such as password, token, JWT, cookie, authorization and secret.

`OBS-R02` P2 `ACTIONABILITY`: several sensitive admin actions executed without explicit confirmation.

Fix: beta release, subscriber release, admin promotion/removal, reactivation and subscription cancellation now require explicit confirmation. Existing blocking/transfer safeguards were preserved.

## Limits

No new log persistence model was created. No retention policy was introduced without requirements. No external monitoring dependency was added. Pagination/retention remain product decisions for a separate cycle if real volume requires it.

Next action: `START_PERFORMANCE_AND_FINAL_PRODUCT_HARDENING`.
