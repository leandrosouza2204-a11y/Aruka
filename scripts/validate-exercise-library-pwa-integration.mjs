import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { shouldShowUpdatePrompt } from "../src/features/pwa/utils/pwaUpdateState.js";
import {
  canShowInstallMenuItem,
  getInstallPlatform,
  isStandaloneMode,
  shouldShowInstallPrompt,
} from "../src/features/pwa/utils/pwaInstallState.js";

const app = readFileSync("src/App.jsx", "utf8");
const minhaArea = readFileSync("src/pages/MinhaArea.jsx", "utf8");
const manager = readFileSync("src/features/pwa/PwaExperienceManager.jsx", "utf8");
const viteConfig = readFileSync("vite.config.js", "utf8");
const index = readFileSync("index.html", "utf8");

assert.match(app, /<PwaExperienceManager role="professional">/);
assert.match(minhaArea, /<PwaExperienceManager role="student" activeWorkout=\{Boolean\(executionSession\)\} \/>/);
assert.match(manager, /beforeinstallprompt/);
assert.match(manager, /promptEvent\.prompt\(\)/);
assert.match(manager, /useRegisterSW/);
assert.match(manager, /updateServiceWorker\(true\)/);
assert.doesNotMatch(manager, /window\.location\.reload\(\)/);
assert.match(viteConfig, /runtimeCaching:\s*\[\]/);
assert.doesNotMatch(viteConfig, /youtube|youtube-nocookie|googlevideo|\/rest\/v1|\/auth\/v1/i);
assert.match(index, /apple-mobile-web-app-capable/);
assert.match(index, /theme-color/);
assert.equal(isStandaloneMode({ matchMedia: () => ({ matches: true }), navigator: {} }), true);
assert.equal(
  getInstallPlatform({
    navigator: { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit Safari", platform: "iPhone" },
  }),
  "ios-safari",
);
assert.equal(canShowInstallMenuItem({ isMobile: true, isStandalone: false, hasDeferredPrompt: false }), true);
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
  true,
);
assert.equal(shouldShowUpdatePrompt({ hasWaitingWorker: true, activeWorkout: true }), false);

console.log("EXERCISE_LIBRARY_PWA_INTEGRATION_QA=PASS");
console.log("INSTALL_PROMPT=ROLE_AWARE");
console.log("IOS_GUIDANCE=SUPPORTED");
console.log("STANDALONE_MODE=DETECTED");
console.log("UPDATE_DURING_ACTIVE_WORKOUT=BLOCKED");
console.log("PRIVATE_MEDIA_RUNTIME_CACHE=NO");
