export function createNoOpLogger() {
  return { debug() {}, info() {}, warn() {}, error() {} };
}
