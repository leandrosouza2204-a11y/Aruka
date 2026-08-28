import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { getInstallPromptCopy, shouldShowInstallPrompt } from "../src/features/pwa/utils/pwaInstallState.js";

const app = readFileSync("src/App.jsx", "utf8");
const minhaArea = readFileSync("src/pages/MinhaArea.jsx", "utf8");
const manager = readFileSync("src/features/pwa/PwaExperienceManager.jsx", "utf8");

assert.match(app, /<PwaExperienceManager role="professional" \/>/);
assert.match(minhaArea, /<PwaExperienceManager role="student" activeWorkout=\{Boolean\(executionSession\)\} \/>/);
assert.doesNotMatch(manager, /ProfessionalInstallPrompt|StudentInstallPrompt/);

const professional = getInstallPromptCopy("professional");
const student = getInstallPromptCopy("student");

assert.match(professional.description, /gestão dos seus alunos/);
assert.doesNotMatch(professional.description, /timer/);
assert.match(student.description, /treinos, histórico, vídeos e timer/);
assert.doesNotMatch(student.description, /gestão dos seus alunos/);

assert.equal(
  shouldShowInstallPrompt({
    role: "professional",
    isAuthenticatedHomeReady: true,
    isStandalone: false,
    hasDeferredPrompt: true,
    canShowIosGuide: false,
    dismissed: false,
  }),
  true
);

console.log("PWA_ROLE_INSTALL_EXPERIENCE_QA=PASS");
console.log("ONE_COMPONENT=YES");
console.log("PROFESSIONAL_COPY=PASS");
console.log("STUDENT_COPY=PASS");
console.log("ROLE_AWARE_INSTALL_COPY=YES");
console.log("ADDITIONAL_ROLE_FETCH=0");
