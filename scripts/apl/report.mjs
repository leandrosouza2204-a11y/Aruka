import path from "node:path";
import { ROOT_REPORTS, VERSION } from "./config.mjs";
import { write } from "./utils/files.mjs";
import { info, summary } from "./utils/logger.mjs";

function formatDate(date) {
  return date.toISOString();
}

export function createMarkdownReport(audit) {
  const { context, result } = audit;

  return [
    "# AQA Audit Report",
    "",
    `Data: ${formatDate(result.finishedAt)}`,
    `Versao: ${context.version ?? VERSION}`,
    `Quantidade de arquivos: ${result.fileCount}`,
    `Quantidade de Sprints: ${result.sprintCount}`,
    "",
    "Nenhuma regra executada.",
    "",
  ].join("\n");
}

export function printConsoleReport(audit, elapsedMs) {
  const { context, result } = audit;

  summary({
    Versao: context.version ?? VERSION,
    Arquivos: result.fileCount,
    Sprints: result.sprintCount,
    "Regras carregadas": result.rulesLoaded,
    "Tempo total": `${elapsedMs}ms`,
  });

  info("Nenhuma regra carregada.");
}

export async function saveMarkdownReport(audit, reportRoot = ROOT_REPORTS) {
  const reportPath = path.resolve(reportRoot, "audit-report.md");
  await write(reportPath, createMarkdownReport(audit));
  return reportPath;
}
