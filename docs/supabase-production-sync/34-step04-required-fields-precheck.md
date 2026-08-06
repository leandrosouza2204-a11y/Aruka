# Step04 Required Fields Precheck

## Objective

Prepare the supervised production precheck for Step04 Required Fields without changing production data or schema.

## Scope

Step04 is limited to nullability reconciliation for `public.alunos`.

Required columns identified from the canonical apply SQL:

- `public.alunos.created_at`
- `public.alunos.user_id`
- `public.alunos.whatsapp`

## Static Validation

The Step04 precheck SQL was checked as read-only. No mutating commands were found.

The apply SQL hash was frozen as:

`20A545B036CAD34D74548AE1BF15FA1EE96FBD5C40205F98C8275EB71EEA42D7`

Traceability against the approved local migration was confirmed with `UNTRACEABLE_STATEMENT_COUNT=0`.

## Runner

External runner prepared outside Git:

`C:\Backups\Aruka\run-step04-required-fields-precheck.ps1`

The runner uses Docker image `public.ecr.aws/supabase/postgres:17.6.1.156`, Session Pooler input with a masked credential placeholder, temporary `PGPASSWORD`, and a read-only transaction ending with `ROLLBACK`.

## Awaiting Secure Execution

Codex cannot safely interact with the credential prompts in this session, so the production precheck remains unexecuted.

Decision: `AWAITING_SECURE_STEP04_PRECHECK_EXECUTION`

## Apply Status

Step04 apply remains not authorized and not executed.

## Recovery And Postcheck

Recovery and postcheck files are available. Neither was executed in this round.

## Next Action

`USER_EXECUTE_STEP04_PRECHECK_RUNNER`
