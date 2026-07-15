#!/usr/bin/env node
import { listReasonCodes, validateReasonCatalog } from "../../src/aoe/explainability/index.js";

const reasons = listReasonCodes();
const validation = validateReasonCatalog();
if (process.argv.includes("--json")) {
  console.log(JSON.stringify({ validation, reasons }, null, 2));
} else {
  for (const reason of reasons) {
    console.log(`${reason.code} | ${reason.category} | ${reason.severity} | ${reason.title}`);
  }
  console.log(`total: ${reasons.length}`);
  console.log(`valid: ${validation.valid}`);
}
process.exit(validation.valid ? 0 : 1);
