-- MANUAL_FIRST_CUTOVER_ONLY
-- STEP 05 AOE SECURITY
-- DO NOT RUN WITHOUT APPROVED PRECHECKS
-- NOT A MIGRATION FILE
-- PRODUCTION_EXECUTION_AUTHORIZED=NO
-- DB_PUSH_ALLOWED_NOW=NO
-- HISTORY_ALIGNMENT_ALLOWED_NOW=NO
-- Phase 3.2 Group E: remove excessive anon EXECUTE from AOE idempotency RPC.
-- The function body is intentionally unchanged in this migration.

revoke execute on function public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) from anon;
