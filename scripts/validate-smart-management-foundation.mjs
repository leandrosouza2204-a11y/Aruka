import { readFileSync } from "node:fs";

const app = read("src/App.jsx");
const professionalRoute = read("src/auth/ProfessionalRoute.jsx");
const page = read("src/features/gestaoInteligente/components/SmartManagementFoundationPage.jsx");
const sidebar = read("src/components/Sidebar.jsx");
const mobileNav = read("src/components/MobileBottomNavigation.jsx");
const constants = read("src/features/gestaoInteligente/constants/transferRuleTypes.js");

assertIncludes(app, 'path="/gestao-inteligente"', "Route /gestao-inteligente is registered.");
assertIncludes(app, "<ProtectedRoute>", "Route tree uses ProtectedRoute.");
assertIncludes(app, "<SubscriptionRoute>", "Route tree uses SubscriptionRoute.");
assertIncludes(app, "<LegalRoute>", "Route tree uses LegalRoute.");
assertIncludes(app, "<ProfessionalRoute>", "Route tree uses ProfessionalRoute.");
assertIncludes(professionalRoute, 'perfil?.role === "user"', "ProfessionalRoute requires professional profile role.");
assertIncludes(professionalRoute, 'to="/minha-area"', "ProfessionalRoute redirects non-professional users away from professional module.");
assertIncludes(page, "data-testid=\"smart-management-page\"", "Foundation page has a stable test id.");
assertIncludes(page, "Gestao Inteligente", "Foundation page names the module.");
assertIncludes(page, "Stage 11.2", "Foundation page does not pretend Stage 11.2 is implemented.");
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
