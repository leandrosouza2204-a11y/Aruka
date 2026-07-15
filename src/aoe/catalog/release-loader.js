import fs from "node:fs";
import path from "node:path";
import { AOEReleaseDiscoveryError } from "./catalog-errors.js";

function findFile(dir, suffix) {
  const files = fs.readdirSync(dir);
  return suffix === "README.md" ? files.find((file) => file === "README.md") : files.find((file) => file.endsWith(suffix));
}

export function loadReleaseDocuments(release) {
  const required = {
    readmePath: "README.md",
    freezePath: "_FREEZE.md",
    releaseNotesPath: "_RELEASE_NOTES.md",
    changelogPath: "_CHANGELOG.md",
    manifestPath: "_MANIFEST.md",
  };
  const paths = {};
  for (const [key, suffix] of Object.entries(required)) {
    const file = findFile(release.absolutePath, suffix);
    if (!file) throw new AOEReleaseDiscoveryError(`Release document missing: ${suffix}`, { releaseId: release.releaseId });
    paths[key] = path.join(release.absolutePath, file);
  }
  return {
    ...release,
    ...paths,
    readme: fs.readFileSync(paths.readmePath, "utf8"),
    freeze: fs.readFileSync(paths.freezePath, "utf8"),
    releaseNotes: fs.readFileSync(paths.releaseNotesPath, "utf8"),
    changelog: fs.readFileSync(paths.changelogPath, "utf8"),
    manifest: fs.readFileSync(paths.manifestPath, "utf8"),
  };
}
