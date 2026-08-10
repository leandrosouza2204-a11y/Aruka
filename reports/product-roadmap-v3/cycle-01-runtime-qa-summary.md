# Roadmap v3 Cycle 01 Runtime QA Summary

Decision: `READY_FOR_ROADMAP_V3_CYCLE_02`

Root causes fixed:

- `CORE_MOBILE_LAYOUT_PACKAGE_SCRIPT_EXPECTATION_STALE_AFTER_RUNTIME_ENV_INTEGRATION`
- `FINANCE_HISTORY_QA_FIXTURE_STATE_MISMATCH`
- `RENEWAL_QA_FIXTURE_STATE_MISMATCH`
- `RENEWAL_MODAL_QA_OVERFLOW_SCOPE_INCLUDED_BACKGROUND_TABLE`
- `AUTHENTICATED_QA_SHARED_BROWSER_STATE_LEAKAGE`

The core mobile validator expected the exact legacy npm script `node scripts/validate-core-mobile-layout.mjs`. After authenticated runtime integration, the real script became `node --env-file=.env.qa.local scripts/validate-core-mobile-layout.mjs`, so the validator reported `packageScriptPresent=false` even while being executed by that npm script.

Current execution:

- Base URL reachable: `YES`
- CDP reachable: `YES`
- Browser target found: `YES`
- Browser origin match: `YES`
- Auth session present: `YES`
- Authenticated route reachable: `YES`
- Runtime precheck: `PASS`
- Core mobile layout: `PASS_RUNTIME_READY`
- Finance modals: `PASS_RUNTIME`
- Renovacao mobile: `PASS_RUNTIME`
- Browser state isolation: `PASS`
- Authenticated runtime run 1: `PASS`
- Authenticated runtime run 2: `PASS`

Finance fix:

- The QA expected an actionable history row in the default `Em acompanhamento` view.
- The local authenticated fixture has `Em acompanhamento (0)` and `Encerrados (3)`.
- The QA now selects the legitimate `Encerrados` view when no visible history action trigger exists in the default view.

QAs status:

- `qa:authenticated-runtime-precheck`: `PASS`
- `qa:core-mobile-layout`: `PASS_RUNTIME_READY`
- `qa:finance-modals`: `PASS_RUNTIME`
- `qa:renovacao-mobile`: `PASS_RUNTIME`

Renewal fix:

- The QA expected a renewal action in the default `Em acompanhamento` view.
- The local authenticated fixture has `Em acompanhamento (0)` and `Encerrados (3)`.
- The QA now waits for the finance view to finish access checks and selects `Encerrados` when no visible action trigger exists in the default view.

Renewal layout fix:

- The exact 8 overflowing elements were not inside the renewal modal: `table.app-table.financeiro-desktop-table`, `colgroup`, `col.financeiro-col-pagamento`, `col.financeiro-col-acoes`, `thead`, `tr`, `th`, `th.financeiro-actions-col`.
- Root overflow ancestor: background finance table outside the renewal modal.
- The renewal QA now scopes overflow detection to the modal subtree and reports `overflowElementCount`, `maxRightEdge` and overflowing node summaries when failures occur.
- The renewal modal itself was hardened with a scoped class, flex shell, viewport max-height and internal scroll for landscape/tablet/desktop compact viewports.
- After fix: `overflowElementCount=0` across `320x800`, `360x800`, `375x812`, `390x844`, `412x915`, `430x932`, `800x360`, `844x390`, `915x412`, `1024x768`, `1366x768`, `1440x900`.

Regression status:

- `qa:core-mobile-layout`: `PASS_RUNTIME_READY`
- `qa:modal-accessibility-parity`: `PASS`
- `qa:finance-mutation-confirmations`: `PASS`
- `qa:contextual-error-feedback`: `PASS`
- `test:authenticated-runtime`: `PASS`
- `lint`: `PASS`
- `build`: `PASS`

Browser state isolation:

- Strategy: each finance/renewal QA opens an isolated CDP page in the same authenticated browser profile, resets route/viewport/scroll, closes visible dialogs and menus with browser/DOM behavior, records start/end state, navigates to a neutral route and closes the page.
- Auth session reused: `YES`
- Login repeated: `NO`
- Finance -> Renewal -> Finance sequence: `PASS`
- Full authenticated runtime suite run 1: `PASS`
- Full authenticated runtime suite run 2: `PASS`
- Functional failures: `0`
- Environment blockers: `0`

Next action: `IMPLEMENT_FINANCE_WORKFLOW_RELIABILITY_PASS`.
