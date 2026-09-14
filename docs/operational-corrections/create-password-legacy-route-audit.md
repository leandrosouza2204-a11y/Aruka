# Legacy `/criar-senha` Flow Audit + Canonical Migration Assessment

Date: 2026-09-12
Scope: audit only; no functional, Supabase, database, schema, RLS, or production changes were made.

## Decision

**INCONCLUSIVE — CONTROLLED_E2E_REQUIRED**

The current source requests a configurable URL for the student-invite first-access flow, with a safe canonical fallback when the request comes from the canonical origin. The canonical route is live and the legacy host preserves the route while redirecting to it. However, the remote Supabase Auth allow-list and deployed `STUDENT_INVITE_REDIRECT_TO` value were not accessible read-only during this audit. Consequently, it cannot be proven that the URL requested by future production invitations is permitted by Auth. A controlled configuration/E2E stage is required before the legacy redirect can ever be retired.

## Evidence and architecture

`src/App.jsx` registers `/criar-senha` as `InviteAccessRoute > CriarSenha`; it is deliberately not wrapped in `ProtectedRoute` because the invite itself establishes the session.

`src/auth/InviteAccessRoute.jsx` bootstraps session state in this order:

1. `supabase.auth.getSession()`.
2. If absent, reads `code` from the query string and calls `supabase.auth.exchangeCodeForSession(code)`.
3. Keeps `onAuthStateChange` active while the bootstrap resolves.

The browser client has `detectSessionInUrl`, `persistSession`, and token auto-refresh enabled (`src/services/supabase.js`). Therefore the route supports the browser-detected session plus the explicit PKCE code exchange. Its effective Auth flow is **HYBRID**. No `verifyOtp`, `token_hash`, or direct hash parsing exists in this route.

On a valid session, `src/pages/CriarSenha.jsx` renders the initial-access password UI. `src/components/DefinirSenhaForm.jsx` obtains the user, calls `supabase.auth.updateUser({ password })`, then calls `claimPendingStudentInvite()` and only then redirects to `/minha-area`. A failed post-password claim has a claim-only retry; it does not repeat the password update.

## Primary business flow and link generation

The current first-access recipient is a newly invited **student/aluno**, sent by their professional through the student-access UI.

```text
Professional action in AlunosList
  -> studentAccessService / student-access-invite Edge Function
  -> auth.admin.inviteUserByEmail(email, { redirectTo }) [first invite]
  -> Supabase Auth email
  -> /criar-senha
  -> invite session bootstrap
  -> auth.updateUser({ password })
  -> claim_pending_student_invite()
  -> /minha-area
```

For an already-created pending invited Auth user, the same function uses `auth.resetPasswordForEmail(email, { redirectTo })` to resend access. The route accepts the resulting valid session, so the implementation intentionally supports that recovery-style resend as well.

`supabase/functions/student-access-invite/index.ts` is the link generator. Its `buildRedirectTo()` selects, in order:

1. `STUDENT_INVITE_REDIRECT_TO`, when configured (the deployed value is **not verified** here); or
2. an allowlisted request `Origin` plus `/criar-senha`.

The fallback only recognizes the configured origin list plus `http://localhost:5173`, `http://127.0.0.1:5173`, and `https://www.aruka.com.br`. Thus a production request from the canonical site falls back to `https://www.aruka.com.br/criar-senha`; the legacy host is not a current runtime fallback or hard-coded redirect target.

## Redirect and Supabase configuration assessment

| Item | Result | Evidence |
| --- | --- | --- |
| Canonical route | REACHABLE | `GET https://www.aruka.com.br/criar-senha` returned HTTP 200. Direct no-session access is designed to show a safe expired/invalid-invite screen. |
| Legacy route | HTTP 308 to canonical | `GET https://consultoria-fitness-gamma.vercel.app/criar-senha` returned `Location: https://www.aruka.com.br/criar-senha`. |
| Legacy path preserved | YES | The 308 location includes `/criar-senha`. |
| Canonical redirect allowlisted remotely | NOT VERIFIED | No read-only remote Auth configuration access was available. |
| Legacy redirect allowlisted remotely | NOT VERIFIED | Same limitation. The prior-cycle baseline stated it was preserved, but it was not treated as current proof. |
| Local Supabase config | Not production evidence | `supabase/config.toml` contains local-only `site_url` and local recovery redirect URLs; it neither declares nor proves remote production Auth settings. |

The status is **F — UNKNOWN**. Current source is canonical-capable: a canonical-origin fallback requests the canonical URL, while the deployed environment variable can override it. If that requested URL is absent from the remote Auth Redirect URLs, `inviteUserByEmail` or `resetPasswordForEmail` can fail or fall back according to provider behavior. This audit did not execute either operation, create a user, or send email, so status B is a risk hypothesis rather than a supported finding.

## Comparison with `/redefinir-senha`

`/redefinir-senha` uses the same session-bootstrap design: `getSession`, then query `code` / `exchangeCodeForSession`, plus `onAuthStateChange`. It has recovery-specific invalid-link handling and a distinct redirect helper (`passwordRecoveryRedirectTo`) used by login's `resetPasswordForEmail` request.

`/criar-senha` differs in purpose and post-auth behavior: it is the invite/first-password surface, accepts the recovery-style resend session, claims the pending student invite after `updateUser`, and directs the user to `/minha-area`. The shared auth pattern is **PARTIAL** and migration risk is **MEDIUM**: the frontend and public routing are canonical, but production Auth allow-list/environment certainty is missing.

## History

- `260cca37` (2026-07-06), `perf: inicia auditoria e otimizações de performance da Aruka`: introduced the original `/criar-senha` route and screen.
- `ebd8d44` (2026-08-29), `fix: corrige convite de acesso e edição de aluno`: added the Edge Function-based student invite and the first Auth Admin invite operation.
- `ddbced2` (2026-08-30), `fix: corrige primeiro acesso pelo convite de aluno`: introduced `InviteAccessRoute`, PKCE exchange support, and invite-session handling.
- `78c0cd8` (2026-08-31), `fix: permite retomar vínculo após criar senha`: added the post-password pending-invite claim retry.
- `1406f19` and `ac447d0` (2026-08-31): recovery redirect/callback fixes for `/redefinir-senha`; they did not change the invite redirect generator.

The current source history contains no hard-coded `consultoria-fitness-gamma.vercel.app` reference. The only repository occurrence found is a historical operational report (`reports/hotfix-student-access-invite-edit-focus.md`), classified as **HISTORICAL/DOCUMENTATION**. Counts: active runtime **0**; tests **0**; documentation/historical **1**.

## Tests and validation

- Relevant tests: 18/18 PASS.
  - `src/auth/InviteAccessRoute.test.js`: route rendering, bootstrap/session, safe no-session state, and client settings.
  - `src/components/DefinirSenhaForm.test.js`: password update, invite claim ordering/retry, redirect.
  - `supabase/functions/student-access-invite/index.test.mjs`: Auth operation ordering, resend, and redirect provenance.
- Missing automated coverage: real remote allow-list validation, real invite callback, and canonical production E2E. These need a controlled non-production/test-account stage, not an audit-only mutation.
- Lint: PASS (`npm.cmd run lint`).
- Build: PASS (`npm.cmd run build`).
- Production GET-only checks: canonical `/`, `/login`, and `/criar-senha` each returned HTTP 200; no authenticated or mutating request was sent.

## Recommended migration/verification stage

1. Read and record the deployed `STUDENT_INVITE_REDIRECT_TO` value without exposing secrets; set it to `https://www.aruka.com.br/criar-senha` if it is not already canonical.
2. Confirm Supabase Auth Site URL is canonical and add/confirm the exact canonical `/criar-senha` Redirect URL.
3. Retain the legacy `/criar-senha` Redirect URL during the transition.
4. Run one approved controlled QA invite using a non-production or explicitly authorized test account; verify email link, session bootstrap, password update, pending-invite claim, and `/minha-area` arrival.
5. Inspect sanitized Auth/Function logs and observe production before assessing legacy removal in a separate, authorized cycle.

## Remote Configuration Verification (2026-09-12)

This read-only follow-up revalidated the deployed `student-access-invite` Function as **ACTIVE**. Current source still gives `STUDENT_INVITE_REDIRECT_TO` precedence over the canonical-origin fallback, and passes the resulting `redirectTo` identically to both `auth.admin.inviteUserByEmail` (first invitation) and `auth.resetPasswordForEmail` (resend). There is no legacy host in the runtime redirect implementation.

The Supabase secrets read-only endpoint confirms `STUDENT_INVITE_REDIRECT_TO` is **SET**. It returns a non-reversible stored hash rather than the secret value, so its public URL value is **NOT READABLE**. It must not be inferred from the hash or historical operational records.

The available Supabase CLI authentication can list Function/secrets metadata but could not authenticate the direct read-only Management API query for Auth configuration. Consequently, the following remote Auth configuration remains **NOT VERIFIED**:

| Remote item | Result |
| --- | --- |
| Site URL | NOT VERIFIED |
| `https://www.aruka.com.br/criar-senha` | NOT VERIFIED |
| `https://www.aruka.com.br/redefinir-senha` | NOT VERIFIED |
| `https://consultoria-fitness-gamma.vercel.app/criar-senha` | NOT VERIFIED |

**Effective invite redirect:** NOT PROVABLE. The deployed environment override is present and has precedence, but its value is unreadable. Therefore the redirect source is **UNKNOWN** and the classification remains **F — UNKNOWN**. First-invite and resend expected redirects, and their Auth allowlist matches, are also **UNKNOWN** without performing prohibited email/Auth mutations.

`STUDENT_INVITE_REDIRECT_TO` is **OPTIONAL** from a code-path perspective: browser calls from the canonical origin would safely fall back to `https://www.aruka.com.br/criar-senha`. It remains operationally useful as an explicit, deployment-controlled override, so this audit does not recommend removing it.

**Next required production action:** a project administrator with read-only Supabase Auth Dashboard/Management API access must record the exact public value of `STUDENT_INVITE_REDIRECT_TO`, the Site URL, and the three scoped Redirect URL presences. No configuration should change during that verification. If the effective URL is canonical and the canonical create-password URL is allowlisted, the next stage is a separately authorized controlled QA invite. The legacy Redirect URL must remain during that E2E.

## Controlled Production QA E2E (2026-09-12)

The stated remote Auth configuration was accepted as manual evidence for this stage: Site URL is `https://www.aruka.com.br`; canonical `/criar-senha`, legacy `/criar-senha`, and canonical `/redefinir-senha` Redirect URLs are retained/allowlisted. Non-authenticated production smoke checks returned HTTP 200 for `/`, `/login`, and `/criar-senha`.

**E2E result: NOT EXECUTED / BLOCKED BEFORE MUTATION.** The repository's only available QA profile is explicitly `local_qa`: its base URLs target localhost and its mailbox is a `.test` address. It is not evidence of a production professional/aluno QA context and cannot receive or inspect the production invitation email.

No explicitly designated production QA aluno/email/mailbox was provided or discoverable without inspecting real-user data. Sending the single permitted invitation without those controls would risk affecting an unintended account and would not permit the required one-time email-link observation. Therefore no invite request, Auth operation, email delivery, verification, password update, claim, logout, or subsequent login was attempted.

| E2E evidence | Result |
| --- | --- |
| QA user initial state | NOT DETERMINED — no approved production QA identity |
| Invite request / Auth operation | NOT EXECUTED |
| Email and `redirect_to` observation | NOT OBSERVED |
| Effective invite redirect | UNKNOWN |
| Verify / session / form / password / claim / student area / login | NOT EXECUTED |
| Auth and Function log sequences | NOT VERIFIED |
| Rate limit | NOT OBSERVED |
| Duplicate verify | NOT APPLICABLE |

**Required next input before any mutation:** provide an explicitly approved production QA professional context, an approved unlinked QA aluno/email, and controlled access to that inbox. The next mission may then send exactly one first invitation, inspect only its sanitized host/path and `redirect_to` host/path, open it once, and complete the prescribed flow. No configuration change is required by this blocked stage, and the legacy Redirect URL remains retained.

## Production Invite Callback Failure (2026-09-12)

Subsequent controlled-QA evidence supplied for diagnosis establishes that one invitation was sent and received, its Supabase link was `type=invite`, its observed `redirect_to` **host** was `www.aruka.com.br`, and the link was clicked once. The final browser URL was `https://www.aruka.com.br/#`, rendering the landing page; the expected callback was `https://www.aruka.com.br/criar-senha`. The inspected evidence did not expose the `redirect_to` path, so it must not be assumed to have contained `/criar-senha`.

### Findings

- `student-access-invite` gives `STUDENT_INVITE_REDIRECT_TO` precedence over the canonical-origin fallback. It passes that one calculated value to both first-invite `inviteUserByEmail` and resend `resetPasswordForEmail`.
- The deployed variable remains **SET**, but the read-only endpoint exposes only an unreadable hash. No historical repository/deployment record proves an exact current production value; historical records reference preview `/criar-senha` configurations and recommendations, not a current canonical-root or canonical-create-password deployment value.
- `GET https://www.aruka.com.br/criar-senha` returned **HTTP 200** with no `Location` header. This rules out an observable infrastructure redirect from the direct canonical path to `/`.
- `App.jsx` maps `/criar-senha` directly to `InviteAccessRoute > CriarSenha`; that wrapper has no navigation/`replaceState` path to `/`. The root route alone renders the landing page (except a recovery-error hash). Relevant static route tests passed **6/6**.
- The observed root path means `InviteAccessRoute` had no opportunity to execute for this callback. No application router behavior found can turn a loaded `/criar-senha` callback into `/#`.
- No accessible sanitized Auth verify log supplied status/Location, no Function log emits the computed `redirectTo`, and the invite email template could not be read remotely. Thus verify result, verify Location, Function redirect URL, and template type are **NOT VERIFIED**.

### Diagnosis

**Root cause: `UNKNOWN_CALLBACK_REDIRECT_FAILURE`.** The path was lost upstream of React routing, most plausibly because the deployed environment override is the canonical root or because Supabase fell back to Site URL. The available evidence cannot distinguish those two hypotheses, so `ENV_OVERRIDE_CANONICAL_ROOT` is not asserted as fact.

**Exact next diagnostic/fix path:** first obtain a sanitized Auth verify log `Location` (host/path only) and the public value of `STUDENT_INVITE_REDIRECT_TO`. If the override is canonical root, change it in a separately authorized configuration mission to `https://www.aruka.com.br/criar-senha`; if the override is already that exact URL, diagnose Supabase Auth redirect handling/template configuration before any further invite. Do not resend the consumed invitation or remove the legacy allowlist entry.

## Student access email management and pending-invite recovery

The resend failure was caused by `student-access-invite` treating an `invited` aluno with no corresponding `auth.users` record as irrecoverable. The repaired server contract retains ownership checks and now creates a new Auth invite when that pending Auth user is absent; when it exists, resend continues to use password recovery.

Access states remain schema-compatible: **NO_ACCESS_EMAIL** is `not_invited` (with an optional saved, uninvited e-mail); **PENDING_INVITE** is `invited` with no `student_user_id`; **ACTIVE_ACCESS** is an active linked account. Only pending, unlinked access exposes edit, resend, and remove actions. Editing validates format, rejects existing Auth users and another active/pending access e-mail, then clears the pending state so the professional deliberately sends a fresh invite. Removal clears e-mail and pending metadata without deleting the aluno or any Auth user.

The implementation uses the existing authenticated Edge Function and service-role ownership checks; it requires no database, schema, migration, or RLS change. Canonical redirect selection is untouched. Static contract tests cover lifecycle actions, missing-Auth resend recreation, edit/remove eligibility, duplicate protection, ownership guard presence, and canonical redirect provenance. Deployment and production QA validation are intentionally separate from this local implementation stage.

## Production Student Access Management Validation

Functional PR #120 was merged in `7bda685578a4ac62100d7cdf6bd8056c326f6504`; `student-access-invite` is ACTIVE and production smokes passed. Controlled human QA confirmed: resend without an Auth user PASS; canonical `redirect_to` host `www.aruka.com.br` and path `/criar-senha`; one-click browser landing at `/criar-senha` with Auth fragment; first-access UI, password update, pending-invite claim, and `/minha-area` PASS.

Pending email edit, cancel, removal with confirmation, re-add, and active-access protection all passed. No network capture was retained for verify HTTP status or Location, so those values are explicitly **NOT_CAPTURED**; functional browser landing is PASS and no invitation was repeated for evidence collection.

Final root causes resolved: `PENDING_INVITE_WITHOUT_AUTH_USER_UNRECOVERABLE` (resend now recreates an Auth invite) and `ENV_OVERRIDE_CANONICAL_ROOT` (effective redirect is now canonical `/criar-senha`). No database, schema, migration, RLS, SMTP, rate-limit, Auth URL, or legacy-redirect change occurred in this closeout.

## Guardrail record

Database changes: NO
Schema changes: NO
RLS changes: NO
Supabase changes: NONE
Production mutations: NONE
Legacy redirect removal: NOT AUTHORIZED IN THIS MISSION
