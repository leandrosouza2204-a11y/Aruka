export function createNoOpMetrics() {
  return { increment() {}, observe() {}, gauge() {} };
}
