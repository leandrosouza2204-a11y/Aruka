# Cycle 12 — final production backup security unblock

## Decision

```text
DECISION=COMPLETE_WITH_BLOCKERS
EXECUTION_READINESS=BLOCKED
BACKUP_STARTED=NO
WRITE_FREEZE_ACTIVE=NO
RESTORE_DRILL=PARTIAL
PRODUCTION_READINESS=NO_GO
```

The project owner authorized the security scope needed for a future single collection: PostgreSQL read-only dump operations with RLS bypass, RLS-first Storage access, conditional privileged S3 access if RLS coverage is proven insufficient, reversible application maintenance, cron pause, Storage write blocking, and Edge Function invocation blocking. Deploy, migrations, rollout, RLS changes, data deletion and Git operations remain prohibited.

Authorization scope is recorded separately from operational approval. Approver name, operator, custodian, change record, window and expiry remain unknown; credentials and freeze evidence do not exist. The pending files therefore remain intentionally invalid for execution.

## PostgreSQL access boundary

The approved account is the platform PostgreSQL backup identity used by the pinned runbook. It inherently has privileges beyond the requested operation. Safety is enforced operationally:

- credentials only through `Read-Host -AsSecureString` into the restricted BitLocker destination;
- no connection string or password in arguments, logs, chat or Git;
- only `pg_dumpall --roles-only`, `pg_dump`, and `psql` running the two versioned read-only SQL files are allowed;
- keeper transaction is `REPEATABLE READ READ ONLY`;
- every dependent dump uses the exported snapshot;
- no interactive SQL, DDL, DML, migration, repair or dashboard editor operation is allowed;
- credentials are revoked/rotated after the future collection.

The procedure was validated in `PLAN_ONLY`: no prompt executed and no credential file was created. Completeness cannot be validated until the operator supplies the credential locally; no dump was run in this mission.

## Storage RLS coverage proof

The source of truth is the snapshot-bound SQL inventory and must contain exactly eight distinct identities. The RLS preflight must produce only hashed identities and aggregate counts:

1. parse the eight `bucket_id + NUL + name` identities without printing either component;
2. authenticate S3 with project ref, legacy anon key and the custodian's JWT session token;
3. execute a metadata read for each exact object, suppressing remote response bodies and original names;
4. compare accessible identities and reported sizes to the SQL inventory;
5. require `expected=8`, `accessible=8`, `missing=0`, `extra=0`, `size_mismatch=0`;
6. prove complete body reads only during the separately authorized export, when the existing exporter downloads and hashes all bytes.

A preflight metadata read does not itself prove a complete body read. This mission does not access the eight objects. If metadata coverage is below 8/8, record only counts and identity digests, set `RLS_COVERAGE=INSUFFICIENT`, and activate the already authorized conditional S3 path only after a temporary revocable key is provisioned. `allow_full_s3_access_key` stays false until that evidence exists.

## Edge Function investigation

Functions in scope:

- `processar-encerramentos-automaticos`, active version 14, `verify_jwt=false`, direct path under `/functions/v1/`;
- `student-access-invite`, active version 14, `verify_jwt=false`, direct path under `/functions/v1/`.

Repository and package inspection found no managed gateway, WAF, reverse proxy or route-rule configuration in front of the direct Supabase hostname. The only gateway configuration found belongs to disposable local Supabase containers. Vercel serves the frontend and cannot protect direct `*.supabase.co` endpoints.

The managed Edge gateway routes and authenticates requests, but the available Supabase project tools expose no per-function deny/pause rule. CLI 2.120.0 exposes list, download, deploy and delete; it has no pause command. Because both deployed functions use `verify_jwt=false`, gateway JWT enforcement is not an available switch without a deployment/configuration change.

Pausing cron and rotating its secret can stop the known scheduled caller of `processar-encerramentos-automaticos`, but cannot prove that every external caller is blocked. `student-access-invite` accepts valid user sessions and performs privileged mutations after handler-level checks. Vercel protection, CORS and absence of traffic do not block direct HTTP invocation.

```text
EDGE_FREEZE=BLOCKED
```

Non-deploy alternatives evaluated:

- existing external gateway/WAF: not found;
- Vercel protection: does not cover Supabase endpoints;
- CORS: browser response control, not an invocation barrier;
- rotate cron secret: only partial coverage;
- revoke sessions: broad, not instantaneous proof for all existing tokens, and does not cover the cron secret;
- delete functions: destructive and rollback requires the prohibited deploy;
- pause entire Supabase project: also disables the database and Storage reads required by the backup.

Remaining human action: provide a platform-level Supabase route deny mechanism supported for the managed project, or separately authorize a temporary fail-closed deployment with exact bundle hash rollback. Under the current no-deploy constraint there is no proven complete Edge freeze.

## Storage write-freeze investigation

Supabase Storage accepts interoperable REST, resumable/TUS and S3 operations on direct managed endpoints. No versioned proxy/WAF exists, and the available managed tools expose no temporary method filter that denies all write verbs while preserving GET/HEAD. Disabling the S3 protocol would also remove the approved export path and would not prove REST/TUS writes are blocked.

Application maintenance does not stop installed PWA clients, existing tokens, direct SDK calls, S3 clients or external integrations. PostgreSQL table locks or metadata checks cannot prove bytes were not accepted by the Storage service before its metadata transaction. RLS/policy/grant changes are prohibited.

```text
STORAGE_FREEZE=BLOCKED
```

Remaining human action: provide a managed Supabase/platform control or an existing upstream gateway capable of denying REST/TUS/S3 writes across every direct endpoint while allowing the read/export path. Otherwise a separately authorized RLS/gateway intervention is required; neither is authorized here.

## Cron and application state

Sanitized production metadata read on 2026-10-08 UTC:

- job id: `1`;
- job name: `processar-encerramentos-automaticos-dry-run-diario`;
- schedule: `0 6 * * *`;
- prior active state: `true`.

Future pause: `cron.alter_job(1, active := false)`, followed by two metadata reads showing false. Rollback reactivates job 1 only because the recorded prior state is true. The command body and secret were not read or recorded.

The frontend is a Vite SPA on Vercel with a PWA service worker and no runtime maintenance switch. Vercel project pause/protection is reversible and can block fresh web navigation, but cached sessions remain a bypass until Supabase-side Edge and Storage controls are proven. Maintenance was not activated.

## Credentials and exact operator actions

1. Complete the pending approval files with real identity, operator, custodian, change record, UTC window and expiry. Do not change freeze evidence to `ACTIVE`.
2. In an elevated local PowerShell, run `initialize-aruka-recovery-credentials.ps1` without `-Create`; require `PLAN_ONLY`.
3. Obtain the Session Pooler host and temporary database password from the Supabase Dashboard. Repeat with `-Create` and enter values only in the local secure prompts.
4. For RLS Storage, enter project ref, the active legacy anon key and the custodian JWT in the three Storage prompts. Never paste them into chat.
5. Do not provision a privileged S3 key unless a sanitized 8-object coverage report is insufficient. If required, generate a temporary named key in Storage S3 settings, keep it only under the restricted `B:` credential directory, and define immediate revocation.
6. Do not begin collection while Edge or Storage freeze remains blocked.

## Final release gate

`EXECUTION_READINESS=READY` requires credentials present, nominal time-bounded approvals, Edge freeze proof, Storage write-freeze proof, cron rollback and application maintenance. Current result is `BLOCKED`; no collection, freeze, deploy, migration, RLS change or data mutation was performed.
