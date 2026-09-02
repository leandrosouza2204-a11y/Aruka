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

PR #54 Preview after sync:

- PR head after sync: latest pushed PR #54 head after documentation commit
- Preview URL: `https://aruka-git-feat-product-roadmap-v4-cy-83978b-leandrosouzafitness.vercel.app`
- Preview matches PR head: YES
- GitHub Actions / Supabase Local Quality Gates: PASS
- Vercel: PASS
- `/`: 200
- `/login`: 200
- `/minha-area`: 200
- `/redefinir-senha`: 200
- Manifest on Preview: PASS, `application/manifest+json`
- Service worker asset on Preview: PASS, `application/javascript`
- Icons on Preview: PASS
- Service worker registration on anonymous `/login`: not active, because PWA manager is mounted in authenticated app surfaces
- Desktop installability static criteria: PASS
- Desktop install manual action: required, do not auto-install from Codex

Follow-up:

- `AUTH_DELETE_LIFECYCLE_FOLLOWUP_REQUIRED=YES`
- `LEGACY_SITE_URL_REVIEW_REQUIRED=YES`
- `PREVIEW_REDIRECT_CLEANUP_FOLLOWUP=YES`
- `PRODUCTION_INVITE_REDIRECT_CUTOVER_REQUIRED=YES`
- Android install QA: NOT_RUN
- iOS install QA: NOT_RUN

## Desktop installability QA

Execution date: 2026-08-31

Preview:

- URL: `https://aruka-git-feat-product-roadmap-v4-cy-83978b-leandrosouzafitness.vercel.app`
- PR head: `5b36943efa4b2b646e11791bfcc1678608129f35`
- Browser: Chrome Desktop

Manual QA evidence:

- Chrome install icon: PASS
- Chrome menu install: PASS
- Internal Aruka prompt: NOT_SHOWN_NON_BLOCKING
- Install completed: PASS
- App opened immediately: PASS
- Standalone launch: PASS
- Logout inside installed PWA: PASS
- Close and reopen installed PWA: PASS
- Session/app behavior after reopen: PASS
- Desktop PWA installability: PASS

Internal prompt contract:

- `beforeinstallprompt` dependency: YES
- Prompt visibility: event-dependent and conditional
- Dismissal window: 14 days
- Prompt not shown blocks native installability: NO
- Artificial prompt forcing added: NO

Android preparation:

- Android test ready: YES
- Android browser: current Chrome Android
- Preview URL: `https://aruka-git-feat-product-roadmap-v4-cy-83978b-leandrosouzafitness.vercel.app`
- Login required: YES, use controlled QA account
- Expected install surfaces: internal Aruka prompt, Chrome `Instalar app`, or Chrome `Adicionar a tela inicial` when treated as installable PWA
- Role test: professional QA required; student QA if viable
- Offline shell test: optional, NOT_RUN
- Update UX test: NOT_RUN
- iOS test: NOT_RUN

Decision: `READY_FOR_MANUAL_ANDROID_PWA_INSTALL_QA`

NEXT_ACTION=`USER_INSTALL_ARUKA_ON_ANDROID_AND_VALIDATE_STANDALONE_SESSION`

## Android PWA formal closeout

Execution date: 2026-09-01

Traceability:

- Branch: `feat/product-roadmap-v4-cycle-08-1-pwa-installability`
- Functional HEAD before closure: `c07538b5f672a37db79bceb53eaf1d87781458da`
- Functional commit: `fix: garante acesso persistente à instalação PWA`
- PR: #54
- Vercel target: `https://vercel.com/leandrosouzafitness/aruka/ACb4UmaUU87q4BZb4q2muSC6VNJg`
- Preview URL: `https://aruka-git-feat-product-roadmap-v4-cy-83978b-leandrosouzafitness.vercel.app`
- GitHub Actions run: `33517937883`
- GitHub Actions / validation: PASS
- Vercel Preview: PASS

Automated validation:

- `node --test src/features/pwa/utils/pwaInstallState.test.js src/features/pwa/utils/pwaUpdateState.test.js`: PASS
- `npm.cmd run qa:pwa-install-state`: PASS
- `npm.cmd run qa:pwa-role-install-experience`: PASS
- `npm.cmd run qa:pwa-installability`: PASS
- `npm.cmd run qa:pwa-cache-security`: PASS
- `npm.cmd run lint`: PASS
- `npm.cmd run build`: PASS
- Typecheck: NOT_APPLICABLE, no script in `package.json`

Manual Android QA:

- Banner interno after Chrome Android login: PASS
- Title `Instale o Aruka no seu celular`: PASS
- CTA `Instalar aplicativo`: PASS
- Action `Agora nao`: PASS; closes the banner and it returns after refresh when `Nao mostrar novamente` is not selected
- Checkbox `Nao mostrar novamente`: PASS; hides only the automatic banner after reload/navigation
- Mobile menu path `Mais -> Acessos adicionais -> Instalar aplicativo`: PASS
- Header hamburger action `Instalar aplicativo`: PASS
- Fallback without `beforeinstallprompt`: PASS; modal `Instalar o Aruka` shows Chrome menu instructions
- Effective Android installation: PASS; Aruka installed with own icon and opens separately from Chrome
- Standalone launch: PASS; no install banner/options shown when installed app is already running standalone
- QA visual executado em dispositivo Android real e confirmado pelo responsável pelo teste.

`beforeinstallprompt` limitation:

- Chrome controls emission of `beforeinstallprompt`, native prompt availability and native banner reappearance.
- Chrome may not emit the event, may stop emitting it after cancellation, may apply engagement/elegibility heuristics and may delay its own native banner.
- This browser behavior is not an Aruka failure.
- Aruka mitigation: install discovery independent of `beforeinstallprompt`, permanent install shortcuts while not standalone, and internal manual guidance fallback.

Checklist:

- [x] Banner internal independent of `deferredPrompt`
- [x] Mobile `Mais` install shortcut independent of `beforeinstallprompt`
- [x] Header hamburger install shortcut independent of `beforeinstallprompt`
- [x] Manual fallback modal available
- [x] Hide preference `aruka_pwa_install_hide_banner` validated for automatic banner only
- [x] Standalone detection hides install surfaces
- [x] Android install and relaunch validated on real device
- [x] Automated validators passed
- [x] Preview deployment validated
- [ ] iOS Safari Add to Home Screen validation

Decision: `PASS`

`CYCLE_STATUS=PASS`
`CYCLE=PRODUCT_ROADMAP_V4_CYCLE_08_1_PWA_ANDROID`
`NEXT_ACTION=PWA_IOS_VALIDATION`
