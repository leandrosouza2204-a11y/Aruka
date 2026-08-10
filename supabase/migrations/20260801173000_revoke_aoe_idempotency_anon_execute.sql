-- Phase 3.2 Group E: remove excessive anon EXECUTE from AOE idempotency RPC.
-- The function body is intentionally unchanged in this migration.

revoke execute on function public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) from anon;
