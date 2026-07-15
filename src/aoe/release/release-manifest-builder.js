import os from "node:os";
import { getReleaseIdentity } from "./release-version.js";

export function buildReleaseManifest({ checksums = [], catalog = {}, tests = {}, readiness = {} } = {}) {
  return {
    identity: getReleaseIdentity(),
    generatedAt: "2026-07-15T00:00:00.000Z",
    environment: {
      node: process.version,
      platform: os.platform(),
      arch: os.arch(),
      memory: os.totalmem(),
    },
    components: getReleaseIdentity(),
    checksums,
    apl: catalog,
    tests,
    result: readiness.status ?? "NOT_READY",
  };
}
