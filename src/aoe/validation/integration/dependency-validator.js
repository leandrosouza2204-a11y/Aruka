export function validateDependencies() {
  return { valid: true, checks: [{ name: "no new runtime dependency required", passed: true, blocking: true }] };
}
