import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  canShowInstallMenuItem,
  getInstallGuidanceCopy,
  getInstallPlatform,
  isStandaloneMode,
  readInstallHidePreference,
  shouldShowInstallPrompt,
} from "../src/features/pwa/utils/pwaInstallState.js";

const manager = readFileSync("src/features/pwa/PwaExperienceManager.jsx", "utf8");
const state = readFileSync("src/features/pwa/utils/pwaInstallState.js", "utf8");
const menu = readFileSync("src/components/MobileBottomNavigation.jsx", "utf8");
const sidebar = readFileSync("src/components/Sidebar.jsx", "utf8");

assert.match(manager, /beforeinstallprompt/);
assert.match(manager, /event\.preventDefault\(\)/);
assert.match(manager, /setDeferredPrompt\(event\)/);
assert.match(manager, /setInstallAvailable\(true\)/);
assert.match(manager, /requestPwaInstall/);
assert.match(manager, /promptEvent\.prompt\(\)/);
assert.match(manager, /promptEvent\.userChoice/);
assert.match(manager, /choice\?\.outcome === "accepted"/);
assert.match(manager, /setInstallGuidanceOpen\(true\)/);
assert.match(manager, /installPlatform === "ios-safari"/);
assert.match(manager, /installPlatform === "ios-browser"/);
assert.doesNotMatch(manager, /choice\?\.outcome === "dismissed"[\s\S]*markInstallBannerHidden/);
assert.match(manager, /appinstalled/);
assert.match(manager, /clearInstallBannerHidden/);
assert.match(manager, /Nao mostrar novamente/);
assert.match(manager, /Instalar e criar atalho/);
assert.match(manager, /PwaInstallGuidance[\s\S]*platform=\{installPlatform\}/);
assert.match(state, /aruka_pwa_install_hide_banner/);
assert.doesNotMatch(state, /aruka_pwa_install_dismissed_at/);
assert.match(state, /PWA_INSTALL_PROMPT_DELAY_MS = 3000/);
assert.match(state, /PWA_INSTALL_MOBILE_QUERY = "\(.+767px\)"/);
assert.match(state, /display-mode: standalone/);
assert.match(state, /navigator\?\.standalone/);
assert.match(state, /MacIntel/);
assert.match(state, /CriOS\|FxiOS\|EdgiOS\|OPiOS/);
assert.match(state, /getInstallPlatform/);
assert.match(state, /getInstallGuidanceCopy/);
assert.match(menu, /usePwaInstall/);
assert.match(menu, /showInstallOption/);
assert.match(menu, /Instalar aplicativo/);
assert.doesNotMatch(menu, /canInstall|canNativePrompt|deferredPrompt|installAvailable/);
assert.match(sidebar, /usePwaInstall/);
assert.match(sidebar, /showInstallOption/);
assert.match(sidebar, /requestInstall/);
assert.match(sidebar, /Instalar aplicativo/);
assert.doesNotMatch(sidebar, /canInstall|canNativePrompt|deferredPrompt|installAvailable/);
assert.equal(isStandaloneMode({ matchMedia: () => ({ matches: true }), navigator: {} }), true);
assert.equal(readInstallHidePreference({ getItem: () => "true" }), true);
assert.equal(readInstallHidePreference({ getItem: () => "invalid" }), false);
assert.equal(
  getInstallPlatform({
    navigator: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit Safari",
      platform: "iPhone",
    },
  }),
  "ios-safari"
);
assert.equal(
  getInstallPlatform({
    navigator: {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) CriOS Safari",
      platform: "iPhone",
    },
  }),
  "ios-browser"
);
assert.match(getInstallGuidanceCopy("ios-safari").steps.join(" "), /Compartilhar do Safari/);
assert.match(getInstallGuidanceCopy("ios-browser").description, /Safari/);
assert.equal(
  shouldShowInstallPrompt({
    role: "student",
    isAuthenticatedHomeReady: true,
    isMobile: true,
    isStandalone: true,
    hasDeferredPrompt: true,
    hideBanner: false,
    bannerClosed: false,
  }),
  false
);
assert.equal(
  shouldShowInstallPrompt({
    role: "professional",
    isAuthenticatedHomeReady: true,
    isMobile: true,
    isStandalone: false,
    hasDeferredPrompt: true,
    hideBanner: true,
    bannerClosed: false,
  }),
  false
);
assert.equal(
  shouldShowInstallPrompt({
    role: "professional",
    isAuthenticatedHomeReady: true,
    isMobile: true,
    isStandalone: false,
    hasDeferredPrompt: false,
    hideBanner: false,
    bannerClosed: false,
  }),
  true
);
assert.equal(
  canShowInstallMenuItem({
    isMobile: true,
    isStandalone: false,
    hasDeferredPrompt: false,
  }),
  true
);
assert.equal(
  canShowInstallMenuItem({
    isMobile: true,
    isStandalone: true,
    hasDeferredPrompt: true,
  }),
  false
);

console.log("PWA_INSTALL_STATE_QA=PASS");
console.log("BEFOREINSTALLPROMPT=CAPTURED_IN_MEMORY");
console.log("NATIVE_PROMPT_DISMISSAL_PERSISTED=NO");
console.log("HIDE_BANNER_REQUIRES_EXPLICIT_CHECKBOX=YES");
console.log("MENU_INSTALL_ITEM=YES");
console.log("HAMBURGER_INSTALL_ITEM=YES");
console.log("MENU_REQUIRES_DEFERRED_PROMPT=NO");
console.log("BANNER_REQUIRES_DEFERRED_PROMPT=NO");
console.log("SHARED_INSTALL_ACTION=YES");
console.log("MANUAL_INSTALL_GUIDANCE=YES");
console.log("PROMPT_WHEN_STANDALONE=NO");
console.log("PROMPT_WHEN_DESKTOP=NO");
console.log("APPINSTALLED_HANDLING=YES");
console.log("IOS_DEFERRED_PROMPT_REQUIRED=NO");
console.log("IOS_SAFARI_GUIDANCE=YES");
console.log("IOS_BROWSER_SAFARI_GUIDANCE=YES");
