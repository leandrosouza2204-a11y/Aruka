import { readFile } from "node:fs/promises";

const files = {
  EmptyState: "src/components/EmptyState.jsx",
  AlunosList: "src/features/alunos/components/AlunosList.jsx",
  AlunosTable: "src/features/alunos/components/AlunosTable.jsx",
  AlunosEmptyState: "src/features/alunos/components/AlunosEmptyState.jsx",
  TreinosCards: "src/features/treinos/components/TreinosCards.jsx",
  TreinosEmptyState: "src/features/treinos/components/TreinosEmptyState.jsx",
  FinanceiroTable: "src/features/financeiro/components/FinanceiroTable.jsx",
  FinanceiroMobileCards: "src/features/financeiro/components/FinanceiroMobileCards.jsx",
  FinanceiroEmptyState: "src/features/financeiro/components/FinanceiroEmptyState.jsx",
  AvaliacoesEmptyState: "src/features/avaliacoes/components/AvaliacoesEmptyState.jsx",
};

const source = Object.fromEntries(
  await Promise.all(
    Object.entries(files).map(async ([name, file]) => [name, await readFile(file, "utf8")])
  )
);

const checks = [
  ["shared EmptyState has polite status", /role="status" aria-live="polite"/.test(source.EmptyState)],
  ["Alunos desktop passes total and filters", /hasActiveFilters=\{hasActiveFilters\}/.test(source.AlunosTable)],
  ["Alunos mobile contextual no-results copy", /Nenhum aluno encontrado para os filtros atuais/.test(source.AlunosList)],
  ["Alunos empty state separates filters", /hasActiveFilters && totalAlunos > 0/.test(source.AlunosEmptyState)],
  ["Alunos loading remains distinct", /Carregando alunos/.test(source.AlunosTable) && /Carregando alunos/.test(source.AlunosList)],
  ["Treinos loading returns before empty", /if \(carregando\)[\s\S]*if \(treinos\.length === 0\)/.test(source.TreinosCards)],
  ["Treinos empty has CTA", /Criar primeiro treino/.test(source.TreinosEmptyState) && /Usar modelo rapido/.test(source.TreinosEmptyState)],
  ["Financeiro table loading before empty", /carregando[\s\S]*LoadingState[\s\S]*registros\.length === 0/.test(source.FinanceiroTable)],
  ["Financeiro mobile loading before empty", /carregando \?[\s\S]*Carregando financeiro[\s\S]*registros\.length === 0/.test(source.FinanceiroMobileCards)],
  ["Financeiro empty contextual copy", /Ajuste os filtros/.test(source.FinanceiroEmptyState)],
  ["Avaliacoes dedicated contextual empty states", /Nenhum resultado encontrado/.test(source.AvaliacoesEmptyState)],
];

let failed = false;
for (const [label, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"} ${label}`);
  if (!ok) failed = true;
}

if (failed) process.exit(1);
