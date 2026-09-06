import { readFileSync } from "node:fs";

const component = readFileSync("src/features/exerciseLibrary/components/ExerciseLibraryPage.jsx", "utf8");
const css = readFileSync("src/index.css", "utf8");
const checks = [];

check("modal mantém scroll interno", all(component, ["maxHeight: \"calc(100vh - 48px)\"", "overflow: \"auto\""]));
check("opcoes de midia usam grid responsivo", component.includes("exercise-library-media-options") && css.includes(".exercise-library-media-options"));
check("preview upload tem 16:9 e largura fluida", component.includes("aspectRatio: \"16 / 9\"") && css.includes(".exercise-library-upload-preview"));
check("file input e nome longo nao estouram", all(component, ["maxWidth: \"100%\"", "overflowWrap: \"anywhere\""]));
check("botoes continuam quebrando no mobile", css.includes(".exercise-library-modal footer button"));

for (const item of checks) console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}`);
if (checks.some((item) => !item.ok)) process.exitCode = 1;

function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}

function all(text, markers) {
  return markers.every((marker) => text.includes(marker));
}
