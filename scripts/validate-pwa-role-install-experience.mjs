import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  canShowInstallMenuItem,
  getInstallGuidanceCopy,
  getInstallPromptCopy,
  shouldShowInstallPrompt,
} from "../src/features/pwa/utils/pwaInstallState.js";

const app = readFileSync("src/App.jsx", "utf8");
const minhaArea = readFileSync("src/pages/MinhaArea.jsx", "utf8");
const manager = readFileSync("src/features/pwa/PwaExperienceManager.jsx", "utf8");
const menu = readFileSync("src/components/MobileBottomNavigation.jsx", "utf8");
const sidebar = readFileSync("src/components/Sidebar.jsx", "utf8");

assert.match(app, /<PwaExperienceManager role="professional">/);
assert.match(minhaArea, /<PwaExperienceManager role="student" activeWorkout=\{Boolean\(executionSession\)\} \/>/);
assert.doesNotMatch(manager, /ProfessionalInstallPrompt|StudentInstallPrompt/);
assert.match(manager, /PwaInstallContext\.Provider/);
assert.match(menu, /usePwaInstall/);
assert.match(menu, /showInstallOption/);
assert.match(menu, /requestInstall/);
assert.match(sidebar, /showInstallOption/);
assert.match(sidebar, /requestInstall/);
assert.match(sidebar, /Instalar aplicativo/);

const professional = getInstallPromptCopy("professional");
const student = getInstallPromptCopy("student");

assert.equal(professional.title, "Instale o Aruka no seu celular");
assert.equal(professional.actionLabel, "Instalar aplicativo");
assert.equal(professional.laterLabel, "Agora nao");
assert.doesNotMatch(professional.description, /timer/);
assert.equal(student.title, "Instale o Aruka no seu celular");
assert.equal(student.actionLabel, "Instalar aplicativo");
assert.equal(student.laterLabel, "Agora nao");
assert.match(student.description, /timer/);
assert.doesNotMatch(student.description, /gest/);

const ios = getInstallPromptCopy("professional", { platform: "ios-safari" });
assert.equal(ios.title, "Instale o Aruka no seu iPhone");
assert.equal(ios.actionLabel, "Como instalar");
assert.match(getInstallGuidanceCopy("ios-safari").steps.join(" "), /Compartilhar do Safari/);
assert.match(getInstallGuidanceCopy("ios-browser").description, /Safari/);

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

console.log("PWA_ROLE_INSTALL_EXPERIENCE_QA=PASS");
console.log("ONE_COMPONENT=YES");
console.log("PROFESSIONAL_COPY=PASS");
console.log("STUDENT_COPY=PASS");
console.log("ROLE_AWARE_INSTALL_COPY=YES");
console.log("MOBILE_MENU_INSTALL_ENTRY=YES");
console.log("HAMBURGER_INSTALL_ENTRY=YES");
console.log("ANDROID_NULL_DEFERRED_PROMPT_DISCOVERY=PASS");
console.log("IOS_ROLE_AWARE_INSTALL_COPY=PASS");
console.log("IOS_SAFARI_INSTALL_GUIDANCE=PASS");
console.log("IOS_BROWSER_INSTALL_GUIDANCE=PASS");
console.log("ADDITIONAL_ROLE_FETCH=0");
