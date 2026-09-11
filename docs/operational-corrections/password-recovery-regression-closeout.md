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

1. Confirm the production **Site URL** is `https://consultoria-fitness-gamma.vercel.app`.
2. Add the exact production redirect URL `https://consultoria-fitness-gamma.vercel.app/redefinir-senha` to **Redirect URLs**.
3. If preview QA is supported, add a scoped Vercel pattern such as `https://*-<vercel-team-or-account>.vercel.app/**`; otherwise validate only production.
4. Inspect the **Reset Password** email template. It must preserve Supabase's generated confirmation URL and must not replace the supplied redirect with a hard-coded `{{ .SiteURL }}`. When a custom template assembles URLs, use `{{ .RedirectTo }}` as documented by Supabase.

The exact redirect must be allow-listed for Supabase to honor `redirectTo`; the Site URL is the fallback when none is supplied. Sources: [Supabase password reset API](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail) and [Supabase redirect URL configuration](https://supabase.com/docs/guides/auth/redirect-urls).

## Manual QA still required

After deploying this branch and applying the approved dashboard configuration, request a new recovery email for a QA account. Verify its `redirect_to` ends in `/redefinir-senha`, complete a password reset, then log in with the new password. Also open `/redefinir-senha` without a valid recovery context and confirm the clear invalid-link message and login link.

No tokens, passwords, database changes, RLS changes, or remote production mutations were made.

## Remote verification (2026-09-11)

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

### Current classification

The historical email evidence is consistent with a stale/legacy hostname redirect and the then-active frontend or Auth configuration using the root as its destination. The production frontend/deployment SHA and the remote Auth settings remain unverified, so a definitive distinction between **stale production deployment**, **missing Redirect URL**, and **template override** is not yet possible.

### Required operational unblock

1. Provide read-only Vercel access (or a valid CLI token) to identify the deployment SHA and branch associated with `www.aruka.com.br` and the legacy hostname.
2. Provide read-only Supabase Auth access to inspect Site URL, Redirect URLs, and the recovery-email template.
3. Provide an authorized QA inbox/account or have an authorized operator run the diagnostic request and share only the sanitized `redirect_to` host/path and final route.
4. If the exact canonical recovery URL is absent, explicitly authorize adding `https://www.aruka.com.br/redefinir-senha` to Supabase Redirect URLs. Do not change the Site URL or email template without evidence and separate approval.
