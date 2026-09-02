# Product Roadmap v4 - Cycle 08.2

## PWA iOS Validation

Cycle 08.2 validates and adapts the Aruka PWA installation experience for iOS while preserving the Android flow approved in Cycle 08.1.

Status:

- `CYCLE_STATUS=PASS`
- `CYCLE=PRODUCT_ROADMAP_V4_CYCLE_08_2_PWA_IOS`
- `MANUAL_IOS_QA=PASS`

## Scope

- iOS install discovery in authenticated browser sessions.
- Safari manual Add to Home Screen guidance.
- Safe fallback for other iOS browsers by recommending Safari.
- Standalone detection through `display-mode: standalone` and `navigator.standalone`.
- Preservation of Android native prompt and manual Chrome fallback.

## iOS Behavior

When the user is authenticated, on a mobile iOS browser, not standalone and without the hide-banner preference, Aruka shows an internal banner:

- Title: `Instale o Aruka no seu iPhone`
- CTA: `Como instalar`
- Secondary action: `Agora nao`
- Preference: `Nao mostrar novamente`

The CTA opens guidance instead of promising an automatic native install prompt.

## Safari Guidance

`requestPwaInstall()` remains the single entry point. On iOS Safari it opens the internal guidance:

1. Tap Safari Share.
2. Choose `Adicionar a Tela de Inicio`.
3. Tap `Adicionar`.

## Other iOS Browsers

On iOS browsers that are not Safari, Aruka keeps the install entry visible and opens guidance recommending that the user open the page in Safari before adding it to the Home Screen. No attempt is made to force-open Safari.

## Android Regression Guard

Android remains unchanged:

- `beforeinstallprompt` is still captured in memory when the browser emits it.
- Native prompt remains available after explicit user action.
- Android manual Chrome fallback remains available when no deferred prompt exists.
- `Mais -> Acessos adicionais -> Instalar aplicativo` remains visible in browser mode.
- Header hamburger `Instalar aplicativo` remains visible in browser mode.
- Standalone mode hides install surfaces.
- `aruka_pwa_install_hide_banner` controls only the automatic banner.

## Manual QA Closeout

Manual iPhone QA was executed by the user on the published Preview and all required tests passed.

Visual evidence was provided through real iPhone screenshots confirming:

- iOS banner with `Instale o Aruka no seu iPhone`, `Como instalar`, `Agora nao` and `Nao mostrar novamente`: PASS.
- Safari guidance modal `Instalar o Aruka` with Share, `Adicionar a Tela de Inicio` and `Adicionar`: PASS.
- Installation experience integrated into the Aruka UI and physically validated on iPhone: PASS.

Manual test matrix:

| Test | Result |
| --- | --- |
| Banner iOS | PASS |
| Agora nao + retorno | PASS |
| Nao mostrar novamente + menus preservados | PASS |
| Safari -> Adicionar a Tela de Inicio | PASS |
| Standalone | PASS |
| Relaunch standalone | PASS |

Validated behavior:

- iOS installation uses Safari -> Share -> Add to Home Screen -> Add.
- Aruka does not depend on `beforeinstallprompt` on iOS.
- The internal banner is the discovery surface.
- `Como instalar` opens iOS-specific guidance.
- Manual install entries remain available in `Mais` and the header hamburger while not standalone.
- Standalone mode removes install UI.
- Relaunch from the Home Screen preserves standalone behavior.

`aruka_pwa_install_hide_banner=true` controls only the automatic banner. The manual install entries remain available when the app is running in browser mode and is not standalone.

Complementary QA:

- `IPAD_QA=NOT_AVAILABLE`
- `IOS_ALTERNATIVE_BROWSER_QA=NOT_EXECUTED`

## Cycle Closeout

- Implementation: PASS.
- Automated PWA QA: PASS.
- Manual iPhone Safari QA: PASS.
- Android regression: PASS.
- Deployment: PASS.
- PR #56 checks: Vercel PASS; Vercel Preview Comments PASS; GitHub validation not present in the final status rollup after the documentation-only amend.
- Functional commit: `fc64e5b2c25da46e1c531ba7d8c1e09fb8ca63f3`.
- Preview: `https://aruka-git-feat-product-roadmap-v4-cy-58b9c9-leandrosouzafitness.vercel.app`.

Android can use `beforeinstallprompt` as an enhancement when the browser provides it; otherwise Aruka uses its manual fallback. iOS uses the Safari-provided Add to Home Screen flow, and the absence of `beforeinstallprompt` on iOS is not a failure.

Next planned roadmap item:

- `NEXT_PLANNED_CYCLE=COACH_AUTOMATION`
- Objective: operational automation for follow-up, stalled students and repeated coach decisions after the progression/student value surfaces.

`NEXT_ACTION=PLAN_COACH_AUTOMATION_CYCLE`
