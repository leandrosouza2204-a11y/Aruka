# Stage 11.2 Closeout - Locais & Repasses

Decision: `COMPLETE`

Cycle: `11 - Gestao Inteligente`

Stage: `11.2 - Locais & Repasses`

Supabase: `ALIGNED`

Production action required: `NO`

## Delivered

- Location CRUD with archive and reactivate behavior.
- Transfer rules for `none`, `fixed`, `per_student`, `tiered`, and `percentage`.
- Atomic, ownership-scoped RPC with RLS runtime coverage.
- UTF-8 visible-copy and responsive validation.
- Remote migration `20260908120000_smart_management_locations_transfers.sql` applied to the canonical `aruka` project.

## Local Tooling Incident

Status: `RESOLVED`

Root cause: `ROOT_CAUSE_WINDOWS_CMD_NPX_PROCESS_LIFECYCLE`

Fix: the Windows command wrapper invokes `call npx.cmd` so the harness waits for the Supabase CLI lifecycle. Readiness probes are platform-aware for Windows and Linux CI.

## Next Stage

Stage 11.3 remains scoped by the canonical roadmap as `Servicos & Precificacao` and is `READY_FOR_START`.
