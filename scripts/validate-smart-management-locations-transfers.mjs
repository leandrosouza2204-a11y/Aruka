import { readFileSync } from "node:fs";

const read = (file) => readFileSync(file, "utf8");
const page = read("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx");
const service = read("src/services/smartManagementService.js");
const migration = read("supabase/migrations/20260908120000_smart_management_locations_transfers.sql");
for (const type of ["none", "fixed", "per_student", "tiered", "percentage"]) if (!page.includes(type)) throw new Error(`Transfer type missing from UI: ${type}`);
for (const expected of ["Adicionar local", "Editar", "Arquivar", "Reativar", "Tentar novamente", "Salvando..."]) if (!page.includes(expected)) throw new Error(`Workflow state missing: ${expected}`);
if (!service.includes('rpc("save_smart_management_location"')) throw new Error("Location save must use the atomic RPC.");
for (const expected of ["transfer tiers cannot overlap", "security invoker", "p_tiers"]) if (!migration.includes(expected)) throw new Error(`Atomic persistence contract missing: ${expected}`);
if (page.includes("financeiro".toLowerCase()) || service.includes("financeiro".toLowerCase())) throw new Error("Finance integration is out of scope.");
console.log("SMART_MANAGEMENT_LOCATIONS_TRANSFERS=PASS");
