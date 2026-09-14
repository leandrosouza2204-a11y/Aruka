# Legacy Supabase Auth redirects audit

Date: 2026-09-13  
Scope: read-only audit. No Supabase, Vercel, application, database, email, or deployment mutation was made.

## Decision

**INCONCLUSIVE.** `LEGACY_ROOT` has no current runtime dependency and is a low-risk candidate for a future incremental removal. `LEGACY_CREATE_PASSWORD` cannot yet be classified `SAFE_TO_REMOVE`: a still-valid historical first-access/resend email could carry that exact `redirect_to`, and this audit has no production token-expiration/issued-link inventory with which to bound that risk. This is not evidence of a current dependency.

## Scope and baseline

| Item | Result |
| --- | --- |
| Source branch / source HEAD | `main` / `bebac669675aca50fa983625b705f39e9a95f9d9` |
| Audit branch / starting HEAD | `audit/legacy-auth-redirects` / `bebac669675aca50fa983625b705f39e9a95f9d9` |
| Supplied prior E2E evidence | Invite used `https://www.aruka.com.br/criar-senha`, completed password update, claim, and `/minha-area`: PASS. Recovery using `https://www.aruka.com.br/redefinir-senha`: PASS. |
| Remote Auth configuration | **NOT_READABLE** in this environment: no Supabase CLI is installed and no authenticated read-only management/dashboard access is available. The mission baseline is recorded as manual prior-cycle evidence, not as a fresh remote read. |
| Manual prior-cycle configuration | Site URL `https://www.aruka.com.br`; redirects included legacy root, localhost, legacy `/criar-senha`, canonical recovery, and canonical `/criar-senha`. |
| `STUDENT_INVITE_REDIRECT_TO` | **SET** (prior read-only metadata evidence); value is not readable here. The supplied E2E proves its effective invite redirect was canonical `/criar-senha`. |

## Runtime and Auth-flow evidence

Repository searches covered `src/`, `supabase/functions/`, `scripts/`, Vercel configuration, tests, reports, and documentation for the requested host, redirect terms, Auth APIs, and paths.

* `consultoria-fitness-gamma.vercel.app` has **zero** production runtime references. Its current repository occurrences are historical documentation: `docs/operational-corrections/password-recovery-regression-closeout.md` and `reports/hotfix-student-access-invite-edit-focus.md`. They are `HISTORICAL/DOCUMENTATION`, not operational configuration.
* `src/auth/Login.jsx:74-76` sends password recovery with `redirectTo: passwordRecoveryRedirectTo()`. `src/auth/passwordRecoveryRedirect.js:1-5` returns `<window.location.origin>/redefinir-senha`; on the canonical host this is `https://www.aruka.com.br/redefinir-senha`. It has no legacy-host constant or configuration fallback.
* `supabase/functions/student-access-invite/index.ts:325-330` gives `STUDENT_INVITE_REDIRECT_TO` precedence. If it is absent, its fallback accepts only configured allowed origins plus localhost and `https://www.aruka.com.br` (`:370-377`), then appends `/criar-senha`. The legacy host is neither hard-coded nor a fallback origin.
* That Function sends the same calculated redirect to `auth.admin.inviteUserByEmail` (first invitation, `:137-139`) and `auth.resetPasswordForEmail` (pending-invite resend, `:119-121`). Thus the resend is invite-related, not the frontend recovery flow.
* Other discovered Auth calls are password sign-in and `signUp` in `src/auth/Login.jsx`; neither supplies a legacy redirect. No magic-link, OAuth, MFA, email-change, or other redirect-bearing Auth call was found.

The fallback is a **potential fallback**, not an active production dependency: given the supplied `STUDENT_INVITE_REDIRECT_TO`/E2E evidence it is overridden, and even without the override a canonical-origin request resolves to the canonical create-password route.

## HTTP evidence (HEAD, 2026-09-13)

| URL | Status | Location / result |
| --- | --- | --- |
| `https://consultoria-fitness-gamma.vercel.app/` | 308 | `https://www.aruka.com.br/` |
| `https://consultoria-fitness-gamma.vercel.app/criar-senha` | 308 | `https://www.aruka.com.br/criar-senha` |
| `https://consultoria-fitness-gamma.vercel.app/login` | 308 | `https://www.aruka.com.br/login` |
| `https://consultoria-fitness-gamma.vercel.app/redefinir-senha` | 308 | `https://www.aruka.com.br/redefinir-senha` |
| `https://www.aruka.com.br/` | 200 | canonical route available |
| `https://www.aruka.com.br/login` | 200 | canonical route available |
| `https://www.aruka.com.br/criar-senha` | 200 | canonical route available |
| `https://www.aruka.com.br/redefinir-senha` | 200 | canonical route available |

The legacy hostname is therefore an active HTTP-level permanent redirect/technical alias to the canonical deployment; it is not a secondary application origin. No redirect chain was followed automatically; the one-hop `Location` values above are the recorded chain.

## History and documentation

`git log -S/-G` shows the legacy hostname entered repository history as operational incident/configuration record around the August–September Auth correction work. The historical recovery report records the previous legacy Site URL and why the canonical recovery URL was added. Commits `1406f19` (recovery redirect construction), `bf2d2d6`/`74c92f8` (canonical recovery closeout), and the 2026-09-12 invite validation record the migration to canonical paths. No versioned runtime code has ever hard-coded this host.

The historical reports are `HISTORICAL_RECORD`; they must not be interpreted as current runtime references. Existing create-password audit documentation remains a historical/validation record. No documentation was removed.

## Dependency matrix

| Redirect | Runtime reference | Current Auth flow | Frontend | Edge Function | Recovery | Invite | Historical only | HTTP behavior | Risk | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `LEGACY_ROOT` — `https://consultoria-fitness-gamma.vercel.app` | NO | NO | NO | NO | NO | NO | YES | 308 to canonical `/` | LOW | **SAFE_TO_REMOVE** |
| `LEGACY_CREATE_PASSWORD` — `https://consultoria-fitness-gamma.vercel.app/criar-senha` | NO | NO | NO | NO | NO | NO (current flow is canonical) | YES | 308 to canonical `/criar-senha` | MEDIUM | **INCONCLUSIVE** |

`RECOVERY_CANONICAL=YES`; `RECOVERY_LEGACY_DEPENDENCY=NO`.

`INVITE_CANONICAL=YES` from supplied E2E and source routing; `INVITE_LEGACY_DEPENDENCY=NO` for current code/configuration evidence. The exact secret value is not freshly readable, so the conclusion does not claim a new remote secret inspection.

## Old issued-email risk

`OLD_EMAIL_LINK_IMPACT=INCONCLUSIVE`. Supabase links are single-use and finite-lived, so old tokens are likely consumed or expired, but this audit may not assume the production expiration or inspect real-user/Auth-log data. A still-valid historic link bearing the legacy root would land on the canonical root after HTTP redirect; a still-valid legacy `/criar-senha` invite/resend link could be more sensitive if removal makes Supabase reject its stored redirect and fall back to Site URL. This is the sole reason the create-password entry is not safe to remove now.

## Future removal and rollback

No removal is authorized in this mission. If a separately authorized removal is made, rollback is to re-add the exact removed Redirect URL to Supabase Auth.

* `ROLLBACK_FEASIBLE=YES`
* `ROLLBACK_COMPLEXITY=LOW`
* Recommended order: remove `LEGACY_ROOT` first in a separate, incremental mission; observe Auth smokes/logs through at least the configured maximum email-token lifetime before reassessing `LEGACY_CREATE_PASSWORD`.

Before any create-password removal, obtain read-only evidence of the maximum production email-token lifetime (or wait beyond it since the last legacy issuance), and confirm the current Site URL, both canonical paths, and the effective canonical invite redirect. No new invite or recovery email is needed for this audit.

## Validation and guardrails

* Code changes: NO. Documentation change only: this file.
* Supabase / Vercel / production mutations: NO.
* Database / schema / RLS changes: NO.
* Auth emails sent: 0.
* Push / PR / merge / force push: NO.

