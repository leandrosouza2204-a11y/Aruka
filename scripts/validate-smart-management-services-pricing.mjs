import { readFileSync } from "node:fs";

const page = readFileSync("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx", "utf8");
const service = readFileSync("src/services/smartManagementService.js", "utf8");
const utils = readFileSync("src/features/gestaoInteligente/utils/servicesPricing.js", "utf8");

for (const expected of ["Serviços & Precificação", "Tabela de preços", "Cadastrar serviço", "Editar", "Arquivar", "Reativar", "Tentar novamente", "Carregando tabela de preços"]) assertIncludes(page, expected);
for (const model of ["PER_SESSION", "PER_STUDENT_SESSION", "MONTHLY_PACKAGE", "FIXED_PACKAGE"]) assertIncludes(utils, model);
for (const type of ["personal_training", "online_coaching", "assessment", "other"]) assertIncludes(utils, type);
for (const field of ["sessionsPerWeek", "sessionsInPackage", "sessionDurationMinutes", "minStudents", "maxStudents"]) assertIncludes(page + utils + service, field);
assertIncludes(service, 'rpc("save_smart_management_service"');
if ((page + service).toLowerCase().includes("financeiro")) throw new Error("Finance integration is out of scope for services pricing.");

console.log("SMART_MANAGEMENT_SERVICES_PRICING=PASS");

function assertIncludes(source, expected) {
  if (!source.includes(expected)) throw new Error(`Missing expected contract: ${expected}`);
}
