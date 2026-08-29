# Hotfix student access invite and edit focus

## Baseline

- Branch: `fix/student-access-invite-and-edit-focus`
- Baseline: `main` / `origin/main` at `2ce6fb9a4a20bbb89ac0fad536e200db035d3352`
- Production accessed: NO
- Production mutation: NO
- DB push: NO

## Bug 1 - invitation

Root cause: the UI treated `student_access_status = 'invited'` as an actionable access state and exposed activation/revoke actions. In the database contract, `invited` is only a pending invite marker on `public.alunos`; it is not active access and does not imply a linked Auth account.

Existing contract:

- `STUDENT_ACCESS_TABLE`: `public.alunos`
- `INVITATION_STATE_SOURCE`: `alunos.student_access_status`, `student_access_email`, `student_access_invited_at`
- `LINKED_AUTH_USER_SOURCE`: `alunos.student_user_id`
- `ACTIVATE_ACTION`: `manage_student_access(..., 'activate', ...)`, requires `student_user_id`
- `REVOKE_ACTION`: `manage_student_access(..., 'revoke', ...)`, supports `active`, `suspended`, `revoked`
- `INVITE_ACTION`: `manage_student_access(..., 'invite', ...)`, supports `not_invited`, `revoked`

Invite provider:

- Previous `CURRENT_INVITE_PROVIDER`: local Supabase RPC `manage_student_access`
- Previous `CURRENT_INVITE_API`: `supabase.rpc("manage_student_access", { p_action: "invite" })`
- Previous state did not invoke Supabase Auth invite or an e-mail provider.
- `EMAIL_DELIVERY_REMOTE_CONFIG`: MANUAL_CHECK_REQUIRED

Resend/cancel:

- `CAN_SAFELY_RESEND`: YES through `student-access-invite` Edge Function when status is `invited` and `student_user_id` is null.
- `RESEND_IDEMPOTENT`: YES for Aruka data model. It reuses the same `aluno_id` and e-mail, does not insert aluno/profile/contract records, and only updates invite timestamp after Auth provider success.
- `WHETHER_PENDING_INVITE_CAN_BE_CANCELLED`: NO current RPC action for cancellation.

Changes:

- Pending invite no longer exposes activate/revoke actions.
- The invite button copy now says `Enviar convite`.
- Invite success toast now says `Convite enviado.` and does not imply active access.
- Transition-invalid errors now show a state-specific message instead of a generic failure.

Manual e-mail checks required:

- Auth e-mail provider / SMTP configuration
- Supabase Auth logs for invite attempts
- Rate limits
- Redirect URLs
- E-mail templates
- Whether a backend path should call Supabase Auth invite or another e-mail provider

## Real email invitation contract

Architecture found:

- Browser Supabase client uses only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Existing Edge Functions use `Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")` server-side only.
- Student account access is resolved by `public.alunos.student_user_id = auth.uid()`.
- `public.vincular_aluno_usuario(p_aluno_id, p_student_user_id)` exists but is professional-driven and requires a `student` profile. No automatic post-invite linking flow was found in the browser.
- `/criar-senha` already exists for Supabase invite first access.

Mechanism chosen:

- `supabase/functions/student-access-invite/index.ts`
- Validates the professional JWT with anon client.
- Validates ownership by selecting `alunos.id = alunoId` and `alunos.user_id = auth user id`.
- Rejects already linked students before sending.
- Rejects an e-mail already present in Auth users with `ALREADY_REGISTERED_UNLINKED`; it does not link by e-mail.
- Calls `adminClient.auth.admin.inviteUserByEmail(email, { redirectTo })`.
- Persists `invited` state only after the Auth provider accepts the invite request.

Invite:

- Frontend calls `supabase.functions.invoke("student-access-invite", { action: "send", alunoId, email })`.
- Edge Function calls Auth Admin invite.
- After provider success, it calls `manage_student_access(..., "invite", ...)`.

Resend:

- Frontend calls the same Edge Function with `action: "resend"`.
- Allowed only for `student_access_status = 'invited'` and `student_user_id is null`.
- Uses the stored `student_access_email`.
- After provider success, updates only `student_access_invited_at`, `student_access_email`, and `student_access_reason`.

Redirect strategy:

- Uses `STUDENT_INVITE_REDIRECT_TO` when configured.
- Otherwise falls back to `${Origin}/criar-senha`.
- Production should configure `STUDENT_INVITE_REDIRECT_TO=https://www.aruka.com.br/criar-senha`.
- Preview/local can use their own explicit safe URL without hardcoding ephemeral preview domains.

Cancel:

- Not implemented. Updating `student_access_status` alone would not reliably invalidate an Auth invite token already issued by Supabase.

Post-invite/linking:

- The invite can create/authenticate the student and route them to `/criar-senha`.
- `claim_pending_student_invite()` now completes the automatic link from invite-created `auth.uid()` to the invited aluno when exactly one pending invite matches the authenticated e-mail.
- Real e-mail delivery remains `MANUAL_REQUIRED` because it depends on deployed function secrets, Supabase Auth e-mail configuration, templates, redirect allow-list, and provider logs.

## Post-invite account linking

Mechanism:

- New RPC: `public.claim_pending_student_invite()`
- Called by `/criar-senha` after `supabase.auth.updateUser({ password })` succeeds and before redirect.
- Also attempted as an optional safe retry after normal login, before creating a default professional profile. Optional retry never blocks normal login when no invite/migration is present.

Security:

- The RPC receives no `aluno_id`, `student_user_id`, or `professional_user_id` from the browser.
- Student identity comes from `auth.uid()`.
- Student lookup uses the authenticated JWT e-mail claim through `auth.jwt() ->> 'email'`.
- It links only when exactly one `public.alunos` row has `student_access_status = 'invited'`, matching `student_access_email`, and `student_user_id is null`.
- No matching invite is blocked.
- Ambiguous matching invites are blocked.
- A user already linked to another aluno is blocked.
- An existing incompatible profile is blocked.
- A missing profile is created as `role = 'student'`, `tipo_acesso = 'pendente'`, `status = 'ativo'`.

Lifecycle:

- Before invite: `not_invited` or `revoked`.
- After provider success: `invited`, with no `student_user_id`.
- After password creation: claim RPC runs.
- After successful claim: `student_user_id = auth.uid()` and `student_access_status = 'active'` in the same RPC transaction.
- If claim fails: password may be created, but UI does not redirect to `/minha-area`; it shows a friendly linking error.
- Later login can retry the safe claim if the first attempt failed transiently.

Edge cases:

- `NO_MATCHING_INVITE`: blocked.
- `AMBIGUOUS_MATCHING_INVITE`: blocked.
- `STUDENT_ALREADY_LINKED`: blocked by `student_user_id is null` and unique link checks.
- `AUTH_USER_ALREADY_LINKED`: blocked.
- `WRONG_EMAIL`: blocked by lookup from authenticated e-mail.
- `RESEND_SAME_INVITE`: preserved; resend does not create another aluno and later claim still matches the same e-mail/aluno.
- `STATUS_BECOMES_ACTIVE_AFTER_LINK`: covered by migration test.
- `STATUS_NOT_ACTIVE_IF_LINK_FAILS`: update happens only after exact match/profile/account checks.

## Bug 2 - edit focus

Root cause: `AlunoModal` registered its mount/focus effect with `page.fecharModal` in the dependency list. Because `useAlunosPage()` returns a new `fecharModal` function identity on each form state update, every input change reran the cleanup and mount effect. Cleanup restored focus to the previous element, and mount focused the `Fechar` button.

Changes:

- `AlunoModal` stores the latest `page.fecharModal` in a ref.
- The mount/focus effect runs only while the modal instance is mounted.
- Escape still calls the latest close function through the ref.
- No `setTimeout`, activeElement hack, or per-keypress refocus was added.

## QA

- `node --test src/features/studentAccess/utils/studentAccessLifecycle.test.js` PASS
- `node --test src/features/alunos/components/AlunosList.focus.test.js` PASS
- `npm.cmd run lint` PASS
- `npm.cmd run build` PASS
- `npm.cmd run qa:visible-ui-copy` PASS
- `npm.cmd run test:alunos` PASS
- `npm.cmd run qa:student-access-lifecycle` PASS, with `PRODUCTION_ACCESSED=NO`, `PRODUCTION_MUTATION=NO`, `DB_PUSH=NO`
- `npm.cmd run qa:product-roadmap-v4-cycle-06` PASS
- `npm.cmd run qa:product-roadmap-v4-cycle-07` PASS
- `npm.cmd run qa:product-roadmap-v4-cycle-08` PARTIAL: static/unit checks passed through `qa:student-execution-load-model`; runtime step `qa:workout-execution-actual-load-history` failed because local Supabase database container was not running for project_id `ConsultoriaFitness`
- `node --test supabase/functions/student-access-invite/index.test.mjs` PASS
- `node --test supabase/migrations/20260829120000_student_pending_invite_claim.test.mjs src/services/studentInviteLinkingService.test.js src/components/DefinirSenhaForm.test.js` PASS
- `npm.cmd run qa:student-identity-contract` PASS
- `npm.cmd run qa:student-account-linking` PASS
- `npm.cmd run qa:product-roadmap-v4-cycle-06-1` PASS
- `npm.cmd run qa:supabase-ci-harness-static` PASS
- `npm.cmd run qa:supabase-local-reproducibility` FAIL only on Docker cleanup inspection permission: unable to read Docker config/connect to Docker API

Full QA pending:

- Alunos/Cycle regressions relevant to the local environment
- Re-run Cycle 08 runtime after local Supabase runtime preconditions are healthy
- Deploy/serve `student-access-invite` with QA secrets and validate a real QA invite manually

## Remote cutover preflight

Scope:

- Remote production access: NO
- Remote production mutation: NO
- Remote DB push: NO
- Remote Edge Function deploy: NO
- Remote secrets changed: NO
- Auth provider mutation: NO

Critical files:

- `supabase/migrations/20260829120000_student_pending_invite_claim.sql`
- `supabase/functions/student-access-invite/index.ts`
- `src/services/studentAccessService.js`
- `src/services/studentInviteLinkingService.js`
- `src/components/DefinirSenhaForm.jsx`
- `src/auth/Login.jsx`
- `src/features/alunos/components/AlunosList.jsx`
- `src/features/alunos/hooks/useAlunosPage.js`
- `src/features/studentAccess/utils/studentAccessLifecycle.js`

Database preflight:

- `MIGRATION_REQUIRED`: YES, new RPC function only.
- `STRUCTURAL_SCHEMA_CHANGE`: NO table/column/index change.
- `DATA_BACKFILL`: NO.
- `RPC_CREATED`: `public.claim_pending_student_invite()`.
- `RPC_PARAMS_FROM_BROWSER`: NONE.
- `RPC_PRIVILEGES`: revoked from `public`, granted to `authenticated`.
- `SECURITY_DEFINER`: YES, with explicit `search_path = public` and schema-qualified `auth` calls.
- `IDENTITY_SOURCE`: `auth.uid()` plus normalized `auth.jwt() ->> 'email'`.
- `MATCHING_RULE`: exactly one pending `public.alunos` row by normalized `student_access_email`, `student_access_status = 'invited'`, and `student_user_id is null`.
- `AMBIGUOUS_MATCH`: blocked.
- `NO_MATCH`: blocked.
- `ACCOUNT_REUSE`: blocked when the same Auth user is linked to another aluno.
- `PROFILE_RULE`: compatible existing student profile allowed; missing profile created as `student`/`pendente`/`ativo`; incompatible profile blocked.
- `ATOMIC_LINK_AND_ACTIVATE`: YES, update sets `student_user_id` and `student_access_status = 'active'` in the RPC transaction.

Edge Function preflight:

- `SERVICE_ROLE_LOCATION`: server-side only through `Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")`.
- `FRONTEND_SERVICE_ROLE_EXPOSURE`: NO evidence found.
- `JWT_VALIDATION`: professional request validated with `userClient.auth.getUser()`.
- `OWNERSHIP_CHECK`: `alunos.id = alunoId` and `alunos.user_id = authenticated professional id`.
- `ALREADY_LINKED_STUDENT`: blocked before provider call.
- `EXISTING_AUTH_EMAIL`: blocked with `ALREADY_REGISTERED_UNLINKED`; no unsafe e-mail-based link is attempted.
- `PROVIDER_BEFORE_DB_STATE`: YES, Auth invite is called before `invited` state persistence/resend timestamp update.
- `RESEND_IDEMPOTENT_FOR_ALUNO`: YES, reuses the existing aluno invite state and does not insert aluno/profile/contract records.
- `CORS`: restricted to `STUDENT_INVITE_ALLOWED_ORIGINS` plus local fallback origins and `https://www.aruka.com.br`; no wildcard origin.
- `REDIRECT`: uses `STUDENT_INVITE_REDIRECT_TO` when configured, otherwise request origin plus `/criar-senha`.
- `PARTIAL_FAILURE`: if provider accepts but DB persistence fails, the function attempts best-effort cleanup of the newly invited Auth user and returns a generic failure. Manual Auth log inspection is still required after any real provider-side error.

Frontend flow preflight:

- Professional invite sends/resends through `student-access-invite`.
- Pending invite is not shown as active access.
- Activation from `not_invited` requires a linked `student_user_id`.
- `/criar-senha` updates password, then claims the pending invite, then redirects to `/minha-area`.
- Normal login retries the pending invite claim before creating a default profile.
- Optional login retry does not block normal professional login when there is no pending invite or when the migration is not present yet.

Manual remote cutover order, not executed:

1. Confirm remote migration status with the existing project target.
2. Apply the database migration that creates `public.claim_pending_student_invite()`.
3. Configure/confirm Edge Function secrets: `SUPABASE_SERVICE_ROLE_KEY`, `STUDENT_INVITE_REDIRECT_TO=https://www.aruka.com.br/criar-senha`, and `STUDENT_INVITE_ALLOWED_ORIGINS=https://www.aruka.com.br` plus any approved preview origins.
4. Confirm Supabase Auth Site URL and Redirect URL allow-list include `https://www.aruka.com.br/criar-senha`.
5. Deploy `student-access-invite`.
6. Deploy frontend after the database RPC and Edge Function are available.
7. Run one controlled QA invite in a non-production or explicitly approved test account, then inspect Auth logs, Function logs, and the aluno state transition.

Rollback plan:

1. Frontend rollback to the previous deployment if the user-facing flow fails.
2. Edge Function rollback by redeploying the previous function version or disabling the new origin/secret configuration.
3. Database rollback must be forward-only: ship a new migration that revokes/drops/replaces `public.claim_pending_student_invite()` as needed; do not edit applied migration history.
4. Existing Auth invite links already sent may remain valid until provider/token expiry; do not assume rollback invalidates issued e-mails.
5. For any provider-success/DB-failure case, inspect Auth users/logs and invited aluno rows manually before retrying.

## Controlled remote cutover

Attempt date: 2026-08-29

Local gates:

- Branch: `fix/student-access-invite-and-edit-focus`
- `git diff --cached --check`: PASS
- Commit: NO
- Push: NO
- PR change: NO

Remote project identification:

- `supabase/config.toml` project_id: `ConsultoriaFitness` (local project id, not a remote project ref)
- `supabase/.temp/project-ref`: MISSING
- `SUPABASE_PROJECT_REF` / remote Supabase URL env: not present in the shell environment
- Supabase CLI binary on PATH: MISSING
- Expected historical project ref `vrizeuhuhvtvbrmtvdik`: observed only in historical docs/scripts, not in an active CLI link file for this workspace

Cutover result:

- Decision: `BLOCKED_REMOTE_PROJECT_LINK_MISSING`
- No remote command was executed.
- No migration list was read remotely.
- No `db push` was executed.
- No secret was set.
- No Auth redirect allow-list was changed.
- No Edge Function was deployed.
- No real invite was sent.

Reason:

- The controlled cutover requires confirming the active Supabase project ref from local CLI linkage/configuration before any remote action. This workspace currently has no `supabase/.temp/project-ref`, and `supabase` is not available on PATH. Proceeding with an assumed `--project-ref` would violate the mission gate.

Required manual recovery before retry:

1. Install or expose the Supabase CLI in the shell used by Codex.
2. Link the workspace to the intended remote project through the supported Supabase CLI flow, or restore a verified `supabase/.temp/project-ref`.
3. Confirm that the linked ref is `vrizeuhuhvtvbrmtvdik` or explicitly approve a different intended environment.
4. Re-run the controlled cutover from Etapa 1: read-only `supabase migration list`.

## Remote database cutover

Execution date: 2026-08-29

Project:

- Name: `aruka`
- Ref: `vrizeuhuhvtvbrmtvdik`
- Region: `us-east-2`
- Status before migration: `ACTIVE_HEALTHY`
- Link verified before migration: YES

Migration history before:

- Local executable migrations: 14
- Remote applied migrations: 13
- Pending migrations: `20260829120000_student_pending_invite_claim`
- Unexpected drift before push: NO

Migration apply:

- Command used: `npx.cmd -y supabase@2.109.1 db push`
- Migration applied: `20260829120000_student_pending_invite_claim.sql`
- DB push result: SUCCESS
- CLI warning: migration catalog cache export failed because `pg-delta` could not read a temporary CA file, but the CLI completed `Finished supabase db push.`

Migration history after:

- Local executable migrations: 14
- Remote applied migrations: 14
- Pending migrations: 0
- `20260829120000`: present local and remote

RPC remote validation:

- Function exists: YES, `public.claim_pending_student_invite()`
- Arguments: none
- Security definer: YES
- Search path: `public`
- Identity server-derived: YES, uses `auth.uid()` and `auth.jwt() ->> 'email'`
- Atomic claim: YES in function body
- Authenticated execute: YES
- Anon execute: UNEXPECTED YES in remote schema dump

Cutover stop:

- Decision: `BLOCKED_STUDENT_INVITE_RPC_REMOTE_VALIDATION`
- Reason: remote schema dump shows `GRANT ALL ON FUNCTION "public"."claim_pending_student_invite"() TO "anon";`
- No Edge Function deploy was executed.
- No secrets were changed.
- No Auth configuration was changed.
- No invite was sent.
- Next action requires a reviewed forward fix migration to revoke direct `anon` execute on `public.claim_pending_student_invite()`.

## RPC privilege forward fix

Execution date: 2026-08-29

Issue:

- Remote schema validation after the claim RPC migration showed unexpected direct execute for `anon`.
- The RPC body, identity logic, matching logic, error contract, `SECURITY DEFINER`, and `search_path` were not changed in the fix.

Migration:

- New forward-only migration: `20260829173000_student_pending_invite_claim_permissions.sql`
- Scope: privilege-only.
- Statements:
  - revoke all on `public.claim_pending_student_invite()` from `public`
  - revoke all on `public.claim_pending_student_invite()` from `anon`
  - grant execute on `public.claim_pending_student_invite()` to `authenticated`

Migration history before:

- Local executable migrations: 15
- Remote applied migrations: 14
- Pending migrations: `20260829173000_student_pending_invite_claim_permissions`
- Unexpected drift before push: NO

Migration apply:

- Command used: `npx.cmd -y supabase@2.109.1 db push`
- Migration applied: `20260829173000_student_pending_invite_claim_permissions.sql`
- DB push result: SUCCESS
- CLI warning repeated: migration catalog cache export failed because `pg-delta` could not read a temporary CA file, but the CLI completed `Finished supabase db push.`

Migration history after:

- Local executable migrations: 15
- Remote applied migrations: 15
- Pending migrations: 0
- `20260829173000`: present local and remote

Remote privilege validation after fix:

- Function: `public.claim_pending_student_invite()`
- Arguments: none
- Security definer: YES
- Search path: `public`
- Public execute: NO
- Anon execute: NO
- Authenticated execute: YES
- Service role execute: YES
- Remote validation: PASS

Cutover status:

- Decision: `READY_FOR_STUDENT_INVITE_EDGE_FUNCTION_CONFIGURATION`
- No Edge Function deploy was executed in this step.
- No secrets were changed in this step.
- No Auth configuration was changed in this step.
- No invite was sent.

## Edge Function remote cutover

Execution date: 2026-08-29

Remote prerequisites:

- Project: `aruka`
- Project ref: `vrizeuhuhvtvbrmtvdik`
- Remote migrations: 15
- Migration drift: NO
- RPC permissions: PASS (`PUBLIC` execute NO, `anon` execute NO, `authenticated` execute YES)

Function preflight:

- Function: `student-access-invite`
- JWT required: YES, both platform `verify_jwt=true` and internal `userClient.auth.getUser()` guard
- Professional identity: derived from JWT
- Student ownership: validated server-side by `alunos.id = alunoId` and `alunos.user_id = authenticated professional id`
- Service role: server-side only
- Provider call order: validation first, then `auth.admin.inviteUserByEmail`, then DB state persistence
- Resend: idempotent for the existing aluno invite state; no aluno/profile/contract insert
- Errors: sanitized
- CORS: restricted, no wildcard
- Client-controlled redirect: NO
- Redirect fail-closed: YES. Redirect comes from `STUDENT_INVITE_REDIRECT_TO` or an allowed request `Origin` plus `/criar-senha`; otherwise the function returns before `inviteUserByEmail`.

Secrets:

- Secrets listed: YES
- `SUPABASE_SERVICE_ROLE_KEY`: PRESENT
- `STUDENT_INVITE_REDIRECT_TO`: ABSENT
- Redirect secret configured: NO
- Secret values exposed in report/final output: NO
- Reason redirect remains absent: Vercel Preview URL for the hotfix does not exist yet, and production frontend does not contain the hotfix.

Deploy:

- Command used: `npx.cmd -y supabase@2.109.1 functions deploy student-access-invite --project-ref vrizeuhuhvtvbrmtvdik`
- Deploy result: SUCCESS
- Remote status after deploy: ACTIVE
- Version: 1
- Verify JWT: true
- Additional deploy on resume: NO

Validation:

- Remote availability: PASS through `functions list`
- Logs: `CLI_NOT_AVAILABLE`; Supabase CLI 2.109.1 lists functions but has no logs subcommand in `functions --help`
- Anonymous negative test: `BLOCKED_BY_EXECUTION_ENVIRONMENT`; no retry was attempted after execution environment blocked the HTTP call
- Real invite sent: NO
- Auth user created: NO
- Student QA mutation: NO

Local QA after deploy:

- Function tests: PASS
- Edit focus regression: PASS
- Student access lifecycle: PASS
- Student identity contract: PASS
- Student account linking: PASS
- Visible UI copy: PASS
- Lint: PASS
- Build: PASS

Next controlled step:

- Decision: `READY_TO_PUBLISH_HOTFIX_PREVIEW_FOR_REAL_INVITE_QA`
- Next action: commit and push the hotfix branch, create/obtain the Vercel Preview URL, allow-list the preview `/criar-senha`, configure invite redirect for that preview if needed, then send one controlled QA invite.

## Real invite QA

Execution date: 2026-08-29

Git/PR:

- Commit SHA: `ebd8d44f483885f61dcb3c7a05274f78ecafb12d`
- Commit message: `fix: corrige convite de acesso e edição de aluno`
- Push: SUCCESS
- PR: `#55`
- PR URL: `https://github.com/leandrosouza2204-a11y/Aruka/pull/55`
- PR #54: not modified
- Merge: NO

Preview:

- Preview URL: `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app`
- Create password URL: `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app/criar-senha`
- GitHub deployment status: success
- Runtime validation: BLOCKED by Vercel protection/auth page for unauthenticated access from this environment
- `/criar-senha` HTTP check: reachable, but full runtime validation remains blocked by Preview protection/auth
- Hotfix code present: partially confirmed through deployment SHA and route/static hints; full UI/runtime validation still requires authorized Preview access

Auth/redirect:

- Auth redirect allow-list update: NOT_DONE
- Required manual allow-list URL: `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app/criar-senha`
- `STUDENT_INVITE_REDIRECT_TO`: NOT_CONFIGURED in this step
- Reason: Auth redirect allow-list could not be changed safely from available CLI/tooling, and the mission requires allow-list before setting the invite redirect and sending the real invite.
- Site URL changed: NO

Real invite QA status:

- Professional QA login: NOT_RUN
- Student QA selected: NOT_RUN
- Initial student state: NOT_CONFIRMED
- Invite sent: NO
- E-mail delivery: NOT_RUN
- Auth log: NOT_RUN
- Function log: NOT_RUN
- Password setup: NOT_RUN
- Claim: NOT_RUN
- Student access validation: NOT_RUN
- Resend: NOT_RUN
- Edit modal runtime focus: NOT_RUN

Local QA after commit/push:

- Function tests: PASS
- Student access lifecycle: PASS
- Student identity contract: PASS
- Student account linking: PASS
- Edit focus test: PASS
- Visible UI copy: PASS
- Lint: PASS
- Build: PASS

Stop point:

- Decision: `WAITING_FOR_USER_AUTH_REDIRECT_ALLOWLIST_AND_PREVIEW_ACCESS`
- Next action: grant/open Preview access for QA and add `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app/criar-senha` to Supabase Auth Redirect URLs. After that, configure `STUDENT_INVITE_REDIRECT_TO` to this Preview URL and run one controlled QA invite.

## Real invite QA resume after preview access

Attempt date: 2026-08-29

Preview recheck:

- Preview URL: `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app`
- Create password URL: `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app/criar-senha`
- Preview root HTTP status: 200
- Preview root result: still shows Vercel protection/auth page to this execution environment
- `/criar-senha` HTTP status: 200
- `/criar-senha` result: still shows Vercel protection/auth page to this execution environment
- Preview access: NO

Stop point:

- Decision: `BLOCKED_BY_VERCEL_PREVIEW_ACCESS`
- No redirect secret was configured.
- No Auth configuration was changed.
- No real invite was sent.
- No Auth user was created.
- No student QA mutation was executed.
- No merge was performed.

Required action before next resume:

- Grant this execution/browser environment access to the Vercel Preview or provide an accessible Preview URL for `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app`.
- Confirm the Supabase Auth Redirect URLs include `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app/criar-senha`.

## Real invite QA resume after Auth allow-list confirmation

Attempt date: 2026-08-29

Confirmed by user:

- Preview access: PASS
- Create password route: PASS
- Supabase Auth Redirect URLs include `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app/criar-senha`
- Current legacy Site URL: `https://consultoria-fitness-gamma.vercel.app`
- Legacy Site URL review required: YES
- Site URL changed: NO

Secret configuration:

- `STUDENT_INVITE_REDIRECT_TO`: configured to the Preview `/criar-senha` URL
- Secret presence after configuration: PRESENT
- Other secret values printed in report/final output: NO
- Edge Function redeploy: NO
- Rationale: the deployed Edge Function reads `STUDENT_INVITE_REDIRECT_TO` from runtime environment; no code redeploy was needed.

QA handoff:

- Decision: `WAITING_FOR_USER_REAL_INVITE_INTERACTION`
- Next action: user opens the Preview, logs in with professional QA, validates edit modal focus, selects a student QA with `student_user_id = null`, sends one invite, checks inbox/spam/logs, opens the invite, completes password setup, and reports the observed results.
- Real invite sent by Codex: NO
- Auth user created by Codex: NO
- Student QA mutation by Codex: NO
- Real customer data changed: NO

## Real invite attempt #1 diagnosis

Attempt date: 2026-08-29

Observed by user:

- Professional login: PASS
- Edit modal focus runtime: PASS
- Invite UI: FAIL
- Toast title: `Não foi possível atualizar o acesso agora.`
- Toast detail: `Não foi possível enviar o convite agora.`
- E-mail delivery: NO
- UI remained: access not released, CTA `Enviar convite`

Client path:

- Invocation file: `src/services/studentAccessService.js`
- Invocation function: `requestStudentAccessInvite(action, alunoId, options)`
- API: `supabase.functions.invoke("student-access-invite", { body: { action, alunoId, email } })`
- Caller: `src/features/alunos/hooks/useAlunosPage.js`, `liberarAcessoAluno(aluno, email)`
- Toast path: `toast.erro("Não foi possível atualizar o acesso agora.", error.message)`
- Detailed backend error preserved: NO when `functions.invoke` returns `error`; the service throws the generic `Não foi possível enviar o convite agora.`

Edge/CORS diagnosis:

- Function status: ACTIVE
- Preview origin: `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app`
- `STUDENT_INVITE_REDIRECT_TO`: PRESENT
- `STUDENT_INVITE_ALLOWED_ORIGINS`: ABSENT
- Code fallback origins: `http://localhost:5173`, `http://127.0.0.1:5173`, `https://www.aruka.com.br`
- Preview origin allowed by current deployed Function config: NO
- OPTIONS supported: YES
- OPTIONS HTTP status: 200
- `Access-Control-Allow-Headers`: `authorization, x-client-info, apikey, content-type`
- `Access-Control-Allow-Methods`: `POST, OPTIONS`
- `Access-Control-Allow-Origin` for Preview origin: missing/empty

Layer classification:

- Function reached: YES for browser preflight OPTIONS
- Actual invite POST likely reached Function: NO/UNKNOWN, but browser CORS would block it before a usable `functions.invoke` response
- Auth provider reached: UNKNOWN, likely NO because CORS preflight did not allow the Preview origin
- QA e-mail already registered: UNKNOWN; not checked because CORS is already a sufficient primary failure
- Student state after failure: not remotely inspected in this diagnosis; user observed UI remained not released
- Root cause classification: `CORS_ORIGIN_REJECTED`
- Confidence: HIGH

Required fix:

- Add the Preview origin to the Edge Function allowed origins, preferably by setting `STUDENT_INVITE_ALLOWED_ORIGINS=https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app` while QA runs on this Preview.
- Revalidate OPTIONS returns `Access-Control-Allow-Origin: https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app`.
- Redeploy is probably not required if Edge Function secrets are read at runtime, but validation should confirm after the secret update.

Remote mutations during diagnosis:

- DB mutation: NO
- Auth mutation: NO
- Student mutation: NO
- Secret mutation: NO
- Edge deploy: NO
- Invite resent: NO

## CORS for Preview

Execution date: 2026-08-29

Attempt #1:

- Result: blocked by CORS.
- Cause: Preview origin was not present in `STUDENT_INVITE_ALLOWED_ORIGINS`, and the Function fallback origins included only localhost plus production.

Fix:

- Secret configured: `STUDENT_INVITE_ALLOWED_ORIGINS`
- Preview origin: `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app`
- Production origin preserved: `https://www.aruka.com.br`
- Localhost origins preserved: `http://localhost:5173`, `http://127.0.0.1:5173`
- Wildcard used: NO
- Edge redeploy required: NO
- Evidence: updated secret was consumed by the deployed Function at runtime.

OPTIONS after fix:

- Preview OPTIONS: PASS
- HTTP status: 200
- `Access-Control-Allow-Origin`: `https://aruka-cxbu5laiv-leandrosouzafitness.vercel.app`
- `Access-Control-Allow-Methods`: contains `POST, OPTIONS`
- `Access-Control-Allow-Headers`: contains `authorization, x-client-info, apikey, content-type`
- Arbitrary origin rejected: YES, `https://example.invalid` did not receive `Access-Control-Allow-Origin`

Attempt #2:

- Invite sent: WAITING_USER
- UI result: WAITING_USER
- Student status: WAITING_USER
- `student_user_id`: WAITING_USER
- E-mail delivery: WAITING_USER

Remote mutations:

- DB mutation: NO
- Auth config mutation: NO
- Secret mutation: YES, only `STUDENT_INVITE_ALLOWED_ORIGINS`
- Edge mutation: NO
- Real customer data changed: NO

## Real invite attempts after CORS fix

Attempt date: 2026-08-29

Observed by user:

- Professional login: PASS
- Edit modal focus runtime: PASS
- CORS preflight after fix: PASS
- Two controlled QA e-mails were tried by the user.
- Both attempts failed with the same generic UI toast.
- Toast title: `Não foi possível atualizar o acesso agora.`
- Toast detail: `Não foi possível enviar o convite agora.`
- UI remained: access not released, CTA `Enviar convite`
- E-mail delivery: NO

Client diagnosis:

- Invocation path: `src/services/studentAccessService.js`
- Function: `requestStudentAccessInvite(action, alunoId, options)`
- Request body: `{ action, alunoId, email }`
- Body field match: PASS for Edge Function contract.
- Supabase client handles `Authorization`, `apikey`, and client headers automatically.
- Detailed backend error preserved: NO when `supabase.functions.invoke()` returns `error`; the frontend throws the generic invite failure.

Runtime/project diagnosis:

- Preview Supabase project ref: `vrizeuhuhvtvbrmtvdik`
- Preview uses remote Supabase URL: YES
- Redirect configured: `STUDENT_INVITE_REDIRECT_TO` present and points to the Preview `/criar-senha`
- Resolved redirect validity: expected PASS, but not observed from a successful provider call yet
- Service role runtime availability: expected present from secret list, but not confirmed by logs during failing POST

Evidence gap:

- Supabase CLI 2.109.1 does not provide Function logs through `functions --help`.
- No safe log integration was available in this environment for Auth/Function invocation logs.
- QA e-mail addresses and aluno QA id were not available to perform read-only Auth/student-specific inspection.
- POST HTTP status and response JSON were not captured from the browser.

Root-cause status:

- CORS remains cleared and should not be the primary classification without new evidence.
- Current classification: `UNKNOWN_REQUIRES_BROWSER_NETWORK_CAPTURE`
- Needed evidence: browser Network entry for the failed `student-access-invite` POST, specifically Status Code and Response/Preview JSON only.

Remote mutations during this diagnosis:

- DB mutation: NO
- Auth mutation: NO
- Student mutation: NO
- Secret mutation: NO
- Edge deploy: NO
- New invite: NO

## Existing Auth user invite error UX and delete diagnosis

Execution date: 2026-08-29

Input evidence from user:

- Browser POST result after CORS fix: `409 Conflict`
- Backend code: `ALREADY_REGISTERED_UNLINKED`
- Backend message: `Este e-mail ja possui uma conta. Use o fluxo seguro de vinculacao antes de ativar o acesso.`
- Previous UI toast title: `Não foi possível atualizar o acesso agora.`
- Previous UI toast detail: `Não foi possível enviar o convite agora.`
- Supabase Dashboard Auth deletion attempt: `Failed to delete selected users: Database error deleting user`
- E-mail delivery after the failed invite: NO
- New invite sent in this mission: NO

Frontend fix:

- `src/services/studentAccessService.js` now preserves the safe Edge Function error payload returned through `supabase.functions.invoke().error.context`.
- `src/services/studentInviteErrorService.js` maps `ALREADY_REGISTERED_UNLINKED` to a user-facing message that tells the professional the e-mail already has an Aruka account and must use another e-mail or the future safe linking flow.
- Unknown Function errors remain generic.
- The UI does not expose HTTP status, Auth internals, service role details, JWTs, stack traces, or raw provider payloads.

Expected UI after fix:

- Toast title remains: `Não foi possível atualizar o acesso agora.`
- Toast detail becomes: `Este e-mail já possui uma conta no Aruka. Use outro e-mail ou utilize o fluxo de vinculação quando ele estiver disponível.`
- Student access should remain not released.
- Invite should not be resent automatically.

Read-only Auth deletion diagnosis:

- Remote schema-only audit found public foreign keys that reference `auth.users`.
- Non-blocking or destructive-by-design relationships include many `ON DELETE CASCADE` tables and `alunos.student_user_id ON DELETE SET NULL`.
- Potential delete blockers, if the selected Auth user is referenced, include:
  - `admin_logs.admin_user_id` with default `NO ACTION`
  - `admin_logs.target_user_id` with default `NO ACTION`
  - `aoe_decisions.actor_id ON DELETE RESTRICT`
  - `aoe_human_reviews.reviewer_id ON DELETE RESTRICT`
  - `aoe_idempotency_keys.actor_id ON DELETE RESTRICT`
- `alunos.student_user_id` alone should not block deletion because it is `ON DELETE SET NULL`.
- Specific row-level cause for the user's Auth deletion failure was not proven because no QA Auth user UUID or e-mail was available for read-only reference counts.
- `DELETE_BLOCKED_BY_FK=UNKNOWN`

Validation:

- `node --test src\services\studentAccessService.test.js`: PASS
- `npm.cmd run qa:student-access-lifecycle`: PASS
- `npm.cmd run qa:student-identity-contract`: PASS
- `npm.cmd run qa:student-account-linking`: PASS
- `npm.cmd run qa:visible-ui-copy`: PASS
- `npm.cmd run lint`: PASS
- `npm.cmd run build`: PASS

Remote mutations during this mission:

- DB mutation: NO
- Auth mutation: NO
- Student mutation: NO
- Secret mutation: NO
- Edge deploy: NO
- New invite: NO
- Real customer data changed: NO

Decision: `WAITING_FOR_CLEAN_QA_EMAIL_OR_READ_ONLY_AUTH_REFERENCE_AUDIT`

NEXT_ACTION=`USER_SELECT_CLEAN_QA_EMAIL_OR_PROVIDE_QA_AUTH_USER_ID_FOR_REFERENCE_COUNTS`
