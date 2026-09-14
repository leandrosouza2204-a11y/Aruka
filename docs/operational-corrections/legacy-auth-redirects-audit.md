# Legacy Supabase Auth redirects audit

Date: 2026-09-13
Scope: read-only audit. No Supabase, Vercel, application, database, email, or deployment mutation was made.

## Decision

**COMPLETE.** Neither legacy URL has a current runtime dependency. Production Email OTP/link expiration is manually verified as one hour, the canonical invite flow was proven in production on 2026-09-13, and no mechanism currently emits the legacy destination. The exact final historical legacy issuance timestamp remains unknown; that is documented residual historical uncertainty, not a current dependency.

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

## Legacy Invite Expiry Assessment (2026-09-13)

This follow-up resolves the temporal question behind the prior `INCONCLUSIVE` result without changing any Auth setting or issuing an email.

| Item | Result | Evidence / limitation |
| --- | --- | --- |
| `EMAIL_OTP_EXPIRATION_SECONDS` | **NOT_READABLE** | The Supabase CLI is not installed and this environment has no authenticated read-only Dashboard/Management API access. |
| `EMAIL_OTP_EXPIRATION_DURATION` | **UNKNOWN** | Manual confirmation required. The repository's `supabase/config.toml` says `otp_expiry = 3600`, but it is explicitly local configuration and is not production evidence. |
| Configuration source | `NOT_READABLE` | Do not infer production configuration from local TOML or Supabase's documented default. |
| Last known legacy create-password invite | **UNKNOWN** | No sanitized email, Auth log, deployment log, or configuration-history record proves that the exact `https://consultoria-fitness-gamma.vercel.app/criar-senha` value was issued at a particular time. A root-only or canonical-root observation is not evidence for this path. |
| Last known canonical invite | `2026-09-13T22:16:36-03:00` at the latest documentary evidence | Commit `de43d1d` records controlled human QA with `redirect_to` host `www.aruka.com.br` and path `/criar-senha`; this timestamp is the record time, not an asserted email-issue time. |
| Canonical migration cutoff | **UNKNOWN** | Canonical E2E proves a canonical issuance by the above evidence point, but the available records do not establish the last possible legacy-path issuance. |
| Current runtime/invite dependency | `NO` | As established above: no legacy host in frontend or Function redirect construction; active-path evidence is canonical. |

### Required safe age

The removal formula is `SAFE_AGE = production Email OTP Expiration + SAFE_REMOVAL_MARGIN`, where `SAFE_REMOVAL_MARGIN = max(1 hour, 2 × production Email OTP Expiration)`. It cannot be calculated until the current production **Email OTP Expiration** value is read. Consequently, `EARLIEST_SAFE_REMOVAL_TIME=UNKNOWN`.

The documented Supabase default of 3600 seconds is deliberately not substituted here: the mission requires the effective project setting, which may differ. The next read-only action is for an authorized operator to open Supabase Dashboard **Authentication → Settings** and provide only the numeric Email OTP Expiration value (no screenshot or secret is needed). If it is available, the operator should also provide the last known time an invite using the legacy create-password redirect could have been issued; otherwise the safe waiting window must be anchored to a separately auditable configuration-migration timestamp.

### Follow-up classification

`LEGACY_ROOT` remains **SAFE_TO_REMOVE** (LOW risk). `LEGACY_CREATE_PASSWORD` remains **INCONCLUSIVE** (MEDIUM risk), solely because neither the production validity interval nor a conservative last-possible legacy issuance time is evidenced. This is not a runtime, frontend, Edge Function, recovery, or current-invite dependency. No Redirect URL was removed.

## Production expiry confirmation and final classification (2026-09-13)

This section supersedes the preliminary expiry assessment above. An operator read the production Supabase Dashboard at **Authentication -> Sign In / Providers -> Email**. No setting was changed.

| Item | Final result |
| --- | --- |
| `EMAIL_OTP_EXPIRATION_SECONDS` | **3600** |
| `EMAIL_OTP_EXPIRATION_DURATION` / `TOKEN_VALIDITY_WINDOW` | **1 hour** |
| Configuration source | `MANUAL_PRODUCTION_DASHBOARD` |
| Production configuration changed | NO |
| `HISTORICAL_LAST_LEGACY_TIMESTAMP` | **UNKNOWN** |
| Canonical production evidence | **2026-09-13**: invite `redirect_to=https://www.aruka.com.br/criar-senha` -> `/criar-senha` -> password -> claim -> `/minha-area`: PASS |
| Current legacy runtime / frontend / Edge Function / recovery / invite dependency | **NO** |
| Safety margin | **2 hours** (2 x Email OTP expiration) |
| Rollback | Re-add the exact Redirect URL; feasible YES, complexity LOW |

The 2026-09-13 canonical production evidence is older than the one-hour token validity plus the two-hour conservative margin at this follow-up. It is not presented as the last legacy issuance: the historical last legacy timestamp remains unknown. The residual risk is therefore `DOCUMENTED_HISTORICAL_TIMESTAMP_UNKNOWN`, mitigated by the one-hour maximum observed production link validity, lack of any runtime mechanism that can now generate the legacy target, positive canonical production evidence, and absence of evidence of a later legacy emission.

Final classifications:

| Redirect | Risk | Recommendation |
| --- | --- | --- |
| `https://consultoria-fitness-gamma.vercel.app` | LOW | **SAFE_TO_REMOVE** |
| `https://consultoria-fitness-gamma.vercel.app/criar-senha` | LOW | **SAFE_TO_REMOVE** |

Recommended future removal order is incremental: first the legacy root; validate Auth smokes and retain immediate rollback; then remove the legacy create-password URL. This document does not authorize or perform either removal.

## Legacy Redirect Removal - Production Validation

**Decision: COMPLETE. Final status: RESOLVED.** This record is sanitized: it contains no email address, token, OTP, verification URL, user identifier, IP address, password, or screenshot.

### Final Auth URL configuration

Manual production Dashboard verification after the incremental removal recorded:

| Item | Final value |
| --- | --- |
| Site URL | `https://www.aruka.com.br` |
| Redirect URL count | 3 |
| Redirect URLs | `http://localhost:5173/`; `https://www.aruka.com.br/redefinir-senha`; `https://www.aruka.com.br/criar-senha` |
| Legacy root | REMOVED |
| Legacy create-password URL | REMOVED |
| Legacy redirects remaining | NO |
| Canonical recovery / create-password / localhost preserved | YES / YES / YES |
| Email OTP expiration | 3600 seconds (1 hour), `MANUAL_PRODUCTION_DASHBOARD` evidence |
| Audit safety margin | 2 hours |

No Site URL, canonical redirect, Email OTP expiration, SMTP, rate limit, secret, Edge Function, database, schema, migration, RLS, or application-code setting was changed as part of removal.

### Incremental removal checks

| Check | Stage 1: legacy root | Stage 2: legacy create-password |
| --- | --- | --- |
| Removal/configuration checkpoint | PASS | PASS |
| Canonical `/`, `/login`, `/criar-senha`, `/redefinir-senha` | HTTP 200, PASS | HTTP 200, PASS |
| Legacy root HTTP behavior | 308 to canonical root | 308 to canonical root |
| Legacy `/criar-senha` HTTP behavior | 308 to canonical `/criar-senha` | 308 to canonical `/criar-senha` |
| Legacy routing | PASS | PASS |
| Focused Auth tests | 32/32 PASS | 32/32 PASS |
| Decision | `PROCEED_STAGE_2` | `COMPLETE` |

Removal from the Supabase Auth allowlist does not change the legacy Vercel hostname's HTTP-level permanent redirects; both legacy routes retain their equivalent canonical 308 destination.

### Post-removal controlled Auth QA

Operator-supplied production QA evidence confirms:

| Flow | Sanitized result |
| --- | --- |
| Password recovery email | PASS; `redirect_to` host `www.aruka.com.br`, path `/redefinir-senha` |
| Password recovery browser/UI | final host `www.aruka.com.br`, final path `/redefinir-senha`, fragment present/empty, **Redefina sua senha** UI PASS |
| Student invite email | PASS; `redirect_to` host `www.aruka.com.br`, path `/criar-senha` |
| Student invite browser/UI | final host `www.aruka.com.br`, final path `/criar-senha`, fragment present/empty, **Crie sua senha de acesso** UI PASS |
| First access | PASS; create-password callback PASS; authenticated student area PASS; post-flow `MINHA_AREA_CONFIRMED` |
| Password update / claim | `NOT_SEPARATELY_CAPTURED`; not inferred beyond the confirmed authenticated first-access outcome |

### Rollback and conclusion

No regression attributable to the removals was observed. `ROLLBACK_REQUIRED=NO`; `ROLLBACK_EXECUTED=NO`. Rollback remains feasible with LOW complexity by re-adding individually the exact Redirect URL that would regress.

The runtime had no current dependency on either legacy redirect before removal; both were removed incrementally with a checkpoint between stages. Canonical routes remained available, recovery continued to `/redefinir-senha`, invitations continued to `/criar-senha`, first access reached the authenticated student area, and the legacy Vercel host continues its canonical HTTP redirects.

`LEGACY_AUTH_REDIRECT_MIGRATION=RESOLVED`.
