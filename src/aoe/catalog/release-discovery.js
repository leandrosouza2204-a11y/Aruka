import fs from "node:fs";
import path from "node:path";

const REQUIRED_SUFFIXES = ["README.md", "_FREEZE.md", "_RELEASE_NOTES.md", "_CHANGELOG.md", "_MANIFEST.md"];

export function discoverAPLReleases({ projectRoot = process.cwd(), releasesRoot = "docs/apl/RELEASES" } = {}) {
  const absoluteRoot = path.resolve(projectRoot, releasesRoot);
  if (!fs.existsSync(absoluteRoot)) return [];
  return fs.readdirSync(absoluteRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^SPRINT_\d+$/i.test(entry.name))
    .map((entry) => {
      const absolutePath = path.join(absoluteRoot, entry.name);
      const files = fs.readdirSync(absolutePath);
      const missing = REQUIRED_SUFFIXES.filter((suffix) => suffix === "README.md"
        ? !files.includes("README.md")
        : !files.some((file) => file.endsWith(suffix)));
      return {
        releaseId: entry.name.toUpperCase(),
        absolutePath,
        relativePath: path.relative(projectRoot, absolutePath).replace(/\\/g, "/"),
        candidate: missing.length === 0,
        missing,
      };
    })
    .sort((a, b) => a.releaseId.localeCompare(b.releaseId));
}
