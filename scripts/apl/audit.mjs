import { ROOT_DOCS, ROOT_REPORTS, SUPPORTED_SPRINTS, VERSION } from "./config.mjs";
import { runAudit } from "./engine.mjs";
import { saveMarkdownReport, printConsoleReport } from "./report.mjs";
import { error, info, section, success } from "./utils/logger.mjs";

function parseArgs(args) {
  const sprintArg = args.find((arg) => arg.startsWith("--sprint="));
  const sprint = sprintArg ? Number(sprintArg.split("=")[1]) : null;

  if (sprint && !SUPPORTED_SPRINTS.includes(sprint)) {
    throw new Error(`Sprint nao suportada: ${sprint}`);
  }

  return {
    sprint,
    scope: sprint ? `sprint${String(sprint).padStart(2, "0")}` : "all",
  };
}

async function main() {
  const started = performance.now();
  const args = parseArgs(process.argv.slice(2));

  section("Aruka Quality Assurance");
  info(`Versao ${VERSION}`);

  const audit = await runAudit({
    rootDocs: ROOT_DOCS,
    rootReports: ROOT_REPORTS,
    version: VERSION,
    scope: args.scope,
    sprint: args.sprint,
  });

  const reportPath = await saveMarkdownReport(audit, ROOT_REPORTS);
  const elapsedMs = Math.round(performance.now() - started);

  printConsoleReport(audit, elapsedMs);
  success(`Relatorio salvo em ${reportPath}`);
}

main().catch((err) => {
  error(err.message);
  process.exitCode = 1;
});
