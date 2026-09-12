# Password Recovery Regression - Closeout

## Symptom and reproduction

A request made from `/login` successfully sent the Supabase recovery email, but the email evidence contained `redirect_to=https://consultoria-fitness-gamma.vercel.app`. Opening it reached the public landing page rather than the password-reset experience.

## Expected and found behavior

The recovery request must redirect to `/redefinir-senha`, where the recovery session is restored and `supabase.auth.updateUser({ password })` is available. The current repository code does this: `passwordRecoveryRedirectTo()` creates `<active-origin>/redefinir-senha`, and the route is public and separate from all protected and invite routes.

The observed root-only redirect cannot be produced by the current source. It is consistent with Supabase Auth using its configured Site URL after rejecting/ignoring a redirect URL, an email template using `{{ .SiteURL }}` rather than `{{ .ConfirmationURL }}`/`{{ .RedirectTo }}`, or a Vercel deployment that predates commit `1406f19`.

## History

- `38a9247573c3ffb9eb4a59258431a486527452d2` introduced the dedicated password recovery route, password form, and PKCE/session recovery handling.
- `1406f190477dbd10e10af9a1e863ec9782d360b1` fixed the request redirect from an inline URL to `passwordRecoveryRedirectTo()`, preserving the active deployment origin and appending `/redefinir-senha`.
- The current `main` HEAD contains `1406f19`; no later source change removing that path was found. A source-level regression commit was not identified.

## Implemented hardening

- Invalid, expired, malformed, or failed PKCE recovery initialization now consistently shows the invalid-link state rather than failing the route bootstrap.
- That state provides a direct, safe path back to `/login` to request a new recovery email.
- The versioned local Supabase configuration now mirrors Vite's local port and explicitly allows the local recovery route. It does not change any remote Supabase project.

## Auth mechanism

The route supports Supabase's implicit session restoration through `getSession()` and the PKCE callback through `code` plus `exchangeCodeForSession()`. Its auth listener then admits an authenticated recovery session, and the form validates the existing password policy before calling `updateUser({ password })`.

## Required Supabase Dashboard verification (external, not performed)

In **Authentication -> URL Configuration** for the production Supabase project:

1. Inspect the current production **Site URL**; do not change it based on this report alone.
2. Verify the exact canonical redirect URL `https://www.aruka.com.br/redefinir-senha` is in **Redirect URLs**. Preserve valid legacy URLs until their impact is reviewed.
3. If preview QA is supported, add a scoped Vercel pattern such as `https://*-<vercel-team-or-account>.vercel.app/**`; otherwise validate only production.
4. Inspect the **Reset Password** email template. It must preserve Supabase's generated confirmation URL and must not replace the supplied redirect with a hard-coded `{{ .SiteURL }}`. When a custom template assembles URLs, use `{{ .RedirectTo }}` as documented by Supabase.

The exact redirect must be allow-listed for Supabase to honor `redirectTo`; the Site URL is the fallback when none is supplied. Sources: [Supabase password reset API](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail) and [Supabase redirect URL configuration](https://supabase.com/docs/guides/auth/redirect-urls).

## Manual QA still required

After deploying this branch and applying the approved dashboard configuration, request a new recovery email for a QA account. Verify its `redirect_to` ends in `/redefinir-senha`, complete a password reset, then log in with the new password. Also open `/redefinir-senha` without a valid recovery context and confirm the clear invalid-link message and login link.

No tokens, passwords, database changes, RLS changes, or remote production mutations were made.

## Remote verification (2026-09-11)

### Canonical-domain record

- `CANONICAL_HOST=https://www.aruka.com.br`
- `LEGACY_HOST=https://consultoria-fitness-gamma.vercel.app`
- `CANONICAL_RECOVERY_URL=https://www.aruka.com.br/redefinir-senha`

The canonical host and expected recovery route are established by public HTTP verification. They are not, by themselves, evidence that the remote Supabase **Site URL** has the same value; that setting remains unverified.

### Public deployment evidence

- `https://consultoria-fitness-gamma.vercel.app` returned HTTP `308` and redirects to `https://www.aruka.com.br/`. Therefore it is not the canonical application origin and a root-only redirect sent to that legacy hostname inevitably ends at the public landing page.
- `https://consultoria-fitness-gamma.vercel.app/redefinir-senha` returned HTTP `308` to `https://www.aruka.com.br/redefinir-senha`; the legacy-host redirect preserves this path. Thus the historical root-only email URL proves the recovery redirect lacked `/redefinir-senha` before the browser reached Vercel.
- `https://www.aruka.com.br/` returned HTTP `200` from Vercel.
- `https://www.aruka.com.br/redefinir-senha` returned the application shell (`200`), confirming that the canonical production host supports the password-reset deep link rather than redirecting it to `/`.
- Vercel CLI authentication is invalid in the available environment, so the production deployment SHA, branch, deployment timestamp, environment metadata, and comparison with `1406f19`/`ac447d0` could not be verified through Vercel's API.

### Remote Auth evidence not available

- Supabase **Site URL**: not verified; no authorized authenticated Dashboard/management access is available.
- Supabase **Redirect URLs**: not verified; specifically, the presence of `https://www.aruka.com.br/redefinir-senha` and the legacy hostname route must be checked in the Dashboard.
- Password-recovery template: not verified; its use of `{{ .ConfirmationURL }}`, `{{ .RedirectTo }}`, or a hard-coded `{{ .SiteURL }}` could not be inspected.
- Diagnostic recovery request and email inspection: not run; no QA-account/email access was provided. No token was requested, read, or recorded.

### Frontend environment audit

- The application reads only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for its browser Supabase client. Their values were not read or printed.
- No versioned source reference to `SITE_URL`, `APP_URL`, `VERCEL_URL`, or a configured Auth redirect base was found. The recovery redirect is derived solely from `window.location.origin` and `/redefinir-senha`.
- Consequently, when the current frontend runs at `https://www.aruka.com.br`, its tested expected redirect is `https://www.aruka.com.br/redefinir-senha`.

### Current classification

**Root cause: `LEGACY_SITE_URL_AND_REJECTED_REDIRECT`.** The remote Supabase Dashboard evidence supplied on 2026-09-12 established that the Site URL is the legacy hostname and the canonical recovery URL is absent from Redirect URLs. A new, sanitized recovery email then showed `type=recovery` with the legacy root as `redirect_to`. This rules out the current frontend, which derives the canonical origin plus `/redefinir-senha`, and there is no evidence of a custom recovery-template override.

The resulting broken path is: canonical frontend request expected -> canonical recovery URL rejected by Supabase -> legacy Site URL fallback -> HTTP 308 from the legacy host -> canonical landing-page root.

### Supabase Auth state supplied by the operator (before correction)

- **Site URL:** `https://consultoria-fitness-gamma.vercel.app` (`LEGACY`).
- **Redirect URLs preserved in the project:**
  - `https://consultoria-fitness-gamma.vercel.app`
  - `http://localhost:5173/`
  - `https://consultoria-fitness-gamma.vercel.app/criar-senha`
- **Canonical recovery redirect:** `https://www.aruka.com.br/redefinir-senha` — `MISSING`.
- **Recovery template:** `DEFAULT`; the Dashboard indicates custom SMTP is required to edit templates, and there is no custom-template override evidence.

### Approved remote correction, not performed from this environment

1. Change Supabase Auth **Site URL** from `https://consultoria-fitness-gamma.vercel.app` to `https://www.aruka.com.br`.
2. Add the exact Redirect URL `https://www.aruka.com.br/redefinir-senha`.

Do not remove any existing Redirect URL, do not alter the template, and do not configure SMTP. The Supabase CLI and an authenticated Supabase Dashboard integration are unavailable in this environment, so these approved remote mutations were not executed here.

### Post-change QA required

Request a **new** recovery email from `https://www.aruka.com.br/login` using an authorized QA account. Record only `type=recovery` and the sanitized host/path; it must be `https://www.aruka.com.br/redefinir-senha`. Then verify the reset form, password update, login with the new password, and consumed-link invalid state.

## Post-redirect-fix OTP investigation

### Confirmed state

- Supabase Auth URL configuration was subsequently corrected by an authorized operator: Site URL is canonical and the canonical recovery redirect is present.
- A newly issued recovery link uses the canonical host, but its first reported human click ended at a sanitized Auth fragment with `error=access_denied` and `error_code=otp_expired`.
- This is classified as `OTP_ALREADY_INVALID_AT_VERIFY`, not a redirect failure.
- Root cause 1 remains `LEGACY_SITE_URL_AND_REJECTED_REDIRECT` (**resolved**). Root cause 2 is currently `UNKNOWN_OTP_INVALIDATION` pending Auth-log evidence.

### UX hardening implemented

The application now detects exactly the expired-recovery Auth fragment (`access_denied` plus `otp_expired`) when Supabase returns it at `/`. It renders the existing invalid/expired recovery state rather than the landing page, provides a link to request another recovery email, and clears the complete fragment with `history.replaceState`. It neither logs nor retains token-bearing URL parameters, retries verification, or recreates a session.

### Operational evidence still required

1. In Supabase Auth logs, compare the first `/auth/v1/verify` timestamp/result with the human click. A successful verify before the human click followed by `otp_expired` is evidence for `EMAIL_PREFETCH_CONSUMED_RECOVERY_TOKEN`.
2. Record the configured Email OTP expiration value and the number/timing of recovery requests for the QA account.
3. Run one controlled Gmail recovery and one controlled Yahoo recovery: one request, no preview/prefetch interaction, one click only. Record only PASS/FAIL and sanitized host/path.

Do not change the email template, SMTP, OTP expiry, or implement a custom OTP/intermediate-page flow until this evidence distinguishes prefetch, request replacement, or abnormal expiration.

### Required operational unblock

1. An operator with Supabase Dashboard access must perform the two approved URL Configuration changes above.
2. An authorized QA operator must perform the post-change recovery, password-update, login, and consumed-link checks without sharing a token or password.
3. Push and PR remain separate actions that require explicit authorization.
4. Audit `/criar-senha` separately before migrating or removing its legacy redirect.
