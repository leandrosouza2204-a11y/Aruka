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

## Guardrail record

Database changes: NO  
Schema changes: NO  
RLS changes: NO  
Supabase changes: NONE  
Production mutations: NONE  
Legacy redirect removal: NOT AUTHORIZED IN THIS MISSION
