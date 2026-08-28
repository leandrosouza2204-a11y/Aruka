import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";

const viteConfig = readFileSync("vite.config.js", "utf8");
const index = readFileSync("index.html", "utf8");
const main = readFileSync("src/main.jsx", "utf8");
const app = readFileSync("src/App.jsx", "utf8");
const migrations = readdirSync("supabase/migrations").filter((file) => /^\d+.*\.sql$/.test(file));

assert.match(viteConfig, /VitePWA/);
assert.match(viteConfig, /registerType:\s*"prompt"/);
assert.match(viteConfig, /injectRegister:\s*false/);
assert.match(viteConfig, /name:\s*"Aruka"/);
assert.match(viteConfig, /short_name:\s*"Aruka"/);
assert.match(viteConfig, /start_url:\s*"\/"/);
assert.match(viteConfig, /scope:\s*"\/"/);
assert.match(viteConfig, /display:\s*"standalone"/);
assert.match(viteConfig, /orientation:\s*"any"/);
assert.doesNotMatch(viteConfig, /start_url:\s*"\/dashboard"|start_url:\s*"\/minha-area"/);
assert.match(index, /theme-color/);
assert.match(index, /apple-touch-icon/);
assert.match(index, /apple-mobile-web-app-capable/);
assert.match(main, /<App \/>/);
assert.match(app, /PwaExperienceManager/);

const icons = [
  "public/pwa/icon-192.png",
  "public/pwa/icon-512.png",
  "public/pwa/maskable-icon-192.png",
  "public/pwa/maskable-icon-512.png",
  "public/pwa/apple-touch-icon.png",
];

for (const icon of icons) {
  assert.equal(existsSync(icon), true, `${icon} must exist`);
  assert.ok(statSync(icon).size > 1000, `${icon} must not be empty`);
  assert.match(viteConfig + index, new RegExp(icon.replace("public/", "").replaceAll("/", "\\/")));
}

assert.equal(migrations.length, 13);

console.log("PWA_INSTALLABILITY_QA=PASS");
console.log("MANIFEST=CONFIGURED");
console.log("SERVICE_WORKER_REGISTRATION=VITE_PLUGIN_PROMPT");
console.log("APP_NAME=Aruka");
console.log("START_URL=/");
console.log("SCOPE=/");
console.log("DISPLAY=standalone");
console.log("ORIENTATION=any");
console.log("ICONS=PASS");
console.log("MASKABLE=PASS");
console.log(`EXECUTABLE_MIGRATIONS=${migrations.length}`);
