export const WRITE_REPORT_FLAG = "--write-report";

export function shouldWriteCanonicalReport(argv = process.argv.slice(2)) {
  return argv.includes(WRITE_REPORT_FLAG);
}

export function printReportWriteMode(writeReport) {
  console.log(`REPORT_WRITE=${writeReport ? "CANONICAL" : "SKIPPED"}`);
}
