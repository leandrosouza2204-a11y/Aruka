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
