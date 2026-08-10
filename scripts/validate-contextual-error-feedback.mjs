import { readFile } from "node:fs/promises";

const helper = await readFile("src/utils/contextualErrorFeedback.js", "utf8");
const finance = await readFile("src/features/financeiro/hooks/useFinanceiroPage.js", "utf8");
const treinosError = await readFile("src/features/treinos/utils/treinosErrorState.js", "utf8");

const checks = [
  ["contextual helper classifies permission", /permiss/.test(helper)],
  ["contextual helper classifies not found", /registro necessário/.test(helper)],
  ["contextual helper classifies conflict", /Já existe um registro/.test(helper)],
  ["contextual helper classifies network", /Verifique sua conexão/.test(helper)],
  ["finance imports contextual helper", /userFacingError/.test(finance)],
  ["finance load error is contextual", /userFacingError\("carregar os dados financeiros"/.test(finance)],
  ["finance payment error is contextual", /userFacingError\("registrar o pagamento"/.test(finance)],
  ["finance closure error is contextual", /userFacingError\("encerrar o acompanhamento"/.test(finance)],
  ["finance technical errors stay in console", /console\.error\(error\)/.test(finance)],
  ["treinos keeps retryable error model", /retryable/.test(treinosError)],
  ["finance does not expose raw message in setErro", !/setErro\(`Erro ao .*error\.message/.test(finance)],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed = true;
}

if (failed) process.exit(1);
