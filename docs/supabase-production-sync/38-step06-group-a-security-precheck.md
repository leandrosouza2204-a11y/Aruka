# Step06 Group A Security Precheck

## Objective

Prepare the supervised production precheck for Step06 Group A Security without changing production state.

## Scope

Step06 is limited to Group A metadata and function privilege hardening for:

- Function: `public.set_workout_templates_updated_at()`
- Trigger: `public.workout_templates.set_workout_templates_updated_at`
- Table: `public.workout_templates`

## Security Operations

The canonical Step06 apply SQL performs:

- `ALTER FUNCTION public.set_workout_templates_updated_at() SET search_path = public`
- `REVOKE EXECUTE ON FUNCTION public.set_workout_templates_updated_at() FROM public`
- `REVOKE EXECUTE ON FUNCTION public.set_workout_templates_updated_at() FROM anon`
- `REVOKE EXECUTE ON FUNCTION public.set_workout_templates_updated_at() FROM authenticated`

No function body mutation is expected.

## Static Validation

The Step06 precheck SQL was checked as read-only. No mutating commands were found.

The apply SQL hash was frozen as:

`343CF76EC22DA674EC035C74D80FDEF8F2B34F83F223C73A30B549B83C95643C`

Traceability against the approved local migration was confirmed with `UNTRACEABLE_STATEMENT_COUNT=0`.

## Runner

External runner prepared outside Git:

`C:\Backups\Aruka\run-step06-group-a-security-precheck.ps1`

The runner uses Docker image `public.ecr.aws/supabase/postgres:17.6.1.156`, Session Pooler input with a masked credential placeholder, temporary `PGPASSWORD`, and a read-only transaction ending with `ROLLBACK`.

## Awaiting Secure Execution

Codex cannot safely interact with the credential prompts in this session, so the production precheck remains unexecuted.

Decision: `AWAITING_SECURE_STEP06_PRECHECK_EXECUTION`

## Apply Status

Step06 apply remains not authorized and not executed. History alignment remains not allowed.

## Recovery And Postcheck

Recovery and postcheck files are available. Neither was executed in this round.

## Next Action

`USER_EXECUTE_STEP06_PRECHECK_RUNNER`
