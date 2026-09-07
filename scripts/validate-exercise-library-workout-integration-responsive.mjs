import { existsSync, readFileSync } from "node:fs";

const modal = existsSync("src/components/TreinoModal.jsx") ? readFileSync("src/components/TreinoModal.jsx", "utf8") : "";
const css = existsSync("src/index.css") ? readFileSync("src/index.css", "utf8") : "";
const checks = [];

check("picker usa classes estaveis", all(modal, [
  "workout-library-picker-overlay",
  "workout-library-picker",
  "workout-library-picker-filters",
  "workout-library-picker-list",
  "workout-library-picker-card",
]));
check("desktop tem grid de filtros e lista", all(modal, [
  "gridTemplateColumns: \"minmax(220px, 1.4fr) repeat(4, minmax(130px, 1fr))\"",
  "repeat(auto-fit, minmax(260px, 1fr))",
]));
check("mobile reduz filtros e lista para uma coluna", all(css, [
  "@media (max-width: 900px)",
  ".workout-library-picker-filters",
  ".workout-library-picker-list",
  "grid-template-columns: minmax(0, 1fr) !important",
]));
check("mobile estreito evita overflow em cards e botoes", all(css, [
  "@media (max-width: 520px)",
  ".workout-library-picker-card",
  "width: 100%",
]));

for (const item of checks) console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}`);
if (checks.some((item) => !item.ok)) process.exitCode = 1;

function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}

function all(text, markers) {
  return markers.every((marker) => text.includes(marker));
}
