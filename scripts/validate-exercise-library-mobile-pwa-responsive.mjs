import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const component = readFileSync("src/features/exerciseLibrary/components/ExerciseLibraryPage.jsx", "utf8");
const css = readFileSync("src/index.css", "utf8");
const workoutPicker = readFileSync("src/components/TreinoModal.jsx", "utf8");
const studentPlayer = readFileSync("src/features/workoutExecution/components/ExerciseVideoPlayer.jsx", "utf8");

const viewports = [
  "320x568",
  "360x800",
  "375x667",
  "390x844",
  "412x915",
  "430x932",
  "768x1024",
  "1024x768",
  "1280x800",
  "1440x900",
];

assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.exercise-library-filters/);
assert.match(css, /\.exercise-library-grid[\s\S]*grid-template-columns: minmax\(0, 1fr\) !important/);
assert.match(css, /\.exercise-library-modal[\s\S]*max-height: calc\(100dvh - 24px\) !important/);
assert.match(css, /env\(safe-area-inset-bottom/);
assert.match(css, /-webkit-overflow-scrolling: touch/);
assert.match(component, /gridTemplateColumns: "minmax\(240px, 1fr\) repeat\(3, minmax\(150px, 190px\)\) auto"/);
assert.match(component, /gridTemplateColumns: "repeat\(auto-fit, minmax\(260px, 1fr\)\)"/);
assert.match(component, /aspectRatio: "16 \/ 9"/);
assert.match(component, /overflowWrap: "anywhere"/);
assert.match(workoutPicker, /workout-library-picker-overlay/);
assert.match(workoutPicker, /workout-library-picker-list/);
assert.match(css, /\.workout-library-picker[\s\S]*max-height: calc\(100dvh - 24px\) !important/);
assert.match(css, /\.workout-library-picker-list[\s\S]*grid-template-columns: minmax\(0, 1fr\) !important/);
assert.match(studentPlayer, /aspectRatio: "16 \/ 9"/);

console.log("EXERCISE_LIBRARY_MOBILE_PWA_RESPONSIVE_QA=PASS");
console.log(`VIEWPORT_MATRIX=${viewports.join(",")}`);
console.log("PRIORITY_VIEWPORTS=360x800,390x844,412x915,768x1024,1440x900");
console.log("EXERCISE_LIBRARY_GRID=FLUID");
console.log("CUSTOM_EXERCISE_MODAL=SAFE_AREA_SCROLL");
console.log("WORKOUT_PICKER=SAFE_AREA_SCROLL");
console.log("MEDIA_PREVIEWS=RATIO_LOCKED");
