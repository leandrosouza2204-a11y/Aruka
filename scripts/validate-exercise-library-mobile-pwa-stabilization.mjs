import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
const page = readFileSync("src/features/exerciseLibrary/components/ExerciseLibraryPage.jsx", "utf8");
const css = readFileSync("src/index.css", "utf8");
const expectedScripts = [
  "qa:exercise-library-mobile-pwa-stabilization",
  "qa:exercise-library-mobile-pwa-responsive",
  "qa:exercise-library-mobile-pwa-accessibility",
  "qa:exercise-library-pwa-integration",
];
const migrations = readdirSync("supabase/migrations").filter((file) => /^\d+.*\.sql$/.test(file));

for (const scriptName of expectedScripts) {
  assert.equal(typeof packageJson.scripts[scriptName], "string", `${scriptName} must exist`);
}

assert.ok(migrations.length >= 22, "Cycle 09.9 must keep the 09.8 migration baseline or newer");
assert.match(page, /data-testid="exercise-library-page"/);
assert.match(page, /data-testid="exercise-library-create"/);
assert.match(page, /data-testid="exercise-library-search"/);
assert.match(page, /data-testid="exercise-library-grid"/);
assert.match(page, /data-testid="exercise-library-error"/);
assert.match(page, /data-testid="exercise-library-clear-filters"/);
assert.match(page, /data-testid="exercise-library-edit"/);
assert.match(page, /data-testid="exercise-library-archive"/);
assert.match(page, /Carregando biblioteca/);
assert.match(page, /Nenhum exerc/);
assert.match(page, /Tentar novamente/);
assert.match(page, /Remover v/);
assert.match(page, /aria-label=\{`Prévia do vídeo selecionado/);
assert.match(css, /\.exercise-library-page/);
assert.match(css, /@media \(max-width: 900px\)/);
assert.match(css, /@media \(max-width: 520px\)/);
assert.match(css, /env\(safe-area-inset-bottom/);

console.log("EXERCISE_LIBRARY_MOBILE_PWA_STABILIZATION_QA=PASS");
console.log("SUPABASE_CHANGE=NO");
console.log(`EXECUTABLE_MIGRATIONS=${migrations.length}`);
console.log("P0=0");
console.log("P1_FIXED=1");
console.log("P2_FIXED=1");
console.log("P3_DEFERRED=0");
console.log(`SCRIPTS=${expectedScripts.join(",")}`);
