import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import test from "node:test";

const root = process.cwd();

const canonicalReports = [
  "reports/product-roadmap-v3/cycle-01-runtime-qa-result.json",
  "reports/supabase-ci/ci-static-result.json",
  "reports/supabase-ci/ci-static-summary.md",
  "reports/supabase-ci/repository-safety-result.json",
  "reports/supabase-ci/repository-safety-summary.md",
];

function runNode(args, options = {}) {
  return spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, ...options.env },
    timeout: 120000,
  });
}

function readReports() {
  return new Map(canonicalReports.map((file) => [file, readFileSync(file)]));
}

function assertReportsUnchanged(before) {
  for (const [file, content] of before) {
    assert.deepEqual(readFileSync(file), content, `${file} should not change`);
  }
}

function changedReportFiles() {
  return execFileSync("git", ["diff", "--name-only", "--", ...canonicalReports], {
    cwd: root,
    encoding: "utf8",
  })
    .trim()
    .split(/\r?\n/)
    .filter(Boolean);
}

test("affected validators do not write canonical reports by default", () => {
  const before = readReports();

  const safety = runNode(["scripts/validate-ci-repository-safety.mjs"]);
  assert.equal(safety.status, 0, safety.stderr || safety.stdout);
  assert.match(safety.stdout, /REPORT_WRITE=SKIPPED/);

  const statics = runNode(["scripts/validate-supabase-ci-static.mjs"]);
  assert.equal(statics.status, 0, statics.stderr || statics.stdout);
  assert.match(statics.stdout, /REPORT_WRITE=SKIPPED/);

  const runtime = runNode(["scripts/validate-authenticated-runtime-precheck.mjs"], {
    env: {
      ARUKA_QA_BASE_URL: "http://127.0.0.1:9",
      ARUKA_QA_CDP_URL: "http://127.0.0.1:9",
    },
  });
  assert.notEqual(runtime.status, 0);
  assert.match(runtime.stdout, /REPORT_WRITE=SKIPPED/);

  assertReportsUnchanged(before);
  assert.deepEqual(changedReportFiles(), []);
});

test("write-report mode preserves canonical JSON and markdown formats", () => {
  const before = readReports();
  try {
    const result = runNode(["scripts/validate-supabase-ci-static.mjs", "--write-report"]);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /REPORT_WRITE=CANONICAL/);

    const json = JSON.parse(readFileSync("reports/supabase-ci/ci-static-result.json", "utf8"));
    assert.equal(json.cycle, "9");
    assert.equal(json.result, "CI_STATIC_VALIDATED");
    assert.equal(Array.isArray(json.errors), true);

    const summary = readFileSync("reports/supabase-ci/ci-static-summary.md", "utf8");
    assert.match(summary, /^# CI Static Validation/m);
    assert.match(summary, /- Result: CI_STATIC_VALIDATED/);
  } finally {
    for (const [file, content] of before) {
      writeFileSync(file, content);
    }
  }
});
