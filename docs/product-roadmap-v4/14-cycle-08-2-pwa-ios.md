# Product Roadmap v4 - Cycle 08.2

## PWA iOS Validation

Cycle 08.2 validates and adapts the Aruka PWA installation experience for iOS while preserving the Android flow approved in Cycle 08.1.

Status:

- `CYCLE_STATUS=IN_PROGRESS`
- `CYCLE=PRODUCT_ROADMAP_V4_CYCLE_08_2_PWA_IOS`
- `MANUAL_IOS_QA=PENDING`

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

## Manual QA Required

Manual iPhone/iPad QA is required before closing this cycle.

`NEXT_ACTION=USER_RUN_IOS_VISUAL_QA`
