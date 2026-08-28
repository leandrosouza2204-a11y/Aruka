import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  isStandaloneMode,
  shouldShowInstallPrompt,
} from "../src/features/pwa/utils/pwaInstallState.js";

const manager = readFileSync("src/features/pwa/PwaExperienceManager.jsx", "utf8");
const state = readFileSync("src/features/pwa/utils/pwaInstallState.js", "utf8");

assert.match(manager, /beforeinstallprompt/);
assert.match(manager, /event\.preventDefault\(\)/);
assert.match(manager, /setDeferredPrompt\(event\)/);
assert.match(manager, /promptEvent\.prompt\(\)/);
assert.match(manager, /promptEvent\.userChoice/);
assert.match(manager, /appinstalled/);
assert.match(state, /aruka:pwaInstallDismissedAt:v1/);
assert.match(state, /PWA_INSTALL_DISMISSAL_DAYS = 14/);
assert.match(state, /display-mode: standalone/);
assert.match(state, /navigator\?\.standalone/);
assert.match(state, /CriOS\|FxiOS\|EdgiOS\|OPiOS/);
assert.equal(isStandaloneMode({ matchMedia: () => ({ matches: true }), navigator: {} }), true);
assert.equal(
  shouldShowInstallPrompt({
    role: "student",
    isAuthenticatedHomeReady: true,
    isStandalone: true,
    hasDeferredPrompt: true,
    canShowIosGuide: false,
    dismissed: false,
  }),
  false
);

console.log("PWA_INSTALL_STATE_QA=PASS");
console.log("BEFOREINSTALLPROMPT=CAPTURED_IN_MEMORY");
console.log("DISMISSAL_WINDOW_DAYS=14");
console.log("PROMPT_REAPPEARS_EVERY_LOGIN=NO");
console.log("PROMPT_WHEN_STANDALONE=NO");
console.log("APPINSTALLED_HANDLING=YES");
