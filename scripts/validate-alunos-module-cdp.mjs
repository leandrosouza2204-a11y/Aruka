import { spawn } from "node:child_process";

const suites = [
  ["qa:alunos-mobile", "scripts/validate-alunos-mobile-cdp.mjs"],
  ["qa:aluno-form-mobile", "scripts/validate-aluno-form-mobile-cdp.mjs"],
  ["qa:aluno-details-mobile", "scripts/validate-aluno-details-mobile-cdp.mjs"],
  ["qa:aluno-actions-mobile", "scripts/validate-aluno-actions-mobile-cdp.mjs"],
];

for (const [suite, scriptPath] of suites) {
  console.log(`\n[alunos-module] Iniciando ${suite}`);
  const code = await runNodeScript(suite, scriptPath);
  if (code !== 0) {
    console.error(`[alunos-module] Suite ${suite} falhou com codigo ${code}.`);
    process.exit(code || 1);
  }
  console.log(`[alunos-module] Suite ${suite} concluida.`);
}

console.log("\n[alunos-module] Todas as suites do modulo Alunos passaram.");

function runNodeScript(label, scriptPath) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["--env-file=.env.qa.local", scriptPath], {
      stdio: "inherit",
      env: process.env,
    });

    child.on("close", (code, signal) => {
      if (signal) {
        console.error(`[alunos-module] ${label} encerrado por sinal ${signal}.`);
        resolve(1);
        return;
      }
      resolve(code ?? 0);
    });
    child.on("error", (error) => {
      console.error(`[alunos-module] Erro ao executar ${label}: ${error.message}`);
      resolve(1);
    });
  });
}
