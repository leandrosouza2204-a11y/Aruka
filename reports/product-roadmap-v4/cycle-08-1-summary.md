# Cycle 08.1 Summary

Decision: ready for final manual review.

Implemented:

- One installable Aruka PWA through `vite-plugin-pwa`.
- Manifest with `/` start URL, `/` scope, standalone display and role-neutral app name.
- PWA icons derived from the current Aruka app icon.
- Role-aware install prompt for professional and student experiences.
- Android/Chromium `beforeinstallprompt` handling with explicit user action.
- iOS Safari manual Add to Home Screen guidance.
- Device-level dismissal for 14 days.
- Prompt-based service worker update flow with no automatic reload.
- Active workout update guard.
- Static QA scripts for installability, role copy, install state, update safety and cache security.

Security posture:

- Supabase API/auth runtime cache: network only.
- Sensitive API cache: no.
- YouTube runtime cache: no.
- Cross-user private cache leak: no service-worker private API cache.

Validation executed:

- PWA unit tests: PASS.
- `qa:pwa-installability`: PASS.
- `qa:pwa-role-install-experience`: PASS.
- `qa:pwa-install-state`: PASS.
- `qa:pwa-update-safety`: PASS.
- `qa:pwa-cache-security`: PASS.
- `npm.cmd run build`: PASS, generated `dist/manifest.webmanifest`, `dist/sw.js` and `dist/workbox-2fbc6a65.js`.
- Precache: 101 entries, 13955.62 KiB.
- `npm.cmd run lint`: PASS.
- `qa:visible-ui-copy`: PASS.
- Cycle 08 static/student timer/video/load checks: PASS; local actual-load runtime blocked because the Supabase DB container for project `ConsultoriaFitness` was not running.
- Cycle 07: PASS after pointing runtime to preview.
- Cycle 06.1: PASS.
- Cycle 06: PASS.
- Student access lifecycle: PASS.
- Student daily runtime: blocked because the Supabase DB container for project `ConsultoriaFitness` was not running.
- Finance WhatsApp, workflow reliability, mutation confirmations, billing due attention and semantic navigation: PASS.
- Finance modals CDP: inconclusive, interrupted after no progress on the 375px viewport.
- Authenticated runtime suite: BLOCKED by authenticated browser origin mismatch.
- Billing attention runtime: BLOCKED by `localhost` connection refused in the runtime harness.

Manual validation still required:

- Android real device install/relaunch.
- iOS real device Add to Home Screen/relaunch.
- Desktop Chrome/Edge install surface.

## PR54 sync with post-hotfix main

Execution date: 2026-08-31

Sync:

- PR #55 state before sync: MERGED
- Main source commit: `4b56e4f78fbb4dfc95c050539f2a6718fcdb83a9`
- PR #54 previous head: `8de52cebfc428eec6e3e9cfcddc85b243e29face`
- Merge method: `git merge origin/main`
- Sync conflicts: NO
- Conflict files: none
- PWA functional content preserved: YES
- PR #54 merge performed: NO
- Preserved local files: runtime/report artifacts stashed under `wip: preserved runtime reports before pr54 sync`

Auth regression:

- Professional login contract: PASS
- Student login contract: PASS
- Student area `/minha-area`: PRESERVED
- Invite route `/criar-senha`: PRESERVED
- Password recovery route `/redefinir-senha`: PRESERVED
- Pending claim: PASS
- Legacy recovery redirect reintroduced: NO

Database and Supabase:

- Local migrations: 17
- Remote migrations: 17
- Pending: 0
- Strict CI baseline: 17
- New DB mutation during sync: NO
- `STUDENT_INVITE_REDIRECT_TO` changed: NO
- Secrets changed: NO

PWA:

- `vite-plugin-pwa`: PRESENT
- App name: Aruka
- Single PWA: YES
- Manifest built: `dist/manifest.webmanifest`
- Service worker built: `dist/sw.js`
- Workbox built: `dist/workbox-2fbc6a65.js`
- Manifest `start_url`: `/`
- Manifest `scope`: `/`
- Display: `standalone`
- Install prompt: PASS
- Dismissal: 14 days
- iOS guidance: PASS
- Update UX: PASS
- Offline shell: PASS
- Sensitive API runtime cache: NO

Validation:

- `qa:pwa-installability`: PASS
- `qa:pwa-role-install-experience`: PASS
- `qa:pwa-install-state`: PASS
- `qa:pwa-update-safety`: PASS
- `qa:pwa-cache-security`: PASS
- `qa:supabase-ci-static`: PASS
- `qa:student-access-lifecycle`: PASS
- `qa:student-identity-contract`: PASS
- `qa:student-account-linking`: PASS
- `qa:visible-ui-copy`: PASS
- `lint`: PASS
- `build`: PASS
- `qa:authenticated-runtime-precheck`: PASS after starting local Vite dev server

Follow-up:

- `AUTH_DELETE_LIFECYCLE_FOLLOWUP_REQUIRED=YES`
- `LEGACY_SITE_URL_REVIEW_REQUIRED=YES`
- `PREVIEW_REDIRECT_CLEANUP_FOLLOWUP=YES`
- `PRODUCTION_INVITE_REDIRECT_CUTOVER_REQUIRED=YES`
- Android install QA: NOT_RUN
- iOS install QA: NOT_RUN
