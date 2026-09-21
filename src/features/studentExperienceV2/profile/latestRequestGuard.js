export function createLatestRequestGuard() {
  let version = 0;
  return {
    start() { version += 1; return version; },
    invalidate() { version += 1; },
    isCurrent(candidate) { return candidate === version; },
  };
}
