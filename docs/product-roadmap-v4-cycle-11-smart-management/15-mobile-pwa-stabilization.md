# Stage 11.9 - Mobile/PWA & Stabilization

## Objective And Baseline

Stage 11.9 stabilizes the existing Cycle 11 experience without adding product features. Baseline: `617de78ee2e03997bf03de8e585c998d442c0b26` on `main`.

## Inventory

The Cycle 11 surface is the authenticated `/gestao-inteligente` route: Locations & Transfers, Services & Pricing, profitability, simulator, location comparator and commercial presentation. The dashboard owns the factual Stage 11.8 summary and links internally to the module.

Data remains in `smartManagementService`: active/archived lists and the minimal dashboard count query use the authenticated professional id. No server action, migration, Financeiro integration or new domain behavior is introduced.

## Problems Found And Corrections

Two responsive validators exposed a real mobile layout gap:

- Simulator scenario cards were not expressed as an independent single-column rule at the tablet/mobile breakpoint.
- Comparator result summaries could retain multiple columns before the narrow-phone breakpoint.

The existing Cycle 11 responsive block now makes scenario cards and comparison summaries explicitly one column through `900px`. Location selection is likewise explicitly one column on narrow mobile. Existing safe-area spacing and 44px action targets are preserved.

After the functional merge, access verification found that the professional workspace was not consistently prioritized over a linked student identity. The correction centralizes the active professional-profile rule, hides Gestao Inteligente from student desktop and mobile navigation, keeps the module and dashboard inside the professional route guard, and prioritizes the professional profile after login. Student access remains directed to the existing student experience and does not require a professional context.

## PWA Review

The existing Vite PWA manifest remains `standalone` with valid normal, maskable and Apple touch icons. Service-worker updates remain user initiated, and `runtimeCaching: []` preserves network-only dynamic authenticated data. Install-state logic retains Android native prompt handling, iOS/iPadOS/Safari guidance, standalone detection and no prompt once installed.

No offline mutations, global authenticated cache, service-worker strategy, install redesign or branding change was made.

## Validation

Automated PWA installability, Android/iOS install flow, update safety and cache-security QA passed. Cycle 11 responsive, accessibility, dashboard and regression QA passed after the correction.

The functional implementation merged through PR #107 and the access correction through PR #108. Both remote validation, Vercel and preview checks passed.

Authenticated visual runtime was not available: the local base URL and CDP browser endpoint were unreachable. Physical Android, iOS/iPadOS and installed-standalone checks remain manual QA.

## Scope Boundaries

No fake metrics, recommendation, ranking, profitability surface, Financeiro integration, migration or production database action was introduced. The existing repository-wide modal parity validator still reports missing Escape behavior for `AlunoModal`; it is preexisting and outside Cycle 11, so this Stage does not modify that unrelated flow.
