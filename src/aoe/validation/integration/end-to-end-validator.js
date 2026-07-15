export function validateEndToEndReport(report) {
  return { valid: report?.failed === 0, checks: [{ name: "end-to-end report has zero failures", passed: report?.failed === 0, blocking: true }] };
}
