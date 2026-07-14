import { execFileSync } from "node:child_process";

const suites = [
  "qa:treino-editor-mobile",
  "qa:workout-templates-data",
  "qa:treino-templates-mobile",
  "qa:workout-template-sanitization",
  "qa:treino-custom-templates",
  "qa:treino-editor-final",
  "qa:cleanup-workout-templates",
];

for (const suite of suites) {
  console.log(`Executando ${suite}...`);
  execFileSync("cmd.exe", ["/c", "npm.cmd", "run", suite], {
    stdio: "inherit",
    env: process.env,
  });
}

console.log("Modulo do editor de treino validado.");
