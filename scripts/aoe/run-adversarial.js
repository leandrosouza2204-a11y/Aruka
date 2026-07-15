#!/usr/bin/env node
import fs from "node:fs";
import { runAdversarialSuite } from "../../src/aoe/validation/adversarial/adversarial-runner.js";

const result = runAdversarialSuite();
fs.mkdirSync("reports/aoe", { recursive: true });
fs.writeFileSync("reports/aoe/adversarial-report.json", JSON.stringify(result, null, 2));
fs.writeFileSync("reports/aoe/adversarial-report.md", `# AOE Adversarial Report\n\n- Total: ${result.total}\n- Passed: ${result.passed}\n- Failed: ${result.failed.length}\n\n${result.results.map((item) => `- ${item.id}: ${item.passed ? "PASS" : "FAIL"} (${item.status})`).join("\n")}\n`);
console.log(`adversarial: ${result.passed}/${result.total}`);
process.exit(result.failed.length ? 1 : 0);
