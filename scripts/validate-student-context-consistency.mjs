import { readFile } from "node:fs/promises";

const financeiro = await readFile("src/features/financeiro/components/FinanceiroList.jsx", "utf8");
const treinos = await readFile("src/features/treinos/components/TreinosList.jsx", "utf8");
const avaliacoes = await readFile("src/features/avaliacoes/components/AvaliacoesList.jsx", "utf8");
const financeiroStyles = await readFile("src/features/financeiro/components/financeiroListStyles.js", "utf8");

const checks = [
  ["finance context appears only with selected student", /page\.alunoContextual &&/.test(financeiro)],
  ["finance context names the student", /financeiro-context-student-name/.test(financeiro)],
  ["finance context has clear action", /financeiro-context-clear/.test(financeiro)],
  ["finance context explains filtered scope", /lista está filtrada para este aluno/.test(financeiro)],
  ["finance context has mobile-safe section layout", /app-section/.test(financeiro) && /contextoAlunoTexto/.test(financeiroStyles)],
  ["treinos context names the student", /treinos-context-student-name/.test(treinos)],
  ["treinos context has clear action", /treinos-context-clear/.test(treinos)],
  ["avaliacoes context names the student", /avaliacoes-context-student-name/.test(avaliacoes)],
  ["avaliacoes context has clear action", /avaliacoes-context-clear/.test(avaliacoes)],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed = true;
}

if (failed) process.exit(1);
