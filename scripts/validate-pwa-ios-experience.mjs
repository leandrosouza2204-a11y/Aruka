import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
  canShowInstallMenuItem,
  getInstallGuidanceCopy,
  getInstallPlatform,
  getInstallPromptCopy,
  isIosDevice,
  isIosSafari,
  isStandaloneMode,
  shouldShowInstallPrompt,
} from "../src/features/pwa/utils/pwaInstallState.js";

const manager = readFileSync("src/features/pwa/PwaExperienceManager.jsx", "utf8");
const menu = readFileSync("src/components/MobileBottomNavigation.jsx", "utf8");
const sidebar = readFileSync("src/components/Sidebar.jsx", "utf8");
const indexHtml = readFileSync("index.html", "utf8");
const viteConfig = readFileSync("vite.config.js", "utf8");
const css = readFileSync("src/index.css", "utf8");

const iosSafari = {
  matchMedia: () => ({ matches: false }),
  navigator: {
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit Safari",
    platform: "iPhone",
    maxTouchPoints: 5,
  },
};
const iosChrome = {
  matchMedia: () => ({ matches: false }),
  navigator: {
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) CriOS Safari",
    platform: "iPhone",
    maxTouchPoints: 5,
  },
};
const ipadOs = {
  matchMedia: () => ({ matches: false }),
  navigator: {
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit Safari",
    platform: "MacIntel",
    maxTouchPoints: 5,
  },
};

assert.equal(isIosDevice(iosSafari), true);
assert.equal(isIosSafari(iosSafari), true);
assert.equal(isIosSafari(iosChrome), false);
assert.equal(getInstallPlatform(iosSafari), "ios-safari");
assert.equal(getInstallPlatform(iosChrome), "ios-browser");
assert.equal(getInstallPlatform(ipadOs), "ios-safari");

assert.equal(
  shouldShowInstallPrompt({
    role: "professional",
    isAuthenticatedHomeReady: true,
    isMobile: true,
    isStandalone: false,
    hideBanner: false,
    bannerClosed: false,
    hasDeferredPrompt: false,
  }),
  true
);
assert.equal(canShowInstallMenuItem({ isMobile: true, isStandalone: false }), true);
assert.equal(isStandaloneMode({ matchMedia: () => ({ matches: true }), navigator: {} }), true);
assert.equal(isStandaloneMode({ matchMedia: () => ({ matches: false }), navigator: { standalone: true } }), true);
assert.equal(canShowInstallMenuItem({ isMobile: true, isStandalone: true }), false);

const iosBanner = getInstallPromptCopy("student", { platform: "ios-safari" });
assert.equal(iosBanner.title, "Instale o Aruka no seu iPhone");
assert.equal(iosBanner.actionLabel, "Como instalar");
assert.match(iosBanner.description, /Tela de Inicio/);
assert.match(getInstallGuidanceCopy("ios-safari").steps.join(" "), /Compartilhar do Safari/);
assert.match(getInstallGuidanceCopy("ios-browser").description, /abra esta pagina no Safari/);

assert.match(manager, /getInstallPlatform/);
assert.match(manager, /getInstallPromptCopy\(role, \{ platform: installPlatform \}\)/);
assert.match(manager, /installPlatform === "ios-safari"/);
assert.match(manager, /installPlatform === "ios-browser"/);
assert.match(manager, /PwaInstallGuidance[\s\S]*platform=\{installPlatform\}/);
assert.match(manager, /promptEvent\.prompt\(\)/);
assert.match(manager, /Instalar e criar atalho/);
assert.match(menu, /Instalar aplicativo/);
assert.match(sidebar, /Instalar aplicativo/);

assert.match(indexHtml, /rel="apple-touch-icon" href="\/pwa\/apple-touch-icon\.png"/);
assert.match(indexHtml, /apple-mobile-web-app-capable/);
assert.match(indexHtml, /apple-mobile-web-app-title/);
assert.match(indexHtml, /apple-mobile-web-app-status-bar-style/);
assert.match(viteConfig, /short_name:\s*"Aruka"/);
assert.match(viteConfig, /start_url:\s*"\/"/);
assert.match(viteConfig, /display:\s*"standalone"/);
assert.match(viteConfig, /pwa\/apple-touch-icon\.png/);
assert.equal(existsSync("public/pwa/apple-touch-icon.png"), true);
assert.match(css, /env\(safe-area-inset-bottom\)/);

console.log("PWA_IOS_EXPERIENCE_QA=PASS");
console.log("IOS_DEVICE_DETECTION=PASS");
console.log("IOS_SAFARI_DETECTION=PASS");
console.log("IPADOS_TOUCH_DETECTION=PASS");
console.log("IOS_DEFERRED_PROMPT_REQUIRED=NO");
console.log("IOS_SAFARI_GUIDANCE=PASS");
console.log("IOS_BROWSER_SAFARI_GUIDANCE=PASS");
console.log("IOS_STANDALONE_DETECTION=PASS");
console.log("IOS_MENU_INSTALL_ENTRY=PASS");
console.log("IOS_HAMBURGER_INSTALL_ENTRY=PASS");
console.log("APPLE_TOUCH_ICON=PASS");
console.log("IOS_META_TAGS=PASS");
console.log("ANDROID_PWA_REGRESSION=PASS");
