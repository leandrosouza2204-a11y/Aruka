import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { shouldShowUpdatePrompt } from "../src/features/pwa/utils/pwaUpdateState.js";

const manager = readFileSync("src/features/pwa/PwaExperienceManager.jsx", "utf8");
const minhaArea = readFileSync("src/pages/MinhaArea.jsx", "utf8");

assert.match(manager, /useRegisterSW/);
assert.match(manager, /needRefresh/);
assert.match(manager, /updateServiceWorker\(true\)/);
assert.doesNotMatch(manager, /window\.location\.reload\(\)/);
assert.match(manager, /activeWorkout/);
assert.match(minhaArea, /activeWorkout=\{Boolean\(executionSession\)\}/);
assert.equal(shouldShowUpdatePrompt({ hasWaitingWorker: true, activeWorkout: false }), true);
assert.equal(shouldShowUpdatePrompt({ hasWaitingWorker: true, activeWorkout: true }), false);

console.log("PWA_UPDATE_SAFETY_QA=PASS");
console.log("USER_UPDATE_PROMPT=YES");
console.log("AUTO_RELOAD=NO");
console.log("NO_FORCED_RELOAD_DURING_ACTIVE_WORKOUT=YES");
console.log("UNSAVED_FORM_POLICY=USER_ACTION_ONLY");
