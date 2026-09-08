import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = read("src/App.jsx");
const sidebar = read("src/components/Sidebar.jsx");
const mobileNav = read("src/components/MobileBottomNavigation.jsx");
const css = read("src/index.css");

assert.match(app, /path="\/exercicios"/);
assert.match(sidebar, /to="\/exercicios"[\s\S]*label="Exercícios"/);
assert.match(mobileNav, /<MoreLink[\s\S]*to="\/exercicios"[\s\S]*label="Exercícios"/);
assert.match(mobileNav, /aria-label="Mais opcoes"/);
assert.match(mobileNav, /className="mobile-more-item"/);
assert.match(css, /\.mobile-more-item \{[\s\S]*min-height: 46px;/);
assert.match(css, /env\(safe-area-inset-bottom\)/);

console.log("EXERCISE_LIBRARY_MOBILE_NAVIGATION_QA=PASS");
console.log("MOBILE_EXERCISE_LOCATION=MORE_MENU");
console.log("ROUTE=/exercicios");
console.log("TOUCH_TARGET=46PX");

function read(file) {
  return readFileSync(file, "utf8").replace(/\r\n/g, "\n");
}
