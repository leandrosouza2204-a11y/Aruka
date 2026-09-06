import { readFileSync } from "node:fs";

const component = readFileSync("src/features/exerciseLibrary/components/ExerciseLibraryPage.jsx", "utf8");
const checks = [];

check("input file tem label programatico", component.includes("htmlFor=\"exercise-upload-video\"") && component.includes("id=\"exercise-upload-video\""));
check("helper erro e status ficam associados", all(component, ["exercise-upload-helper", "exercise-upload-error", "exercise-upload-status", "aria-describedby"]));
check("status de upload e perceptivel", all(component, ["role=\"status\"", "aria-live=\"polite\"", "Enviando vídeo"]));
check("erro nao depende apenas de cor", component.includes("role=\"alert\""));
check("acao remover tem texto acessivel", component.includes("Remover vídeo"));
check("preview usa video sem autoplay", component.includes("<video") && component.includes("controls") && component.includes("preload=\"metadata\"") && !component.includes("autoPlay"));

for (const item of checks) console.log(`${item.ok ? "OK" : "FAIL"} ${item.name}`);
if (checks.some((item) => !item.ok)) process.exitCode = 1;

function check(name, ok) {
  checks.push({ name, ok: Boolean(ok) });
}

function all(text, markers) {
  return markers.every((marker) => text.includes(marker));
}
