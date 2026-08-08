import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const trackedFiles = execFileSync("git", ["ls-files", "src"], { encoding: "utf8" })
  .trim()
  .split(/\r?\n/)
  .filter(Boolean);

const riskyFallback = /<Suspense\b[^>]*fallback=\{(?:null|undefined|<>\s*<\/>|<Fragment\s*\/>)\}/g;
const failures = [];
let visibleFallbackCount = 0;

for (const file of trackedFiles) {
  const source = readFileSync(file, "utf8");
  if (!source.includes("Suspense")) continue;

  const riskyMatches = [...source.matchAll(riskyFallback)];
  for (const match of riskyMatches) {
    const line = source.slice(0, match.index).split(/\r?\n/).length;
    failures.push(`${file}:${line} empty Suspense fallback`);
  }

  const visibleMatches = [...source.matchAll(/<Suspense\b[^>]*fallback=\{<LoadingFallback\b/g)];
  visibleFallbackCount += visibleMatches.length;
}

if (failures.length > 0) {
  console.error("Visible Suspense fallback validation failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

if (visibleFallbackCount === 0) {
  console.error("Visible Suspense fallback validation failed: no LoadingFallback usage found.");
  process.exit(1);
}

console.log(`PASS visible Suspense fallbacks found: ${visibleFallbackCount}.`);
