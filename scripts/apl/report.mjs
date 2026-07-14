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

function topRowsFromCounts(counts, label, limit = 10) {
  return Object.entries(counts ?? {})
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, count]) => ({ [label]: name, Findings: count }));
}

function groupedSummary(findings, label, keyFactory) {
  const counts = {};
  for (const finding of findings) {
    const key = keyFactory(finding);
    if (!key) continue;
    counts[key] = (counts[key] ?? 0) + 1;
  }
  const rows = topRowsFromCounts(counts, label, 999);
  return rows.length ? markdownTable(rows) : "Nenhuma ocorrencia.";
}

function bar(label, value, max) {
  const size = max ? Math.max(1, Math.round((value / max) * 24)) : 0;
  return `${label.padEnd(12)} ${"#".repeat(size)} ${value}`;
}

function asciiChart(counts) {
  const rows = [
    ["BLOCKERS", counts.blocker ?? 0],
    ["ERRORS", counts.error ?? 0],
    ["WARNINGS", counts.warning ?? 0],
    ["SUGGESTIONS", counts.suggestion ?? 0],
    ["INFO", counts.info ?? 0],
  ];
  const max = Math.max(...rows.map(([, value]) => value), 0);
  return ["```text", ...rows.map(([label, value]) => bar(label, value, max)), "```"].join("\n");
}

function topFindings(findings, severity, limit = 10) {
  const items = findings.filter((finding) => finding.severity === severity && !finding.suppressed).slice(0, limit);
  return items.length ? items.map((finding) => findingLines(finding)).join("\n\n") : "Nenhuma ocorrencia.";
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
  const mostViolatedRules = topRowsFromCounts(result.statistics.rules?.findingsByRule, "Rule");
  const topFiles = topRowsFromCounts(result.statistics.findings?.byFile, "File");
  const calibration = result.calibration;
  const calibratedStats = result.statistics.calibration ?? {};
  const executive = calibration?.summary;
  const trend = calibration?.baseline?.trend;
  const baseline = calibration?.baseline;

  return [
    "# AQA Audit Report",
    "",
    "## Executive Summary",
    "",
    executive
      ? [
          `- Version: ${executive.version}`,
          `- Result: ${result.status}`,
          `- BLOCKERS: ${executive.blockers}`,
          `- ERRORS: ${executive.errors}`,
          `- WARNINGS: ${executive.warnings}`,
          `- SUGGESTIONS: ${executive.suggestions}`,
          `- INFO: ${executive.info}`,
          `- Duplicates removidos: ${executive.duplicatesRemoved}`,
          `- Findings suprimidos: ${executive.suppressedCount}`,
          `- Root Causes: ${executive.rootCauses}`,
          `- Confidence media: ${executive.averageConfidence}%`,
          `- Modelo mais critico: ${executive.mostCriticalModel}`,
          `- Regra mais violada: ${executive.mostViolatedRule}`,
          `- Sprint mais critica: ${executive.mostCriticalSprint}`,
        ].join("\n")
      : "Calibration desabilitada.",
    "",
    "## Calibration Chart",
    "",
    asciiChart(result.statistics.findings?.bySeverity ?? {}),
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
    "## Baseline",
    "",
    baseline
      ? [
          `- Arquivo: ${baseline.baselinePath}`,
          `- Findings anterior: ${trend.previousTotal}`,
          `- Findings atual: ${trend.currentTotal}`,
          `- Delta findings: ${trend.findingsDelta >= 0 ? "+" : ""}${trend.findingsDelta}`,
          `- Delta BLOCKERS: ${trend.blockersDelta >= 0 ? "+" : ""}${trend.blockersDelta}`,
          `- Delta ERRORS: ${trend.errorsDelta >= 0 ? "+" : ""}${trend.errorsDelta}`,
          `- Delta WARNINGS: ${trend.warningsDelta >= 0 ? "+" : ""}${trend.warningsDelta}`,
          `- Delta SUGGESTIONS: ${trend.suggestionsDelta >= 0 ? "+" : ""}${trend.suggestionsDelta}`,
        ].join("\n")
      : "Baseline desabilitada.",
    "",
    "## Categories",
    "",
    calibratedStats.byCategory ? markdownTable(topRowsFromCounts(calibratedStats.byCategory, "Category", 999)) : "Nenhuma categoria.",
    "",
    "## Confidence",
    "",
    calibratedStats.byConfidence ? markdownTable(topRowsFromCounts(calibratedStats.byConfidence, "Confidence", 999)) : "Nenhum confidence.",
    "",
    "## Root Causes",
    "",
    groupedSummary(displayedFindings.filter((finding) => !finding.isCascadeChild), "Root Cause", (finding) => finding.rootCauseMessage),
    "",
    "## Top BLOCKERS",
    "",
    topFindings(displayedFindings, SEVERITIES.BLOCKER),
    "",
    "## Top ERRORS",
    "",
    topFindings(displayedFindings, SEVERITIES.ERROR),
    "",
    "## Top WARNINGS",
    "",
    topFindings(displayedFindings, SEVERITIES.WARNING),
    "",
    "## Top SUGGESTIONS",
    "",
    topFindings(displayedFindings, SEVERITIES.SUGGESTION),
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
    "## Findings By Rule",
    "",
    groupedSummary(displayedFindings, "Rule", (finding) => finding.ruleId),
    "",
    "## Findings By Sprint",
    "",
    groupedSummary(displayedFindings, "Sprint", (finding) => finding.sprint),
    "",
    "## Findings By Block",
    "",
    groupedSummary(displayedFindings, "Block", (finding) => finding.block),
    "",
    "## Findings By File",
    "",
    groupedSummary(displayedFindings, "File", (finding) => finding.file),
    "",
    "## Findings By Model",
    "",
    groupedSummary(displayedFindings, "Model", (finding) => finding.modelCode),
    "",
    "## Most Violated Rules",
    "",
    mostViolatedRules.length ? markdownTable(mostViolatedRules) : "Nenhuma ocorrencia.",
    "",
    "## Top 10 Files",
    "",
    topFiles.length ? markdownTable(topFiles) : "Nenhuma ocorrencia.",
    "",
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
