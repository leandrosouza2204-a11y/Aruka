import { readFileSync } from "node:fs";

const engine = readFileSync("src/features/gestaoInteligente/utils/profitabilityEngine.js", "utf8");
const panel = readFileSync("src/features/gestaoInteligente/components/ProfitabilityPanel.jsx", "utf8");
const docs = readFileSync("docs/product-roadmap-v4-cycle-11-smart-management/05-profitability-engine.md", "utf8");

for (const expected of ["grossRevenue", "transferAmount", "netAfterTransfer", "grossHourlyRate", "netHourlyRate", "grossPerStudent", "netPerStudent", "BRL_CENTS", "52 / 12"]) {
  if (!engine.includes(expected)) throw new Error(`Missing profitability contract: ${expected}`);
}
for (const model of ["PER_SESSION", "PER_STUDENT_SESSION", "MONTHLY_PACKAGE", "FIXED_PACKAGE"]) if (!engine.includes(model)) throw new Error(`Missing pricing model: ${model}`);
for (const rule of ["none", "fixed", "per_student", "tiered", "percentage"]) if (!engine.includes(`\"${rule}\"`)) throw new Error(`Missing transfer rule: ${rule}`);
if (/react|supabase/i.test(engine)) throw new Error("The calculation engine must remain pure and infrastructure-independent.");
if (/ranking|recomenda[cç][aã]o|financeiro/i.test(panel)) throw new Error("Stage 11.4 must not add ranking, recommendations or Financeiro integration.");
if (!docs.includes("SUPABASE CHANGE: NO") || !docs.includes("CALCULATED_ONLY")) throw new Error("The calculated-only storage decision must be documented.");
console.log("SMART_MANAGEMENT_PROFITABILITY_ENGINE=PASS");
