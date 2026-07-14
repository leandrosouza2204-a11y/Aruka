import path from "node:path";
import { DEFAULT_REPORT_FORMAT, ROOT_REPORTS, VERSION } from "./config.mjs";
import { filterFindingsForDisplay } from "./engine.mjs";
import { write } from "./utils/files.mjs";
import { info, summary } from "./utils/logger.mjs";
import { SEVERITIES } from "./rules/rule-contract.mjs";

function sanitizeFilePart(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function reportBaseName(result, options = {}) {
  const target = sanitizeFilePart(result.target || "all") || "all";
  const rules = options.ruleIds?.length ? `-${sanitizeFilePart(options.ruleIds.join("-"))}` : "";
  return `${target}${rules}-report`;
}

function markdownTable(rows) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const header = `| ${headers.join(" | ")} |`;
  const separator = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${headers.map((key) => row[key] ?? "").join(" | ")} |`);
  return [header, separator, ...body].join("\n");
}

function findingLines(finding) {
  const fields = [
    ["Regra", finding.ruleId],
    ["Arquivo", finding.file],
    ["Sprint", finding.sprint],
    ["Bloco", finding.block],
    ["Modelo", finding.modelCode],
    ["Secao", finding.section],
    ["Linha", finding.line],
    ["Mensagem", finding.message],
    ["Sugestao", finding.suggestion],
    ["Trecho", finding.excerpt],
  ].filter(([, value]) => value !== undefined && value !== "");

  return fields.map(([label, value]) => `- ${label}: ${String(value).replace(/\n/g, " ")}`).join("\n");
}

function findingsSection(title, findings) {
  if (!findings.length) return [`### ${title}`, "", "Nenhuma ocorrencia.", ""].join("\n");
  return [
    `### ${title}`,
    "",
    ...findings.map((finding) => `${findingLines(finding)}\n`),
  ].join("\n");
}

export function createMarkdownReport(result, options = {}) {
  const displayedFindings = filterFindingsForDisplay(result.findings, options.minSeverity);
  const bySeverity = Object.values(SEVERITIES).map((severity) => ({
    Severity: severity,
    Count: result.statistics.findings?.bySeverity?.[severity] ?? 0,
  }));
  const rules = result.ruleRuns.length
    ? result.ruleRuns.map((rule) => ({
        Rule: rule.id,
        Severity: rule.severity,
        Scope: rule.scope,
        Findings: rule.findings,
        Duration: `${rule.durationMs}ms`,
      }))
    : [{ Rule: "Nenhuma regra executada", Severity: "", Scope: "", Findings: 0, Duration: "0ms" }];
  const diagnostics = result.diagnostics.length
    ? result.diagnostics.map((item) => `- ${item.severity}: ${item.message}`).join("\n")
    : "Nenhum diagnostico.";
  const performance = result.ruleRuns.length
    ? result.ruleRuns.map((rule) => `- ${rule.id}: ${rule.durationMs}ms`).join("\n")
    : "Nenhuma regra executada.";

  return [
    "# AQA Audit Report",
    "",
    "## Summary",
    "",
    `- Version: ${result.version ?? VERSION}`,
    `- Target: ${result.target}`,
    `- Status: ${result.status}`,
    `- Exit code: ${result.exitCode}`,
    `- Started: ${result.startedAt}`,
    `- Finished: ${result.finishedAt}`,
    `- Duration: ${result.durationMs}ms`,
    `- Files scanned: ${result.filesScanned}`,
    `- Documents parsed: ${result.documentsParsed}`,
    `- Rules loaded: ${result.rulesLoaded}`,
    `- Rules executed: ${result.rulesExecuted}`,
    "",
    "## Findings Summary",
    "",
    markdownTable(bySeverity),
    "",
    "## Rules",
    "",
    markdownTable(rules),
    "",
    "## Findings",
    "",
    findingsSection("Fatal", displayedFindings.filter((finding) => finding.severity === SEVERITIES.FATAL)),
    findingsSection("Errors", displayedFindings.filter((finding) => finding.severity === SEVERITIES.ERROR)),
    findingsSection("Warnings", displayedFindings.filter((finding) => finding.severity === SEVERITIES.WARNING)),
    findingsSection("Information", displayedFindings.filter((finding) => finding.severity === SEVERITIES.INFO)),
    "## Diagnostics",
    "",
    diagnostics,
    "",
    "## Performance",
    "",
    performance,
    "",
  ].join("\n");
}

export function createJsonReport(result) {
  return JSON.stringify(result, null, 2);
}

export function printConsoleReport(result) {
  summary({
    Versao: result.version ?? VERSION,
    Alvo: result.target,
    Status: result.status,
    "Exit code": result.exitCode,
    Arquivos: result.filesScanned,
    Documentos: result.documentsParsed,
    "Regras carregadas": result.rulesLoaded,
    "Regras executadas": result.rulesExecuted,
    "Tempo total": `${result.durationMs}ms`,
  });

  if (result.rulesExecuted === 0) info("Nenhuma regra carregada para execucao.");
}

export async function saveReports(result, options = {}) {
  if (options.noReport) return [];

  const format = options.reportFormat ?? DEFAULT_REPORT_FORMAT;
  const reportRoot = options.rootReports ?? ROOT_REPORTS;
  const base = reportBaseName(result, options);
  const reports = [];

  if (format === "markdown" || format === "both") {
    const reportPath = path.resolve(reportRoot, `${base}.md`);
    await write(reportPath, createMarkdownReport(result, options));
    reports.push(reportPath);
  }

  if (format === "json" || format === "both") {
    const reportPath = path.resolve(reportRoot, `${base}.json`);
    await write(reportPath, createJsonReport(result));
    reports.push(reportPath);
  }

  return reports;
}
