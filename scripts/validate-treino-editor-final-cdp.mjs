import { execFileSync } from "node:child_process";

const suites = [
  "qa:workout-template-sanitization",
  "qa:workout-templates-data",
  "qa:treino-custom-templates",
  "qa:cleanup-workout-templates",
];

for (const suite of suites) {
  console.log(`Executando ${suite}...`);
  execFileSync("cmd.exe", ["/c", "npm.cmd", "run", suite], {
    stdio: "inherit",
    env: process.env,
  });
}

console.log("Certificacao final do editor de treino concluida.");
