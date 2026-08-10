# Step05 AOE Security Precheck

## Objective

Prepare the supervised production precheck for Step05 AOE Security without changing production state.

## Scope

Step05 is limited to function privilege security for one AOE RPC:

- `public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text)`

The only role directly affected by the apply SQL is `anon`.

## Security Operation

The canonical Step05 apply SQL performs:

`REVOKE EXECUTE ON FUNCTION public.aoe_idempotency_get_or_create(text, uuid, uuid, text, text, text) FROM anon`

No function body mutation is expected.

## Static Validation

The Step05 precheck SQL was checked as read-only. No mutating commands were found.

The apply SQL hash was frozen as:

`CEE9E1BFDE421B2C85480C1EB2C0DAFA4FDA994F94832DA777B85508657B8CF4`

Traceability against the approved local migration was confirmed with `UNTRACEABLE_STATEMENT_COUNT=0`.

## Runner

External runner prepared outside Git:

`C:\Backups\Aruka\run-step05-aoe-security-precheck.ps1`

The runner uses Docker image `public.ecr.aws/supabase/postgres:17.6.1.156`, Session Pooler input with a masked credential placeholder, temporary `PGPASSWORD`, and a read-only transaction ending with `ROLLBACK`.

## Awaiting Secure Execution

Codex cannot safely interact with the credential prompts in this session, so the production precheck remains unexecuted.

Decision: `AWAITING_SECURE_STEP05_PRECHECK_RETRY`

## Localized Fix

The previous runner generated runtime SQL that reused a CTE named `target` across multiple statements. PostgreSQL scopes a CTE to the statement immediately following the `WITH`, so the remote precheck failed with `relation "target" does not exist`.

The runner was corrected so each statement that needs target function metadata defines its own `WITH target AS (...)`.

## Apply Status

Step05 apply remains not authorized and not executed. Step06 remains not authorized.

## Recovery And Postcheck

Recovery and postcheck files are available. Neither was executed in this round.

## Next Action

`USER_EXECUTE_STEP05_PRECHECK_RUNNER`
