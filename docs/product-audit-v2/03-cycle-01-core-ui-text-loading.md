# Cycle 01 - Core UI Text And Loading Stability

Decision: READY_FOR_FUNCTIONAL_CYCLE_02

## Findings Treated

- F-001: visible mojibake/text corruption in core UI copy.
- F-002: blank lazy route/modal loading caused by `Suspense fallback={null}`.

## Cause

F-001 had two layers. Byte-level validation did not find real UTF-8 mojibake in executable product files after excluding AOE internals and binary assets. The visible product issue was degraded Portuguese copy in core surfaces and expectations, mostly missing accents in labels, toasts, validation messages, warnings, and contextual text.

F-002 came from lazy routes and lazy modal/editor components using `fallback={null}`, so route transitions or modal opens could look blank while chunks loaded.

## Approach

- Reused the existing accessible `LoadingState` component.
- Added `LoadingFallback` as a small wrapper for route and modal contexts.
- Replaced visible `fallback={null}` usages in app routes and lazy modal/editor mounts.
- Added static QA for visible UI copy and visible Suspense fallbacks.
- Corrected UI/acessibility-facing Portuguese copy and directly related test expectations.
- Did not add a catch-all route; F-004 remains out of scope.
- Did not alter Supabase, migrations, CI/CD, package lock, queries, services behavior, or database contracts.

## Files Changed

- `src/components/LoadingFallback.jsx`
- `src/App.jsx`
- `src/index.css`
- Lazy modal mounts in Planos, AdminUsuarios, Avaliacoes, Financeiro, and Treinos
- Visible copy in Alunos, Avaliacoes, Dashboard, Financeiro, Treinos, and Avaliacao photo errors
- Related unit expectations for Alunos, Dashboard, and Treinos
- `scripts/validate-visible-ui-copy.mjs`
- `scripts/validate-visible-suspense-fallbacks.mjs`
- `package.json`

## QA

- `npm.cmd run qa:visible-ui-copy`: PASS
- `npm.cmd run qa:visible-suspense-fallbacks`: PASS
- `npm.cmd run test:alunos`: PASS
- `node --test src\features\treinos\utils\workoutTemplateApplication.test.js src\features\treinos\utils\personalWorkoutTemplateManagement.test.js src\features\treinos\utils\treinosErrorState.test.js`: PASS
- `node --test src\features\dashboard\hooks\useDashboardPage.test.js`: PASS
- `npm.cmd run qa:workout-delivery-contract`: PASS
- `npm.cmd run qa:student-identity-contract`: PASS
- `npm.cmd run lint`: PASS
- `npm.cmd run build`: PASS

## Limitations

- F-003 mobile layout risk was not addressed.
- F-004 catch-all route was not added.
- F-005 through F-010 were not implemented, except for copy corrections directly tied to F-001.
- The new Suspense QA is static and focused on high-risk visible `fallback={null}` patterns.

## Next Cycle

NEXT_ACTION=IMPLEMENT_MOBILE_CORE_LAYOUT_VALIDATION_AND_FIXES

The next cycle should target F-003 with systematic validation at 320, 360, 375, 390, and 414 px before advancing to P2 findings.
