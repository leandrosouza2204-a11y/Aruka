import { readFileSync } from "node:fs";

const app = read("src/App.jsx");
const professionalRoute = read("src/auth/ProfessionalRoute.jsx");
const professionalAccess = read("src/auth/professionalAccess.js");
const page = read("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx");
const sidebar = read("src/components/Sidebar.jsx");
const mobileNav = read("src/components/MobileBottomNavigation.jsx");
const constants = read("src/features/gestaoInteligente/constants/transferRuleTypes.js");

assertIncludes(app, 'path="/gestao-inteligente"', "Route /gestao-inteligente is registered.");
assertIncludes(app, "<ProtectedRoute>", "Route tree uses ProtectedRoute.");
assertIncludes(app, "<SubscriptionRoute>", "Route tree uses SubscriptionRoute.");
assertIncludes(app, "<LegalRoute>", "Route tree uses LegalRoute.");
assertIncludes(app, "<ProfessionalRoute>", "Route tree uses ProfessionalRoute.");
assertIncludes(professionalRoute, "isProfessionalProfile(perfil)", "ProfessionalRoute uses the shared professional access rule.");
assertIncludes(professionalAccess, 'profile.role === "user"', "Professional access rule requires professional profile role.");
assertIncludes(professionalRoute, 'to="/minha-area"', "ProfessionalRoute redirects non-professional users away from professional module.");
assertIncludes(page, "data-testid=\"smart-management-page\"", "Foundation page has a stable test id.");
assertIncludes(page, "Gestão Inteligente", "Foundation page names the module with pt-BR copy.");
assertIncludes(page, "Locais de atendimento", "Foundation page exposes the locations workflow.");
assertIncludes(sidebar, 'to="/gestao-inteligente"', "Desktop navigation links the module.");
assertIncludes(mobileNav, 'to="/gestao-inteligente"', "Mobile More menu links the module.");
assertIncludes(constants, "SMART_MANAGEMENT_TRANSFER_RULE_TYPES", "Transfer rule types are centralized.");

console.log("PASS smart-management-foundation");

function read(path) {
  return readFileSync(path, "utf8");
}

function assertIncludes(source, expected, message) {
  if (!source.includes(expected)) {
    throw new Error(`${message} Missing: ${expected}`);
  }
}
